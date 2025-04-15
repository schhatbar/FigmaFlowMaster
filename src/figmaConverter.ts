import { handleError } from './errorHandler';

/**
 * Converts a parsed SVG structure to a Figma flowchart
 * @param parsedSvg The parsed SVG data
 */
export async function svgToFigmaFlowchart(parsedSvg: any): Promise<void> {
  try {
    console.log('Starting SVG to Figma conversion with data:', JSON.stringify(parsedSvg).substring(0, 200) + '...');
    
    // Check if parsedSvg has the expected structure
    if (!parsedSvg || !parsedSvg.elements || !Array.isArray(parsedSvg.elements)) {
      throw new Error('Invalid SVG data structure. Missing elements array.');
    }
    
    // Load fonts first to ensure text elements render properly
    console.log('Loading fonts...');
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    await figma.loadFontAsync({ family: "Inter", style: "Medium" });
    console.log('Fonts loaded successfully');
    
    // Calculate scale factors
    console.log('Calculating scale factors...');
    const scale = calculateScale(parsedSvg.viewBox);
    console.log('Scale factors:', scale);
    
    // Create nodes
    console.log('Creating Figma nodes from', parsedSvg.elements.length, 'SVG elements...');
    const figmaNodes = await createFigmaNodes(parsedSvg.elements, scale);
    console.log('Created', Object.keys(figmaNodes).length, 'Figma nodes');
    
    // Create connections between nodes
    console.log('Creating connections...');
    await createConnections(figmaNodes, parsedSvg.elements);
    console.log('Connections created');
    
    // Select all created nodes
    const nodeValues = Object.values(figmaNodes);
    console.log('Selecting', nodeValues.length, 'nodes');
    if (nodeValues.length > 0) {
      figma.currentPage.selection = nodeValues;
      
      // Zoom to fit the created nodes
      console.log('Zooming to fit');
      figma.viewport.scrollAndZoomIntoView(nodeValues);
    }
    
    console.log('SVG to Figma conversion completed successfully');
  } catch (error: unknown) {
    console.error('Error converting to Figma flowchart:', error);
    if (error instanceof Error) {
      throw new Error(`Error converting to Figma flowchart: ${error.message}`);
    } else {
      throw new Error('Error converting to Figma flowchart: Unknown error');
    }
  }
}

/**
 * Calculates scale factors for converting from SVG coordinates to Figma
 */
function calculateScale(viewBox: any): { x: number, y: number } {
  // For simplicity, we'll use a 1:1 mapping, but this could be adjusted
  // if we need to scale the flowchart differently
  return { x: 1, y: 1 };
}

/**
 * Creates Figma nodes from SVG elements
 */
async function createFigmaNodes(
  elements: any[], 
  scale: { x: number, y: number }
): Promise<{ [id: string]: SceneNode }> {
  const figmaNodes: { [id: string]: SceneNode } = {};
  
  // Process elements
  for (const element of elements) {
    // Skip elements that are likely to be connectors
    if (isConnector(element)) continue;
    
    try {
      const node = await createFigmaNode(element, scale);
      if (node) {
        figmaNodes[element.id] = node;
      }
    } catch (error) {
      console.warn(`Error creating node for element ${element.id}:`, error);
      // Continue with other elements
    }
  }
  
  return figmaNodes;
}

/**
 * Checks if an element is likely to be a connector rather than a node
 */
function isConnector(element: any): boolean {
  // Lines are almost always connectors
  if (element.type === 'line') return true;
  
  // Paths and polylines with "none" fill are likely connectors
  if ((element.type === 'path' || element.type === 'polyline') && 
      element.fill === 'none') {
    return true;
  }
  
  return false;
}

/**
 * Creates a Figma node from an SVG element
 */
async function createFigmaNode(element: any, scale: { x: number, y: number }): Promise<SceneNode | null> {
  // Scale coordinates
  const x = element.x * scale.x;
  const y = element.y * scale.y;
  const width = element.width * scale.x;
  const height = element.height * scale.y;
  
  let node: SceneNode | null = null;
  
  // Choose the node type based on the SVG element type
  switch (element.type) {
    case 'rect':
      node = figma.createRectangle();
      node.x = x;
      node.y = y;
      node.resize(width, height);
      break;
      
    case 'circle':
      node = figma.createEllipse();
      node.x = x;
      node.y = y;
      node.resize(width, height);
      break;
      
    case 'ellipse':
      node = figma.createEllipse();
      node.x = x;
      node.y = y;
      node.resize(width, height);
      break;
      
    case 'polygon':
      // For polygons, create a shape with a vector network
      const polygon = figma.createPolygon();
      polygon.x = x;
      polygon.y = y;
      polygon.resize(width, height);
      node = polygon;
      break;
      
    case 'path':
      // If the path has a fill, it's likely a shape node
      if (element.fill !== 'none') {
        const shape = figma.createRectangle();  // As a fallback
        shape.x = x;
        shape.y = y;
        shape.resize(width, height);
        node = shape;
      }
      break;
      
    case 'text':
      const text = figma.createText();
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      text.x = x;
      text.y = y;
      text.resize(width, height);
      text.characters = element.text || '';
      node = text;
      break;
      
    case 'group':
      // For groups, create a frame and add children
      const frame = figma.createFrame();
      frame.x = x;
      frame.y = y;
      frame.resize(width, height);
      
      // Process children recursively
      if (element.children && element.children.length > 0) {
        const childNodes = await createFigmaNodes(element.children, scale);
        
        // Add children to the frame
        for (const childNode of Object.values(childNodes)) {
          // Adjust position relative to frame
          childNode.x -= x;
          childNode.y -= y;
          frame.appendChild(childNode);
        }
      }
      
      node = frame;
      break;
  }
  
  // Apply common properties if a node was created
  if (node) {
    // Set name
    node.name = element.id || `${element.type}-node`;
    
    // Apply fills if applicable
    if ('fills' in node && element.fill && element.fill !== 'none') {
      try {
        const rgbColor = parseColor(element.fill);
        node.fills = [{
          type: 'SOLID',
          color: rgbColor,
          opacity: 1
        }];
      } catch (error) {
        console.warn(`Could not apply fill for node ${node.name}:`, error);
      }
    }
    
    // Apply strokes if applicable
    if ('strokes' in node && element.stroke && element.stroke !== 'none') {
      try {
        const rgbColor = parseColor(element.stroke);
        node.strokes = [{
          type: 'SOLID',
          color: rgbColor,
          opacity: 1
        }];
        
        if (element.strokeWidth) {
          node.strokeWeight = element.strokeWidth;
        }
      } catch (error) {
        console.warn(`Could not apply stroke for node ${node.name}:`, error);
      }
    }
  }
  
  return node;
}

/**
 * Parses a color string (hex, rgb, etc.) to RGB components
 */
function parseColor(colorStr: string): { r: number, g: number, b: number } {
  // Default color if parsing fails
  const defaultColor = { r: 0, g: 0, b: 0 };
  
  try {
    // Handle hex format (#RRGGBB)
    if (colorStr.startsWith('#')) {
      const hex = colorStr.slice(1);
      if (hex.length === 6) {
        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;
        return { r, g, b };
      }
      return defaultColor;
    }
    
    // Handle rgb format
    if (colorStr.startsWith('rgb')) {
      const match = colorStr.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
      if (match) {
        const r = parseInt(match[1], 10) / 255;
        const g = parseInt(match[2], 10) / 255;
        const b = parseInt(match[3], 10) / 255;
        return { r, g, b };
      }
      return defaultColor;
    }
    
    // Handle named colors (simplified)
    const namedColors: { [name: string]: { r: number, g: number, b: number } } = {
      black: { r: 0, g: 0, b: 0 },
      white: { r: 1, g: 1, b: 1 },
      red: { r: 1, g: 0, b: 0 },
      green: { r: 0, g: 1, b: 0 },
      blue: { r: 0, g: 0, b: 1 },
      gray: { r: 0.5, g: 0.5, b: 0.5 },
      yellow: { r: 1, g: 1, b: 0 },
      purple: { r: 0.5, g: 0, b: 0.5 },
      orange: { r: 1, g: 0.65, b: 0 },
    };
    
    if (namedColors[colorStr.toLowerCase()]) {
      return namedColors[colorStr.toLowerCase()];
    }
    
    return defaultColor;
  } catch (error) {
    console.warn('Error parsing color:', error);
    return defaultColor;
  }
}

/**
 * Creates connector lines between nodes
 */
async function createConnections(
  figmaNodes: { [id: string]: SceneNode },
  elements: any[]
): Promise<void> {
  try {
    console.log('Beginning to create connections between nodes');
    
    // Verify figmaNodes exists and is an object
    if (!figmaNodes || typeof figmaNodes !== 'object') {
      console.error('Invalid figmaNodes parameter:', figmaNodes);
      return;
    }
    
    // Verify elements array exists
    if (!elements || !Array.isArray(elements)) {
      console.error('Invalid elements parameter:', elements);
      return;
    }
    
    // Create a map for elements
    const elementsMap: { [id: string]: any } = {};
    elements.forEach(el => {
      if (el && el.id) {
        elementsMap[el.id] = el;
      }
    });
    
    console.log(`Created elements map with ${Object.keys(elementsMap).length} entries`);
    
    // Process each element's connections
    let connectionCount = 0;
    
    for (const element of elements) {
      // Skip if element doesn't have connections
      if (!element || !element.connections || !Array.isArray(element.connections) || element.connections.length === 0) {
        continue;
      }
      
      console.log(`Processing ${element.connections.length} connections for element ${element.id}`);
      
      for (const connection of element.connections) {
        try {
          // Validate connection object
          if (!connection || !connection.fromId || !connection.toId) {
            console.warn('Invalid connection object:', connection);
            continue;
          }
          
          // Get nodes for connection
          const fromNode = figmaNodes[connection.fromId];
          const toNode = figmaNodes[connection.toId];
          
          if (!fromNode) {
            console.warn(`From node with ID ${connection.fromId} not found`);
            continue;
          }
          
          if (!toNode) {
            console.warn(`To node with ID ${connection.toId} not found`);
            continue;
          }
          
          console.log(`Creating connector from ${fromNode.name} to ${toNode.name}`);
          
          // Create a connector
          const connector = figma.createConnector();
          connector.name = `Connector: ${connection.fromId} → ${connection.toId}`;
          
          // Set connector endpoints
          connector.connectorStart = {
            endpointNodeId: fromNode.id,
            magnet: 'AUTO'
          };
          
          connector.connectorEnd = {
            endpointNodeId: toNode.id,
            magnet: 'AUTO'
          };
          
          // Set stroke properties
          connector.strokes = [{
            type: 'SOLID',
            color: { r: 0, g: 0, b: 0 },
            opacity: 1
          }];
          
          connector.strokeWeight = 1;
          
          // Advanced: If we have specific points for the connector path
          if (connection.points && Array.isArray(connection.points) && connection.points.length > 0) {
            console.log('Connection has specific points:', connection.points);
            // This is just a placeholder - actual manipulation of connector paths
            // would require more complex interactions with the Figma API
          }
          
          connectionCount++;
        } catch (error) {
          console.error(`Error creating connection from ${connection.fromId} to ${connection.toId}:`, error);
          // Continue with other connections
        }
      }
    }
    
    console.log(`Successfully created ${connectionCount} connections`);
  } catch (error) {
    console.error('Error in createConnections:', error);
    // Don't rethrow the error to prevent the whole conversion process from failing
  }
}

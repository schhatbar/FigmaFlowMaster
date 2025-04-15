interface SvgElement {
  type: string;
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pathData?: string;
  text?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  connections: Array<{
    fromId: string;
    toId: string;
    points?: number[][];
  }>;
  children?: SvgElement[];
}

interface ParsedSvg {
  width: number;
  height: number;
  viewBox: {
    minX: number;
    minY: number;
    width: number;
    height: number;
  };
  elements: SvgElement[];
}

/**
 * Parses an SVG string and extracts flowchart elements and their relationships
 * @param svgContent The SVG file content as a string
 * @returns A parsed representation of the SVG
 */
export function parseSvg(svgContent: string): ParsedSvg {
  try {
    // For Figma plugin environment, we'll use a simplified parsing approach
    
    // Basic check for SVG format
    if (!svgContent.includes('<svg') || !svgContent.includes('</svg>')) {
      throw new Error('Invalid SVG file: Missing SVG tags');
    }
    
    // Extract root SVG element properties using regex
    const widthMatch = svgContent.match(/width=["']([^"']*)["']/);
    const heightMatch = svgContent.match(/height=["']([^"']*)["']/);
    const viewBoxMatch = svgContent.match(/viewBox=["']([^"']*)["']/);
    
    const svgWidth = widthMatch ? parseFloat(widthMatch[1]) : 0;
    const svgHeight = heightMatch ? parseFloat(heightMatch[1]) : 0;
    
    // Parse viewBox
    let viewBox = {
      minX: 0,
      minY: 0,
      width: svgWidth || 800,
      height: svgHeight || 600
    };
    
    if (viewBoxMatch) {
      const viewBoxValues = viewBoxMatch[1].split(/\s+/).map(parseFloat);
      if (viewBoxValues.length >= 4) {
        viewBox = {
          minX: viewBoxValues[0] || 0,
          minY: viewBoxValues[1] || 0,
          width: viewBoxValues[2] || svgWidth || 800,
          height: viewBoxValues[3] || svgHeight || 600
        };
      }
    }
    
    // Create a simplified parsing approach to extract elements
    const elements: SvgElement[] = [];
    
    // Extract rectangles with regex
    const rectRegex = /<rect[^>]*?x=["']([^"']*)["'][^>]*?y=["']([^"']*)["'][^>]*?width=["']([^"']*)["'][^>]*?height=["']([^"']*)["'][^>]*?(?:\/>|><\/rect>)/g;
    let rectMatch;
    while ((rectMatch = rectRegex.exec(svgContent)) !== null) {
      elements.push({
        type: 'rect',
        id: `rect-${generateId()}`,
        x: parseFloat(rectMatch[1]),
        y: parseFloat(rectMatch[2]),
        width: parseFloat(rectMatch[3]),
        height: parseFloat(rectMatch[4]),
        fill: 'white',
        stroke: 'black',
        strokeWidth: 1,
        connections: []
      });
    }
    
    // Extract circles with regex
    const circleRegex = /<circle[^>]*?cx=["']([^"']*)["'][^>]*?cy=["']([^"']*)["'][^>]*?r=["']([^"']*)["'][^>]*?(?:\/>|><\/circle>)/g;
    let circleMatch;
    while ((circleMatch = circleRegex.exec(svgContent)) !== null) {
      const cx = parseFloat(circleMatch[1]);
      const cy = parseFloat(circleMatch[2]);
      const r = parseFloat(circleMatch[3]);
      
      elements.push({
        type: 'circle',
        id: `circle-${generateId()}`,
        x: cx - r,
        y: cy - r,
        width: r * 2,
        height: r * 2,
        fill: 'white',
        stroke: 'black',
        strokeWidth: 1,
        connections: []
      });
    }
    
    // Extract lines (simplified for connectors)
    const lineRegex = /<line[^>]*?x1=["']([^"']*)["'][^>]*?y1=["']([^"']*)["'][^>]*?x2=["']([^"']*)["'][^>]*?y2=["']([^"']*)["'][^>]*?(?:\/>|><\/line>)/g;
    let lineMatch;
    while ((lineMatch = lineRegex.exec(svgContent)) !== null) {
      const x1 = parseFloat(lineMatch[1]);
      const y1 = parseFloat(lineMatch[2]);
      const x2 = parseFloat(lineMatch[3]);
      const y2 = parseFloat(lineMatch[4]);
      
      elements.push({
        type: 'line',
        id: `line-${generateId()}`,
        x: Math.min(x1, x2),
        y: Math.min(y1, y2),
        width: Math.abs(x2 - x1),
        height: Math.abs(y2 - y1),
        pathData: `M${x1},${y1} L${x2},${y2}`,
        fill: 'none',
        stroke: 'black',
        strokeWidth: 1,
        connections: []
      });
    }
    
    // Extract text elements
    const textRegex = /<text[^>]*?x=["']([^"']*)["'][^>]*?y=["']([^"']*)["'][^>]*?>([^<]*)<\/text>/g;
    let textMatch;
    while ((textMatch = textRegex.exec(svgContent)) !== null) {
      const x = parseFloat(textMatch[1]);
      const y = parseFloat(textMatch[2]);
      const textContent = textMatch[3].trim();
      const width = textContent.length * 8;  // Rough estimate
      const height = 16;  // Typical text height
      
      elements.push({
        type: 'text',
        id: `text-${generateId()}`,
        x,
        y: y - height,  // Adjust y position
        width,
        height,
        text: textContent,
        fill: 'black',
        stroke: 'none',
        strokeWidth: 0,
        connections: []
      });
    }
    
    // Determine connections between elements
    for (const element of elements) {
      if (element.type === 'line') {
        const lineMatch = element.pathData?.match(/M([\d.-]+),([\d.-]+)\s+L([\d.-]+),([\d.-]+)/);
        if (lineMatch) {
          const startX = parseFloat(lineMatch[1]);
          const startY = parseFloat(lineMatch[2]);
          const endX = parseFloat(lineMatch[3]);
          const endY = parseFloat(lineMatch[4]);
          
          // Find nodes that might be connected by this line
          const startNode = findNodeAtPoint(elements, startX, startY, element.id);
          const endNode = findNodeAtPoint(elements, endX, endY, element.id);
          
          if (startNode && endNode) {
            element.connections.push({
              fromId: startNode.id,
              toId: endNode.id
            });
            
            // Also add connection to the source node
            startNode.connections.push({
              fromId: startNode.id,
              toId: endNode.id
            });
          }
        }
      }
    }
    
    return {
      width: svgWidth || viewBox.width,
      height: svgHeight || viewBox.height,
      viewBox,
      elements
    };
  } catch (error: unknown) {
    console.error('Error parsing SVG:', error);
    if (error instanceof Error) {
      throw new Error(`Error parsing SVG: ${error.message}`);
    } else {
      throw new Error('Error parsing SVG: Unknown error');
    }
  }
}

/**
 * Finds a node at the given coordinates
 */
function findNodeAtPoint(
  elements: SvgElement[], 
  x: number, 
  y: number, 
  excludeId: string
): SvgElement | null {
  const tolerance = 5;  // Allow some margin for connection points
  
  for (const element of elements) {
    // Skip lines and the element itself
    if (element.id === excludeId || element.type === 'line') {
      continue;
    }
    
    if (element.type === 'circle') {
      // For circles, check if point is within radius
      const centerX = element.x + element.width / 2;
      const centerY = element.y + element.height / 2;
      const radius = element.width / 2;
      
      const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      if (distance <= radius + tolerance) {
        return element;
      }
    } else {
      // For rectangles and other elements, check if point is within bounds
      if (
        x >= element.x - tolerance &&
        x <= element.x + element.width + tolerance &&
        y >= element.y - tolerance &&
        y <= element.y + element.height + tolerance
      ) {
        return element;
      }
    }
  }
  
  return null;
}

/**
 * Recursively parses SVG elements
 */
function parseElements(parentElement: Element): SvgElement[] {
  const elements: SvgElement[] = [];
  
  // Elements we're interested in for flowcharts
  const relevantTags = ['rect', 'circle', 'ellipse', 'path', 'polygon', 'polyline', 'line', 'text', 'g'];
  
  // Process child elements
  for (const child of Array.from(parentElement.children)) {
    const tagName = child.tagName.toLowerCase();
    
    if (!relevantTags.includes(tagName)) continue;
    
    if (tagName === 'g') {
      // Group element - recursively process its children
      const groupChildren = parseElements(child);
      if (groupChildren.length > 0) {
        const id = child.id || `group-${generateId()}`;
        
        // Calculate group bounds from children
        const bounds = calculateGroupBounds(groupChildren);
        
        elements.push({
          type: 'group',
          id,
          x: bounds.x,
          y: bounds.y,
          width: bounds.width,
          height: bounds.height,
          connections: [],
          children: groupChildren
        });
      }
    } else {
      // Individual shape element
      const element = parseSvgElement(child);
      if (element) {
        elements.push(element);
      }
    }
  }
  
  return elements;
}

/**
 * Parses a single SVG element
 */
function parseSvgElement(element: Element): SvgElement | null {
  const tagName = element.tagName.toLowerCase();
  const id = element.id || `${tagName}-${generateId()}`;
  
  // Common style attributes
  const fill = element.getAttribute('fill') || 'none';
  const stroke = element.getAttribute('stroke') || 'black';
  const strokeWidth = parseFloat(element.getAttribute('stroke-width') || '1');
  
  let svgElement: SvgElement | null = null;
  
  switch (tagName) {
    case 'rect': {
      const x = parseFloat(element.getAttribute('x') || '0');
      const y = parseFloat(element.getAttribute('y') || '0');
      const width = parseFloat(element.getAttribute('width') || '0');
      const height = parseFloat(element.getAttribute('height') || '0');
      
      svgElement = {
        type: 'rect',
        id,
        x,
        y,
        width,
        height,
        fill,
        stroke,
        strokeWidth,
        connections: []
      };
      break;
    }
    
    case 'circle': {
      const cx = parseFloat(element.getAttribute('cx') || '0');
      const cy = parseFloat(element.getAttribute('cy') || '0');
      const r = parseFloat(element.getAttribute('r') || '0');
      
      svgElement = {
        type: 'circle',
        id,
        x: cx - r,
        y: cy - r,
        width: r * 2,
        height: r * 2,
        fill,
        stroke,
        strokeWidth,
        connections: []
      };
      break;
    }
    
    case 'ellipse': {
      const cx = parseFloat(element.getAttribute('cx') || '0');
      const cy = parseFloat(element.getAttribute('cy') || '0');
      const rx = parseFloat(element.getAttribute('rx') || '0');
      const ry = parseFloat(element.getAttribute('ry') || '0');
      
      svgElement = {
        type: 'ellipse',
        id,
        x: cx - rx,
        y: cy - ry,
        width: rx * 2,
        height: ry * 2,
        fill,
        stroke,
        strokeWidth,
        connections: []
      };
      break;
    }
    
    case 'path': {
      const pathData = element.getAttribute('d') || '';
      // For paths, estimate a bounding box
      // In browser environments we would use getBBox, but here we'll estimate
      const bbox = { x: 0, y: 0, width: 100, height: 100 };
      
      svgElement = {
        type: 'path',
        id,
        x: bbox.x,
        y: bbox.y,
        width: bbox.width,
        height: bbox.height,
        pathData,
        fill,
        stroke,
        strokeWidth,
        connections: []
      };
      break;
    }
    
    case 'polygon':
    case 'polyline': {
      const points = element.getAttribute('points') || '';
      // Calculate bounding box from points
      const pointArray = points.trim().split(/\s+|,/).map(parseFloat);
      const xPoints = pointArray.filter((_, i) => i % 2 === 0);
      const yPoints = pointArray.filter((_, i) => i % 2 === 1);
      
      const minX = Math.min(...xPoints);
      const maxX = Math.max(...xPoints);
      const minY = Math.min(...yPoints);
      const maxY = Math.max(...yPoints);
      
      svgElement = {
        type: tagName,
        id,
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
        pathData: points,
        fill,
        stroke,
        strokeWidth,
        connections: []
      };
      break;
    }
    
    case 'line': {
      const x1 = parseFloat(element.getAttribute('x1') || '0');
      const y1 = parseFloat(element.getAttribute('y1') || '0');
      const x2 = parseFloat(element.getAttribute('x2') || '0');
      const y2 = parseFloat(element.getAttribute('y2') || '0');
      
      svgElement = {
        type: 'line',
        id,
        x: Math.min(x1, x2),
        y: Math.min(y1, y2),
        width: Math.abs(x2 - x1),
        height: Math.abs(y2 - y1),
        pathData: `M${x1},${y1} L${x2},${y2}`,
        fill,
        stroke,
        strokeWidth,
        connections: []
      };
      break;
    }
    
    case 'text': {
      const x = parseFloat(element.getAttribute('x') || '0');
      const y = parseFloat(element.getAttribute('y') || '0');
      // For text, estimate size based on content
      const text = element.textContent || '';
      // Rough estimation of text dimensions
      const width = text.length * 8;
      const height = 16;
      
      svgElement = {
        type: 'text',
        id,
        x,
        y: y - height, // Adjust y since text baseline is at the bottom
        width,
        height,
        text,
        fill: element.getAttribute('fill') || 'black',
        stroke: 'none',
        strokeWidth: 0,
        connections: []
      };
      break;
    }
  }
  
  return svgElement;
}

/**
 * Detects connections between elements based on proximity and path endpoints
 */
function detectConnections(elements: SvgElement[]): Array<{fromId: string, toId: string, points?: number[][]}> {
  const connections: Array<{fromId: string, toId: string, points?: number[][]}> = [];
  
  // Find line-like elements (paths, lines, polylines) that might be connectors
  const possibleConnectors = elements.filter(el => 
    el.type === 'path' || el.type === 'line' || el.type === 'polyline');
  
  // Find nodes (rectangles, circles, etc.)
  const possibleNodes = elements.filter(el => 
    el.type === 'rect' || el.type === 'circle' || el.type === 'ellipse' || 
    el.type === 'polygon' || (el.type === 'path' && el.fill !== 'none'));
  
  // For each potential connector, check if it connects any nodes
  for (const connector of possibleConnectors) {
    // Skip elements that are likely to be nodes themselves
    if (connector.fill !== 'none' && connector.type !== 'line') continue;
    
    // Extract start and end points
    let startPoint: [number, number] | null = null;
    let endPoint: [number, number] | null = null;
    let middlePoints: number[][] = [];
    
    if (connector.type === 'line') {
      // For lines, extract directly from pathData
      const match = connector.pathData?.match(/M([\d.-]+),([\d.-]+)\s+L([\d.-]+),([\d.-]+)/);
      if (match) {
        startPoint = [parseFloat(match[1]), parseFloat(match[2])];
        endPoint = [parseFloat(match[3]), parseFloat(match[4])];
      }
    } else if (connector.type === 'polyline') {
      // For polylines, extract from pathData
      const pointsStr = connector.pathData || '';
      const points = pointsStr.trim().split(/\s+|,/).map(parseFloat);
      if (points.length >= 4) {
        startPoint = [points[0], points[1]];
        endPoint = [points[points.length - 2], points[points.length - 1]];
        
        // Extract middle points if there are more than 2 points
        if (points.length > 4) {
          for (let i = 2; i < points.length - 2; i += 2) {
            middlePoints.push([points[i], points[i + 1]]);
          }
        }
      }
    } else if (connector.type === 'path') {
      // For paths, do a simple extraction of M and last command
      const dAttr = connector.pathData || '';
      const firstM = dAttr.match(/M([\d.-]+)[,\s]([\d.-]+)/);
      const lastCommand = dAttr.match(/[MLQCZ][^MLQCZ]*$/);
      
      if (firstM) {
        startPoint = [parseFloat(firstM[1]), parseFloat(firstM[2])];
        
        if (lastCommand) {
          const lastPart = lastCommand[0];
          if (lastPart.startsWith('L')) {
            const match = lastPart.match(/L([\d.-]+)[,\s]([\d.-]+)/);
            if (match) {
              endPoint = [parseFloat(match[1]), parseFloat(match[2])];
            }
          } else if (lastPart.startsWith('C')) {
            const match = lastPart.match(/C.*?([\d.-]+)[,\s]([\d.-]+)$/);
            if (match) {
              endPoint = [parseFloat(match[1]), parseFloat(match[2])];
            }
          }
        }
      }
    }
    
    // If we found start and end points, check for nodes at these points
    if (startPoint && endPoint) {
      let fromNode: SvgElement | null = null;
      let toNode: SvgElement | null = null;
      
      // Find nodes that contain the start/end points
      for (const node of possibleNodes) {
        if (node.id === connector.id) continue; // Skip self
        
        if (isPointInElement(startPoint, node)) {
          fromNode = node;
        }
        
        if (isPointInElement(endPoint, node)) {
          toNode = node;
        }
        
        if (fromNode && toNode) break;
      }
      
      // If we found nodes at both ends, record the connection
      if (fromNode && toNode) {
        connections.push({
          fromId: fromNode.id,
          toId: toNode.id,
          points: middlePoints.length > 0 ? [startPoint, ...middlePoints, endPoint] : undefined
        });
      }
    }
  }
  
  return connections;
}

/**
 * Applies detected connections to elements
 */
function applyConnections(
  elements: SvgElement[], 
  connections: Array<{fromId: string, toId: string, points?: number[][]}>
) {
  // Create a map for faster lookups
  const elementMap: {[id: string]: SvgElement} = {};
  elements.forEach(el => {
    elementMap[el.id] = el;
  });
  
  // Add connections to elements
  for (const connection of connections) {
    const fromElement = elementMap[connection.fromId];
    if (fromElement) {
      fromElement.connections.push(connection);
    }
  }
}

/**
 * Checks if a point is inside or very close to an element
 */
function isPointInElement(point: [number, number], element: SvgElement): boolean {
  const [x, y] = point;
  const { x: elX, y: elY, width: elWidth, height: elHeight } = element;
  
  // Add a small tolerance for point detection
  const tolerance = 5;
  
  if (element.type === 'circle') {
    // For circles, check if point is within radius
    const centerX = elX + elWidth / 2;
    const centerY = elY + elHeight / 2;
    const radius = elWidth / 2;
    
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    return distance <= radius + tolerance;
  } else {
    // For other shapes, check if point is within bounding box
    return (
      x >= elX - tolerance &&
      x <= elX + elWidth + tolerance &&
      y >= elY - tolerance &&
      y <= elY + elHeight + tolerance
    );
  }
}

/**
 * Calculates bounding box for a group of elements
 */
function calculateGroupBounds(elements: SvgElement[]): { x: number, y: number, width: number, height: number } {
  if (elements.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }
  
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  
  for (const el of elements) {
    minX = Math.min(minX, el.x);
    minY = Math.min(minY, el.y);
    maxX = Math.max(maxX, el.x + el.width);
    maxY = Math.max(maxY, el.y + el.height);
  }
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}

/**
 * Generates a random ID for elements without IDs
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

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
 * Generates a random ID for elements without IDs
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
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
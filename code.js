/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/errorHandler.ts":
/*!*****************************!*\
  !*** ./src/errorHandler.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   handleError: () => (/* binding */ handleError),
/* harmony export */   logError: () => (/* binding */ logError)
/* harmony export */ });
/**
 * Handles errors and returns appropriate error messages
 * @param error The error to handle
 * @returns A user-friendly error message
 */
function handleError(error) {
    console.error('Error occurred:', error);
    // Check error type
    if (error instanceof Error) {
        const errorMessage = error.message;
        // Handle specific error types
        if (errorMessage.includes('Invalid SVG')) {
            return 'The SVG file is invalid or corrupted. Please check the file and try again.';
        }
        if (errorMessage.includes('Missing root SVG element')) {
            return 'The file does not appear to be a valid SVG. Please check the file format.';
        }
        if (errorMessage.includes('permission')) {
            return 'The plugin does not have permission to perform this action. Please try again.';
        }
        if (errorMessage.includes('Font')) {
            return 'There was an issue with loading fonts. Please try again.';
        }
        // Return the original error message if it's specific
        return `Error: ${errorMessage}`;
    }
    // For SVG parsing errors
    if (typeof error === 'object' && error !== null) {
        if ('message' in error) {
            if (typeof error.message === 'string' && error.message.includes('SVG')) {
                return `SVG parsing error: ${error.message}`;
            }
            return `Error: ${error.message}`;
        }
    }
    // Generic error message
    return 'An unexpected error occurred. Please try again or try with a different SVG file.';
}
/**
 * Log error with details to the console for debugging
 * @param context The context where the error occurred
 * @param error The error object
 */
function logError(context, error) {
    console.error(`Error in ${context}:`, error);
    // Additional logging for debugging
    if (error instanceof Error) {
        console.error('Stack trace:', error.stack);
    }
}


/***/ }),

/***/ "./src/figmaConverter.ts":
/*!*******************************!*\
  !*** ./src/figmaConverter.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   svgToFigmaFlowchart: () => (/* binding */ svgToFigmaFlowchart)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Converts a parsed SVG structure to a Figma flowchart
 * @param parsedSvg The parsed SVG data
 */
function svgToFigmaFlowchart(parsedSvg) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Load fonts first to ensure text elements render properly
            yield figma.loadFontAsync({ family: "Inter", style: "Regular" });
            yield figma.loadFontAsync({ family: "Inter", style: "Medium" });
            // Calculate scale factors
            const scale = calculateScale(parsedSvg.viewBox);
            // Create nodes
            const figmaNodes = yield createFigmaNodes(parsedSvg.elements, scale);
            // Create connections between nodes
            yield createConnections(figmaNodes, parsedSvg.elements);
            // Select all created nodes
            figma.currentPage.selection = Object.values(figmaNodes);
            // Zoom to fit the created nodes
            figma.viewport.scrollAndZoomIntoView(Object.values(figmaNodes));
        }
        catch (error) {
            console.error('Error converting to Figma flowchart:', error);
            if (error instanceof Error) {
                throw new Error(`Error converting to Figma flowchart: ${error.message}`);
            }
            else {
                throw new Error('Error converting to Figma flowchart: Unknown error');
            }
        }
    });
}
/**
 * Calculates scale factors for converting from SVG coordinates to Figma
 */
function calculateScale(viewBox) {
    // For simplicity, we'll use a 1:1 mapping, but this could be adjusted
    // if we need to scale the flowchart differently
    return { x: 1, y: 1 };
}
/**
 * Creates Figma nodes from SVG elements
 */
function createFigmaNodes(elements, scale) {
    return __awaiter(this, void 0, void 0, function* () {
        const figmaNodes = {};
        // Process elements
        for (const element of elements) {
            // Skip elements that are likely to be connectors
            if (isConnector(element))
                continue;
            try {
                const node = yield createFigmaNode(element, scale);
                if (node) {
                    figmaNodes[element.id] = node;
                }
            }
            catch (error) {
                console.warn(`Error creating node for element ${element.id}:`, error);
                // Continue with other elements
            }
        }
        return figmaNodes;
    });
}
/**
 * Checks if an element is likely to be a connector rather than a node
 */
function isConnector(element) {
    // Lines are almost always connectors
    if (element.type === 'line')
        return true;
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
function createFigmaNode(element, scale) {
    return __awaiter(this, void 0, void 0, function* () {
        // Scale coordinates
        const x = element.x * scale.x;
        const y = element.y * scale.y;
        const width = element.width * scale.x;
        const height = element.height * scale.y;
        let node = null;
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
                    const shape = figma.createRectangle(); // As a fallback
                    shape.x = x;
                    shape.y = y;
                    shape.resize(width, height);
                    node = shape;
                }
                break;
            case 'text':
                const text = figma.createText();
                yield figma.loadFontAsync({ family: "Inter", style: "Regular" });
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
                    const childNodes = yield createFigmaNodes(element.children, scale);
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
                }
                catch (error) {
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
                }
                catch (error) {
                    console.warn(`Could not apply stroke for node ${node.name}:`, error);
                }
            }
        }
        return node;
    });
}
/**
 * Parses a color string (hex, rgb, etc.) to RGB components
 */
function parseColor(colorStr) {
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
        const namedColors = {
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
    }
    catch (error) {
        console.warn('Error parsing color:', error);
        return defaultColor;
    }
}
/**
 * Creates connector lines between nodes
 */
function createConnections(figmaNodes, elements) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create a map for elements
        const elementsMap = {};
        elements.forEach(el => {
            elementsMap[el.id] = el;
        });
        // Process each element's connections
        for (const element of elements) {
            if (!element.connections || element.connections.length === 0)
                continue;
            for (const connection of element.connections) {
                try {
                    const fromNode = figmaNodes[connection.fromId];
                    const toNode = figmaNodes[connection.toId];
                    if (!fromNode || !toNode)
                        continue;
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
                    if (connection.points && connection.points.length > 0) {
                        // This is just a placeholder - actual manipulation of connector paths
                        // would require more complex interactions with the Figma API
                        console.log('Connection has specific points:', connection.points);
                        // As a simple approximation, we could add rounded corners
                        // Note: strokeCap property is not available on ConnectorNode
                    }
                }
                catch (error) {
                    console.warn(`Error creating connection from ${connection.fromId} to ${connection.toId}:`, error);
                    // Continue with other connections
                }
            }
        }
    });
}


/***/ }),

/***/ "./src/svgParser.ts":
/*!**************************!*\
  !*** ./src/svgParser.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   parseSvg: () => (/* binding */ parseSvg)
/* harmony export */ });
/**
 * Parses an SVG string and extracts flowchart elements and their relationships
 * @param svgContent The SVG file content as a string
 * @returns A parsed representation of the SVG
 */
function parseSvg(svgContent) {
    var _a;
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
        const elements = [];
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
            const width = textContent.length * 8; // Rough estimate
            const height = 16; // Typical text height
            elements.push({
                type: 'text',
                id: `text-${generateId()}`,
                x,
                y: y - height, // Adjust y position
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
                const lineMatch = (_a = element.pathData) === null || _a === void 0 ? void 0 : _a.match(/M([\d.-]+),([\d.-]+)\s+L([\d.-]+),([\d.-]+)/);
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
    }
    catch (error) {
        console.error('Error parsing SVG:', error);
        if (error instanceof Error) {
            throw new Error(`Error parsing SVG: ${error.message}`);
        }
        else {
            throw new Error('Error parsing SVG: Unknown error');
        }
    }
}
/**
 * Finds a node at the given coordinates
 */
function findNodeAtPoint(elements, x, y, excludeId) {
    const tolerance = 5; // Allow some margin for connection points
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
        }
        else {
            // For rectangles and other elements, check if point is within bounds
            if (x >= element.x - tolerance &&
                x <= element.x + element.width + tolerance &&
                y >= element.y - tolerance &&
                y <= element.y + element.height + tolerance) {
                return element;
            }
        }
    }
    return null;
}
/**
 * Recursively parses SVG elements
 */
function parseElements(parentElement) {
    const elements = [];
    // Elements we're interested in for flowcharts
    const relevantTags = ['rect', 'circle', 'ellipse', 'path', 'polygon', 'polyline', 'line', 'text', 'g'];
    // Process child elements
    for (const child of Array.from(parentElement.children)) {
        const tagName = child.tagName.toLowerCase();
        if (!relevantTags.includes(tagName))
            continue;
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
        }
        else {
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
function parseSvgElement(element) {
    const tagName = element.tagName.toLowerCase();
    const id = element.id || `${tagName}-${generateId()}`;
    // Common style attributes
    const fill = element.getAttribute('fill') || 'none';
    const stroke = element.getAttribute('stroke') || 'black';
    const strokeWidth = parseFloat(element.getAttribute('stroke-width') || '1');
    let svgElement = null;
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
function detectConnections(elements) {
    var _a;
    const connections = [];
    // Find line-like elements (paths, lines, polylines) that might be connectors
    const possibleConnectors = elements.filter(el => el.type === 'path' || el.type === 'line' || el.type === 'polyline');
    // Find nodes (rectangles, circles, etc.)
    const possibleNodes = elements.filter(el => el.type === 'rect' || el.type === 'circle' || el.type === 'ellipse' ||
        el.type === 'polygon' || (el.type === 'path' && el.fill !== 'none'));
    // For each potential connector, check if it connects any nodes
    for (const connector of possibleConnectors) {
        // Skip elements that are likely to be nodes themselves
        if (connector.fill !== 'none' && connector.type !== 'line')
            continue;
        // Extract start and end points
        let startPoint = null;
        let endPoint = null;
        let middlePoints = [];
        if (connector.type === 'line') {
            // For lines, extract directly from pathData
            const match = (_a = connector.pathData) === null || _a === void 0 ? void 0 : _a.match(/M([\d.-]+),([\d.-]+)\s+L([\d.-]+),([\d.-]+)/);
            if (match) {
                startPoint = [parseFloat(match[1]), parseFloat(match[2])];
                endPoint = [parseFloat(match[3]), parseFloat(match[4])];
            }
        }
        else if (connector.type === 'polyline') {
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
        }
        else if (connector.type === 'path') {
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
                    }
                    else if (lastPart.startsWith('C')) {
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
            let fromNode = null;
            let toNode = null;
            // Find nodes that contain the start/end points
            for (const node of possibleNodes) {
                if (node.id === connector.id)
                    continue; // Skip self
                if (isPointInElement(startPoint, node)) {
                    fromNode = node;
                }
                if (isPointInElement(endPoint, node)) {
                    toNode = node;
                }
                if (fromNode && toNode)
                    break;
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
function applyConnections(elements, connections) {
    // Create a map for faster lookups
    const elementMap = {};
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
function isPointInElement(point, element) {
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
    }
    else {
        // For other shapes, check if point is within bounding box
        return (x >= elX - tolerance &&
            x <= elX + elWidth + tolerance &&
            y >= elY - tolerance &&
            y <= elY + elHeight + tolerance);
    }
}
/**
 * Calculates bounding box for a group of elements
 */
function calculateGroupBounds(elements) {
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
function generateId() {
    return Math.random().toString(36).substring(2, 10);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*****************!*\
  !*** ./code.ts ***!
  \*****************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_figmaConverter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/figmaConverter */ "./src/figmaConverter.ts");
/* harmony import */ var _src_svgParser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/svgParser */ "./src/svgParser.ts");
/* harmony import */ var _src_errorHandler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./src/errorHandler */ "./src/errorHandler.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



figma.showUI(__html__, { width: 400, height: 500 });
figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (msg.type === 'convert-svg') {
        try {
            // Parse the SVG content
            const parsedSvg = (0,_src_svgParser__WEBPACK_IMPORTED_MODULE_1__.parseSvg)(msg.svgContent);
            // Create a new page for the flowchart
            const page = figma.createPage();
            page.name = `Flowchart: ${msg.fileName.replace(/\.svg$/, '')}`;
            figma.currentPage = page;
            // Convert SVG to Figma flowchart
            yield (0,_src_figmaConverter__WEBPACK_IMPORTED_MODULE_0__.svgToFigmaFlowchart)(parsedSvg);
            // Notify UI that conversion is complete
            figma.ui.postMessage({
                type: 'conversion-complete'
            });
            figma.notify('SVG successfully converted to flowchart!');
        }
        catch (error) {
            console.error(error);
            // Handle the error and notify UI
            const errorMsg = (0,_src_errorHandler__WEBPACK_IMPORTED_MODULE_2__.handleError)(error);
            figma.ui.postMessage({
                type: 'error',
                message: errorMsg
            });
            figma.notify('Error converting SVG to flowchart', { error: true });
        }
    }
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RUFBRTtZQUMzQixLQUFLLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUMzQixHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUN6QixLQUFLLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUMzQixJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUMxQixJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtZQUNoQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUM1QixNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtZQUNoQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtTQUNoQyxDQUFDO1FBRUYsSUFBSSxXQUFXLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUN4QyxPQUFPLFdBQVcsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztRQUM3QyxDQUFDO1FBRUQsT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixPQUFPLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzVDLE9BQU8s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LENBQUM7WUFDSCx3QkFBd0I7WUFDeEIsTUFBTSxTQUFTLEdBQUcsd0RBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFM0Msc0NBQXNDO1lBQ3RDLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNoQyxJQUFJLENBQUMsSUFBSSxHQUFHLGNBQWMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDL0QsS0FBSyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFFekIsaUNBQWlDO1lBQ2pDLE1BQU0sd0VBQW1CLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFckMsd0NBQXdDO1lBQ3hDLEtBQUssQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDO2dCQUNuQixJQUFJLEVBQUUscUJBQXFCO2FBQzVCLENBQUMsQ0FBQztZQUVILEtBQUssQ0FBQyxNQUFNLENBQUMsMENBQTBDLENBQUMsQ0FBQztRQUMzRCxDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNmLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFckIsaUNBQWlDO1lBQ2pDLE1BQU0sUUFBUSxHQUFHLDhEQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUM7Z0JBQ25CLElBQUksRUFBRSxPQUFPO2dCQUNiLE9BQU8sRUFBRSxRQUFRO2FBQ2xCLENBQUMsQ0FBQztZQUVILEtBQUssQ0FBQyxNQUFNLENBQUMsbUNBQW1DLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNyRSxDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUMsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3dvcmtzcGFjZS8uL3NyYy9lcnJvckhhbmRsZXIudHMiLCJ3ZWJwYWNrOi8vd29ya3NwYWNlLy4vc3JjL2ZpZ21hQ29udmVydGVyLnRzIiwid2VicGFjazovL3dvcmtzcGFjZS8uL3NyYy9zdmdQYXJzZXIudHMiLCJ3ZWJwYWNrOi8vd29ya3NwYWNlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dvcmtzcGFjZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd29ya3NwYWNlL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vd29ya3NwYWNlL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd29ya3NwYWNlLy4vY29kZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEhhbmRsZXMgZXJyb3JzIGFuZCByZXR1cm5zIGFwcHJvcHJpYXRlIGVycm9yIG1lc3NhZ2VzXG4gKiBAcGFyYW0gZXJyb3IgVGhlIGVycm9yIHRvIGhhbmRsZVxuICogQHJldHVybnMgQSB1c2VyLWZyaWVuZGx5IGVycm9yIG1lc3NhZ2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZUVycm9yKGVycm9yOiBhbnkpOiBzdHJpbmcge1xuICBjb25zb2xlLmVycm9yKCdFcnJvciBvY2N1cnJlZDonLCBlcnJvcik7XG4gIFxuICAvLyBDaGVjayBlcnJvciB0eXBlXG4gIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgY29uc3QgZXJyb3JNZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICBcbiAgICAvLyBIYW5kbGUgc3BlY2lmaWMgZXJyb3IgdHlwZXNcbiAgICBpZiAoZXJyb3JNZXNzYWdlLmluY2x1ZGVzKCdJbnZhbGlkIFNWRycpKSB7XG4gICAgICByZXR1cm4gJ1RoZSBTVkcgZmlsZSBpcyBpbnZhbGlkIG9yIGNvcnJ1cHRlZC4gUGxlYXNlIGNoZWNrIHRoZSBmaWxlIGFuZCB0cnkgYWdhaW4uJztcbiAgICB9XG4gICAgXG4gICAgaWYgKGVycm9yTWVzc2FnZS5pbmNsdWRlcygnTWlzc2luZyByb290IFNWRyBlbGVtZW50JykpIHtcbiAgICAgIHJldHVybiAnVGhlIGZpbGUgZG9lcyBub3QgYXBwZWFyIHRvIGJlIGEgdmFsaWQgU1ZHLiBQbGVhc2UgY2hlY2sgdGhlIGZpbGUgZm9ybWF0Lic7XG4gICAgfVxuICAgIFxuICAgIGlmIChlcnJvck1lc3NhZ2UuaW5jbHVkZXMoJ3Blcm1pc3Npb24nKSkge1xuICAgICAgcmV0dXJuICdUaGUgcGx1Z2luIGRvZXMgbm90IGhhdmUgcGVybWlzc2lvbiB0byBwZXJmb3JtIHRoaXMgYWN0aW9uLiBQbGVhc2UgdHJ5IGFnYWluLic7XG4gICAgfVxuICAgIFxuICAgIGlmIChlcnJvck1lc3NhZ2UuaW5jbHVkZXMoJ0ZvbnQnKSkge1xuICAgICAgcmV0dXJuICdUaGVyZSB3YXMgYW4gaXNzdWUgd2l0aCBsb2FkaW5nIGZvbnRzLiBQbGVhc2UgdHJ5IGFnYWluLic7XG4gICAgfVxuICAgIFxuICAgIC8vIFJldHVybiB0aGUgb3JpZ2luYWwgZXJyb3IgbWVzc2FnZSBpZiBpdCdzIHNwZWNpZmljXG4gICAgcmV0dXJuIGBFcnJvcjogJHtlcnJvck1lc3NhZ2V9YDtcbiAgfVxuICBcbiAgLy8gRm9yIFNWRyBwYXJzaW5nIGVycm9yc1xuICBpZiAodHlwZW9mIGVycm9yID09PSAnb2JqZWN0JyAmJiBlcnJvciAhPT0gbnVsbCkge1xuICAgIGlmICgnbWVzc2FnZScgaW4gZXJyb3IpIHtcbiAgICAgIGlmICh0eXBlb2YgZXJyb3IubWVzc2FnZSA9PT0gJ3N0cmluZycgJiYgZXJyb3IubWVzc2FnZS5pbmNsdWRlcygnU1ZHJykpIHtcbiAgICAgICAgcmV0dXJuIGBTVkcgcGFyc2luZyBlcnJvcjogJHtlcnJvci5tZXNzYWdlfWA7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHJldHVybiBgRXJyb3I6ICR7ZXJyb3IubWVzc2FnZX1gO1xuICAgIH1cbiAgfVxuICBcbiAgLy8gR2VuZXJpYyBlcnJvciBtZXNzYWdlXG4gIHJldHVybiAnQW4gdW5leHBlY3RlZCBlcnJvciBvY2N1cnJlZC4gUGxlYXNlIHRyeSBhZ2FpbiBvciB0cnkgd2l0aCBhIGRpZmZlcmVudCBTVkcgZmlsZS4nO1xufVxuXG4vKipcbiAqIExvZyBlcnJvciB3aXRoIGRldGFpbHMgdG8gdGhlIGNvbnNvbGUgZm9yIGRlYnVnZ2luZ1xuICogQHBhcmFtIGNvbnRleHQgVGhlIGNvbnRleHQgd2hlcmUgdGhlIGVycm9yIG9jY3VycmVkXG4gKiBAcGFyYW0gZXJyb3IgVGhlIGVycm9yIG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gbG9nRXJyb3IoY29udGV4dDogc3RyaW5nLCBlcnJvcjogYW55KTogdm9pZCB7XG4gIGNvbnNvbGUuZXJyb3IoYEVycm9yIGluICR7Y29udGV4dH06YCwgZXJyb3IpO1xuICBcbiAgLy8gQWRkaXRpb25hbCBsb2dnaW5nIGZvciBkZWJ1Z2dpbmdcbiAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdTdGFjayB0cmFjZTonLCBlcnJvci5zdGFjayk7XG4gIH1cbn1cbiIsImltcG9ydCB7IGhhbmRsZUVycm9yIH0gZnJvbSAnLi9lcnJvckhhbmRsZXInO1xuXG4vKipcbiAqIENvbnZlcnRzIGEgcGFyc2VkIFNWRyBzdHJ1Y3R1cmUgdG8gYSBGaWdtYSBmbG93Y2hhcnRcbiAqIEBwYXJhbSBwYXJzZWRTdmcgVGhlIHBhcnNlZCBTVkcgZGF0YVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc3ZnVG9GaWdtYUZsb3djaGFydChwYXJzZWRTdmc6IGFueSk6IFByb21pc2U8dm9pZD4ge1xuICB0cnkge1xuICAgIC8vIExvYWQgZm9udHMgZmlyc3QgdG8gZW5zdXJlIHRleHQgZWxlbWVudHMgcmVuZGVyIHByb3Blcmx5XG4gICAgYXdhaXQgZmlnbWEubG9hZEZvbnRBc3luYyh7IGZhbWlseTogXCJJbnRlclwiLCBzdHlsZTogXCJSZWd1bGFyXCIgfSk7XG4gICAgYXdhaXQgZmlnbWEubG9hZEZvbnRBc3luYyh7IGZhbWlseTogXCJJbnRlclwiLCBzdHlsZTogXCJNZWRpdW1cIiB9KTtcbiAgICBcbiAgICAvLyBDYWxjdWxhdGUgc2NhbGUgZmFjdG9yc1xuICAgIGNvbnN0IHNjYWxlID0gY2FsY3VsYXRlU2NhbGUocGFyc2VkU3ZnLnZpZXdCb3gpO1xuICAgIFxuICAgIC8vIENyZWF0ZSBub2Rlc1xuICAgIGNvbnN0IGZpZ21hTm9kZXMgPSBhd2FpdCBjcmVhdGVGaWdtYU5vZGVzKHBhcnNlZFN2Zy5lbGVtZW50cywgc2NhbGUpO1xuICAgIFxuICAgIC8vIENyZWF0ZSBjb25uZWN0aW9ucyBiZXR3ZWVuIG5vZGVzXG4gICAgYXdhaXQgY3JlYXRlQ29ubmVjdGlvbnMoZmlnbWFOb2RlcywgcGFyc2VkU3ZnLmVsZW1lbnRzKTtcbiAgICBcbiAgICAvLyBTZWxlY3QgYWxsIGNyZWF0ZWQgbm9kZXNcbiAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBPYmplY3QudmFsdWVzKGZpZ21hTm9kZXMpO1xuICAgIFxuICAgIC8vIFpvb20gdG8gZml0IHRoZSBjcmVhdGVkIG5vZGVzXG4gICAgZmlnbWEudmlld3BvcnQuc2Nyb2xsQW5kWm9vbUludG9WaWV3KE9iamVjdC52YWx1ZXMoZmlnbWFOb2RlcykpO1xuICAgIFxuICB9IGNhdGNoIChlcnJvcjogdW5rbm93bikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGNvbnZlcnRpbmcgdG8gRmlnbWEgZmxvd2NoYXJ0OicsIGVycm9yKTtcbiAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFcnJvciBjb252ZXJ0aW5nIHRvIEZpZ21hIGZsb3djaGFydDogJHtlcnJvci5tZXNzYWdlfWApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIGNvbnZlcnRpbmcgdG8gRmlnbWEgZmxvd2NoYXJ0OiBVbmtub3duIGVycm9yJyk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlcyBzY2FsZSBmYWN0b3JzIGZvciBjb252ZXJ0aW5nIGZyb20gU1ZHIGNvb3JkaW5hdGVzIHRvIEZpZ21hXG4gKi9cbmZ1bmN0aW9uIGNhbGN1bGF0ZVNjYWxlKHZpZXdCb3g6IGFueSk6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSB7XG4gIC8vIEZvciBzaW1wbGljaXR5LCB3ZSdsbCB1c2UgYSAxOjEgbWFwcGluZywgYnV0IHRoaXMgY291bGQgYmUgYWRqdXN0ZWRcbiAgLy8gaWYgd2UgbmVlZCB0byBzY2FsZSB0aGUgZmxvd2NoYXJ0IGRpZmZlcmVudGx5XG4gIHJldHVybiB7IHg6IDEsIHk6IDEgfTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIEZpZ21hIG5vZGVzIGZyb20gU1ZHIGVsZW1lbnRzXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUZpZ21hTm9kZXMoXG4gIGVsZW1lbnRzOiBhbnlbXSwgXG4gIHNjYWxlOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH1cbik6IFByb21pc2U8eyBbaWQ6IHN0cmluZ106IFNjZW5lTm9kZSB9PiB7XG4gIGNvbnN0IGZpZ21hTm9kZXM6IHsgW2lkOiBzdHJpbmddOiBTY2VuZU5vZGUgfSA9IHt9O1xuICBcbiAgLy8gUHJvY2VzcyBlbGVtZW50c1xuICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgZWxlbWVudHMpIHtcbiAgICAvLyBTa2lwIGVsZW1lbnRzIHRoYXQgYXJlIGxpa2VseSB0byBiZSBjb25uZWN0b3JzXG4gICAgaWYgKGlzQ29ubmVjdG9yKGVsZW1lbnQpKSBjb250aW51ZTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3Qgbm9kZSA9IGF3YWl0IGNyZWF0ZUZpZ21hTm9kZShlbGVtZW50LCBzY2FsZSk7XG4gICAgICBpZiAobm9kZSkge1xuICAgICAgICBmaWdtYU5vZGVzW2VsZW1lbnQuaWRdID0gbm9kZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS53YXJuKGBFcnJvciBjcmVhdGluZyBub2RlIGZvciBlbGVtZW50ICR7ZWxlbWVudC5pZH06YCwgZXJyb3IpO1xuICAgICAgLy8gQ29udGludWUgd2l0aCBvdGhlciBlbGVtZW50c1xuICAgIH1cbiAgfVxuICBcbiAgcmV0dXJuIGZpZ21hTm9kZXM7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGFuIGVsZW1lbnQgaXMgbGlrZWx5IHRvIGJlIGEgY29ubmVjdG9yIHJhdGhlciB0aGFuIGEgbm9kZVxuICovXG5mdW5jdGlvbiBpc0Nvbm5lY3RvcihlbGVtZW50OiBhbnkpOiBib29sZWFuIHtcbiAgLy8gTGluZXMgYXJlIGFsbW9zdCBhbHdheXMgY29ubmVjdG9yc1xuICBpZiAoZWxlbWVudC50eXBlID09PSAnbGluZScpIHJldHVybiB0cnVlO1xuICBcbiAgLy8gUGF0aHMgYW5kIHBvbHlsaW5lcyB3aXRoIFwibm9uZVwiIGZpbGwgYXJlIGxpa2VseSBjb25uZWN0b3JzXG4gIGlmICgoZWxlbWVudC50eXBlID09PSAncGF0aCcgfHwgZWxlbWVudC50eXBlID09PSAncG9seWxpbmUnKSAmJiBcbiAgICAgIGVsZW1lbnQuZmlsbCA9PT0gJ25vbmUnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgRmlnbWEgbm9kZSBmcm9tIGFuIFNWRyBlbGVtZW50XG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUZpZ21hTm9kZShlbGVtZW50OiBhbnksIHNjYWxlOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH0pOiBQcm9taXNlPFNjZW5lTm9kZSB8IG51bGw+IHtcbiAgLy8gU2NhbGUgY29vcmRpbmF0ZXNcbiAgY29uc3QgeCA9IGVsZW1lbnQueCAqIHNjYWxlLng7XG4gIGNvbnN0IHkgPSBlbGVtZW50LnkgKiBzY2FsZS55O1xuICBjb25zdCB3aWR0aCA9IGVsZW1lbnQud2lkdGggKiBzY2FsZS54O1xuICBjb25zdCBoZWlnaHQgPSBlbGVtZW50LmhlaWdodCAqIHNjYWxlLnk7XG4gIFxuICBsZXQgbm9kZTogU2NlbmVOb2RlIHwgbnVsbCA9IG51bGw7XG4gIFxuICAvLyBDaG9vc2UgdGhlIG5vZGUgdHlwZSBiYXNlZCBvbiB0aGUgU1ZHIGVsZW1lbnQgdHlwZVxuICBzd2l0Y2ggKGVsZW1lbnQudHlwZSkge1xuICAgIGNhc2UgJ3JlY3QnOlxuICAgICAgbm9kZSA9IGZpZ21hLmNyZWF0ZVJlY3RhbmdsZSgpO1xuICAgICAgbm9kZS54ID0geDtcbiAgICAgIG5vZGUueSA9IHk7XG4gICAgICBub2RlLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgIGJyZWFrO1xuICAgICAgXG4gICAgY2FzZSAnY2lyY2xlJzpcbiAgICAgIG5vZGUgPSBmaWdtYS5jcmVhdGVFbGxpcHNlKCk7XG4gICAgICBub2RlLnggPSB4O1xuICAgICAgbm9kZS55ID0geTtcbiAgICAgIG5vZGUucmVzaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgYnJlYWs7XG4gICAgICBcbiAgICBjYXNlICdlbGxpcHNlJzpcbiAgICAgIG5vZGUgPSBmaWdtYS5jcmVhdGVFbGxpcHNlKCk7XG4gICAgICBub2RlLnggPSB4O1xuICAgICAgbm9kZS55ID0geTtcbiAgICAgIG5vZGUucmVzaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgYnJlYWs7XG4gICAgICBcbiAgICBjYXNlICdwb2x5Z29uJzpcbiAgICAgIC8vIEZvciBwb2x5Z29ucywgY3JlYXRlIGEgc2hhcGUgd2l0aCBhIHZlY3RvciBuZXR3b3JrXG4gICAgICBjb25zdCBwb2x5Z29uID0gZmlnbWEuY3JlYXRlUG9seWdvbigpO1xuICAgICAgcG9seWdvbi54ID0geDtcbiAgICAgIHBvbHlnb24ueSA9IHk7XG4gICAgICBwb2x5Z29uLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgIG5vZGUgPSBwb2x5Z29uO1xuICAgICAgYnJlYWs7XG4gICAgICBcbiAgICBjYXNlICdwYXRoJzpcbiAgICAgIC8vIElmIHRoZSBwYXRoIGhhcyBhIGZpbGwsIGl0J3MgbGlrZWx5IGEgc2hhcGUgbm9kZVxuICAgICAgaWYgKGVsZW1lbnQuZmlsbCAhPT0gJ25vbmUnKSB7XG4gICAgICAgIGNvbnN0IHNoYXBlID0gZmlnbWEuY3JlYXRlUmVjdGFuZ2xlKCk7ICAvLyBBcyBhIGZhbGxiYWNrXG4gICAgICAgIHNoYXBlLnggPSB4O1xuICAgICAgICBzaGFwZS55ID0geTtcbiAgICAgICAgc2hhcGUucmVzaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICBub2RlID0gc2hhcGU7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICAgIFxuICAgIGNhc2UgJ3RleHQnOlxuICAgICAgY29uc3QgdGV4dCA9IGZpZ21hLmNyZWF0ZVRleHQoKTtcbiAgICAgIGF3YWl0IGZpZ21hLmxvYWRGb250QXN5bmMoeyBmYW1pbHk6IFwiSW50ZXJcIiwgc3R5bGU6IFwiUmVndWxhclwiIH0pO1xuICAgICAgdGV4dC54ID0geDtcbiAgICAgIHRleHQueSA9IHk7XG4gICAgICB0ZXh0LnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgIHRleHQuY2hhcmFjdGVycyA9IGVsZW1lbnQudGV4dCB8fCAnJztcbiAgICAgIG5vZGUgPSB0ZXh0O1xuICAgICAgYnJlYWs7XG4gICAgICBcbiAgICBjYXNlICdncm91cCc6XG4gICAgICAvLyBGb3IgZ3JvdXBzLCBjcmVhdGUgYSBmcmFtZSBhbmQgYWRkIGNoaWxkcmVuXG4gICAgICBjb25zdCBmcmFtZSA9IGZpZ21hLmNyZWF0ZUZyYW1lKCk7XG4gICAgICBmcmFtZS54ID0geDtcbiAgICAgIGZyYW1lLnkgPSB5O1xuICAgICAgZnJhbWUucmVzaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgXG4gICAgICAvLyBQcm9jZXNzIGNoaWxkcmVuIHJlY3Vyc2l2ZWx5XG4gICAgICBpZiAoZWxlbWVudC5jaGlsZHJlbiAmJiBlbGVtZW50LmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgY2hpbGROb2RlcyA9IGF3YWl0IGNyZWF0ZUZpZ21hTm9kZXMoZWxlbWVudC5jaGlsZHJlbiwgc2NhbGUpO1xuICAgICAgICBcbiAgICAgICAgLy8gQWRkIGNoaWxkcmVuIHRvIHRoZSBmcmFtZVxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkTm9kZSBvZiBPYmplY3QudmFsdWVzKGNoaWxkTm9kZXMpKSB7XG4gICAgICAgICAgLy8gQWRqdXN0IHBvc2l0aW9uIHJlbGF0aXZlIHRvIGZyYW1lXG4gICAgICAgICAgY2hpbGROb2RlLnggLT0geDtcbiAgICAgICAgICBjaGlsZE5vZGUueSAtPSB5O1xuICAgICAgICAgIGZyYW1lLmFwcGVuZENoaWxkKGNoaWxkTm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgbm9kZSA9IGZyYW1lO1xuICAgICAgYnJlYWs7XG4gIH1cbiAgXG4gIC8vIEFwcGx5IGNvbW1vbiBwcm9wZXJ0aWVzIGlmIGEgbm9kZSB3YXMgY3JlYXRlZFxuICBpZiAobm9kZSkge1xuICAgIC8vIFNldCBuYW1lXG4gICAgbm9kZS5uYW1lID0gZWxlbWVudC5pZCB8fCBgJHtlbGVtZW50LnR5cGV9LW5vZGVgO1xuICAgIFxuICAgIC8vIEFwcGx5IGZpbGxzIGlmIGFwcGxpY2FibGVcbiAgICBpZiAoJ2ZpbGxzJyBpbiBub2RlICYmIGVsZW1lbnQuZmlsbCAmJiBlbGVtZW50LmZpbGwgIT09ICdub25lJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmdiQ29sb3IgPSBwYXJzZUNvbG9yKGVsZW1lbnQuZmlsbCk7XG4gICAgICAgIG5vZGUuZmlsbHMgPSBbe1xuICAgICAgICAgIHR5cGU6ICdTT0xJRCcsXG4gICAgICAgICAgY29sb3I6IHJnYkNvbG9yLFxuICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgfV07XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLndhcm4oYENvdWxkIG5vdCBhcHBseSBmaWxsIGZvciBub2RlICR7bm9kZS5uYW1lfTpgLCBlcnJvcik7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIEFwcGx5IHN0cm9rZXMgaWYgYXBwbGljYWJsZVxuICAgIGlmICgnc3Ryb2tlcycgaW4gbm9kZSAmJiBlbGVtZW50LnN0cm9rZSAmJiBlbGVtZW50LnN0cm9rZSAhPT0gJ25vbmUnKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZ2JDb2xvciA9IHBhcnNlQ29sb3IoZWxlbWVudC5zdHJva2UpO1xuICAgICAgICBub2RlLnN0cm9rZXMgPSBbe1xuICAgICAgICAgIHR5cGU6ICdTT0xJRCcsXG4gICAgICAgICAgY29sb3I6IHJnYkNvbG9yLFxuICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgfV07XG4gICAgICAgIFxuICAgICAgICBpZiAoZWxlbWVudC5zdHJva2VXaWR0aCkge1xuICAgICAgICAgIG5vZGUuc3Ryb2tlV2VpZ2h0ID0gZWxlbWVudC5zdHJva2VXaWR0aDtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGBDb3VsZCBub3QgYXBwbHkgc3Ryb2tlIGZvciBub2RlICR7bm9kZS5uYW1lfTpgLCBlcnJvcik7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICByZXR1cm4gbm9kZTtcbn1cblxuLyoqXG4gKiBQYXJzZXMgYSBjb2xvciBzdHJpbmcgKGhleCwgcmdiLCBldGMuKSB0byBSR0IgY29tcG9uZW50c1xuICovXG5mdW5jdGlvbiBwYXJzZUNvbG9yKGNvbG9yU3RyOiBzdHJpbmcpOiB7IHI6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIgfSB7XG4gIC8vIERlZmF1bHQgY29sb3IgaWYgcGFyc2luZyBmYWlsc1xuICBjb25zdCBkZWZhdWx0Q29sb3IgPSB7IHI6IDAsIGc6IDAsIGI6IDAgfTtcbiAgXG4gIHRyeSB7XG4gICAgLy8gSGFuZGxlIGhleCBmb3JtYXQgKCNSUkdHQkIpXG4gICAgaWYgKGNvbG9yU3RyLnN0YXJ0c1dpdGgoJyMnKSkge1xuICAgICAgY29uc3QgaGV4ID0gY29sb3JTdHIuc2xpY2UoMSk7XG4gICAgICBpZiAoaGV4Lmxlbmd0aCA9PT0gNikge1xuICAgICAgICBjb25zdCByID0gcGFyc2VJbnQoaGV4LnN1YnN0cmluZygwLCAyKSwgMTYpIC8gMjU1O1xuICAgICAgICBjb25zdCBnID0gcGFyc2VJbnQoaGV4LnN1YnN0cmluZygyLCA0KSwgMTYpIC8gMjU1O1xuICAgICAgICBjb25zdCBiID0gcGFyc2VJbnQoaGV4LnN1YnN0cmluZyg0LCA2KSwgMTYpIC8gMjU1O1xuICAgICAgICByZXR1cm4geyByLCBnLCBiIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gZGVmYXVsdENvbG9yO1xuICAgIH1cbiAgICBcbiAgICAvLyBIYW5kbGUgcmdiIGZvcm1hdFxuICAgIGlmIChjb2xvclN0ci5zdGFydHNXaXRoKCdyZ2InKSkge1xuICAgICAgY29uc3QgbWF0Y2ggPSBjb2xvclN0ci5tYXRjaCgvcmdiXFwoXFxzKihcXGQrKVxccyosXFxzKihcXGQrKVxccyosXFxzKihcXGQrKVxccypcXCkvKTtcbiAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICBjb25zdCByID0gcGFyc2VJbnQobWF0Y2hbMV0sIDEwKSAvIDI1NTtcbiAgICAgICAgY29uc3QgZyA9IHBhcnNlSW50KG1hdGNoWzJdLCAxMCkgLyAyNTU7XG4gICAgICAgIGNvbnN0IGIgPSBwYXJzZUludChtYXRjaFszXSwgMTApIC8gMjU1O1xuICAgICAgICByZXR1cm4geyByLCBnLCBiIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gZGVmYXVsdENvbG9yO1xuICAgIH1cbiAgICBcbiAgICAvLyBIYW5kbGUgbmFtZWQgY29sb3JzIChzaW1wbGlmaWVkKVxuICAgIGNvbnN0IG5hbWVkQ29sb3JzOiB7IFtuYW1lOiBzdHJpbmddOiB7IHI6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIgfSB9ID0ge1xuICAgICAgYmxhY2s6IHsgcjogMCwgZzogMCwgYjogMCB9LFxuICAgICAgd2hpdGU6IHsgcjogMSwgZzogMSwgYjogMSB9LFxuICAgICAgcmVkOiB7IHI6IDEsIGc6IDAsIGI6IDAgfSxcbiAgICAgIGdyZWVuOiB7IHI6IDAsIGc6IDEsIGI6IDAgfSxcbiAgICAgIGJsdWU6IHsgcjogMCwgZzogMCwgYjogMSB9LFxuICAgICAgZ3JheTogeyByOiAwLjUsIGc6IDAuNSwgYjogMC41IH0sXG4gICAgICB5ZWxsb3c6IHsgcjogMSwgZzogMSwgYjogMCB9LFxuICAgICAgcHVycGxlOiB7IHI6IDAuNSwgZzogMCwgYjogMC41IH0sXG4gICAgICBvcmFuZ2U6IHsgcjogMSwgZzogMC42NSwgYjogMCB9LFxuICAgIH07XG4gICAgXG4gICAgaWYgKG5hbWVkQ29sb3JzW2NvbG9yU3RyLnRvTG93ZXJDYXNlKCldKSB7XG4gICAgICByZXR1cm4gbmFtZWRDb2xvcnNbY29sb3JTdHIudG9Mb3dlckNhc2UoKV07XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBkZWZhdWx0Q29sb3I7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS53YXJuKCdFcnJvciBwYXJzaW5nIGNvbG9yOicsIGVycm9yKTtcbiAgICByZXR1cm4gZGVmYXVsdENvbG9yO1xuICB9XG59XG5cbi8qKlxuICogQ3JlYXRlcyBjb25uZWN0b3IgbGluZXMgYmV0d2VlbiBub2Rlc1xuICovXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVDb25uZWN0aW9ucyhcbiAgZmlnbWFOb2RlczogeyBbaWQ6IHN0cmluZ106IFNjZW5lTm9kZSB9LFxuICBlbGVtZW50czogYW55W11cbik6IFByb21pc2U8dm9pZD4ge1xuICAvLyBDcmVhdGUgYSBtYXAgZm9yIGVsZW1lbnRzXG4gIGNvbnN0IGVsZW1lbnRzTWFwOiB7IFtpZDogc3RyaW5nXTogYW55IH0gPSB7fTtcbiAgZWxlbWVudHMuZm9yRWFjaChlbCA9PiB7XG4gICAgZWxlbWVudHNNYXBbZWwuaWRdID0gZWw7XG4gIH0pO1xuICBcbiAgLy8gUHJvY2VzcyBlYWNoIGVsZW1lbnQncyBjb25uZWN0aW9uc1xuICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgZWxlbWVudHMpIHtcbiAgICBpZiAoIWVsZW1lbnQuY29ubmVjdGlvbnMgfHwgZWxlbWVudC5jb25uZWN0aW9ucy5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuICAgIFxuICAgIGZvciAoY29uc3QgY29ubmVjdGlvbiBvZiBlbGVtZW50LmNvbm5lY3Rpb25zKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBmcm9tTm9kZSA9IGZpZ21hTm9kZXNbY29ubmVjdGlvbi5mcm9tSWRdO1xuICAgICAgICBjb25zdCB0b05vZGUgPSBmaWdtYU5vZGVzW2Nvbm5lY3Rpb24udG9JZF07XG4gICAgICAgIFxuICAgICAgICBpZiAoIWZyb21Ob2RlIHx8ICF0b05vZGUpIGNvbnRpbnVlO1xuICAgICAgICBcbiAgICAgICAgLy8gQ3JlYXRlIGEgY29ubmVjdG9yXG4gICAgICAgIGNvbnN0IGNvbm5lY3RvciA9IGZpZ21hLmNyZWF0ZUNvbm5lY3RvcigpO1xuICAgICAgICBjb25uZWN0b3IubmFtZSA9IGBDb25uZWN0b3I6ICR7Y29ubmVjdGlvbi5mcm9tSWR9IOKGkiAke2Nvbm5lY3Rpb24udG9JZH1gO1xuICAgICAgICBcbiAgICAgICAgLy8gU2V0IGNvbm5lY3RvciBlbmRwb2ludHNcbiAgICAgICAgY29ubmVjdG9yLmNvbm5lY3RvclN0YXJ0ID0ge1xuICAgICAgICAgIGVuZHBvaW50Tm9kZUlkOiBmcm9tTm9kZS5pZCxcbiAgICAgICAgICBtYWduZXQ6ICdBVVRPJ1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgY29ubmVjdG9yLmNvbm5lY3RvckVuZCA9IHtcbiAgICAgICAgICBlbmRwb2ludE5vZGVJZDogdG9Ob2RlLmlkLFxuICAgICAgICAgIG1hZ25ldDogJ0FVVE8nXG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICAvLyBTZXQgc3Ryb2tlIHByb3BlcnRpZXNcbiAgICAgICAgY29ubmVjdG9yLnN0cm9rZXMgPSBbe1xuICAgICAgICAgIHR5cGU6ICdTT0xJRCcsXG4gICAgICAgICAgY29sb3I6IHsgcjogMCwgZzogMCwgYjogMCB9LFxuICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgfV07XG4gICAgICAgIFxuICAgICAgICBjb25uZWN0b3Iuc3Ryb2tlV2VpZ2h0ID0gMTtcbiAgICAgICAgXG4gICAgICAgIC8vIEFkdmFuY2VkOiBJZiB3ZSBoYXZlIHNwZWNpZmljIHBvaW50cyBmb3IgdGhlIGNvbm5lY3RvciBwYXRoXG4gICAgICAgIGlmIChjb25uZWN0aW9uLnBvaW50cyAmJiBjb25uZWN0aW9uLnBvaW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgLy8gVGhpcyBpcyBqdXN0IGEgcGxhY2Vob2xkZXIgLSBhY3R1YWwgbWFuaXB1bGF0aW9uIG9mIGNvbm5lY3RvciBwYXRoc1xuICAgICAgICAgIC8vIHdvdWxkIHJlcXVpcmUgbW9yZSBjb21wbGV4IGludGVyYWN0aW9ucyB3aXRoIHRoZSBGaWdtYSBBUElcbiAgICAgICAgICBjb25zb2xlLmxvZygnQ29ubmVjdGlvbiBoYXMgc3BlY2lmaWMgcG9pbnRzOicsIGNvbm5lY3Rpb24ucG9pbnRzKTtcbiAgICAgICAgICBcbiAgICAgICAgICAvLyBBcyBhIHNpbXBsZSBhcHByb3hpbWF0aW9uLCB3ZSBjb3VsZCBhZGQgcm91bmRlZCBjb3JuZXJzXG4gICAgICAgICAgLy8gTm90ZTogc3Ryb2tlQ2FwIHByb3BlcnR5IGlzIG5vdCBhdmFpbGFibGUgb24gQ29ubmVjdG9yTm9kZVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLndhcm4oYEVycm9yIGNyZWF0aW5nIGNvbm5lY3Rpb24gZnJvbSAke2Nvbm5lY3Rpb24uZnJvbUlkfSB0byAke2Nvbm5lY3Rpb24udG9JZH06YCwgZXJyb3IpO1xuICAgICAgICAvLyBDb250aW51ZSB3aXRoIG90aGVyIGNvbm5lY3Rpb25zXG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCJpbnRlcmZhY2UgU3ZnRWxlbWVudCB7XG4gIHR5cGU6IHN0cmluZztcbiAgaWQ6IHN0cmluZztcbiAgeDogbnVtYmVyO1xuICB5OiBudW1iZXI7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICBwYXRoRGF0YT86IHN0cmluZztcbiAgdGV4dD86IHN0cmluZztcbiAgZmlsbD86IHN0cmluZztcbiAgc3Ryb2tlPzogc3RyaW5nO1xuICBzdHJva2VXaWR0aD86IG51bWJlcjtcbiAgY29ubmVjdGlvbnM6IEFycmF5PHtcbiAgICBmcm9tSWQ6IHN0cmluZztcbiAgICB0b0lkOiBzdHJpbmc7XG4gICAgcG9pbnRzPzogbnVtYmVyW11bXTtcbiAgfT47XG4gIGNoaWxkcmVuPzogU3ZnRWxlbWVudFtdO1xufVxuXG5pbnRlcmZhY2UgUGFyc2VkU3ZnIHtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIHZpZXdCb3g6IHtcbiAgICBtaW5YOiBudW1iZXI7XG4gICAgbWluWTogbnVtYmVyO1xuICAgIHdpZHRoOiBudW1iZXI7XG4gICAgaGVpZ2h0OiBudW1iZXI7XG4gIH07XG4gIGVsZW1lbnRzOiBTdmdFbGVtZW50W107XG59XG5cbi8qKlxuICogUGFyc2VzIGFuIFNWRyBzdHJpbmcgYW5kIGV4dHJhY3RzIGZsb3djaGFydCBlbGVtZW50cyBhbmQgdGhlaXIgcmVsYXRpb25zaGlwc1xuICogQHBhcmFtIHN2Z0NvbnRlbnQgVGhlIFNWRyBmaWxlIGNvbnRlbnQgYXMgYSBzdHJpbmdcbiAqIEByZXR1cm5zIEEgcGFyc2VkIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBTVkdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlU3ZnKHN2Z0NvbnRlbnQ6IHN0cmluZyk6IFBhcnNlZFN2ZyB7XG4gIHRyeSB7XG4gICAgLy8gRm9yIEZpZ21hIHBsdWdpbiBlbnZpcm9ubWVudCwgd2UnbGwgdXNlIGEgc2ltcGxpZmllZCBwYXJzaW5nIGFwcHJvYWNoXG4gICAgXG4gICAgLy8gQmFzaWMgY2hlY2sgZm9yIFNWRyBmb3JtYXRcbiAgICBpZiAoIXN2Z0NvbnRlbnQuaW5jbHVkZXMoJzxzdmcnKSB8fCAhc3ZnQ29udGVudC5pbmNsdWRlcygnPC9zdmc+JykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBTVkcgZmlsZTogTWlzc2luZyBTVkcgdGFncycpO1xuICAgIH1cbiAgICBcbiAgICAvLyBFeHRyYWN0IHJvb3QgU1ZHIGVsZW1lbnQgcHJvcGVydGllcyB1c2luZyByZWdleFxuICAgIGNvbnN0IHdpZHRoTWF0Y2ggPSBzdmdDb250ZW50Lm1hdGNoKC93aWR0aD1bXCInXShbXlwiJ10qKVtcIiddLyk7XG4gICAgY29uc3QgaGVpZ2h0TWF0Y2ggPSBzdmdDb250ZW50Lm1hdGNoKC9oZWlnaHQ9W1wiJ10oW15cIiddKilbXCInXS8pO1xuICAgIGNvbnN0IHZpZXdCb3hNYXRjaCA9IHN2Z0NvbnRlbnQubWF0Y2goL3ZpZXdCb3g9W1wiJ10oW15cIiddKilbXCInXS8pO1xuICAgIFxuICAgIGNvbnN0IHN2Z1dpZHRoID0gd2lkdGhNYXRjaCA/IHBhcnNlRmxvYXQod2lkdGhNYXRjaFsxXSkgOiAwO1xuICAgIGNvbnN0IHN2Z0hlaWdodCA9IGhlaWdodE1hdGNoID8gcGFyc2VGbG9hdChoZWlnaHRNYXRjaFsxXSkgOiAwO1xuICAgIFxuICAgIC8vIFBhcnNlIHZpZXdCb3hcbiAgICBsZXQgdmlld0JveCA9IHtcbiAgICAgIG1pblg6IDAsXG4gICAgICBtaW5ZOiAwLFxuICAgICAgd2lkdGg6IHN2Z1dpZHRoIHx8IDgwMCxcbiAgICAgIGhlaWdodDogc3ZnSGVpZ2h0IHx8IDYwMFxuICAgIH07XG4gICAgXG4gICAgaWYgKHZpZXdCb3hNYXRjaCkge1xuICAgICAgY29uc3Qgdmlld0JveFZhbHVlcyA9IHZpZXdCb3hNYXRjaFsxXS5zcGxpdCgvXFxzKy8pLm1hcChwYXJzZUZsb2F0KTtcbiAgICAgIGlmICh2aWV3Qm94VmFsdWVzLmxlbmd0aCA+PSA0KSB7XG4gICAgICAgIHZpZXdCb3ggPSB7XG4gICAgICAgICAgbWluWDogdmlld0JveFZhbHVlc1swXSB8fCAwLFxuICAgICAgICAgIG1pblk6IHZpZXdCb3hWYWx1ZXNbMV0gfHwgMCxcbiAgICAgICAgICB3aWR0aDogdmlld0JveFZhbHVlc1syXSB8fCBzdmdXaWR0aCB8fCA4MDAsXG4gICAgICAgICAgaGVpZ2h0OiB2aWV3Qm94VmFsdWVzWzNdIHx8IHN2Z0hlaWdodCB8fCA2MDBcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gQ3JlYXRlIGEgc2ltcGxpZmllZCBwYXJzaW5nIGFwcHJvYWNoIHRvIGV4dHJhY3QgZWxlbWVudHNcbiAgICBjb25zdCBlbGVtZW50czogU3ZnRWxlbWVudFtdID0gW107XG4gICAgXG4gICAgLy8gRXh0cmFjdCByZWN0YW5nbGVzIHdpdGggcmVnZXhcbiAgICBjb25zdCByZWN0UmVnZXggPSAvPHJlY3RbXj5dKj94PVtcIiddKFteXCInXSopW1wiJ11bXj5dKj95PVtcIiddKFteXCInXSopW1wiJ11bXj5dKj93aWR0aD1bXCInXShbXlwiJ10qKVtcIiddW14+XSo/aGVpZ2h0PVtcIiddKFteXCInXSopW1wiJ11bXj5dKj8oPzpcXC8+fD48XFwvcmVjdD4pL2c7XG4gICAgbGV0IHJlY3RNYXRjaDtcbiAgICB3aGlsZSAoKHJlY3RNYXRjaCA9IHJlY3RSZWdleC5leGVjKHN2Z0NvbnRlbnQpKSAhPT0gbnVsbCkge1xuICAgICAgZWxlbWVudHMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdyZWN0JyxcbiAgICAgICAgaWQ6IGByZWN0LSR7Z2VuZXJhdGVJZCgpfWAsXG4gICAgICAgIHg6IHBhcnNlRmxvYXQocmVjdE1hdGNoWzFdKSxcbiAgICAgICAgeTogcGFyc2VGbG9hdChyZWN0TWF0Y2hbMl0pLFxuICAgICAgICB3aWR0aDogcGFyc2VGbG9hdChyZWN0TWF0Y2hbM10pLFxuICAgICAgICBoZWlnaHQ6IHBhcnNlRmxvYXQocmVjdE1hdGNoWzRdKSxcbiAgICAgICAgZmlsbDogJ3doaXRlJyxcbiAgICAgICAgc3Ryb2tlOiAnYmxhY2snLFxuICAgICAgICBzdHJva2VXaWR0aDogMSxcbiAgICAgICAgY29ubmVjdGlvbnM6IFtdXG4gICAgICB9KTtcbiAgICB9XG4gICAgXG4gICAgLy8gRXh0cmFjdCBjaXJjbGVzIHdpdGggcmVnZXhcbiAgICBjb25zdCBjaXJjbGVSZWdleCA9IC88Y2lyY2xlW14+XSo/Y3g9W1wiJ10oW15cIiddKilbXCInXVtePl0qP2N5PVtcIiddKFteXCInXSopW1wiJ11bXj5dKj9yPVtcIiddKFteXCInXSopW1wiJ11bXj5dKj8oPzpcXC8+fD48XFwvY2lyY2xlPikvZztcbiAgICBsZXQgY2lyY2xlTWF0Y2g7XG4gICAgd2hpbGUgKChjaXJjbGVNYXRjaCA9IGNpcmNsZVJlZ2V4LmV4ZWMoc3ZnQ29udGVudCkpICE9PSBudWxsKSB7XG4gICAgICBjb25zdCBjeCA9IHBhcnNlRmxvYXQoY2lyY2xlTWF0Y2hbMV0pO1xuICAgICAgY29uc3QgY3kgPSBwYXJzZUZsb2F0KGNpcmNsZU1hdGNoWzJdKTtcbiAgICAgIGNvbnN0IHIgPSBwYXJzZUZsb2F0KGNpcmNsZU1hdGNoWzNdKTtcbiAgICAgIFxuICAgICAgZWxlbWVudHMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdjaXJjbGUnLFxuICAgICAgICBpZDogYGNpcmNsZS0ke2dlbmVyYXRlSWQoKX1gLFxuICAgICAgICB4OiBjeCAtIHIsXG4gICAgICAgIHk6IGN5IC0gcixcbiAgICAgICAgd2lkdGg6IHIgKiAyLFxuICAgICAgICBoZWlnaHQ6IHIgKiAyLFxuICAgICAgICBmaWxsOiAnd2hpdGUnLFxuICAgICAgICBzdHJva2U6ICdibGFjaycsXG4gICAgICAgIHN0cm9rZVdpZHRoOiAxLFxuICAgICAgICBjb25uZWN0aW9uczogW11cbiAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICAvLyBFeHRyYWN0IGxpbmVzIChzaW1wbGlmaWVkIGZvciBjb25uZWN0b3JzKVxuICAgIGNvbnN0IGxpbmVSZWdleCA9IC88bGluZVtePl0qP3gxPVtcIiddKFteXCInXSopW1wiJ11bXj5dKj95MT1bXCInXShbXlwiJ10qKVtcIiddW14+XSo/eDI9W1wiJ10oW15cIiddKilbXCInXVtePl0qP3kyPVtcIiddKFteXCInXSopW1wiJ11bXj5dKj8oPzpcXC8+fD48XFwvbGluZT4pL2c7XG4gICAgbGV0IGxpbmVNYXRjaDtcbiAgICB3aGlsZSAoKGxpbmVNYXRjaCA9IGxpbmVSZWdleC5leGVjKHN2Z0NvbnRlbnQpKSAhPT0gbnVsbCkge1xuICAgICAgY29uc3QgeDEgPSBwYXJzZUZsb2F0KGxpbmVNYXRjaFsxXSk7XG4gICAgICBjb25zdCB5MSA9IHBhcnNlRmxvYXQobGluZU1hdGNoWzJdKTtcbiAgICAgIGNvbnN0IHgyID0gcGFyc2VGbG9hdChsaW5lTWF0Y2hbM10pO1xuICAgICAgY29uc3QgeTIgPSBwYXJzZUZsb2F0KGxpbmVNYXRjaFs0XSk7XG4gICAgICBcbiAgICAgIGVsZW1lbnRzLnB1c2goe1xuICAgICAgICB0eXBlOiAnbGluZScsXG4gICAgICAgIGlkOiBgbGluZS0ke2dlbmVyYXRlSWQoKX1gLFxuICAgICAgICB4OiBNYXRoLm1pbih4MSwgeDIpLFxuICAgICAgICB5OiBNYXRoLm1pbih5MSwgeTIpLFxuICAgICAgICB3aWR0aDogTWF0aC5hYnMoeDIgLSB4MSksXG4gICAgICAgIGhlaWdodDogTWF0aC5hYnMoeTIgLSB5MSksXG4gICAgICAgIHBhdGhEYXRhOiBgTSR7eDF9LCR7eTF9IEwke3gyfSwke3kyfWAsXG4gICAgICAgIGZpbGw6ICdub25lJyxcbiAgICAgICAgc3Ryb2tlOiAnYmxhY2snLFxuICAgICAgICBzdHJva2VXaWR0aDogMSxcbiAgICAgICAgY29ubmVjdGlvbnM6IFtdXG4gICAgICB9KTtcbiAgICB9XG4gICAgXG4gICAgLy8gRXh0cmFjdCB0ZXh0IGVsZW1lbnRzXG4gICAgY29uc3QgdGV4dFJlZ2V4ID0gLzx0ZXh0W14+XSo/eD1bXCInXShbXlwiJ10qKVtcIiddW14+XSo/eT1bXCInXShbXlwiJ10qKVtcIiddW14+XSo/PihbXjxdKik8XFwvdGV4dD4vZztcbiAgICBsZXQgdGV4dE1hdGNoO1xuICAgIHdoaWxlICgodGV4dE1hdGNoID0gdGV4dFJlZ2V4LmV4ZWMoc3ZnQ29udGVudCkpICE9PSBudWxsKSB7XG4gICAgICBjb25zdCB4ID0gcGFyc2VGbG9hdCh0ZXh0TWF0Y2hbMV0pO1xuICAgICAgY29uc3QgeSA9IHBhcnNlRmxvYXQodGV4dE1hdGNoWzJdKTtcbiAgICAgIGNvbnN0IHRleHRDb250ZW50ID0gdGV4dE1hdGNoWzNdLnRyaW0oKTtcbiAgICAgIGNvbnN0IHdpZHRoID0gdGV4dENvbnRlbnQubGVuZ3RoICogODsgIC8vIFJvdWdoIGVzdGltYXRlXG4gICAgICBjb25zdCBoZWlnaHQgPSAxNjsgIC8vIFR5cGljYWwgdGV4dCBoZWlnaHRcbiAgICAgIFxuICAgICAgZWxlbWVudHMucHVzaCh7XG4gICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgaWQ6IGB0ZXh0LSR7Z2VuZXJhdGVJZCgpfWAsXG4gICAgICAgIHgsXG4gICAgICAgIHk6IHkgLSBoZWlnaHQsICAvLyBBZGp1c3QgeSBwb3NpdGlvblxuICAgICAgICB3aWR0aCxcbiAgICAgICAgaGVpZ2h0LFxuICAgICAgICB0ZXh0OiB0ZXh0Q29udGVudCxcbiAgICAgICAgZmlsbDogJ2JsYWNrJyxcbiAgICAgICAgc3Ryb2tlOiAnbm9uZScsXG4gICAgICAgIHN0cm9rZVdpZHRoOiAwLFxuICAgICAgICBjb25uZWN0aW9uczogW11cbiAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICAvLyBEZXRlcm1pbmUgY29ubmVjdGlvbnMgYmV0d2VlbiBlbGVtZW50c1xuICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBlbGVtZW50cykge1xuICAgICAgaWYgKGVsZW1lbnQudHlwZSA9PT0gJ2xpbmUnKSB7XG4gICAgICAgIGNvbnN0IGxpbmVNYXRjaCA9IGVsZW1lbnQucGF0aERhdGE/Lm1hdGNoKC9NKFtcXGQuLV0rKSwoW1xcZC4tXSspXFxzK0woW1xcZC4tXSspLChbXFxkLi1dKykvKTtcbiAgICAgICAgaWYgKGxpbmVNYXRjaCkge1xuICAgICAgICAgIGNvbnN0IHN0YXJ0WCA9IHBhcnNlRmxvYXQobGluZU1hdGNoWzFdKTtcbiAgICAgICAgICBjb25zdCBzdGFydFkgPSBwYXJzZUZsb2F0KGxpbmVNYXRjaFsyXSk7XG4gICAgICAgICAgY29uc3QgZW5kWCA9IHBhcnNlRmxvYXQobGluZU1hdGNoWzNdKTtcbiAgICAgICAgICBjb25zdCBlbmRZID0gcGFyc2VGbG9hdChsaW5lTWF0Y2hbNF0pO1xuICAgICAgICAgIFxuICAgICAgICAgIC8vIEZpbmQgbm9kZXMgdGhhdCBtaWdodCBiZSBjb25uZWN0ZWQgYnkgdGhpcyBsaW5lXG4gICAgICAgICAgY29uc3Qgc3RhcnROb2RlID0gZmluZE5vZGVBdFBvaW50KGVsZW1lbnRzLCBzdGFydFgsIHN0YXJ0WSwgZWxlbWVudC5pZCk7XG4gICAgICAgICAgY29uc3QgZW5kTm9kZSA9IGZpbmROb2RlQXRQb2ludChlbGVtZW50cywgZW5kWCwgZW5kWSwgZWxlbWVudC5pZCk7XG4gICAgICAgICAgXG4gICAgICAgICAgaWYgKHN0YXJ0Tm9kZSAmJiBlbmROb2RlKSB7XG4gICAgICAgICAgICBlbGVtZW50LmNvbm5lY3Rpb25zLnB1c2goe1xuICAgICAgICAgICAgICBmcm9tSWQ6IHN0YXJ0Tm9kZS5pZCxcbiAgICAgICAgICAgICAgdG9JZDogZW5kTm9kZS5pZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIEFsc28gYWRkIGNvbm5lY3Rpb24gdG8gdGhlIHNvdXJjZSBub2RlXG4gICAgICAgICAgICBzdGFydE5vZGUuY29ubmVjdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgIGZyb21JZDogc3RhcnROb2RlLmlkLFxuICAgICAgICAgICAgICB0b0lkOiBlbmROb2RlLmlkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgIHdpZHRoOiBzdmdXaWR0aCB8fCB2aWV3Qm94LndpZHRoLFxuICAgICAgaGVpZ2h0OiBzdmdIZWlnaHQgfHwgdmlld0JveC5oZWlnaHQsXG4gICAgICB2aWV3Qm94LFxuICAgICAgZWxlbWVudHNcbiAgICB9O1xuICB9IGNhdGNoIChlcnJvcjogdW5rbm93bikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHBhcnNpbmcgU1ZHOicsIGVycm9yKTtcbiAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFcnJvciBwYXJzaW5nIFNWRzogJHtlcnJvci5tZXNzYWdlfWApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIHBhcnNpbmcgU1ZHOiBVbmtub3duIGVycm9yJyk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogRmluZHMgYSBub2RlIGF0IHRoZSBnaXZlbiBjb29yZGluYXRlc1xuICovXG5mdW5jdGlvbiBmaW5kTm9kZUF0UG9pbnQoXG4gIGVsZW1lbnRzOiBTdmdFbGVtZW50W10sIFxuICB4OiBudW1iZXIsIFxuICB5OiBudW1iZXIsIFxuICBleGNsdWRlSWQ6IHN0cmluZ1xuKTogU3ZnRWxlbWVudCB8IG51bGwge1xuICBjb25zdCB0b2xlcmFuY2UgPSA1OyAgLy8gQWxsb3cgc29tZSBtYXJnaW4gZm9yIGNvbm5lY3Rpb24gcG9pbnRzXG4gIFxuICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgZWxlbWVudHMpIHtcbiAgICAvLyBTa2lwIGxpbmVzIGFuZCB0aGUgZWxlbWVudCBpdHNlbGZcbiAgICBpZiAoZWxlbWVudC5pZCA9PT0gZXhjbHVkZUlkIHx8IGVsZW1lbnQudHlwZSA9PT0gJ2xpbmUnKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgXG4gICAgaWYgKGVsZW1lbnQudHlwZSA9PT0gJ2NpcmNsZScpIHtcbiAgICAgIC8vIEZvciBjaXJjbGVzLCBjaGVjayBpZiBwb2ludCBpcyB3aXRoaW4gcmFkaXVzXG4gICAgICBjb25zdCBjZW50ZXJYID0gZWxlbWVudC54ICsgZWxlbWVudC53aWR0aCAvIDI7XG4gICAgICBjb25zdCBjZW50ZXJZID0gZWxlbWVudC55ICsgZWxlbWVudC5oZWlnaHQgLyAyO1xuICAgICAgY29uc3QgcmFkaXVzID0gZWxlbWVudC53aWR0aCAvIDI7XG4gICAgICBcbiAgICAgIGNvbnN0IGRpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KHggLSBjZW50ZXJYLCAyKSArIE1hdGgucG93KHkgLSBjZW50ZXJZLCAyKSk7XG4gICAgICBpZiAoZGlzdGFuY2UgPD0gcmFkaXVzICsgdG9sZXJhbmNlKSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBGb3IgcmVjdGFuZ2xlcyBhbmQgb3RoZXIgZWxlbWVudHMsIGNoZWNrIGlmIHBvaW50IGlzIHdpdGhpbiBib3VuZHNcbiAgICAgIGlmIChcbiAgICAgICAgeCA+PSBlbGVtZW50LnggLSB0b2xlcmFuY2UgJiZcbiAgICAgICAgeCA8PSBlbGVtZW50LnggKyBlbGVtZW50LndpZHRoICsgdG9sZXJhbmNlICYmXG4gICAgICAgIHkgPj0gZWxlbWVudC55IC0gdG9sZXJhbmNlICYmXG4gICAgICAgIHkgPD0gZWxlbWVudC55ICsgZWxlbWVudC5oZWlnaHQgKyB0b2xlcmFuY2VcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIFJlY3Vyc2l2ZWx5IHBhcnNlcyBTVkcgZWxlbWVudHNcbiAqL1xuZnVuY3Rpb24gcGFyc2VFbGVtZW50cyhwYXJlbnRFbGVtZW50OiBFbGVtZW50KTogU3ZnRWxlbWVudFtdIHtcbiAgY29uc3QgZWxlbWVudHM6IFN2Z0VsZW1lbnRbXSA9IFtdO1xuICBcbiAgLy8gRWxlbWVudHMgd2UncmUgaW50ZXJlc3RlZCBpbiBmb3IgZmxvd2NoYXJ0c1xuICBjb25zdCByZWxldmFudFRhZ3MgPSBbJ3JlY3QnLCAnY2lyY2xlJywgJ2VsbGlwc2UnLCAncGF0aCcsICdwb2x5Z29uJywgJ3BvbHlsaW5lJywgJ2xpbmUnLCAndGV4dCcsICdnJ107XG4gIFxuICAvLyBQcm9jZXNzIGNoaWxkIGVsZW1lbnRzXG4gIGZvciAoY29uc3QgY2hpbGQgb2YgQXJyYXkuZnJvbShwYXJlbnRFbGVtZW50LmNoaWxkcmVuKSkge1xuICAgIGNvbnN0IHRhZ05hbWUgPSBjaGlsZC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgXG4gICAgaWYgKCFyZWxldmFudFRhZ3MuaW5jbHVkZXModGFnTmFtZSkpIGNvbnRpbnVlO1xuICAgIFxuICAgIGlmICh0YWdOYW1lID09PSAnZycpIHtcbiAgICAgIC8vIEdyb3VwIGVsZW1lbnQgLSByZWN1cnNpdmVseSBwcm9jZXNzIGl0cyBjaGlsZHJlblxuICAgICAgY29uc3QgZ3JvdXBDaGlsZHJlbiA9IHBhcnNlRWxlbWVudHMoY2hpbGQpO1xuICAgICAgaWYgKGdyb3VwQ2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBpZCA9IGNoaWxkLmlkIHx8IGBncm91cC0ke2dlbmVyYXRlSWQoKX1gO1xuICAgICAgICBcbiAgICAgICAgLy8gQ2FsY3VsYXRlIGdyb3VwIGJvdW5kcyBmcm9tIGNoaWxkcmVuXG4gICAgICAgIGNvbnN0IGJvdW5kcyA9IGNhbGN1bGF0ZUdyb3VwQm91bmRzKGdyb3VwQ2hpbGRyZW4pO1xuICAgICAgICBcbiAgICAgICAgZWxlbWVudHMucHVzaCh7XG4gICAgICAgICAgdHlwZTogJ2dyb3VwJyxcbiAgICAgICAgICBpZCxcbiAgICAgICAgICB4OiBib3VuZHMueCxcbiAgICAgICAgICB5OiBib3VuZHMueSxcbiAgICAgICAgICB3aWR0aDogYm91bmRzLndpZHRoLFxuICAgICAgICAgIGhlaWdodDogYm91bmRzLmhlaWdodCxcbiAgICAgICAgICBjb25uZWN0aW9uczogW10sXG4gICAgICAgICAgY2hpbGRyZW46IGdyb3VwQ2hpbGRyZW5cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEluZGl2aWR1YWwgc2hhcGUgZWxlbWVudFxuICAgICAgY29uc3QgZWxlbWVudCA9IHBhcnNlU3ZnRWxlbWVudChjaGlsZCk7XG4gICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICBlbGVtZW50cy5wdXNoKGVsZW1lbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgcmV0dXJuIGVsZW1lbnRzO1xufVxuXG4vKipcbiAqIFBhcnNlcyBhIHNpbmdsZSBTVkcgZWxlbWVudFxuICovXG5mdW5jdGlvbiBwYXJzZVN2Z0VsZW1lbnQoZWxlbWVudDogRWxlbWVudCk6IFN2Z0VsZW1lbnQgfCBudWxsIHtcbiAgY29uc3QgdGFnTmFtZSA9IGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBpZCA9IGVsZW1lbnQuaWQgfHwgYCR7dGFnTmFtZX0tJHtnZW5lcmF0ZUlkKCl9YDtcbiAgXG4gIC8vIENvbW1vbiBzdHlsZSBhdHRyaWJ1dGVzXG4gIGNvbnN0IGZpbGwgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZmlsbCcpIHx8ICdub25lJztcbiAgY29uc3Qgc3Ryb2tlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3N0cm9rZScpIHx8ICdibGFjayc7XG4gIGNvbnN0IHN0cm9rZVdpZHRoID0gcGFyc2VGbG9hdChlbGVtZW50LmdldEF0dHJpYnV0ZSgnc3Ryb2tlLXdpZHRoJykgfHwgJzEnKTtcbiAgXG4gIGxldCBzdmdFbGVtZW50OiBTdmdFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIFxuICBzd2l0Y2ggKHRhZ05hbWUpIHtcbiAgICBjYXNlICdyZWN0Jzoge1xuICAgICAgY29uc3QgeCA9IHBhcnNlRmxvYXQoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3gnKSB8fCAnMCcpO1xuICAgICAgY29uc3QgeSA9IHBhcnNlRmxvYXQoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3knKSB8fCAnMCcpO1xuICAgICAgY29uc3Qgd2lkdGggPSBwYXJzZUZsb2F0KGVsZW1lbnQuZ2V0QXR0cmlidXRlKCd3aWR0aCcpIHx8ICcwJyk7XG4gICAgICBjb25zdCBoZWlnaHQgPSBwYXJzZUZsb2F0KGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdoZWlnaHQnKSB8fCAnMCcpO1xuICAgICAgXG4gICAgICBzdmdFbGVtZW50ID0ge1xuICAgICAgICB0eXBlOiAncmVjdCcsXG4gICAgICAgIGlkLFxuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICB3aWR0aCxcbiAgICAgICAgaGVpZ2h0LFxuICAgICAgICBmaWxsLFxuICAgICAgICBzdHJva2UsXG4gICAgICAgIHN0cm9rZVdpZHRoLFxuICAgICAgICBjb25uZWN0aW9uczogW11cbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgXG4gICAgY2FzZSAnY2lyY2xlJzoge1xuICAgICAgY29uc3QgY3ggPSBwYXJzZUZsb2F0KGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdjeCcpIHx8ICcwJyk7XG4gICAgICBjb25zdCBjeSA9IHBhcnNlRmxvYXQoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2N5JykgfHwgJzAnKTtcbiAgICAgIGNvbnN0IHIgPSBwYXJzZUZsb2F0KGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdyJykgfHwgJzAnKTtcbiAgICAgIFxuICAgICAgc3ZnRWxlbWVudCA9IHtcbiAgICAgICAgdHlwZTogJ2NpcmNsZScsXG4gICAgICAgIGlkLFxuICAgICAgICB4OiBjeCAtIHIsXG4gICAgICAgIHk6IGN5IC0gcixcbiAgICAgICAgd2lkdGg6IHIgKiAyLFxuICAgICAgICBoZWlnaHQ6IHIgKiAyLFxuICAgICAgICBmaWxsLFxuICAgICAgICBzdHJva2UsXG4gICAgICAgIHN0cm9rZVdpZHRoLFxuICAgICAgICBjb25uZWN0aW9uczogW11cbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgXG4gICAgY2FzZSAnZWxsaXBzZSc6IHtcbiAgICAgIGNvbnN0IGN4ID0gcGFyc2VGbG9hdChlbGVtZW50LmdldEF0dHJpYnV0ZSgnY3gnKSB8fCAnMCcpO1xuICAgICAgY29uc3QgY3kgPSBwYXJzZUZsb2F0KGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdjeScpIHx8ICcwJyk7XG4gICAgICBjb25zdCByeCA9IHBhcnNlRmxvYXQoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3J4JykgfHwgJzAnKTtcbiAgICAgIGNvbnN0IHJ5ID0gcGFyc2VGbG9hdChlbGVtZW50LmdldEF0dHJpYnV0ZSgncnknKSB8fCAnMCcpO1xuICAgICAgXG4gICAgICBzdmdFbGVtZW50ID0ge1xuICAgICAgICB0eXBlOiAnZWxsaXBzZScsXG4gICAgICAgIGlkLFxuICAgICAgICB4OiBjeCAtIHJ4LFxuICAgICAgICB5OiBjeSAtIHJ5LFxuICAgICAgICB3aWR0aDogcnggKiAyLFxuICAgICAgICBoZWlnaHQ6IHJ5ICogMixcbiAgICAgICAgZmlsbCxcbiAgICAgICAgc3Ryb2tlLFxuICAgICAgICBzdHJva2VXaWR0aCxcbiAgICAgICAgY29ubmVjdGlvbnM6IFtdXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIFxuICAgIGNhc2UgJ3BhdGgnOiB7XG4gICAgICBjb25zdCBwYXRoRGF0YSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkJykgfHwgJyc7XG4gICAgICAvLyBGb3IgcGF0aHMsIGVzdGltYXRlIGEgYm91bmRpbmcgYm94XG4gICAgICAvLyBJbiBicm93c2VyIGVudmlyb25tZW50cyB3ZSB3b3VsZCB1c2UgZ2V0QkJveCwgYnV0IGhlcmUgd2UnbGwgZXN0aW1hdGVcbiAgICAgIGNvbnN0IGJib3ggPSB7IHg6IDAsIHk6IDAsIHdpZHRoOiAxMDAsIGhlaWdodDogMTAwIH07XG4gICAgICBcbiAgICAgIHN2Z0VsZW1lbnQgPSB7XG4gICAgICAgIHR5cGU6ICdwYXRoJyxcbiAgICAgICAgaWQsXG4gICAgICAgIHg6IGJib3gueCxcbiAgICAgICAgeTogYmJveC55LFxuICAgICAgICB3aWR0aDogYmJveC53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBiYm94LmhlaWdodCxcbiAgICAgICAgcGF0aERhdGEsXG4gICAgICAgIGZpbGwsXG4gICAgICAgIHN0cm9rZSxcbiAgICAgICAgc3Ryb2tlV2lkdGgsXG4gICAgICAgIGNvbm5lY3Rpb25zOiBbXVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBcbiAgICBjYXNlICdwb2x5Z29uJzpcbiAgICBjYXNlICdwb2x5bGluZSc6IHtcbiAgICAgIGNvbnN0IHBvaW50cyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdwb2ludHMnKSB8fCAnJztcbiAgICAgIC8vIENhbGN1bGF0ZSBib3VuZGluZyBib3ggZnJvbSBwb2ludHNcbiAgICAgIGNvbnN0IHBvaW50QXJyYXkgPSBwb2ludHMudHJpbSgpLnNwbGl0KC9cXHMrfCwvKS5tYXAocGFyc2VGbG9hdCk7XG4gICAgICBjb25zdCB4UG9pbnRzID0gcG9pbnRBcnJheS5maWx0ZXIoKF8sIGkpID0+IGkgJSAyID09PSAwKTtcbiAgICAgIGNvbnN0IHlQb2ludHMgPSBwb2ludEFycmF5LmZpbHRlcigoXywgaSkgPT4gaSAlIDIgPT09IDEpO1xuICAgICAgXG4gICAgICBjb25zdCBtaW5YID0gTWF0aC5taW4oLi4ueFBvaW50cyk7XG4gICAgICBjb25zdCBtYXhYID0gTWF0aC5tYXgoLi4ueFBvaW50cyk7XG4gICAgICBjb25zdCBtaW5ZID0gTWF0aC5taW4oLi4ueVBvaW50cyk7XG4gICAgICBjb25zdCBtYXhZID0gTWF0aC5tYXgoLi4ueVBvaW50cyk7XG4gICAgICBcbiAgICAgIHN2Z0VsZW1lbnQgPSB7XG4gICAgICAgIHR5cGU6IHRhZ05hbWUsXG4gICAgICAgIGlkLFxuICAgICAgICB4OiBtaW5YLFxuICAgICAgICB5OiBtaW5ZLFxuICAgICAgICB3aWR0aDogbWF4WCAtIG1pblgsXG4gICAgICAgIGhlaWdodDogbWF4WSAtIG1pblksXG4gICAgICAgIHBhdGhEYXRhOiBwb2ludHMsXG4gICAgICAgIGZpbGwsXG4gICAgICAgIHN0cm9rZSxcbiAgICAgICAgc3Ryb2tlV2lkdGgsXG4gICAgICAgIGNvbm5lY3Rpb25zOiBbXVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBcbiAgICBjYXNlICdsaW5lJzoge1xuICAgICAgY29uc3QgeDEgPSBwYXJzZUZsb2F0KGVsZW1lbnQuZ2V0QXR0cmlidXRlKCd4MScpIHx8ICcwJyk7XG4gICAgICBjb25zdCB5MSA9IHBhcnNlRmxvYXQoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3kxJykgfHwgJzAnKTtcbiAgICAgIGNvbnN0IHgyID0gcGFyc2VGbG9hdChlbGVtZW50LmdldEF0dHJpYnV0ZSgneDInKSB8fCAnMCcpO1xuICAgICAgY29uc3QgeTIgPSBwYXJzZUZsb2F0KGVsZW1lbnQuZ2V0QXR0cmlidXRlKCd5MicpIHx8ICcwJyk7XG4gICAgICBcbiAgICAgIHN2Z0VsZW1lbnQgPSB7XG4gICAgICAgIHR5cGU6ICdsaW5lJyxcbiAgICAgICAgaWQsXG4gICAgICAgIHg6IE1hdGgubWluKHgxLCB4MiksXG4gICAgICAgIHk6IE1hdGgubWluKHkxLCB5MiksXG4gICAgICAgIHdpZHRoOiBNYXRoLmFicyh4MiAtIHgxKSxcbiAgICAgICAgaGVpZ2h0OiBNYXRoLmFicyh5MiAtIHkxKSxcbiAgICAgICAgcGF0aERhdGE6IGBNJHt4MX0sJHt5MX0gTCR7eDJ9LCR7eTJ9YCxcbiAgICAgICAgZmlsbCxcbiAgICAgICAgc3Ryb2tlLFxuICAgICAgICBzdHJva2VXaWR0aCxcbiAgICAgICAgY29ubmVjdGlvbnM6IFtdXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIFxuICAgIGNhc2UgJ3RleHQnOiB7XG4gICAgICBjb25zdCB4ID0gcGFyc2VGbG9hdChlbGVtZW50LmdldEF0dHJpYnV0ZSgneCcpIHx8ICcwJyk7XG4gICAgICBjb25zdCB5ID0gcGFyc2VGbG9hdChlbGVtZW50LmdldEF0dHJpYnV0ZSgneScpIHx8ICcwJyk7XG4gICAgICAvLyBGb3IgdGV4dCwgZXN0aW1hdGUgc2l6ZSBiYXNlZCBvbiBjb250ZW50XG4gICAgICBjb25zdCB0ZXh0ID0gZWxlbWVudC50ZXh0Q29udGVudCB8fCAnJztcbiAgICAgIC8vIFJvdWdoIGVzdGltYXRpb24gb2YgdGV4dCBkaW1lbnNpb25zXG4gICAgICBjb25zdCB3aWR0aCA9IHRleHQubGVuZ3RoICogODtcbiAgICAgIGNvbnN0IGhlaWdodCA9IDE2O1xuICAgICAgXG4gICAgICBzdmdFbGVtZW50ID0ge1xuICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgIGlkLFxuICAgICAgICB4LFxuICAgICAgICB5OiB5IC0gaGVpZ2h0LCAvLyBBZGp1c3QgeSBzaW5jZSB0ZXh0IGJhc2VsaW5lIGlzIGF0IHRoZSBib3R0b21cbiAgICAgICAgd2lkdGgsXG4gICAgICAgIGhlaWdodCxcbiAgICAgICAgdGV4dCxcbiAgICAgICAgZmlsbDogZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2ZpbGwnKSB8fCAnYmxhY2snLFxuICAgICAgICBzdHJva2U6ICdub25lJyxcbiAgICAgICAgc3Ryb2tlV2lkdGg6IDAsXG4gICAgICAgIGNvbm5lY3Rpb25zOiBbXVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBcbiAgcmV0dXJuIHN2Z0VsZW1lbnQ7XG59XG5cbi8qKlxuICogRGV0ZWN0cyBjb25uZWN0aW9ucyBiZXR3ZWVuIGVsZW1lbnRzIGJhc2VkIG9uIHByb3hpbWl0eSBhbmQgcGF0aCBlbmRwb2ludHNcbiAqL1xuZnVuY3Rpb24gZGV0ZWN0Q29ubmVjdGlvbnMoZWxlbWVudHM6IFN2Z0VsZW1lbnRbXSk6IEFycmF5PHtmcm9tSWQ6IHN0cmluZywgdG9JZDogc3RyaW5nLCBwb2ludHM/OiBudW1iZXJbXVtdfT4ge1xuICBjb25zdCBjb25uZWN0aW9uczogQXJyYXk8e2Zyb21JZDogc3RyaW5nLCB0b0lkOiBzdHJpbmcsIHBvaW50cz86IG51bWJlcltdW119PiA9IFtdO1xuICBcbiAgLy8gRmluZCBsaW5lLWxpa2UgZWxlbWVudHMgKHBhdGhzLCBsaW5lcywgcG9seWxpbmVzKSB0aGF0IG1pZ2h0IGJlIGNvbm5lY3RvcnNcbiAgY29uc3QgcG9zc2libGVDb25uZWN0b3JzID0gZWxlbWVudHMuZmlsdGVyKGVsID0+IFxuICAgIGVsLnR5cGUgPT09ICdwYXRoJyB8fCBlbC50eXBlID09PSAnbGluZScgfHwgZWwudHlwZSA9PT0gJ3BvbHlsaW5lJyk7XG4gIFxuICAvLyBGaW5kIG5vZGVzIChyZWN0YW5nbGVzLCBjaXJjbGVzLCBldGMuKVxuICBjb25zdCBwb3NzaWJsZU5vZGVzID0gZWxlbWVudHMuZmlsdGVyKGVsID0+IFxuICAgIGVsLnR5cGUgPT09ICdyZWN0JyB8fCBlbC50eXBlID09PSAnY2lyY2xlJyB8fCBlbC50eXBlID09PSAnZWxsaXBzZScgfHwgXG4gICAgZWwudHlwZSA9PT0gJ3BvbHlnb24nIHx8IChlbC50eXBlID09PSAncGF0aCcgJiYgZWwuZmlsbCAhPT0gJ25vbmUnKSk7XG4gIFxuICAvLyBGb3IgZWFjaCBwb3RlbnRpYWwgY29ubmVjdG9yLCBjaGVjayBpZiBpdCBjb25uZWN0cyBhbnkgbm9kZXNcbiAgZm9yIChjb25zdCBjb25uZWN0b3Igb2YgcG9zc2libGVDb25uZWN0b3JzKSB7XG4gICAgLy8gU2tpcCBlbGVtZW50cyB0aGF0IGFyZSBsaWtlbHkgdG8gYmUgbm9kZXMgdGhlbXNlbHZlc1xuICAgIGlmIChjb25uZWN0b3IuZmlsbCAhPT0gJ25vbmUnICYmIGNvbm5lY3Rvci50eXBlICE9PSAnbGluZScpIGNvbnRpbnVlO1xuICAgIFxuICAgIC8vIEV4dHJhY3Qgc3RhcnQgYW5kIGVuZCBwb2ludHNcbiAgICBsZXQgc3RhcnRQb2ludDogW251bWJlciwgbnVtYmVyXSB8IG51bGwgPSBudWxsO1xuICAgIGxldCBlbmRQb2ludDogW251bWJlciwgbnVtYmVyXSB8IG51bGwgPSBudWxsO1xuICAgIGxldCBtaWRkbGVQb2ludHM6IG51bWJlcltdW10gPSBbXTtcbiAgICBcbiAgICBpZiAoY29ubmVjdG9yLnR5cGUgPT09ICdsaW5lJykge1xuICAgICAgLy8gRm9yIGxpbmVzLCBleHRyYWN0IGRpcmVjdGx5IGZyb20gcGF0aERhdGFcbiAgICAgIGNvbnN0IG1hdGNoID0gY29ubmVjdG9yLnBhdGhEYXRhPy5tYXRjaCgvTShbXFxkLi1dKyksKFtcXGQuLV0rKVxccytMKFtcXGQuLV0rKSwoW1xcZC4tXSspLyk7XG4gICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgc3RhcnRQb2ludCA9IFtwYXJzZUZsb2F0KG1hdGNoWzFdKSwgcGFyc2VGbG9hdChtYXRjaFsyXSldO1xuICAgICAgICBlbmRQb2ludCA9IFtwYXJzZUZsb2F0KG1hdGNoWzNdKSwgcGFyc2VGbG9hdChtYXRjaFs0XSldO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoY29ubmVjdG9yLnR5cGUgPT09ICdwb2x5bGluZScpIHtcbiAgICAgIC8vIEZvciBwb2x5bGluZXMsIGV4dHJhY3QgZnJvbSBwYXRoRGF0YVxuICAgICAgY29uc3QgcG9pbnRzU3RyID0gY29ubmVjdG9yLnBhdGhEYXRhIHx8ICcnO1xuICAgICAgY29uc3QgcG9pbnRzID0gcG9pbnRzU3RyLnRyaW0oKS5zcGxpdCgvXFxzK3wsLykubWFwKHBhcnNlRmxvYXQpO1xuICAgICAgaWYgKHBvaW50cy5sZW5ndGggPj0gNCkge1xuICAgICAgICBzdGFydFBvaW50ID0gW3BvaW50c1swXSwgcG9pbnRzWzFdXTtcbiAgICAgICAgZW5kUG9pbnQgPSBbcG9pbnRzW3BvaW50cy5sZW5ndGggLSAyXSwgcG9pbnRzW3BvaW50cy5sZW5ndGggLSAxXV07XG4gICAgICAgIFxuICAgICAgICAvLyBFeHRyYWN0IG1pZGRsZSBwb2ludHMgaWYgdGhlcmUgYXJlIG1vcmUgdGhhbiAyIHBvaW50c1xuICAgICAgICBpZiAocG9pbnRzLmxlbmd0aCA+IDQpIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMjsgaSA8IHBvaW50cy5sZW5ndGggLSAyOyBpICs9IDIpIHtcbiAgICAgICAgICAgIG1pZGRsZVBvaW50cy5wdXNoKFtwb2ludHNbaV0sIHBvaW50c1tpICsgMV1dKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGNvbm5lY3Rvci50eXBlID09PSAncGF0aCcpIHtcbiAgICAgIC8vIEZvciBwYXRocywgZG8gYSBzaW1wbGUgZXh0cmFjdGlvbiBvZiBNIGFuZCBsYXN0IGNvbW1hbmRcbiAgICAgIGNvbnN0IGRBdHRyID0gY29ubmVjdG9yLnBhdGhEYXRhIHx8ICcnO1xuICAgICAgY29uc3QgZmlyc3RNID0gZEF0dHIubWF0Y2goL00oW1xcZC4tXSspWyxcXHNdKFtcXGQuLV0rKS8pO1xuICAgICAgY29uc3QgbGFzdENvbW1hbmQgPSBkQXR0ci5tYXRjaCgvW01MUUNaXVteTUxRQ1pdKiQvKTtcbiAgICAgIFxuICAgICAgaWYgKGZpcnN0TSkge1xuICAgICAgICBzdGFydFBvaW50ID0gW3BhcnNlRmxvYXQoZmlyc3RNWzFdKSwgcGFyc2VGbG9hdChmaXJzdE1bMl0pXTtcbiAgICAgICAgXG4gICAgICAgIGlmIChsYXN0Q29tbWFuZCkge1xuICAgICAgICAgIGNvbnN0IGxhc3RQYXJ0ID0gbGFzdENvbW1hbmRbMF07XG4gICAgICAgICAgaWYgKGxhc3RQYXJ0LnN0YXJ0c1dpdGgoJ0wnKSkge1xuICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBsYXN0UGFydC5tYXRjaCgvTChbXFxkLi1dKylbLFxcc10oW1xcZC4tXSspLyk7XG4gICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgZW5kUG9pbnQgPSBbcGFyc2VGbG9hdChtYXRjaFsxXSksIHBhcnNlRmxvYXQobWF0Y2hbMl0pXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGxhc3RQYXJ0LnN0YXJ0c1dpdGgoJ0MnKSkge1xuICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBsYXN0UGFydC5tYXRjaCgvQy4qPyhbXFxkLi1dKylbLFxcc10oW1xcZC4tXSspJC8pO1xuICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgIGVuZFBvaW50ID0gW3BhcnNlRmxvYXQobWF0Y2hbMV0pLCBwYXJzZUZsb2F0KG1hdGNoWzJdKV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIElmIHdlIGZvdW5kIHN0YXJ0IGFuZCBlbmQgcG9pbnRzLCBjaGVjayBmb3Igbm9kZXMgYXQgdGhlc2UgcG9pbnRzXG4gICAgaWYgKHN0YXJ0UG9pbnQgJiYgZW5kUG9pbnQpIHtcbiAgICAgIGxldCBmcm9tTm9kZTogU3ZnRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAgICAgbGV0IHRvTm9kZTogU3ZnRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAgICAgXG4gICAgICAvLyBGaW5kIG5vZGVzIHRoYXQgY29udGFpbiB0aGUgc3RhcnQvZW5kIHBvaW50c1xuICAgICAgZm9yIChjb25zdCBub2RlIG9mIHBvc3NpYmxlTm9kZXMpIHtcbiAgICAgICAgaWYgKG5vZGUuaWQgPT09IGNvbm5lY3Rvci5pZCkgY29udGludWU7IC8vIFNraXAgc2VsZlxuICAgICAgICBcbiAgICAgICAgaWYgKGlzUG9pbnRJbkVsZW1lbnQoc3RhcnRQb2ludCwgbm9kZSkpIHtcbiAgICAgICAgICBmcm9tTm9kZSA9IG5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmIChpc1BvaW50SW5FbGVtZW50KGVuZFBvaW50LCBub2RlKSkge1xuICAgICAgICAgIHRvTm9kZSA9IG5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmIChmcm9tTm9kZSAmJiB0b05vZGUpIGJyZWFrO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBJZiB3ZSBmb3VuZCBub2RlcyBhdCBib3RoIGVuZHMsIHJlY29yZCB0aGUgY29ubmVjdGlvblxuICAgICAgaWYgKGZyb21Ob2RlICYmIHRvTm9kZSkge1xuICAgICAgICBjb25uZWN0aW9ucy5wdXNoKHtcbiAgICAgICAgICBmcm9tSWQ6IGZyb21Ob2RlLmlkLFxuICAgICAgICAgIHRvSWQ6IHRvTm9kZS5pZCxcbiAgICAgICAgICBwb2ludHM6IG1pZGRsZVBvaW50cy5sZW5ndGggPiAwID8gW3N0YXJ0UG9pbnQsIC4uLm1pZGRsZVBvaW50cywgZW5kUG9pbnRdIDogdW5kZWZpbmVkXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgcmV0dXJuIGNvbm5lY3Rpb25zO1xufVxuXG4vKipcbiAqIEFwcGxpZXMgZGV0ZWN0ZWQgY29ubmVjdGlvbnMgdG8gZWxlbWVudHNcbiAqL1xuZnVuY3Rpb24gYXBwbHlDb25uZWN0aW9ucyhcbiAgZWxlbWVudHM6IFN2Z0VsZW1lbnRbXSwgXG4gIGNvbm5lY3Rpb25zOiBBcnJheTx7ZnJvbUlkOiBzdHJpbmcsIHRvSWQ6IHN0cmluZywgcG9pbnRzPzogbnVtYmVyW11bXX0+XG4pIHtcbiAgLy8gQ3JlYXRlIGEgbWFwIGZvciBmYXN0ZXIgbG9va3Vwc1xuICBjb25zdCBlbGVtZW50TWFwOiB7W2lkOiBzdHJpbmddOiBTdmdFbGVtZW50fSA9IHt9O1xuICBlbGVtZW50cy5mb3JFYWNoKGVsID0+IHtcbiAgICBlbGVtZW50TWFwW2VsLmlkXSA9IGVsO1xuICB9KTtcbiAgXG4gIC8vIEFkZCBjb25uZWN0aW9ucyB0byBlbGVtZW50c1xuICBmb3IgKGNvbnN0IGNvbm5lY3Rpb24gb2YgY29ubmVjdGlvbnMpIHtcbiAgICBjb25zdCBmcm9tRWxlbWVudCA9IGVsZW1lbnRNYXBbY29ubmVjdGlvbi5mcm9tSWRdO1xuICAgIGlmIChmcm9tRWxlbWVudCkge1xuICAgICAgZnJvbUVsZW1lbnQuY29ubmVjdGlvbnMucHVzaChjb25uZWN0aW9uKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSBwb2ludCBpcyBpbnNpZGUgb3IgdmVyeSBjbG9zZSB0byBhbiBlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIGlzUG9pbnRJbkVsZW1lbnQocG9pbnQ6IFtudW1iZXIsIG51bWJlcl0sIGVsZW1lbnQ6IFN2Z0VsZW1lbnQpOiBib29sZWFuIHtcbiAgY29uc3QgW3gsIHldID0gcG9pbnQ7XG4gIGNvbnN0IHsgeDogZWxYLCB5OiBlbFksIHdpZHRoOiBlbFdpZHRoLCBoZWlnaHQ6IGVsSGVpZ2h0IH0gPSBlbGVtZW50O1xuICBcbiAgLy8gQWRkIGEgc21hbGwgdG9sZXJhbmNlIGZvciBwb2ludCBkZXRlY3Rpb25cbiAgY29uc3QgdG9sZXJhbmNlID0gNTtcbiAgXG4gIGlmIChlbGVtZW50LnR5cGUgPT09ICdjaXJjbGUnKSB7XG4gICAgLy8gRm9yIGNpcmNsZXMsIGNoZWNrIGlmIHBvaW50IGlzIHdpdGhpbiByYWRpdXNcbiAgICBjb25zdCBjZW50ZXJYID0gZWxYICsgZWxXaWR0aCAvIDI7XG4gICAgY29uc3QgY2VudGVyWSA9IGVsWSArIGVsSGVpZ2h0IC8gMjtcbiAgICBjb25zdCByYWRpdXMgPSBlbFdpZHRoIC8gMjtcbiAgICBcbiAgICBjb25zdCBkaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyh4IC0gY2VudGVyWCwgMikgKyBNYXRoLnBvdyh5IC0gY2VudGVyWSwgMikpO1xuICAgIHJldHVybiBkaXN0YW5jZSA8PSByYWRpdXMgKyB0b2xlcmFuY2U7XG4gIH0gZWxzZSB7XG4gICAgLy8gRm9yIG90aGVyIHNoYXBlcywgY2hlY2sgaWYgcG9pbnQgaXMgd2l0aGluIGJvdW5kaW5nIGJveFxuICAgIHJldHVybiAoXG4gICAgICB4ID49IGVsWCAtIHRvbGVyYW5jZSAmJlxuICAgICAgeCA8PSBlbFggKyBlbFdpZHRoICsgdG9sZXJhbmNlICYmXG4gICAgICB5ID49IGVsWSAtIHRvbGVyYW5jZSAmJlxuICAgICAgeSA8PSBlbFkgKyBlbEhlaWdodCArIHRvbGVyYW5jZVxuICAgICk7XG4gIH1cbn1cblxuLyoqXG4gKiBDYWxjdWxhdGVzIGJvdW5kaW5nIGJveCBmb3IgYSBncm91cCBvZiBlbGVtZW50c1xuICovXG5mdW5jdGlvbiBjYWxjdWxhdGVHcm91cEJvdW5kcyhlbGVtZW50czogU3ZnRWxlbWVudFtdKTogeyB4OiBudW1iZXIsIHk6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIgfSB7XG4gIGlmIChlbGVtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4geyB4OiAwLCB5OiAwLCB3aWR0aDogMCwgaGVpZ2h0OiAwIH07XG4gIH1cbiAgXG4gIGxldCBtaW5YID0gSW5maW5pdHk7XG4gIGxldCBtaW5ZID0gSW5maW5pdHk7XG4gIGxldCBtYXhYID0gLUluZmluaXR5O1xuICBsZXQgbWF4WSA9IC1JbmZpbml0eTtcbiAgXG4gIGZvciAoY29uc3QgZWwgb2YgZWxlbWVudHMpIHtcbiAgICBtaW5YID0gTWF0aC5taW4obWluWCwgZWwueCk7XG4gICAgbWluWSA9IE1hdGgubWluKG1pblksIGVsLnkpO1xuICAgIG1heFggPSBNYXRoLm1heChtYXhYLCBlbC54ICsgZWwud2lkdGgpO1xuICAgIG1heFkgPSBNYXRoLm1heChtYXhZLCBlbC55ICsgZWwuaGVpZ2h0KTtcbiAgfVxuICBcbiAgcmV0dXJuIHtcbiAgICB4OiBtaW5YLFxuICAgIHk6IG1pblksXG4gICAgd2lkdGg6IG1heFggLSBtaW5YLFxuICAgIGhlaWdodDogbWF4WSAtIG1pbllcbiAgfTtcbn1cblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSByYW5kb20gSUQgZm9yIGVsZW1lbnRzIHdpdGhvdXQgSURzXG4gKi9cbmZ1bmN0aW9uIGdlbmVyYXRlSWQoKTogc3RyaW5nIHtcbiAgcmV0dXJuIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZygyLCAxMCk7XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IHN2Z1RvRmlnbWFGbG93Y2hhcnQgfSBmcm9tICcuL3NyYy9maWdtYUNvbnZlcnRlcic7XG5pbXBvcnQgeyBwYXJzZVN2ZyB9IGZyb20gJy4vc3JjL3N2Z1BhcnNlcic7XG5pbXBvcnQgeyBoYW5kbGVFcnJvciB9IGZyb20gJy4vc3JjL2Vycm9ySGFuZGxlcic7XG5cbmZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB3aWR0aDogNDAwLCBoZWlnaHQ6IDUwMCB9KTtcblxuZmlnbWEudWkub25tZXNzYWdlID0gYXN5bmMgKG1zZykgPT4ge1xuICBpZiAobXNnLnR5cGUgPT09ICdjb252ZXJ0LXN2ZycpIHtcbiAgICB0cnkge1xuICAgICAgLy8gUGFyc2UgdGhlIFNWRyBjb250ZW50XG4gICAgICBjb25zdCBwYXJzZWRTdmcgPSBwYXJzZVN2Zyhtc2cuc3ZnQ29udGVudCk7XG4gICAgICBcbiAgICAgIC8vIENyZWF0ZSBhIG5ldyBwYWdlIGZvciB0aGUgZmxvd2NoYXJ0XG4gICAgICBjb25zdCBwYWdlID0gZmlnbWEuY3JlYXRlUGFnZSgpO1xuICAgICAgcGFnZS5uYW1lID0gYEZsb3djaGFydDogJHttc2cuZmlsZU5hbWUucmVwbGFjZSgvXFwuc3ZnJC8sICcnKX1gO1xuICAgICAgZmlnbWEuY3VycmVudFBhZ2UgPSBwYWdlO1xuXG4gICAgICAvLyBDb252ZXJ0IFNWRyB0byBGaWdtYSBmbG93Y2hhcnRcbiAgICAgIGF3YWl0IHN2Z1RvRmlnbWFGbG93Y2hhcnQocGFyc2VkU3ZnKTtcbiAgICAgIFxuICAgICAgLy8gTm90aWZ5IFVJIHRoYXQgY29udmVyc2lvbiBpcyBjb21wbGV0ZVxuICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xuICAgICAgICB0eXBlOiAnY29udmVyc2lvbi1jb21wbGV0ZSdcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBmaWdtYS5ub3RpZnkoJ1NWRyBzdWNjZXNzZnVsbHkgY29udmVydGVkIHRvIGZsb3djaGFydCEnKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICBcbiAgICAgIC8vIEhhbmRsZSB0aGUgZXJyb3IgYW5kIG5vdGlmeSBVSVxuICAgICAgY29uc3QgZXJyb3JNc2cgPSBoYW5kbGVFcnJvcihlcnJvcik7XG4gICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yTXNnXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgZmlnbWEubm90aWZ5KCdFcnJvciBjb252ZXJ0aW5nIFNWRyB0byBmbG93Y2hhcnQnLCB7IGVycm9yOiB0cnVlIH0pO1xuICAgIH1cbiAgfVxufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
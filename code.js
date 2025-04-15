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
            console.log('Starting SVG to Figma conversion with data:', JSON.stringify(parsedSvg).substring(0, 200) + '...');
            // Check if parsedSvg has the expected structure
            if (!parsedSvg || !parsedSvg.elements || !Array.isArray(parsedSvg.elements)) {
                throw new Error('Invalid SVG data structure. Missing elements array.');
            }
            // Load fonts first to ensure text elements render properly
            console.log('Loading fonts...');
            yield figma.loadFontAsync({ family: "Inter", style: "Regular" });
            yield figma.loadFontAsync({ family: "Inter", style: "Medium" });
            console.log('Fonts loaded successfully');
            // Calculate scale factors
            console.log('Calculating scale factors...');
            const scale = calculateScale(parsedSvg.viewBox);
            console.log('Scale factors:', scale);
            // Create nodes
            console.log('Creating Figma nodes from', parsedSvg.elements.length, 'SVG elements...');
            const figmaNodes = yield createFigmaNodes(parsedSvg.elements, scale);
            console.log('Created', Object.keys(figmaNodes).length, 'Figma nodes');
            // Create connections between nodes
            console.log('Creating connections...');
            yield createConnections(figmaNodes, parsedSvg.elements);
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
            const elementsMap = {};
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
                    }
                    catch (error) {
                        console.error(`Error creating connection from ${connection.fromId} to ${connection.toId}:`, error);
                        // Continue with other connections
                    }
                }
            }
            console.log(`Successfully created ${connectionCount} connections`);
        }
        catch (error) {
            console.error('Error in createConnections:', error);
            // Don't rethrow the error to prevent the whole conversion process from failing
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
 * Generates a random ID for elements without IDs
 */
function generateId() {
    return Math.random().toString(36).substring(2, 10);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUssRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQzNCLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQzNCLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ3pCLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQzNCLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQzFCLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO1lBQ2hDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQzVCLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFO1lBQ2hDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1NBQ2hDLENBQUM7UUFFRixJQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ3hDLE9BQU8sV0FBVyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFFRCxPQUFPLFlBQVksQ0FBQztJQUN0QixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUs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TyxFQUFFLFFBQVE7YUFDbEIsQ0FBQyxDQUFDO1lBRUgsS0FBSyxDQUFDLE1BQU0sQ0FBQyxtQ0FBbUMsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3JFLENBQUM7SUFDSCxDQUFDO0FBQ0gsQ0FBQyxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd29ya3NwYWNlLy4vc3JjL2Vycm9ySGFuZGxlci50cyIsIndlYnBhY2s6Ly93b3Jrc3BhY2UvLi9zcmMvZmlnbWFDb252ZXJ0ZXIudHMiLCJ3ZWJwYWNrOi8vd29ya3NwYWNlLy4vc3JjL3N2Z1BhcnNlci50cyIsIndlYnBhY2s6Ly93b3Jrc3BhY2Uvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd29ya3NwYWNlL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93b3Jrc3BhY2Uvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly93b3Jrc3BhY2Uvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93b3Jrc3BhY2UvLi9jb2RlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogSGFuZGxlcyBlcnJvcnMgYW5kIHJldHVybnMgYXBwcm9wcmlhdGUgZXJyb3IgbWVzc2FnZXNcbiAqIEBwYXJhbSBlcnJvciBUaGUgZXJyb3IgdG8gaGFuZGxlXG4gKiBAcmV0dXJucyBBIHVzZXItZnJpZW5kbHkgZXJyb3IgbWVzc2FnZVxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlRXJyb3IoZXJyb3I6IGFueSk6IHN0cmluZyB7XG4gIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIG9jY3VycmVkOicsIGVycm9yKTtcbiAgXG4gIC8vIENoZWNrIGVycm9yIHR5cGVcbiAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgIFxuICAgIC8vIEhhbmRsZSBzcGVjaWZpYyBlcnJvciB0eXBlc1xuICAgIGlmIChlcnJvck1lc3NhZ2UuaW5jbHVkZXMoJ0ludmFsaWQgU1ZHJykpIHtcbiAgICAgIHJldHVybiAnVGhlIFNWRyBmaWxlIGlzIGludmFsaWQgb3IgY29ycnVwdGVkLiBQbGVhc2UgY2hlY2sgdGhlIGZpbGUgYW5kIHRyeSBhZ2Fpbi4nO1xuICAgIH1cbiAgICBcbiAgICBpZiAoZXJyb3JNZXNzYWdlLmluY2x1ZGVzKCdNaXNzaW5nIHJvb3QgU1ZHIGVsZW1lbnQnKSkge1xuICAgICAgcmV0dXJuICdUaGUgZmlsZSBkb2VzIG5vdCBhcHBlYXIgdG8gYmUgYSB2YWxpZCBTVkcuIFBsZWFzZSBjaGVjayB0aGUgZmlsZSBmb3JtYXQuJztcbiAgICB9XG4gICAgXG4gICAgaWYgKGVycm9yTWVzc2FnZS5pbmNsdWRlcygncGVybWlzc2lvbicpKSB7XG4gICAgICByZXR1cm4gJ1RoZSBwbHVnaW4gZG9lcyBub3QgaGF2ZSBwZXJtaXNzaW9uIHRvIHBlcmZvcm0gdGhpcyBhY3Rpb24uIFBsZWFzZSB0cnkgYWdhaW4uJztcbiAgICB9XG4gICAgXG4gICAgaWYgKGVycm9yTWVzc2FnZS5pbmNsdWRlcygnRm9udCcpKSB7XG4gICAgICByZXR1cm4gJ1RoZXJlIHdhcyBhbiBpc3N1ZSB3aXRoIGxvYWRpbmcgZm9udHMuIFBsZWFzZSB0cnkgYWdhaW4uJztcbiAgICB9XG4gICAgXG4gICAgLy8gUmV0dXJuIHRoZSBvcmlnaW5hbCBlcnJvciBtZXNzYWdlIGlmIGl0J3Mgc3BlY2lmaWNcbiAgICByZXR1cm4gYEVycm9yOiAke2Vycm9yTWVzc2FnZX1gO1xuICB9XG4gIFxuICAvLyBGb3IgU1ZHIHBhcnNpbmcgZXJyb3JzXG4gIGlmICh0eXBlb2YgZXJyb3IgPT09ICdvYmplY3QnICYmIGVycm9yICE9PSBudWxsKSB7XG4gICAgaWYgKCdtZXNzYWdlJyBpbiBlcnJvcikge1xuICAgICAgaWYgKHR5cGVvZiBlcnJvci5tZXNzYWdlID09PSAnc3RyaW5nJyAmJiBlcnJvci5tZXNzYWdlLmluY2x1ZGVzKCdTVkcnKSkge1xuICAgICAgICByZXR1cm4gYFNWRyBwYXJzaW5nIGVycm9yOiAke2Vycm9yLm1lc3NhZ2V9YDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIGBFcnJvcjogJHtlcnJvci5tZXNzYWdlfWA7XG4gICAgfVxuICB9XG4gIFxuICAvLyBHZW5lcmljIGVycm9yIG1lc3NhZ2VcbiAgcmV0dXJuICdBbiB1bmV4cGVjdGVkIGVycm9yIG9jY3VycmVkLiBQbGVhc2UgdHJ5IGFnYWluIG9yIHRyeSB3aXRoIGEgZGlmZmVyZW50IFNWRyBmaWxlLic7XG59XG5cbi8qKlxuICogTG9nIGVycm9yIHdpdGggZGV0YWlscyB0byB0aGUgY29uc29sZSBmb3IgZGVidWdnaW5nXG4gKiBAcGFyYW0gY29udGV4dCBUaGUgY29udGV4dCB3aGVyZSB0aGUgZXJyb3Igb2NjdXJyZWRcbiAqIEBwYXJhbSBlcnJvciBUaGUgZXJyb3Igb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsb2dFcnJvcihjb250ZXh0OiBzdHJpbmcsIGVycm9yOiBhbnkpOiB2b2lkIHtcbiAgY29uc29sZS5lcnJvcihgRXJyb3IgaW4gJHtjb250ZXh0fTpgLCBlcnJvcik7XG4gIFxuICAvLyBBZGRpdGlvbmFsIGxvZ2dpbmcgZm9yIGRlYnVnZ2luZ1xuICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ1N0YWNrIHRyYWNlOicsIGVycm9yLnN0YWNrKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgaGFuZGxlRXJyb3IgfSBmcm9tICcuL2Vycm9ySGFuZGxlcic7XG5cbi8qKlxuICogQ29udmVydHMgYSBwYXJzZWQgU1ZHIHN0cnVjdHVyZSB0byBhIEZpZ21hIGZsb3djaGFydFxuICogQHBhcmFtIHBhcnNlZFN2ZyBUaGUgcGFyc2VkIFNWRyBkYXRhXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzdmdUb0ZpZ21hRmxvd2NoYXJ0KHBhcnNlZFN2ZzogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gIHRyeSB7XG4gICAgY29uc29sZS5sb2coJ1N0YXJ0aW5nIFNWRyB0byBGaWdtYSBjb252ZXJzaW9uIHdpdGggZGF0YTonLCBKU09OLnN0cmluZ2lmeShwYXJzZWRTdmcpLnN1YnN0cmluZygwLCAyMDApICsgJy4uLicpO1xuICAgIFxuICAgIC8vIENoZWNrIGlmIHBhcnNlZFN2ZyBoYXMgdGhlIGV4cGVjdGVkIHN0cnVjdHVyZVxuICAgIGlmICghcGFyc2VkU3ZnIHx8ICFwYXJzZWRTdmcuZWxlbWVudHMgfHwgIUFycmF5LmlzQXJyYXkocGFyc2VkU3ZnLmVsZW1lbnRzKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIFNWRyBkYXRhIHN0cnVjdHVyZS4gTWlzc2luZyBlbGVtZW50cyBhcnJheS4nKTtcbiAgICB9XG4gICAgXG4gICAgLy8gTG9hZCBmb250cyBmaXJzdCB0byBlbnN1cmUgdGV4dCBlbGVtZW50cyByZW5kZXIgcHJvcGVybHlcbiAgICBjb25zb2xlLmxvZygnTG9hZGluZyBmb250cy4uLicpO1xuICAgIGF3YWl0IGZpZ21hLmxvYWRGb250QXN5bmMoeyBmYW1pbHk6IFwiSW50ZXJcIiwgc3R5bGU6IFwiUmVndWxhclwiIH0pO1xuICAgIGF3YWl0IGZpZ21hLmxvYWRGb250QXN5bmMoeyBmYW1pbHk6IFwiSW50ZXJcIiwgc3R5bGU6IFwiTWVkaXVtXCIgfSk7XG4gICAgY29uc29sZS5sb2coJ0ZvbnRzIGxvYWRlZCBzdWNjZXNzZnVsbHknKTtcbiAgICBcbiAgICAvLyBDYWxjdWxhdGUgc2NhbGUgZmFjdG9yc1xuICAgIGNvbnNvbGUubG9nKCdDYWxjdWxhdGluZyBzY2FsZSBmYWN0b3JzLi4uJyk7XG4gICAgY29uc3Qgc2NhbGUgPSBjYWxjdWxhdGVTY2FsZShwYXJzZWRTdmcudmlld0JveCk7XG4gICAgY29uc29sZS5sb2coJ1NjYWxlIGZhY3RvcnM6Jywgc2NhbGUpO1xuICAgIFxuICAgIC8vIENyZWF0ZSBub2Rlc1xuICAgIGNvbnNvbGUubG9nKCdDcmVhdGluZyBGaWdtYSBub2RlcyBmcm9tJywgcGFyc2VkU3ZnLmVsZW1lbnRzLmxlbmd0aCwgJ1NWRyBlbGVtZW50cy4uLicpO1xuICAgIGNvbnN0IGZpZ21hTm9kZXMgPSBhd2FpdCBjcmVhdGVGaWdtYU5vZGVzKHBhcnNlZFN2Zy5lbGVtZW50cywgc2NhbGUpO1xuICAgIGNvbnNvbGUubG9nKCdDcmVhdGVkJywgT2JqZWN0LmtleXMoZmlnbWFOb2RlcykubGVuZ3RoLCAnRmlnbWEgbm9kZXMnKTtcbiAgICBcbiAgICAvLyBDcmVhdGUgY29ubmVjdGlvbnMgYmV0d2VlbiBub2Rlc1xuICAgIGNvbnNvbGUubG9nKCdDcmVhdGluZyBjb25uZWN0aW9ucy4uLicpO1xuICAgIGF3YWl0IGNyZWF0ZUNvbm5lY3Rpb25zKGZpZ21hTm9kZXMsIHBhcnNlZFN2Zy5lbGVtZW50cyk7XG4gICAgY29uc29sZS5sb2coJ0Nvbm5lY3Rpb25zIGNyZWF0ZWQnKTtcbiAgICBcbiAgICAvLyBTZWxlY3QgYWxsIGNyZWF0ZWQgbm9kZXNcbiAgICBjb25zdCBub2RlVmFsdWVzID0gT2JqZWN0LnZhbHVlcyhmaWdtYU5vZGVzKTtcbiAgICBjb25zb2xlLmxvZygnU2VsZWN0aW5nJywgbm9kZVZhbHVlcy5sZW5ndGgsICdub2RlcycpO1xuICAgIGlmIChub2RlVmFsdWVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiA9IG5vZGVWYWx1ZXM7XG4gICAgICBcbiAgICAgIC8vIFpvb20gdG8gZml0IHRoZSBjcmVhdGVkIG5vZGVzXG4gICAgICBjb25zb2xlLmxvZygnWm9vbWluZyB0byBmaXQnKTtcbiAgICAgIGZpZ21hLnZpZXdwb3J0LnNjcm9sbEFuZFpvb21JbnRvVmlldyhub2RlVmFsdWVzKTtcbiAgICB9XG4gICAgXG4gICAgY29uc29sZS5sb2coJ1NWRyB0byBGaWdtYSBjb252ZXJzaW9uIGNvbXBsZXRlZCBzdWNjZXNzZnVsbHknKTtcbiAgfSBjYXRjaCAoZXJyb3I6IHVua25vd24pIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBjb252ZXJ0aW5nIHRvIEZpZ21hIGZsb3djaGFydDonLCBlcnJvcik7XG4gICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRXJyb3IgY29udmVydGluZyB0byBGaWdtYSBmbG93Y2hhcnQ6ICR7ZXJyb3IubWVzc2FnZX1gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvciBjb252ZXJ0aW5nIHRvIEZpZ21hIGZsb3djaGFydDogVW5rbm93biBlcnJvcicpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIENhbGN1bGF0ZXMgc2NhbGUgZmFjdG9ycyBmb3IgY29udmVydGluZyBmcm9tIFNWRyBjb29yZGluYXRlcyB0byBGaWdtYVxuICovXG5mdW5jdGlvbiBjYWxjdWxhdGVTY2FsZSh2aWV3Qm94OiBhbnkpOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH0ge1xuICAvLyBGb3Igc2ltcGxpY2l0eSwgd2UnbGwgdXNlIGEgMToxIG1hcHBpbmcsIGJ1dCB0aGlzIGNvdWxkIGJlIGFkanVzdGVkXG4gIC8vIGlmIHdlIG5lZWQgdG8gc2NhbGUgdGhlIGZsb3djaGFydCBkaWZmZXJlbnRseVxuICByZXR1cm4geyB4OiAxLCB5OiAxIH07XG59XG5cbi8qKlxuICogQ3JlYXRlcyBGaWdtYSBub2RlcyBmcm9tIFNWRyBlbGVtZW50c1xuICovXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVGaWdtYU5vZGVzKFxuICBlbGVtZW50czogYW55W10sIFxuICBzY2FsZTogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9XG4pOiBQcm9taXNlPHsgW2lkOiBzdHJpbmddOiBTY2VuZU5vZGUgfT4ge1xuICBjb25zdCBmaWdtYU5vZGVzOiB7IFtpZDogc3RyaW5nXTogU2NlbmVOb2RlIH0gPSB7fTtcbiAgXG4gIC8vIFByb2Nlc3MgZWxlbWVudHNcbiAgZm9yIChjb25zdCBlbGVtZW50IG9mIGVsZW1lbnRzKSB7XG4gICAgLy8gU2tpcCBlbGVtZW50cyB0aGF0IGFyZSBsaWtlbHkgdG8gYmUgY29ubmVjdG9yc1xuICAgIGlmIChpc0Nvbm5lY3RvcihlbGVtZW50KSkgY29udGludWU7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG5vZGUgPSBhd2FpdCBjcmVhdGVGaWdtYU5vZGUoZWxlbWVudCwgc2NhbGUpO1xuICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgZmlnbWFOb2Rlc1tlbGVtZW50LmlkXSA9IG5vZGU7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUud2FybihgRXJyb3IgY3JlYXRpbmcgbm9kZSBmb3IgZWxlbWVudCAke2VsZW1lbnQuaWR9OmAsIGVycm9yKTtcbiAgICAgIC8vIENvbnRpbnVlIHdpdGggb3RoZXIgZWxlbWVudHNcbiAgICB9XG4gIH1cbiAgXG4gIHJldHVybiBmaWdtYU5vZGVzO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhbiBlbGVtZW50IGlzIGxpa2VseSB0byBiZSBhIGNvbm5lY3RvciByYXRoZXIgdGhhbiBhIG5vZGVcbiAqL1xuZnVuY3Rpb24gaXNDb25uZWN0b3IoZWxlbWVudDogYW55KTogYm9vbGVhbiB7XG4gIC8vIExpbmVzIGFyZSBhbG1vc3QgYWx3YXlzIGNvbm5lY3RvcnNcbiAgaWYgKGVsZW1lbnQudHlwZSA9PT0gJ2xpbmUnKSByZXR1cm4gdHJ1ZTtcbiAgXG4gIC8vIFBhdGhzIGFuZCBwb2x5bGluZXMgd2l0aCBcIm5vbmVcIiBmaWxsIGFyZSBsaWtlbHkgY29ubmVjdG9yc1xuICBpZiAoKGVsZW1lbnQudHlwZSA9PT0gJ3BhdGgnIHx8IGVsZW1lbnQudHlwZSA9PT0gJ3BvbHlsaW5lJykgJiYgXG4gICAgICBlbGVtZW50LmZpbGwgPT09ICdub25lJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIFxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIEZpZ21hIG5vZGUgZnJvbSBhbiBTVkcgZWxlbWVudFxuICovXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVGaWdtYU5vZGUoZWxlbWVudDogYW55LCBzY2FsZTogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9KTogUHJvbWlzZTxTY2VuZU5vZGUgfCBudWxsPiB7XG4gIC8vIFNjYWxlIGNvb3JkaW5hdGVzXG4gIGNvbnN0IHggPSBlbGVtZW50LnggKiBzY2FsZS54O1xuICBjb25zdCB5ID0gZWxlbWVudC55ICogc2NhbGUueTtcbiAgY29uc3Qgd2lkdGggPSBlbGVtZW50LndpZHRoICogc2NhbGUueDtcbiAgY29uc3QgaGVpZ2h0ID0gZWxlbWVudC5oZWlnaHQgKiBzY2FsZS55O1xuICBcbiAgbGV0IG5vZGU6IFNjZW5lTm9kZSB8IG51bGwgPSBudWxsO1xuICBcbiAgLy8gQ2hvb3NlIHRoZSBub2RlIHR5cGUgYmFzZWQgb24gdGhlIFNWRyBlbGVtZW50IHR5cGVcbiAgc3dpdGNoIChlbGVtZW50LnR5cGUpIHtcbiAgICBjYXNlICdyZWN0JzpcbiAgICAgIG5vZGUgPSBmaWdtYS5jcmVhdGVSZWN0YW5nbGUoKTtcbiAgICAgIG5vZGUueCA9IHg7XG4gICAgICBub2RlLnkgPSB5O1xuICAgICAgbm9kZS5yZXNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICBicmVhaztcbiAgICAgIFxuICAgIGNhc2UgJ2NpcmNsZSc6XG4gICAgICBub2RlID0gZmlnbWEuY3JlYXRlRWxsaXBzZSgpO1xuICAgICAgbm9kZS54ID0geDtcbiAgICAgIG5vZGUueSA9IHk7XG4gICAgICBub2RlLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgIGJyZWFrO1xuICAgICAgXG4gICAgY2FzZSAnZWxsaXBzZSc6XG4gICAgICBub2RlID0gZmlnbWEuY3JlYXRlRWxsaXBzZSgpO1xuICAgICAgbm9kZS54ID0geDtcbiAgICAgIG5vZGUueSA9IHk7XG4gICAgICBub2RlLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgIGJyZWFrO1xuICAgICAgXG4gICAgY2FzZSAncG9seWdvbic6XG4gICAgICAvLyBGb3IgcG9seWdvbnMsIGNyZWF0ZSBhIHNoYXBlIHdpdGggYSB2ZWN0b3IgbmV0d29ya1xuICAgICAgY29uc3QgcG9seWdvbiA9IGZpZ21hLmNyZWF0ZVBvbHlnb24oKTtcbiAgICAgIHBvbHlnb24ueCA9IHg7XG4gICAgICBwb2x5Z29uLnkgPSB5O1xuICAgICAgcG9seWdvbi5yZXNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICBub2RlID0gcG9seWdvbjtcbiAgICAgIGJyZWFrO1xuICAgICAgXG4gICAgY2FzZSAncGF0aCc6XG4gICAgICAvLyBJZiB0aGUgcGF0aCBoYXMgYSBmaWxsLCBpdCdzIGxpa2VseSBhIHNoYXBlIG5vZGVcbiAgICAgIGlmIChlbGVtZW50LmZpbGwgIT09ICdub25lJykge1xuICAgICAgICBjb25zdCBzaGFwZSA9IGZpZ21hLmNyZWF0ZVJlY3RhbmdsZSgpOyAgLy8gQXMgYSBmYWxsYmFja1xuICAgICAgICBzaGFwZS54ID0geDtcbiAgICAgICAgc2hhcGUueSA9IHk7XG4gICAgICAgIHNoYXBlLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgbm9kZSA9IHNoYXBlO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgICBcbiAgICBjYXNlICd0ZXh0JzpcbiAgICAgIGNvbnN0IHRleHQgPSBmaWdtYS5jcmVhdGVUZXh0KCk7XG4gICAgICBhd2FpdCBmaWdtYS5sb2FkRm9udEFzeW5jKHsgZmFtaWx5OiBcIkludGVyXCIsIHN0eWxlOiBcIlJlZ3VsYXJcIiB9KTtcbiAgICAgIHRleHQueCA9IHg7XG4gICAgICB0ZXh0LnkgPSB5O1xuICAgICAgdGV4dC5yZXNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICB0ZXh0LmNoYXJhY3RlcnMgPSBlbGVtZW50LnRleHQgfHwgJyc7XG4gICAgICBub2RlID0gdGV4dDtcbiAgICAgIGJyZWFrO1xuICAgICAgXG4gICAgY2FzZSAnZ3JvdXAnOlxuICAgICAgLy8gRm9yIGdyb3VwcywgY3JlYXRlIGEgZnJhbWUgYW5kIGFkZCBjaGlsZHJlblxuICAgICAgY29uc3QgZnJhbWUgPSBmaWdtYS5jcmVhdGVGcmFtZSgpO1xuICAgICAgZnJhbWUueCA9IHg7XG4gICAgICBmcmFtZS55ID0geTtcbiAgICAgIGZyYW1lLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgIFxuICAgICAgLy8gUHJvY2VzcyBjaGlsZHJlbiByZWN1cnNpdmVseVxuICAgICAgaWYgKGVsZW1lbnQuY2hpbGRyZW4gJiYgZWxlbWVudC5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IGNoaWxkTm9kZXMgPSBhd2FpdCBjcmVhdGVGaWdtYU5vZGVzKGVsZW1lbnQuY2hpbGRyZW4sIHNjYWxlKTtcbiAgICAgICAgXG4gICAgICAgIC8vIEFkZCBjaGlsZHJlbiB0byB0aGUgZnJhbWVcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZE5vZGUgb2YgT2JqZWN0LnZhbHVlcyhjaGlsZE5vZGVzKSkge1xuICAgICAgICAgIC8vIEFkanVzdCBwb3NpdGlvbiByZWxhdGl2ZSB0byBmcmFtZVxuICAgICAgICAgIGNoaWxkTm9kZS54IC09IHg7XG4gICAgICAgICAgY2hpbGROb2RlLnkgLT0geTtcbiAgICAgICAgICBmcmFtZS5hcHBlbmRDaGlsZChjaGlsZE5vZGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIG5vZGUgPSBmcmFtZTtcbiAgICAgIGJyZWFrO1xuICB9XG4gIFxuICAvLyBBcHBseSBjb21tb24gcHJvcGVydGllcyBpZiBhIG5vZGUgd2FzIGNyZWF0ZWRcbiAgaWYgKG5vZGUpIHtcbiAgICAvLyBTZXQgbmFtZVxuICAgIG5vZGUubmFtZSA9IGVsZW1lbnQuaWQgfHwgYCR7ZWxlbWVudC50eXBlfS1ub2RlYDtcbiAgICBcbiAgICAvLyBBcHBseSBmaWxscyBpZiBhcHBsaWNhYmxlXG4gICAgaWYgKCdmaWxscycgaW4gbm9kZSAmJiBlbGVtZW50LmZpbGwgJiYgZWxlbWVudC5maWxsICE9PSAnbm9uZScpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJnYkNvbG9yID0gcGFyc2VDb2xvcihlbGVtZW50LmZpbGwpO1xuICAgICAgICBub2RlLmZpbGxzID0gW3tcbiAgICAgICAgICB0eXBlOiAnU09MSUQnLFxuICAgICAgICAgIGNvbG9yOiByZ2JDb2xvcixcbiAgICAgICAgICBvcGFjaXR5OiAxXG4gICAgICAgIH1dO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGBDb3VsZCBub3QgYXBwbHkgZmlsbCBmb3Igbm9kZSAke25vZGUubmFtZX06YCwgZXJyb3IpO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBBcHBseSBzdHJva2VzIGlmIGFwcGxpY2FibGVcbiAgICBpZiAoJ3N0cm9rZXMnIGluIG5vZGUgJiYgZWxlbWVudC5zdHJva2UgJiYgZWxlbWVudC5zdHJva2UgIT09ICdub25lJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmdiQ29sb3IgPSBwYXJzZUNvbG9yKGVsZW1lbnQuc3Ryb2tlKTtcbiAgICAgICAgbm9kZS5zdHJva2VzID0gW3tcbiAgICAgICAgICB0eXBlOiAnU09MSUQnLFxuICAgICAgICAgIGNvbG9yOiByZ2JDb2xvcixcbiAgICAgICAgICBvcGFjaXR5OiAxXG4gICAgICAgIH1dO1xuICAgICAgICBcbiAgICAgICAgaWYgKGVsZW1lbnQuc3Ryb2tlV2lkdGgpIHtcbiAgICAgICAgICBub2RlLnN0cm9rZVdlaWdodCA9IGVsZW1lbnQuc3Ryb2tlV2lkdGg7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihgQ291bGQgbm90IGFwcGx5IHN0cm9rZSBmb3Igbm9kZSAke25vZGUubmFtZX06YCwgZXJyb3IpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgcmV0dXJuIG5vZGU7XG59XG5cbi8qKlxuICogUGFyc2VzIGEgY29sb3Igc3RyaW5nIChoZXgsIHJnYiwgZXRjLikgdG8gUkdCIGNvbXBvbmVudHNcbiAqL1xuZnVuY3Rpb24gcGFyc2VDb2xvcihjb2xvclN0cjogc3RyaW5nKTogeyByOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyIH0ge1xuICAvLyBEZWZhdWx0IGNvbG9yIGlmIHBhcnNpbmcgZmFpbHNcbiAgY29uc3QgZGVmYXVsdENvbG9yID0geyByOiAwLCBnOiAwLCBiOiAwIH07XG4gIFxuICB0cnkge1xuICAgIC8vIEhhbmRsZSBoZXggZm9ybWF0ICgjUlJHR0JCKVxuICAgIGlmIChjb2xvclN0ci5zdGFydHNXaXRoKCcjJykpIHtcbiAgICAgIGNvbnN0IGhleCA9IGNvbG9yU3RyLnNsaWNlKDEpO1xuICAgICAgaWYgKGhleC5sZW5ndGggPT09IDYpIHtcbiAgICAgICAgY29uc3QgciA9IHBhcnNlSW50KGhleC5zdWJzdHJpbmcoMCwgMiksIDE2KSAvIDI1NTtcbiAgICAgICAgY29uc3QgZyA9IHBhcnNlSW50KGhleC5zdWJzdHJpbmcoMiwgNCksIDE2KSAvIDI1NTtcbiAgICAgICAgY29uc3QgYiA9IHBhcnNlSW50KGhleC5zdWJzdHJpbmcoNCwgNiksIDE2KSAvIDI1NTtcbiAgICAgICAgcmV0dXJuIHsgciwgZywgYiB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRlZmF1bHRDb2xvcjtcbiAgICB9XG4gICAgXG4gICAgLy8gSGFuZGxlIHJnYiBmb3JtYXRcbiAgICBpZiAoY29sb3JTdHIuc3RhcnRzV2l0aCgncmdiJykpIHtcbiAgICAgIGNvbnN0IG1hdGNoID0gY29sb3JTdHIubWF0Y2goL3JnYlxcKFxccyooXFxkKylcXHMqLFxccyooXFxkKylcXHMqLFxccyooXFxkKylcXHMqXFwpLyk7XG4gICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgY29uc3QgciA9IHBhcnNlSW50KG1hdGNoWzFdLCAxMCkgLyAyNTU7XG4gICAgICAgIGNvbnN0IGcgPSBwYXJzZUludChtYXRjaFsyXSwgMTApIC8gMjU1O1xuICAgICAgICBjb25zdCBiID0gcGFyc2VJbnQobWF0Y2hbM10sIDEwKSAvIDI1NTtcbiAgICAgICAgcmV0dXJuIHsgciwgZywgYiB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRlZmF1bHRDb2xvcjtcbiAgICB9XG4gICAgXG4gICAgLy8gSGFuZGxlIG5hbWVkIGNvbG9ycyAoc2ltcGxpZmllZClcbiAgICBjb25zdCBuYW1lZENvbG9yczogeyBbbmFtZTogc3RyaW5nXTogeyByOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyIH0gfSA9IHtcbiAgICAgIGJsYWNrOiB7IHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICAgIHdoaXRlOiB7IHI6IDEsIGc6IDEsIGI6IDEgfSxcbiAgICAgIHJlZDogeyByOiAxLCBnOiAwLCBiOiAwIH0sXG4gICAgICBncmVlbjogeyByOiAwLCBnOiAxLCBiOiAwIH0sXG4gICAgICBibHVlOiB7IHI6IDAsIGc6IDAsIGI6IDEgfSxcbiAgICAgIGdyYXk6IHsgcjogMC41LCBnOiAwLjUsIGI6IDAuNSB9LFxuICAgICAgeWVsbG93OiB7IHI6IDEsIGc6IDEsIGI6IDAgfSxcbiAgICAgIHB1cnBsZTogeyByOiAwLjUsIGc6IDAsIGI6IDAuNSB9LFxuICAgICAgb3JhbmdlOiB7IHI6IDEsIGc6IDAuNjUsIGI6IDAgfSxcbiAgICB9O1xuICAgIFxuICAgIGlmIChuYW1lZENvbG9yc1tjb2xvclN0ci50b0xvd2VyQ2FzZSgpXSkge1xuICAgICAgcmV0dXJuIG5hbWVkQ29sb3JzW2NvbG9yU3RyLnRvTG93ZXJDYXNlKCldO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gZGVmYXVsdENvbG9yO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUud2FybignRXJyb3IgcGFyc2luZyBjb2xvcjonLCBlcnJvcik7XG4gICAgcmV0dXJuIGRlZmF1bHRDb2xvcjtcbiAgfVxufVxuXG4vKipcbiAqIENyZWF0ZXMgY29ubmVjdG9yIGxpbmVzIGJldHdlZW4gbm9kZXNcbiAqL1xuYXN5bmMgZnVuY3Rpb24gY3JlYXRlQ29ubmVjdGlvbnMoXG4gIGZpZ21hTm9kZXM6IHsgW2lkOiBzdHJpbmddOiBTY2VuZU5vZGUgfSxcbiAgZWxlbWVudHM6IGFueVtdXG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgdHJ5IHtcbiAgICBjb25zb2xlLmxvZygnQmVnaW5uaW5nIHRvIGNyZWF0ZSBjb25uZWN0aW9ucyBiZXR3ZWVuIG5vZGVzJyk7XG4gICAgXG4gICAgLy8gVmVyaWZ5IGZpZ21hTm9kZXMgZXhpc3RzIGFuZCBpcyBhbiBvYmplY3RcbiAgICBpZiAoIWZpZ21hTm9kZXMgfHwgdHlwZW9mIGZpZ21hTm9kZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdJbnZhbGlkIGZpZ21hTm9kZXMgcGFyYW1ldGVyOicsIGZpZ21hTm9kZXMpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICAvLyBWZXJpZnkgZWxlbWVudHMgYXJyYXkgZXhpc3RzXG4gICAgaWYgKCFlbGVtZW50cyB8fCAhQXJyYXkuaXNBcnJheShlbGVtZW50cykpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0ludmFsaWQgZWxlbWVudHMgcGFyYW1ldGVyOicsIGVsZW1lbnRzKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgLy8gQ3JlYXRlIGEgbWFwIGZvciBlbGVtZW50c1xuICAgIGNvbnN0IGVsZW1lbnRzTWFwOiB7IFtpZDogc3RyaW5nXTogYW55IH0gPSB7fTtcbiAgICBlbGVtZW50cy5mb3JFYWNoKGVsID0+IHtcbiAgICAgIGlmIChlbCAmJiBlbC5pZCkge1xuICAgICAgICBlbGVtZW50c01hcFtlbC5pZF0gPSBlbDtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBcbiAgICBjb25zb2xlLmxvZyhgQ3JlYXRlZCBlbGVtZW50cyBtYXAgd2l0aCAke09iamVjdC5rZXlzKGVsZW1lbnRzTWFwKS5sZW5ndGh9IGVudHJpZXNgKTtcbiAgICBcbiAgICAvLyBQcm9jZXNzIGVhY2ggZWxlbWVudCdzIGNvbm5lY3Rpb25zXG4gICAgbGV0IGNvbm5lY3Rpb25Db3VudCA9IDA7XG4gICAgXG4gICAgZm9yIChjb25zdCBlbGVtZW50IG9mIGVsZW1lbnRzKSB7XG4gICAgICAvLyBTa2lwIGlmIGVsZW1lbnQgZG9lc24ndCBoYXZlIGNvbm5lY3Rpb25zXG4gICAgICBpZiAoIWVsZW1lbnQgfHwgIWVsZW1lbnQuY29ubmVjdGlvbnMgfHwgIUFycmF5LmlzQXJyYXkoZWxlbWVudC5jb25uZWN0aW9ucykgfHwgZWxlbWVudC5jb25uZWN0aW9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGNvbnNvbGUubG9nKGBQcm9jZXNzaW5nICR7ZWxlbWVudC5jb25uZWN0aW9ucy5sZW5ndGh9IGNvbm5lY3Rpb25zIGZvciBlbGVtZW50ICR7ZWxlbWVudC5pZH1gKTtcbiAgICAgIFxuICAgICAgZm9yIChjb25zdCBjb25uZWN0aW9uIG9mIGVsZW1lbnQuY29ubmVjdGlvbnMpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBWYWxpZGF0ZSBjb25uZWN0aW9uIG9iamVjdFxuICAgICAgICAgIGlmICghY29ubmVjdGlvbiB8fCAhY29ubmVjdGlvbi5mcm9tSWQgfHwgIWNvbm5lY3Rpb24udG9JZCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdJbnZhbGlkIGNvbm5lY3Rpb24gb2JqZWN0OicsIGNvbm5lY3Rpb24pO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIC8vIEdldCBub2RlcyBmb3IgY29ubmVjdGlvblxuICAgICAgICAgIGNvbnN0IGZyb21Ob2RlID0gZmlnbWFOb2Rlc1tjb25uZWN0aW9uLmZyb21JZF07XG4gICAgICAgICAgY29uc3QgdG9Ob2RlID0gZmlnbWFOb2Rlc1tjb25uZWN0aW9uLnRvSWRdO1xuICAgICAgICAgIFxuICAgICAgICAgIGlmICghZnJvbU5vZGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgRnJvbSBub2RlIHdpdGggSUQgJHtjb25uZWN0aW9uLmZyb21JZH0gbm90IGZvdW5kYCk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgaWYgKCF0b05vZGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgVG8gbm9kZSB3aXRoIElEICR7Y29ubmVjdGlvbi50b0lkfSBub3QgZm91bmRgKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICBjb25zb2xlLmxvZyhgQ3JlYXRpbmcgY29ubmVjdG9yIGZyb20gJHtmcm9tTm9kZS5uYW1lfSB0byAke3RvTm9kZS5uYW1lfWApO1xuICAgICAgICAgIFxuICAgICAgICAgIC8vIENyZWF0ZSBhIGNvbm5lY3RvclxuICAgICAgICAgIGNvbnN0IGNvbm5lY3RvciA9IGZpZ21hLmNyZWF0ZUNvbm5lY3RvcigpO1xuICAgICAgICAgIGNvbm5lY3Rvci5uYW1lID0gYENvbm5lY3RvcjogJHtjb25uZWN0aW9uLmZyb21JZH0g4oaSICR7Y29ubmVjdGlvbi50b0lkfWA7XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gU2V0IGNvbm5lY3RvciBlbmRwb2ludHNcbiAgICAgICAgICBjb25uZWN0b3IuY29ubmVjdG9yU3RhcnQgPSB7XG4gICAgICAgICAgICBlbmRwb2ludE5vZGVJZDogZnJvbU5vZGUuaWQsXG4gICAgICAgICAgICBtYWduZXQ6ICdBVVRPJ1xuICAgICAgICAgIH07XG4gICAgICAgICAgXG4gICAgICAgICAgY29ubmVjdG9yLmNvbm5lY3RvckVuZCA9IHtcbiAgICAgICAgICAgIGVuZHBvaW50Tm9kZUlkOiB0b05vZGUuaWQsXG4gICAgICAgICAgICBtYWduZXQ6ICdBVVRPJ1xuICAgICAgICAgIH07XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gU2V0IHN0cm9rZSBwcm9wZXJ0aWVzXG4gICAgICAgICAgY29ubmVjdG9yLnN0cm9rZXMgPSBbe1xuICAgICAgICAgICAgdHlwZTogJ1NPTElEJyxcbiAgICAgICAgICAgIGNvbG9yOiB7IHI6IDAsIGc6IDAsIGI6IDAgfSxcbiAgICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgICB9XTtcbiAgICAgICAgICBcbiAgICAgICAgICBjb25uZWN0b3Iuc3Ryb2tlV2VpZ2h0ID0gMTtcbiAgICAgICAgICBcbiAgICAgICAgICAvLyBBZHZhbmNlZDogSWYgd2UgaGF2ZSBzcGVjaWZpYyBwb2ludHMgZm9yIHRoZSBjb25uZWN0b3IgcGF0aFxuICAgICAgICAgIGlmIChjb25uZWN0aW9uLnBvaW50cyAmJiBBcnJheS5pc0FycmF5KGNvbm5lY3Rpb24ucG9pbnRzKSAmJiBjb25uZWN0aW9uLnBvaW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQ29ubmVjdGlvbiBoYXMgc3BlY2lmaWMgcG9pbnRzOicsIGNvbm5lY3Rpb24ucG9pbnRzKTtcbiAgICAgICAgICAgIC8vIFRoaXMgaXMganVzdCBhIHBsYWNlaG9sZGVyIC0gYWN0dWFsIG1hbmlwdWxhdGlvbiBvZiBjb25uZWN0b3IgcGF0aHNcbiAgICAgICAgICAgIC8vIHdvdWxkIHJlcXVpcmUgbW9yZSBjb21wbGV4IGludGVyYWN0aW9ucyB3aXRoIHRoZSBGaWdtYSBBUElcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgY29ubmVjdGlvbkNvdW50Kys7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihgRXJyb3IgY3JlYXRpbmcgY29ubmVjdGlvbiBmcm9tICR7Y29ubmVjdGlvbi5mcm9tSWR9IHRvICR7Y29ubmVjdGlvbi50b0lkfTpgLCBlcnJvcik7XG4gICAgICAgICAgLy8gQ29udGludWUgd2l0aCBvdGhlciBjb25uZWN0aW9uc1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIGNvbnNvbGUubG9nKGBTdWNjZXNzZnVsbHkgY3JlYXRlZCAke2Nvbm5lY3Rpb25Db3VudH0gY29ubmVjdGlvbnNgKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBpbiBjcmVhdGVDb25uZWN0aW9uczonLCBlcnJvcik7XG4gICAgLy8gRG9uJ3QgcmV0aHJvdyB0aGUgZXJyb3IgdG8gcHJldmVudCB0aGUgd2hvbGUgY29udmVyc2lvbiBwcm9jZXNzIGZyb20gZmFpbGluZ1xuICB9XG59XG4iLCJpbnRlcmZhY2UgU3ZnRWxlbWVudCB7XG4gIHR5cGU6IHN0cmluZztcbiAgaWQ6IHN0cmluZztcbiAgeDogbnVtYmVyO1xuICB5OiBudW1iZXI7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICBwYXRoRGF0YT86IHN0cmluZztcbiAgdGV4dD86IHN0cmluZztcbiAgZmlsbD86IHN0cmluZztcbiAgc3Ryb2tlPzogc3RyaW5nO1xuICBzdHJva2VXaWR0aD86IG51bWJlcjtcbiAgY29ubmVjdGlvbnM6IEFycmF5PHtcbiAgICBmcm9tSWQ6IHN0cmluZztcbiAgICB0b0lkOiBzdHJpbmc7XG4gICAgcG9pbnRzPzogbnVtYmVyW11bXTtcbiAgfT47XG4gIGNoaWxkcmVuPzogU3ZnRWxlbWVudFtdO1xufVxuXG5pbnRlcmZhY2UgUGFyc2VkU3ZnIHtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIHZpZXdCb3g6IHtcbiAgICBtaW5YOiBudW1iZXI7XG4gICAgbWluWTogbnVtYmVyO1xuICAgIHdpZHRoOiBudW1iZXI7XG4gICAgaGVpZ2h0OiBudW1iZXI7XG4gIH07XG4gIGVsZW1lbnRzOiBTdmdFbGVtZW50W107XG59XG5cbi8qKlxuICogR2VuZXJhdGVzIGEgcmFuZG9tIElEIGZvciBlbGVtZW50cyB3aXRob3V0IElEc1xuICovXG5mdW5jdGlvbiBnZW5lcmF0ZUlkKCk6IHN0cmluZyB7XG4gIHJldHVybiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMiwgMTApO1xufVxuXG4vKipcbiAqIEZpbmRzIGEgbm9kZSBhdCB0aGUgZ2l2ZW4gY29vcmRpbmF0ZXNcbiAqL1xuZnVuY3Rpb24gZmluZE5vZGVBdFBvaW50KFxuICBlbGVtZW50czogU3ZnRWxlbWVudFtdLCBcbiAgeDogbnVtYmVyLCBcbiAgeTogbnVtYmVyLCBcbiAgZXhjbHVkZUlkOiBzdHJpbmdcbik6IFN2Z0VsZW1lbnQgfCBudWxsIHtcbiAgY29uc3QgdG9sZXJhbmNlID0gNTsgIC8vIEFsbG93IHNvbWUgbWFyZ2luIGZvciBjb25uZWN0aW9uIHBvaW50c1xuICBcbiAgZm9yIChjb25zdCBlbGVtZW50IG9mIGVsZW1lbnRzKSB7XG4gICAgLy8gU2tpcCBsaW5lcyBhbmQgdGhlIGVsZW1lbnQgaXRzZWxmXG4gICAgaWYgKGVsZW1lbnQuaWQgPT09IGV4Y2x1ZGVJZCB8fCBlbGVtZW50LnR5cGUgPT09ICdsaW5lJykge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIFxuICAgIGlmIChlbGVtZW50LnR5cGUgPT09ICdjaXJjbGUnKSB7XG4gICAgICAvLyBGb3IgY2lyY2xlcywgY2hlY2sgaWYgcG9pbnQgaXMgd2l0aGluIHJhZGl1c1xuICAgICAgY29uc3QgY2VudGVyWCA9IGVsZW1lbnQueCArIGVsZW1lbnQud2lkdGggLyAyO1xuICAgICAgY29uc3QgY2VudGVyWSA9IGVsZW1lbnQueSArIGVsZW1lbnQuaGVpZ2h0IC8gMjtcbiAgICAgIGNvbnN0IHJhZGl1cyA9IGVsZW1lbnQud2lkdGggLyAyO1xuICAgICAgXG4gICAgICBjb25zdCBkaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyh4IC0gY2VudGVyWCwgMikgKyBNYXRoLnBvdyh5IC0gY2VudGVyWSwgMikpO1xuICAgICAgaWYgKGRpc3RhbmNlIDw9IHJhZGl1cyArIHRvbGVyYW5jZSkge1xuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRm9yIHJlY3RhbmdsZXMgYW5kIG90aGVyIGVsZW1lbnRzLCBjaGVjayBpZiBwb2ludCBpcyB3aXRoaW4gYm91bmRzXG4gICAgICBpZiAoXG4gICAgICAgIHggPj0gZWxlbWVudC54IC0gdG9sZXJhbmNlICYmXG4gICAgICAgIHggPD0gZWxlbWVudC54ICsgZWxlbWVudC53aWR0aCArIHRvbGVyYW5jZSAmJlxuICAgICAgICB5ID49IGVsZW1lbnQueSAtIHRvbGVyYW5jZSAmJlxuICAgICAgICB5IDw9IGVsZW1lbnQueSArIGVsZW1lbnQuaGVpZ2h0ICsgdG9sZXJhbmNlXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiBQYXJzZXMgYW4gU1ZHIHN0cmluZyBhbmQgZXh0cmFjdHMgZmxvd2NoYXJ0IGVsZW1lbnRzIGFuZCB0aGVpciByZWxhdGlvbnNoaXBzXG4gKiBAcGFyYW0gc3ZnQ29udGVudCBUaGUgU1ZHIGZpbGUgY29udGVudCBhcyBhIHN0cmluZ1xuICogQHJldHVybnMgQSBwYXJzZWQgcmVwcmVzZW50YXRpb24gb2YgdGhlIFNWR1xuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VTdmcoc3ZnQ29udGVudDogc3RyaW5nKTogUGFyc2VkU3ZnIHtcbiAgdHJ5IHtcbiAgICAvLyBGb3IgRmlnbWEgcGx1Z2luIGVudmlyb25tZW50LCB3ZSdsbCB1c2UgYSBzaW1wbGlmaWVkIHBhcnNpbmcgYXBwcm9hY2hcbiAgICBcbiAgICAvLyBCYXNpYyBjaGVjayBmb3IgU1ZHIGZvcm1hdFxuICAgIGlmICghc3ZnQ29udGVudC5pbmNsdWRlcygnPHN2ZycpIHx8ICFzdmdDb250ZW50LmluY2x1ZGVzKCc8L3N2Zz4nKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIFNWRyBmaWxlOiBNaXNzaW5nIFNWRyB0YWdzJyk7XG4gICAgfVxuICAgIFxuICAgIC8vIEV4dHJhY3Qgcm9vdCBTVkcgZWxlbWVudCBwcm9wZXJ0aWVzIHVzaW5nIHJlZ2V4XG4gICAgY29uc3Qgd2lkdGhNYXRjaCA9IHN2Z0NvbnRlbnQubWF0Y2goL3dpZHRoPVtcIiddKFteXCInXSopW1wiJ10vKTtcbiAgICBjb25zdCBoZWlnaHRNYXRjaCA9IHN2Z0NvbnRlbnQubWF0Y2goL2hlaWdodD1bXCInXShbXlwiJ10qKVtcIiddLyk7XG4gICAgY29uc3Qgdmlld0JveE1hdGNoID0gc3ZnQ29udGVudC5tYXRjaCgvdmlld0JveD1bXCInXShbXlwiJ10qKVtcIiddLyk7XG4gICAgXG4gICAgY29uc3Qgc3ZnV2lkdGggPSB3aWR0aE1hdGNoID8gcGFyc2VGbG9hdCh3aWR0aE1hdGNoWzFdKSA6IDA7XG4gICAgY29uc3Qgc3ZnSGVpZ2h0ID0gaGVpZ2h0TWF0Y2ggPyBwYXJzZUZsb2F0KGhlaWdodE1hdGNoWzFdKSA6IDA7XG4gICAgXG4gICAgLy8gUGFyc2Ugdmlld0JveFxuICAgIGxldCB2aWV3Qm94ID0ge1xuICAgICAgbWluWDogMCxcbiAgICAgIG1pblk6IDAsXG4gICAgICB3aWR0aDogc3ZnV2lkdGggfHwgODAwLFxuICAgICAgaGVpZ2h0OiBzdmdIZWlnaHQgfHwgNjAwXG4gICAgfTtcbiAgICBcbiAgICBpZiAodmlld0JveE1hdGNoKSB7XG4gICAgICBjb25zdCB2aWV3Qm94VmFsdWVzID0gdmlld0JveE1hdGNoWzFdLnNwbGl0KC9cXHMrLykubWFwKHBhcnNlRmxvYXQpO1xuICAgICAgaWYgKHZpZXdCb3hWYWx1ZXMubGVuZ3RoID49IDQpIHtcbiAgICAgICAgdmlld0JveCA9IHtcbiAgICAgICAgICBtaW5YOiB2aWV3Qm94VmFsdWVzWzBdIHx8IDAsXG4gICAgICAgICAgbWluWTogdmlld0JveFZhbHVlc1sxXSB8fCAwLFxuICAgICAgICAgIHdpZHRoOiB2aWV3Qm94VmFsdWVzWzJdIHx8IHN2Z1dpZHRoIHx8IDgwMCxcbiAgICAgICAgICBoZWlnaHQ6IHZpZXdCb3hWYWx1ZXNbM10gfHwgc3ZnSGVpZ2h0IHx8IDYwMFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBDcmVhdGUgYSBzaW1wbGlmaWVkIHBhcnNpbmcgYXBwcm9hY2ggdG8gZXh0cmFjdCBlbGVtZW50c1xuICAgIGNvbnN0IGVsZW1lbnRzOiBTdmdFbGVtZW50W10gPSBbXTtcbiAgICBcbiAgICAvLyBFeHRyYWN0IHJlY3RhbmdsZXMgd2l0aCByZWdleFxuICAgIGNvbnN0IHJlY3RSZWdleCA9IC88cmVjdFtePl0qP3g9W1wiJ10oW15cIiddKilbXCInXVtePl0qP3k9W1wiJ10oW15cIiddKilbXCInXVtePl0qP3dpZHRoPVtcIiddKFteXCInXSopW1wiJ11bXj5dKj9oZWlnaHQ9W1wiJ10oW15cIiddKilbXCInXVtePl0qPyg/OlxcLz58PjxcXC9yZWN0PikvZztcbiAgICBsZXQgcmVjdE1hdGNoO1xuICAgIHdoaWxlICgocmVjdE1hdGNoID0gcmVjdFJlZ2V4LmV4ZWMoc3ZnQ29udGVudCkpICE9PSBudWxsKSB7XG4gICAgICBlbGVtZW50cy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ3JlY3QnLFxuICAgICAgICBpZDogYHJlY3QtJHtnZW5lcmF0ZUlkKCl9YCxcbiAgICAgICAgeDogcGFyc2VGbG9hdChyZWN0TWF0Y2hbMV0pLFxuICAgICAgICB5OiBwYXJzZUZsb2F0KHJlY3RNYXRjaFsyXSksXG4gICAgICAgIHdpZHRoOiBwYXJzZUZsb2F0KHJlY3RNYXRjaFszXSksXG4gICAgICAgIGhlaWdodDogcGFyc2VGbG9hdChyZWN0TWF0Y2hbNF0pLFxuICAgICAgICBmaWxsOiAnd2hpdGUnLFxuICAgICAgICBzdHJva2U6ICdibGFjaycsXG4gICAgICAgIHN0cm9rZVdpZHRoOiAxLFxuICAgICAgICBjb25uZWN0aW9uczogW11cbiAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICAvLyBFeHRyYWN0IGNpcmNsZXMgd2l0aCByZWdleFxuICAgIGNvbnN0IGNpcmNsZVJlZ2V4ID0gLzxjaXJjbGVbXj5dKj9jeD1bXCInXShbXlwiJ10qKVtcIiddW14+XSo/Y3k9W1wiJ10oW15cIiddKilbXCInXVtePl0qP3I9W1wiJ10oW15cIiddKilbXCInXVtePl0qPyg/OlxcLz58PjxcXC9jaXJjbGU+KS9nO1xuICAgIGxldCBjaXJjbGVNYXRjaDtcbiAgICB3aGlsZSAoKGNpcmNsZU1hdGNoID0gY2lyY2xlUmVnZXguZXhlYyhzdmdDb250ZW50KSkgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IGN4ID0gcGFyc2VGbG9hdChjaXJjbGVNYXRjaFsxXSk7XG4gICAgICBjb25zdCBjeSA9IHBhcnNlRmxvYXQoY2lyY2xlTWF0Y2hbMl0pO1xuICAgICAgY29uc3QgciA9IHBhcnNlRmxvYXQoY2lyY2xlTWF0Y2hbM10pO1xuICAgICAgXG4gICAgICBlbGVtZW50cy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2NpcmNsZScsXG4gICAgICAgIGlkOiBgY2lyY2xlLSR7Z2VuZXJhdGVJZCgpfWAsXG4gICAgICAgIHg6IGN4IC0gcixcbiAgICAgICAgeTogY3kgLSByLFxuICAgICAgICB3aWR0aDogciAqIDIsXG4gICAgICAgIGhlaWdodDogciAqIDIsXG4gICAgICAgIGZpbGw6ICd3aGl0ZScsXG4gICAgICAgIHN0cm9rZTogJ2JsYWNrJyxcbiAgICAgICAgc3Ryb2tlV2lkdGg6IDEsXG4gICAgICAgIGNvbm5lY3Rpb25zOiBbXVxuICAgICAgfSk7XG4gICAgfVxuICAgIFxuICAgIC8vIEV4dHJhY3QgbGluZXMgKHNpbXBsaWZpZWQgZm9yIGNvbm5lY3RvcnMpXG4gICAgY29uc3QgbGluZVJlZ2V4ID0gLzxsaW5lW14+XSo/eDE9W1wiJ10oW15cIiddKilbXCInXVtePl0qP3kxPVtcIiddKFteXCInXSopW1wiJ11bXj5dKj94Mj1bXCInXShbXlwiJ10qKVtcIiddW14+XSo/eTI9W1wiJ10oW15cIiddKilbXCInXVtePl0qPyg/OlxcLz58PjxcXC9saW5lPikvZztcbiAgICBsZXQgbGluZU1hdGNoO1xuICAgIHdoaWxlICgobGluZU1hdGNoID0gbGluZVJlZ2V4LmV4ZWMoc3ZnQ29udGVudCkpICE9PSBudWxsKSB7XG4gICAgICBjb25zdCB4MSA9IHBhcnNlRmxvYXQobGluZU1hdGNoWzFdKTtcbiAgICAgIGNvbnN0IHkxID0gcGFyc2VGbG9hdChsaW5lTWF0Y2hbMl0pO1xuICAgICAgY29uc3QgeDIgPSBwYXJzZUZsb2F0KGxpbmVNYXRjaFszXSk7XG4gICAgICBjb25zdCB5MiA9IHBhcnNlRmxvYXQobGluZU1hdGNoWzRdKTtcbiAgICAgIFxuICAgICAgZWxlbWVudHMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdsaW5lJyxcbiAgICAgICAgaWQ6IGBsaW5lLSR7Z2VuZXJhdGVJZCgpfWAsXG4gICAgICAgIHg6IE1hdGgubWluKHgxLCB4MiksXG4gICAgICAgIHk6IE1hdGgubWluKHkxLCB5MiksXG4gICAgICAgIHdpZHRoOiBNYXRoLmFicyh4MiAtIHgxKSxcbiAgICAgICAgaGVpZ2h0OiBNYXRoLmFicyh5MiAtIHkxKSxcbiAgICAgICAgcGF0aERhdGE6IGBNJHt4MX0sJHt5MX0gTCR7eDJ9LCR7eTJ9YCxcbiAgICAgICAgZmlsbDogJ25vbmUnLFxuICAgICAgICBzdHJva2U6ICdibGFjaycsXG4gICAgICAgIHN0cm9rZVdpZHRoOiAxLFxuICAgICAgICBjb25uZWN0aW9uczogW11cbiAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICAvLyBFeHRyYWN0IHRleHQgZWxlbWVudHNcbiAgICBjb25zdCB0ZXh0UmVnZXggPSAvPHRleHRbXj5dKj94PVtcIiddKFteXCInXSopW1wiJ11bXj5dKj95PVtcIiddKFteXCInXSopW1wiJ11bXj5dKj8+KFtePF0qKTxcXC90ZXh0Pi9nO1xuICAgIGxldCB0ZXh0TWF0Y2g7XG4gICAgd2hpbGUgKCh0ZXh0TWF0Y2ggPSB0ZXh0UmVnZXguZXhlYyhzdmdDb250ZW50KSkgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IHggPSBwYXJzZUZsb2F0KHRleHRNYXRjaFsxXSk7XG4gICAgICBjb25zdCB5ID0gcGFyc2VGbG9hdCh0ZXh0TWF0Y2hbMl0pO1xuICAgICAgY29uc3QgdGV4dENvbnRlbnQgPSB0ZXh0TWF0Y2hbM10udHJpbSgpO1xuICAgICAgY29uc3Qgd2lkdGggPSB0ZXh0Q29udGVudC5sZW5ndGggKiA4OyAgLy8gUm91Z2ggZXN0aW1hdGVcbiAgICAgIGNvbnN0IGhlaWdodCA9IDE2OyAgLy8gVHlwaWNhbCB0ZXh0IGhlaWdodFxuICAgICAgXG4gICAgICBlbGVtZW50cy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICBpZDogYHRleHQtJHtnZW5lcmF0ZUlkKCl9YCxcbiAgICAgICAgeCxcbiAgICAgICAgeTogeSAtIGhlaWdodCwgIC8vIEFkanVzdCB5IHBvc2l0aW9uXG4gICAgICAgIHdpZHRoLFxuICAgICAgICBoZWlnaHQsXG4gICAgICAgIHRleHQ6IHRleHRDb250ZW50LFxuICAgICAgICBmaWxsOiAnYmxhY2snLFxuICAgICAgICBzdHJva2U6ICdub25lJyxcbiAgICAgICAgc3Ryb2tlV2lkdGg6IDAsXG4gICAgICAgIGNvbm5lY3Rpb25zOiBbXVxuICAgICAgfSk7XG4gICAgfVxuICAgIFxuICAgIC8vIERldGVybWluZSBjb25uZWN0aW9ucyBiZXR3ZWVuIGVsZW1lbnRzXG4gICAgZm9yIChjb25zdCBlbGVtZW50IG9mIGVsZW1lbnRzKSB7XG4gICAgICBpZiAoZWxlbWVudC50eXBlID09PSAnbGluZScpIHtcbiAgICAgICAgY29uc3QgbGluZU1hdGNoID0gZWxlbWVudC5wYXRoRGF0YT8ubWF0Y2goL00oW1xcZC4tXSspLChbXFxkLi1dKylcXHMrTChbXFxkLi1dKyksKFtcXGQuLV0rKS8pO1xuICAgICAgICBpZiAobGluZU1hdGNoKSB7XG4gICAgICAgICAgY29uc3Qgc3RhcnRYID0gcGFyc2VGbG9hdChsaW5lTWF0Y2hbMV0pO1xuICAgICAgICAgIGNvbnN0IHN0YXJ0WSA9IHBhcnNlRmxvYXQobGluZU1hdGNoWzJdKTtcbiAgICAgICAgICBjb25zdCBlbmRYID0gcGFyc2VGbG9hdChsaW5lTWF0Y2hbM10pO1xuICAgICAgICAgIGNvbnN0IGVuZFkgPSBwYXJzZUZsb2F0KGxpbmVNYXRjaFs0XSk7XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gRmluZCBub2RlcyB0aGF0IG1pZ2h0IGJlIGNvbm5lY3RlZCBieSB0aGlzIGxpbmVcbiAgICAgICAgICBjb25zdCBzdGFydE5vZGUgPSBmaW5kTm9kZUF0UG9pbnQoZWxlbWVudHMsIHN0YXJ0WCwgc3RhcnRZLCBlbGVtZW50LmlkKTtcbiAgICAgICAgICBjb25zdCBlbmROb2RlID0gZmluZE5vZGVBdFBvaW50KGVsZW1lbnRzLCBlbmRYLCBlbmRZLCBlbGVtZW50LmlkKTtcbiAgICAgICAgICBcbiAgICAgICAgICBpZiAoc3RhcnROb2RlICYmIGVuZE5vZGUpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuY29ubmVjdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgIGZyb21JZDogc3RhcnROb2RlLmlkLFxuICAgICAgICAgICAgICB0b0lkOiBlbmROb2RlLmlkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gQWxzbyBhZGQgY29ubmVjdGlvbiB0byB0aGUgc291cmNlIG5vZGVcbiAgICAgICAgICAgIHN0YXJ0Tm9kZS5jb25uZWN0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgZnJvbUlkOiBzdGFydE5vZGUuaWQsXG4gICAgICAgICAgICAgIHRvSWQ6IGVuZE5vZGUuaWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgd2lkdGg6IHN2Z1dpZHRoIHx8IHZpZXdCb3gud2lkdGgsXG4gICAgICBoZWlnaHQ6IHN2Z0hlaWdodCB8fCB2aWV3Qm94LmhlaWdodCxcbiAgICAgIHZpZXdCb3gsXG4gICAgICBlbGVtZW50c1xuICAgIH07XG4gIH0gY2F0Y2ggKGVycm9yOiB1bmtub3duKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgcGFyc2luZyBTVkc6JywgZXJyb3IpO1xuICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEVycm9yIHBhcnNpbmcgU1ZHOiAke2Vycm9yLm1lc3NhZ2V9YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgcGFyc2luZyBTVkc6IFVua25vd24gZXJyb3InKTtcbiAgICB9XG4gIH1cbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IHN2Z1RvRmlnbWFGbG93Y2hhcnQgfSBmcm9tICcuL3NyYy9maWdtYUNvbnZlcnRlcic7XG5pbXBvcnQgeyBwYXJzZVN2ZyB9IGZyb20gJy4vc3JjL3N2Z1BhcnNlcic7XG5pbXBvcnQgeyBoYW5kbGVFcnJvciB9IGZyb20gJy4vc3JjL2Vycm9ySGFuZGxlcic7XG5cbmZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB3aWR0aDogNDAwLCBoZWlnaHQ6IDUwMCB9KTtcblxuZmlnbWEudWkub25tZXNzYWdlID0gYXN5bmMgKG1zZykgPT4ge1xuICBpZiAobXNnLnR5cGUgPT09ICdjb252ZXJ0LXN2ZycpIHtcbiAgICB0cnkge1xuICAgICAgLy8gUGFyc2UgdGhlIFNWRyBjb250ZW50XG4gICAgICBjb25zdCBwYXJzZWRTdmcgPSBwYXJzZVN2Zyhtc2cuc3ZnQ29udGVudCk7XG4gICAgICBcbiAgICAgIC8vIENyZWF0ZSBhIG5ldyBwYWdlIGZvciB0aGUgZmxvd2NoYXJ0XG4gICAgICBjb25zdCBwYWdlID0gZmlnbWEuY3JlYXRlUGFnZSgpO1xuICAgICAgcGFnZS5uYW1lID0gYEZsb3djaGFydDogJHttc2cuZmlsZU5hbWUucmVwbGFjZSgvXFwuc3ZnJC8sICcnKX1gO1xuICAgICAgZmlnbWEuY3VycmVudFBhZ2UgPSBwYWdlO1xuXG4gICAgICAvLyBDb252ZXJ0IFNWRyB0byBGaWdtYSBmbG93Y2hhcnRcbiAgICAgIGF3YWl0IHN2Z1RvRmlnbWFGbG93Y2hhcnQocGFyc2VkU3ZnKTtcbiAgICAgIFxuICAgICAgLy8gTm90aWZ5IFVJIHRoYXQgY29udmVyc2lvbiBpcyBjb21wbGV0ZVxuICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xuICAgICAgICB0eXBlOiAnY29udmVyc2lvbi1jb21wbGV0ZSdcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBmaWdtYS5ub3RpZnkoJ1NWRyBzdWNjZXNzZnVsbHkgY29udmVydGVkIHRvIGZsb3djaGFydCEnKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICBcbiAgICAgIC8vIEhhbmRsZSB0aGUgZXJyb3IgYW5kIG5vdGlmeSBVSVxuICAgICAgY29uc3QgZXJyb3JNc2cgPSBoYW5kbGVFcnJvcihlcnJvcik7XG4gICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yTXNnXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgZmlnbWEubm90aWZ5KCdFcnJvciBjb252ZXJ0aW5nIFNWRyB0byBmbG93Y2hhcnQnLCB7IGVycm9yOiB0cnVlIH0pO1xuICAgIH1cbiAgfVxufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
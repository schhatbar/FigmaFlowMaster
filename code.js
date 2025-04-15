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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RUFBRTtZQUMzQixLQUFLLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUMzQixHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUN6QixLQUFLLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUMzQixJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUMxQixJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtZQUNoQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUM1QixNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtZQUNoQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtTQUNoQyxDQUFDO1FBRUYsSUFBSSxXQUFXLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUN4QyxPQUFPLFdBQVcsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztRQUM3QyxDQUFDO1FBRUQsT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixPQUFPLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzVDLE9BQU8s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QUM7WUFFckMsd0NBQXdDO1lBQ3hDLEtBQUssQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDO2dCQUNuQixJQUFJLEVBQUUscUJBQXFCO2FBQzVCLENBQUMsQ0FBQztZQUVILEtBQUssQ0FBQyxNQUFNLENBQUMsMENBQTBDLENBQUMsQ0FBQztRQUMzRCxDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNmLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFckIsaUNBQWlDO1lBQ2pDLE1BQU0sUUFBUSxHQUFHLDhEQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUM7Z0JBQ25CLElBQUksRUFBRSxPQUFPO2dCQUNiLE9BQU8sRUFBRSxRQUFRO2FBQ2xCLENBQUMsQ0FBQztZQUVILEtBQUssQ0FBQyxNQUFNLENBQUMsbUNBQW1DLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNyRSxDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUMsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3dvcmtzcGFjZS8uL3NyYy9lcnJvckhhbmRsZXIudHMiLCJ3ZWJwYWNrOi8vd29ya3NwYWNlLy4vc3JjL2ZpZ21hQ29udmVydGVyLnRzIiwid2VicGFjazovL3dvcmtzcGFjZS8uL3NyYy9zdmdQYXJzZXIudHMiLCJ3ZWJwYWNrOi8vd29ya3NwYWNlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dvcmtzcGFjZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd29ya3NwYWNlL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vd29ya3NwYWNlL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd29ya3NwYWNlLy4vY29kZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEhhbmRsZXMgZXJyb3JzIGFuZCByZXR1cm5zIGFwcHJvcHJpYXRlIGVycm9yIG1lc3NhZ2VzXG4gKiBAcGFyYW0gZXJyb3IgVGhlIGVycm9yIHRvIGhhbmRsZVxuICogQHJldHVybnMgQSB1c2VyLWZyaWVuZGx5IGVycm9yIG1lc3NhZ2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZUVycm9yKGVycm9yOiBhbnkpOiBzdHJpbmcge1xuICBjb25zb2xlLmVycm9yKCdFcnJvciBvY2N1cnJlZDonLCBlcnJvcik7XG4gIFxuICAvLyBDaGVjayBlcnJvciB0eXBlXG4gIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgY29uc3QgZXJyb3JNZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICBcbiAgICAvLyBIYW5kbGUgc3BlY2lmaWMgZXJyb3IgdHlwZXNcbiAgICBpZiAoZXJyb3JNZXNzYWdlLmluY2x1ZGVzKCdJbnZhbGlkIFNWRycpKSB7XG4gICAgICByZXR1cm4gJ1RoZSBTVkcgZmlsZSBpcyBpbnZhbGlkIG9yIGNvcnJ1cHRlZC4gUGxlYXNlIGNoZWNrIHRoZSBmaWxlIGFuZCB0cnkgYWdhaW4uJztcbiAgICB9XG4gICAgXG4gICAgaWYgKGVycm9yTWVzc2FnZS5pbmNsdWRlcygnTWlzc2luZyByb290IFNWRyBlbGVtZW50JykpIHtcbiAgICAgIHJldHVybiAnVGhlIGZpbGUgZG9lcyBub3QgYXBwZWFyIHRvIGJlIGEgdmFsaWQgU1ZHLiBQbGVhc2UgY2hlY2sgdGhlIGZpbGUgZm9ybWF0Lic7XG4gICAgfVxuICAgIFxuICAgIGlmIChlcnJvck1lc3NhZ2UuaW5jbHVkZXMoJ3Blcm1pc3Npb24nKSkge1xuICAgICAgcmV0dXJuICdUaGUgcGx1Z2luIGRvZXMgbm90IGhhdmUgcGVybWlzc2lvbiB0byBwZXJmb3JtIHRoaXMgYWN0aW9uLiBQbGVhc2UgdHJ5IGFnYWluLic7XG4gICAgfVxuICAgIFxuICAgIGlmIChlcnJvck1lc3NhZ2UuaW5jbHVkZXMoJ0ZvbnQnKSkge1xuICAgICAgcmV0dXJuICdUaGVyZSB3YXMgYW4gaXNzdWUgd2l0aCBsb2FkaW5nIGZvbnRzLiBQbGVhc2UgdHJ5IGFnYWluLic7XG4gICAgfVxuICAgIFxuICAgIC8vIFJldHVybiB0aGUgb3JpZ2luYWwgZXJyb3IgbWVzc2FnZSBpZiBpdCdzIHNwZWNpZmljXG4gICAgcmV0dXJuIGBFcnJvcjogJHtlcnJvck1lc3NhZ2V9YDtcbiAgfVxuICBcbiAgLy8gRm9yIFNWRyBwYXJzaW5nIGVycm9yc1xuICBpZiAodHlwZW9mIGVycm9yID09PSAnb2JqZWN0JyAmJiBlcnJvciAhPT0gbnVsbCkge1xuICAgIGlmICgnbWVzc2FnZScgaW4gZXJyb3IpIHtcbiAgICAgIGlmICh0eXBlb2YgZXJyb3IubWVzc2FnZSA9PT0gJ3N0cmluZycgJiYgZXJyb3IubWVzc2FnZS5pbmNsdWRlcygnU1ZHJykpIHtcbiAgICAgICAgcmV0dXJuIGBTVkcgcGFyc2luZyBlcnJvcjogJHtlcnJvci5tZXNzYWdlfWA7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHJldHVybiBgRXJyb3I6ICR7ZXJyb3IubWVzc2FnZX1gO1xuICAgIH1cbiAgfVxuICBcbiAgLy8gR2VuZXJpYyBlcnJvciBtZXNzYWdlXG4gIHJldHVybiAnQW4gdW5leHBlY3RlZCBlcnJvciBvY2N1cnJlZC4gUGxlYXNlIHRyeSBhZ2FpbiBvciB0cnkgd2l0aCBhIGRpZmZlcmVudCBTVkcgZmlsZS4nO1xufVxuXG4vKipcbiAqIExvZyBlcnJvciB3aXRoIGRldGFpbHMgdG8gdGhlIGNvbnNvbGUgZm9yIGRlYnVnZ2luZ1xuICogQHBhcmFtIGNvbnRleHQgVGhlIGNvbnRleHQgd2hlcmUgdGhlIGVycm9yIG9jY3VycmVkXG4gKiBAcGFyYW0gZXJyb3IgVGhlIGVycm9yIG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gbG9nRXJyb3IoY29udGV4dDogc3RyaW5nLCBlcnJvcjogYW55KTogdm9pZCB7XG4gIGNvbnNvbGUuZXJyb3IoYEVycm9yIGluICR7Y29udGV4dH06YCwgZXJyb3IpO1xuICBcbiAgLy8gQWRkaXRpb25hbCBsb2dnaW5nIGZvciBkZWJ1Z2dpbmdcbiAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdTdGFjayB0cmFjZTonLCBlcnJvci5zdGFjayk7XG4gIH1cbn1cbiIsImltcG9ydCB7IGhhbmRsZUVycm9yIH0gZnJvbSAnLi9lcnJvckhhbmRsZXInO1xuXG4vKipcbiAqIENvbnZlcnRzIGEgcGFyc2VkIFNWRyBzdHJ1Y3R1cmUgdG8gYSBGaWdtYSBmbG93Y2hhcnRcbiAqIEBwYXJhbSBwYXJzZWRTdmcgVGhlIHBhcnNlZCBTVkcgZGF0YVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc3ZnVG9GaWdtYUZsb3djaGFydChwYXJzZWRTdmc6IGFueSk6IFByb21pc2U8dm9pZD4ge1xuICB0cnkge1xuICAgIC8vIExvYWQgZm9udHMgZmlyc3QgdG8gZW5zdXJlIHRleHQgZWxlbWVudHMgcmVuZGVyIHByb3Blcmx5XG4gICAgYXdhaXQgZmlnbWEubG9hZEZvbnRBc3luYyh7IGZhbWlseTogXCJJbnRlclwiLCBzdHlsZTogXCJSZWd1bGFyXCIgfSk7XG4gICAgYXdhaXQgZmlnbWEubG9hZEZvbnRBc3luYyh7IGZhbWlseTogXCJJbnRlclwiLCBzdHlsZTogXCJNZWRpdW1cIiB9KTtcbiAgICBcbiAgICAvLyBDYWxjdWxhdGUgc2NhbGUgZmFjdG9yc1xuICAgIGNvbnN0IHNjYWxlID0gY2FsY3VsYXRlU2NhbGUocGFyc2VkU3ZnLnZpZXdCb3gpO1xuICAgIFxuICAgIC8vIENyZWF0ZSBub2Rlc1xuICAgIGNvbnN0IGZpZ21hTm9kZXMgPSBhd2FpdCBjcmVhdGVGaWdtYU5vZGVzKHBhcnNlZFN2Zy5lbGVtZW50cywgc2NhbGUpO1xuICAgIFxuICAgIC8vIENyZWF0ZSBjb25uZWN0aW9ucyBiZXR3ZWVuIG5vZGVzXG4gICAgYXdhaXQgY3JlYXRlQ29ubmVjdGlvbnMoZmlnbWFOb2RlcywgcGFyc2VkU3ZnLmVsZW1lbnRzKTtcbiAgICBcbiAgICAvLyBTZWxlY3QgYWxsIGNyZWF0ZWQgbm9kZXNcbiAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBPYmplY3QudmFsdWVzKGZpZ21hTm9kZXMpO1xuICAgIFxuICAgIC8vIFpvb20gdG8gZml0IHRoZSBjcmVhdGVkIG5vZGVzXG4gICAgZmlnbWEudmlld3BvcnQuc2Nyb2xsQW5kWm9vbUludG9WaWV3KE9iamVjdC52YWx1ZXMoZmlnbWFOb2RlcykpO1xuICAgIFxuICB9IGNhdGNoIChlcnJvcjogdW5rbm93bikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGNvbnZlcnRpbmcgdG8gRmlnbWEgZmxvd2NoYXJ0OicsIGVycm9yKTtcbiAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFcnJvciBjb252ZXJ0aW5nIHRvIEZpZ21hIGZsb3djaGFydDogJHtlcnJvci5tZXNzYWdlfWApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIGNvbnZlcnRpbmcgdG8gRmlnbWEgZmxvd2NoYXJ0OiBVbmtub3duIGVycm9yJyk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlcyBzY2FsZSBmYWN0b3JzIGZvciBjb252ZXJ0aW5nIGZyb20gU1ZHIGNvb3JkaW5hdGVzIHRvIEZpZ21hXG4gKi9cbmZ1bmN0aW9uIGNhbGN1bGF0ZVNjYWxlKHZpZXdCb3g6IGFueSk6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSB7XG4gIC8vIEZvciBzaW1wbGljaXR5LCB3ZSdsbCB1c2UgYSAxOjEgbWFwcGluZywgYnV0IHRoaXMgY291bGQgYmUgYWRqdXN0ZWRcbiAgLy8gaWYgd2UgbmVlZCB0byBzY2FsZSB0aGUgZmxvd2NoYXJ0IGRpZmZlcmVudGx5XG4gIHJldHVybiB7IHg6IDEsIHk6IDEgfTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIEZpZ21hIG5vZGVzIGZyb20gU1ZHIGVsZW1lbnRzXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUZpZ21hTm9kZXMoXG4gIGVsZW1lbnRzOiBhbnlbXSwgXG4gIHNjYWxlOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH1cbik6IFByb21pc2U8eyBbaWQ6IHN0cmluZ106IFNjZW5lTm9kZSB9PiB7XG4gIGNvbnN0IGZpZ21hTm9kZXM6IHsgW2lkOiBzdHJpbmddOiBTY2VuZU5vZGUgfSA9IHt9O1xuICBcbiAgLy8gUHJvY2VzcyBlbGVtZW50c1xuICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgZWxlbWVudHMpIHtcbiAgICAvLyBTa2lwIGVsZW1lbnRzIHRoYXQgYXJlIGxpa2VseSB0byBiZSBjb25uZWN0b3JzXG4gICAgaWYgKGlzQ29ubmVjdG9yKGVsZW1lbnQpKSBjb250aW51ZTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgY29uc3Qgbm9kZSA9IGF3YWl0IGNyZWF0ZUZpZ21hTm9kZShlbGVtZW50LCBzY2FsZSk7XG4gICAgICBpZiAobm9kZSkge1xuICAgICAgICBmaWdtYU5vZGVzW2VsZW1lbnQuaWRdID0gbm9kZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS53YXJuKGBFcnJvciBjcmVhdGluZyBub2RlIGZvciBlbGVtZW50ICR7ZWxlbWVudC5pZH06YCwgZXJyb3IpO1xuICAgICAgLy8gQ29udGludWUgd2l0aCBvdGhlciBlbGVtZW50c1xuICAgIH1cbiAgfVxuICBcbiAgcmV0dXJuIGZpZ21hTm9kZXM7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGFuIGVsZW1lbnQgaXMgbGlrZWx5IHRvIGJlIGEgY29ubmVjdG9yIHJhdGhlciB0aGFuIGEgbm9kZVxuICovXG5mdW5jdGlvbiBpc0Nvbm5lY3RvcihlbGVtZW50OiBhbnkpOiBib29sZWFuIHtcbiAgLy8gTGluZXMgYXJlIGFsbW9zdCBhbHdheXMgY29ubmVjdG9yc1xuICBpZiAoZWxlbWVudC50eXBlID09PSAnbGluZScpIHJldHVybiB0cnVlO1xuICBcbiAgLy8gUGF0aHMgYW5kIHBvbHlsaW5lcyB3aXRoIFwibm9uZVwiIGZpbGwgYXJlIGxpa2VseSBjb25uZWN0b3JzXG4gIGlmICgoZWxlbWVudC50eXBlID09PSAncGF0aCcgfHwgZWxlbWVudC50eXBlID09PSAncG9seWxpbmUnKSAmJiBcbiAgICAgIGVsZW1lbnQuZmlsbCA9PT0gJ25vbmUnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgXG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgRmlnbWEgbm9kZSBmcm9tIGFuIFNWRyBlbGVtZW50XG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUZpZ21hTm9kZShlbGVtZW50OiBhbnksIHNjYWxlOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH0pOiBQcm9taXNlPFNjZW5lTm9kZSB8IG51bGw+IHtcbiAgLy8gU2NhbGUgY29vcmRpbmF0ZXNcbiAgY29uc3QgeCA9IGVsZW1lbnQueCAqIHNjYWxlLng7XG4gIGNvbnN0IHkgPSBlbGVtZW50LnkgKiBzY2FsZS55O1xuICBjb25zdCB3aWR0aCA9IGVsZW1lbnQud2lkdGggKiBzY2FsZS54O1xuICBjb25zdCBoZWlnaHQgPSBlbGVtZW50LmhlaWdodCAqIHNjYWxlLnk7XG4gIFxuICBsZXQgbm9kZTogU2NlbmVOb2RlIHwgbnVsbCA9IG51bGw7XG4gIFxuICAvLyBDaG9vc2UgdGhlIG5vZGUgdHlwZSBiYXNlZCBvbiB0aGUgU1ZHIGVsZW1lbnQgdHlwZVxuICBzd2l0Y2ggKGVsZW1lbnQudHlwZSkge1xuICAgIGNhc2UgJ3JlY3QnOlxuICAgICAgbm9kZSA9IGZpZ21hLmNyZWF0ZVJlY3RhbmdsZSgpO1xuICAgICAgbm9kZS54ID0geDtcbiAgICAgIG5vZGUueSA9IHk7XG4gICAgICBub2RlLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgIGJyZWFrO1xuICAgICAgXG4gICAgY2FzZSAnY2lyY2xlJzpcbiAgICAgIG5vZGUgPSBmaWdtYS5jcmVhdGVFbGxpcHNlKCk7XG4gICAgICBub2RlLnggPSB4O1xuICAgICAgbm9kZS55ID0geTtcbiAgICAgIG5vZGUucmVzaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgYnJlYWs7XG4gICAgICBcbiAgICBjYXNlICdlbGxpcHNlJzpcbiAgICAgIG5vZGUgPSBmaWdtYS5jcmVhdGVFbGxpcHNlKCk7XG4gICAgICBub2RlLnggPSB4O1xuICAgICAgbm9kZS55ID0geTtcbiAgICAgIG5vZGUucmVzaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgYnJlYWs7XG4gICAgICBcbiAgICBjYXNlICdwb2x5Z29uJzpcbiAgICAgIC8vIEZvciBwb2x5Z29ucywgY3JlYXRlIGEgc2hhcGUgd2l0aCBhIHZlY3RvciBuZXR3b3JrXG4gICAgICBjb25zdCBwb2x5Z29uID0gZmlnbWEuY3JlYXRlUG9seWdvbigpO1xuICAgICAgcG9seWdvbi54ID0geDtcbiAgICAgIHBvbHlnb24ueSA9IHk7XG4gICAgICBwb2x5Z29uLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgIG5vZGUgPSBwb2x5Z29uO1xuICAgICAgYnJlYWs7XG4gICAgICBcbiAgICBjYXNlICdwYXRoJzpcbiAgICAgIC8vIElmIHRoZSBwYXRoIGhhcyBhIGZpbGwsIGl0J3MgbGlrZWx5IGEgc2hhcGUgbm9kZVxuICAgICAgaWYgKGVsZW1lbnQuZmlsbCAhPT0gJ25vbmUnKSB7XG4gICAgICAgIGNvbnN0IHNoYXBlID0gZmlnbWEuY3JlYXRlUmVjdGFuZ2xlKCk7ICAvLyBBcyBhIGZhbGxiYWNrXG4gICAgICAgIHNoYXBlLnggPSB4O1xuICAgICAgICBzaGFwZS55ID0geTtcbiAgICAgICAgc2hhcGUucmVzaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICBub2RlID0gc2hhcGU7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICAgIFxuICAgIGNhc2UgJ3RleHQnOlxuICAgICAgY29uc3QgdGV4dCA9IGZpZ21hLmNyZWF0ZVRleHQoKTtcbiAgICAgIGF3YWl0IGZpZ21hLmxvYWRGb250QXN5bmMoeyBmYW1pbHk6IFwiSW50ZXJcIiwgc3R5bGU6IFwiUmVndWxhclwiIH0pO1xuICAgICAgdGV4dC54ID0geDtcbiAgICAgIHRleHQueSA9IHk7XG4gICAgICB0ZXh0LnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgIHRleHQuY2hhcmFjdGVycyA9IGVsZW1lbnQudGV4dCB8fCAnJztcbiAgICAgIG5vZGUgPSB0ZXh0O1xuICAgICAgYnJlYWs7XG4gICAgICBcbiAgICBjYXNlICdncm91cCc6XG4gICAgICAvLyBGb3IgZ3JvdXBzLCBjcmVhdGUgYSBmcmFtZSBhbmQgYWRkIGNoaWxkcmVuXG4gICAgICBjb25zdCBmcmFtZSA9IGZpZ21hLmNyZWF0ZUZyYW1lKCk7XG4gICAgICBmcmFtZS54ID0geDtcbiAgICAgIGZyYW1lLnkgPSB5O1xuICAgICAgZnJhbWUucmVzaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgXG4gICAgICAvLyBQcm9jZXNzIGNoaWxkcmVuIHJlY3Vyc2l2ZWx5XG4gICAgICBpZiAoZWxlbWVudC5jaGlsZHJlbiAmJiBlbGVtZW50LmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgY2hpbGROb2RlcyA9IGF3YWl0IGNyZWF0ZUZpZ21hTm9kZXMoZWxlbWVudC5jaGlsZHJlbiwgc2NhbGUpO1xuICAgICAgICBcbiAgICAgICAgLy8gQWRkIGNoaWxkcmVuIHRvIHRoZSBmcmFtZVxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkTm9kZSBvZiBPYmplY3QudmFsdWVzKGNoaWxkTm9kZXMpKSB7XG4gICAgICAgICAgLy8gQWRqdXN0IHBvc2l0aW9uIHJlbGF0aXZlIHRvIGZyYW1lXG4gICAgICAgICAgY2hpbGROb2RlLnggLT0geDtcbiAgICAgICAgICBjaGlsZE5vZGUueSAtPSB5O1xuICAgICAgICAgIGZyYW1lLmFwcGVuZENoaWxkKGNoaWxkTm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgbm9kZSA9IGZyYW1lO1xuICAgICAgYnJlYWs7XG4gIH1cbiAgXG4gIC8vIEFwcGx5IGNvbW1vbiBwcm9wZXJ0aWVzIGlmIGEgbm9kZSB3YXMgY3JlYXRlZFxuICBpZiAobm9kZSkge1xuICAgIC8vIFNldCBuYW1lXG4gICAgbm9kZS5uYW1lID0gZWxlbWVudC5pZCB8fCBgJHtlbGVtZW50LnR5cGV9LW5vZGVgO1xuICAgIFxuICAgIC8vIEFwcGx5IGZpbGxzIGlmIGFwcGxpY2FibGVcbiAgICBpZiAoJ2ZpbGxzJyBpbiBub2RlICYmIGVsZW1lbnQuZmlsbCAmJiBlbGVtZW50LmZpbGwgIT09ICdub25lJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmdiQ29sb3IgPSBwYXJzZUNvbG9yKGVsZW1lbnQuZmlsbCk7XG4gICAgICAgIG5vZGUuZmlsbHMgPSBbe1xuICAgICAgICAgIHR5cGU6ICdTT0xJRCcsXG4gICAgICAgICAgY29sb3I6IHJnYkNvbG9yLFxuICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgfV07XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLndhcm4oYENvdWxkIG5vdCBhcHBseSBmaWxsIGZvciBub2RlICR7bm9kZS5uYW1lfTpgLCBlcnJvcik7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIEFwcGx5IHN0cm9rZXMgaWYgYXBwbGljYWJsZVxuICAgIGlmICgnc3Ryb2tlcycgaW4gbm9kZSAmJiBlbGVtZW50LnN0cm9rZSAmJiBlbGVtZW50LnN0cm9rZSAhPT0gJ25vbmUnKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZ2JDb2xvciA9IHBhcnNlQ29sb3IoZWxlbWVudC5zdHJva2UpO1xuICAgICAgICBub2RlLnN0cm9rZXMgPSBbe1xuICAgICAgICAgIHR5cGU6ICdTT0xJRCcsXG4gICAgICAgICAgY29sb3I6IHJnYkNvbG9yLFxuICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgfV07XG4gICAgICAgIFxuICAgICAgICBpZiAoZWxlbWVudC5zdHJva2VXaWR0aCkge1xuICAgICAgICAgIG5vZGUuc3Ryb2tlV2VpZ2h0ID0gZWxlbWVudC5zdHJva2VXaWR0aDtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGBDb3VsZCBub3QgYXBwbHkgc3Ryb2tlIGZvciBub2RlICR7bm9kZS5uYW1lfTpgLCBlcnJvcik7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICByZXR1cm4gbm9kZTtcbn1cblxuLyoqXG4gKiBQYXJzZXMgYSBjb2xvciBzdHJpbmcgKGhleCwgcmdiLCBldGMuKSB0byBSR0IgY29tcG9uZW50c1xuICovXG5mdW5jdGlvbiBwYXJzZUNvbG9yKGNvbG9yU3RyOiBzdHJpbmcpOiB7IHI6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIgfSB7XG4gIC8vIERlZmF1bHQgY29sb3IgaWYgcGFyc2luZyBmYWlsc1xuICBjb25zdCBkZWZhdWx0Q29sb3IgPSB7IHI6IDAsIGc6IDAsIGI6IDAgfTtcbiAgXG4gIHRyeSB7XG4gICAgLy8gSGFuZGxlIGhleCBmb3JtYXQgKCNSUkdHQkIpXG4gICAgaWYgKGNvbG9yU3RyLnN0YXJ0c1dpdGgoJyMnKSkge1xuICAgICAgY29uc3QgaGV4ID0gY29sb3JTdHIuc2xpY2UoMSk7XG4gICAgICBpZiAoaGV4Lmxlbmd0aCA9PT0gNikge1xuICAgICAgICBjb25zdCByID0gcGFyc2VJbnQoaGV4LnN1YnN0cmluZygwLCAyKSwgMTYpIC8gMjU1O1xuICAgICAgICBjb25zdCBnID0gcGFyc2VJbnQoaGV4LnN1YnN0cmluZygyLCA0KSwgMTYpIC8gMjU1O1xuICAgICAgICBjb25zdCBiID0gcGFyc2VJbnQoaGV4LnN1YnN0cmluZyg0LCA2KSwgMTYpIC8gMjU1O1xuICAgICAgICByZXR1cm4geyByLCBnLCBiIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gZGVmYXVsdENvbG9yO1xuICAgIH1cbiAgICBcbiAgICAvLyBIYW5kbGUgcmdiIGZvcm1hdFxuICAgIGlmIChjb2xvclN0ci5zdGFydHNXaXRoKCdyZ2InKSkge1xuICAgICAgY29uc3QgbWF0Y2ggPSBjb2xvclN0ci5tYXRjaCgvcmdiXFwoXFxzKihcXGQrKVxccyosXFxzKihcXGQrKVxccyosXFxzKihcXGQrKVxccypcXCkvKTtcbiAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICBjb25zdCByID0gcGFyc2VJbnQobWF0Y2hbMV0sIDEwKSAvIDI1NTtcbiAgICAgICAgY29uc3QgZyA9IHBhcnNlSW50KG1hdGNoWzJdLCAxMCkgLyAyNTU7XG4gICAgICAgIGNvbnN0IGIgPSBwYXJzZUludChtYXRjaFszXSwgMTApIC8gMjU1O1xuICAgICAgICByZXR1cm4geyByLCBnLCBiIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gZGVmYXVsdENvbG9yO1xuICAgIH1cbiAgICBcbiAgICAvLyBIYW5kbGUgbmFtZWQgY29sb3JzIChzaW1wbGlmaWVkKVxuICAgIGNvbnN0IG5hbWVkQ29sb3JzOiB7IFtuYW1lOiBzdHJpbmddOiB7IHI6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIgfSB9ID0ge1xuICAgICAgYmxhY2s6IHsgcjogMCwgZzogMCwgYjogMCB9LFxuICAgICAgd2hpdGU6IHsgcjogMSwgZzogMSwgYjogMSB9LFxuICAgICAgcmVkOiB7IHI6IDEsIGc6IDAsIGI6IDAgfSxcbiAgICAgIGdyZWVuOiB7IHI6IDAsIGc6IDEsIGI6IDAgfSxcbiAgICAgIGJsdWU6IHsgcjogMCwgZzogMCwgYjogMSB9LFxuICAgICAgZ3JheTogeyByOiAwLjUsIGc6IDAuNSwgYjogMC41IH0sXG4gICAgICB5ZWxsb3c6IHsgcjogMSwgZzogMSwgYjogMCB9LFxuICAgICAgcHVycGxlOiB7IHI6IDAuNSwgZzogMCwgYjogMC41IH0sXG4gICAgICBvcmFuZ2U6IHsgcjogMSwgZzogMC42NSwgYjogMCB9LFxuICAgIH07XG4gICAgXG4gICAgaWYgKG5hbWVkQ29sb3JzW2NvbG9yU3RyLnRvTG93ZXJDYXNlKCldKSB7XG4gICAgICByZXR1cm4gbmFtZWRDb2xvcnNbY29sb3JTdHIudG9Mb3dlckNhc2UoKV07XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBkZWZhdWx0Q29sb3I7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS53YXJuKCdFcnJvciBwYXJzaW5nIGNvbG9yOicsIGVycm9yKTtcbiAgICByZXR1cm4gZGVmYXVsdENvbG9yO1xuICB9XG59XG5cbi8qKlxuICogQ3JlYXRlcyBjb25uZWN0b3IgbGluZXMgYmV0d2VlbiBub2Rlc1xuICovXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVDb25uZWN0aW9ucyhcbiAgZmlnbWFOb2RlczogeyBbaWQ6IHN0cmluZ106IFNjZW5lTm9kZSB9LFxuICBlbGVtZW50czogYW55W11cbik6IFByb21pc2U8dm9pZD4ge1xuICAvLyBDcmVhdGUgYSBtYXAgZm9yIGVsZW1lbnRzXG4gIGNvbnN0IGVsZW1lbnRzTWFwOiB7IFtpZDogc3RyaW5nXTogYW55IH0gPSB7fTtcbiAgZWxlbWVudHMuZm9yRWFjaChlbCA9PiB7XG4gICAgZWxlbWVudHNNYXBbZWwuaWRdID0gZWw7XG4gIH0pO1xuICBcbiAgLy8gUHJvY2VzcyBlYWNoIGVsZW1lbnQncyBjb25uZWN0aW9uc1xuICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgZWxlbWVudHMpIHtcbiAgICBpZiAoIWVsZW1lbnQuY29ubmVjdGlvbnMgfHwgZWxlbWVudC5jb25uZWN0aW9ucy5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuICAgIFxuICAgIGZvciAoY29uc3QgY29ubmVjdGlvbiBvZiBlbGVtZW50LmNvbm5lY3Rpb25zKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBmcm9tTm9kZSA9IGZpZ21hTm9kZXNbY29ubmVjdGlvbi5mcm9tSWRdO1xuICAgICAgICBjb25zdCB0b05vZGUgPSBmaWdtYU5vZGVzW2Nvbm5lY3Rpb24udG9JZF07XG4gICAgICAgIFxuICAgICAgICBpZiAoIWZyb21Ob2RlIHx8ICF0b05vZGUpIGNvbnRpbnVlO1xuICAgICAgICBcbiAgICAgICAgLy8gQ3JlYXRlIGEgY29ubmVjdG9yXG4gICAgICAgIGNvbnN0IGNvbm5lY3RvciA9IGZpZ21hLmNyZWF0ZUNvbm5lY3RvcigpO1xuICAgICAgICBjb25uZWN0b3IubmFtZSA9IGBDb25uZWN0b3I6ICR7Y29ubmVjdGlvbi5mcm9tSWR9IOKGkiAke2Nvbm5lY3Rpb24udG9JZH1gO1xuICAgICAgICBcbiAgICAgICAgLy8gU2V0IGNvbm5lY3RvciBlbmRwb2ludHNcbiAgICAgICAgY29ubmVjdG9yLmNvbm5lY3RvclN0YXJ0ID0ge1xuICAgICAgICAgIGVuZHBvaW50Tm9kZUlkOiBmcm9tTm9kZS5pZCxcbiAgICAgICAgICBtYWduZXQ6ICdBVVRPJ1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgY29ubmVjdG9yLmNvbm5lY3RvckVuZCA9IHtcbiAgICAgICAgICBlbmRwb2ludE5vZGVJZDogdG9Ob2RlLmlkLFxuICAgICAgICAgIG1hZ25ldDogJ0FVVE8nXG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICAvLyBTZXQgc3Ryb2tlIHByb3BlcnRpZXNcbiAgICAgICAgY29ubmVjdG9yLnN0cm9rZXMgPSBbe1xuICAgICAgICAgIHR5cGU6ICdTT0xJRCcsXG4gICAgICAgICAgY29sb3I6IHsgcjogMCwgZzogMCwgYjogMCB9LFxuICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgfV07XG4gICAgICAgIFxuICAgICAgICBjb25uZWN0b3Iuc3Ryb2tlV2VpZ2h0ID0gMTtcbiAgICAgICAgXG4gICAgICAgIC8vIEFkdmFuY2VkOiBJZiB3ZSBoYXZlIHNwZWNpZmljIHBvaW50cyBmb3IgdGhlIGNvbm5lY3RvciBwYXRoXG4gICAgICAgIGlmIChjb25uZWN0aW9uLnBvaW50cyAmJiBjb25uZWN0aW9uLnBvaW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgLy8gVGhpcyBpcyBqdXN0IGEgcGxhY2Vob2xkZXIgLSBhY3R1YWwgbWFuaXB1bGF0aW9uIG9mIGNvbm5lY3RvciBwYXRoc1xuICAgICAgICAgIC8vIHdvdWxkIHJlcXVpcmUgbW9yZSBjb21wbGV4IGludGVyYWN0aW9ucyB3aXRoIHRoZSBGaWdtYSBBUElcbiAgICAgICAgICBjb25zb2xlLmxvZygnQ29ubmVjdGlvbiBoYXMgc3BlY2lmaWMgcG9pbnRzOicsIGNvbm5lY3Rpb24ucG9pbnRzKTtcbiAgICAgICAgICBcbiAgICAgICAgICAvLyBBcyBhIHNpbXBsZSBhcHByb3hpbWF0aW9uLCB3ZSBjb3VsZCBhZGQgcm91bmRlZCBjb3JuZXJzXG4gICAgICAgICAgLy8gTm90ZTogc3Ryb2tlQ2FwIHByb3BlcnR5IGlzIG5vdCBhdmFpbGFibGUgb24gQ29ubmVjdG9yTm9kZVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLndhcm4oYEVycm9yIGNyZWF0aW5nIGNvbm5lY3Rpb24gZnJvbSAke2Nvbm5lY3Rpb24uZnJvbUlkfSB0byAke2Nvbm5lY3Rpb24udG9JZH06YCwgZXJyb3IpO1xuICAgICAgICAvLyBDb250aW51ZSB3aXRoIG90aGVyIGNvbm5lY3Rpb25zXG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCJpbnRlcmZhY2UgU3ZnRWxlbWVudCB7XG4gIHR5cGU6IHN0cmluZztcbiAgaWQ6IHN0cmluZztcbiAgeDogbnVtYmVyO1xuICB5OiBudW1iZXI7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICBwYXRoRGF0YT86IHN0cmluZztcbiAgdGV4dD86IHN0cmluZztcbiAgZmlsbD86IHN0cmluZztcbiAgc3Ryb2tlPzogc3RyaW5nO1xuICBzdHJva2VXaWR0aD86IG51bWJlcjtcbiAgY29ubmVjdGlvbnM6IEFycmF5PHtcbiAgICBmcm9tSWQ6IHN0cmluZztcbiAgICB0b0lkOiBzdHJpbmc7XG4gICAgcG9pbnRzPzogbnVtYmVyW11bXTtcbiAgfT47XG4gIGNoaWxkcmVuPzogU3ZnRWxlbWVudFtdO1xufVxuXG5pbnRlcmZhY2UgUGFyc2VkU3ZnIHtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIHZpZXdCb3g6IHtcbiAgICBtaW5YOiBudW1iZXI7XG4gICAgbWluWTogbnVtYmVyO1xuICAgIHdpZHRoOiBudW1iZXI7XG4gICAgaGVpZ2h0OiBudW1iZXI7XG4gIH07XG4gIGVsZW1lbnRzOiBTdmdFbGVtZW50W107XG59XG5cbi8qKlxuICogR2VuZXJhdGVzIGEgcmFuZG9tIElEIGZvciBlbGVtZW50cyB3aXRob3V0IElEc1xuICovXG5mdW5jdGlvbiBnZW5lcmF0ZUlkKCk6IHN0cmluZyB7XG4gIHJldHVybiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMiwgMTApO1xufVxuXG4vKipcbiAqIEZpbmRzIGEgbm9kZSBhdCB0aGUgZ2l2ZW4gY29vcmRpbmF0ZXNcbiAqL1xuZnVuY3Rpb24gZmluZE5vZGVBdFBvaW50KFxuICBlbGVtZW50czogU3ZnRWxlbWVudFtdLCBcbiAgeDogbnVtYmVyLCBcbiAgeTogbnVtYmVyLCBcbiAgZXhjbHVkZUlkOiBzdHJpbmdcbik6IFN2Z0VsZW1lbnQgfCBudWxsIHtcbiAgY29uc3QgdG9sZXJhbmNlID0gNTsgIC8vIEFsbG93IHNvbWUgbWFyZ2luIGZvciBjb25uZWN0aW9uIHBvaW50c1xuICBcbiAgZm9yIChjb25zdCBlbGVtZW50IG9mIGVsZW1lbnRzKSB7XG4gICAgLy8gU2tpcCBsaW5lcyBhbmQgdGhlIGVsZW1lbnQgaXRzZWxmXG4gICAgaWYgKGVsZW1lbnQuaWQgPT09IGV4Y2x1ZGVJZCB8fCBlbGVtZW50LnR5cGUgPT09ICdsaW5lJykge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIFxuICAgIGlmIChlbGVtZW50LnR5cGUgPT09ICdjaXJjbGUnKSB7XG4gICAgICAvLyBGb3IgY2lyY2xlcywgY2hlY2sgaWYgcG9pbnQgaXMgd2l0aGluIHJhZGl1c1xuICAgICAgY29uc3QgY2VudGVyWCA9IGVsZW1lbnQueCArIGVsZW1lbnQud2lkdGggLyAyO1xuICAgICAgY29uc3QgY2VudGVyWSA9IGVsZW1lbnQueSArIGVsZW1lbnQuaGVpZ2h0IC8gMjtcbiAgICAgIGNvbnN0IHJhZGl1cyA9IGVsZW1lbnQud2lkdGggLyAyO1xuICAgICAgXG4gICAgICBjb25zdCBkaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyh4IC0gY2VudGVyWCwgMikgKyBNYXRoLnBvdyh5IC0gY2VudGVyWSwgMikpO1xuICAgICAgaWYgKGRpc3RhbmNlIDw9IHJhZGl1cyArIHRvbGVyYW5jZSkge1xuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRm9yIHJlY3RhbmdsZXMgYW5kIG90aGVyIGVsZW1lbnRzLCBjaGVjayBpZiBwb2ludCBpcyB3aXRoaW4gYm91bmRzXG4gICAgICBpZiAoXG4gICAgICAgIHggPj0gZWxlbWVudC54IC0gdG9sZXJhbmNlICYmXG4gICAgICAgIHggPD0gZWxlbWVudC54ICsgZWxlbWVudC53aWR0aCArIHRvbGVyYW5jZSAmJlxuICAgICAgICB5ID49IGVsZW1lbnQueSAtIHRvbGVyYW5jZSAmJlxuICAgICAgICB5IDw9IGVsZW1lbnQueSArIGVsZW1lbnQuaGVpZ2h0ICsgdG9sZXJhbmNlXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiBQYXJzZXMgYW4gU1ZHIHN0cmluZyBhbmQgZXh0cmFjdHMgZmxvd2NoYXJ0IGVsZW1lbnRzIGFuZCB0aGVpciByZWxhdGlvbnNoaXBzXG4gKiBAcGFyYW0gc3ZnQ29udGVudCBUaGUgU1ZHIGZpbGUgY29udGVudCBhcyBhIHN0cmluZ1xuICogQHJldHVybnMgQSBwYXJzZWQgcmVwcmVzZW50YXRpb24gb2YgdGhlIFNWR1xuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VTdmcoc3ZnQ29udGVudDogc3RyaW5nKTogUGFyc2VkU3ZnIHtcbiAgdHJ5IHtcbiAgICAvLyBGb3IgRmlnbWEgcGx1Z2luIGVudmlyb25tZW50LCB3ZSdsbCB1c2UgYSBzaW1wbGlmaWVkIHBhcnNpbmcgYXBwcm9hY2hcbiAgICBcbiAgICAvLyBCYXNpYyBjaGVjayBmb3IgU1ZHIGZvcm1hdFxuICAgIGlmICghc3ZnQ29udGVudC5pbmNsdWRlcygnPHN2ZycpIHx8ICFzdmdDb250ZW50LmluY2x1ZGVzKCc8L3N2Zz4nKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIFNWRyBmaWxlOiBNaXNzaW5nIFNWRyB0YWdzJyk7XG4gICAgfVxuICAgIFxuICAgIC8vIEV4dHJhY3Qgcm9vdCBTVkcgZWxlbWVudCBwcm9wZXJ0aWVzIHVzaW5nIHJlZ2V4XG4gICAgY29uc3Qgd2lkdGhNYXRjaCA9IHN2Z0NvbnRlbnQubWF0Y2goL3dpZHRoPVtcIiddKFteXCInXSopW1wiJ10vKTtcbiAgICBjb25zdCBoZWlnaHRNYXRjaCA9IHN2Z0NvbnRlbnQubWF0Y2goL2hlaWdodD1bXCInXShbXlwiJ10qKVtcIiddLyk7XG4gICAgY29uc3Qgdmlld0JveE1hdGNoID0gc3ZnQ29udGVudC5tYXRjaCgvdmlld0JveD1bXCInXShbXlwiJ10qKVtcIiddLyk7XG4gICAgXG4gICAgY29uc3Qgc3ZnV2lkdGggPSB3aWR0aE1hdGNoID8gcGFyc2VGbG9hdCh3aWR0aE1hdGNoWzFdKSA6IDA7XG4gICAgY29uc3Qgc3ZnSGVpZ2h0ID0gaGVpZ2h0TWF0Y2ggPyBwYXJzZUZsb2F0KGhlaWdodE1hdGNoWzFdKSA6IDA7XG4gICAgXG4gICAgLy8gUGFyc2Ugdmlld0JveFxuICAgIGxldCB2aWV3Qm94ID0ge1xuICAgICAgbWluWDogMCxcbiAgICAgIG1pblk6IDAsXG4gICAgICB3aWR0aDogc3ZnV2lkdGggfHwgODAwLFxuICAgICAgaGVpZ2h0OiBzdmdIZWlnaHQgfHwgNjAwXG4gICAgfTtcbiAgICBcbiAgICBpZiAodmlld0JveE1hdGNoKSB7XG4gICAgICBjb25zdCB2aWV3Qm94VmFsdWVzID0gdmlld0JveE1hdGNoWzFdLnNwbGl0KC9cXHMrLykubWFwKHBhcnNlRmxvYXQpO1xuICAgICAgaWYgKHZpZXdCb3hWYWx1ZXMubGVuZ3RoID49IDQpIHtcbiAgICAgICAgdmlld0JveCA9IHtcbiAgICAgICAgICBtaW5YOiB2aWV3Qm94VmFsdWVzWzBdIHx8IDAsXG4gICAgICAgICAgbWluWTogdmlld0JveFZhbHVlc1sxXSB8fCAwLFxuICAgICAgICAgIHdpZHRoOiB2aWV3Qm94VmFsdWVzWzJdIHx8IHN2Z1dpZHRoIHx8IDgwMCxcbiAgICAgICAgICBoZWlnaHQ6IHZpZXdCb3hWYWx1ZXNbM10gfHwgc3ZnSGVpZ2h0IHx8IDYwMFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBDcmVhdGUgYSBzaW1wbGlmaWVkIHBhcnNpbmcgYXBwcm9hY2ggdG8gZXh0cmFjdCBlbGVtZW50c1xuICAgIGNvbnN0IGVsZW1lbnRzOiBTdmdFbGVtZW50W10gPSBbXTtcbiAgICBcbiAgICAvLyBFeHRyYWN0IHJlY3RhbmdsZXMgd2l0aCByZWdleFxuICAgIGNvbnN0IHJlY3RSZWdleCA9IC88cmVjdFtePl0qP3g9W1wiJ10oW15cIiddKilbXCInXVtePl0qP3k9W1wiJ10oW15cIiddKilbXCInXVtePl0qP3dpZHRoPVtcIiddKFteXCInXSopW1wiJ11bXj5dKj9oZWlnaHQ9W1wiJ10oW15cIiddKilbXCInXVtePl0qPyg/OlxcLz58PjxcXC9yZWN0PikvZztcbiAgICBsZXQgcmVjdE1hdGNoO1xuICAgIHdoaWxlICgocmVjdE1hdGNoID0gcmVjdFJlZ2V4LmV4ZWMoc3ZnQ29udGVudCkpICE9PSBudWxsKSB7XG4gICAgICBlbGVtZW50cy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ3JlY3QnLFxuICAgICAgICBpZDogYHJlY3QtJHtnZW5lcmF0ZUlkKCl9YCxcbiAgICAgICAgeDogcGFyc2VGbG9hdChyZWN0TWF0Y2hbMV0pLFxuICAgICAgICB5OiBwYXJzZUZsb2F0KHJlY3RNYXRjaFsyXSksXG4gICAgICAgIHdpZHRoOiBwYXJzZUZsb2F0KHJlY3RNYXRjaFszXSksXG4gICAgICAgIGhlaWdodDogcGFyc2VGbG9hdChyZWN0TWF0Y2hbNF0pLFxuICAgICAgICBmaWxsOiAnd2hpdGUnLFxuICAgICAgICBzdHJva2U6ICdibGFjaycsXG4gICAgICAgIHN0cm9rZVdpZHRoOiAxLFxuICAgICAgICBjb25uZWN0aW9uczogW11cbiAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICAvLyBFeHRyYWN0IGNpcmNsZXMgd2l0aCByZWdleFxuICAgIGNvbnN0IGNpcmNsZVJlZ2V4ID0gLzxjaXJjbGVbXj5dKj9jeD1bXCInXShbXlwiJ10qKVtcIiddW14+XSo/Y3k9W1wiJ10oW15cIiddKilbXCInXVtePl0qP3I9W1wiJ10oW15cIiddKilbXCInXVtePl0qPyg/OlxcLz58PjxcXC9jaXJjbGU+KS9nO1xuICAgIGxldCBjaXJjbGVNYXRjaDtcbiAgICB3aGlsZSAoKGNpcmNsZU1hdGNoID0gY2lyY2xlUmVnZXguZXhlYyhzdmdDb250ZW50KSkgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IGN4ID0gcGFyc2VGbG9hdChjaXJjbGVNYXRjaFsxXSk7XG4gICAgICBjb25zdCBjeSA9IHBhcnNlRmxvYXQoY2lyY2xlTWF0Y2hbMl0pO1xuICAgICAgY29uc3QgciA9IHBhcnNlRmxvYXQoY2lyY2xlTWF0Y2hbM10pO1xuICAgICAgXG4gICAgICBlbGVtZW50cy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2NpcmNsZScsXG4gICAgICAgIGlkOiBgY2lyY2xlLSR7Z2VuZXJhdGVJZCgpfWAsXG4gICAgICAgIHg6IGN4IC0gcixcbiAgICAgICAgeTogY3kgLSByLFxuICAgICAgICB3aWR0aDogciAqIDIsXG4gICAgICAgIGhlaWdodDogciAqIDIsXG4gICAgICAgIGZpbGw6ICd3aGl0ZScsXG4gICAgICAgIHN0cm9rZTogJ2JsYWNrJyxcbiAgICAgICAgc3Ryb2tlV2lkdGg6IDEsXG4gICAgICAgIGNvbm5lY3Rpb25zOiBbXVxuICAgICAgfSk7XG4gICAgfVxuICAgIFxuICAgIC8vIEV4dHJhY3QgbGluZXMgKHNpbXBsaWZpZWQgZm9yIGNvbm5lY3RvcnMpXG4gICAgY29uc3QgbGluZVJlZ2V4ID0gLzxsaW5lW14+XSo/eDE9W1wiJ10oW15cIiddKilbXCInXVtePl0qP3kxPVtcIiddKFteXCInXSopW1wiJ11bXj5dKj94Mj1bXCInXShbXlwiJ10qKVtcIiddW14+XSo/eTI9W1wiJ10oW15cIiddKilbXCInXVtePl0qPyg/OlxcLz58PjxcXC9saW5lPikvZztcbiAgICBsZXQgbGluZU1hdGNoO1xuICAgIHdoaWxlICgobGluZU1hdGNoID0gbGluZVJlZ2V4LmV4ZWMoc3ZnQ29udGVudCkpICE9PSBudWxsKSB7XG4gICAgICBjb25zdCB4MSA9IHBhcnNlRmxvYXQobGluZU1hdGNoWzFdKTtcbiAgICAgIGNvbnN0IHkxID0gcGFyc2VGbG9hdChsaW5lTWF0Y2hbMl0pO1xuICAgICAgY29uc3QgeDIgPSBwYXJzZUZsb2F0KGxpbmVNYXRjaFszXSk7XG4gICAgICBjb25zdCB5MiA9IHBhcnNlRmxvYXQobGluZU1hdGNoWzRdKTtcbiAgICAgIFxuICAgICAgZWxlbWVudHMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdsaW5lJyxcbiAgICAgICAgaWQ6IGBsaW5lLSR7Z2VuZXJhdGVJZCgpfWAsXG4gICAgICAgIHg6IE1hdGgubWluKHgxLCB4MiksXG4gICAgICAgIHk6IE1hdGgubWluKHkxLCB5MiksXG4gICAgICAgIHdpZHRoOiBNYXRoLmFicyh4MiAtIHgxKSxcbiAgICAgICAgaGVpZ2h0OiBNYXRoLmFicyh5MiAtIHkxKSxcbiAgICAgICAgcGF0aERhdGE6IGBNJHt4MX0sJHt5MX0gTCR7eDJ9LCR7eTJ9YCxcbiAgICAgICAgZmlsbDogJ25vbmUnLFxuICAgICAgICBzdHJva2U6ICdibGFjaycsXG4gICAgICAgIHN0cm9rZVdpZHRoOiAxLFxuICAgICAgICBjb25uZWN0aW9uczogW11cbiAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICAvLyBFeHRyYWN0IHRleHQgZWxlbWVudHNcbiAgICBjb25zdCB0ZXh0UmVnZXggPSAvPHRleHRbXj5dKj94PVtcIiddKFteXCInXSopW1wiJ11bXj5dKj95PVtcIiddKFteXCInXSopW1wiJ11bXj5dKj8+KFtePF0qKTxcXC90ZXh0Pi9nO1xuICAgIGxldCB0ZXh0TWF0Y2g7XG4gICAgd2hpbGUgKCh0ZXh0TWF0Y2ggPSB0ZXh0UmVnZXguZXhlYyhzdmdDb250ZW50KSkgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IHggPSBwYXJzZUZsb2F0KHRleHRNYXRjaFsxXSk7XG4gICAgICBjb25zdCB5ID0gcGFyc2VGbG9hdCh0ZXh0TWF0Y2hbMl0pO1xuICAgICAgY29uc3QgdGV4dENvbnRlbnQgPSB0ZXh0TWF0Y2hbM10udHJpbSgpO1xuICAgICAgY29uc3Qgd2lkdGggPSB0ZXh0Q29udGVudC5sZW5ndGggKiA4OyAgLy8gUm91Z2ggZXN0aW1hdGVcbiAgICAgIGNvbnN0IGhlaWdodCA9IDE2OyAgLy8gVHlwaWNhbCB0ZXh0IGhlaWdodFxuICAgICAgXG4gICAgICBlbGVtZW50cy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICBpZDogYHRleHQtJHtnZW5lcmF0ZUlkKCl9YCxcbiAgICAgICAgeCxcbiAgICAgICAgeTogeSAtIGhlaWdodCwgIC8vIEFkanVzdCB5IHBvc2l0aW9uXG4gICAgICAgIHdpZHRoLFxuICAgICAgICBoZWlnaHQsXG4gICAgICAgIHRleHQ6IHRleHRDb250ZW50LFxuICAgICAgICBmaWxsOiAnYmxhY2snLFxuICAgICAgICBzdHJva2U6ICdub25lJyxcbiAgICAgICAgc3Ryb2tlV2lkdGg6IDAsXG4gICAgICAgIGNvbm5lY3Rpb25zOiBbXVxuICAgICAgfSk7XG4gICAgfVxuICAgIFxuICAgIC8vIERldGVybWluZSBjb25uZWN0aW9ucyBiZXR3ZWVuIGVsZW1lbnRzXG4gICAgZm9yIChjb25zdCBlbGVtZW50IG9mIGVsZW1lbnRzKSB7XG4gICAgICBpZiAoZWxlbWVudC50eXBlID09PSAnbGluZScpIHtcbiAgICAgICAgY29uc3QgbGluZU1hdGNoID0gZWxlbWVudC5wYXRoRGF0YT8ubWF0Y2goL00oW1xcZC4tXSspLChbXFxkLi1dKylcXHMrTChbXFxkLi1dKyksKFtcXGQuLV0rKS8pO1xuICAgICAgICBpZiAobGluZU1hdGNoKSB7XG4gICAgICAgICAgY29uc3Qgc3RhcnRYID0gcGFyc2VGbG9hdChsaW5lTWF0Y2hbMV0pO1xuICAgICAgICAgIGNvbnN0IHN0YXJ0WSA9IHBhcnNlRmxvYXQobGluZU1hdGNoWzJdKTtcbiAgICAgICAgICBjb25zdCBlbmRYID0gcGFyc2VGbG9hdChsaW5lTWF0Y2hbM10pO1xuICAgICAgICAgIGNvbnN0IGVuZFkgPSBwYXJzZUZsb2F0KGxpbmVNYXRjaFs0XSk7XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gRmluZCBub2RlcyB0aGF0IG1pZ2h0IGJlIGNvbm5lY3RlZCBieSB0aGlzIGxpbmVcbiAgICAgICAgICBjb25zdCBzdGFydE5vZGUgPSBmaW5kTm9kZUF0UG9pbnQoZWxlbWVudHMsIHN0YXJ0WCwgc3RhcnRZLCBlbGVtZW50LmlkKTtcbiAgICAgICAgICBjb25zdCBlbmROb2RlID0gZmluZE5vZGVBdFBvaW50KGVsZW1lbnRzLCBlbmRYLCBlbmRZLCBlbGVtZW50LmlkKTtcbiAgICAgICAgICBcbiAgICAgICAgICBpZiAoc3RhcnROb2RlICYmIGVuZE5vZGUpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuY29ubmVjdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgIGZyb21JZDogc3RhcnROb2RlLmlkLFxuICAgICAgICAgICAgICB0b0lkOiBlbmROb2RlLmlkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gQWxzbyBhZGQgY29ubmVjdGlvbiB0byB0aGUgc291cmNlIG5vZGVcbiAgICAgICAgICAgIHN0YXJ0Tm9kZS5jb25uZWN0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgZnJvbUlkOiBzdGFydE5vZGUuaWQsXG4gICAgICAgICAgICAgIHRvSWQ6IGVuZE5vZGUuaWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgd2lkdGg6IHN2Z1dpZHRoIHx8IHZpZXdCb3gud2lkdGgsXG4gICAgICBoZWlnaHQ6IHN2Z0hlaWdodCB8fCB2aWV3Qm94LmhlaWdodCxcbiAgICAgIHZpZXdCb3gsXG4gICAgICBlbGVtZW50c1xuICAgIH07XG4gIH0gY2F0Y2ggKGVycm9yOiB1bmtub3duKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgcGFyc2luZyBTVkc6JywgZXJyb3IpO1xuICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEVycm9yIHBhcnNpbmcgU1ZHOiAke2Vycm9yLm1lc3NhZ2V9YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgcGFyc2luZyBTVkc6IFVua25vd24gZXJyb3InKTtcbiAgICB9XG4gIH1cbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IHN2Z1RvRmlnbWFGbG93Y2hhcnQgfSBmcm9tICcuL3NyYy9maWdtYUNvbnZlcnRlcic7XG5pbXBvcnQgeyBwYXJzZVN2ZyB9IGZyb20gJy4vc3JjL3N2Z1BhcnNlcic7XG5pbXBvcnQgeyBoYW5kbGVFcnJvciB9IGZyb20gJy4vc3JjL2Vycm9ySGFuZGxlcic7XG5cbmZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB3aWR0aDogNDAwLCBoZWlnaHQ6IDUwMCB9KTtcblxuZmlnbWEudWkub25tZXNzYWdlID0gYXN5bmMgKG1zZykgPT4ge1xuICBpZiAobXNnLnR5cGUgPT09ICdjb252ZXJ0LXN2ZycpIHtcbiAgICB0cnkge1xuICAgICAgLy8gUGFyc2UgdGhlIFNWRyBjb250ZW50XG4gICAgICBjb25zdCBwYXJzZWRTdmcgPSBwYXJzZVN2Zyhtc2cuc3ZnQ29udGVudCk7XG4gICAgICBcbiAgICAgIC8vIENyZWF0ZSBhIG5ldyBwYWdlIGZvciB0aGUgZmxvd2NoYXJ0XG4gICAgICBjb25zdCBwYWdlID0gZmlnbWEuY3JlYXRlUGFnZSgpO1xuICAgICAgcGFnZS5uYW1lID0gYEZsb3djaGFydDogJHttc2cuZmlsZU5hbWUucmVwbGFjZSgvXFwuc3ZnJC8sICcnKX1gO1xuICAgICAgZmlnbWEuY3VycmVudFBhZ2UgPSBwYWdlO1xuXG4gICAgICAvLyBDb252ZXJ0IFNWRyB0byBGaWdtYSBmbG93Y2hhcnRcbiAgICAgIGF3YWl0IHN2Z1RvRmlnbWFGbG93Y2hhcnQocGFyc2VkU3ZnKTtcbiAgICAgIFxuICAgICAgLy8gTm90aWZ5IFVJIHRoYXQgY29udmVyc2lvbiBpcyBjb21wbGV0ZVxuICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xuICAgICAgICB0eXBlOiAnY29udmVyc2lvbi1jb21wbGV0ZSdcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBmaWdtYS5ub3RpZnkoJ1NWRyBzdWNjZXNzZnVsbHkgY29udmVydGVkIHRvIGZsb3djaGFydCEnKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICBcbiAgICAgIC8vIEhhbmRsZSB0aGUgZXJyb3IgYW5kIG5vdGlmeSBVSVxuICAgICAgY29uc3QgZXJyb3JNc2cgPSBoYW5kbGVFcnJvcihlcnJvcik7XG4gICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yTXNnXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgZmlnbWEubm90aWZ5KCdFcnJvciBjb252ZXJ0aW5nIFNWRyB0byBmbG93Y2hhcnQnLCB7IGVycm9yOiB0cnVlIH0pO1xuICAgIH1cbiAgfVxufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
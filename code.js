/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/errorHandler.ts":
/*!*****************************!*\
  !*** ./src/errorHandler.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

"use strict";
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
/***/ (() => {

throw new Error("Module parse failed: Identifier 'findNodeAtPoint' has already been declared (254:9)\nFile was processed with these loaders:\n * ./node_modules/ts-loader/index.js\nYou may need an additional loader to handle the result of these loaders.\n|  * Finds a node at the given coordinates\n|  */\n> function findNodeAtPoint(elements, x, y, excludeId) {\n|     const tolerance = 5; // Allow some margin for connection points\n|     for (const element of elements) {");

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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!*****************!*\
  !*** ./code.ts ***!
  \*****************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_figmaConverter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/figmaConverter */ "./src/figmaConverter.ts");
/* harmony import */ var _src_svgParser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/svgParser */ "./src/svgParser.ts");
/* harmony import */ var _src_svgParser__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_src_svgParser__WEBPACK_IMPORTED_MODULE_1__);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SyxDQUFDLENBQUM7WUFDcEMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUM7Z0JBQ25CLElBQUksRUFBRSxPQUFPO2dCQUNiLE9BQU8sRUFBRSxRQUFRO2FBQ2xCLENBQUMsQ0FBQztZQUVILEtBQUssQ0FBQyxNQUFNLENBQUMsbUNBQW1DLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNyRSxDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUMsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3dvcmtzcGFjZS8uL3NyYy9lcnJvckhhbmRsZXIudHMiLCJ3ZWJwYWNrOi8vd29ya3NwYWNlLy4vc3JjL2ZpZ21hQ29udmVydGVyLnRzIiwid2VicGFjazovL3dvcmtzcGFjZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly93b3Jrc3BhY2Uvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vd29ya3NwYWNlL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93b3Jrc3BhY2Uvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly93b3Jrc3BhY2Uvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93b3Jrc3BhY2UvLi9jb2RlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogSGFuZGxlcyBlcnJvcnMgYW5kIHJldHVybnMgYXBwcm9wcmlhdGUgZXJyb3IgbWVzc2FnZXNcbiAqIEBwYXJhbSBlcnJvciBUaGUgZXJyb3IgdG8gaGFuZGxlXG4gKiBAcmV0dXJucyBBIHVzZXItZnJpZW5kbHkgZXJyb3IgbWVzc2FnZVxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlRXJyb3IoZXJyb3I6IGFueSk6IHN0cmluZyB7XG4gIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIG9jY3VycmVkOicsIGVycm9yKTtcbiAgXG4gIC8vIENoZWNrIGVycm9yIHR5cGVcbiAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgIFxuICAgIC8vIEhhbmRsZSBzcGVjaWZpYyBlcnJvciB0eXBlc1xuICAgIGlmIChlcnJvck1lc3NhZ2UuaW5jbHVkZXMoJ0ludmFsaWQgU1ZHJykpIHtcbiAgICAgIHJldHVybiAnVGhlIFNWRyBmaWxlIGlzIGludmFsaWQgb3IgY29ycnVwdGVkLiBQbGVhc2UgY2hlY2sgdGhlIGZpbGUgYW5kIHRyeSBhZ2Fpbi4nO1xuICAgIH1cbiAgICBcbiAgICBpZiAoZXJyb3JNZXNzYWdlLmluY2x1ZGVzKCdNaXNzaW5nIHJvb3QgU1ZHIGVsZW1lbnQnKSkge1xuICAgICAgcmV0dXJuICdUaGUgZmlsZSBkb2VzIG5vdCBhcHBlYXIgdG8gYmUgYSB2YWxpZCBTVkcuIFBsZWFzZSBjaGVjayB0aGUgZmlsZSBmb3JtYXQuJztcbiAgICB9XG4gICAgXG4gICAgaWYgKGVycm9yTWVzc2FnZS5pbmNsdWRlcygncGVybWlzc2lvbicpKSB7XG4gICAgICByZXR1cm4gJ1RoZSBwbHVnaW4gZG9lcyBub3QgaGF2ZSBwZXJtaXNzaW9uIHRvIHBlcmZvcm0gdGhpcyBhY3Rpb24uIFBsZWFzZSB0cnkgYWdhaW4uJztcbiAgICB9XG4gICAgXG4gICAgaWYgKGVycm9yTWVzc2FnZS5pbmNsdWRlcygnRm9udCcpKSB7XG4gICAgICByZXR1cm4gJ1RoZXJlIHdhcyBhbiBpc3N1ZSB3aXRoIGxvYWRpbmcgZm9udHMuIFBsZWFzZSB0cnkgYWdhaW4uJztcbiAgICB9XG4gICAgXG4gICAgLy8gUmV0dXJuIHRoZSBvcmlnaW5hbCBlcnJvciBtZXNzYWdlIGlmIGl0J3Mgc3BlY2lmaWNcbiAgICByZXR1cm4gYEVycm9yOiAke2Vycm9yTWVzc2FnZX1gO1xuICB9XG4gIFxuICAvLyBGb3IgU1ZHIHBhcnNpbmcgZXJyb3JzXG4gIGlmICh0eXBlb2YgZXJyb3IgPT09ICdvYmplY3QnICYmIGVycm9yICE9PSBudWxsKSB7XG4gICAgaWYgKCdtZXNzYWdlJyBpbiBlcnJvcikge1xuICAgICAgaWYgKHR5cGVvZiBlcnJvci5tZXNzYWdlID09PSAnc3RyaW5nJyAmJiBlcnJvci5tZXNzYWdlLmluY2x1ZGVzKCdTVkcnKSkge1xuICAgICAgICByZXR1cm4gYFNWRyBwYXJzaW5nIGVycm9yOiAke2Vycm9yLm1lc3NhZ2V9YDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIGBFcnJvcjogJHtlcnJvci5tZXNzYWdlfWA7XG4gICAgfVxuICB9XG4gIFxuICAvLyBHZW5lcmljIGVycm9yIG1lc3NhZ2VcbiAgcmV0dXJuICdBbiB1bmV4cGVjdGVkIGVycm9yIG9jY3VycmVkLiBQbGVhc2UgdHJ5IGFnYWluIG9yIHRyeSB3aXRoIGEgZGlmZmVyZW50IFNWRyBmaWxlLic7XG59XG5cbi8qKlxuICogTG9nIGVycm9yIHdpdGggZGV0YWlscyB0byB0aGUgY29uc29sZSBmb3IgZGVidWdnaW5nXG4gKiBAcGFyYW0gY29udGV4dCBUaGUgY29udGV4dCB3aGVyZSB0aGUgZXJyb3Igb2NjdXJyZWRcbiAqIEBwYXJhbSBlcnJvciBUaGUgZXJyb3Igb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsb2dFcnJvcihjb250ZXh0OiBzdHJpbmcsIGVycm9yOiBhbnkpOiB2b2lkIHtcbiAgY29uc29sZS5lcnJvcihgRXJyb3IgaW4gJHtjb250ZXh0fTpgLCBlcnJvcik7XG4gIFxuICAvLyBBZGRpdGlvbmFsIGxvZ2dpbmcgZm9yIGRlYnVnZ2luZ1xuICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ1N0YWNrIHRyYWNlOicsIGVycm9yLnN0YWNrKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgaGFuZGxlRXJyb3IgfSBmcm9tICcuL2Vycm9ySGFuZGxlcic7XG5cbi8qKlxuICogQ29udmVydHMgYSBwYXJzZWQgU1ZHIHN0cnVjdHVyZSB0byBhIEZpZ21hIGZsb3djaGFydFxuICogQHBhcmFtIHBhcnNlZFN2ZyBUaGUgcGFyc2VkIFNWRyBkYXRhXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzdmdUb0ZpZ21hRmxvd2NoYXJ0KHBhcnNlZFN2ZzogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gIHRyeSB7XG4gICAgLy8gTG9hZCBmb250cyBmaXJzdCB0byBlbnN1cmUgdGV4dCBlbGVtZW50cyByZW5kZXIgcHJvcGVybHlcbiAgICBhd2FpdCBmaWdtYS5sb2FkRm9udEFzeW5jKHsgZmFtaWx5OiBcIkludGVyXCIsIHN0eWxlOiBcIlJlZ3VsYXJcIiB9KTtcbiAgICBhd2FpdCBmaWdtYS5sb2FkRm9udEFzeW5jKHsgZmFtaWx5OiBcIkludGVyXCIsIHN0eWxlOiBcIk1lZGl1bVwiIH0pO1xuICAgIFxuICAgIC8vIENhbGN1bGF0ZSBzY2FsZSBmYWN0b3JzXG4gICAgY29uc3Qgc2NhbGUgPSBjYWxjdWxhdGVTY2FsZShwYXJzZWRTdmcudmlld0JveCk7XG4gICAgXG4gICAgLy8gQ3JlYXRlIG5vZGVzXG4gICAgY29uc3QgZmlnbWFOb2RlcyA9IGF3YWl0IGNyZWF0ZUZpZ21hTm9kZXMocGFyc2VkU3ZnLmVsZW1lbnRzLCBzY2FsZSk7XG4gICAgXG4gICAgLy8gQ3JlYXRlIGNvbm5lY3Rpb25zIGJldHdlZW4gbm9kZXNcbiAgICBhd2FpdCBjcmVhdGVDb25uZWN0aW9ucyhmaWdtYU5vZGVzLCBwYXJzZWRTdmcuZWxlbWVudHMpO1xuICAgIFxuICAgIC8vIFNlbGVjdCBhbGwgY3JlYXRlZCBub2Rlc1xuICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiA9IE9iamVjdC52YWx1ZXMoZmlnbWFOb2Rlcyk7XG4gICAgXG4gICAgLy8gWm9vbSB0byBmaXQgdGhlIGNyZWF0ZWQgbm9kZXNcbiAgICBmaWdtYS52aWV3cG9ydC5zY3JvbGxBbmRab29tSW50b1ZpZXcoT2JqZWN0LnZhbHVlcyhmaWdtYU5vZGVzKSk7XG4gICAgXG4gIH0gY2F0Y2ggKGVycm9yOiB1bmtub3duKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgY29udmVydGluZyB0byBGaWdtYSBmbG93Y2hhcnQ6JywgZXJyb3IpO1xuICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEVycm9yIGNvbnZlcnRpbmcgdG8gRmlnbWEgZmxvd2NoYXJ0OiAke2Vycm9yLm1lc3NhZ2V9YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgY29udmVydGluZyB0byBGaWdtYSBmbG93Y2hhcnQ6IFVua25vd24gZXJyb3InKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBDYWxjdWxhdGVzIHNjYWxlIGZhY3RvcnMgZm9yIGNvbnZlcnRpbmcgZnJvbSBTVkcgY29vcmRpbmF0ZXMgdG8gRmlnbWFcbiAqL1xuZnVuY3Rpb24gY2FsY3VsYXRlU2NhbGUodmlld0JveDogYW55KTogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9IHtcbiAgLy8gRm9yIHNpbXBsaWNpdHksIHdlJ2xsIHVzZSBhIDE6MSBtYXBwaW5nLCBidXQgdGhpcyBjb3VsZCBiZSBhZGp1c3RlZFxuICAvLyBpZiB3ZSBuZWVkIHRvIHNjYWxlIHRoZSBmbG93Y2hhcnQgZGlmZmVyZW50bHlcbiAgcmV0dXJuIHsgeDogMSwgeTogMSB9O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgRmlnbWEgbm9kZXMgZnJvbSBTVkcgZWxlbWVudHNcbiAqL1xuYXN5bmMgZnVuY3Rpb24gY3JlYXRlRmlnbWFOb2RlcyhcbiAgZWxlbWVudHM6IGFueVtdLCBcbiAgc2NhbGU6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfVxuKTogUHJvbWlzZTx7IFtpZDogc3RyaW5nXTogU2NlbmVOb2RlIH0+IHtcbiAgY29uc3QgZmlnbWFOb2RlczogeyBbaWQ6IHN0cmluZ106IFNjZW5lTm9kZSB9ID0ge307XG4gIFxuICAvLyBQcm9jZXNzIGVsZW1lbnRzXG4gIGZvciAoY29uc3QgZWxlbWVudCBvZiBlbGVtZW50cykge1xuICAgIC8vIFNraXAgZWxlbWVudHMgdGhhdCBhcmUgbGlrZWx5IHRvIGJlIGNvbm5lY3RvcnNcbiAgICBpZiAoaXNDb25uZWN0b3IoZWxlbWVudCkpIGNvbnRpbnVlO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBub2RlID0gYXdhaXQgY3JlYXRlRmlnbWFOb2RlKGVsZW1lbnQsIHNjYWxlKTtcbiAgICAgIGlmIChub2RlKSB7XG4gICAgICAgIGZpZ21hTm9kZXNbZWxlbWVudC5pZF0gPSBub2RlO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLndhcm4oYEVycm9yIGNyZWF0aW5nIG5vZGUgZm9yIGVsZW1lbnQgJHtlbGVtZW50LmlkfTpgLCBlcnJvcik7XG4gICAgICAvLyBDb250aW51ZSB3aXRoIG90aGVyIGVsZW1lbnRzXG4gICAgfVxuICB9XG4gIFxuICByZXR1cm4gZmlnbWFOb2Rlcztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYW4gZWxlbWVudCBpcyBsaWtlbHkgdG8gYmUgYSBjb25uZWN0b3IgcmF0aGVyIHRoYW4gYSBub2RlXG4gKi9cbmZ1bmN0aW9uIGlzQ29ubmVjdG9yKGVsZW1lbnQ6IGFueSk6IGJvb2xlYW4ge1xuICAvLyBMaW5lcyBhcmUgYWxtb3N0IGFsd2F5cyBjb25uZWN0b3JzXG4gIGlmIChlbGVtZW50LnR5cGUgPT09ICdsaW5lJykgcmV0dXJuIHRydWU7XG4gIFxuICAvLyBQYXRocyBhbmQgcG9seWxpbmVzIHdpdGggXCJub25lXCIgZmlsbCBhcmUgbGlrZWx5IGNvbm5lY3RvcnNcbiAgaWYgKChlbGVtZW50LnR5cGUgPT09ICdwYXRoJyB8fCBlbGVtZW50LnR5cGUgPT09ICdwb2x5bGluZScpICYmIFxuICAgICAgZWxlbWVudC5maWxsID09PSAnbm9uZScpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBGaWdtYSBub2RlIGZyb20gYW4gU1ZHIGVsZW1lbnRcbiAqL1xuYXN5bmMgZnVuY3Rpb24gY3JlYXRlRmlnbWFOb2RlKGVsZW1lbnQ6IGFueSwgc2NhbGU6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSk6IFByb21pc2U8U2NlbmVOb2RlIHwgbnVsbD4ge1xuICAvLyBTY2FsZSBjb29yZGluYXRlc1xuICBjb25zdCB4ID0gZWxlbWVudC54ICogc2NhbGUueDtcbiAgY29uc3QgeSA9IGVsZW1lbnQueSAqIHNjYWxlLnk7XG4gIGNvbnN0IHdpZHRoID0gZWxlbWVudC53aWR0aCAqIHNjYWxlLng7XG4gIGNvbnN0IGhlaWdodCA9IGVsZW1lbnQuaGVpZ2h0ICogc2NhbGUueTtcbiAgXG4gIGxldCBub2RlOiBTY2VuZU5vZGUgfCBudWxsID0gbnVsbDtcbiAgXG4gIC8vIENob29zZSB0aGUgbm9kZSB0eXBlIGJhc2VkIG9uIHRoZSBTVkcgZWxlbWVudCB0eXBlXG4gIHN3aXRjaCAoZWxlbWVudC50eXBlKSB7XG4gICAgY2FzZSAncmVjdCc6XG4gICAgICBub2RlID0gZmlnbWEuY3JlYXRlUmVjdGFuZ2xlKCk7XG4gICAgICBub2RlLnggPSB4O1xuICAgICAgbm9kZS55ID0geTtcbiAgICAgIG5vZGUucmVzaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgYnJlYWs7XG4gICAgICBcbiAgICBjYXNlICdjaXJjbGUnOlxuICAgICAgbm9kZSA9IGZpZ21hLmNyZWF0ZUVsbGlwc2UoKTtcbiAgICAgIG5vZGUueCA9IHg7XG4gICAgICBub2RlLnkgPSB5O1xuICAgICAgbm9kZS5yZXNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICBicmVhaztcbiAgICAgIFxuICAgIGNhc2UgJ2VsbGlwc2UnOlxuICAgICAgbm9kZSA9IGZpZ21hLmNyZWF0ZUVsbGlwc2UoKTtcbiAgICAgIG5vZGUueCA9IHg7XG4gICAgICBub2RlLnkgPSB5O1xuICAgICAgbm9kZS5yZXNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICBicmVhaztcbiAgICAgIFxuICAgIGNhc2UgJ3BvbHlnb24nOlxuICAgICAgLy8gRm9yIHBvbHlnb25zLCBjcmVhdGUgYSBzaGFwZSB3aXRoIGEgdmVjdG9yIG5ldHdvcmtcbiAgICAgIGNvbnN0IHBvbHlnb24gPSBmaWdtYS5jcmVhdGVQb2x5Z29uKCk7XG4gICAgICBwb2x5Z29uLnggPSB4O1xuICAgICAgcG9seWdvbi55ID0geTtcbiAgICAgIHBvbHlnb24ucmVzaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgbm9kZSA9IHBvbHlnb247XG4gICAgICBicmVhaztcbiAgICAgIFxuICAgIGNhc2UgJ3BhdGgnOlxuICAgICAgLy8gSWYgdGhlIHBhdGggaGFzIGEgZmlsbCwgaXQncyBsaWtlbHkgYSBzaGFwZSBub2RlXG4gICAgICBpZiAoZWxlbWVudC5maWxsICE9PSAnbm9uZScpIHtcbiAgICAgICAgY29uc3Qgc2hhcGUgPSBmaWdtYS5jcmVhdGVSZWN0YW5nbGUoKTsgIC8vIEFzIGEgZmFsbGJhY2tcbiAgICAgICAgc2hhcGUueCA9IHg7XG4gICAgICAgIHNoYXBlLnkgPSB5O1xuICAgICAgICBzaGFwZS5yZXNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgIG5vZGUgPSBzaGFwZTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgICAgXG4gICAgY2FzZSAndGV4dCc6XG4gICAgICBjb25zdCB0ZXh0ID0gZmlnbWEuY3JlYXRlVGV4dCgpO1xuICAgICAgYXdhaXQgZmlnbWEubG9hZEZvbnRBc3luYyh7IGZhbWlseTogXCJJbnRlclwiLCBzdHlsZTogXCJSZWd1bGFyXCIgfSk7XG4gICAgICB0ZXh0LnggPSB4O1xuICAgICAgdGV4dC55ID0geTtcbiAgICAgIHRleHQucmVzaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgdGV4dC5jaGFyYWN0ZXJzID0gZWxlbWVudC50ZXh0IHx8ICcnO1xuICAgICAgbm9kZSA9IHRleHQ7XG4gICAgICBicmVhaztcbiAgICAgIFxuICAgIGNhc2UgJ2dyb3VwJzpcbiAgICAgIC8vIEZvciBncm91cHMsIGNyZWF0ZSBhIGZyYW1lIGFuZCBhZGQgY2hpbGRyZW5cbiAgICAgIGNvbnN0IGZyYW1lID0gZmlnbWEuY3JlYXRlRnJhbWUoKTtcbiAgICAgIGZyYW1lLnggPSB4O1xuICAgICAgZnJhbWUueSA9IHk7XG4gICAgICBmcmFtZS5yZXNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICBcbiAgICAgIC8vIFByb2Nlc3MgY2hpbGRyZW4gcmVjdXJzaXZlbHlcbiAgICAgIGlmIChlbGVtZW50LmNoaWxkcmVuICYmIGVsZW1lbnQuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBjaGlsZE5vZGVzID0gYXdhaXQgY3JlYXRlRmlnbWFOb2RlcyhlbGVtZW50LmNoaWxkcmVuLCBzY2FsZSk7XG4gICAgICAgIFxuICAgICAgICAvLyBBZGQgY2hpbGRyZW4gdG8gdGhlIGZyYW1lXG4gICAgICAgIGZvciAoY29uc3QgY2hpbGROb2RlIG9mIE9iamVjdC52YWx1ZXMoY2hpbGROb2RlcykpIHtcbiAgICAgICAgICAvLyBBZGp1c3QgcG9zaXRpb24gcmVsYXRpdmUgdG8gZnJhbWVcbiAgICAgICAgICBjaGlsZE5vZGUueCAtPSB4O1xuICAgICAgICAgIGNoaWxkTm9kZS55IC09IHk7XG4gICAgICAgICAgZnJhbWUuYXBwZW5kQ2hpbGQoY2hpbGROb2RlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICBub2RlID0gZnJhbWU7XG4gICAgICBicmVhaztcbiAgfVxuICBcbiAgLy8gQXBwbHkgY29tbW9uIHByb3BlcnRpZXMgaWYgYSBub2RlIHdhcyBjcmVhdGVkXG4gIGlmIChub2RlKSB7XG4gICAgLy8gU2V0IG5hbWVcbiAgICBub2RlLm5hbWUgPSBlbGVtZW50LmlkIHx8IGAke2VsZW1lbnQudHlwZX0tbm9kZWA7XG4gICAgXG4gICAgLy8gQXBwbHkgZmlsbHMgaWYgYXBwbGljYWJsZVxuICAgIGlmICgnZmlsbHMnIGluIG5vZGUgJiYgZWxlbWVudC5maWxsICYmIGVsZW1lbnQuZmlsbCAhPT0gJ25vbmUnKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZ2JDb2xvciA9IHBhcnNlQ29sb3IoZWxlbWVudC5maWxsKTtcbiAgICAgICAgbm9kZS5maWxscyA9IFt7XG4gICAgICAgICAgdHlwZTogJ1NPTElEJyxcbiAgICAgICAgICBjb2xvcjogcmdiQ29sb3IsXG4gICAgICAgICAgb3BhY2l0eTogMVxuICAgICAgICB9XTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihgQ291bGQgbm90IGFwcGx5IGZpbGwgZm9yIG5vZGUgJHtub2RlLm5hbWV9OmAsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gQXBwbHkgc3Ryb2tlcyBpZiBhcHBsaWNhYmxlXG4gICAgaWYgKCdzdHJva2VzJyBpbiBub2RlICYmIGVsZW1lbnQuc3Ryb2tlICYmIGVsZW1lbnQuc3Ryb2tlICE9PSAnbm9uZScpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJnYkNvbG9yID0gcGFyc2VDb2xvcihlbGVtZW50LnN0cm9rZSk7XG4gICAgICAgIG5vZGUuc3Ryb2tlcyA9IFt7XG4gICAgICAgICAgdHlwZTogJ1NPTElEJyxcbiAgICAgICAgICBjb2xvcjogcmdiQ29sb3IsXG4gICAgICAgICAgb3BhY2l0eTogMVxuICAgICAgICB9XTtcbiAgICAgICAgXG4gICAgICAgIGlmIChlbGVtZW50LnN0cm9rZVdpZHRoKSB7XG4gICAgICAgICAgbm9kZS5zdHJva2VXZWlnaHQgPSBlbGVtZW50LnN0cm9rZVdpZHRoO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLndhcm4oYENvdWxkIG5vdCBhcHBseSBzdHJva2UgZm9yIG5vZGUgJHtub2RlLm5hbWV9OmAsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIHJldHVybiBub2RlO1xufVxuXG4vKipcbiAqIFBhcnNlcyBhIGNvbG9yIHN0cmluZyAoaGV4LCByZ2IsIGV0Yy4pIHRvIFJHQiBjb21wb25lbnRzXG4gKi9cbmZ1bmN0aW9uIHBhcnNlQ29sb3IoY29sb3JTdHI6IHN0cmluZyk6IHsgcjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlciB9IHtcbiAgLy8gRGVmYXVsdCBjb2xvciBpZiBwYXJzaW5nIGZhaWxzXG4gIGNvbnN0IGRlZmF1bHRDb2xvciA9IHsgcjogMCwgZzogMCwgYjogMCB9O1xuICBcbiAgdHJ5IHtcbiAgICAvLyBIYW5kbGUgaGV4IGZvcm1hdCAoI1JSR0dCQilcbiAgICBpZiAoY29sb3JTdHIuc3RhcnRzV2l0aCgnIycpKSB7XG4gICAgICBjb25zdCBoZXggPSBjb2xvclN0ci5zbGljZSgxKTtcbiAgICAgIGlmIChoZXgubGVuZ3RoID09PSA2KSB7XG4gICAgICAgIGNvbnN0IHIgPSBwYXJzZUludChoZXguc3Vic3RyaW5nKDAsIDIpLCAxNikgLyAyNTU7XG4gICAgICAgIGNvbnN0IGcgPSBwYXJzZUludChoZXguc3Vic3RyaW5nKDIsIDQpLCAxNikgLyAyNTU7XG4gICAgICAgIGNvbnN0IGIgPSBwYXJzZUludChoZXguc3Vic3RyaW5nKDQsIDYpLCAxNikgLyAyNTU7XG4gICAgICAgIHJldHVybiB7IHIsIGcsIGIgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkZWZhdWx0Q29sb3I7XG4gICAgfVxuICAgIFxuICAgIC8vIEhhbmRsZSByZ2IgZm9ybWF0XG4gICAgaWYgKGNvbG9yU3RyLnN0YXJ0c1dpdGgoJ3JnYicpKSB7XG4gICAgICBjb25zdCBtYXRjaCA9IGNvbG9yU3RyLm1hdGNoKC9yZ2JcXChcXHMqKFxcZCspXFxzKixcXHMqKFxcZCspXFxzKixcXHMqKFxcZCspXFxzKlxcKS8pO1xuICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IHIgPSBwYXJzZUludChtYXRjaFsxXSwgMTApIC8gMjU1O1xuICAgICAgICBjb25zdCBnID0gcGFyc2VJbnQobWF0Y2hbMl0sIDEwKSAvIDI1NTtcbiAgICAgICAgY29uc3QgYiA9IHBhcnNlSW50KG1hdGNoWzNdLCAxMCkgLyAyNTU7XG4gICAgICAgIHJldHVybiB7IHIsIGcsIGIgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkZWZhdWx0Q29sb3I7XG4gICAgfVxuICAgIFxuICAgIC8vIEhhbmRsZSBuYW1lZCBjb2xvcnMgKHNpbXBsaWZpZWQpXG4gICAgY29uc3QgbmFtZWRDb2xvcnM6IHsgW25hbWU6IHN0cmluZ106IHsgcjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlciB9IH0gPSB7XG4gICAgICBibGFjazogeyByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgICB3aGl0ZTogeyByOiAxLCBnOiAxLCBiOiAxIH0sXG4gICAgICByZWQ6IHsgcjogMSwgZzogMCwgYjogMCB9LFxuICAgICAgZ3JlZW46IHsgcjogMCwgZzogMSwgYjogMCB9LFxuICAgICAgYmx1ZTogeyByOiAwLCBnOiAwLCBiOiAxIH0sXG4gICAgICBncmF5OiB7IHI6IDAuNSwgZzogMC41LCBiOiAwLjUgfSxcbiAgICAgIHllbGxvdzogeyByOiAxLCBnOiAxLCBiOiAwIH0sXG4gICAgICBwdXJwbGU6IHsgcjogMC41LCBnOiAwLCBiOiAwLjUgfSxcbiAgICAgIG9yYW5nZTogeyByOiAxLCBnOiAwLjY1LCBiOiAwIH0sXG4gICAgfTtcbiAgICBcbiAgICBpZiAobmFtZWRDb2xvcnNbY29sb3JTdHIudG9Mb3dlckNhc2UoKV0pIHtcbiAgICAgIHJldHVybiBuYW1lZENvbG9yc1tjb2xvclN0ci50b0xvd2VyQ2FzZSgpXTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIGRlZmF1bHRDb2xvcjtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLndhcm4oJ0Vycm9yIHBhcnNpbmcgY29sb3I6JywgZXJyb3IpO1xuICAgIHJldHVybiBkZWZhdWx0Q29sb3I7XG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGVzIGNvbm5lY3RvciBsaW5lcyBiZXR3ZWVuIG5vZGVzXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUNvbm5lY3Rpb25zKFxuICBmaWdtYU5vZGVzOiB7IFtpZDogc3RyaW5nXTogU2NlbmVOb2RlIH0sXG4gIGVsZW1lbnRzOiBhbnlbXVxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIC8vIENyZWF0ZSBhIG1hcCBmb3IgZWxlbWVudHNcbiAgY29uc3QgZWxlbWVudHNNYXA6IHsgW2lkOiBzdHJpbmddOiBhbnkgfSA9IHt9O1xuICBlbGVtZW50cy5mb3JFYWNoKGVsID0+IHtcbiAgICBlbGVtZW50c01hcFtlbC5pZF0gPSBlbDtcbiAgfSk7XG4gIFxuICAvLyBQcm9jZXNzIGVhY2ggZWxlbWVudCdzIGNvbm5lY3Rpb25zXG4gIGZvciAoY29uc3QgZWxlbWVudCBvZiBlbGVtZW50cykge1xuICAgIGlmICghZWxlbWVudC5jb25uZWN0aW9ucyB8fCBlbGVtZW50LmNvbm5lY3Rpb25zLmxlbmd0aCA9PT0gMCkgY29udGludWU7XG4gICAgXG4gICAgZm9yIChjb25zdCBjb25uZWN0aW9uIG9mIGVsZW1lbnQuY29ubmVjdGlvbnMpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGZyb21Ob2RlID0gZmlnbWFOb2Rlc1tjb25uZWN0aW9uLmZyb21JZF07XG4gICAgICAgIGNvbnN0IHRvTm9kZSA9IGZpZ21hTm9kZXNbY29ubmVjdGlvbi50b0lkXTtcbiAgICAgICAgXG4gICAgICAgIGlmICghZnJvbU5vZGUgfHwgIXRvTm9kZSkgY29udGludWU7XG4gICAgICAgIFxuICAgICAgICAvLyBDcmVhdGUgYSBjb25uZWN0b3JcbiAgICAgICAgY29uc3QgY29ubmVjdG9yID0gZmlnbWEuY3JlYXRlQ29ubmVjdG9yKCk7XG4gICAgICAgIGNvbm5lY3Rvci5uYW1lID0gYENvbm5lY3RvcjogJHtjb25uZWN0aW9uLmZyb21JZH0g4oaSICR7Y29ubmVjdGlvbi50b0lkfWA7XG4gICAgICAgIFxuICAgICAgICAvLyBTZXQgY29ubmVjdG9yIGVuZHBvaW50c1xuICAgICAgICBjb25uZWN0b3IuY29ubmVjdG9yU3RhcnQgPSB7XG4gICAgICAgICAgZW5kcG9pbnROb2RlSWQ6IGZyb21Ob2RlLmlkLFxuICAgICAgICAgIG1hZ25ldDogJ0FVVE8nXG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICBjb25uZWN0b3IuY29ubmVjdG9yRW5kID0ge1xuICAgICAgICAgIGVuZHBvaW50Tm9kZUlkOiB0b05vZGUuaWQsXG4gICAgICAgICAgbWFnbmV0OiAnQVVUTydcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIC8vIFNldCBzdHJva2UgcHJvcGVydGllc1xuICAgICAgICBjb25uZWN0b3Iuc3Ryb2tlcyA9IFt7XG4gICAgICAgICAgdHlwZTogJ1NPTElEJyxcbiAgICAgICAgICBjb2xvcjogeyByOiAwLCBnOiAwLCBiOiAwIH0sXG4gICAgICAgICAgb3BhY2l0eTogMVxuICAgICAgICB9XTtcbiAgICAgICAgXG4gICAgICAgIGNvbm5lY3Rvci5zdHJva2VXZWlnaHQgPSAxO1xuICAgICAgICBcbiAgICAgICAgLy8gQWR2YW5jZWQ6IElmIHdlIGhhdmUgc3BlY2lmaWMgcG9pbnRzIGZvciB0aGUgY29ubmVjdG9yIHBhdGhcbiAgICAgICAgaWYgKGNvbm5lY3Rpb24ucG9pbnRzICYmIGNvbm5lY3Rpb24ucG9pbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAvLyBUaGlzIGlzIGp1c3QgYSBwbGFjZWhvbGRlciAtIGFjdHVhbCBtYW5pcHVsYXRpb24gb2YgY29ubmVjdG9yIHBhdGhzXG4gICAgICAgICAgLy8gd291bGQgcmVxdWlyZSBtb3JlIGNvbXBsZXggaW50ZXJhY3Rpb25zIHdpdGggdGhlIEZpZ21hIEFQSVxuICAgICAgICAgIGNvbnNvbGUubG9nKCdDb25uZWN0aW9uIGhhcyBzcGVjaWZpYyBwb2ludHM6JywgY29ubmVjdGlvbi5wb2ludHMpO1xuICAgICAgICAgIFxuICAgICAgICAgIC8vIEFzIGEgc2ltcGxlIGFwcHJveGltYXRpb24sIHdlIGNvdWxkIGFkZCByb3VuZGVkIGNvcm5lcnNcbiAgICAgICAgICAvLyBOb3RlOiBzdHJva2VDYXAgcHJvcGVydHkgaXMgbm90IGF2YWlsYWJsZSBvbiBDb25uZWN0b3JOb2RlXG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihgRXJyb3IgY3JlYXRpbmcgY29ubmVjdGlvbiBmcm9tICR7Y29ubmVjdGlvbi5mcm9tSWR9IHRvICR7Y29ubmVjdGlvbi50b0lkfTpgLCBlcnJvcik7XG4gICAgICAgIC8vIENvbnRpbnVlIHdpdGggb3RoZXIgY29ubmVjdGlvbnNcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBzdmdUb0ZpZ21hRmxvd2NoYXJ0IH0gZnJvbSAnLi9zcmMvZmlnbWFDb252ZXJ0ZXInO1xuaW1wb3J0IHsgcGFyc2VTdmcgfSBmcm9tICcuL3NyYy9zdmdQYXJzZXInO1xuaW1wb3J0IHsgaGFuZGxlRXJyb3IgfSBmcm9tICcuL3NyYy9lcnJvckhhbmRsZXInO1xuXG5maWdtYS5zaG93VUkoX19odG1sX18sIHsgd2lkdGg6IDQwMCwgaGVpZ2h0OiA1MDAgfSk7XG5cbmZpZ21hLnVpLm9ubWVzc2FnZSA9IGFzeW5jIChtc2cpID0+IHtcbiAgaWYgKG1zZy50eXBlID09PSAnY29udmVydC1zdmcnKSB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIFBhcnNlIHRoZSBTVkcgY29udGVudFxuICAgICAgY29uc3QgcGFyc2VkU3ZnID0gcGFyc2VTdmcobXNnLnN2Z0NvbnRlbnQpO1xuICAgICAgXG4gICAgICAvLyBDcmVhdGUgYSBuZXcgcGFnZSBmb3IgdGhlIGZsb3djaGFydFxuICAgICAgY29uc3QgcGFnZSA9IGZpZ21hLmNyZWF0ZVBhZ2UoKTtcbiAgICAgIHBhZ2UubmFtZSA9IGBGbG93Y2hhcnQ6ICR7bXNnLmZpbGVOYW1lLnJlcGxhY2UoL1xcLnN2ZyQvLCAnJyl9YDtcbiAgICAgIGZpZ21hLmN1cnJlbnRQYWdlID0gcGFnZTtcblxuICAgICAgLy8gQ29udmVydCBTVkcgdG8gRmlnbWEgZmxvd2NoYXJ0XG4gICAgICBhd2FpdCBzdmdUb0ZpZ21hRmxvd2NoYXJ0KHBhcnNlZFN2Zyk7XG4gICAgICBcbiAgICAgIC8vIE5vdGlmeSBVSSB0aGF0IGNvbnZlcnNpb24gaXMgY29tcGxldGVcbiAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgdHlwZTogJ2NvbnZlcnNpb24tY29tcGxldGUnXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgZmlnbWEubm90aWZ5KCdTVkcgc3VjY2Vzc2Z1bGx5IGNvbnZlcnRlZCB0byBmbG93Y2hhcnQhJyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgXG4gICAgICAvLyBIYW5kbGUgdGhlIGVycm9yIGFuZCBub3RpZnkgVUlcbiAgICAgIGNvbnN0IGVycm9yTXNnID0gaGFuZGxlRXJyb3IoZXJyb3IpO1xuICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xuICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICBtZXNzYWdlOiBlcnJvck1zZ1xuICAgICAgfSk7XG4gICAgICBcbiAgICAgIGZpZ21hLm5vdGlmeSgnRXJyb3IgY29udmVydGluZyBTVkcgdG8gZmxvd2NoYXJ0JywgeyBlcnJvcjogdHJ1ZSB9KTtcbiAgICB9XG4gIH1cbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
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
/*!*****************!*\
  !*** ./ui.html ***!
  \*****************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Module
var code = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SVG to Flowchart Converter</title>
  <style>
    body {
      font-family: Inter, sans-serif;
      margin: 0;
      padding: 20px;
    }
    
    h2 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 16px;
    }
    
    .container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .upload-area {
      border: 1px dashed #AAAAAA;
      border-radius: 4px;
      padding: 24px;
      text-align: center;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .upload-area:hover {
      background-color: #F5F5F5;
    }
    
    .upload-area p {
      margin: 8px 0 0;
      color: #888888;
      font-size: 12px;
    }
    
    .upload-button {
      background-color: #18A0FB;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .upload-button:hover {
      background-color: #0D8EE4;
    }
    
    .upload-button:active {
      background-color: #0C7ECF;
    }
    
    .file-info {
      margin-top: 12px;
      font-size: 14px;
      display: none;
    }
    
    .file-name {
      font-weight: 500;
    }
    
    .convert-button {
      background-color: #18A0FB;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 12px 20px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
      margin-top: 16px;
    }
    
    .convert-button:hover {
      background-color: #0D8EE4;
    }
    
    .convert-button:active {
      background-color: #0C7ECF;
    }
    
    .convert-button:disabled {
      background-color: #CCCCCC;
      cursor: not-allowed;
    }
    
    .error-message {
      color: #F24822;
      font-size: 14px;
      margin-top: 16px;
      display: none;
    }
    
    .progress {
      display: none;
      margin-top: 16px;
    }
    
    .progress-bar {
      width: 100%;
      height: 4px;
      background-color: #EEEEEE;
      border-radius: 2px;
      overflow: hidden;
    }
    
    .progress-bar-fill {
      height: 100%;
      background-color: #18A0FB;
      width: 0;
      transition: width 0.3s;
    }
    
    .progress-text {
      font-size: 12px;
      color: #888888;
      margin-top: 8px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>SVG to Flowchart Converter</h2>
    
    <div id="uploadArea" class="upload-area">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5V19M12 5L18 11M12 5L6 11" stroke="#888888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p>Click to upload an SVG file or drag and drop</p>
    </div>
    
    <input type="file" id="fileInput" accept=".svg" style="display: none">
    
    <div id="fileInfo" class="file-info">
      <span>Selected file: </span>
      <span id="fileName" class="file-name"></span>
    </div>
    
    <button id="convertButton" class="convert-button" disabled>Convert to Flowchart</button>
    
    <div id="progress" class="progress">
      <div class="progress-bar">
        <div id="progressBarFill" class="progress-bar-fill"></div>
      </div>
      <div id="progressText" class="progress-text">Processing SVG...</div>
    </div>
    
    <div id="errorMessage" class="error-message"></div>
  </div>

  ${"<" + "script"}>
    // Variables to store SVG data
    let svgContent = null;
    let fileName = '';
    
    // DOM Elements
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const fileNameElement = document.getElementById('fileName');
    const convertButton = document.getElementById('convertButton');
    const errorMessage = document.getElementById('errorMessage');
    const progress = document.getElementById('progress');
    const progressBarFill = document.getElementById('progressBarFill');
    const progressText = document.getElementById('progressText');
    
    // Event listeners
    uploadArea.addEventListener('click', () => {
      fileInput.click();
    });
    
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.style.backgroundColor = '#F5F5F5';
    });
    
    uploadArea.addEventListener('dragleave', () => {
      uploadArea.style.backgroundColor = '';
    });
    
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.style.backgroundColor = '';
      
      if (e.dataTransfer.files.length) {
        handleFile(e.dataTransfer.files[0]);
      }
    });
    
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length) {
        handleFile(e.target.files[0]);
      }
    });
    
    convertButton.addEventListener('click', () => {
      if (!svgContent) return;
      
      // Show progress
      progress.style.display = 'block';
      convertButton.disabled = true;
      errorMessage.style.display = 'none';
      
      // Simulate progress (in a real implementation, this would be based on actual processing)
      let width = 0;
      const interval = setInterval(() => {
        width += 5;
        progressBarFill.style.width = \`\${width}%\`;
        
        if (width >= 90) {
          clearInterval(interval);
        }
      }, 100);
      
      // Send SVG to the plugin code
      parent.postMessage({ 
        pluginMessage: { 
          type: 'convert-svg',
          svgContent,
          fileName
        } 
      }, '*');
    });
    
    // Handle messages from the plugin code
    window.onmessage = (event) => {
      const message = event.data.pluginMessage;
      
      if (!message) return;
      
      if (message.type === 'conversion-complete') {
        // Complete the progress bar
        progressBarFill.style.width = '100%';
        progressText.textContent = 'Conversion complete!';
        
        // Reset after 2 seconds
        setTimeout(() => {
          progress.style.display = 'none';
          progressBarFill.style.width = '0';
          progressText.textContent = 'Processing SVG...';
          convertButton.disabled = false;
        }, 2000);
      }
      
      if (message.type === 'error') {
        // Show error
        errorMessage.textContent = message.message;
        errorMessage.style.display = 'block';
        progress.style.display = 'none';
        convertButton.disabled = false;
      }
    };
    
    // Function to handle file selection
    function handleFile(file) {
      // Check if the file is an SVG
      if (!file.name.toLowerCase().endsWith('.svg')) {
        errorMessage.textContent = 'Please select an SVG file.';
        errorMessage.style.display = 'block';
        return;
      }
      
      // Reset error message
      errorMessage.style.display = 'none';
      
      // Read the file
      const reader = new FileReader();
      
      reader.onload = (e) => {
        svgContent = e.target.result;
        fileName = file.name;
        
        // Update UI
        fileNameElement.textContent = fileName;
        fileInfo.style.display = 'block';
        convertButton.disabled = false;
      };
      
      reader.onerror = () => {
        errorMessage.textContent = 'Error reading the file. Please try again.';
        errorMessage.style.display = 'block';
      };
      
      reader.readAsText(file);
    }
  ${"<" + "/script"}>
</body>
</html>
`;
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (code);
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidWkuanMiLCJtYXBwaW5ncyI6Ijs7VUFBQTtVQUNBOzs7OztXQ0RBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLElBQUksZUFBZTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyxNQUFNO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksZ0JBQWdCO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUVBQWUsSUFBSSxFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd29ya3NwYWNlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dvcmtzcGFjZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd29ya3NwYWNlL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vd29ya3NwYWNlL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd29ya3NwYWNlLy4vdWkuaHRtbCJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGUgcmVxdWlyZSBzY29wZVxudmFyIF9fd2VicGFja19yZXF1aXJlX18gPSB7fTtcblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIE1vZHVsZVxudmFyIGNvZGUgPSBgPCFET0NUWVBFIGh0bWw+XG48aHRtbCBsYW5nPVwiZW5cIj5cbjxoZWFkPlxuICA8bWV0YSBjaGFyc2V0PVwiVVRGLThcIj5cbiAgPG1ldGEgbmFtZT1cInZpZXdwb3J0XCIgY29udGVudD1cIndpZHRoPWRldmljZS13aWR0aCwgaW5pdGlhbC1zY2FsZT0xLjBcIj5cbiAgPHRpdGxlPlNWRyB0byBGbG93Y2hhcnQgQ29udmVydGVyPC90aXRsZT5cbiAgPHN0eWxlPlxuICAgIGJvZHkge1xuICAgICAgZm9udC1mYW1pbHk6IEludGVyLCBzYW5zLXNlcmlmO1xuICAgICAgbWFyZ2luOiAwO1xuICAgICAgcGFkZGluZzogMjBweDtcbiAgICB9XG4gICAgXG4gICAgaDIge1xuICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgIG1hcmdpbi1ib3R0b206IDE2cHg7XG4gICAgfVxuICAgIFxuICAgIC5jb250YWluZXIge1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICBnYXA6IDE2cHg7XG4gICAgfVxuICAgIFxuICAgIC51cGxvYWQtYXJlYSB7XG4gICAgICBib3JkZXI6IDFweCBkYXNoZWQgI0FBQUFBQTtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICAgIHBhZGRpbmc6IDI0cHg7XG4gICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuMnM7XG4gICAgfVxuICAgIFxuICAgIC51cGxvYWQtYXJlYTpob3ZlciB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjRjVGNUY1O1xuICAgIH1cbiAgICBcbiAgICAudXBsb2FkLWFyZWEgcCB7XG4gICAgICBtYXJnaW46IDhweCAwIDA7XG4gICAgICBjb2xvcjogIzg4ODg4ODtcbiAgICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICB9XG4gICAgXG4gICAgLnVwbG9hZC1idXR0b24ge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzE4QTBGQjtcbiAgICAgIGNvbG9yOiB3aGl0ZTtcbiAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDZweDtcbiAgICAgIHBhZGRpbmc6IDhweCAxNnB4O1xuICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycztcbiAgICB9XG4gICAgXG4gICAgLnVwbG9hZC1idXR0b246aG92ZXIge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzBEOEVFNDtcbiAgICB9XG4gICAgXG4gICAgLnVwbG9hZC1idXR0b246YWN0aXZlIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICMwQzdFQ0Y7XG4gICAgfVxuICAgIFxuICAgIC5maWxlLWluZm8ge1xuICAgICAgbWFyZ2luLXRvcDogMTJweDtcbiAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgfVxuICAgIFxuICAgIC5maWxlLW5hbWUge1xuICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICB9XG4gICAgXG4gICAgLmNvbnZlcnQtYnV0dG9uIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICMxOEEwRkI7XG4gICAgICBjb2xvcjogd2hpdGU7XG4gICAgICBib3JkZXI6IG5vbmU7XG4gICAgICBib3JkZXItcmFkaXVzOiA2cHg7XG4gICAgICBwYWRkaW5nOiAxMnB4IDIwcHg7XG4gICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjJzO1xuICAgICAgbWFyZ2luLXRvcDogMTZweDtcbiAgICB9XG4gICAgXG4gICAgLmNvbnZlcnQtYnV0dG9uOmhvdmVyIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICMwRDhFRTQ7XG4gICAgfVxuICAgIFxuICAgIC5jb252ZXJ0LWJ1dHRvbjphY3RpdmUge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzBDN0VDRjtcbiAgICB9XG4gICAgXG4gICAgLmNvbnZlcnQtYnV0dG9uOmRpc2FibGVkIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICNDQ0NDQ0M7XG4gICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgIH1cbiAgICBcbiAgICAuZXJyb3ItbWVzc2FnZSB7XG4gICAgICBjb2xvcjogI0YyNDgyMjtcbiAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgIG1hcmdpbi10b3A6IDE2cHg7XG4gICAgICBkaXNwbGF5OiBub25lO1xuICAgIH1cbiAgICBcbiAgICAucHJvZ3Jlc3Mge1xuICAgICAgZGlzcGxheTogbm9uZTtcbiAgICAgIG1hcmdpbi10b3A6IDE2cHg7XG4gICAgfVxuICAgIFxuICAgIC5wcm9ncmVzcy1iYXIge1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICBoZWlnaHQ6IDRweDtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICNFRUVFRUU7XG4gICAgICBib3JkZXItcmFkaXVzOiAycHg7XG4gICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgIH1cbiAgICBcbiAgICAucHJvZ3Jlc3MtYmFyLWZpbGwge1xuICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzE4QTBGQjtcbiAgICAgIHdpZHRoOiAwO1xuICAgICAgdHJhbnNpdGlvbjogd2lkdGggMC4zcztcbiAgICB9XG4gICAgXG4gICAgLnByb2dyZXNzLXRleHQge1xuICAgICAgZm9udC1zaXplOiAxMnB4O1xuICAgICAgY29sb3I6ICM4ODg4ODg7XG4gICAgICBtYXJnaW4tdG9wOiA4cHg7XG4gICAgfVxuICA8L3N0eWxlPlxuPC9oZWFkPlxuPGJvZHk+XG4gIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cbiAgICA8aDI+U1ZHIHRvIEZsb3djaGFydCBDb252ZXJ0ZXI8L2gyPlxuICAgIFxuICAgIDxkaXYgaWQ9XCJ1cGxvYWRBcmVhXCIgY2xhc3M9XCJ1cGxvYWQtYXJlYVwiPlxuICAgICAgPHN2ZyB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XG4gICAgICAgIDxwYXRoIGQ9XCJNMTIgNVYxOU0xMiA1TDE4IDExTTEyIDVMNiAxMVwiIHN0cm9rZT1cIiM4ODg4ODhcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIvPlxuICAgICAgPC9zdmc+XG4gICAgICA8cD5DbGljayB0byB1cGxvYWQgYW4gU1ZHIGZpbGUgb3IgZHJhZyBhbmQgZHJvcDwvcD5cbiAgICA8L2Rpdj5cbiAgICBcbiAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBpZD1cImZpbGVJbnB1dFwiIGFjY2VwdD1cIi5zdmdcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj5cbiAgICBcbiAgICA8ZGl2IGlkPVwiZmlsZUluZm9cIiBjbGFzcz1cImZpbGUtaW5mb1wiPlxuICAgICAgPHNwYW4+U2VsZWN0ZWQgZmlsZTogPC9zcGFuPlxuICAgICAgPHNwYW4gaWQ9XCJmaWxlTmFtZVwiIGNsYXNzPVwiZmlsZS1uYW1lXCI+PC9zcGFuPlxuICAgIDwvZGl2PlxuICAgIFxuICAgIDxidXR0b24gaWQ9XCJjb252ZXJ0QnV0dG9uXCIgY2xhc3M9XCJjb252ZXJ0LWJ1dHRvblwiIGRpc2FibGVkPkNvbnZlcnQgdG8gRmxvd2NoYXJ0PC9idXR0b24+XG4gICAgXG4gICAgPGRpdiBpZD1cInByb2dyZXNzXCIgY2xhc3M9XCJwcm9ncmVzc1wiPlxuICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWJhclwiPlxuICAgICAgICA8ZGl2IGlkPVwicHJvZ3Jlc3NCYXJGaWxsXCIgY2xhc3M9XCJwcm9ncmVzcy1iYXItZmlsbFwiPjwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGlkPVwicHJvZ3Jlc3NUZXh0XCIgY2xhc3M9XCJwcm9ncmVzcy10ZXh0XCI+UHJvY2Vzc2luZyBTVkcuLi48L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICBcbiAgICA8ZGl2IGlkPVwiZXJyb3JNZXNzYWdlXCIgY2xhc3M9XCJlcnJvci1tZXNzYWdlXCI+PC9kaXY+XG4gIDwvZGl2PlxuXG4gICR7XCI8XCIgKyBcInNjcmlwdFwifT5cbiAgICAvLyBWYXJpYWJsZXMgdG8gc3RvcmUgU1ZHIGRhdGFcbiAgICBsZXQgc3ZnQ29udGVudCA9IG51bGw7XG4gICAgbGV0IGZpbGVOYW1lID0gJyc7XG4gICAgXG4gICAgLy8gRE9NIEVsZW1lbnRzXG4gICAgY29uc3QgdXBsb2FkQXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1cGxvYWRBcmVhJyk7XG4gICAgY29uc3QgZmlsZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbGVJbnB1dCcpO1xuICAgIGNvbnN0IGZpbGVJbmZvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbGVJbmZvJyk7XG4gICAgY29uc3QgZmlsZU5hbWVFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbGVOYW1lJyk7XG4gICAgY29uc3QgY29udmVydEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb252ZXJ0QnV0dG9uJyk7XG4gICAgY29uc3QgZXJyb3JNZXNzYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vycm9yTWVzc2FnZScpO1xuICAgIGNvbnN0IHByb2dyZXNzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb2dyZXNzJyk7XG4gICAgY29uc3QgcHJvZ3Jlc3NCYXJGaWxsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb2dyZXNzQmFyRmlsbCcpO1xuICAgIGNvbnN0IHByb2dyZXNzVGV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9ncmVzc1RleHQnKTtcbiAgICBcbiAgICAvLyBFdmVudCBsaXN0ZW5lcnNcbiAgICB1cGxvYWRBcmVhLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgZmlsZUlucHV0LmNsaWNrKCk7XG4gICAgfSk7XG4gICAgXG4gICAgdXBsb2FkQXJlYS5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB1cGxvYWRBcmVhLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjRjVGNUY1JztcbiAgICB9KTtcbiAgICBcbiAgICB1cGxvYWRBcmVhLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdsZWF2ZScsICgpID0+IHtcbiAgICAgIHVwbG9hZEFyZWEuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyc7XG4gICAgfSk7XG4gICAgXG4gICAgdXBsb2FkQXJlYS5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHVwbG9hZEFyZWEuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyc7XG4gICAgICBcbiAgICAgIGlmIChlLmRhdGFUcmFuc2Zlci5maWxlcy5sZW5ndGgpIHtcbiAgICAgICAgaGFuZGxlRmlsZShlLmRhdGFUcmFuc2Zlci5maWxlc1swXSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgXG4gICAgZmlsZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgICBpZiAoZS50YXJnZXQuZmlsZXMubGVuZ3RoKSB7XG4gICAgICAgIGhhbmRsZUZpbGUoZS50YXJnZXQuZmlsZXNbMF0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIFxuICAgIGNvbnZlcnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBpZiAoIXN2Z0NvbnRlbnQpIHJldHVybjtcbiAgICAgIFxuICAgICAgLy8gU2hvdyBwcm9ncmVzc1xuICAgICAgcHJvZ3Jlc3Muc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICBjb252ZXJ0QnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIGVycm9yTWVzc2FnZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgXG4gICAgICAvLyBTaW11bGF0ZSBwcm9ncmVzcyAoaW4gYSByZWFsIGltcGxlbWVudGF0aW9uLCB0aGlzIHdvdWxkIGJlIGJhc2VkIG9uIGFjdHVhbCBwcm9jZXNzaW5nKVxuICAgICAgbGV0IHdpZHRoID0gMDtcbiAgICAgIGNvbnN0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICB3aWR0aCArPSA1O1xuICAgICAgICBwcm9ncmVzc0JhckZpbGwuc3R5bGUud2lkdGggPSBcXGBcXCR7d2lkdGh9JVxcYDtcbiAgICAgICAgXG4gICAgICAgIGlmICh3aWR0aCA+PSA5MCkge1xuICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgICB9XG4gICAgICB9LCAxMDApO1xuICAgICAgXG4gICAgICAvLyBTZW5kIFNWRyB0byB0aGUgcGx1Z2luIGNvZGVcbiAgICAgIHBhcmVudC5wb3N0TWVzc2FnZSh7IFxuICAgICAgICBwbHVnaW5NZXNzYWdlOiB7IFxuICAgICAgICAgIHR5cGU6ICdjb252ZXJ0LXN2ZycsXG4gICAgICAgICAgc3ZnQ29udGVudCxcbiAgICAgICAgICBmaWxlTmFtZVxuICAgICAgICB9IFxuICAgICAgfSwgJyonKTtcbiAgICB9KTtcbiAgICBcbiAgICAvLyBIYW5kbGUgbWVzc2FnZXMgZnJvbSB0aGUgcGx1Z2luIGNvZGVcbiAgICB3aW5kb3cub25tZXNzYWdlID0gKGV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gZXZlbnQuZGF0YS5wbHVnaW5NZXNzYWdlO1xuICAgICAgXG4gICAgICBpZiAoIW1lc3NhZ2UpIHJldHVybjtcbiAgICAgIFxuICAgICAgaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ2NvbnZlcnNpb24tY29tcGxldGUnKSB7XG4gICAgICAgIC8vIENvbXBsZXRlIHRoZSBwcm9ncmVzcyBiYXJcbiAgICAgICAgcHJvZ3Jlc3NCYXJGaWxsLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgICAgICBwcm9ncmVzc1RleHQudGV4dENvbnRlbnQgPSAnQ29udmVyc2lvbiBjb21wbGV0ZSEnO1xuICAgICAgICBcbiAgICAgICAgLy8gUmVzZXQgYWZ0ZXIgMiBzZWNvbmRzXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHByb2dyZXNzLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgcHJvZ3Jlc3NCYXJGaWxsLnN0eWxlLndpZHRoID0gJzAnO1xuICAgICAgICAgIHByb2dyZXNzVGV4dC50ZXh0Q29udGVudCA9ICdQcm9jZXNzaW5nIFNWRy4uLic7XG4gICAgICAgICAgY29udmVydEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICB9LCAyMDAwKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAvLyBTaG93IGVycm9yXG4gICAgICAgIGVycm9yTWVzc2FnZS50ZXh0Q29udGVudCA9IG1lc3NhZ2UubWVzc2FnZTtcbiAgICAgICAgZXJyb3JNZXNzYWdlLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBwcm9ncmVzcy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBjb252ZXJ0QnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfTtcbiAgICBcbiAgICAvLyBGdW5jdGlvbiB0byBoYW5kbGUgZmlsZSBzZWxlY3Rpb25cbiAgICBmdW5jdGlvbiBoYW5kbGVGaWxlKGZpbGUpIHtcbiAgICAgIC8vIENoZWNrIGlmIHRoZSBmaWxlIGlzIGFuIFNWR1xuICAgICAgaWYgKCFmaWxlLm5hbWUudG9Mb3dlckNhc2UoKS5lbmRzV2l0aCgnLnN2ZycpKSB7XG4gICAgICAgIGVycm9yTWVzc2FnZS50ZXh0Q29udGVudCA9ICdQbGVhc2Ugc2VsZWN0IGFuIFNWRyBmaWxlLic7XG4gICAgICAgIGVycm9yTWVzc2FnZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBSZXNldCBlcnJvciBtZXNzYWdlXG4gICAgICBlcnJvck1lc3NhZ2Uuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIFxuICAgICAgLy8gUmVhZCB0aGUgZmlsZVxuICAgICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgIFxuICAgICAgcmVhZGVyLm9ubG9hZCA9IChlKSA9PiB7XG4gICAgICAgIHN2Z0NvbnRlbnQgPSBlLnRhcmdldC5yZXN1bHQ7XG4gICAgICAgIGZpbGVOYW1lID0gZmlsZS5uYW1lO1xuICAgICAgICBcbiAgICAgICAgLy8gVXBkYXRlIFVJXG4gICAgICAgIGZpbGVOYW1lRWxlbWVudC50ZXh0Q29udGVudCA9IGZpbGVOYW1lO1xuICAgICAgICBmaWxlSW5mby5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgY29udmVydEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgfTtcbiAgICAgIFxuICAgICAgcmVhZGVyLm9uZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgIGVycm9yTWVzc2FnZS50ZXh0Q29udGVudCA9ICdFcnJvciByZWFkaW5nIHRoZSBmaWxlLiBQbGVhc2UgdHJ5IGFnYWluLic7XG4gICAgICAgIGVycm9yTWVzc2FnZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIH07XG4gICAgICBcbiAgICAgIHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xuICAgIH1cbiAgJHtcIjxcIiArIFwiL3NjcmlwdFwifT5cbjwvYm9keT5cbjwvaHRtbD5cbmA7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBjb2RlOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
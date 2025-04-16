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
    
    <button id="convertButton" class="convert-button">Test Plugin</button>
    
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
      // Show progress
      progress.style.display = 'block';
      convertButton.disabled = true;
      errorMessage.style.display = 'none';
      
      // Simply send a test message - no SVG content needed for now
      parent.postMessage({ 
        pluginMessage: { 
          type: 'convert-svg',
          svgContent: '<svg></svg>', // Dummy SVG
          fileName: 'test.svg'
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
        progressText.textContent = 'Test completed!';
        
        // Reset after 1 second
        setTimeout(() => {
          progress.style.display = 'none';
          progressBarFill.style.width = '0';
          progressText.textContent = 'Processing...';
          convertButton.disabled = false;
        }, 1000);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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b3Jrc3BhY2Uvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3dvcmtzcGFjZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dvcmtzcGFjZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3dvcmtzcGFjZS8uL3VpLmh0bWwiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhlIHJlcXVpcmUgc2NvcGVcbnZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBNb2R1bGVcbnZhciBjb2RlID0gYDwhRE9DVFlQRSBodG1sPlxuPGh0bWwgbGFuZz1cImVuXCI+XG48aGVhZD5cbiAgPG1ldGEgY2hhcnNldD1cIlVURi04XCI+XG4gIDxtZXRhIG5hbWU9XCJ2aWV3cG9ydFwiIGNvbnRlbnQ9XCJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MS4wXCI+XG4gIDx0aXRsZT5TVkcgdG8gRmxvd2NoYXJ0IENvbnZlcnRlcjwvdGl0bGU+XG4gIDxzdHlsZT5cbiAgICBib2R5IHtcbiAgICAgIGZvbnQtZmFtaWx5OiBJbnRlciwgc2Fucy1zZXJpZjtcbiAgICAgIG1hcmdpbjogMDtcbiAgICAgIHBhZGRpbmc6IDIwcHg7XG4gICAgfVxuICAgIFxuICAgIGgyIHtcbiAgICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICBtYXJnaW4tYm90dG9tOiAxNnB4O1xuICAgIH1cbiAgICBcbiAgICAuY29udGFpbmVyIHtcbiAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgZ2FwOiAxNnB4O1xuICAgIH1cbiAgICBcbiAgICAudXBsb2FkLWFyZWEge1xuICAgICAgYm9yZGVyOiAxcHggZGFzaGVkICNBQUFBQUE7XG4gICAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgICBwYWRkaW5nOiAyNHB4O1xuICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjJzO1xuICAgIH1cbiAgICBcbiAgICAudXBsb2FkLWFyZWE6aG92ZXIge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogI0Y1RjVGNTtcbiAgICB9XG4gICAgXG4gICAgLnVwbG9hZC1hcmVhIHAge1xuICAgICAgbWFyZ2luOiA4cHggMCAwO1xuICAgICAgY29sb3I6ICM4ODg4ODg7XG4gICAgICBmb250LXNpemU6IDEycHg7XG4gICAgfVxuICAgIFxuICAgIC51cGxvYWQtYnV0dG9uIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICMxOEEwRkI7XG4gICAgICBjb2xvcjogd2hpdGU7XG4gICAgICBib3JkZXI6IG5vbmU7XG4gICAgICBib3JkZXItcmFkaXVzOiA2cHg7XG4gICAgICBwYWRkaW5nOiA4cHggMTZweDtcbiAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuMnM7XG4gICAgfVxuICAgIFxuICAgIC51cGxvYWQtYnV0dG9uOmhvdmVyIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICMwRDhFRTQ7XG4gICAgfVxuICAgIFxuICAgIC51cGxvYWQtYnV0dG9uOmFjdGl2ZSB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMEM3RUNGO1xuICAgIH1cbiAgICBcbiAgICAuZmlsZS1pbmZvIHtcbiAgICAgIG1hcmdpbi10b3A6IDEycHg7XG4gICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICBkaXNwbGF5OiBub25lO1xuICAgIH1cbiAgICBcbiAgICAuZmlsZS1uYW1lIHtcbiAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgfVxuICAgIFxuICAgIC5jb252ZXJ0LWJ1dHRvbiB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMThBMEZCO1xuICAgICAgY29sb3I6IHdoaXRlO1xuICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgYm9yZGVyLXJhZGl1czogNnB4O1xuICAgICAgcGFkZGluZzogMTJweCAyMHB4O1xuICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycztcbiAgICAgIG1hcmdpbi10b3A6IDE2cHg7XG4gICAgfVxuICAgIFxuICAgIC5jb252ZXJ0LWJ1dHRvbjpob3ZlciB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMEQ4RUU0O1xuICAgIH1cbiAgICBcbiAgICAuY29udmVydC1idXR0b246YWN0aXZlIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICMwQzdFQ0Y7XG4gICAgfVxuICAgIFxuICAgIC5jb252ZXJ0LWJ1dHRvbjpkaXNhYmxlZCB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjQ0NDQ0NDO1xuICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICB9XG4gICAgXG4gICAgLmVycm9yLW1lc3NhZ2Uge1xuICAgICAgY29sb3I6ICNGMjQ4MjI7XG4gICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICBtYXJnaW4tdG9wOiAxNnB4O1xuICAgICAgZGlzcGxheTogbm9uZTtcbiAgICB9XG4gICAgXG4gICAgLnByb2dyZXNzIHtcbiAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgICBtYXJnaW4tdG9wOiAxNnB4O1xuICAgIH1cbiAgICBcbiAgICAucHJvZ3Jlc3MtYmFyIHtcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgaGVpZ2h0OiA0cHg7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjRUVFRUVFO1xuICAgICAgYm9yZGVyLXJhZGl1czogMnB4O1xuICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICB9XG4gICAgXG4gICAgLnByb2dyZXNzLWJhci1maWxsIHtcbiAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICMxOEEwRkI7XG4gICAgICB3aWR0aDogMDtcbiAgICAgIHRyYW5zaXRpb246IHdpZHRoIDAuM3M7XG4gICAgfVxuICAgIFxuICAgIC5wcm9ncmVzcy10ZXh0IHtcbiAgICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICAgIGNvbG9yOiAjODg4ODg4O1xuICAgICAgbWFyZ2luLXRvcDogOHB4O1xuICAgIH1cbiAgPC9zdHlsZT5cbjwvaGVhZD5cbjxib2R5PlxuICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XG4gICAgPGgyPlNWRyB0byBGbG93Y2hhcnQgQ29udmVydGVyPC9oMj5cbiAgICBcbiAgICA8ZGl2IGlkPVwidXBsb2FkQXJlYVwiIGNsYXNzPVwidXBsb2FkLWFyZWFcIj5cbiAgICAgIDxzdmcgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAgICAgICA8cGF0aCBkPVwiTTEyIDVWMTlNMTIgNUwxOCAxMU0xMiA1TDYgMTFcIiBzdHJva2U9XCIjODg4ODg4XCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiLz5cbiAgICAgIDwvc3ZnPlxuICAgICAgPHA+Q2xpY2sgdG8gdXBsb2FkIGFuIFNWRyBmaWxlIG9yIGRyYWcgYW5kIGRyb3A8L3A+XG4gICAgPC9kaXY+XG4gICAgXG4gICAgPGlucHV0IHR5cGU9XCJmaWxlXCIgaWQ9XCJmaWxlSW5wdXRcIiBhY2NlcHQ9XCIuc3ZnXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+XG4gICAgXG4gICAgPGRpdiBpZD1cImZpbGVJbmZvXCIgY2xhc3M9XCJmaWxlLWluZm9cIj5cbiAgICAgIDxzcGFuPlNlbGVjdGVkIGZpbGU6IDwvc3Bhbj5cbiAgICAgIDxzcGFuIGlkPVwiZmlsZU5hbWVcIiBjbGFzcz1cImZpbGUtbmFtZVwiPjwvc3Bhbj5cbiAgICA8L2Rpdj5cbiAgICBcbiAgICA8YnV0dG9uIGlkPVwiY29udmVydEJ1dHRvblwiIGNsYXNzPVwiY29udmVydC1idXR0b25cIj5UZXN0IFBsdWdpbjwvYnV0dG9uPlxuICAgIFxuICAgIDxkaXYgaWQ9XCJwcm9ncmVzc1wiIGNsYXNzPVwicHJvZ3Jlc3NcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1iYXJcIj5cbiAgICAgICAgPGRpdiBpZD1cInByb2dyZXNzQmFyRmlsbFwiIGNsYXNzPVwicHJvZ3Jlc3MtYmFyLWZpbGxcIj48L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBpZD1cInByb2dyZXNzVGV4dFwiIGNsYXNzPVwicHJvZ3Jlc3MtdGV4dFwiPlByb2Nlc3NpbmcgU1ZHLi4uPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgXG4gICAgPGRpdiBpZD1cImVycm9yTWVzc2FnZVwiIGNsYXNzPVwiZXJyb3ItbWVzc2FnZVwiPjwvZGl2PlxuICA8L2Rpdj5cblxuICAke1wiPFwiICsgXCJzY3JpcHRcIn0+XG4gICAgLy8gVmFyaWFibGVzIHRvIHN0b3JlIFNWRyBkYXRhXG4gICAgbGV0IHN2Z0NvbnRlbnQgPSBudWxsO1xuICAgIGxldCBmaWxlTmFtZSA9ICcnO1xuICAgIFxuICAgIC8vIERPTSBFbGVtZW50c1xuICAgIGNvbnN0IHVwbG9hZEFyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXBsb2FkQXJlYScpO1xuICAgIGNvbnN0IGZpbGVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWxlSW5wdXQnKTtcbiAgICBjb25zdCBmaWxlSW5mbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWxlSW5mbycpO1xuICAgIGNvbnN0IGZpbGVOYW1lRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWxlTmFtZScpO1xuICAgIGNvbnN0IGNvbnZlcnRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udmVydEJ1dHRvbicpO1xuICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlcnJvck1lc3NhZ2UnKTtcbiAgICBjb25zdCBwcm9ncmVzcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9ncmVzcycpO1xuICAgIGNvbnN0IHByb2dyZXNzQmFyRmlsbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9ncmVzc0JhckZpbGwnKTtcbiAgICBjb25zdCBwcm9ncmVzc1RleHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJvZ3Jlc3NUZXh0Jyk7XG4gICAgXG4gICAgLy8gRXZlbnQgbGlzdGVuZXJzXG4gICAgdXBsb2FkQXJlYS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGZpbGVJbnB1dC5jbGljaygpO1xuICAgIH0pO1xuICAgIFxuICAgIHVwbG9hZEFyZWEuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdXBsb2FkQXJlYS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI0Y1RjVGNSc7XG4gICAgfSk7XG4gICAgXG4gICAgdXBsb2FkQXJlYS5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCAoKSA9PiB7XG4gICAgICB1cGxvYWRBcmVhLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcnO1xuICAgIH0pO1xuICAgIFxuICAgIHVwbG9hZEFyZWEuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB1cGxvYWRBcmVhLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcnO1xuICAgICAgXG4gICAgICBpZiAoZS5kYXRhVHJhbnNmZXIuZmlsZXMubGVuZ3RoKSB7XG4gICAgICAgIGhhbmRsZUZpbGUoZS5kYXRhVHJhbnNmZXIuZmlsZXNbMF0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIFxuICAgIGZpbGVJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZSkgPT4ge1xuICAgICAgaWYgKGUudGFyZ2V0LmZpbGVzLmxlbmd0aCkge1xuICAgICAgICBoYW5kbGVGaWxlKGUudGFyZ2V0LmZpbGVzWzBdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBcbiAgICBjb252ZXJ0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgLy8gU2hvdyBwcm9ncmVzc1xuICAgICAgcHJvZ3Jlc3Muc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICBjb252ZXJ0QnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIGVycm9yTWVzc2FnZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgXG4gICAgICAvLyBTaW1wbHkgc2VuZCBhIHRlc3QgbWVzc2FnZSAtIG5vIFNWRyBjb250ZW50IG5lZWRlZCBmb3Igbm93XG4gICAgICBwYXJlbnQucG9zdE1lc3NhZ2UoeyBcbiAgICAgICAgcGx1Z2luTWVzc2FnZTogeyBcbiAgICAgICAgICB0eXBlOiAnY29udmVydC1zdmcnLFxuICAgICAgICAgIHN2Z0NvbnRlbnQ6ICc8c3ZnPjwvc3ZnPicsIC8vIER1bW15IFNWR1xuICAgICAgICAgIGZpbGVOYW1lOiAndGVzdC5zdmcnXG4gICAgICAgIH0gXG4gICAgICB9LCAnKicpO1xuICAgIH0pO1xuICAgIFxuICAgIC8vIEhhbmRsZSBtZXNzYWdlcyBmcm9tIHRoZSBwbHVnaW4gY29kZVxuICAgIHdpbmRvdy5vbm1lc3NhZ2UgPSAoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBldmVudC5kYXRhLnBsdWdpbk1lc3NhZ2U7XG4gICAgICBcbiAgICAgIGlmICghbWVzc2FnZSkgcmV0dXJuO1xuICAgICAgXG4gICAgICBpZiAobWVzc2FnZS50eXBlID09PSAnY29udmVyc2lvbi1jb21wbGV0ZScpIHtcbiAgICAgICAgLy8gQ29tcGxldGUgdGhlIHByb2dyZXNzIGJhclxuICAgICAgICBwcm9ncmVzc0JhckZpbGwuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgICAgIHByb2dyZXNzVGV4dC50ZXh0Q29udGVudCA9ICdUZXN0IGNvbXBsZXRlZCEnO1xuICAgICAgICBcbiAgICAgICAgLy8gUmVzZXQgYWZ0ZXIgMSBzZWNvbmRcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgcHJvZ3Jlc3Muc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICBwcm9ncmVzc0JhckZpbGwuc3R5bGUud2lkdGggPSAnMCc7XG4gICAgICAgICAgcHJvZ3Jlc3NUZXh0LnRleHRDb250ZW50ID0gJ1Byb2Nlc3NpbmcuLi4nO1xuICAgICAgICAgIGNvbnZlcnRCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgfSwgMTAwMCk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgLy8gU2hvdyBlcnJvclxuICAgICAgICBlcnJvck1lc3NhZ2UudGV4dENvbnRlbnQgPSBtZXNzYWdlLm1lc3NhZ2U7XG4gICAgICAgIGVycm9yTWVzc2FnZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgcHJvZ3Jlc3Muc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgY29udmVydEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH07XG4gICAgXG4gICAgLy8gRnVuY3Rpb24gdG8gaGFuZGxlIGZpbGUgc2VsZWN0aW9uXG4gICAgZnVuY3Rpb24gaGFuZGxlRmlsZShmaWxlKSB7XG4gICAgICAvLyBDaGVjayBpZiB0aGUgZmlsZSBpcyBhbiBTVkdcbiAgICAgIGlmICghZmlsZS5uYW1lLnRvTG93ZXJDYXNlKCkuZW5kc1dpdGgoJy5zdmcnKSkge1xuICAgICAgICBlcnJvck1lc3NhZ2UudGV4dENvbnRlbnQgPSAnUGxlYXNlIHNlbGVjdCBhbiBTVkcgZmlsZS4nO1xuICAgICAgICBlcnJvck1lc3NhZ2Uuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gUmVzZXQgZXJyb3IgbWVzc2FnZVxuICAgICAgZXJyb3JNZXNzYWdlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBcbiAgICAgIC8vIFJlYWQgdGhlIGZpbGVcbiAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICBcbiAgICAgIHJlYWRlci5vbmxvYWQgPSAoZSkgPT4ge1xuICAgICAgICBzdmdDb250ZW50ID0gZS50YXJnZXQucmVzdWx0O1xuICAgICAgICBmaWxlTmFtZSA9IGZpbGUubmFtZTtcbiAgICAgICAgXG4gICAgICAgIC8vIFVwZGF0ZSBVSVxuICAgICAgICBmaWxlTmFtZUVsZW1lbnQudGV4dENvbnRlbnQgPSBmaWxlTmFtZTtcbiAgICAgICAgZmlsZUluZm8uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIGNvbnZlcnRCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgIH07XG4gICAgICBcbiAgICAgIHJlYWRlci5vbmVycm9yID0gKCkgPT4ge1xuICAgICAgICBlcnJvck1lc3NhZ2UudGV4dENvbnRlbnQgPSAnRXJyb3IgcmVhZGluZyB0aGUgZmlsZS4gUGxlYXNlIHRyeSBhZ2Fpbi4nO1xuICAgICAgICBlcnJvck1lc3NhZ2Uuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICB9O1xuICAgICAgXG4gICAgICByZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcbiAgICB9XG4gICR7XCI8XCIgKyBcIi9zY3JpcHRcIn0+XG48L2JvZHk+XG48L2h0bWw+XG5gO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgY29kZTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
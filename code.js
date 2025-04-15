/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./code.ts":
/*!*****************!*\
  !*** ./code.ts ***!
  \*****************/
/***/ (function() {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Show UI
figma.showUI(__html__, { width: 400, height: 500 });
// Handle messages from the UI
figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (msg.type === 'convert-svg') {
        try {
            // Create a simple demonstration rectangle
            const rect = figma.createRectangle();
            rect.x = 100;
            rect.y = 100;
            rect.resize(200, 100);
            rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }];
            rect.name = "SVG Conversion Test";
            // Create a text node for demonstration
            const text = figma.createText();
            yield figma.loadFontAsync({ family: "Inter", style: "Regular" });
            text.x = 100;
            text.y = 220;
            text.resize(200, 50);
            text.characters = "Test from SVG";
            // Select the created objects
            figma.currentPage.selection = [rect, text];
            figma.viewport.scrollAndZoomIntoView([rect, text]);
            // Notify UI that the test was successful
            figma.ui.postMessage({
                type: 'conversion-complete'
            });
            figma.notify('Test shapes created successfully!');
        }
        catch (error) {
            // Simple error notification
            figma.ui.postMessage({
                type: 'error',
                message: 'An error occurred during the test.'
            });
            figma.notify('Error during test', { error: true });
        }
    }
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./code.ts"]();
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLFVBQVU7QUFDVixLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFFcEQsOEJBQThCO0FBQzlCLEtBQUssQ0FBQyxFQUFFLENBQUMsU0FBUyxHQUFHLENBQU8sR0FBRyxFQUFFLEVBQUU7SUFDakMsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLGFBQWEsRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQztZQUNILDBDQUEwQztZQUMxQyxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDckMsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7WUFDYixJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUNiLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsRUFBQyxDQUFDLENBQUM7WUFDMUQsSUFBSSxDQUFDLElBQUksR0FBRyxxQkFBcUIsQ0FBQztZQUVsQyx1Q0FBdUM7WUFDdkMsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ2hDLE1BQU0sS0FBSyxDQUFDLGFBQWEsQ0FBQyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7WUFDakUsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7WUFDYixJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUNiLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3JCLElBQUksQ0FBQyxVQUFVLEdBQUcsZUFBZSxDQUFDO1lBRWxDLDZCQUE2QjtZQUM3QixLQUFLLENBQUMsV0FBVyxDQUFDLFNBQVMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMzQyxLQUFLLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7WUFFbkQseUNBQXlDO1lBQ3pDLEtBQUssQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDO2dCQUNuQixJQUFJLEVBQUUscUJBQXFCO2FBQzVCLENBQUMsQ0FBQztZQUVILEtBQUssQ0FBQyxNQUFNLENBQUMsbUNBQW1DLENBQUMsQ0FBQztRQUNwRCxDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNmLDRCQUE0QjtZQUM1QixLQUFLLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQztnQkFDbkIsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsT0FBTyxFQUFFLG9DQUFvQzthQUM5QyxDQUFDLENBQUM7WUFFSCxLQUFLLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDckQsQ0FBQztJQUNILENBQUM7QUFDSCxDQUFDLEVBQUM7Ozs7Ozs7O1VFM0NGO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93b3Jrc3BhY2UvLi9jb2RlLnRzIiwid2VicGFjazovL3dvcmtzcGFjZS93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL3dvcmtzcGFjZS93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vd29ya3NwYWNlL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTaG93IFVJXG5maWdtYS5zaG93VUkoX19odG1sX18sIHsgd2lkdGg6IDQwMCwgaGVpZ2h0OiA1MDAgfSk7XG5cbi8vIEhhbmRsZSBtZXNzYWdlcyBmcm9tIHRoZSBVSVxuZmlnbWEudWkub25tZXNzYWdlID0gYXN5bmMgKG1zZykgPT4ge1xuICBpZiAobXNnLnR5cGUgPT09ICdjb252ZXJ0LXN2ZycpIHtcbiAgICB0cnkge1xuICAgICAgLy8gQ3JlYXRlIGEgc2ltcGxlIGRlbW9uc3RyYXRpb24gcmVjdGFuZ2xlXG4gICAgICBjb25zdCByZWN0ID0gZmlnbWEuY3JlYXRlUmVjdGFuZ2xlKCk7XG4gICAgICByZWN0LnggPSAxMDA7XG4gICAgICByZWN0LnkgPSAxMDA7XG4gICAgICByZWN0LnJlc2l6ZSgyMDAsIDEwMCk7XG4gICAgICByZWN0LmZpbGxzID0gW3t0eXBlOiAnU09MSUQnLCBjb2xvcjoge3I6IDEsIGc6IDAsIGI6IDB9fV07XG4gICAgICByZWN0Lm5hbWUgPSBcIlNWRyBDb252ZXJzaW9uIFRlc3RcIjtcbiAgICAgIFxuICAgICAgLy8gQ3JlYXRlIGEgdGV4dCBub2RlIGZvciBkZW1vbnN0cmF0aW9uXG4gICAgICBjb25zdCB0ZXh0ID0gZmlnbWEuY3JlYXRlVGV4dCgpO1xuICAgICAgYXdhaXQgZmlnbWEubG9hZEZvbnRBc3luYyh7IGZhbWlseTogXCJJbnRlclwiLCBzdHlsZTogXCJSZWd1bGFyXCIgfSk7XG4gICAgICB0ZXh0LnggPSAxMDA7XG4gICAgICB0ZXh0LnkgPSAyMjA7XG4gICAgICB0ZXh0LnJlc2l6ZSgyMDAsIDUwKTtcbiAgICAgIHRleHQuY2hhcmFjdGVycyA9IFwiVGVzdCBmcm9tIFNWR1wiO1xuICAgICAgXG4gICAgICAvLyBTZWxlY3QgdGhlIGNyZWF0ZWQgb2JqZWN0c1xuICAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gW3JlY3QsIHRleHRdO1xuICAgICAgZmlnbWEudmlld3BvcnQuc2Nyb2xsQW5kWm9vbUludG9WaWV3KFtyZWN0LCB0ZXh0XSk7XG4gICAgICBcbiAgICAgIC8vIE5vdGlmeSBVSSB0aGF0IHRoZSB0ZXN0IHdhcyBzdWNjZXNzZnVsXG4gICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgIHR5cGU6ICdjb252ZXJzaW9uLWNvbXBsZXRlJ1xuICAgICAgfSk7XG4gICAgICBcbiAgICAgIGZpZ21hLm5vdGlmeSgnVGVzdCBzaGFwZXMgY3JlYXRlZCBzdWNjZXNzZnVsbHkhJyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIC8vIFNpbXBsZSBlcnJvciBub3RpZmljYXRpb25cbiAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgbWVzc2FnZTogJ0FuIGVycm9yIG9jY3VycmVkIGR1cmluZyB0aGUgdGVzdC4nXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgZmlnbWEubm90aWZ5KCdFcnJvciBkdXJpbmcgdGVzdCcsIHsgZXJyb3I6IHRydWUgfSk7XG4gICAgfVxuICB9XG59O1xuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSB7fTtcbl9fd2VicGFja19tb2R1bGVzX19bXCIuL2NvZGUudHNcIl0oKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
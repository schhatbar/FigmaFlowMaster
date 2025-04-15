// Show UI
figma.showUI(__html__, { width: 400, height: 500 });

// Handle messages from the UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'convert-svg') {
    try {
      // Create a simple demonstration rectangle
      const rect = figma.createRectangle();
      rect.x = 100;
      rect.y = 100;
      rect.resize(200, 100);
      rect.fills = [{type: 'SOLID', color: {r: 1, g: 0, b: 0}}];
      rect.name = "SVG Conversion Test";
      
      // Create a text node for demonstration
      const text = figma.createText();
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
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
    } catch (error) {
      // Simple error notification
      figma.ui.postMessage({
        type: 'error',
        message: 'An error occurred during the test.'
      });
      
      figma.notify('Error during test', { error: true });
    }
  }
};

import { svgToFigmaFlowchart } from './src/figmaConverter';
import { parseSvg } from './src/svgParser';
import { handleError } from './src/errorHandler';

figma.showUI(__html__, { width: 400, height: 500 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'convert-svg') {
    try {
      // Parse the SVG content
      const parsedSvg = parseSvg(msg.svgContent);
      
      // Create a new page for the flowchart
      const page = figma.createPage();
      page.name = `Flowchart: ${msg.fileName.replace(/\.svg$/, '')}`;
      figma.currentPage = page;

      // Convert SVG to Figma flowchart
      await svgToFigmaFlowchart(parsedSvg);
      
      // Notify UI that conversion is complete
      figma.ui.postMessage({
        type: 'conversion-complete'
      });
      
      figma.notify('SVG successfully converted to flowchart!');
    } catch (error) {
      console.error(error);
      
      // Handle the error and notify UI
      const errorMsg = handleError(error);
      figma.ui.postMessage({
        type: 'error',
        message: errorMsg
      });
      
      figma.notify('Error converting SVG to flowchart', { error: true });
    }
  }
};

# SVG to Flowchart Converter - Figma Plugin

A Figma plugin that converts SVG files into interactive flowcharts while preserving element relationships and positioning.

## Features

- Upload SVG files via drag & drop or file selection
- Automatic detection of shapes, nodes, and connectors
- Preserves connections between elements
- Converts SVG elements to appropriate Figma nodes
- Creates Figma connector lines between related nodes
- Handles various SVG element types (rect, circle, ellipse, path, etc.)
- Error handling and user feedback

## How to Use

1. Install the plugin in Figma
2. Open a Figma file where you want to create a flowchart
3. Run the plugin from the Plugins menu
4. Upload an SVG file containing your flowchart or diagram
5. Click "Convert to Flowchart"
6. A new page will be created with the converted flowchart

## SVG Requirements

The plugin works best with SVG files that:
- Have clearly defined nodes (rectangles, circles, etc.)
- Use paths, lines, or polylines as connectors between nodes
- Have consistent styling for similar elements
- Include text elements for labels

## Development

This plugin is built using:
- TypeScript
- Figma Plugin API
- Webpack for bundling

### Building the Plugin

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the plugin: `npx webpack --watch`
4. Load the plugin in Figma (Plugins > Development > Import plugin from manifest)

## License

MIT License
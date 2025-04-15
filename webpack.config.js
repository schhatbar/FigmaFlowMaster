const path = require('path');

module.exports = {
  // Build mode
  mode: 'development',
  
  // Entry points for plugin code and UI
  entry: {
    code: './code.ts',
    ui: './ui.html'
  },
  
  // Output configuration
  output: {
    path: path.resolve(__dirname, './'),
    filename: '[name].js'
  },
  
  // Module rules
  module: {
    rules: [
      // TypeScript files
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      
      // HTML files
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: false
            }
          }
        ]
      }
    ]
  },
  
  // Enable inline source maps
  devtool: 'inline-source-map',
  
  // File extensions to resolve
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
};

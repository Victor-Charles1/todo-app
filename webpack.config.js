const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // 1. Entry point configuration
  entry: './src/index.js',
  
  // 2. Output configuration
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Clears dist folder before each build
  },

  // 3. Development tools
  devtool: 'inline-source-map', // For better debugging
  mode: 'development', // Switch to 'production' for final build

  // 4. Plugin configuration
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Todo List',
      template: './src/template.html', // Use custom HTML template
    }),
  ],

  // 5. Module rules (loaders)
  module: {
    rules: [
      // CSS handling
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'], // Process CSS files
      },
      // Image assets
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource', // Handle image files
      },
      // Font assets
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource', // Handle font files
      },
    ],
  },

  // 6. Development server configuration
  devServer: {
    static: './dist',
    hot: true, // Enable hot module replacement
  },
};
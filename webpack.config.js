const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  watch:true,
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
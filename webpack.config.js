const path = require('path');
module.exports = {
  mode: 'development',
  entry: ['./src/initialization.js',
    './src/prayerjar.js',
    './src/memorize.js',
    './src/index.js',
    './src/account.js',
    ],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 8080,
  }
};

const path = require('path');

const dist_node = {
  mode: "production",
  entry: {
    'linq-collections': './src/Linq.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    libraryTarget: "commonjs",
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  }
};

const dist_umd = {
  mode: "production",
  entry: {
    'linq-collections-umd': './src/Linq.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    libraryTarget: "umd",
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  }
};

const tests = {
  mode: "development",
  devtool: "source-map",
  entry: {
    'linq-collections-test': './test/TestSuite.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    libraryTarget: "commonjs",
    filename: '[name].js',
    path: path.resolve(__dirname, '')
  }
};

module.exports = [ dist_node, dist_umd, tests ];

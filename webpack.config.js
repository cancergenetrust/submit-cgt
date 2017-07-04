module.exports = {
  entry: './app.jsx',
  output: { path: __dirname, filename: 'bundle.js' },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react'],
        },
      },
    ],
  },
  devServer: {
    host: '0.0.0.0',
    port: 80,
    disableHostCheck: true,
  },
};

const glob = require('glob')
var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var MiniCssExtractPlugin = require('mini-css-extract-plugin')
// var nodeExternals = require('webpack-node-externals');
// const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var conf = require('./config/conf.js')


// 设置自定义属性
var JS_ROOT_PATH = 'src/js/pages/*.js';
var HTML_ROOT_PATH = 'src/view/';
var FONT_PATH = 'src/fonts/';
var IMG_PATH = 'src/img/';
var MEDIA_PATH = 'src/media/'
var env = process.env.NODE_ENV

var resolve = function(dir){
  return path.join(__dirname, dir)
}

// webpack 配置
var config = {
  mode: env,
  devtool: '#source-map',
  // 文件在哪里
  entry: {},
  // 文件放哪里
  output: {
    path: path.resolve('dist'),
    // publicPath: '',
    filename: env === 'production' ? 'js/[name].js?v=[chunkHash]' : 'js/[name].[hash].js',
    chunkFilename: 'js/[name].js'
  },
  // 要怎么处理模块
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          resolve('src'),
          // resolve('node_modules/webpack-dev-server/client')
        ],
        loader: 'babel-loader'
        // use: {
        //   loader: 'babel-loader',
        //   options: { presets: ['@babel/preset-es2015'] }
        // }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: IMG_PATH + '[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: MEDIA_PATH + '[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: FONT_PATH + '[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader,'css-loader','postcss-loader','sass-loader']
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader']
      }
    ]
  },
  // 模块怎么解析
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': resolve('src'),
    }
  },
  // 放插件的
  plugins: [
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new MiniCssExtractPlugin({
      filename: env === 'production' ? 'css/[name].css?v=[chunkhash]' : 'css/[name].[hash].css',
      chunkFilename: 'css/[name].[hash].css'
    }),
    // new CleanWebpackPlugin(['./dist'])
  ],
  target: 'node',
  // externals: [nodeExternals()],
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: (module, chunks) => {
            let chunkName = '';
            chunks.forEach(chunk => {
                chunkName += chunk.name + ',';
            })
            console.log(module.context, chunkName, chunks.length);
            return /node_modules/.test(module.context)
          },
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  node: {
    setImmediate: false,
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
    module: "empty",
  },
  stats: {
    modules: true,
    children: true,
    entrypoints: true,
    chunks: true
  }
}
// 配置入口文件
var entries = (function(dir){
  var filearr = glob.sync(dir)
  var resultobj = {}
  filearr.forEach(function(item){
    let arr = item.split('/')
    let name = arr[arr.length - 1].replace('.js', '')
    resultobj[name] = path.join(__dirname, item)
    let plugin = {
      filename: name + '.html',
      // favicon: './src/img/favicon.ico',
      template: resolve(HTML_ROOT_PATH+name+'.html'),
      inject: 'body',
      chunks: [name]
    }
    if(env === 'production'){
      Object.assign(plugin, {minify: {removeComments: true,collapseWhitespace: true,removeAttributeQuotes: true}})
    }
    config.plugins.push(new HtmlWebpackPlugin(plugin))
  })
  return resultobj
})(JS_ROOT_PATH)
config.entry = entries

// 区分运行环境
if(env === 'production'){
  // 生产环境

}else{
  // 开发环境
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin() // 热加载
);
  config.devServer= {
    contentBase: false,
    publicPath:'/',
    host: 'localhost',
    port: 9086, //默认8080
    overlay: true,
    inline: true, //可以监控js变化
    hot: true, //热启动
  }
}
module.exports = config
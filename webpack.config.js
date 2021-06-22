const CopyPlugin = require("copy-webpack-plugin");                              // ファイルのコピー
const ImageminPlugin = require('imagemin-webpack-plugin').default;              // 画像圧縮（jpe?g|png|gif|svg）
const ImageminMozjpeg = require('imagemin-mozjpeg');                            // jpg圧縮

// [定数] webpack の出力オプションを指定します
// 'production' か 'development' を指定
const MODE = "production";

// ソースマップの利用有無(productionのときはソースマップを利用しない)
const enabledSourceMap = MODE === "development";

module.exports = {
  // モード値を production に設定すると最適化された状態で、
  // development に設定するとソースマップ有効でJSファイルが出力される
  mode: MODE,

  // メインとなるJavaScriptファイル（エントリーポイント）
  entry: { '../_js/bundle.js': './_js/index.js' },
  // ファイルの出力設定
  output: {
    path: `${__dirname}/public`,
    filename: '[name]',
  },

  module: {
    rules: [
      // ▼ img
      {
        // 対象となるファイルの拡張子
        test: /\.(gif|png|jpg|eot|wof|woff|woff2|ttf|svg)$/,
        // test: /\.(jpe?g|png|gif|svg|ico)(\?.+)?$/, // クエリパラメータが付いていた場合でもファイルを対象にする
        use: {
          // 画像をBase64として取り込む（css-loaderのoption - url: trueと連動？）
          loader: 'url-loader',
          options: {
              // limitのbyte数以下はBase64化、以上は画像参照 ※file-loaderが必要
              limit: 8192,
              esModule: false,
              name: '[name].[ext]',
              outputPath : '',
              publicPath : function(path){
                return '../' + path;
              }
          }
        }
      },

    ],
  },

  // プラグインの設定
  plugins: [
    // ファイルをコピー
    new CopyPlugin({
      patterns: [
        {// ▼ images
          context: "./src/",
          from: "**/**",
          to: "./",
          globOptions: {
            dot: false, // .***のファイルは除外
            gitignore: false, // falseじゃないとエラーになる。
            ignore: [
              "**/*.{psd}",
              "**/datauri/**", // datauri配下は除外
            ],
          },
          noErrorOnMissing: true,  // 対象ファイルが存在しなくてもエラーにしない
        },

      ],
    }),

    // 画像圧縮
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      // png圧縮設定
      pngquant: {
        quality: '65-80',
      },
      // gif圧縮設定
      gifsicle: {
        interlaced: false,				// //
        optimizationLevel: 3,			// 1 - 3
        colors: 100								// 2 - 256
      },
      // svg圧縮設定
      svgo: {
        quality: '80',
      },
      // jpg圧縮設定（mozjpeg）
      plugins: [
        ImageminMozjpeg({
          // progressive: true,
          quality: 80
        })
      ]
    }),
  ],
};

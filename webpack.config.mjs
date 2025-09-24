import CopyPlugin from 'copy-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// [定数] webpack の出力オプションを指定します
// 'production' か 'development' を指定
const MODE = process.env.NODE_ENV || "development";

// ソースマップの利用有無(productionのときはソースマップを利用しない)
const enabledSourceMap = MODE === "development";

export default {
  // モード値を production に設定すると最適化された状態で、
  // development に設定するとソースマップ有効でJSファイルが出力される
  mode: MODE,

  // メインとなるJavaScriptファイル（エントリーポイント）
  entry: { bundle: './_js/index.js' },
  
  // ファイルの出力設定
  output: {
    path: path.join(__dirname, 'public'),
    filename: '../_js/[name].js',
    clean: false
  },

  module: {
    rules: [
      // ▼ img
      {
        // 対象となるファイルの拡張子
        test: /\.(gif|png|jpg|jpeg|eot|wof|woff|woff2|ttf|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: '[name][ext]',
          publicPath: '../',
          outputPath: ''
        },
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 8kb
          },
        },
      },
    ],
  },

  // プラグインの設定
  plugins: [
    // ファイルをコピー
    new CopyPlugin({
      patterns: [
        {
          context: "./src/",
          from: "**/*",
          to: "./",
          globOptions: {
            dot: false,
            gitignore: false,
            ignore: [
              "**/*.{psd}",
              "**/datauri/**",
            ],
          },
          noErrorOnMissing: true,
        },
      ],
    }),

    // Sharp.jsを使用した画像圧縮（MozJPEG問題を回避）
    new ImageMinimizerPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      minimizer: {
        implementation: ImageMinimizerPlugin.sharpMinify,
        options: {
          encodeOptions: {
            jpeg: {
              quality: 80,
              progressive: true,
            },
            png: {
              compressionLevel: 6,
              quality: 80,
            }
          },
        },
      },
    }),
  ],

  // ソースマップの設定
  devtool: enabledSourceMap ? 'source-map' : false,

  // ファイル変更監視の設定
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300,
    poll: 1000,
  },

  // 解決するファイルの拡張子
  resolve: {
    extensions: ['.js', '.mjs', '.json'],
  },

  // 統計情報の出力レベル
  stats: {
    children: false,
    chunks: false,
    chunkModules: false,
    modules: false,
    reasons: false,
  },
};

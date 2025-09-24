# Node.js_img-min-202106
webpackでの画像ファイル圧縮処理 ※src → public（jpg/gif/png/svg）
<br><br><br>


## このサンプル制作時の環境
◆ Macintosh
* macOS -（バージョン 10.xx.x）
* Node.js – vX.XX.XX
* npm – vX.XX.XX
<br>

◆ Windows
* Windows11、64bit
* Node.js – v22.19.0
* npm – v11.6.0
<br><br><br>


## コマンド一覧

### 🔧 Webpack（画像圧縮付き）
* **npm run watch** - 開発モード（ファイル監視 + 自動ビルド + 画像圧縮）
* **npm run build** - 本番ビルド（最適化 + 画像圧縮）

### 📸 画像圧縮のみ
* **npm run imagemin** - 画像圧縮のみ実行
* **npm run imagemin-webp** - WebP変換

### その他
* **npm run sharp1** - Sharp.js サンプル1
* **npm run sharp2** - Sharp.js サンプル2

## 機能詳細

### Webpack機能
* **JPEG圧縮**: Sharp.js使用、品質80%、プログレッシブJPEG対応
* **PNG圧縮**: Sharp.js使用、品質80%
* **リアルタイム監視**: ファイル変更を自動検出してビルド
* **MozJPEG問題**: 完全回避

### 画像圧縮機能（imagemin）
元の`imagemin.mjs`でMozJPEGのWindows環境でのエラーを修正したバージョンです。
* **JPEG圧縮**: Sharp.js使用、品質80%、プログレッシブJPEG対応
* **PNG圧縮**: PngQuant使用、品質65-80%
* **GIF圧縮**: Gifsicle使用、最適化レベル3
* **SVG圧縮**: SVGO使用、最適化処理

**圧縮効果**: 349MB → 128MB（約63.3%圧縮）
<br><br><br>









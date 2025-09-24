import imagemin from 'imagemin-keep-folder';
import imageminWebp from 'imagemin-webp';
import path from 'path';

const paths = {
  srcDir : './src',				// 処理前
  dstDir : './public'			// 処理後
}
const srcGlob = paths.srcDir + '/**/*.{jpg,png,jpeg,gif,svg,JPG,PNG,JPEG,GIF,SVG}';
const dstGlob = paths.dstDir + path.sep;

console.log('🔍 処理対象パターン:', srcGlob);
console.log('🔍 出力先ディレクトリ:', dstGlob);

imagemin([srcGlob], {
  plugins: [
    imageminWebp({quality: 75})
  ],
  replaceOutputDir: output => {
    // Windows対応のパス処理修正
    // path.normalize()を使用してパスを正規化
    const normalizedOutput = path.normalize(output);
    const normalizedSrc = path.normalize(paths.srcDir);
    const normalizedDst = path.normalize(paths.dstDir);
    
    // 相対パスから絶対パスに変換して処理
    const relativePath = path.relative(normalizedSrc, normalizedOutput);
    const targetPath = path.join(normalizedDst, relativePath);
    
    console.log(`🔄 ${normalizedOutput} → ${targetPath}`);
    return targetPath;
  }
}).then(() => {
  console.log('✅ WebP変換が完了しました！');
});

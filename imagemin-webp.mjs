import imagemin from 'imagemin-keep-folder';
import imageminWebp from 'imagemin-webp';
import path from 'path';

const paths = {
  srcDir : './src',				// 処理前
  dstDir : './public'			// 処理後
}
const srcGlob = paths.srcDir + '/**/*.{jpg,png,jpeg,gif,svg,webp,JPG,PNG,JPEG,GIF,SVG,WEBP}';
const dstGlob = paths.dstDir + path.sep;

imagemin([srcGlob], {
  plugins: [
    imageminWebp({quality: 75})
  ],
  replaceOutputDir: output => {
    // クロスプラットフォーム対応のパス処理
    const srcPattern = 'src' + path.sep;
    const dstPath = dstGlob.replace(new RegExp(path.sep.replace(/[\\]/g, '\\\\') + '$'), path.sep);
    return output.replace(new RegExp(srcPattern.replace(/[\\]/g, '\\\\')), dstPath);
  }
}).then(() => {
  console.log('Images optimized');
});

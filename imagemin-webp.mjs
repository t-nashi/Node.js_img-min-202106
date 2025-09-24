import imagemin from 'imagemin-keep-folder';
import imageminWebp from 'imagemin-webp';

const paths = {
  srcDir : './src',				// 処理前
  dstDir : './public'			// 処理後
}
const srcGlob = paths.srcDir + '/**/*.{jpg,png,jpeg,gif,svg,webp,JPG,PNG,JPEG,GIF,SVG,WEBP}';
const dstGlob = paths.dstDir + '/';

imagemin([srcGlob], {
  plugins: [
    imageminWebp({quality: 75})
  ],
  replaceOutputDir: output => {
    return output.replace(/src\//, dstGlob)
  }
}).then(() => {
  console.log('Images optimized');
});

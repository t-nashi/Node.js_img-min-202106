import imagemin from 'imagemin-keep-folder';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminSvgo from 'imagemin-svgo';

const paths = {
  srcDir : './src',				// 処理前
  dstDir : './public'		// 処理後
}
const srcGlob = paths.srcDir + '/**/*.{jpg,png,gif,svg}';
const dstGlob = paths.dstDir + '/';

imagemin([srcGlob], {
  plugins: [
    imageminMozjpeg({ quality: 80 }),
    imageminPngquant({ quality: [0.65, 0.8] }),
    imageminGifsicle({
      interlaced: false,				// //
      optimizationLevel: 3,			// 1 - 3
      colors: 100								// 2 - 256
    }),
    imageminSvgo()
  ],
  replaceOutputDir: output => {
    return output.replace(/src\//, dstGlob)
  }
}).then(() => {
  console.log('Images optimized');
});

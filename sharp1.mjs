// Node.jsライブラリsharpを使って画像の圧縮とwebp生成を自動化する https://841-biboroku.info/entry/images-optimize-sharp/
import fs from 'fs';
import fsExtra from "fs-extra"; //ファイルがあっても削除できる
import path from 'path';
import sharp from 'sharp';
import chokidar from 'chokidar';

const srcDir = './src/';
const publicDir = './public/';
const allowedExtensions = ['.jpg', '.png'];  //対象拡張子

//画像変換処理の設定
const sharpOptions = {
  'jpg' : [
    'jpg',
    {
      quality: 90,
      progressive: true
    }
  ],
  'png' : [
    'png',
    {
      quality: 80,
    }
  ]
}

//ディレイクトリ置換
const replaceFilePath = (beforeDir, afterDir, filePath) => path.join(afterDir, path.relative(beforeDir, filePath));

//webpへの拡張子置換
const replaceWebpFilePath = filePath => filePath.replace(/\.(jpg|png)$/i, '.webp');

//jpg,pngは圧縮処理、それ以外の拡張子はコピー
function optimizeImage(srcPath, destPath) {
  const extname = path.extname(srcPath).toLowerCase();

  if (allowedExtensions.includes(extname)) {
    const convertFormat = /\.png$/i.test(srcPath) ? sharpOptions.png : sharpOptions.jpg;
    sharp(srcPath)
      .toFormat(convertFormat[0])
      .toFile(destPath, (err) => {
        if (err) {
          console.error('Error processing image:', err);
        } else {
          console.log('convert iamge:', srcPath);
        }
      });
  } else {
    fs.copyFile(srcPath, destPath, (err) => {
      if (err) {
        console.error('Error copying image:', err);
      } else {
        console.log('Copied image:', srcPath);
      }
    });
  }
}

//jpg,pngをwebp変換
function convertWebp(destPath){
  const replaceExtension = replaceWebpFilePath(destPath);
  const webpFilePath = path.join(publicDir, path.relative(publicDir, replaceExtension))
  sharp(destPath)
    .webp({ quality: 85 })
    .toFile(webpFilePath)
}

//ディレクトリの監視と画像圧縮・変換の実行
const convertImages = async () => {
  // src/imagesディレクトリの監視を開始
  const srcWatcher = chokidar.watch(srcDir, {
    ignored: /(^|[\/\\])\../, // 隠しファイルを無視
    persistent: true
  });

  srcWatcher
    .on('all', (event, filePath) => {
      const targetFilePath = replaceFilePath(srcDir, publicDir, filePath);
      if( event === 'add' || event === 'change' ){
        optimizeImage(filePath, targetFilePath);
      } else if( event === 'addDir' ){
        fsExtra.ensureDirSync(targetFilePath);
      } else if( event === 'unlinkDir' ){  //フォルダ名を変更・削除したとき
        fsExtra.removeSync(targetFilePath);
      } else if( event === 'unlink' ){  //ファイルを削除したとき
        fsExtra.removeSync(targetFilePath);
      }
    })

  // public/imagesディレクトリの監視を開始
  const publicWatcher = chokidar.watch(publicDir, {
    ignored: /(^|[\/\\])\../, // 隠しファイルを無視
    persistent: true
  });

  publicWatcher
  .on('all', (event, filePath) => {
    const extension = path.extname(filePath).toLowerCase();
    if (allowedExtensions.includes(extension)) {
      if( event === 'add' || event === 'change' ){
        convertWebp(filePath);
      } else if( event === 'unlink' ){
        const removeFilePath = replaceWebpFilePath(filePath);
        if( !fs.existsSync(removeFilePath) ) return;
        fs.unlink(removeFilePath, (err) => {
          if (err) throw err;
          console.log('remove:', removeFilePath);
        })
      }
    }
  })
}

convertImages();
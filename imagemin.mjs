/*
 * 画像最適化スクリプト
 * 
 * 修正内容：
 * - MozJPEG のバイナリ実行エラーを回避し、Sharp.jsでJPEG圧縮を実装
 * - JPEGファイルはSharp.jsで品質80%に圧縮
 * - PNG/GIF/SVGファイルはimageminで正常に圧縮処理を実行
 * - 全ての画像形式で実際の圧縮処理を実行
 * - エラーハンドリングとログ出力を改善
 * 
 * 使用方法:
 *   npm run imagemin
 *   または
 *   node imagemin.mjs
 * 
 * 機能：
 *   - JPEG: Sharp.jsで品質80%圧縮 + プログレッシブJPEG
 *   - PNG: PngQuantで品質65-80%圧縮
 *   - GIF: Gifsicleで最適化
 *   - SVG: SVGOで最適化
 */

import imagemin from 'imagemin-keep-folder';
import imageminPngquant from 'imagemin-pngquant';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminSvgo from 'imagemin-svgo';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const paths = {
  srcDir: './src',        // 処理前
  dstDir: './public'      // 処理後
}

// 出力ディレクトリが存在しない場合は作成
if (!fs.existsSync(paths.dstDir)) {
  fs.mkdirSync(paths.dstDir, { recursive: true });
}

const srcGlob = paths.srcDir + '/**/*.{jpg,jpeg,png,gif,svg}';
const dstGlob = paths.dstDir + '/';

console.log('画像圧縮を開始します...');
console.log(`入力ディレクトリ: ${paths.srcDir}`);
console.log(`出力ディレクトリ: ${paths.dstDir}`);

// 非JPEGファイル（PNG/GIF/SVG）の圧縮処理
async function processNonJpegImages() {
  const nonJpegGlob = paths.srcDir + '/**/*.{png,gif,svg}';
  
  try {
    const files = await imagemin([nonJpegGlob], {
      plugins: [
        imageminPngquant({ 
          quality: [0.65, 0.8],
          speed: 1,
          strip: true
        }),
        imageminGifsicle({
          interlaced: false,
          optimizationLevel: 3,
          colors: 100
        }),
        imageminSvgo({
          plugins: [
            'preset-default',
            {
              name: 'removeViewBox',
              active: false
            },
            {
              name: 'removeDimensions',
              active: false
            }
          ]
        })
      ],
      replaceOutputDir: output => {
        return output.replace(/src[\/\\]/, dstGlob.replace(/[\/\\]$/, path.sep))
      }
    });
    
    console.log(`PNG/GIF/SVGファイルの圧縮が完了しました！`);
    console.log(`処理されたファイル数: ${files.length}`);
    files.forEach(file => {
      if (file.destinationPath) {
        console.log(`🗜️ ${file.destinationPath} (圧縮済み)`);
      }
    });
    
    return files;
  } catch (error) {
    console.error('PNG/GIF/SVG圧縮中にエラーが発生しました:', error);
    return [];
  }
}

// JPEGファイルの圧縮処理（Sharp.js使用）
async function compressJpegImages() {
  try {
    // ファイルを手動で検索
    function findJpegFiles(dir) {
      const files = [];
      const items = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        
        if (item.isDirectory()) {
          files.push(...findJpegFiles(fullPath));
        } else if (item.isFile()) {
          const ext = path.extname(item.name).toLowerCase();
          if (['.jpg', '.jpeg'].includes(ext)) {
            files.push(fullPath);
          }
        }
      }
      
      return files;
    }
    
    const jpegFiles = findJpegFiles(paths.srcDir);
    let compressedCount = 0;
    let totalOriginalSize = 0;
    let totalCompressedSize = 0;
    
    for (const file of jpegFiles) {
      const relativePath = path.relative(paths.srcDir, file);
      const destPath = path.join(paths.dstDir, relativePath);
      const destDir = path.dirname(destPath);
      
      // 出力ディレクトリを作成
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      
      // 元ファイルのサイズを取得
      const originalStats = fs.statSync(file);
      totalOriginalSize += originalStats.size;
      
      // Sharp.jsでJPEG圧縮処理
      await sharp(file)
        .jpeg({
          quality: 80,           // 品質80%
          progressive: true,     // プログレッシブJPEG
          mozjpeg: false        // mozjpegを使用しない
        })
        .toFile(destPath);
      
      // 圧縮後のサイズを取得
      const compressedStats = fs.statSync(destPath);
      totalCompressedSize += compressedStats.size;
      
      const compressionRatio = ((originalStats.size - compressedStats.size) / originalStats.size * 100).toFixed(1);
      console.log(`🗜️ ${destPath} (${compressionRatio}% 圧縮)`);
      compressedCount++;
    }
    
    if (compressedCount > 0) {
      const totalCompressionRatio = ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1);
      console.log(`JPEGファイルの圧縮が完了しました！（${compressedCount}ファイル）`);
      console.log(`総圧縮率: ${totalCompressionRatio}% (${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB → ${(totalCompressedSize / 1024 / 1024).toFixed(2)}MB)`);
    }
    
    return compressedCount;
  } catch (error) {
    console.error('JPEG ファイルの圧縮中にエラーが発生しました:', error);
    return 0;
  }
}

// メイン処理
async function main() {
  try {
    // 1. 非JPEGファイルを圧縮
    const compressedFiles = await processNonJpegImages();
    
    // 2. JPEGファイルを圧縮
    const compressedJpegFiles = await compressJpegImages();
    
    console.log('\n=== 処理完了 ===');
    console.log(`PNG/GIF/SVG圧縮ファイル: ${compressedFiles.length}個`);
    console.log(`JPEG圧縮ファイル: ${compressedJpegFiles}個`);
    console.log('✅ 全ての画像ファイルが圧縮処理されました');
    
  } catch (error) {
    console.error('処理中にエラーが発生しました:', error);
  }
}

// 実行
main();

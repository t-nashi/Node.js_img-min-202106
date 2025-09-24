// webpack エントリーポイント
console.log('Webpack watch is working!');

// 画像圧縮と監視のテスト用コード
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded. Webpack build successful.');
  
  // 簡単な初期化処理
  const body = document.body;
  if (body) {
    body.dataset.webpackStatus = 'loaded';
    console.log('Webpack status:', body.dataset.webpackStatus);
  }
});
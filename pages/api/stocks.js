import axios from 'axios';

// JQuants API エンドポイント
const REFRESH_URL = 'https://api.jquants.com/v1/token/auth_user';
const AUTH_URL = 'https://api.jquants.com/v1/token/auth_refresh';
const LISTED_URL = 'https://api.jquants.com/v1/listed/info';

// 環境変数から認証情報を取得
const JQUANTS_EMAIL = process.env.JQUANTS_EMAIL;
const JQUANTS_PASSWORD = process.env.JQUANTS_PASSWORD;

// トークン取得関数
async function getToken() {
  try {
    // 認証トークンを取得
    const refreshTokenResponse = await axios.post(REFRESH_URL, {
      mailaddress: JQUANTS_EMAIL,
      password: JQUANTS_PASSWORD
    });

    const refreshToken = refreshTokenResponse.data.refreshToken;

    // idTokenを取得
    const authResponse = await axios.post(AUTH_URL, {}, {
      params: {
        refreshtoken: refreshToken
      }
    });

    return authResponse.data.idToken;
  } catch (error) {
    console.error('Token acquisition failed:', error);
    throw new Error('JQuants API認証に失敗しました');
  }
}

// 上場銘柄一覧を取得する関数
async function getListedStocks(token) {
  try {
    const response = await axios.get(LISTED_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // 銘柄情報を取得
    const stocks = response.data.info;
    
    // 銘柄コード順にソート
    return stocks.sort((a, b) => {
      // 数値としてコードを比較
      return parseInt(a.Code) - parseInt(b.Code);
    });
  } catch (error) {
    console.error('Failed to fetch listed stocks:', error);
    throw new Error('上場銘柄情報の取得に失敗しました');
  }
}

// キャッシュ設定
let cachedStocks = null;
let cacheTime = null;
const CACHE_DURATION = 60 * 60 * 1000; // 60分（ミリ秒）

export default async function handler(req, res) {
  console.log('API request received:', req.method, req.url, new Date().toISOString());
  
  try {
    let stocks;
    
    // キャッシュが有効かチェック
    const now = Date.now();
    if (cachedStocks && cacheTime && (now - cacheTime < CACHE_DURATION)) {
      // キャッシュから取得
      stocks = cachedStocks;
      console.log('Using cached stocks data');
    } else {
      // 新しくAPIから取得
      console.log('Cache expired or not available. Fetching token...');
      const token = await getToken();
      console.log('Token fetched successfully');
      
      console.log('Fetching listed stocks...');
      stocks = await getListedStocks(token);
      console.log(`Fetched ${stocks.length} stocks successfully`);
      
      // キャッシュを更新
      cachedStocks = stocks;
      cacheTime = now;
      console.log('Cache updated with fresh data');
    }
    
    // 結果を返す
    console.log('Sending response...');
    res.setHeader('Cache-Control', 'max-age=3600, s-maxage=3600');
    res.status(200).json(stocks);
    console.log('Response sent successfully');
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: error.message });
  }
}
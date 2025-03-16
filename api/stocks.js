const axios = require('axios');

// JQuants API エンドポイント
const AUTH_URL = 'https://api.jquants.com/v1/token/auth';
const REFRESH_URL = 'https://api.jquants.com/v1/token/refresh';
const LISTED_URL = 'https://api.jquants.com/v1/listed/info';

// 環境変数から認証情報を取得
const JQUANTS_EMAIL = process.env.JQUANTS_EMAIL;
const JQUANTS_PASSWORD = process.env.JQUANTS_PASSWORD;

// トークン取得関数
async function getToken() {
  try {
    // 認証トークンを取得
    const authResponse = await axios.post(AUTH_URL, {
      mailaddress: JQUANTS_EMAIL,
      password: JQUANTS_PASSWORD
    });
    
    const idToken = authResponse.data.idToken;
    
    // リフレッシュトークンを取得
    const refreshResponse = await axios.post(REFRESH_URL, {}, {
      headers: {
        'Authorization': `Bearer ${idToken}`
      }
    });
    
    return refreshResponse.data.refreshToken;
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
    
    return response.data.info;
  } catch (error) {
    console.error('Failed to fetch listed stocks:', error);
    throw new Error('上場銘柄情報の取得に失敗しました');
  }
}

module.exports = async (req, res) => {
  try {
    // トークン取得
    const token = await getToken();
    
    // 上場銘柄一覧取得
    const stocks = await getListedStocks(token);
    
    // 結果を返す
    res.status(200).json(stocks);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: error.message });
  }
};
# JQuants上場銘柄一覧アプリ

このプロジェクトは、JQuants APIを使用して日本の上場銘柄一覧を取得し表示するNext.jsアプリケーションです。Vercelにデプロイして使用することができます。

## 機能

- JQuants APIを利用した上場銘柄情報の取得
- 銘柄コード、銘柄名、市場名、セクター名の表示
- レスポンシブデザインによる表示

## セットアップ方法

### 前提条件

- Node.js 14.x以上
- JQuantsアカウント（[こちら](https://jpx-jquants.com/)から登録可能）

### インストール

```bash
# パッケージのインストール
npm install
```

### 環境変数の設定

`.env.local`ファイルに以下の内容を設定します：

```
JQUANTS_EMAIL=あなたのJQuantsアカウントのメールアドレス
JQUANTS_PASSWORD=あなたのJQuantsアカウントのパスワード
```

実際のJQuantsアカウント情報に書き換えてください。

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くと、アプリケーションが表示されます。

## Vercelへのデプロイ

1. [Vercel](https://vercel.com/) アカウントを作成します。
2. GitHubなどにこのリポジトリをプッシュします。
3. Vercelでプロジェクトをインポートします。
4. 環境変数（`JQUANTS_EMAIL`と`JQUANTS_PASSWORD`）を設定します。
5. デプロイを実行します。

## 注意事項

- JQuants APIの利用規約に従って使用してください。
- 環境変数に設定するアカウント情報は適切に管理してください。
- このアプリケーションはデモ用であり、実際の投資判断には使用しないでください。
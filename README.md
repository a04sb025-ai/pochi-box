# POCHI BOX（ポチボックス）

「ポチッと、すぐ遊ぼ。」を合言葉にした、インストール・ログイン不要のミニゲームポータルです。スマートフォンでゲームをすばやく見つけ、1〜2タップで遊び始められます。

## ローカルで起動

静的サイトなので、リポジトリのルートで次のコマンドを実行し、`http://localhost:8000` を開きます。

```sh
python3 -m http.server 8000
```

## 新しいゲームを1本追加する

`games.js` の `window.POCHI_GAMES` 配列へオブジェクトを1件追加するだけで、カードと絞り込みへ自動反映されます。HTMLの編集は不要です。

```js
{
  id: "unique-game-id",
  title: "ゲーム名",
  url: "https://example.com/game/",
  description: "短い一言説明。",
  genre: "カジュアル",
  publishedAt: "2026-08-16",
  isNew: true,
  featured: false,
  visual: "blocks"
}
```

### ゲームデータの項目

| 項目 | 内容 |
| --- | --- |
| `id` | 履歴保存にも使う重複しない英数字ID |
| `title` | カードに表示するゲーム名 |
| `url` | ゲームの公開URL（変更すれば移転にも対応） |
| `description` | カードに表示する短い説明 |
| `genre` | ジャンル。フィルターは値から自動生成 |
| `publishedAt` | 公開日（`YYYY-MM-DD`） |
| `isNew` | `true` でNEWバッジを表示 |
| `featured` | おすすめ1本を `true` に設定 |
| `visual` | `blocks` / `breaker` / `merge` のCSSビジュアル |

新しいビジュアルを追加する場合は、`app.js` の `visualMarkup` と `styles.css` に同名のスタイルを追加します。

## GitHub Pagesで公開

GitHubの **Settings → Pages** で **Deploy from a branch** を選び、`main` ブランチのルート（`/`）を指定します。相対パスでアセットを参照しているため、プロジェクトサイト `/pochi-box/` 配下でも動作します。

## サイト構成

| ファイル | 役割 |
| --- | --- |
| `index.html` | セマンティックなページ構造とSEOメタ情報 |
| `games.js` | ゲーム情報を一元管理するデータ |
| `app.js` | カード描画、検索、絞り込み、ランダム選択、履歴 |
| `styles.css` | レスポンシブデザインとゲームビジュアル |
| `favicon.svg` / `og-image.svg` | オリジナルのブランド画像 |

「最近遊んだゲーム」はリンク選択時に端末の `localStorage` へ保存されます。サーバーやアカウントは使用しません。

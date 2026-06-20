# 光熱費管理アプリ

月別光熱費をリアルタイム共有できるWebアプリです。  
Supabase（DB）+ Vercel（ホスティング）+ GitHub（コード管理）で動作します。

---

## セットアップ手順

### 1. Supabase の準備

1. [supabase.com](https://supabase.com) でプロジェクトを作成
2. 左メニュー「SQL Editor」を開く
3. `supabase_setup.sql` の内容を貼り付けて「Run」を実行
4. 左メニュー「Project Settings」→「API」から以下をコピー
   - `Project URL`
   - `anon public` キー

### 2. GitHubにアップロード

1. GitHubで新しいリポジトリを作成（例: `konetsuhi-app`）
2. このフォルダをプッシュ:

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/あなたのユーザー名/konetsuhi-app.git
git push -u origin main
```

### 3. Vercel にデプロイ

1. [vercel.com](https://vercel.com) でGitHubリポジトリをインポート
2. 「Environment Variables」に以下を追加:

| 変数名 | 値 |
|--------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | SupabaseのProject URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabaseのanon key |

3. 「Deploy」を押すと自動でビルド・公開されます

### 4. スマートフォンで使う

- Vercelが発行したURL（例: `https://konetsuhi-app.vercel.app`）をブラウザで開く
- iPhoneなら「共有」→「ホーム画面に追加」でアプリのように使えます
- 同じURLを家族に共有すると、リアルタイムで同じデータを参照・編集できます

---

## 機能

- 月ごとの光熱費（電気・灯油・水道・電話・新聞代）入力
- 年払い費用（町内会費・NHK・固定資産税・県民済・上越メンテナンス）入力
- 総額と負担分（半額）を自動計算
- Supabase Realtimeによる複数端末のリアルタイム同期
- メモ欄（支払いURL・振込先など）
- 月ナビゲーション（過去データの参照）

---

## 技術スタック

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (PostgreSQL + Realtime)
- **Vercel** (ホスティング)

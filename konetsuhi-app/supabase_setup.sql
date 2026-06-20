-- ================================================
-- 光熱費管理アプリ — Supabase テーブルセットアップ
-- Supabase の SQL Editor に貼り付けて実行してください
-- ================================================

create table if not exists konetsuhi_records (
  id         uuid primary key default gen_random_uuid(),
  month_key  text not null unique,   -- 例: "2026-06"
  values     jsonb not null default '{}'::jsonb,
  memo       text not null default '',
  updated_at timestamptz not null default now()
);

-- インデックス
create index if not exists konetsuhi_records_month_key_idx
  on konetsuhi_records (month_key);

-- Row Level Security（RLS）— 全員が読み書きできる設定
alter table konetsuhi_records enable row level security;

create policy "allow_all_read"
  on konetsuhi_records for select using (true);

create policy "allow_all_insert"
  on konetsuhi_records for insert with check (true);

create policy "allow_all_update"
  on konetsuhi_records for update using (true);

-- Realtime を有効化
alter publication supabase_realtime add table konetsuhi_records;

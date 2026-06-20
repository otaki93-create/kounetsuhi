-- ================================================
-- 光熱費管理アプリ — Supabase テーブルセットアップ
-- Supabase の SQL Editor に貼り付けて実行してください
-- ================================================

create table if not exists konetsuhi_records (
  id         uuid primary key default gen_random_uuid(),
  month_key  text not null unique,
  values     jsonb not null default '{}'::jsonb,
  memo       text not null default '',
  status     text not null default 'draft',   -- 'draft' | 'confirmed' | 'modified'
  history    jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- すでにテーブルがある場合は列を追加
alter table konetsuhi_records add column if not exists status text not null default 'draft';
alter table konetsuhi_records add column if not exists history jsonb not null default '[]'::jsonb;

create index if not exists konetsuhi_records_month_key_idx
  on konetsuhi_records (month_key);

alter table konetsuhi_records enable row level security;

drop policy if exists "allow_all_read" on konetsuhi_records;
drop policy if exists "allow_all_insert" on konetsuhi_records;
drop policy if exists "allow_all_update" on konetsuhi_records;

create policy "allow_all_read"
  on konetsuhi_records for select using (true);
create policy "allow_all_insert"
  on konetsuhi_records for insert with check (true);
create policy "allow_all_update"
  on konetsuhi_records for update using (true);

alter publication supabase_realtime add table konetsuhi_records;

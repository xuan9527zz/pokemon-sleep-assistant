-- Pokemon Sleep 助手：每位登录用户一份云端状态。
-- 在 Supabase Dashboard -> SQL Editor 中执行一次即可。

create table if not exists public.user_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  schema_version integer not null default 1 check (schema_version > 0),
  revision bigint not null default 1 check (revision > 0),
  state jsonb not null default '{}'::jsonb check (jsonb_typeof(state) = 'object'),
  updated_at timestamptz not null default now()
);

alter table public.user_state enable row level security;
alter table public.user_state force row level security;

revoke all on table public.user_state from anon;
grant select, insert, update, delete on table public.user_state to authenticated;

drop policy if exists "user_state_select_own" on public.user_state;
create policy "user_state_select_own"
on public.user_state for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "user_state_insert_own" on public.user_state;
create policy "user_state_insert_own"
on public.user_state for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "user_state_update_own" on public.user_state;
create policy "user_state_update_own"
on public.user_state for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "user_state_delete_own" on public.user_state;
create policy "user_state_delete_own"
on public.user_state for delete
to authenticated
using ((select auth.uid()) = user_id);

comment on table public.user_state is 'Private per-user Pokemon Sleep assistant state protected by RLS.';

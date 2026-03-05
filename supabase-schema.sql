create table if not exists public.site_content (
  id text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_site_content_updated_at on public.site_content;
create trigger trg_site_content_updated_at
before update on public.site_content
for each row execute function public.set_updated_at();

alter table public.site_content enable row level security;

drop policy if exists "Public read site content" on public.site_content;
create policy "Public read site content"
on public.site_content
for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated insert site content" on public.site_content;
create policy "Authenticated insert site content"
on public.site_content
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated update site content" on public.site_content;
create policy "Authenticated update site content"
on public.site_content
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated delete site content" on public.site_content;
create policy "Authenticated delete site content"
on public.site_content
for delete
to authenticated
using (true);

insert into public.site_content (id, content)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('cadsyent-cms', 'cadsyent-cms', true)
on conflict (id) do nothing;

drop policy if exists "Public read cms objects" on storage.objects;
create policy "Public read cms objects"
on storage.objects
for select
to public
using (bucket_id = 'cadsyent-cms');

drop policy if exists "Authenticated upload cms objects" on storage.objects;
create policy "Authenticated upload cms objects"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'cadsyent-cms');

drop policy if exists "Authenticated update cms objects" on storage.objects;
create policy "Authenticated update cms objects"
on storage.objects
for update
to authenticated
using (bucket_id = 'cadsyent-cms')
with check (bucket_id = 'cadsyent-cms');

drop policy if exists "Authenticated delete cms objects" on storage.objects;
create policy "Authenticated delete cms objects"
on storage.objects
for delete
to authenticated
using (bucket_id = 'cadsyent-cms');

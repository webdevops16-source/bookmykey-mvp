-- Production schema for bookmykey-prod (Mumbai). Already applied to the live project.
create extension if not exists postgis with schema extensions;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone_number text unique,
  role text not null default 'seeker'
    check (role in ('admin','owner','seeker','agent')),
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id),
  title text not null check (char_length(title) between 5 and 150),
  description text,
  category text not null check (category in
    ('apartment','independent_house','villa','commercial','plot','pg')),
  listing_type text not null check (listing_type in ('rent','sale')),
  price numeric(14,2) not null check (price > 0),
  bhk_size integer check (bhk_size between 0 and 20),
  furnishing text check (furnishing in
    ('fully_furnished','semi_furnished','unfurnished')),
  address text not null,
  city text not null,
  locality text,
  images text[] not null default '{}',
  coordinates extensions.geography(Point, 4326),
  status text not null default 'draft'
    check (status in ('draft','active','closed')),
  is_verified boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create function public.set_updated_at()
returns trigger language plpgsql set search_path = ''
as $$ begin new.updated_at = now(); return new; end; $$;

create trigger listings_set_updated_at
  before update on public.listings
  for each row execute function public.set_updated_at();

create index listings_search_idx on public.listings (city, listing_type, category)
  where status = 'active';
create index listings_price_idx on public.listings (price) where status = 'active';
create index listings_owner_idx on public.listings (owner_id);
create index listings_coordinates_gix on public.listings using gist (coordinates);

alter table public.profiles enable row level security;
alter table public.listings enable row level security;

create policy "Read own profile" on public.profiles
  for select to authenticated using (id = (select auth.uid()));

create policy "Public reads active listings" on public.listings
  for select to anon, authenticated using (status = 'active');
create policy "Admin reads all listings" on public.listings
  for select to authenticated using (public.is_admin());
create policy "Admin inserts listings" on public.listings
  for insert to authenticated with check (public.is_admin());
create policy "Admin updates listings" on public.listings
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "Admin deletes listings" on public.listings
  for delete to authenticated using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('listing-images', 'listing-images', true, 5242880,
        array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create policy "Admin uploads listing images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'listing-images' and public.is_admin());
create policy "Admin updates listing images" on storage.objects
  for update to authenticated
  using (bucket_id = 'listing-images' and public.is_admin());
create policy "Admin deletes listing images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'listing-images' and public.is_admin());

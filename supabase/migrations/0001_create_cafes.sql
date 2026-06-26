create table if not exists cafes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  suburb text not null,
  state text not null,
  postcode text not null,
  lat double precision not null,
  lng double precision not null,
  phone text,
  website text,
  hours jsonb,
  photo_url text,
  allpress_verified boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cafes_lat_lng_idx on cafes (lat, lng);

alter table cafes enable row level security;

create policy "Public read access" on cafes
  for select
  using (true);

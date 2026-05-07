create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  email text unique not null,
  password_hash text,
  business_type text not null,
  created_at timestamptz not null default now()
);

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  type text not null check (type in ('sale', 'purchase', 'expense')),
  counterparty text not null,
  amount numeric(14, 2) not null check (amount > 0),
  category text not null,
  transaction_date date not null,
  created_at timestamptz not null default now()
);

create table if not exists blocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  block_index integer not null,
  event_type text not null,
  payload jsonb not null,
  previous_hash text not null,
  current_hash text not null,
  created_at timestamptz not null default now(),
  unique (user_id, block_index)
);

create table if not exists loans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  amount numeric(14, 2) not null,
  approved_amount numeric(14, 2) not null default 0,
  interest_rate numeric(5, 2) not null,
  term_months integer not null,
  repaid numeric(14, 2) not null default 0,
  status text not null check (status in ('approved', 'rejected', 'active', 'partially_repaid', 'repaid')),
  requested_at timestamptz not null default now()
);

create table if not exists suppliers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  name text not null,
  city text not null,
  category text not null,
  created_at timestamptz not null default now()
);

create table if not exists purchase_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  supplier_id uuid references suppliers(id) on delete set null,
  supplier_name text not null,
  amount numeric(14, 2) not null,
  items text not null,
  status text not null check (status in ('created', 'dispatched', 'in_transit', 'delivered')),
  created_at timestamptz not null default now()
);

create table if not exists shipment_events (
  id uuid primary key default gen_random_uuid(),
  purchase_order_id uuid references purchase_orders(id) on delete cascade,
  status text not null check (status in ('created', 'dispatched', 'in_transit', 'delivered')),
  location text not null,
  note text not null,
  created_at timestamptz not null default now()
);

-- Lista oczekujących na premierę — zapisy ze strony z linku w bio.
--
-- Zbieramy wyłącznie e-mail dorosłego i źródło wejścia (tiktok / instagram / x).
-- Strona pisze do tabeli kluczem `anon`, więc polityka pozwala TYLKO dopisać
-- wiersz: nikt z zewnątrz nie odczyta ani nie zmieni cudzego adresu.

create table if not exists public.waitlist (
  id          uuid primary key default gen_random_uuid(),
  email       text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 254),
  -- Skąd przyszedł zapis — parametr ?s= z linku w bio danej platformy.
  source      text check (char_length(source) <= 24),
  created_at  timestamptz not null default now()
);

-- Ten sam adres zapisuje się raz, bez względu na wielkość liter.
create unique index if not exists waitlist_email_idx on public.waitlist (lower(email));

alter table public.waitlist enable row level security;

drop policy if exists waitlist_signup on public.waitlist;
create policy waitlist_signup on public.waitlist
  for insert to anon, authenticated
  with check (true);

grant insert on public.waitlist to anon, authenticated;

-- Sama liczba zapisów, bez adresów — do poniedziałkowego raportu.
create or replace function public.waitlist_count()
returns integer
language sql
security definer
set search_path = public
as $$
  select count(*)::integer from public.waitlist;
$$;

grant execute on function public.waitlist_count() to anon, authenticated;

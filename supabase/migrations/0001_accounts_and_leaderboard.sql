-- Timo — konta rodziców, profile dzieci, postęp i ranking tygodniowy.
--
-- Model: konto zakłada dorosły (Supabase Auth, e-mail + hasło). Dziecko nie ma
-- własnego konta — jest profilem wewnątrz konta rodzica i loguje się
-- puknięciem w awatar. Dzięki temu żadne dane dziecka nie są zbierane bez
-- zgody dorosłego, a w bazie nie ma o dziecku nic poza pseudonimem i awatarem.

-- ============================================================================
-- profiles — profile dzieci pod kontem rodzica
-- ============================================================================

create table if not exists public.profiles (
  id          uuid primary key default gen_random_uuid(),
  parent_id   uuid not null references auth.users (id) on delete cascade,
  -- Imię widoczne WYŁĄCZNIE wewnątrz konta rodzica (ekran „Kto gra?").
  nick        text not null check (char_length(nick) between 1 and 24),
  avatar      text not null default '🦊',
  -- Tożsamość publiczna w rankingu: nie tekst, tylko ziarno. Pseudonim
  -- („Dzielny Jeż") wyliczają wszyscy klienci z (id, nick_variant) tą samą
  -- funkcją. Dzięki temu imienia dziecka fizycznie nie da się wpisać do
  -- publicznej tabeli — nawet przez bezpośrednie zapytanie do API.
  nick_variant integer not null default 0 check (nick_variant >= 0),
  created_at  timestamptz not null default now()
);

create index if not exists profiles_parent_idx on public.profiles (parent_id);

-- Rodzic nie zakłada dowolnie wielu profili — limit trzyma bazę w ryzach.
create or replace function public.enforce_profile_limit()
returns trigger
language plpgsql
as $$
begin
  if (select count(*) from public.profiles where parent_id = new.parent_id) >= 6 then
    raise exception 'Osiągnięto limit 6 profili na koncie.';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_limit on public.profiles;
create trigger profiles_limit
  before insert on public.profiles
  for each row execute function public.enforce_profile_limit();

-- ============================================================================
-- progress — stan gry jednego profilu (baza jest źródłem prawdy)
-- ============================================================================

create table if not exists public.progress (
  profile_id     uuid primary key references public.profiles (id) on delete cascade,
  xp             integer not null default 0 check (xp >= 0),
  paws           integer not null default 0 check (paws >= 0),
  streak         integer not null default 0 check (streak >= 0),
  daily_streak   integer not null default 0 check (daily_streak >= 0),
  last_play_date date,
  fast_wins      integer not null default 0 check (fast_wins >= 0),
  collection     text[] not null default '{}',
  badges         text[] not null default '{}',
  updated_at     timestamptz not null default now()
);

-- Każdy nowy profil dostaje od razu pusty wiersz postępu.
create or replace function public.create_progress_for_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.progress (profile_id) values (new.id);
  return new;
end;
$$;

drop trigger if exists profiles_create_progress on public.profiles;
create trigger profiles_create_progress
  after insert on public.profiles
  for each row execute function public.create_progress_for_profile();

-- ============================================================================
-- weekly_scores — ranking, jeden wiersz na profil i tydzień ISO
-- ============================================================================

create table if not exists public.weekly_scores (
  profile_id uuid not null references public.profiles (id) on delete cascade,
  week       text not null check (week ~ '^\d{4}-W\d{2}$'),
  xp         integer not null default 0 check (xp >= 0 and xp <= 20000),
  updated_at timestamptz not null default now(),
  primary key (profile_id, week)
);

create index if not exists weekly_scores_ranking_idx
  on public.weekly_scores (week, xp desc);

-- ============================================================================
-- RLS — rodzic widzi wyłącznie własne profile i ich dane
-- ============================================================================

alter table public.profiles      enable row level security;
alter table public.progress      enable row level security;
alter table public.weekly_scores enable row level security;

drop policy if exists profiles_owner on public.profiles;
create policy profiles_owner on public.profiles
  for all
  using (parent_id = auth.uid())
  with check (parent_id = auth.uid());

drop policy if exists progress_owner on public.progress;
create policy progress_owner on public.progress
  for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = progress.profile_id and p.parent_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = progress.profile_id and p.parent_id = auth.uid()
    )
  );

drop policy if exists weekly_scores_owner on public.weekly_scores;
create policy weekly_scores_owner on public.weekly_scores
  for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = weekly_scores.profile_id and p.parent_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = weekly_scores.profile_id and p.parent_id = auth.uid()
    )
  );

-- ============================================================================
-- Ranking publiczny — widok wystawia wyłącznie ziarno pseudonimu i XP.
-- Nie ma tu imienia dziecka, awatara z profilu, parent_id ani niczego, co
-- prowadzi do konta rodzica.
-- ============================================================================

create or replace view public.leaderboard_weekly
with (security_invoker = false) as
  select
    w.profile_id,
    w.week,
    w.xp,
    p.nick_variant
  from public.weekly_scores w
  join public.profiles p on p.id = w.profile_id;

revoke all on public.leaderboard_weekly from anon, authenticated;
grant select on public.leaderboard_weekly to anon, authenticated;

-- ============================================================================
-- Zapis wyniku tygodnia — wynik nigdy nie maleje.
-- ============================================================================

create or replace function public.submit_weekly_score(
  p_profile_id uuid,
  p_week text,
  p_xp integer
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.profiles
    where id = p_profile_id and parent_id = auth.uid()
  ) then
    raise exception 'Brak dostępu do tego profilu.';
  end if;

  insert into public.weekly_scores (profile_id, week, xp)
  values (p_profile_id, p_week, least(greatest(p_xp, 0), 20000))
  on conflict (profile_id, week) do update
    set xp = greatest(public.weekly_scores.xp, excluded.xp),
        updated_at = now();
end;
$$;

-- ============================================================================
-- Postęp dziecka nigdy nie maleje.
--
-- Telefon zapisywał cały wiersz `progress` swoim stanem. Gdy ten stan był
-- zerowy (zmiana dziecka bez sieci, drugie urządzenie ze starszym stanem),
-- nadpisywał postęp w bazie — dziecko traciło kolekcję, poziom i serię.
--
-- Teraz każdą zmianę wiersza scala wyzwalacz, niezależnie od tego, kto pisze
-- (także starsze wersje aplikacji, które robią zwykły UPDATE):
--   - xp, łapki, seria rund, szybkie wygrane — większa wartość,
--   - kolekcja, odznaki, odkrycia w wyprawach — suma,
--   - ukończenie wyprawy — wcześniejsza data,
--   - seria dzienna — z nowszą datą odwiedzin (po przerwie legalnie spada),
--     przy tej samej dacie większa.
-- Ta sama reguła działa w aplikacji: src/lib/progress-merge.ts.
--
-- Ręczna korekta w dół (np. z panelu) wymaga chwilowego wyłączenia wyzwalacza:
--   alter table public.progress disable trigger progress_never_decreases;
-- ============================================================================

create or replace function public.merge_text_arrays(a text[], b text[])
returns text[]
language sql
immutable
as $$
  select coalesce(array_agg(x order by first_pos), '{}')
  from (
    select x, min(pos) as first_pos
    from unnest(coalesce(a, '{}') || coalesce(b, '{}')) with ordinality as t(x, pos)
    group by x
  ) s;
$$;

create or replace function public.merge_expedition_progress(a jsonb, b jsonb)
returns jsonb
language plpgsql
immutable
as $$
declare
  merged jsonb := coalesce(a, '{}'::jsonb);
  k text;
  theirs jsonb;
  mine jsonb;
  discovered jsonb;
  completed text;
begin
  for k, theirs in select * from jsonb_each(coalesce(b, '{}'::jsonb)) loop
    mine := merged -> k;
    if mine is null then
      merged := merged || jsonb_build_object(k, theirs);
      continue;
    end if;
    select coalesce(jsonb_agg(x order by first_pos), '[]'::jsonb) into discovered
    from (
      select x, min(pos) as first_pos
      from jsonb_array_elements_text(
             coalesce(mine -> 'discovered', '[]'::jsonb) || coalesce(theirs -> 'discovered', '[]'::jsonb)
           ) with ordinality as t(x, pos)
      group by x
    ) s;
    select min(d) into completed
    from (values (mine ->> 'completed_at'), (theirs ->> 'completed_at')) v(d)
    where d is not null;
    merged := merged || jsonb_build_object(k, jsonb_build_object('discovered', discovered, 'completed_at', completed));
  end loop;
  return merged;
end;
$$;

create or replace function public.progress_never_decreases()
returns trigger
language plpgsql
as $$
begin
  new.xp        := greatest(old.xp, new.xp);
  new.paws      := greatest(old.paws, new.paws);
  new.streak    := greatest(old.streak, new.streak);
  new.fast_wins := greatest(old.fast_wins, new.fast_wins);
  new.collection := public.merge_text_arrays(old.collection, new.collection);
  new.badges     := public.merge_text_arrays(old.badges, new.badges);
  new.expedition_progress := public.merge_expedition_progress(old.expedition_progress, new.expedition_progress);

  new.daily_streak := case
    when new.last_seen_date is not distinct from old.last_seen_date
      then greatest(old.daily_streak, new.daily_streak)
    when new.last_seen_date is null then old.daily_streak
    when old.last_seen_date is null or new.last_seen_date > old.last_seen_date
      then new.daily_streak
    else old.daily_streak
  end;
  -- greatest() pomija NULL-e, więc data nigdy nie „znika”.
  new.last_seen_date := greatest(old.last_seen_date, new.last_seen_date);
  new.last_play_date := greatest(old.last_play_date, new.last_play_date);
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists progress_never_decreases on public.progress;
create trigger progress_never_decreases
  before update on public.progress
  for each row execute function public.progress_never_decreases();

-- ============================================================================
-- Zapis z aplikacji: scala przez wyzwalacz i oddaje wynik, żeby telefon
-- dostał też to, co dograło inne urządzenie.
-- ============================================================================

create or replace function public.merge_progress(p_profile_id uuid, p_progress jsonb)
returns public.progress
language plpgsql
security invoker
set search_path = public
as $$
declare
  result public.progress;
begin
  if not exists (
    select 1 from public.profiles
    where id = p_profile_id and parent_id = auth.uid()
  ) then
    raise exception 'Brak dostępu do tego profilu.';
  end if;

  update public.progress set
    xp = coalesce((p_progress ->> 'xp')::int, 0),
    paws = coalesce((p_progress ->> 'paws')::int, 0),
    streak = coalesce((p_progress ->> 'streak')::int, 0),
    daily_streak = coalesce((p_progress ->> 'daily_streak')::int, 0),
    last_play_date = nullif(p_progress ->> 'last_play_date', '')::date,
    last_seen_date = nullif(p_progress ->> 'last_seen_date', '')::date,
    fast_wins = coalesce((p_progress ->> 'fast_wins')::int, 0),
    collection = coalesce(array(select jsonb_array_elements_text(p_progress -> 'collection')), '{}'),
    badges = coalesce(array(select jsonb_array_elements_text(p_progress -> 'badges')), '{}'),
    expedition_progress = coalesce(p_progress -> 'expedition_progress', '{}'::jsonb)
  where profile_id = p_profile_id
  returning * into result;

  return result;
end;
$$;

revoke all on function public.merge_progress(uuid, jsonb) from public, anon;
grant execute on function public.merge_progress(uuid, jsonb) to authenticated;

notify pgrst, 'reload schema';

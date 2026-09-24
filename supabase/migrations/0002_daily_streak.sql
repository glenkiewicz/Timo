-- Seria dzienna liczy się od OTWARCIA aplikacji, nie od ukończonej rundy.
--
-- `last_play_date` zostaje i nadal znaczy „ostatni dzień z dograną rundą" —
-- przyda się przy dziennym limicie rund. Nowa kolumna trzyma ostatni dzień,
-- w którym dziecko w ogóle zajrzało do Timo.
--
-- Historii dni nie zapisujemy: przy twardym resecie seria jest zawsze ciągła,
-- więc odhaczone dni to dokładnie [last_seen_date - daily_streak + 1 … last_seen_date]
-- i pasek tygodnia da się z tego wyliczyć.
alter table public.progress
  add column if not exists last_seen_date date;

-- Istniejące profile nie tracą serii: dzień ostatniej rundy jest najlepszym
-- przybliżeniem dnia ostatniej wizyty.
update public.progress
   set last_seen_date = last_play_date
 where last_seen_date is null
   and last_play_date is not null;

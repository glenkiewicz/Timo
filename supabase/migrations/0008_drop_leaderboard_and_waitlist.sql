-- ============================================================================
-- Bez tablicy wyników i listy oczekujących.
--
-- Ranking tygodnia nigdy nie trafił do aplikacji (był schowany flagą), a lista
-- oczekujących ze strony przed premierą jest pusta. Aplikacja od tej wersji
-- nie wysyła wyników ani nie czyta rankingu.
--
-- Kolumna `profiles.nick_variant` (ziarno pseudonimu w rankingu) ZOSTAJE:
-- starsze wersje aplikacji czytają ją przy wczytywaniu profili i bez niej
-- ekran „Kto gra?” by się wysypał. Do usunięcia, gdy wszyscy zaktualizują.
-- ============================================================================

drop view if exists public.leaderboard_weekly;
drop function if exists public.submit_weekly_score(uuid, text, integer);
drop table if exists public.weekly_scores;

drop function if exists public.waitlist_count();
drop table if exists public.waitlist;

notify pgrst, 'reload schema';

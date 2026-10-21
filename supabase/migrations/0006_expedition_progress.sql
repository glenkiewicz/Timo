-- Postęp wypraw (odkryte zwierzęta w wyprawie, data ukończenia) — dotąd
-- tylko w telefonie i wspólny dla wszystkich dzieci: przełączenie dziecka
-- zerowało wyprawy, a nowe urządzenie zaczynało je od zera. Teraz per dziecko,
-- obok reszty postępu. Kształt: { "<expedition_id>": { "discovered": [...],
-- "completed_at": "<ISO>" | null } }.
alter table public.progress
  add column if not exists expedition_progress jsonb not null default '{}'::jsonb;

-- Odświeżenie schematu API, żeby aplikacja od razu widziała nową kolumnę.
notify pgrst, 'reload schema';

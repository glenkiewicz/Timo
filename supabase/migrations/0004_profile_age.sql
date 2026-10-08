-- Przedział wieku dziecka z onboardingu. Na razie tylko zapis — posłuży do
-- dopasowania treści. Kolumna opcjonalna: istniejące profile jej nie mają.
alter table public.profiles
  add column if not exists age_band text
  check (age_band in ('3-5', '6-8', '9+'));

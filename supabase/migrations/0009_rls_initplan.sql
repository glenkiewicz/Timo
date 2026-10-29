-- ============================================================================
-- Polityki RLS liczą auth.uid() raz na zapytanie, nie dla każdego wiersza.
--
-- Supabase Advisors (Performance, „auth_rls_initplan”): `auth.uid()` w polityce
-- jest wołane osobno dla każdego wiersza. Opakowane w `(select …)` staje się
-- jednorazowym podzapytaniem. Działanie polityk się nie zmienia.
-- ALTER POLICY zamiast DROP + CREATE — ochrona nie znika ani na chwilę.
-- ============================================================================

alter policy profiles_owner on public.profiles
  using (parent_id = (select auth.uid()))
  with check (parent_id = (select auth.uid()));

alter policy progress_owner on public.progress
  using (
    exists (
      select 1 from public.profiles p
      where p.id = progress.profile_id and p.parent_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = progress.profile_id and p.parent_id = (select auth.uid())
    )
  );

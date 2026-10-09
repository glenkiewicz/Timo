-- Usunięcie własnego konta z poziomu aplikacji — wymóg App Store
-- (wytyczna 5.1.1(v): aplikacja, w której zakłada się konto, musi pozwalać
-- je usunąć). Działa też dla konta anonimowego.
--
-- Funkcja kasuje WYŁĄCZNIE wołającego (auth.uid()). Profile dzieci, postęp
-- i wyniki tygodniowe znikają kaskadowo (on delete cascade z 0001).
-- `security definer`, bo zwykła rola nie ma prawa do schematu auth.

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Brak zalogowanego użytkownika.';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

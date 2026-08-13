# Konta, postęp i ranking

Timo używa Supabase: logowanie rodzica (Supabase Auth) oraz Postgres na postęp
gry i ranking tygodniowy. Baza jest źródłem prawdy — po zalogowaniu na nowym
urządzeniu dziecko zastaje swoją kolekcję i odznaki.

## Model kont

```
auth.users              konto rodzica (e-mail + hasło)
  └── profiles          profile dzieci: imię, awatar, nick_variant
        ├── progress    xp, tropy, seria, kolekcja, odznaki
        └── weekly_scores   wynik tygodnia ISO → ranking
```

Dziecko **nie ma własnego konta i niczego nie wpisuje** — wchodzi puknięciem
w awatar na ekranie „Kto gra?". Zgodę na przetwarzanie danych wyraża dorosły,
co jest wymogiem RODO (art. 8) i COPPA przy tej grupie wiekowej.

### Imię dziecka nigdy nie trafia do rankingu

Publiczna tabela pokazuje losowy pseudonim („Dzielny Jeż"). W bazie nie ma go
jako tekstu — `profiles.nick_variant` trzyma **liczbę**, a nazwę wylicza każdy
klient tą samą funkcją z `(profile_id, nick_variant)`. Dzięki temu imienia
dziecka nie da się wstawić do publicznego widoku nawet bezpośrednim zapytaniem
do API. Widok `leaderboard_weekly` wystawia wyłącznie `profile_id`, `week`,
`xp` i `nick_variant` — bez imienia, awatara i `parent_id`.

## Bezpieczeństwo dostępu

Wszystkie trzy tabele mają włączone RLS. Polityki sprowadzają się do jednego
warunku: `parent_id = auth.uid()`, czyli rodzic widzi i zmienia wyłącznie
własne profile oraz ich dane. Zapis wyniku idzie przez funkcję
`submit_weekly_score`, która dodatkowo sprawdza właściciela profilu i pilnuje,
żeby wynik nigdy nie malał ani nie przekroczył 20 000 XP na tydzień.

> **Uczciwość wyników.** Gra liczy XP na urządzeniu, więc baza nie jest w stanie
> zweryfikować, czy wynik powstał z faktycznej rozgrywki — może jedynie odciąć
> wartości absurdalne. Pełna odporność wymagałaby przeniesienia punktowania na
> serwer.

## Uruchomienie

1. **Załóż projekt na https://supabase.com** i skopiuj z `Project Settings → API`
   adres projektu oraz klucz `anon`.

2. **Wgraj schemat** — w panelu `SQL Editor` wklej i uruchom
   `supabase/migrations/0001_accounts_and_leaderboard.sql`.
   Alternatywnie, z zainstalowanym Supabase CLI:

   ```bash
   supabase link --project-ref <ref>
   supabase db push
   ```

3. **Uzupełnij `.env`** (wzór w `.env.example`):

   ```
   EXPO_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=<klucz anon>
   ```

   Zmienne `EXPO_PUBLIC_*` są wbudowywane w bundle, więc po ich zmianie trzeba
   zrestartować serwer dev, a do wydania — przebudować aplikację.

4. **Potwierdzanie e-maila.** Domyślnie Supabase wysyła link potwierdzający i do
   czasu kliknięcia nie ma sesji — aplikacja pokazuje wtedy ekran „Sprawdź
   skrzynkę". Na czas testów można to wyłączyć w
   `Authentication → Providers → Email → Confirm email`.

## Zachowanie offline

Gra działa bez internetu: postęp trafia najpierw do lokalnego cache'u
(AsyncStorage), a zapis do bazy idzie w tle. Nieudany zapis zostawia flagę
`dirty` i ponawia się po następnej rundzie. Wynik do rankingu czeka w
`pendingScore` i dosyła się przy kolejnym wejściu na ekran główny.

## Znane ograniczenia

- **Sesja leży w AsyncStorage**, nieszyfrowana. Dla konta rodzica w grze dla
  dzieci to akceptowalne; jeśli ma być twardziej, Supabase opisuje wzorzec
  `LargeSecureStore` (SecureStore + AES), kosztem trzech dodatkowych zależności.
- **Brak resetu hasła w aplikacji** — rodzic musi użyć linku „Reset password"
  wysyłanego przez Supabase. Ekran w aplikacji to naturalny następny krok.
- **Konto startuje od zera.** Zgodnie z ustaleniem postęp zapisany wcześniej
  lokalnie na urządzeniu nie jest przenoszony do nowego profilu.

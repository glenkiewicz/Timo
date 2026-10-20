---
name: timo-publish
description: Wysyła zatwierdzone posty Timo z danego tygodnia do harmonogramu Postiz i dopisuje je do rejestru. Użyj po tym, jak użytkownik zaakceptował posty („zatwierdzam”, „puszczaj”, „wyślij tydzień”).
---

# Wysyłka tygodnia do harmonogramu

Publikacja jest widoczna publicznie i trudna do cofnięcia, więc:

- wysyłaj **tylko** posty, które użytkownik zatwierdził w tej rozmowie — po
  identyfikatorach albo słowami „wszystkie”. Milczenie w sprawie posta to nie zgoda;
- akceptacja dotyczy jednego tygodnia. Kolejny tydzień wymaga nowej.

## Kroki

1. Ustaw statusy w `marketing/out/<tydzień>/plan.json`: `approved` dla
   zatwierdzonych, `rejected` dla odrzuconych. Reszta zostaje `draft`.
2. Próba na sucho — pokaż użytkownikowi wynik:
   `python3 scripts/marketing/postiz.py schedule marketing/out/<tydzień> --dry-run`
3. Wysyłka: to samo polecenie bez `--dry-run`. Skrypt zapisuje w planie
   identyfikatory z Postiz i status `scheduled`, więc powtórne uruchomienie
   niczego nie dubluje.
4. Dopisz wysłane posty do rejestru w `marketing/calendar.md` (tydzień, data,
   format, temat, platformy).
5. Zgłoś, co poszło do harmonogramu i na kiedy, oraz co zostało niewysłane i dlaczego.

## Gdy coś nie działa

- `brak POSTIZ_API_KEY w .env` — użytkownik musi wkleić klucz (Postiz →
  Settings → Public API). Nie szukaj klucza gdzie indziej.
- `nie ma podłączonego profilu` — `python3 scripts/marketing/postiz.py channels`
  pokaże, co jest podłączone; brakujący profil podłącza użytkownik w Postiz.
- Błąd HTTP przy poście: przeczytaj treść błędu, porównaj ustawienia providera
  w `PROVIDERS` (`scripts/marketing/postiz.py`) z
  https://docs.postiz.com/public-api/posts/create i popraw skrypt. Post, który
  się nie wysłał, zostaje `approved` — po poprawce uruchom ponownie.
- Posty z `note` o treści AI: przypomnij użytkownikowi o włączeniu etykiety
  „treść AI” w aplikacji platformy, jeśli Postiz jej nie ustawia.

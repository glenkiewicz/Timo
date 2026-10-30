#!/usr/bin/env python3
"""
Głosy Timo w innych językach — te same ustawienia co polskie
(scripts/generate-timo-voices.ts), inny `language_code` i teksty.

Głos: ELEVENLABS_VOICE_ID_<LANG> z .env (np. _EN), inaczej polski
ELEVENLABS_VOICE_ID. Polski głos po angielsku ma wschodni akcent — dla EN
zaprojektowany osobny „Timo Lisek EN” (ten sam opis postaci, akcent US).

Teksty:   content/<lang>/voice-lines.json   (kwestie, klucze jak w polskim manifeście)
          content/<lang>/animal-names.json  (nazwy zwierząt: id → nazwa), opcjonalnie
Nagrania: content/<lang>/voices/<skrót>.mp3 + __manifest.json

Nagrania NIE trafiają do aplikacji (są poza assets/) — to materiał na paczki
głosów do pobrania (docs/wersje-jezykowe.md). Skrót = głos + model + język + tekst,
więc ponowne uruchomienie generuje tylko nowe albo zmienione kwestie.

Uruchom:  python3 scripts/generate-voices-lang.py en [--only=lines|animals] [--limit=N]
"""
import hashlib
import json
import pathlib
import sys
import time
import urllib.error
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUTPUT_FORMAT = 'mp3_44100_64'  # jak polskie — 64 kb/s mono
BASE = {'stability': 0.30, 'similarity_boost': 0.75, 'style': 0.20, 'speed': 1.0}
# Kwestie i nazwy w eleven_v3 — głos EN zaprojektowano pod v3, we flash brzmi
# jak inna osoba, a nazwa leci zaraz po wstępie „…it's the…”.
LINE_MODEL = ('eleven_v3', {**BASE, 'stability': 0.5})
NAME_MODEL = LINE_MODEL
NAME_SUFFIX = '!'  # krótkie słowo bez znaku v3 czyta płasko


def env() -> dict:
    out = {}
    for line in (ROOT / '.env').read_text(encoding='utf-8').splitlines():
        if '=' in line and not line.lstrip().startswith('#'):
            k, v = line.split('=', 1)
            out[k.strip()] = v.strip().strip('"\'')
    return out


def sha12(text: str) -> str:
    return hashlib.sha256(text.encode()).hexdigest()[:12]


def tts(key: str, voice: str, lang: str, text: str, model: tuple) -> bytes:
    body = json.dumps({
        'text': text, 'model_id': model[0], 'language_code': lang, 'voice_settings': model[1],
    }).encode()
    req = urllib.request.Request(
        f'https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format={OUTPUT_FORMAT}',
        data=body,
        headers={'xi-api-key': key, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg'},
    )
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            # 429 (za szybko) i 5xx — chwila przerwy i jeszcze raz.
            if e.code in (429, 500, 502, 503) and attempt < 3:
                time.sleep(3 * (attempt + 1))
                continue
            raise SystemExit(f'HTTP {e.code}: {e.read()[:300]!r}')
    raise SystemExit('nie udało się')


def main() -> None:
    args = sys.argv[1:]
    if not args:
        raise SystemExit(__doc__)
    lang = args[0]
    only = next((a.split('=', 1)[1] for a in args if a.startswith('--only=')), None)
    limit = int(next((a.split('=', 1)[1] for a in args if a.startswith('--limit=')), '0'))

    base = ROOT / 'content' / lang
    out_dir = base / 'voices'
    out_dir.mkdir(parents=True, exist_ok=True)
    manifest_path = out_dir / '__manifest.json'
    manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}

    jobs: list[tuple[str, str, tuple]] = []
    if only in (None, 'lines'):
        for k, text in json.loads((base / 'voice-lines.json').read_text()).items():
            jobs.append((k, text, LINE_MODEL))
    names_path = base / 'animal-names.json'
    if only in (None, 'animals') and names_path.exists():
        for animal_id, name in json.loads(names_path.read_text()).items():
            jobs.append((f'animal.{animal_id}', name + NAME_SUFFIX, NAME_MODEL))

    e = env()
    key = e['ELEVENLABS_API_KEY']
    voice = e.get(f'ELEVENLABS_VOICE_ID_{lang.upper()}') or e['ELEVENLABS_VOICE_ID']
    done = skipped = 0
    for i, (vk, text, model) in enumerate(jobs, 1):
        h = sha12(f'{voice}|{model[0]}|{lang}|{text}')
        target = out_dir / f'{h}.mp3'
        if manifest.get(vk, {}).get('hash') == h and target.exists():
            skipped += 1
            continue
        if limit and done >= limit:
            break
        target.write_bytes(tts(key, voice, lang, text, model))
        manifest[vk] = {'hash': h, 'file': target.name, 'text': text}
        done += 1
        if done % 10 == 0:
            manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
        print(f'{i}/{len(jobs)} {vk}', flush=True)
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    # Pliki, na które manifest już nie wskazuje (zmieniony tekst albo głos).
    keep = {v['file'] for v in manifest.values()}
    for f in out_dir.glob('*.mp3'):
        if f.name not in keep:
            f.unlink()
    print(f'gotowe: {done} nowych, {skipped} bez zmian')


if __name__ == '__main__':
    main()

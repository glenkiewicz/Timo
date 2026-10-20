#!/usr/bin/env python3
"""
Film „Zgadnij zwierzę z Timo” — pionowe wideo 1080×1920 na TikTok i Reels.

Timo zadaje kilka pytań swoim głosem, po każdym wyskakuje odpowiedź (TAK/NIE),
widz zgaduje, odliczanie, odsłona zwierzęcia z ciekawostką i plansza końcowa.

Wszystko z gotowych plików gry — zero generacji AI:
  pytania i odpowiedzi  src/data/questions.ts + atrybuty z src/data/animals.ts
  głos                  assets/voices/<sha12(tekst)>.mp3
  lisek                 assets/timo/character/timo-*.webp (pętle z kanałem alfa)
  zwierzę i tła         assets/animals/, assets/backgrounds/

Pytania dobiera zachłannie: każde ma zawęzić pulę pasujących zwierząt mniej
więcej o połowę, a ostatnie — jak najmocniej. Pytania, na które odpowiedź
brzmi „czasem”, odpadają, bo widz nie miałby jak zgadywać.

Uruchom:  python3 scripts/marketing/make-guess-video.py <id> [<id> ...] [--out=katalog] [--questions=4]
Wynik:    <katalog>/guess-<id>.mp4 + guess-<id>.json (dane do opisu posta)
"""
import json, pathlib, subprocess, sys

from PIL import Image

import kit
from kit import UI, ROOT

W, H, FPS = 1080, 1920, 24
TIMO_SCALE = 1.2          # pętle mają 435×640
TIMO_FEET_Y = 1110        # gdzie lisek stoi na trawie
# Karty wyśrodkowane w kadrze i zwężone tak, żeby nie wchodzić pod kolumnę ikon.
CARD_W = 2 * (kit.SAFE_RIGHT - 540)
CARD_X = (1080 - CARD_W) // 2
CARD_Y, CARD_H = 1175, 190
CHIP_Y = 1400
PILL_Y = kit.SAFE_TOP + 10


def pick_questions(data, animal, count):
    """Zachłanny dobór pytań: każde zawęża pulę, ostatnie domyka."""
    pool = [a for a in data["animals"] if a["image"]]
    left = [q for q in data["questions"] if q["voice"] and animal["attributes"].get(q["attribute"]) is not None]
    picked = []
    for step in range(count):
        def after(q):
            want = animal["attributes"][q["attribute"]]
            return [a for a in pool if a["attributes"].get(q["attribute"]) in (want, None)]

        def cost(q):
            n = len(after(q))
            # Dwa pierwsze pytania zawężają łagodnie, kolejne — jak najmocniej.
            target = len(pool) * 0.45 if step < 2 else 1
            c = abs(n - target)
            # „Tak” jest ciekawszą podpowiedzią niż kolejne „nie”.
            return c * (0.8 if animal["attributes"][q["attribute"]] else 1.0)

        useful = [q for q in left if len(after(q)) < len(pool)]
        if not useful:
            break
        best = min(useful, key=cost)
        pool = after(best)
        left.remove(best)
        picked.append({**best, "answer": bool(animal["attributes"][best["attribute"]])})
    return picked, len(pool)


def duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                         capture_output=True, text=True, check=True)
    return float(out.stdout.strip())


def timo_loop(name):
    """Klatki pętli liska przeskalowane do kadru."""
    src = Image.open(ROOT / f"assets/timo/character/timo-{name}.webp")
    size = (round(src.width * TIMO_SCALE), round(src.height * TIMO_SCALE))
    frames = []
    for i in range(src.n_frames):
        src.seek(i)
        frames.append(src.convert("RGBA").resize(size, Image.LANCZOS))
    return frames


def ease_out(t):
    t = max(0.0, min(1.0, t))
    return 1 - (1 - t) ** 3


def paste_center(canvas, img, cx, cy, scale=1.0, alpha=1.0):
    if scale != 1.0:
        img = img.resize((max(1, round(img.width * scale)), max(1, round(img.height * scale))), Image.LANCZOS)
    if alpha < 1.0:
        img = img.copy()
        img.putalpha(img.getchannel("A").point(lambda v: round(v * alpha)))
    canvas.alpha_composite(img, (round(cx - img.width / 2), round(cy - img.height / 2)))


def pill(text):
    """Pasek z hasłem u góry kadru."""
    fnt = kit.font(50)
    w = min(CARD_W, round(fnt.getlength(text)) + 96)
    return kit.text_card(text, w, 104, UI["panel"], UI["panelDeep"], "#ffffff", start=50, pad=40, radius=52)


def build(data, animal, out_dir, count):
    questions, left_in_pool = pick_questions(data, animal, count)
    if len(questions) < 3:
        sys.exit(f"{animal['id']}: za mało jednoznacznych pytań ({len(questions)}) — wybierz inne zwierzę")
    fact = kit.short_fact(animal)

    # ---- plan czasowy (sekundy) i ścieżka dźwiękowa: (plik, start, głośność)
    t, audio, scenes = 0.7, [], []
    for q in questions:
        d = duration(ROOT / q["voice"])
        answer_at = t + d + 0.3
        audio.append((q["voice"], t, 1.0))
        audio.append((f"assets/sfx/answer-{'yes' if q['answer'] else 'no'}.mp3", answer_at, 0.7))
        scenes.append({"q": q, "start": t, "talk_end": t + d, "answer_at": answer_at, "end": answer_at + 1.0})
        t = answer_at + 1.0
    count_at = t
    for i in range(3):
        audio.append(("assets/sfx/tap.mp3", count_at + i * 0.7, 0.8))
    reveal_at = count_at + 2.1
    audio.append(("assets/sfx/new-animal.mp3", reveal_at, 0.7))
    audio.append((animal["nameVoice"], reveal_at + 0.45, 1.0))
    outro_at = reveal_at + 3.8
    total = outro_at + 2.4

    # ---- warstwy stałe
    bg_game = kit.backdrop("game-forest").convert("RGBA")
    bg_reveal = kit.backdrop(kit.habitat_backdrop(animal)).convert("RGBA")
    loops = {n: timo_loop(n) for n in ("idle", "talk", "wave")}
    pills = {k: pill(v) for k, v in (("hook", "Zgadniesz zwierzę przed Timo?"), ("count", "Już wiesz?"),
                                     ("reveal", "To było…"))}
    q_cards = [kit.text_card(s["q"]["text"], CARD_W, CARD_H, UI["surface"], UI["line"], UI["text"], start=58)
               for s in scenes]
    chips = {True: kit.text_card("TAK", 300, 104, UI["primary"], UI["primaryDeep"], "#ffffff", start=60, pad=24, radius=52),
             False: kit.text_card("NIE", 300, 104, UI["danger"], UI["dangerDeep"], "#ffffff", start=60, pad=24, radius=52)}
    digits = [kit.text_card(str(n), 260, 260, UI["fox"], UI["foxDeep"], "#ffffff", start=170, pad=30, radius=130)
              for n in (3, 2, 1)]
    dot_on, dot_off = kit.card(26, 26, UI["fox"], None, 13, 0), kit.card(26, 26, "#ffffff", None, 13, 0)

    art = kit.animal_art(animal, 620)
    plate = kit.card(720, 720, UI["page"], UI["sand"], 90)
    name_card = kit.text_card(animal["name"], CARD_W, 150, UI["fox"], UI["foxDeep"], "#ffffff", start=92)
    fact_card = kit.text_card(fact, CARD_W, 250, UI["surface"], UI["line"], UI["text"], kind="body", start=48)

    outro_title = kit.text_card("Timo", CARD_W, 150, UI["fox"], UI["foxDeep"], "#ffffff", start=104)
    outro_sub = kit.text_card("Gra w zgadywanie zwierząt dla dzieci", CARD_W, 150, UI["surface"], UI["line"],
                              UI["text"], start=48)
    outro_soon = kit.text_card("Wkrótce w App Store i Google Play", CARD_W, 110, UI["panel"], UI["panelDeep"],
                               "#ffffff", kind="bold", start=38, radius=52)

    cx = CARD_X + CARD_W / 2

    def timo(canvas, name, n):
        frame = loops[name][n % len(loops[name])]
        canvas.alpha_composite(frame, (round(cx - frame.width / 2), TIMO_FEET_Y - frame.height))

    def top_pill(canvas, key):
        p = pills[key]
        canvas.alpha_composite(p, (round(cx - p.width / 2), PILL_Y))

    def frame_at(n):
        now = n / FPS
        if now >= outro_at:  # plansza końcowa
            c = bg_game.copy()
            timo(c, "wave", n)
            k = ease_out((now - outro_at) / 0.35)
            for img, y in ((outro_title, 1180), (outro_sub, 1350), (outro_soon, 1500)):
                paste_center(c, img, cx, y + (1 - k) * 40 + img.height / 2 - 60, alpha=k)
            return c
        if now >= reveal_at:  # odsłona
            c = bg_reveal.copy()
            top_pill(c, "reveal")
            k = ease_out((now - reveal_at) / 0.4)
            paste_center(c, plate, cx, 730, scale=0.85 + 0.15 * k, alpha=k)
            paste_center(c, art, cx, 720, scale=0.7 + 0.3 * k, alpha=k)
            k2 = ease_out((now - reveal_at - 0.35) / 0.35)
            paste_center(c, name_card, cx, 1180 + (1 - k2) * 30, alpha=k2)
            k3 = ease_out((now - reveal_at - 1.3) / 0.4)
            paste_center(c, fact_card, cx, 1400 + (1 - k3) * 30, alpha=k3)
            return c
        c = bg_game.copy()
        if now >= count_at:  # odliczanie
            top_pill(c, "count")
            timo(c, "idle", n)
            i = min(2, int((now - count_at) / 0.7))
            k = ease_out(((now - count_at) - i * 0.7) / 0.2)
            paste_center(c, digits[i], cx, 1320, scale=0.6 + 0.4 * k)
            return c
        top_pill(c, "hook")
        idx = next((i for i, s in enumerate(scenes) if now < s["end"]), len(scenes) - 1)
        s = scenes[idx]
        talking = s["start"] <= now < s["talk_end"]
        timo(c, "talk" if talking else "idle", n)
        if now >= s["start"] - 0.25:
            k = ease_out((now - (s["start"] - 0.25)) / 0.25)
            paste_center(c, q_cards[idx], cx, CARD_Y + q_cards[idx].height / 2 + (1 - k) * 40, alpha=k)
            for i in range(len(scenes)):
                dot = dot_on if i <= idx else dot_off
                c.alpha_composite(dot, (round(cx - len(scenes) * 22 + i * 44 + 9), CARD_Y - 42))
        if now >= s["answer_at"]:
            k = ease_out((now - s["answer_at"]) / 0.22)
            chip = chips[s["q"]["answer"]]
            paste_center(c, chip, cx, CHIP_Y + chip.height / 2, scale=0.5 + 0.5 * k)
        return c

    # ---- render: klatki idą rurą do ffmpeg, dźwięk miksowany w tym samym przebiegu
    out_dir.mkdir(parents=True, exist_ok=True)
    out = out_dir / f"guess-{animal['id']}.mp4"
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
           "-r", str(FPS), "-i", "-"]
    mix = []
    for i, (path, start, vol) in enumerate(audio, 1):
        cmd += ["-i", str(ROOT / path)]
        mix.append(f"[{i}:a]adelay={round(start * 1000)}:all=1,volume={vol}[a{i}]")
    graph = ";".join(mix) + ";" + "".join(f"[a{i}]" for i in range(1, len(audio) + 1))
    graph += f"amix=inputs={len(audio)}:normalize=0,apad[aout]"
    cmd += ["-filter_complex", graph, "-map", "0:v", "-map", "[aout]", "-t", f"{total:.3f}",
            "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-b:a", "192k", "-ar", "44100", "-movflags", "+faststart", str(out)]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for n in range(round(total * FPS)):
        proc.stdin.write(frame_at(n).convert("RGB").tobytes())
    proc.stdin.close()
    if proc.wait() != 0:
        sys.exit(f"ffmpeg zakończył się błędem dla {animal['id']}")

    # Dane do opisu posta — agent pisze z nich podpis, niczego nie dopowiada.
    meta = {"format": "guess", "animal": animal["id"], "name": animal["name"], "fact": fact,
            "questions": [{"text": q["text"], "answer": "tak" if q["answer"] else "nie"} for q in questions],
            "matching_animals_after_questions": left_in_pool, "duration_s": round(total, 1),
            "file": str(out.relative_to(ROOT))}
    out.with_suffix(".json").write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{out.relative_to(ROOT)}  {total:.1f}s  pytania: "
          + " | ".join(f"{q['text']} → {'TAK' if q['answer'] else 'NIE'}" for q in questions)
          + f"  (pasuje jeszcze {left_in_pool})")


def main():
    ids = [a for a in sys.argv[1:] if not a.startswith("--")]
    opts = dict(a[2:].split("=", 1) for a in sys.argv[1:] if a.startswith("--") and "=" in a)
    if not ids:
        sys.exit(__doc__)
    data = kit.load_data()
    out_dir = pathlib.Path(opts.get("out", "marketing/out/_test"))
    out_dir = out_dir if out_dir.is_absolute() else ROOT / out_dir
    for animal_id in ids:
        build(data, kit.animal_by_id(data, animal_id), out_dir, int(opts.get("questions", 4)))


if __name__ == "__main__":
    main()

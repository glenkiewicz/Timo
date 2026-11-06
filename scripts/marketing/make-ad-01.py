#!/usr/bin/env python3
"""
Reklama TikTok nr 1 — „Timo zgaduje delfina” (1080×1920, ~29 s).

Układ:
  1. 3D (AI): Timo podnosi lupę, kamera wjeżdża w szkło        hook-push.mp4
  2. przejście kołem z lupy → telefon z PRAWDZIWĄ grą na rozmytej plaży
  3. runda: morze? nogi? … „Mam! Czy to… delfin?” → „Udało się!” → karta delfina
  4. przejście (zoom) → 3D (AI): Timo cieszy się, za nim skacze delfin   outro.mp4
  5. plansza: ikona, nazwa, znaczek App Store na rozmytej ostatniej klatce

Nad telefonem krótkie hasła o tym, co daje gra (TEXTS): duże litery bez tła,
druga linia lisim pomarańczem, łagodny wjazd od dołu.

Nagranie rec2 zrobione z tymczasowo ustawionymi kwestiami (guess_intro.5 „Mam! Czy
to…”, victory.1) — automat odpowiadał po tym, jak Timo skończył mówić.

Dźwięk gry: symulator nagrywa sam obraz, więc składamy go z oryginalnych plików
według logu [REC] (`rec/events.txt`, czasy Date.now() względem startu nagrywania).
Obraz = log − OFFSET. OFFSET zmierzony klatka po klatce: stuknięcie odpowiedzi
(efekt answer-*) i zmiana dymka: 1,96 s (10 odpowiedzi, rozrzut ±0,01 s),
plus 60 ms na ciszę na początku plików efektów. Wybrane fragmenty zaczynają się razem
z głosem, żeby tekst w dymku zawsze zgadzał się z tym, co mówi Timo.

Wejście: marketing/out/ad-01/{hook-push.mp4, hook-still.png, outro.mp4, rec2/game.mp4, rec2/events.txt}
Wyjście: marketing/out/ad-01/timo-ad-01.mp4

Uruchom:  python3 scripts/marketing/make-ad-01.py
"""
import pathlib, re, subprocess, sys

from PIL import Image, ImageDraw, ImageFilter

sys.path.insert(0, str(pathlib.Path(__file__).parent))
import kit  # noqa: E402

ROOT = kit.ROOT
D = ROOT / "marketing/out/ad-01"
REC = D / "rec2"
TMP = D / "build"
W, H, FPS = 1080, 1920, 30
OFFSET = 2.02   # 1,96 zmierzone + 60 ms ciszy na początku plików efektów
MUSIC = ROOT / "marketing/promo/audio/music-1.mp3"
SFX = ROOT / "assets/sfx"
BADGE_SVG = ROOT / "site/assets/img/app-store-badge-pl.svg"
ICON = ROOT / "assets/images/icon.png"
VOICE_MANIFEST = ROOT / "src/data/voice-manifest.ts"

# Fragmenty rundy w czasie logu. Każdy zaczyna się tuż przed głosem albo stuknięciem.
GAME_SPANS = [
    (466.60, 468.30),  # „Czy spotkasz je w morzu?”
    (469.60, 471.85),  # Tak → „Morski trop! Ahoj!”
    (474.70, 476.85),  # „Czy twoje zwierzę ma nogi?” (bez wstępu „Tupu, tupu!”)
    (478.15, 480.20),  # Nie → „Żadnych nóżek. Skreślam.”
    (504.15, 506.85),  # „Czy łapie inne zwierzęta, żeby je zjeść?”
    (508.10, 512.40),  # Tak → „Mhm!” → „Mam! Czy to… delfin?”
    (514.05, 518.30),  # „TAK, TO DELFIN!” → „Udało się! Jesteśmy świetną drużyną.”
    (527.30, 530.30),  # karta delfina: „O zwierzęciu” i „Czy wiesz?” (wcześniej przenikanie z ekranem wyniku)
]

# Hasła: (od, do) w sekundach, dwie linie. „hook” — od początku filmu, „game” — od wejścia telefonu.
TEXTS = [
    ("hook", 0.3, 3.2, "Pomyśl o zwierzęciu.", "Timo je zgadnie!"),
    ("game", 0.4, 4.0, "Dziecko myśli o zwierzęciu,", "Timo zadaje pytania"),
    ("game", 4.2, 8.1, "Ćwiczy opisywanie:", "gdzie żyje, jak wygląda"),
    ("game", 8.3, 15.0, "Timo mówi głosem —", "czytanie niepotrzebne"),
    ("game", 15.2, 19.3, "Każde odkryte zwierzę", "trafia do kolekcji"),
    ("game", 19.5, 23.0, "715 zwierząt", "i ciekawostki o każdym"),
]
TEXT_Y = 215        # góra bloku haseł (bezpieczna strefa TikToka zaczyna się na 200)

HOOK_START = 1.0    # pomijamy spokojny początek — od razu ruch
HOOK_LEN = 3.8      # ile z hook-push.mp4 (kończy się soczewką na cały kadr)
X_IN = 0.7          # koło z lupy → telefon
X_OUT = 0.5         # telefon → finał (zoom)
OUTRO_SRC = 1.85    # ile z outro.mp4 — dalej Timo kuca i gogle zjeżdżają na oczy
OUTRO_SLOW = 1.5    # lekkie zwolnienie skoku delfina
OUTRO_LEN = OUTRO_SRC * OUTRO_SLOW
X_END = 0.5
END_LEN = 2.2

# telefon: ekran 570×1240 (proporcje nagrania 1080×2348), ramka 20 px, nad nim miejsce na hasła
SW, SH = 570, 1240
SX, SY = (W - SW) // 2, 480
BEZEL = 20
SCREEN_R, BODY_R = 82, 100


def run(cmd):
    subprocess.run([str(c) for c in cmd], check=True)


def duration(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                       capture_output=True, text=True)
    return float(r.stdout)


# ---------- dźwięk gry z logu ----------

def events():
    vf = dict(re.findall(r'"([^"]+)":\s*"([0-9a-f]{12})"', VOICE_MANIFEST.read_text(encoding="utf-8")))
    out = []
    for line in (REC / "events.txt").read_text().splitlines():
        t, kind, key = line.split()
        f = ROOT / "assets/voices" / f"{vf[key]}.mp3" if kind == "voice" else SFX / f"{key}.mp3"
        out.append((float(t), kind, f))
    return out


def log_audio():
    """Cała oś logu: każdy głos ucięty, gdy zaczyna się następny (jak TimoVoice)."""
    ev = events()
    voices = [t for t, k, _ in ev if k == "voice"]
    length = max(t for t, _, _ in ev) + 6
    inputs, chains = [], []
    for i, (t, kind, f) in enumerate(ev):
        dur = duration(f)
        if kind == "voice":
            nxt = [v for v in voices if v > t]
            if nxt:
                dur = min(dur, nxt[0] - t)
        gain = 0 if kind == "voice" else 5
        inputs += ["-i", f]
        ms = int(t * 1000)
        chains.append(f"[{i}:a]atrim=0:{dur:.3f},afade=t=out:st={max(0, dur - 0.05):.3f}:d=0.05,volume={gain}dB,"
                      f"adelay={ms}|{ms},aformat=channel_layouts=stereo:sample_rates=44100[a{i}]")
    mix = "".join(f"[a{i}]" for i in range(len(ev)))
    out = TMP / "log-audio.wav"
    run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex",
         ";".join(chains) + f";{mix}amix=inputs={len(ev)}:normalize=0,apad,atrim=0:{length:.2f}[o]",
         "-map", "[o]", out])
    return out


# ---------- grafiki ----------

def cover(im):
    """Kadruje obraz do 1080×1920 (wypełnienie)."""
    s = max(W / im.width, H / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    x, y = (im.width - W) // 2, (im.height - H) // 2
    return im.crop((x, y, x + W, y + H))


def blurred(src, darken=0.82, radius=28):
    im = cover(Image.open(src).convert("RGB")).filter(ImageFilter.GaussianBlur(radius))
    return Image.eval(im, lambda v: int(v * darken))


def phone_assets():
    """Ramka telefonu (z cieniem) i maska zaokrąglonego ekranu."""
    frame = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    bx0, by0 = SX - BEZEL, SY - BEZEL
    bx1, by1 = SX + SW + BEZEL, SY + SH + BEZEL
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle((bx0 + 10, by0 + 30, bx1 - 10, by1 + 40), BODY_R, fill=(0, 0, 0, 140))
    frame = Image.alpha_composite(frame, shadow.filter(ImageFilter.GaussianBlur(30)))
    d = ImageDraw.Draw(frame)
    # przyciski boczne
    for y0, y1 in [(by0 + 230, by0 + 290), (by0 + 320, by0 + 420), (by0 + 440, by0 + 540)]:
        d.rounded_rectangle((bx0 - 7, y0, bx0 + 4, y1), 4, fill="#2b2b2e")
    d.rounded_rectangle((bx1 - 4, by0 + 360, bx1 + 7, by0 + 500), 4, fill="#2b2b2e")
    # obudowa: metalowy rant + czarna ramka
    d.rounded_rectangle((bx0, by0, bx1, by1), BODY_R, fill="#4a4a4f")
    d.rounded_rectangle((bx0 + 5, by0 + 5, bx1 - 5, by1 - 5), BODY_R - 5, fill="#0d0d0f")
    # wycięcie na ekran
    hole = Image.new("L", (W, H), 0)
    ImageDraw.Draw(hole).rounded_rectangle((SX, SY, SX + SW, SY + SH), SCREEN_R, fill=255)
    a = frame.getchannel("A")
    a.paste(0, mask=hole)
    frame.putalpha(a)
    fp = TMP / "phone-frame.png"
    frame.save(fp)
    mask = Image.new("L", (SW, SH), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, SW - 1, SH - 1), SCREEN_R, fill=255)
    mp = TMP / "screen-mask.png"
    mask.save(mp)
    return fp, mp


def title_png(n, line1, line2):
    """Hasło: biała linia + pomarańczowa, gruby ciemny obrys i miękki cień, bez tła."""
    im = Image.new("RGBA", (W, 260), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    # obie linie mieszczą się w 880 px (bezpieczna strefa TikToka: do 940 px)
    s1, s2 = 64, 78
    while max(d.textlength(line1, font=kit.font(s1, "head")), d.textlength(line2, font=kit.font(s2, "head"))) > 880:
        s1, s2 = s1 - 2, s2 - 2
    f1, f2 = kit.font(s1, "head"), kit.font(s2, "head")
    rows = [(line1, f1, "white", 10), (line2, f2, kit.UI["fox"], 96)]
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0))
    ds = ImageDraw.Draw(sh)
    for text, f, _, y in rows:
        x = (W - d.textlength(text, font=f)) / 2
        ds.text((x, y + 8), text, font=f, fill=(0, 0, 0, 150), stroke_width=8, stroke_fill=(0, 0, 0, 150))
    im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(9)))
    d = ImageDraw.Draw(im)
    for text, f, col, y in rows:
        x = (W - d.textlength(text, font=f)) / 2
        d.text((x, y), text, font=f, fill=col, stroke_width=7, stroke_fill="#3a2614")
    out = TMP / f"title-{n}.png"
    im.save(out)
    return out


def badge():
    run(["qlmanage", "-t", "-s", "1200", "-o", TMP, BADGE_SVG])
    raw = Image.open(TMP / f"{BADGE_SVG.name}.png").convert("RGBA")
    bb = Image.eval(raw.convert("L"), lambda v: 255 - v).point(lambda v: 255 if v > 8 else 0).getbbox()
    im = raw.crop(bb)
    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, im.width - 1, im.height - 1), int(im.height * 0.2), fill=255)
    im.putalpha(mask)
    return im


def end_card(last_frame):
    bg = blurred(last_frame, darken=0.7, radius=22).convert("RGBA")
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    icon = Image.open(ICON).convert("RGBA").resize((300, 300), Image.LANCZOS)
    m = Image.new("L", icon.size, 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, 299, 299), 68, fill=255)
    icon.putalpha(m)
    y = 520
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle(((W - 300) // 2, y + 14, (W + 300) // 2, y + 314), 68, fill=(0, 0, 0, 110))
    layer = Image.alpha_composite(layer, sh.filter(ImageFilter.GaussianBlur(18)))
    layer.paste(icon, ((W - 300) // 2, y), icon)
    d = ImageDraw.Draw(layer)
    y += 360
    for text, fnt in [("Timo — zgadnij zwierzę!", kit.font(82, "head")),
                      ("Zagadki o zwierzętach dla dzieci", kit.font(46, "body")),
                      ("Bez reklam i czatów", kit.font(46, "body"))]:
        tw = d.textlength(text, font=fnt)
        x = (W - tw) / 2
        d.text((x + 3, y + 4), text, font=fnt, fill=(0, 0, 0, 120))
        d.text((x, y), text, font=fnt, fill="white")
        y += 112 if fnt.size == 82 else 62
    b = badge()
    b = b.resize((560, int(560 * b.height / b.width)), Image.LANCZOS)
    layer.paste(b, ((W - b.width) // 2, y + 50), b)
    out = TMP / "end.png"
    Image.alpha_composite(bg, layer).convert("RGB").save(out)
    return out


# ---------- sceny ----------

def game_cut(audio):
    """Wybrane fragmenty rundy sklejone w jeden klip 1080×2348 z dźwiękiem z logu."""
    parts = []
    for k, (a, b) in enumerate(GAME_SPANS):
        out = TMP / f"g{k}.mov"
        dur = b - a
        run(["ffmpeg", "-v", "error", "-y",
             "-ss", f"{a - OFFSET:.3f}", "-t", f"{dur:.3f}", "-i", REC / "game.mp4",
             "-ss", f"{a:.3f}", "-t", f"{dur:.3f}", "-i", audio,
             "-filter_complex", f"[0:v]fps={FPS},format=yuv420p,setsar=1[v];"
                                f"[1:a]afade=t=in:d=0.03,afade=t=out:st={dur - 0.05:.3f}:d=0.05[a]",
             "-map", "[v]", "-map", "[a]", "-t", f"{dur:.3f}",
             "-c:v", "libx264", "-preset", "medium", "-crf", "14", "-c:a", "pcm_s16le", "-ar", "44100", out])
        parts.append(out)
    lst = TMP / "game-parts.txt"
    lst.write_text("".join(f"file '{p}'\n" for p in parts))
    out = TMP / "game-cut.mov"
    run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", out])
    return out


def phone_scene(game):
    """Telefon z grą na rozmytej plaży; telefon wjeżdża od dołu przez pierwsze 0,7 s."""
    bg = TMP / "phone-bg.png"
    blurred(D / "hook-still.png").save(bg)
    frame, mask = phone_assets()
    dur = duration(game)
    out = TMP / "phone.mov"
    graph = (
        f"[1:v]scale={SW}:{SH}:flags=lanczos,format=rgba[s];[2:v]format=gray[m];[s][m]alphamerge[sm];"
        f"color=c=black@0:s={W}x{H}:r={FPS}:d={dur:.3f},format=rgba[c];"
        f"[c][sm]overlay={SX}:{SY}[c1];[c1][3:v]overlay=0:0[ph];"
        f"[0:v]scale={W}:{H},zoompan=z='1+0.0004*on':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s={W}x{H}:fps={FPS}[bg];"
        f"[bg][ph]overlay=0:'if(lt(t,0.7),520*pow(1-t/0.7,3),0)':shortest=1,format=yuv420p,setsar=1[v]"
    )
    run(["ffmpeg", "-v", "error", "-y", "-loop", "1", "-framerate", FPS, "-t", f"{dur:.3f}", "-i", bg,
         "-i", game, "-loop", "1", "-i", mask, "-loop", "1", "-i", frame,
         "-filter_complex", graph, "-map", "[v]", "-map", "1:a", "-t", f"{dur:.3f}",
         "-c:v", "libx264", "-preset", "medium", "-crf", "15", "-c:a", "pcm_s16le", out])
    return out, dur


def main():
    TMP.mkdir(parents=True, exist_ok=True)
    game = game_cut(log_audio())
    phone, gdur = phone_scene(game)

    last = TMP / "outro-last.png"
    run(["ffmpeg", "-v", "error", "-y", "-ss", f"{OUTRO_SRC - 0.05:.2f}", "-i", D / "outro.mp4",
         "-frames:v", "1", last])
    end = end_card(last)

    # oś czasu
    t_phone = HOOK_LEN - X_IN
    t_outro = t_phone + gdur - X_OUT
    t_end = t_outro + OUTRO_LEN - X_END
    total = t_end + END_LEN

    norm = f"fps={FPS},scale={W}:{H},format=yuv420p,setsar=1,settb=AVTB"
    v = (f"[0:v]trim={HOOK_START}:{HOOK_START + HOOK_LEN},setpts=PTS-STARTPTS,{norm}[h];"
         f"[1:v]{norm}[p];"
         f"[2:v]trim=0:{OUTRO_SRC},setpts={OUTRO_SLOW}*(PTS-STARTPTS),minterpolate=fps={FPS}:mi_mode=blend,{norm}[o];"
         f"[3:v]{norm},trim=0:{END_LEN},setpts=PTS-STARTPTS[e];"
         f"[h][p]xfade=transition=circleopen:duration={X_IN}:offset={HOOK_LEN - X_IN:.3f}[x1];"
         f"[x1][o]xfade=transition=zoomin:duration={X_OUT}:offset={t_outro:.3f}[x2];"
         f"[x2][e]xfade=transition=fade:duration={X_END}:offset={t_end:.3f},"
         f"fade=t=out:st={total - 0.35:.3f}:d=0.35[vb]")
    # hasła: wjazd 40 px od dołu i rozjaśnienie w 0,3 s, zniknięcie w 0,25 s
    title_inputs, last = [], "vb"
    for n, (where, a0, a1, l1, l2) in enumerate(TEXTS):
        t0 = a0 + (t_phone if where == "game" else 0)
        t1 = min(a1 + (t_phone if where == "game" else 0), t_outro + 0.1)
        title_inputs += ["-loop", "1", "-framerate", FPS, "-t", f"{t1 - t0:.3f}", "-i", title_png(n, l1, l2)]
        k = 9 + n
        v += (f";[{k}:v]format=rgba,fade=t=in:d=0.3:alpha=1,fade=t=out:st={t1 - t0 - 0.25:.3f}:d=0.25:alpha=1,"
              f"setpts=PTS-STARTPTS+{t0:.3f}/TB[t{n}];"
              f"[{last}][t{n}]overlay=0:'{TEXT_Y}+40*pow(max(0,1-(t-{t0:.3f})/0.3),2)':"
              f"enable='between(t,{t0:.3f},{t1:.3f})'[w{n}]")
        last = f"w{n}"
    v += f";[{last}]null[v]"

    # muzyka głośniej w 3D, ciszej pod grą; efekty na przejściach
    duck = f"if(between(t,{t_phone + 0.4:.2f},{t_outro + 0.2:.2f}),0.09,0.26)"

    def at(i, t, gain):
        ms = int(t * 1000)
        return f"[{i}:a]volume={gain}dB,adelay={ms}|{ms},aformat=channel_layouts=stereo:sample_rates=44100[s{i}]"

    a = (f"[4:a]aloop=loop=-1:size=2e9,atrim=0:{total:.2f},volume='{duck}':eval=frame,"
         f"afade=t=in:d=0.4,afade=t=out:st={total - 1.2:.2f}:d=1.2,aformat=channel_layouts=stereo:sample_rates=44100[m];"
         f"[1:a]adelay={int(t_phone * 1000)}|{int(t_phone * 1000)},aformat=channel_layouts=stereo:sample_rates=44100[g];"
         + at(5, t_phone - 0.25, -2) + ";"    # whoosh na wejście w lupę
         + at(6, t_outro - 0.1, -2) + ";"     # whoosh na wyjście
         + at(7, t_outro + 0.6, -6) + ";"     # fanfara przy skoku delfina
         + at(8, t_end + 0.1, -4) + ";"       # pop na planszę
         f"[m][g][s5][s6][s7][s8]amix=inputs=6:normalize=0,atrim=0:{total:.2f},alimiter=limit=0.9[a]")

    out = D / "timo-ad-01.mp4"
    run(["ffmpeg", "-v", "error", "-y",
         "-i", D / "hook-push.mp4", "-i", phone, "-i", D / "outro.mp4",
         "-loop", "1", "-framerate", FPS, "-t", f"{END_LEN + 1:.2f}", "-i", end,
         "-i", MUSIC, "-i", SFX / "transition.mp3", "-i", SFX / "transition.mp3",
         "-i", SFX / "fanfare.mp3", "-i", SFX / "pop.mp3", *title_inputs,
         "-filter_complex", v + ";" + a, "-map", "[v]", "-map", "[a]",
         "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-profile:v", "high", "-pix_fmt", "yuv420p",
         "-r", FPS, "-c:a", "aac", "-b:a", "192k", "-ar", "44100", "-movflags", "+faststart", out])
    print(f"{out.relative_to(ROOT)}: {duration(out):.1f} s "
          f"(3D {HOOK_LEN}s → gra {gdur:.1f}s → 3D {OUTRO_LEN:.1f}s → plansza {END_LEN}s)")


if __name__ == "__main__":
    main()

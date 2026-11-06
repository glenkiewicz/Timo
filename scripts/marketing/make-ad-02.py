#!/usr/bin/env python3
"""
Reklama TikTok nr 2 — „Poznaj Timo” (1080×1920, ~30 s): co jest w aplikacji i dla kogo.

Narracja to gotowe kwestie Timo z onboardingu (jego prawdziwy głos z gry):
  onboarding.0  „Cześć! Jestem Timo, lisek detektyw. Mój nos wywęszy każde zwierzę!”
  onboarding.2  „Możemy zgadywać wszystkie zwierzęta świata albo ruszyć na wyprawę.
                 Na każdą wyprawę mam inne przebranie!”
  onboarding.3  „Każde zwierzę z naszej zabawy trafia do kolekcji. Zbierzemy ich ponad siedemset!”

Układ:
  1. 3D: Timo wyskakuje z liści i macha                         ad-02/intro.mp4
  2. telefon: „Mam! Czy to… delfin?” → „Udało się!” (runda z ad-01/rec2, z dźwiękiem gry),
     lista wypraw i wyprawa „Zielona Dżungla” (ad-02/rec/tour.mp4)
  3. 3D: Timo w strojach — dżungla, safari, lód (po 1 s)
  4. telefon: krainy kolekcji, siatka zwierząt, odznaki
  5. plansza: dla kogo, darmowy start, App Store

Nagranie tour.mp4 zrobione z tymczasowo włączonym premium i zasianą kolekcją
(DEV_PREMIUM, profile-store) — kod przywrócony po nagraniu.

Uruchom:  python3 scripts/marketing/make-ad-02.py
"""
import importlib.util, pathlib, re, subprocess

from PIL import Image, ImageDraw, ImageFilter

spec = importlib.util.spec_from_file_location("ad1", pathlib.Path(__file__).with_name("make-ad-01.py"))
ad1 = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ad1)
kit, run, duration = ad1.kit, ad1.run, ad1.duration

ROOT = ad1.ROOT
D = ROOT / "marketing/out/ad-02"
TMP = D / "build"
ad1.TMP = TMP                      # pomocnicze funkcje z ad-01 piszą tutaj
W, H, FPS = ad1.W, ad1.H, ad1.FPS
TOUR = D / "rec/tour.mp4"

# runda z ad-01 (czas logu; obraz = log − ad1.OFFSET)
ROUND_SPANS = [(508.20, 512.40),   # Tak → „Mhm!” → „Mam! Czy to… delfin?” (od stuknięcia — „Mhm!” w całości)
               (514.05, 518.40)]   # „TAK, TO DELFIN!” → „Udało się! Jesteśmy świetną drużyną.” (całe zdanie)
# trasa po aplikacji (czas nagrania tour.mp4, bez dźwięku)
EXP_SPANS = [(2.5, 4.4),           # lista wypraw
             (12.4, 16.0)]         # „Zielona Dżungla”: tygrys → jaguar
COLL_SPANS = [(31.2, 34.6),        # krainy kolekcji
              (38.3, 40.5)]        # siatka zwierząt w krainie
BADGE_SPANS = [(48.3, 50.8)]       # odznaki

INTRO_LEN = 4.6
MONTAGE = [("jungle", 4.0), ("safari", 1.6), ("polar", 4.0)]   # (ujęcie, start), po 1 s
SHOT = 1.0
END_LEN = 3.6
X1, X2, X3, X4 = 0.4, 0.3, 0.3, 0.4

VO = {k: None for k in ("onboarding.0", "onboarding.2", "onboarding.3")}


def voice(key):
    text = (ROOT / "src/data/voice-manifest.ts").read_text(encoding="utf-8")
    h = re.search(rf'"{re.escape(key)}":\s*"([0-9a-f]{{12}})"', text).group(1)
    return ROOT / "assets/voices" / f"{h}.mp3"


def clip(src, a, b, out, audio=None, audio_at=None):
    """Fragment nagrania 1080×2348 z dźwiękiem (z logu gry albo cisza)."""
    dur = b - a
    ain = (["-ss", f"{audio_at:.3f}", "-t", f"{dur:.3f}", "-i", audio] if audio
           else ["-f", "lavfi", "-t", f"{dur:.3f}", "-i", "anullsrc=r=44100:cl=stereo"])
    run(["ffmpeg", "-v", "error", "-y", "-ss", f"{a:.3f}", "-t", f"{dur:.3f}", "-i", src, *ain,
         "-filter_complex", f"[0:v]fps={FPS},scale=1080:2348,format=yuv420p,setsar=1[v];"
                            f"[1:a]aformat=channel_layouts=stereo:sample_rates=44100,"
                            f"afade=t=in:d=0.03,afade=t=out:st={dur - 0.06:.3f}:d=0.06[a]",
         "-map", "[v]", "-map", "[a]", "-t", f"{dur:.3f}",
         "-c:v", "libx264", "-preset", "medium", "-crf", "14", "-c:a", "pcm_s16le", out])
    return out


def concat(parts, out):
    lst = out.with_suffix(".txt")
    lst.write_text("".join(f"file '{p}'\n" for p in parts))
    run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", out])
    return out


def phone(game, bg, out):
    """Telefon z nagraniem na rozmytym tle; wjeżdża od dołu przez 0,7 s."""
    frame, mask = ad1.phone_assets()
    dur = duration(game)
    graph = (
        f"[1:v]scale={ad1.SW}:{ad1.SH}:flags=lanczos,format=rgba[s];[2:v]format=gray[m];[s][m]alphamerge[sm];"
        f"color=c=black@0:s={W}x{H}:r={FPS}:d={dur:.3f},format=rgba[c];"
        f"[c][sm]overlay={ad1.SX}:{ad1.SY}[c1];[c1][3:v]overlay=0:0[ph];"
        f"[0:v]scale={W}:{H},zoompan=z='1+0.0004*on':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s={W}x{H}:fps={FPS}[bg];"
        f"[bg][ph]overlay=0:'if(lt(t,0.7),520*pow(1-t/0.7,3),0)':shortest=1,format=yuv420p,setsar=1[v]")
    run(["ffmpeg", "-v", "error", "-y", "-loop", "1", "-framerate", FPS, "-t", f"{dur:.3f}", "-i", bg,
         "-i", game, "-loop", "1", "-i", mask, "-loop", "1", "-i", frame,
         "-filter_complex", graph, "-map", "[v]", "-map", "1:a", "-t", f"{dur:.3f}",
         "-c:v", "libx264", "-preset", "medium", "-crf", "15", "-c:a", "pcm_s16le", out])
    return out, dur


def end_card(bg_frame):
    bg = ad1.blurred(bg_frame, darken=0.62, radius=24).convert("RGBA")
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    icon = Image.open(ad1.ICON).convert("RGBA").resize((240, 240), Image.LANCZOS)
    m = Image.new("L", icon.size, 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, 239, 239), 54, fill=255)
    icon.putalpha(m)
    y = 380
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle(((W - 240) // 2, y + 12, (W + 240) // 2, y + 252), 54, fill=(0, 0, 0, 110))
    layer = Image.alpha_composite(layer, sh.filter(ImageFilter.GaussianBlur(16)))
    layer.paste(icon, ((W - 240) // 2, y), icon)
    d = ImageDraw.Draw(layer)
    y += 285
    rows = [("Timo — zgadnij zwierzę!", kit.font(76, "head"), "white", 104),
            ("Dla dzieci 4+", kit.font(96, "head"), kit.UI["fox"], 140),
            ("Mówi głosem — nie trzeba umieć czytać", kit.font(42, "body"), "white", 60),
            ("Bez reklam i czatów", kit.font(42, "body"), "white", 60),
            ("Za darmo: 3 gry dziennie", kit.font(48, "bold"), kit.UI["gold"], 90)]
    for text, fnt, col, step in rows:
        x = (W - d.textlength(text, font=fnt)) / 2
        d.text((x, y), text, font=fnt, fill=col, stroke_width=4 if fnt.size > 60 else 2, stroke_fill="#3a2614")
        y += step
    b = ad1.badge()
    b = b.resize((520, int(520 * b.height / b.width)), Image.LANCZOS)
    layer.paste(b, ((W - b.width) // 2, y + 20), b)
    out = TMP / "end.png"
    Image.alpha_composite(bg, layer).convert("RGB").save(out)
    return out


def main():
    TMP.mkdir(parents=True, exist_ok=True)
    log_audio = ad1.log_audio()                                   # dźwięk rundy z ad-01
    game1 = ad1.REC / "game.mp4"

    rnd = [clip(game1, a - ad1.OFFSET, b - ad1.OFFSET, TMP / f"r{i}.mov", log_audio, a)
           for i, (a, b) in enumerate(ROUND_SPANS)]
    exp = [clip(TOUR, a, b, TMP / f"e{i}.mov") for i, (a, b) in enumerate(EXP_SPANS)]
    col = [clip(TOUR, a, b, TMP / f"c{i}.mov") for i, (a, b) in enumerate(COLL_SPANS)]
    bdg = [clip(TOUR, a, b, TMP / f"b{i}.mov") for i, (a, b) in enumerate(BADGE_SPANS)]
    round_len = sum(b - a for a, b in ROUND_SPANS)
    coll_len = sum(b - a for a, b in COLL_SPANS)

    bg = TMP / "phone-bg.png"
    ad1.blurred(D / "intro-still.png").save(bg)
    phone_a, len_a = phone(concat(rnd + exp, TMP / "a.mov"), bg, TMP / "phone-a.mov")
    phone_b, len_b = phone(concat(col + bdg, TMP / "b.mov"), bg, TMP / "phone-b.mov")

    last = TMP / "intro-last.png"
    run(["ffmpeg", "-v", "error", "-y", "-sseof", "-0.1", "-i", D / "intro.mp4", "-frames:v", "1", last])
    end = end_card(last)

    # oś czasu
    t_a = INTRO_LEN - X1
    t_exp = t_a + round_len
    t_m = t_a + len_a - X2
    m_len = SHOT * len(MONTAGE)
    t_b = t_m + m_len - X3
    t_badge = t_b + coll_len
    t_end = t_b + len_b - X4
    total = t_end + END_LEN

    norm = f"fps={FPS},scale={W}:{H},format=yuv420p,setsar=1,settb=AVTB"
    inputs = ["-i", D / "intro.mp4", "-i", phone_a, "-i", phone_b,
              "-loop", "1", "-framerate", FPS, "-t", f"{END_LEN + 1:.2f}", "-i", end]
    v = [f"[0:v]trim=0:{INTRO_LEN},setpts=PTS-STARTPTS,{norm}[i]",
         f"[1:v]{norm}[pa]", f"[2:v]{norm}[pb]",
         f"[3:v]{norm},trim=0:{END_LEN},setpts=PTS-STARTPTS[e]"]
    for k, (name, st) in enumerate(MONTAGE):
        inputs += ["-i", D / f"{name}.mp4"]
        v.append(f"[{4 + k}:v]trim={st}:{st + SHOT},setpts=PTS-STARTPTS,{norm}[m{k}]")
    v.append("".join(f"[m{k}]" for k in range(len(MONTAGE))) + f"concat=n={len(MONTAGE)}:v=1:a=0[mm]")
    v.append(f"[i][pa]xfade=transition=fade:duration={X1}:offset={t_a:.3f}[x1]")
    v.append(f"[x1][mm]xfade=transition=slideleft:duration={X2}:offset={t_m:.3f}[x2]")
    v.append(f"[x2][pb]xfade=transition=slideleft:duration={X3}:offset={t_b:.3f}[x3]")
    v.append(f"[x3][e]xfade=transition=fade:duration={X4}:offset={t_end:.3f},"
             f"fade=t=out:st={total - 0.35:.3f}:d=0.35[vb]")

    titles = [
        (0.4, t_a - 0.1, "Twoje dziecko", "kocha zwierzęta?"),
        (t_a + 0.4, t_a + 3.2, "Dziecko myśli,", "Timo zgaduje"),
        (t_a + 3.3, t_exp - 0.1, "Dla dzieci 4+ —", "czytanie niepotrzebne"),
        (t_exp + 0.2, t_b - 0.1, "24 wyprawy", "z przebraniami Timo"),
        (t_b + 0.3, t_badge - 0.1, "Ponad 700 zwierząt", "do kolekcji"),
        (t_badge + 0.2, t_end, "Odznaki i nowa wyprawa", "każdego dnia"),
    ]
    last_v, base = "vb", len(inputs) // 2  # liczba wejść przed hasłami
    n_in = 4 + len(MONTAGE)
    for n, (a, b, l1, l2) in enumerate(titles):
        inputs += ["-loop", "1", "-framerate", FPS, "-t", f"{b - a:.3f}", "-i", ad1.title_png(n, l1, l2)]
        k = n_in + n
        v.append(f"[{k}:v]format=rgba,fade=t=in:d=0.3:alpha=1,fade=t=out:st={b - a - 0.25:.3f}:d=0.25:alpha=1,"
                 f"setpts=PTS-STARTPTS+{a:.3f}/TB[t{n}]")
        v.append(f"[{last_v}][t{n}]overlay=0:'{ad1.TEXT_Y}+40*pow(max(0,1-(t-{a:.3f})/0.3),2)':"
                 f"enable='between(t,{a:.3f},{b:.3f})'[w{n}]")
        last_v = f"w{n}"
    v.append(f"[{last_v}]null[v]")

    # dźwięk: muzyka cicho pod narracją, głos z gry w rundzie, kwestie Timo z onboardingu
    k0 = n_in + len(titles)
    sounds = [(ad1.MUSIC, None), (voice("onboarding.0"), 0.15), (voice("onboarding.2"), t_exp + 0.25),
              (voice("onboarding.3"), t_b + 0.35), (ad1.SFX / "transition.mp3", t_m - 0.15),
              (ad1.SFX / "transition.mp3", t_b - 0.15), (ad1.SFX / "pop.mp3", t_end + 0.1)]
    a = []
    for j, (f, t) in enumerate(sounds):
        inputs += ["-i", f]
        k = k0 + j
        if t is None:
            a.append(f"[{k}:a]aloop=loop=-1:size=2e9,atrim=0:{total:.2f},volume=0.13,afade=t=in:d=0.4,"
                     f"afade=t=out:st={total - 1.2:.2f}:d=1.2,aformat=channel_layouts=stereo:sample_rates=44100[s{j}]")
        else:
            ms = int(t * 1000)
            gain = "1.0" if "voices" in str(f) else "0.6"
            a.append(f"[{k}:a]volume={gain},adelay={ms}|{ms},aformat=channel_layouts=stereo:sample_rates=44100[s{j}]")
    ms = int(t_a * 1000)
    a.append(f"[1:a]adelay={ms}|{ms},aformat=channel_layouts=stereo:sample_rates=44100[g]")
    a.append("[g]" + "".join(f"[s{j}]" for j in range(len(sounds)))
             + f"amix=inputs={len(sounds) + 1}:normalize=0,atrim=0:{total:.2f},alimiter=limit=0.9[a]")

    out = D / "timo-ad-02.mp4"
    run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(v + a),
         "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "slow", "-crf", "17",
         "-profile:v", "high", "-pix_fmt", "yuv420p", "-r", FPS, "-c:a", "aac", "-b:a", "192k",
         "-ar", "44100", "-movflags", "+faststart", out])
    print(f"{out.relative_to(ROOT)}: {duration(out):.1f} s")


if __name__ == "__main__":
    main()

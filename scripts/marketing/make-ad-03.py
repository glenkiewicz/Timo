#!/usr/bin/env python3
"""
Reklama TikTok nr 3 — „Czego uczy się dziecko?” (1080×1920, ~30 s), dla rodziców.

Zamiast ogólnego „edukacyjna” — pięć konkretów, każdy widoczny w prawdziwej grze
(brand.md, zasada 5: żadnych obietnic, których nie widać):
  ✓ Grupy zwierząt          „Czy twoje zwierzę jest ssakiem, jak pies, krowa albo słoń?”
  ✓ Gdzie żyją zwierzęta    „Czy spotkasz je w morzu?” → „Morski trop! Ahoj!”
  ✓ Myślenie krok po kroku  „Mam! Czy to… delfin?”
  ✓ Nagroda za wiedzę       ekran wyniku: „+44 Wiesz 10/10”
  ✓ Nowe słowa i ciekawostki  karta „Czy wiesz?”

Układ: 3D atlas (ad-03/atlas.mp4) → telefon z rundą (ad-01/rec2, dźwięk gry z logu)
→ 3D piątka (ad-03/highfive.mp4) → plansza z zebraną listą i App Store.

Uruchom:  python3 scripts/marketing/make-ad-03.py
"""
import importlib.util, pathlib

from PIL import Image, ImageDraw, ImageFilter

HERE = pathlib.Path(__file__).parent


def load(name, file):
    spec = importlib.util.spec_from_file_location(name, HERE / file)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


ad2 = load("ad2", "make-ad-02.py")
ad1 = ad2.ad1
kit, run, duration = ad1.kit, ad1.run, ad1.duration

ROOT = ad1.ROOT
D = ROOT / "marketing/out/ad-03"
TMP = D / "build"
ad1.TMP = ad2.TMP = TMP
W, H, FPS = ad1.W, ad1.H, ad1.FPS

# runda z ad-01/rec2 (czas logu) i hasło nad telefonem: (od, do, linia 1, linia 2, ptaszek)
SPANS = [
    ((8.55, 13.30), "Grupy zwierząt", "ssak, ptak, ryba"),          # pytanie o ssaka
    ((14.65, 15.75), None, None),                                     # Tak → „Aha!”
    ((466.55, 468.35), "Gdzie żyją zwierzęta", "morze, dżungla, lód"),
    ((469.60, 471.85), None, None),                                   # Tak → „Morski trop! Ahoj!”
    ((508.20, 514.30), "Myślenie krok po kroku", "pytanie po pytaniu"),  # Tak → „Mhm!” → „Mam! Czy to… delfin?”
    ((514.30, 518.40), "Nagroda za wiedzę,", "nie za szczęście"),     # „Wiesz 10/10”, „Udało się!…”
    ((527.30, 530.30), "Nowe słowa", "i ciekawostki"),                # karta „Czy wiesz?”
]
CHECKS = ["Grupy zwierząt", "Gdzie żyją zwierzęta", "Myślenie krok po kroku",
          "Nagroda za wiedzę", "Nowe słowa i ciekawostki"]

INTRO_LEN = 3.6
OUTRO = (0.2, 1.95)      # fragment highfive.mp4 — dalej Kling skacze do innego kadru
OUTRO_BG = 0.9           # klatka na tło planszy (Timo macha i się uśmiecha)
END_LEN = 4.2
X1, X2, X3 = 0.4, 0.4, 0.4


def check_icon(size):
    im = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.ellipse((0, 0, size - 1, size - 1), fill=kit.UI["primary"], outline="white", width=max(3, size // 16))
    s = size
    d.line([(s * 0.27, s * 0.53), (s * 0.44, s * 0.69), (s * 0.74, s * 0.34)], fill="white",
           width=max(4, size // 9), joint="curve")
    return im


def title_png(n, line1, line2, check):
    """Hasło jak w ad-01/02; z ptaszkiem przed pierwszą linią, gdy to punkt listy."""
    base = Image.open(ad1.title_png(n, line1, line2)).convert("RGBA")
    if not check:
        return TMP / f"title-{n}.png"
    d = ImageDraw.Draw(base)
    s1 = 64
    while max(d.textlength(line1, font=kit.font(s1, "head")),
              d.textlength(line2, font=kit.font(s1 + 14, "head"))) > 880:
        s1 -= 2
    tw = d.textlength(line1, font=kit.font(s1, "head"))
    ic = check_icon(64)
    out = Image.new("RGBA", base.size, (0, 0, 0, 0))
    out.paste(base, (36, 0))                   # tekst lekko w prawo, ikona po lewej
    out.alpha_composite(ic, (int((W - tw) / 2) + 36 - 64 - 16, 8))
    p = TMP / f"title-{n}.png"
    out.save(p)
    return p


def end_card(bg_frame):
    bg = ad1.blurred(bg_frame, darken=0.55, radius=26).convert("RGBA")
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    y = 250
    for text, fnt, col in [("Mądra zabawa", kit.font(92, "head"), "white"),
                           ("zamiast przewijania", kit.font(92, "head"), kit.UI["fox"])]:
        x = (W - d.textlength(text, font=fnt)) / 2
        d.text((x, y), text, font=fnt, fill=col, stroke_width=5, stroke_fill="#3a2614")
        y += 110
    # karta z listą
    y += 40
    card = (150, y, W - 150, y + 90 * len(CHECKS) + 50)
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle((card[0], card[1] + 14, card[2], card[3] + 14), 44, fill=(0, 0, 0, 110))
    layer = Image.alpha_composite(layer, sh.filter(ImageFilter.GaussianBlur(18)))
    d = ImageDraw.Draw(layer)
    d.rounded_rectangle(card, 44, fill=(253, 245, 236, 245))
    ic = check_icon(58)
    f = kit.font(46, "bold")
    for k, text in enumerate(CHECKS):
        yy = card[1] + 30 + k * 90
        layer.alpha_composite(ic, (card[0] + 44, yy))
        d.text((card[0] + 124, yy + 4), text, font=f, fill=kit.UI["text"])
    y = card[3] + 60
    for text, fnt, col in [("Dla dzieci 4+ · Bez reklam i czatów", kit.font(44, "body"), "white"),
                           ("Za darmo: 3 gry dziennie", kit.font(50, "bold"), kit.UI["gold"])]:
        x = (W - d.textlength(text, font=fnt)) / 2
        d.text((x, y), text, font=fnt, fill=col, stroke_width=2, stroke_fill="#3a2614")
        y += 74
    b = ad1.badge()
    b = b.resize((500, int(500 * b.height / b.width)), Image.LANCZOS)
    layer.paste(b, ((W - b.width) // 2, y + 20), b)
    out = TMP / "end.png"
    Image.alpha_composite(bg, layer).convert("RGB").save(out)
    return out


def main():
    TMP.mkdir(parents=True, exist_ok=True)
    log_audio = ad1.log_audio()
    game = ad1.REC / "game.mp4"
    parts = [ad2.clip(game, a - ad1.OFFSET, b - ad1.OFFSET, TMP / f"r{i}.mov", log_audio, a)
             for i, ((a, b), *_r) in enumerate(SPANS)]
    bg = TMP / "phone-bg.png"
    ad1.blurred(D / "atlas-still.png").save(bg)
    phone, plen = ad2.phone(ad2.concat(parts, TMP / "a.mov"), bg, TMP / "phone.mov")

    last = TMP / "outro-last.png"
    run(["ffmpeg", "-v", "error", "-y", "-ss", f"{OUTRO_BG:.2f}", "-i", D / "highfive.mp4",
         "-frames:v", "1", last])
    end = end_card(last)

    t_p = INTRO_LEN - X1
    o_len = OUTRO[1] - OUTRO[0]
    t_o = t_p + plen - X2
    t_e = t_o + o_len - X3
    total = t_e + END_LEN

    norm = f"fps={FPS},scale={W}:{H},format=yuv420p,setsar=1,settb=AVTB"
    inputs = ["-i", D / "atlas.mp4", "-i", phone, "-i", D / "highfive.mp4",
              "-loop", "1", "-framerate", FPS, "-t", f"{END_LEN + 1:.2f}", "-i", end]
    v = [f"[0:v]trim=0:{INTRO_LEN},setpts=PTS-STARTPTS,{norm}[i]", f"[1:v]{norm}[p]",
         f"[2:v]trim={OUTRO[0]}:{OUTRO[1]},setpts=PTS-STARTPTS,{norm}[o]",
         f"[3:v]{norm},trim=0:{END_LEN},setpts=PTS-STARTPTS[e]",
         f"[i][p]xfade=transition=fade:duration={X1}:offset={t_p:.3f}[x1]",
         f"[x1][o]xfade=transition=zoomin:duration={X2}:offset={t_o:.3f}[x2]",
         f"[x2][e]xfade=transition=fade:duration={X3}:offset={t_e:.3f},"
         f"fade=t=out:st={total - 0.35:.3f}:d=0.35[vb]"]

    # hasła: wstęp + jedno na każdy punkt listy (trwa do następnego)
    titles = [(0.35, t_p - 0.05, "5 minut z Timo.", "Czego uczy się dziecko?", False)]
    t, marks = t_p, []
    for (a, b), l1, l2 in SPANS:
        if l1:
            marks.append([t, l1, l2])
        t += b - a
    for k, (a, l1, l2) in enumerate(marks):
        b = marks[k + 1][0] if k + 1 < len(marks) else t_o + 0.1
        titles.append((a + 0.15, b - 0.05, l1, l2, True))
    n_in, last_v = 4, "vb"
    for n, (a, b, l1, l2, chk) in enumerate(titles):
        inputs += ["-loop", "1", "-framerate", FPS, "-t", f"{b - a:.3f}", "-i", title_png(n, l1, l2, chk)]
        k = n_in + n
        v.append(f"[{k}:v]format=rgba,fade=t=in:d=0.3:alpha=1,fade=t=out:st={b - a - 0.25:.3f}:d=0.25:alpha=1,"
                 f"setpts=PTS-STARTPTS+{a:.3f}/TB[t{n}]")
        v.append(f"[{last_v}][t{n}]overlay=0:'{ad1.TEXT_Y}+40*pow(max(0,1-(t-{a:.3f})/0.3),2)':"
                 f"enable='between(t,{a:.3f},{b:.3f})'[w{n}]")
        last_v = f"w{n}"
    v.append(f"[{last_v}]null[v]")

    k0 = n_in + len(titles)
    sfx = [(ad1.MUSIC, None), (ad1.SFX / "transition.mp3", t_o - 0.15), (ad1.SFX / "fanfare.mp3", t_o + 0.5),
           (ad1.SFX / "pop.mp3", t_e + 0.1)]
    sfx += [(ad1.SFX / "tap-small.mp3", m[0] + 0.15) for m in marks]     # „ptaszek” przy każdym punkcie
    a = []
    for j, (f, tt) in enumerate(sfx):
        inputs += ["-i", f]
        k = k0 + j
        if tt is None:
            a.append(f"[{k}:a]aloop=loop=-1:size=2e9,atrim=0:{total:.2f},"
                     f"volume='if(between(t,{t_p + 0.3:.2f},{t_o:.2f}),0.09,0.24)':eval=frame,"
                     f"afade=t=in:d=0.4,afade=t=out:st={total - 1.2:.2f}:d=1.2,"
                     f"aformat=channel_layouts=stereo:sample_rates=44100[s{j}]")
        else:
            ms = int(tt * 1000)
            a.append(f"[{k}:a]volume=0.6,adelay={ms}|{ms},aformat=channel_layouts=stereo:sample_rates=44100[s{j}]")
    ms = int(t_p * 1000)
    a.append(f"[1:a]adelay={ms}|{ms},aformat=channel_layouts=stereo:sample_rates=44100[g]")
    a.append("[g]" + "".join(f"[s{j}]" for j in range(len(sfx)))
             + f"amix=inputs={len(sfx) + 1}:normalize=0,atrim=0:{total:.2f},alimiter=limit=0.9[a]")

    out = D / "timo-ad-03.mp4"
    run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(v + a),
         "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "slow", "-crf", "17",
         "-profile:v", "high", "-pix_fmt", "yuv420p", "-r", FPS, "-c:a", "aac", "-b:a", "192k",
         "-ar", "44100", "-movflags", "+faststart", out])
    print(f"{out.relative_to(ROOT)}: {duration(out):.1f} s")


if __name__ == "__main__":
    main()

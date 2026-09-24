#!/usr/bin/env python3
"""
Dociąga wyniki zadań ToAPIs po identyfikatorach z logu generatora.

Po co osobny skrypt: generator ma własne okno oczekiwania, a przy stu zadaniach
odpytywanie jednego po drugim bywa wolniejsze niż to okno. Identyfikatory są
jednak w logu (`wyslano <id> <task_id>`), więc nic nie przepada — wystarczy
wrócić po wyniki później. To ratuje też sytuację, gdy generator padnie.

Uruchom:  python3 scripts/fetch-tasks.py <plik-logu> <katalog-docelowy>
"""
import json, re, sys, time, urllib.request, pathlib

API = "https://toapis.com/v1"


def key():
    for line in open(".env", encoding="utf-8"):
        if line.startswith("TOAPIS_API_KEY="):
            return line.split("=", 1)[1].strip().strip('"\'')
    sys.exit("brak TOAPIS_API_KEY w .env")


def fetch_file(url, dest):
    req = urllib.request.Request(url, headers={"User-Agent": "timo-assets/1.0"})
    with urllib.request.urlopen(req, timeout=180) as r, open(dest, "wb") as f:
        f.write(r.read())


def status(tid, k):
    req = urllib.request.Request(
        f"{API}/images/generations/{tid}", headers={"Authorization": f"Bearer {k}"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)


def main(log_path, out_dir):
    k = key()
    out = pathlib.Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    pairs = re.findall(r"wyslano\s+(\S+)\s+(tsk_\S+)", open(log_path, encoding="utf-8").read())
    todo = {n: t for n, t in pairs if not (out / f"{n}.png").exists()}
    print(f"zadan w logu: {len(pairs)} | do pobrania: {len(todo)}", flush=True)

    done = failed = 0
    while todo:
        progressed = False
        for n, tid in list(todo.items()):
            try:
                r = status(tid, k)
            except Exception:
                continue
            st = r.get("status")
            if st == "completed":
                fetch_file(r["result"]["data"][0]["url"], out / f"{n}.png")
                todo.pop(n); done += 1; progressed = True
                print(f"  gotowe  {n:26} ({done})", flush=True)
            elif st in ("failed", "cancelled"):
                msg = r.get("error", {}).get("message", "")[:70]
                todo.pop(n); failed += 1; progressed = True
                print(f"  PADLO   {n:26} {msg}", flush=True)
        if todo and not progressed:
            time.sleep(10)
    print(f"\npobrano {done}, odbitych {failed}", flush=True)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])

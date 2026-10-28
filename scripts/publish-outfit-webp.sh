#!/usr/bin/env bash
# Kopiuje klipy przebrań (WebP) do strony, skąd Android je pobiera
# (src/components/timo/outfit-webp.android.ts). Pliki nie idą do gita —
# po skopiowaniu trzeba wdrożyć stronę (z katalogu site/).
# Zmiana klipów: podbij wersję tu i w BASE_URL w aplikacji.
set -euo pipefail
cd "$(dirname "$0")/.."
VERSION=v1
OUT="site/clips/outfits/$VERSION"
for dir in assets/timo/outfits/*/; do
  id=$(basename "$dir")
  mkdir -p "$OUT/$id"
  for clip in idle talk talk-happy; do
    cp "$dir$clip.webp" "$OUT/$id/$clip.webp"
  done
done
du -sh "$OUT"

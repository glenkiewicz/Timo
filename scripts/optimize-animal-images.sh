#!/bin/bash
# Optymalizacja zdjęć zwierząt: resize do 512×512 max + JPEG quality 80.
# Bezpieczne: najpierw robi backup oryginałów do assets/animals.original/.
#
# Wymaga: sips (wbudowane w macOS).
#
# Użycie:  bash scripts/optimize-animal-images.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC_DIR="$REPO_ROOT/assets/animals"
BACKUP_DIR="$REPO_ROOT/assets/animals.original"

MAX_DIMENSION=512
JPEG_QUALITY=80  # 0-100, 80 = dobry kompromis dla zdjęć kreskówkowych

if [ ! -d "$SRC_DIR" ]; then
  echo "❌ Brak katalogu: $SRC_DIR"
  exit 1
fi

# 1. Backup oryginałów (jeśli jeszcze nie istnieje)
if [ -d "$BACKUP_DIR" ]; then
  echo "⚠️  Backup już istnieje w $BACKUP_DIR — pomijam (jeśli chcesz zrobić od nowa, najpierw usuń ten folder)."
else
  echo "📦 Robię backup oryginałów do $BACKUP_DIR..."
  cp -R "$SRC_DIR" "$BACKUP_DIR"
  echo "✓ Backup gotowy"
fi

# 2. Rozmiar PRZED
SIZE_BEFORE=$(du -sm "$SRC_DIR" | cut -f1)
COUNT=$(find "$SRC_DIR" -name "*.jpg" | wc -l | tr -d ' ')
echo ""
echo "🔧 Optymalizuję $COUNT plików (max ${MAX_DIMENSION}px, quality ${JPEG_QUALITY})..."

# 3. Optymalizacja in-place
PROCESSED=0
for img in "$SRC_DIR"/*.jpg; do
  # Resize do max wymiar (sips zachowa proporcje przez resampleHeightWidthMax)
  sips --resampleHeightWidthMax $MAX_DIMENSION "$img" >/dev/null 2>&1

  # Recompress JPEG z quality 80
  sips -s format jpeg -s formatOptions $JPEG_QUALITY "$img" --out "$img" >/dev/null 2>&1

  PROCESSED=$((PROCESSED + 1))
  # Progress co 50 plików
  if [ $((PROCESSED % 50)) -eq 0 ]; then
    echo "   ... $PROCESSED / $COUNT"
  fi
done

# 4. Rozmiar PO + statystyki
SIZE_AFTER=$(du -sm "$SRC_DIR" | cut -f1)
SAVED=$((SIZE_BEFORE - SIZE_AFTER))
if [ "$SIZE_BEFORE" -gt 0 ]; then
  PERCENT=$((100 - (SIZE_AFTER * 100 / SIZE_BEFORE)))
else
  PERCENT=0
fi

echo ""
echo "✅ Gotowe!"
echo ""
echo "📊 Statystyki:"
echo "   Przed:    ${SIZE_BEFORE} MB"
echo "   Po:       ${SIZE_AFTER} MB"
echo "   Oszczęd.: ${SAVED} MB (-${PERCENT}%)"
echo ""
echo "Backup oryginałów: $BACKUP_DIR"
echo "Możesz go usunąć po sprawdzeniu jakości:  rm -rf $BACKUP_DIR"

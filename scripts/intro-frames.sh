#!/bin/sh
# Cut the filmed way in into the stills the hero scrubs through. Needs ffmpeg and cwebp.
# Usage: scripts/intro-frames.sh path/to/take.mp4 [frames=150] [width=1600]
# Writes public/intro/f-001.webp … and prints the count to put in lib/intro.ts.
set -e
IN="$1"; N="${2:-150}"; W="${3:-1600}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/intro"
TMP="$(mktemp -d)"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
rm -rf "$OUT"; mkdir -p "$OUT"
# N stills spread evenly over the whole take, so a longer take simply means smaller steps between them
ffmpeg -loglevel error -y -i "$IN" -vf "fps=$N/$DUR,scale=$W:-2:flags=lanczos" -frames:v "$N" "$TMP/f-%03d.png"
for f in "$TMP"/f-*.png; do cwebp -quiet -q 72 -m 6 "$f" -o "$OUT/$(basename "${f%.png}").webp"; done
rm -rf "$TMP"
echo "frames: $(ls "$OUT" | wc -l | tr -d ' ')  size: $(du -sh "$OUT" | cut -f1)"

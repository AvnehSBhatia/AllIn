#!/bin/sh
# Cut the filmed way in into the stills the hero scrubs through. Needs ffmpeg and cwebp.
# Usage: scripts/intro-frames.sh path/to/take.mp4 [frames=120] [width=1440] [quality=54]
# Writes public/intro/f-001.webp … plus poster-800.webp (the opening frame for phones), and prints the count to put in lib/intro.ts.
set -e
IN="$1"; N="${2:-120}"; W="${3:-1440}"; Q="${4:-54}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/intro"
TMP="$(mktemp -d)"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
rm -rf "$OUT"; mkdir -p "$OUT"
# N stills spread evenly over the whole take, so a longer take simply means smaller steps between them
ffmpeg -loglevel error -y -i "$IN" -vf "fps=$N/$DUR,scale=$W:-2:flags=lanczos" -frames:v "$N" "$TMP/f-%03d.png"
for f in "$TMP"/f-*.png; do cwebp -quiet -q "$Q" -m 6 -sharp_yuv "$f" -o "$OUT/$(basename "${f%.png}").webp"; done
cwebp -quiet -q 60 -m 6 -resize 800 0 "$TMP/f-001.png" -o "$OUT/poster-800.webp"
rm -rf "$TMP"
echo "frames: $(ls "$OUT"/f-*.webp | wc -l | tr -d ' ')  size: $(du -sh "$OUT" | cut -f1)"

#!/usr/bin/env bash
set -euo pipefail

file="assets/video/banner-dme.mp4"

if [[ ! -f "$file" ]]; then
  echo "Banner MP4 mangler; springer codec-kontrol over."
  exit 0
fi

if ! command -v ffprobe >/dev/null 2>&1; then
  echo "::warning::ffprobe findes ikke på runneren; codec-kontrol springes over."
  exit 0
fi

codec="$(ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of csv=p=0 "$file" | head -n1)"
pix_fmt="$(ffprobe -v error -select_streams v:0 -show_entries stream=pix_fmt -of csv=p=0 "$file" | head -n1)"
audio_count="$(ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$file" | grep -c . || true)"

printf 'Banner codec: %s\nPixel format: %s\nAudio streams: %s\n' "$codec" "$pix_fmt" "$audio_count"

[[ "$codec" == "h264" ]] || { echo "Banner MP4 skal bruge H.264." >&2; exit 1; }
[[ "$pix_fmt" == "yuv420p" ]] || { echo "Banner MP4 skal bruge yuv420p for bred browserkompatibilitet." >&2; exit 1; }
[[ "$audio_count" == "0" ]] || { echo "Banner MP4 skal eksporteres uden lydspor." >&2; exit 1; }

python - <<'PY'
from pathlib import Path
p = Path('assets/video/banner-dme.mp4')
data = p.read_bytes()
moov = data.find(b'moov')
mdat = data.find(b'mdat')
print(f'moov position: {moov}; mdat position: {mdat}')
if moov < 0 or mdat < 0:
    raise SystemExit('MP4-containeren mangler forventet moov/mdat atom.')
if moov > mdat:
    raise SystemExit('MP4 er ikke fast-start optimeret: moov ligger efter mdat.')
PY

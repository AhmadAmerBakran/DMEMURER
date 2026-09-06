#!/usr/bin/env bash
set -euo pipefail

file="${1:-assets/video/banner-dme.mp4}"
max_bytes=$((15 * 1024 * 1024))

if [[ ! -f "$file" ]]; then
  echo "Banner MP4 mangler; springer codec-kontrol over."
  exit 0
fi

if ! command -v ffprobe >/dev/null 2>&1; then
  echo "::error::ffprobe findes ikke på runneren; videokontrollen kan ikke udføres."
  exit 1
fi

codec="$(ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of csv=p=0 "$file" | head -n1)"
pix_fmt="$(ffprobe -v error -select_streams v:0 -show_entries stream=pix_fmt -of csv=p=0 "$file" | head -n1)"
width="$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$file" | head -n1)"
height="$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$file" | head -n1)"
fps_raw="$(ffprobe -v error -select_streams v:0 -show_entries stream=avg_frame_rate -of csv=p=0 "$file" | head -n1)"
duration="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$file" | head -n1)"
audio_count="$(ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$file" | grep -c . || true)"
rotation="$(ffprobe -v error -select_streams v:0 -show_entries stream_tags=rotate:stream_side_data=rotation -of default=nw=1:nk=1 "$file" | head -n1 || true)"
rotation="${rotation:-0}"
size="$(stat -c%s "$file")"

fps="$(python - "$fps_raw" <<'PY'
import sys
from fractions import Fraction
try:
    print(float(Fraction(sys.argv[1])))
except Exception:
    print(0)
PY
)"

printf 'Banner file: %s\nCodec: %s\nPixel format: %s\nResolution: %sx%s\nFrame rate: %.3f fps\nDuration: %.3f s\nAudio streams: %s\nRotation: %s\nSize: %.2f MiB\n' \
  "$file" "$codec" "$pix_fmt" "$width" "$height" "$fps" "$duration" "$audio_count" "$rotation" "$(python -c "print($size/1024/1024)")"

[[ "$codec" == "h264" ]] || { echo "Banner MP4 skal bruge H.264." >&2; exit 1; }
[[ "$pix_fmt" == "yuv420p" ]] || { echo "Banner MP4 skal bruge yuv420p for bred browserkompatibilitet." >&2; exit 1; }
[[ "$audio_count" == "0" ]] || { echo "Banner MP4 skal eksporteres uden lydspor." >&2; exit 1; }
[[ "$rotation" == "0" || "$rotation" == "0.000000" ]] || { echo "Banner MP4 må ikke afhænge af rotationsmetadata." >&2; exit 1; }
(( size <= max_bytes )) || { echo "Banner MP4 overstiger 15 MiB-budgettet." >&2; exit 1; }

python - "$width" "$height" "$fps" "$duration" <<'PY'
import sys
w, h = map(int, sys.argv[1:3])
fps = float(sys.argv[3])
duration = float(sys.argv[4])
if not (1280 <= w <= 1920 and 720 <= h <= 1080):
    raise SystemExit('Banneropløsningen skal ligge mellem 1280×720 og 1920×1080.')
if not (23 <= fps <= 30.1):
    raise SystemExit('Bannerfilmen skal være ca. 24–30 fps for effektiv webafspilning.')
if not (6 <= duration <= 25):
    raise SystemExit('Bannerfilmen skal være en kort loop på ca. 6–25 sekunder.')
PY

python - "$file" <<'PY'
from pathlib import Path
import sys
p = Path(sys.argv[1])
data = p.read_bytes()
moov = data.find(b'moov')
mdat = data.find(b'mdat')
print(f'moov position: {moov}; mdat position: {mdat}')
if moov < 0 or mdat < 0:
    raise SystemExit('MP4-containeren mangler forventet moov/mdat atom.')
if moov > mdat:
    raise SystemExit('MP4 er ikke fast-start optimeret: moov ligger efter mdat.')
PY

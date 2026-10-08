#!/usr/bin/env bash
# Technical + audio audit of a rendered video, plus contact sheets for the eye.
#   scripts/yt/audit-video.sh out/<id>.mp4 <outDir> [<qr-second>=<expected-url>]   (QR check via scripts/qa/check_reel.py)
# Prints: format, loudness (integrated / LRA / true peak), black and frozen stretches, and writes
# <outDir>/sheet-N.jpg (1 frame / 5 s, 6×6) for the contact-sheet review.
set -euo pipefail
mp4=$1; out=$2; qr=${3:-}
mkdir -p "$out"
echo "== format"; ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate,sample_rate,channels -of default=nw=1 "$mp4"
echo "== loudness (ebur128, true peak)"; ffmpeg -nostats -i "$mp4" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|LRA|Peak):"
echo "== black frames (>0.3 s)"; ffmpeg -nostats -i "$mp4" -vf "blackdetect=d=0.3:pix_th=0.10" -an -f null - 2>&1 | grep black_start || echo none
echo "== frozen picture (>4 s)"; ffmpeg -nostats -i "$mp4" -vf "freezedetect=n=-60dB:d=4" -an -f null - 2>&1 | grep -E "freeze_(start|duration)" | sed -E 's/.*(freeze_[a-z]+): ([0-9.]+).*/\1 \2/' | paste - - || echo none
echo "== silence in the mix (>3 s)"; ffmpeg -nostats -i "$mp4" -af "silencedetect=n=-45dB:d=3" -vn -f null - 2>&1 | grep -E "silence_(start|end)" | sed -E 's/.*(silence_[a-z]+): ([0-9.]+).*/\1 \2/' | paste - - || echo none
echo "== contact sheets"; ffmpeg -y -v error -i "$mp4" -vf "fps=1/5,scale=320:-1,tile=6x6" -q:v 3 "$out/sheet-%d.jpg"; ls "$out"/sheet-*.jpg
if [ -n "$qr" ]; then
  echo "== repo QA (format, loudness, QR): scripts/qa/check_reel.py"
  (cd /home/user/reels && python3 scripts/qa/check_reel.py "$mp4" --qr "$qr" --frames 12 | tail -8)
fi

"""Verify a rendered reel before it ships.

    pip install -r scripts/qa/requirements.txt
    python3 scripts/qa/check_reel.py out/qr-no-reprint.mp4 --qr 29.5=https://redirhub.com/qr

Checks, and fails (exit 1) on anything that would break a social upload or the
RedirHub QR standard:
  - format: H.264, yuv420p, 1080x1920, 30 fps, an AAC audio track
  - loudness: integrated LUFS near the -14 social target (warns outside -16..-12)
  - QR: at each --qr SECONDS=URL, a QR in the frame must decode to exactly URL
Writes a contact sheet (out/qa/<id>/sheet.png) to eyeball layout, safe area and
overlaps. Look at it: most visual bugs so far were only visible there.
"""
import argparse
import json
import pathlib
import re
import subprocess
import sys

import cv2
import imageio_ffmpeg
import numpy as np
from PIL import Image, ImageDraw

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
EXPECT = {"codec": "h264", "pix_fmt": "yuv420p", "size": (1080, 1920), "fps": 30}
# Social UI covers roughly the top 200px and bottom 300px of a 1080x1920 frame.
SAFE_TOP, SAFE_BOTTOM = 200, 1600


def probe(mp4):
    err = subprocess.run([FFMPEG, "-hide_banner", "-i", str(mp4)], capture_output=True, text=True).stderr
    v = re.search(r"Video: (\w+).*?, (\w+)[(,].*?, (\d+)x(\d+).*?, ([\d.]+) fps", err)
    a = re.search(r"Audio: (\w+)", err)
    d = re.search(r"Duration: (\d+):(\d+):([\d.]+)", err)
    return {
        "codec": v.group(1) if v else None,
        "pix_fmt": v.group(2) if v else None,
        "size": (int(v.group(3)), int(v.group(4))) if v else None,
        "fps": float(v.group(5)) if v else None,
        "audio": a.group(1) if a else None,
        "duration": int(d.group(1)) * 3600 + int(d.group(2)) * 60 + float(d.group(3)) if d else 0.0,
    }


def loudness(mp4):
    err = subprocess.run([FFMPEG, "-hide_banner", "-i", str(mp4), "-af", "ebur128=peak=true", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    i = re.findall(r"I:\s+(-?[\d.]+) LUFS", err)
    p = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", err)
    return (float(i[-1]) if i else None, float(p[-1]) if p else None)


def frame(mp4, t):
    raw = subprocess.run([FFMPEG, "-loglevel", "error", "-ss", f"{t:.3f}", "-i", str(mp4), "-frames:v", "1",
                          "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(1920, 1080, 3)


def sheet(mp4, duration, n, out):
    times = [round(duration * (i + 0.5) / n, 2) for i in range(n)]
    w, h, cols = 270, 480, 6
    rows = (n + cols - 1) // cols
    img = Image.new("RGB", (w * cols, (h + 24) * rows), "white")
    draw = ImageDraw.Draw(img)
    for k, t in enumerate(times):
        f = Image.fromarray(frame(mp4, t)).resize((w, h))
        d = ImageDraw.Draw(f)
        for y in (SAFE_TOP, SAFE_BOTTOM):  # safe-area guides
            d.line([(0, y * h / 1920), (w, y * h / 1920)], fill=(255, 0, 180), width=1)
        x, y = (k % cols) * w, (k // cols) * (h + 24)
        img.paste(f, (x, y))
        draw.text((x + 6, y + h + 4), f"{t:.2f}s", fill="black")
    img.save(out)
    return times


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("mp4", type=pathlib.Path)
    ap.add_argument("--qr", action="append", default=[], metavar="SECONDS=URL",
                    help="frame time and the exact URL its QR must decode to (repeatable)")
    ap.add_argument("--frames", type=int, default=12, help="contact sheet frames (default 12)")
    args = ap.parse_args()

    out = pathlib.Path("out/qa") / args.mp4.stem
    out.mkdir(parents=True, exist_ok=True)
    failures, report = [], {}

    info = probe(args.mp4)
    report["format"] = info
    for key, want in EXPECT.items():
        if info[key] != want:
            failures.append(f"{key}: {info[key]} (want {want})")
    if info["audio"] != "aac":
        failures.append(f"audio: {info['audio']} (want aac)")

    lufs, peak = loudness(args.mp4)
    report["loudness"] = {"integrated_lufs": lufs, "true_peak_dbfs": peak}
    if lufs is None or not -16 <= lufs <= -12:
        print(f"warning: loudness {lufs} LUFS is outside -16..-12 (social target -14)")
    if peak is not None and peak > -1:
        failures.append(f"peak {peak} dBFS (want <= -1)")

    detector = cv2.QRCodeDetector()
    report["qr"] = []
    for spec in args.qr:
        t, _, want = spec.partition("=")
        got = detector.detectAndDecode(cv2.cvtColor(frame(args.mp4, float(t)), cv2.COLOR_RGB2BGR))[0]
        report["qr"].append({"t": float(t), "want": want, "got": got})
        if got != want:
            failures.append(f"QR at {t}s decoded to {got!r} (want {want!r})")

    report["sheet"] = str(out / "sheet.png")
    report["sheet_times"] = sheet(args.mp4, info["duration"], args.frames, out / "sheet.png")
    (out / "report.json").write_text(json.dumps(report, indent=2))
    print(json.dumps(report, indent=2))
    if failures:
        print("\nFAILED:\n  " + "\n  ".join(failures))
        sys.exit(1)
    print("\nOK. Now look at the contact sheet:", out / "sheet.png")


if __name__ == "__main__":
    main()

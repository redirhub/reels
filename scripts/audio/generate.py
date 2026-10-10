"""Generate all reel audio: one beat per reel and the shared sound effects.

    pip install -r scripts/audio/requirements.txt
    npm run audio            # = python3 scripts/audio/generate.py

Everything is synthesized from oscillators and noise, so the audio is ours:
no samples, no stock library, no licensing questions.

Writes:
  public/audio/<id>-beat.mp3      for each src/remotion/reels/<id>/music.json (beat.py, or pad.py
                                  when music.json says "kind": "pad")
  public/audio/sfx/<name>.wav     shared effects (see sfx.py)
  public/audio/sfx/manifest.json  each effect's length, read by the Sfx component

Output is deterministic: every beat and effect is seeded by its own name, so
re-running only changes files whose inputs changed.
"""
import json
import pathlib
import re
import subprocess
import sys

sys.path.insert(0, str(pathlib.Path(__file__).parent))

import sfx  # noqa: E402
from beat import beat  # noqa: E402
from pad import bed  # noqa: E402
from dsp import SR, ffmpeg, seed, write_wav  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "audio"
TARGET_LUFS = -16.0


def integrated_lufs(path):
    err = subprocess.run([ffmpeg(), "-hide_banner", "-i", str(path), "-af", "ebur128", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    return float(re.findall(r"I:\s+(-?[\d.]+) LUFS", err)[-1])


def main():
    for cfg_path in sorted((ROOT / "src" / "remotion" / "reels").glob("*/music.json")):
        reel_id = cfg_path.parent.name
        cfg = json.loads(cfg_path.read_text())
        if cfg.get("kind") == "pad":   # voice-led video: a quiet bed instead of drums (pad.py)
            st, choices = bed(reel_id, cfg), "pad"
        else:
            st, choices = beat(reel_id, cfg)
        tmp = OUT / f"{reel_id}-beat.wav"
        write_wav(tmp, st)
        # One static gain to -16 LUFS (the beat sits under the SFX; the full mix lands near the
        # -14 LUFS social target). Not single-pass loudnorm: that behaves like automatic gain
        # control and flattens the arrangement (the drop would stop feeling bigger).
        gain = TARGET_LUFS - integrated_lufs(tmp)
        subprocess.run(
            [ffmpeg(), "-y", "-loglevel", "error", "-i", str(tmp), "-af", f"volume={gain:.2f}dB",
             "-ar", str(SR), "-c:a", "libmp3lame", "-b:a", "192k", str(OUT / f"{reel_id}-beat.mp3")],
            check=True,
        )
        tmp.unlink()
        print(f"beat {reel_id}: {choices}")

    durations = {}
    for name, fn in sfx.ALL.items():
        seed(f"sfx:{name}")
        st = fn()
        write_wav(OUT / "sfx" / f"{name}.wav", st)
        durations[name] = round(st.shape[1] / SR, 3)
    # Sfx.tsx mounts each effect only for its length; keep that in sync automatically.
    (OUT / "sfx" / "manifest.json").write_text(json.dumps(durations, indent=2) + "\n")
    print("wrote", sorted(p.relative_to(ROOT).as_posix() for p in OUT.rglob("*.*")))


if __name__ == "__main__":
    main()

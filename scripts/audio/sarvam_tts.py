#!/usr/bin/env python3
"""Generate Debug Diaries voice parts with Sarvam TTS.

Usage:
  python3 scripts/audio/sarvam_tts.py parts.txt out_dir/

parts.txt: one voice part per block, blocks separated by a line containing only `---`.
Writes out_dir/p1.mp3, p2.mp3, ... (one Sarvam call per part, in order).

The API key is read from SARVAM_API_KEY (environment) or from the repo's .env file (gitignored). It is never printed.
Defaults match the channel voice; override with env vars SARVAM_SPEAKER, SARVAM_MODEL, SARVAM_PACE.
"""
import os
import pathlib
import sys
import time

from sarvamai import SarvamAI

ROOT = pathlib.Path(__file__).resolve().parents[2]


def api_key() -> str:
    k = os.environ.get("SARVAM_API_KEY")
    if k:
        return k.strip()
    env = ROOT / ".env"
    if env.exists():
        for line in env.read_text().splitlines():
            if line.strip().startswith("SARVAM_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    sys.exit("SARVAM_API_KEY not set (env var or .env)")


def main() -> None:
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    parts = [b.strip() for b in pathlib.Path(sys.argv[1]).read_text(encoding="utf-8").split("\n---\n") if b.strip()]
    out = pathlib.Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    client = SarvamAI(api_subscription_key=api_key())
    speaker = os.environ.get("SARVAM_SPEAKER", "shubh_enhi_ads")
    model = os.environ.get("SARVAM_MODEL", "bulbul:v4-flash")
    pace = float(os.environ.get("SARVAM_PACE", "1.1"))
    for i, text in enumerate(parts, 1):
        for attempt in range(3):
            try:
                audio = client.text_to_speech.convert_stream(
                    text=text, language_code="hi-IN", speaker=speaker, model=model, pace=pace, speech_sample_rate=24000, output_audio_codec="mp3",
                )
                data = audio if isinstance(audio, (bytes, bytearray)) else b"".join(audio)
                (out / f"p{i}.mp3").write_bytes(data)
                print(f"p{i}.mp3  {len(data)} bytes  ({len(text)} chars)")
                break
            except Exception as e:  # retry transient failures, never echo the key
                msg = str(e).replace(api_key(), "***")
                print(f"p{i} attempt {attempt + 1} failed: {msg[:300]}", file=sys.stderr)
                time.sleep(2 + attempt * 3)
        else:
            sys.exit(f"giving up on part {i}")


if __name__ == "__main__":
    main()

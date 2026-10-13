import wave, sys
from piper import PiperVoice
try:
    from piper import SynthesisConfig
except ImportError:
    SynthesisConfig = None
voice_dir = sys.argv[1]
name = voice_dir.split("voice-")[1]
v = PiperVoice.load(f"{voice_dir}/{name}.onnx", config_path=f"{voice_dir}/{name}.onnx.json")
parts = {
 "1": "3 AM. Ten thousand users... logged out. They log in, and point six seconds later, they're kicked out again. So... why?",
 "2": "Look at this line. Token dot exp is in seconds. Date dot now is in milliseconds. So every token looked a thousand times expired. The fix? Multiply exp by one thousand.",
 "3": "Lesson: always check your units. Next entry: the cache that lied. Follow Debug Diaries.",
}
for k, text in parts.items():
    path = f"out/{name}-{k}.wav"
    with wave.open(path, "wb") as w:
        if SynthesisConfig:
            v.synthesize_wav(text, w, syn_config=SynthesisConfig(length_scale=float(sys.argv[2]) if len(sys.argv) > 2 else 1.0))
        else:
            v.synthesize(text, w)
    with wave.open(path) as r:
        print(path, round(r.getnframes() / r.getframerate(), 2), "s")

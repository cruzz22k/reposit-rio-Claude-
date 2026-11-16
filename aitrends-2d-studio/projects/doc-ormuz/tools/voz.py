# Narração de documentário: Kokoro pm_alex, frase a frase, voz um pouco mais grave, limpa, comprimida, com sala curta.
# Uso: python3 tools/voz.py <pasta-kokoro> <versao> [velocidade]   -> input/narracao-<versao>.wav e input/timeline-<versao>.json
import json, sys, subprocess, os, soundfile as sf, numpy as np
from kokoro_onnx import Kokoro
K, V = sys.argv[1], sys.argv[2]; SPEED = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0
k = Kokoro(f'{K}/kokoro-v1.0.onnx', f'{K}/voices-v1.0.bin')
FX = ("asetrate=24000*0.94,aresample=48000,atempo=1.0638,highpass=f=70,lowpass=f=9500,"
      "equalizer=f=160:t=q:w=1:g=2.5,equalizer=f=3200:t=q:w=1.2:g=1.5,"
      "acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=2,aecho=0.85:0.5:28|46:0.10|0.06")
os.makedirs('build/voz', exist_ok=True)
frases = json.load(open('input/frases.json')); parts, t, timeline = [], 0.5, []
sil = lambda d: np.zeros(int(48000 * d), dtype=np.float32)
parts.append(sil(0.5))
for i, (txt, gap) in enumerate(frases):
    a, sr = k.create(txt, voice='pm_alex', speed=SPEED, lang='pt-br'); sf.write(f'build/voz/r{i}.wav', a, sr)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'build/voz/r{i}.wav', '-af', FX, '-ac', '1', f'build/voz/p{i}.wav'], check=True)
    y, _ = sf.read(f'build/voz/p{i}.wav', dtype='float32'); nz = np.where(np.abs(y) > 0.01)[0]; y = y[max(0, nz[0] - 240): nz[-1] + 4800]
    timeline.append({'i': i + 1, 'text': txt, 'start': round(t, 3), 'end': round(t + len(y) / 48000, 3)}); parts.append(y); t += len(y) / 48000
    parts.append(sil(gap)); t += gap
audio = np.concatenate(parts); audio = audio / max(1e-6, np.abs(audio).max()) * 0.85
sf.write(f'input/narracao-{V}.wav', np.stack([audio, audio], 1), 48000)
json.dump(timeline, open(f'input/timeline-{V}.json', 'w'), ensure_ascii=False, indent=1)
print(round(len(audio) / 48000, 2), 's')
for x in timeline: print(f"{x['i']:2d} {x['start']:6.2f}-{x['end']:6.2f}  {x['text']}")

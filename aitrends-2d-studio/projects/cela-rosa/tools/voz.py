# Narração (Kokoro pm_alex, voz limpa de documentário), frase a frase.
# Uso: python3 tools/voz.py <pasta-kokoro> [velocidade] -> input/voiceover.wav + timeline/frases.json
import sys, re, json, subprocess, os, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
K = sys.argv[1]; SPEED = float(sys.argv[2]) if len(sys.argv) > 2 else 1.05
k = Kokoro(f'{K}/kokoro-v1.0.onnx', f'{K}/voices-v1.0.bin')
FX = "asetrate=24000*0.96,aresample=48000,atempo=1.0417,highpass=f=70,equalizer=f=180:t=q:w=1:g=2,equalizer=f=3200:t=q:w=1.5:g=1.5,acompressor=threshold=-20dB:ratio=3:attack=10:release=150,volume=1.4"
FALA = {'1979': 'mil novecentos e setenta e nove', '156': 'cento e cinquenta e seis', '2014': 'dois mil e catorze', '59': 'cinquenta e nove', '15': 'quinze'}
def falado(s):
    s = s.replace('Schauss', 'Xáus').replace('Seattle', 'Siátou')
    for n in FALA: s = re.sub(rf'\b{n}\b', FALA[n], s)
    return s.replace('…', ',').replace('"', '')
frases = [l.strip() for l in open('input/script.txt') if l.strip()]
os.makedirs('build/voz', exist_ok=True)
sil = lambda d: np.zeros(int(48000 * d), dtype=np.float32)
parts, t, tl = [sil(0.3)], 0.3, []
for i, txt in enumerate(frases):
    a, sr = k.create(falado(txt), voice='pm_alex', speed=SPEED, lang='pt-br'); sf.write(f'build/voz/r{i}.wav', a, sr)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'build/voz/r{i}.wav', '-af', FX, '-ac', '1', f'build/voz/p{i}.wav'], check=True)
    y, _ = sf.read(f'build/voz/p{i}.wav', dtype='float32'); nz = np.where(np.abs(y) > 0.01)[0]; y = y[max(0, nz[0] - 240): nz[-1] + 3600]
    tl.append({'i': i, 'start': round(t, 3), 'end': round(t + len(y) / 48000, 3), 'text': txt}); parts.append(y); t += len(y) / 48000
    gap = 0.9 if i in (0, len(frases) - 2) else 0.45 if txt.endswith(('?', '.')) else 0.35
    parts.append(sil(gap)); t += gap
audio = np.concatenate(parts); audio = audio / max(1e-6, np.abs(audio).max()) * 0.89
sf.write('input/voiceover.wav', audio, 48000)
json.dump(tl, open('timeline/frases.json', 'w'), ensure_ascii=False, indent=1)
print(round(len(audio) / 48000, 2), 's')
for x in tl: print(f"{x['i']:2d} {x['start']:6.2f}-{x['end']:6.2f} {x['text'][:60]}")

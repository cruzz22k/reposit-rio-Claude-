# Tempo de cada palavra da narração: cada palavra é sintetizada sozinha com a mesma voz, e a sequência é
# alinhada à frase completa por DTW nos MFCCs (mesmo timbre, então o alinhamento é preciso).
# Uso: python3 tools/palavras.py <pasta-kokoro> <versao> <velocidade>  -> timeline/words-<versao>.json
import json, sys, subprocess, re, os, numpy as np, soundfile as sf, librosa
from kokoro_onnx import Kokoro
K, V, SPEED = sys.argv[1], sys.argv[2], float(sys.argv[3])
k = Kokoro(f'{K}/kokoro-v1.0.onnx', f'{K}/voices-v1.0.bin')
FX = open('tools/voz.py').read().split('FX = (')[1].split(')\n')[0]
FX = eval('(' + FX + ')')
SR = 48000; HOP = 240
nar, _ = sf.read(f'input/narracao-{V}.wav', dtype='float32'); nar = nar[:, 0]
tl = json.load(open(f'input/timeline-{V}.json')); os.makedirs('build/pal', exist_ok=True); out = []
def fx(a, sr, name):
    sf.write(f'build/pal/{name}_r.wav', a, sr)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'build/pal/{name}_r.wav', '-af', FX, '-ac', '1', f'build/pal/{name}.wav'], check=True)
    y, _ = sf.read(f'build/pal/{name}.wav', dtype='float32'); nz = np.where(np.abs(y) > 0.01)[0]
    return y[nz[0]: nz[-1] + 1] if len(nz) else y
feat = lambda y: librosa.feature.mfcc(y=y, sr=SR, n_mfcc=20, hop_length=HOP, n_fft=1024)[1:]
for s in tl:
    seg = nar[int(s['start'] * SR): int(s['end'] * SR)]
    words = re.findall(r"[\wÀ-ÿ]+", s['text'])
    pieces = [fx(*k.create(w, voice='pm_alex', speed=SPEED, lang='pt-br'), f"s{s['i']}_{j}") for j, w in enumerate(words)]
    bounds, cat = [], []; n = 0
    for p in pieces: bounds.append((n, n + len(p))); cat.append(p); n += len(p)
    A, B = feat(seg), feat(np.concatenate(cat))
    A = (A - A.mean(1, keepdims=True)) / (A.std(1, keepdims=True) + 1e-6); B = (B - B.mean(1, keepdims=True)) / (B.std(1, keepdims=True) + 1e-6)
    _, wp = librosa.sequence.dtw(X=B, Y=A, metric='cosine'); wp = wp[::-1]
    mapB = {}
    for b, a in wp: mapB.setdefault(b, a)
    def tB(sample): fb = min(B.shape[1] - 1, sample // HOP); return s['start'] + mapB.get(fb, 0) * HOP / SR
    for w, (b0, b1) in zip(words, bounds):
        out.append({'s': s['i'], 'word': w, 'start': round(tB(b0), 3), 'end': round(tB(b1 - 1), 3)})
    print(s['i'], ' '.join(f"{x['word']}@{x['start']:.2f}" for x in out if x['s'] == s['i']))
os.makedirs('timeline', exist_ok=True); json.dump({'words': out}, open(f'timeline/words-{V}.json', 'w'), ensure_ascii=False, indent=0)

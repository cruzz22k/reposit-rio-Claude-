# som_kit.py — efeitos sintetizados e a escrita do config.json/story/shots.json de cada episódio do Arquivo Morto.
import json, os, sys, subprocess
import numpy as np
KIT = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(KIT, '..', '..', '..'))
sys.path.insert(0, os.path.join(ROOT, 'audio'))
from dsp import SR, secs, noise, bp, lp, hp, expdec, stereo, fade, normalize, reverb, write_wav, rng

def clique(seed=1):
    n = secs(0.18); y = np.zeros(n, np.float32)
    for k, (at, f) in enumerate([(0.0, 2600), (0.045, 1900)]):
        a = secs(at); m = secs(0.03); y[a:a + m] += (bp(noise(m, seed + k), f * 0.6, f * 1.6) * expdec(m, 0.004))[: n - a]
    return normalize(fade(stereo(y, 0.0, 0.1), 0.001, 0.02), -3)
def maquina(dur, seed=1):
    n = secs(dur); r = rng(seed); y = np.zeros(n, np.float32); t = 0.0
    while t < dur - 0.04:
        a = secs(t); m = secs(0.035); k = bp(noise(m, int(r.integers(1e6))), 1500, 6000) * expdec(m, 0.006) * (0.6 + 0.4 * r.random())
        k += (np.sin(2 * np.pi * (180 + 60 * r.random()) * np.arange(m) / SR) * expdec(m, 0.01) * 0.5).astype(np.float32)
        y[a:a + m] += k[: n - a]; t += 0.055 + 0.06 * r.random()
    return normalize(fade(stereo(y, 0.1, 0.2), 0.002, 0.03), -4)
def caneta(dur, seed):
    n = secs(dur); x = bp(noise(n, seed), 2500, 9000); rough = lp(np.abs(noise(n, seed + 1)), 60) * 3 + 0.4
    y = x * rough * np.sin(np.pi * np.linspace(0, 1, n) ** 0.6) ** 0.7
    return normalize(fade(stereo(y, 0.1, 0.2), 0.04, 0.06), -4)
def nanquim(dur, seed):
    n = secs(dur); r = rng(seed); x = bp(noise(n, seed), 3000, 10000); env = np.zeros(n, np.float32); t = 0.0
    while t < dur - 0.1:
        a, d = secs(t), secs(0.1 + 0.25 * r.random()); env[a:a + d] += np.hanning(d)[: len(env[a:a + d])] * (0.3 + 0.7 * r.random()); t += 0.12 + 0.2 * r.random()
    return normalize(fade(stereo(x * lp(env, 30), 0.2, 0.4), 0.05, 0.1), -6)
def chiado(dur=0.7, seed=5):
    n = secs(dur); tt = np.arange(n) / SR; base = (np.sign(np.sin(2 * np.pi * 120 * tt)) * 0.3 + bp(noise(n, seed), 800, 5000) * 0.7).astype(np.float32)
    gate = np.repeat(rng(seed).random(int(dur * 30) + 1) > 0.45, secs(1 / 30))[:n].astype(np.float32)
    return normalize(fade(stereo(base * lp(gate, 200), 0.0, 0.3), 0.005, 0.08), -6)
def papel(dur=0.6, seed=1):
    n = secs(dur); r = rng(seed); x = bp(noise(n, seed), 1200, 6500); env = np.zeros(n, np.float32); t = 0.0
    while t < dur - 0.1:
        a, d = secs(t), secs(0.04 + 0.06 * r.random()); env[a:a + d] += np.hanning(d)[: len(env[a:a + d])] * (0.3 + 0.7 * r.random()); t += 0.05 + 0.07 * r.random()
    return normalize(reverb(fade(stereo(x * lp(env, 40) * 2, 0, 0.3), 0.03, 0.1), 0.5, 0.1, seed), -6)
def baque(seed=1):
    n = secs(0.5); x = lp(noise(n, seed), 260) * expdec(n, 0.07) * 3 + bp(noise(n, seed + 1), 900, 3000) * expdec(n, 0.015)
    return normalize(fade(stereo(x, 0.0, 0.1), 0.002, 0.1), -3)
def relogio(dur=6.0, seed=3, passo=1.0):
    n = secs(dur); y = np.zeros(n, np.float32); k = 0; t = 0.0
    while t < dur - 0.05:
        a = secs(t); m = secs(0.03); y[a:a + m] += bp(noise(m, seed + k), 2500 if k % 2 else 3200, 6000) * expdec(m, 0.004); k += 1; t += passo
    return normalize(fade(stereo(y, 0.0, 0.1), 0.005, 0.05), -6)
def dedo_vidro(dur=1.0, seed=4):         # dedo arrastando no vidro molhado: chiado agudo, com rangido
    n = secs(dur); tt = np.arange(n) / SR; x = bp(noise(n, seed), 2000, 7000) * (0.5 + 0.5 * lp(np.abs(noise(n, seed + 1)), 20) * 4)
    sq = np.sin(2 * np.pi * (900 + 300 * np.sin(2 * np.pi * 3 * tt)) * tt) * 0.15
    return normalize(fade(stereo((x + sq).astype(np.float32), 0.1, 0.2), 0.03, 0.08), -5)
def bafo(dur=1.2, seed=6):
    n = secs(dur); x = bp(noise(n, seed), 300, 2500) * np.sin(np.pi * np.linspace(0, 1, n)) ** 1.5
    return normalize(fade(stereo(x.astype(np.float32), 0.1, 0.3), 0.1, 0.2), -8)
def louca(seed=7):                        # prato de louça pousado na mesa
    n = secs(0.6); tt = np.arange(n) / SR; y = sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt / d) for f, d in [(1850, 0.12), (2730, 0.08), (4100, 0.05)]) * 0.4
    y += bp(noise(n, seed), 1500, 6000) * expdec(n, 0.01)
    return normalize(fade(stereo(y.astype(np.float32), 0.0, 0.2), 0.001, 0.1), -4)

class Trilha:
    def __init__(self, projeto, tl='input/timeline-v1.json'):
        self.P = projeto; self.TL = json.load(open(os.path.join(projeto, tl))); self.FX = {}; self.cues = []
        os.makedirs(os.path.join(projeto, 'build', 'sfx'), exist_ok=True)
    def S(self, i): return self.TL[i - 1]['start']
    def E(self, i): return self.TL[i - 1]['end']
    def Pw(self, i, w):
        f = self.TL[i - 1]; k = f['text'].index(w); return f['start'] + (f['end'] - f['start']) * k / len(f['text'])
    def fx(self, nome, x):
        if nome not in self.FX: f = os.path.join(self.P, 'build', 'sfx', nome + '.wav'); write_wav(f, x); self.FX[nome] = os.path.relpath(f, self.P)
        return self.FX[nome]
    def add(self, t, nome, gain, **kw): self.cues.append({'t': t, 'name': nome, 'gain': gain, **kw})
    def trocas(self, ts, gain=-18):
        for tc in ts: self.add(tc - 0.3, self.fx('chiado', chiado()), gain)
    def escrever(self, versao, dur, musica, voz='input/narracao-v1.wav', titulo='episodio'):
        vo = f'input/narracao-{versao}-trilha.wav'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(self.P, voz), '-t', str(dur), '-af', f'afade=t=out:st={dur - 0.6}:d=0.6', os.path.join(self.P, vo)], check=True)
        cfg = {'title': f'{titulo}-{versao}', 'voiceover': vo, 'loudness': -14, 'music': {'enabled': True, 'gainDb': -20, 'seed': 6}, 'sfx': {'enabled': True, 'gainDb': -4}}
        story = {'duration': dur, 'shots': [{'id': 'tudo', 'start': 0, 'end': dur}], 'music': [m for m in musica if m['start'] < dur], 'sfx': [c for c in self.cues if c['t'] < dur]}
        json.dump(cfg, open(os.path.join(self.P, 'config.json'), 'w'), ensure_ascii=False, indent=1)
        os.makedirs(os.path.join(self.P, 'story'), exist_ok=True); json.dump(story, open(os.path.join(self.P, 'story', 'shots.json'), 'w'), ensure_ascii=False, indent=1)
        print(f"{len(story['sfx'])} efeitos. config.json e story/shots.json prontos.")

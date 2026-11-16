# Trilha do Caso 002 (estilo mesa de evidências): giz riscando a ardósia enquanto o texto se escreve,
# caneta riscando papel nos círculos vermelhos, papel, e um grave no fim. Escreve config.json e story/shots.json
# para o mixer do estúdio (audio/mix.py), que abaixa a música quando a voz entra e normaliza o volume.
# Uso: python3 tools/som.py <versao> <duracao>      (a duração corta a narração; a amostra usa 21,3 s)
import json, os, sys, subprocess
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(HERE); ROOT = os.path.dirname(os.path.dirname(P))
sys.path.insert(0, os.path.join(ROOT, 'audio'))
from dsp import SR, secs, noise, bp, lp, expdec, stereo, fade, normalize, reverb, write_wav, rng
V = sys.argv[1]; DUR = float(sys.argv[2])
TL = json.load(open(os.path.join(P, 'input', 'timeline-v1.json')))
S = lambda i: TL[i - 1]['start']
def Pw(i, w):
    f = TL[i - 1]; k = f['text'].index(w); return f['start'] + (f['end'] - f['start']) * k / len(f['text'])
os.makedirs(os.path.join(P, 'build', 'sfx'), exist_ok=True)

def giz(dur, seed):          # giz na ardósia: atrito seco em rajadas curtas (uma por traço), com um chiado agudo raro
    n = secs(dur); r = rng(seed); x = bp(noise(n, seed), 1800, 7500)
    env = np.zeros(n, np.float32); t = 0.0
    while t < dur - 0.05:
        a, d = secs(t), secs(0.04 + 0.09 * r.random()); seg = np.hanning(d) * (0.5 + 0.5 * r.random()); env[a:a + d] += seg[: len(env[a:a + d])]; t += 0.05 + 0.08 * r.random()
    y = x * lp(env, 60) * 2.2
    k = secs(0.12); s0 = secs(dur * 0.4); tt = np.arange(k) / SR
    y[s0:s0 + k] += (np.sin(2 * np.pi * 3100 * tt) * np.hanning(k) * 0.08)[: len(y[s0:s0 + k])]
    return normalize(fade(stereo(y, 0.1, 0.3), 0.02, 0.06), -5)
def caneta(dur, seed):
    n = secs(dur); x = bp(noise(n, seed), 2500, 9000); rough = lp(np.abs(noise(n, seed + 1)), 60) * 3 + 0.4
    y = x * rough * np.sin(np.pi * np.linspace(0, 1, n) ** 0.6) ** 0.7
    return normalize(fade(stereo(y, 0.1, 0.2), 0.04, 0.06), -4)
def papel(dur=0.7, seed=1):
    n = secs(dur); r = rng(seed); x = bp(noise(n, seed), 1200, 6500); env = np.zeros(n, np.float32); t = 0.0
    while t < dur - 0.1:
        a, d = secs(t), secs(0.04 + 0.06 * r.random()); env[a:a + d] += np.hanning(d)[: len(env[a:a + d])] * (0.3 + 0.7 * r.random()); t += 0.05 + 0.07 * r.random()
    return normalize(reverb(fade(stereo(x * lp(env, 40) * 2, 0, 0.3), 0.03, 0.1), 0.5, 0.1, seed), -6)
FX = {}
def save(name, x): f = os.path.join(P, 'build', 'sfx', name + '.wav'); write_wav(f, x); FX[name] = os.path.relpath(f, P)
save('giz_titulo', giz(1.5, 3)); save('giz_metade', giz(1.0, 5)); save('giz_nove', giz(0.8, 7)); save('giz_seta', giz(0.4, 9))
save('caneta_1', caneta(0.75, 2)); save('caneta_2', caneta(0.7, 4)); save('caneta_sub', caneta(0.5, 6)); save('papel', papel())

cues = [
  {'t': S(1) + 0.55, 'name': FX['giz_titulo'], 'gain': -16, 'what': 'giz: título'},
  {'t': Pw(3, 'metade'), 'name': FX['caneta_1'], 'gain': -15, 'what': 'círculo no anúncio'},
  {'t': Pw(3, 'metade') + 0.1, 'name': FX['giz_metade'], 'gain': -19, 'what': 'giz: metade do preço'},
  {'t': Pw(4, 'nove'), 'name': FX['caneta_2'], 'gain': -15, 'what': 'círculo nos 9,00 m'},
  {'t': Pw(4, 'nove') + 0.05, 'name': FX['giz_nove'], 'gain': -19, 'what': 'giz: 9,00 m ?'},
  {'t': Pw(4, 'nove') + 0.5, 'name': FX['giz_seta'], 'gain': -20, 'what': 'giz: seta'},
  {'t': Pw(5, 'pintura'), 'name': FX['caneta_sub'], 'gain': -16, 'what': 'sublinhado: pintura nova'},
  {'t': S(2) + 0.2, 'name': FX['papel'], 'gain': -22, 'what': 'papel ao passar pela sala'},
  {'t': S(4) + 0.5, 'name': 'whoosh', 'dur': 2.0, 'gain': -24, 'seed': 3, 'pitch': 0.6, 'what': 'câmera entra no corredor'},
  {'t': S(5) + 0.8, 'name': 'impact', 'dur': 3.0, 'gain': -16, 'pitch': 0.6, 'seed': 4, 'what': 'grave: pintura nova'},
]
# a narração cortada no tamanho da amostra
src = os.path.join(P, 'input', 'narracao-v1.wav'); vo = f'input/narracao-{V}.wav'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-t', str(DUR), '-af', f'afade=t=out:st={DUR - 0.6}:d=0.6', os.path.join(P, vo)], check=True)
cfg = {'title': f'arquivo-morto-caso-002-{V}', 'voiceover': vo, 'loudness': -14,
       'music': {'enabled': True, 'gainDb': -20, 'seed': 6}, 'sfx': {'enabled': True, 'gainDb': -4}}
story = {'duration': DUR, 'shots': [{'id': 'tudo', 'start': 0, 'end': DUR}],
         'music': [{'start': 0, 'end': DUR, 'mood': 'mystery', 'intensity': 0.35}],
         'sfx': [{k: v for k, v in c.items() if k != 'what'} for c in cues if c['t'] < DUR]}
json.dump(cfg, open(os.path.join(P, 'config.json'), 'w'), ensure_ascii=False, indent=1)
os.makedirs(os.path.join(P, 'story'), exist_ok=True); json.dump(story, open(os.path.join(P, 'story', 'shots.json'), 'w'), ensure_ascii=False, indent=1)
print(f"{len(story['sfx'])} efeitos. config.json e story/shots.json prontos.")

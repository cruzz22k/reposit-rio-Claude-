# Trilha do documentário: gera os efeitos que a regra SOM pede (papel caindo, caneta riscando, assobio nos voos,
# carimbo, grave), confere que nenhum efeito começa em cima do começo de uma palavra e escreve config.json +
# story/shots.json para o mixer do estúdio (audio/mix.py), que mistura com a voz, abaixa a música quando a voz
# entra e normaliza o volume.
# Uso: python3 tools/som.py <versao>
import json, os, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(HERE); ROOT = os.path.dirname(os.path.dirname(P))
sys.path.insert(0, os.path.join(ROOT, 'audio'))
from dsp import SR, secs, noise, bp, hp, lp, expdec, stereo, fade, normalize, reverb, write_wav, rng
V = sys.argv[1] if len(sys.argv) > 1 else 'v1'
words = json.load(open(os.path.join(P, 'timeline', 'words-v2.json')))['words']
W = lambda s, w, n=1: [x for x in words if x['s'] == s and x['word'].lower() == w.lower()][n - 1]['start']
os.makedirs(os.path.join(P, 'build', 'sfx'), exist_ok=True)

def papel(dur=1.4, seed=1):   # folha caindo: farfalhar com batidas irregulares e um toque leve ao assentar
    n = secs(dur); r = rng(seed); x = bp(noise(n, seed), 1500, 7000)
    env = np.zeros(n, np.float32); t = 0.0
    while t < dur - 0.25:
        a, d = secs(t), secs(0.05 + 0.08 * r.random()); env[a:a + d] += np.hanning(d)[: len(env[a:a + d])] * (0.4 + 0.6 * r.random()); t += 0.06 + 0.1 * r.random()
    y = x * lp(env, 40) * 2.5
    land = secs(dur - 0.22); k = secs(0.12); y[land:land + k] += (bp(noise(k, seed + 3), 300, 2500) * expdec(k, 0.025))[: len(y[land:land + k])] * 1.4
    return normalize(reverb(fade(stereo(y, 0, 0.4), 0.06, 0.1), 0.6, 0.12, seed), -3)
def caneta(dur=0.5, seed=2):   # marcador riscando papel: chiado agudo com aspereza
    n = secs(dur); r = rng(seed); x = bp(noise(n, seed), 2500, 9000)
    rough = lp(np.abs(noise(n, seed + 1)), 60) * 3 + 0.4
    y = x * rough * np.sin(np.pi * np.linspace(0, 1, n) ** 0.6) ** 0.7
    return normalize(fade(stereo(y, 0.1, 0.2), 0.06, 0.08), -4)
def carimbo(seed=3):            # batida seca de madeira e borracha no papel
    n = secs(0.9); t = np.arange(n) / SR
    body = np.sin(2 * np.pi * (90 + 160 * np.exp(-t / 0.02)) * t) * expdec(n, 0.09)
    slap = bp(noise(n, seed), 600, 5000) * expdec(n, 0.018)
    return normalize(reverb(stereo(body * 1.2 + slap * 0.9, 0, 0.2), 0.7, 0.16, seed), -1)
FX = {}
def save(name, x): f = os.path.join(P, 'build', 'sfx', name + '.wav'); write_wav(f, x); FX[name] = os.path.relpath(f, P); return FX[name]
save('papel', papel(1.4)); save('caneta_curta', caneta(0.38, 2)); save('caneta_circulo', caneta(0.75, 4)); save('caneta_minas', caneta(0.6, 6)); save('carimbo', carimbo())

STAMP = W(12, 'fechou') + 0.15
cues = [
  # caneta riscando (regra 5: círculo e cota se desenham na palavra; o som entra suave logo depois do começo dela)
  {'t': W(1, 'três') + 0.11, 'name': FX['caneta_curta'], 'gain': -14, 'what': 'cota 3 km'},
  {'t': 5.14, 'name': FX['papel'], 'gain': -11, 'what': 'ficha caindo'},
  {'t': W(3, 'única') + 0.11, 'name': FX['caneta_circulo'], 'gain': -14, 'what': 'círculo no estreito'},
  {'t': W(13, 'minas') + 0.11, 'name': FX['caneta_minas'], 'gain': -14, 'what': 'círculo nas minas'},
  {'t': W(14, 'três') + 0.11, 'name': FX['caneta_curta'], 'gain': -15, 'what': 'cota 3 km de novo'},
  # assobio nos voos
  {'t': 7.30, 'name': 'whoosh', 'dur': 2.2, 'gain': -15, 'seed': 3, 'pitch': 0.8, 'what': 'voo: corredor -> estreito'},
  {'t': 21.18, 'name': 'whoosh', 'dur': 1.7, 'gain': -13, 'seed': 5, 'pitch': 0.7, 'what': 'voo: estreito -> planeta'},
  {'t': 25.10, 'name': 'whoosh', 'dur': 3.2, 'gain': -16, 'seed': 7, 'pitch': 0.6, 'what': 'voo: planeta -> Golfo'},
  {'t': 37.45, 'name': 'whoosh', 'dur': 2.8, 'gain': -15, 'seed': 9, 'pitch': 0.75, 'what': 'voo: Golfo -> corredor'},
  {'t': 44.40, 'name': 'whoosh', 'dur': 3.0, 'gain': -21, 'seed': 11, 'pitch': 0.6, 'what': 'subida: corredor -> estreito'},
  {'t': 59.70, 'name': 'whoosh', 'dur': 1.8, 'gain': -15, 'seed': 13, 'pitch': 0.8, 'what': 'voo de volta ao corredor'},
  # carimbo com grave; graves nos momentos que pesam
  {'t': STAMP, 'name': FX['carimbo'], 'gain': -7, 'what': 'carimbo FECHADO DE NOVO'},
  {'t': STAMP, 'name': 'impact', 'dur': 2.5, 'gain': -12, 'pitch': 0.8, 'seed': 3, 'what': 'grave do carimbo'},
  {'t': 25.22, 'name': 'impact', 'dur': 3.0, 'gain': -13, 'pitch': 0.65, 'seed': 4, 'what': 'grave: 1984, a guerra'},
  {'t': W(10, 'março') + 0.2, 'name': 'impact', 'dur': 3.0, 'gain': -12, 'pitch': 0.65, 'seed': 5, 'what': 'grave: março de 2026'},
  {'t': W(14, 'nove') + 0.2, 'name': 'impact', 'dur': 3.0, 'gain': -13, 'pitch': 0.6, 'seed': 6, 'what': 'grave: passaram nove'},
]
# regra: efeito nunca em cima do começo de uma palavra (janela de -60 ms a +100 ms em volta de cada começo)
bad = []
for c in cues:
    for x in words:
        if x['start'] - 0.06 <= c['t'] <= x['start'] + 0.10: bad.append((c['what'], round(c['t'], 2), x['word'], x['start']))
for b in bad: print('EM CIMA DO COMEÇO DE PALAVRA:', b)
if bad: sys.exit(1)
dur = 68.06
cfg = {'title': f'ormuz-documentario-{V}', 'voiceover': 'input/narracao-v2.wav', 'loudness': -14,
       'music': {'enabled': True, 'gainDb': -24, 'seed': 4}, 'sfx': {'enabled': True, 'gainDb': -6}}
story = {'duration': dur, 'shots': [{'id': 'tudo', 'start': 0, 'end': dur}],
         'music': [{'start': 0, 'end': 25.2, 'mood': 'dark', 'intensity': 0.35}, {'start': 25.2, 'end': 44.0, 'mood': 'tension', 'intensity': 0.3}, {'start': 44.0, 'end': dur, 'mood': 'dark', 'intensity': 0.45}],
         'sfx': [{k: v for k, v in c.items() if k != 'what'} for c in cues]}
json.dump(cfg, open(os.path.join(P, 'config.json'), 'w'), ensure_ascii=False, indent=1)
os.makedirs(os.path.join(P, 'story'), exist_ok=True); json.dump(story, open(os.path.join(P, 'story', 'shots.json'), 'w'), ensure_ascii=False, indent=1)
print(f'{len(cues)} efeitos, nenhum em cima do começo de uma palavra. config.json e story/shots.json prontos.')

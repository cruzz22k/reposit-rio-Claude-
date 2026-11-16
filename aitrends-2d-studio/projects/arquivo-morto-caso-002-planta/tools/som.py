# Trilha do Caso 002 no estilo Planta no escuro: o clique da lanterna, a luz chiando na troca de cena, a máquina de escrever
# nas etiquetas, a caneta nos círculos, a trena medindo o corredor e um grave quando o espaço atrás da parede aparece.
# Escreve config.json e story/shots.json para o mixer do estúdio (audio/mix.py).
# Uso: python3 tools/som.py <versao> <duracao>
import json, os, sys, subprocess
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(HERE); ROOT = os.path.dirname(os.path.dirname(P))
sys.path.insert(0, os.path.join(ROOT, 'audio'))
from dsp import SR, secs, noise, bp, lp, hp, expdec, stereo, fade, normalize, reverb, write_wav, rng, sine
V = sys.argv[1]; DUR = float(sys.argv[2])
TL = json.load(open(os.path.join(P, 'input', 'timeline-v1.json')))
S = lambda i: TL[i - 1]['start']; E = lambda i: TL[i - 1]['end']
def Pw(i, w):
    f = TL[i - 1]; k = f['text'].index(w); return f['start'] + (f['end'] - f['start']) * k / len(f['text'])
T2, T3, T4 = 3.35, 10.1, 13.65
os.makedirs(os.path.join(P, 'build', 'sfx'), exist_ok=True)

def clique(seed=1):                     # interruptor da lanterna: dois estalos secos
    n = secs(0.18); y = np.zeros(n, np.float32)
    for k, (at, f) in enumerate([(0.0, 2600), (0.045, 1900)]):
        a = secs(at); m = secs(0.03); y[a:a + m] += (bp(noise(m, seed + k), f * 0.6, f * 1.6) * expdec(m, 0.004))[: n - a]
    return normalize(fade(stereo(y, 0.0, 0.1), 0.001, 0.02), -3)
def maquina(dur, seed=1):               # máquina de escrever: teclas irregulares com um baque metálico
    n = secs(dur); r = rng(seed); y = np.zeros(n, np.float32); t = 0.0
    while t < dur - 0.04:
        a = secs(t); m = secs(0.035); k = bp(noise(m, int(r.integers(1e6))), 1500, 6000) * expdec(m, 0.006) * (0.6 + 0.4 * r.random())
        k += (np.sin(2 * np.pi * (180 + 60 * r.random()) * np.arange(m) / SR) * expdec(m, 0.01) * 0.5).astype(np.float32)
        y[a:a + m] += k[: n - a]; t += 0.055 + 0.06 * r.random()
    return normalize(fade(stereo(y, 0.1, 0.2), 0.002, 0.03), -4)
def caneta(dur, seed):                  # caneta riscando papel
    n = secs(dur); x = bp(noise(n, seed), 2500, 9000); rough = lp(np.abs(noise(n, seed + 1)), 60) * 3 + 0.4
    y = x * rough * np.sin(np.pi * np.linspace(0, 1, n) ** 0.6) ** 0.7
    return normalize(fade(stereo(y, 0.1, 0.2), 0.04, 0.06), -4)
def nanquim(dur, seed):                 # pena de nanquim desenhando, bem baixinho
    n = secs(dur); r = rng(seed); x = bp(noise(n, seed), 3000, 10000); env = np.zeros(n, np.float32); t = 0.0
    while t < dur - 0.1:
        a, d = secs(t), secs(0.1 + 0.25 * r.random()); env[a:a + d] += np.hanning(d)[: len(env[a:a + d])] * (0.3 + 0.7 * r.random()); t += 0.12 + 0.2 * r.random()
    return normalize(fade(stereo(x * lp(env, 30), 0.2, 0.4), 0.05, 0.1), -6)
def trena(dur, seed=3):                 # trena correndo: catraca que acelera e para
    n = secs(dur); y = np.zeros(n, np.float32); t = 0.0; r = rng(seed)
    while t < dur - 0.02:
        a = secs(t); m = secs(0.012); y[a:a + m] += (bp(noise(m, int(r.integers(1e6))), 2000, 7000) * expdec(m, 0.002))[: n - a]; k = t / dur; t += 0.05 - 0.035 * np.sin(np.pi * min(1, k * 1.1)) ** 0.5
    s = secs(0.06); y[-s:] += (bp(noise(s, seed + 9), 300, 2500) * expdec(s, 0.01) * 2)[:s]
    return normalize(fade(stereo(y, 0.0, 0.2), 0.005, 0.03), -5)
def chiado(dur=0.7, seed=5):            # lâmpada chiando e piscando
    n = secs(dur); tt = np.arange(n) / SR; base = (np.sign(np.sin(2 * np.pi * 120 * tt)) * 0.3 + bp(noise(n, seed), 800, 5000) * 0.7).astype(np.float32)
    gate = np.repeat(rng(seed).random(int(dur * 30) + 1) > 0.45, secs(1 / 30))[:n].astype(np.float32)
    return normalize(fade(stereo(base * lp(gate, 200), 0.0, 0.3), 0.005, 0.08), -6)
def papel(dur=0.6, seed=1):
    n = secs(dur); r = rng(seed); x = bp(noise(n, seed), 1200, 6500); env = np.zeros(n, np.float32); t = 0.0
    while t < dur - 0.1:
        a, d = secs(t), secs(0.04 + 0.06 * r.random()); env[a:a + d] += np.hanning(d)[: len(env[a:a + d])] * (0.3 + 0.7 * r.random()); t += 0.05 + 0.07 * r.random()
    return normalize(reverb(fade(stereo(x * lp(env, 40) * 2, 0, 0.3), 0.03, 0.1), 0.5, 0.1, seed), -6)

FX = {}
def save(name, x): f = os.path.join(P, 'build', 'sfx', name + '.wav'); write_wav(f, x); FX[name] = os.path.relpath(f, P)
save('clique', clique()); save('chiado', chiado()); save('trena', trena(Pw(4, 'nove') + 0.15 - Pw(4, 'corredor')))
for nm, d, sd in [('maq_tag', 0.65, 1), ('maq_ago', 0.5, 2), ('maq_ed', 0.7, 3), ('maq_ap', 0.4, 4), ('maq_lucia', 0.35, 5), ('maq_vist', 0.8, 6), ('maq_pint', 0.5, 7), ('maq_comodos', 0.4, 8)]: save(nm, maquina(d, sd))
save('caneta_circ', caneta(0.6, 2)); save('caneta_hach', caneta(0.9, 4)); save('caneta_barra', caneta(0.5, 6)); save('caneta_meia', caneta(1.0, 8))
save('nanquim_predio', nanquim(2.4, 3)); save('nanquim_planta', nanquim(1.4, 5)); save('papel', papel())

tq = Pw(2, 'quinhentos')
cues = [
  {'t': 0.28, 'name': FX['clique'], 'gain': -12, 'what': 'lanterna liga'},
  {'t': 0.3, 'name': FX['chiado'], 'gain': -24, 'what': 'luz firmando'},
  {'t': 0.45, 'name': FX['maq_tag'], 'gain': -17, 'what': 'ARQUIVO MORTO · CASO 002'},
  {'t': Pw(1, 'O corredor'), 'name': 'swish', 'dur': 0.6, 'gain': -26, 'pitch': 0.5, 'seed': 2, 'what': 'título'},
  {'t': Pw(1, 'encolhe') - 0.05, 'name': FX['caneta_meia'], 'gain': -22, 'what': 'cota vermelha'},
] + [{'t': tc, 'name': 'tick', 'gain': -20, 'pitch': 0.6, 'seed': 8 + k, 'what': 'cota encolhe'} for k, tc in enumerate([2.25, 2.55, 2.85, 3.15])] + [
  {'t': T2 - 0.3, 'name': FX['chiado'], 'gain': -17, 'what': 'luz pisca: prédio'},
  {'t': T2 + 0.1, 'name': FX['nanquim_predio'], 'gain': -24, 'what': 'prédio se desenhando'},
  {'t': Pw(2, 'agosto'), 'name': FX['maq_ago'], 'gain': -18, 'what': 'AGO 2021'},
  {'t': Pw(2, 'Lúcia'), 'name': FX['clique'], 'gain': -18, 'what': 'janela acende'},
  {'t': Pw(2, 'Lúcia'), 'name': 'hum', 'dur': 2.5, 'gain': -30, 'seed': 31, 'what': 'luz da janela'},
  {'t': tq - 0.1, 'name': FX['caneta_barra'], 'gain': -22, 'what': 'linha de chamada'},
  {'t': tq + 0.1, 'name': FX['maq_ap'], 'gain': -18, 'what': 'AP. 503'},
  {'t': tq + 0.45, 'name': FX['maq_lucia'], 'gain': -19, 'what': 'LÚCIA'},
  {'t': Pw(2, 'Edifício'), 'name': FX['maq_ed'], 'gain': -18, 'what': 'EDIFÍCIO MARAJOARA'},
  {'t': 8.9, 'name': 'whoosh', 'dur': 1.3, 'gain': -24, 'pitch': 0.55, 'seed': 3, 'what': 'câmera entra na janela'},
  {'t': T3 - 0.3, 'name': FX['chiado'], 'gain': -17, 'what': 'luz pisca: fichas'},
  {'t': T3 + 0.08, 'name': FX['papel'], 'gain': -18, 'what': 'fichas caindo'},
  {'t': T3 + 0.5, 'name': FX['caneta_barra'], 'gain': -22, 'what': 'barras'},
  {'t': Pw(3, 'metade'), 'name': FX['caneta_circ'], 'gain': -14, 'what': 'círculo no 1.150'},
  {'t': T4 - 0.3, 'name': FX['chiado'], 'gain': -17, 'what': 'luz pisca: planta'},
  {'t': T4 + 0.05, 'name': FX['nanquim_planta'], 'gain': -23, 'what': 'planta se desenhando'},
  {'t': 13.95, 'name': 'whoosh', 'dur': 1.0, 'gain': -24, 'pitch': 0.45, 'seed': 5, 'what': 'paredes sobem'},
  {'t': T4 + 0.8, 'name': FX['maq_comodos'], 'gain': -24, 'what': 'nomes dos cômodos'},
  {'t': S(4) + 0.05, 'name': FX['maq_vist'], 'gain': -19, 'what': 'VISTORIA DE ENTRADA'},
  {'t': Pw(4, 'corredor'), 'name': FX['trena'], 'gain': -15, 'what': 'trena mede o corredor'},
  {'t': S(5) + 0.25, 'name': FX['caneta_hach'], 'gain': -16, 'what': 'hachura: pintura nova'},
  {'t': Pw(5, 'pintura'), 'name': FX['maq_pint'], 'gain': -18, 'what': 'PINTURA NOVA'},
  {'t': 20.3, 'name': 'impact', 'dur': 3.0, 'gain': -14, 'pitch': 0.5, 'seed': 4, 'what': 'o espaço atrás da parede'},
  {'t': 20.3, 'name': 'glitch', 'dur': 0.5, 'gain': -24, 'seed': 33, 'what': 'tracejado piscando'},
]
src = os.path.join(P, '..', 'arquivo-morto-caso-002', 'input', 'narracao-v1.wav'); vo = f'input/narracao-{V}.wav'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-t', str(DUR), '-af', f'afade=t=out:st={DUR - 0.6}:d=0.6', os.path.join(P, vo)], check=True)
cfg = {'title': f'arquivo-morto-caso-002-planta-{V}', 'voiceover': vo, 'loudness': -14,
       'music': {'enabled': True, 'gainDb': -20, 'seed': 6}, 'sfx': {'enabled': True, 'gainDb': -4}}
story = {'duration': DUR, 'shots': [{'id': 'tudo', 'start': 0, 'end': DUR}],
         'music': [{'start': 0, 'end': DUR, 'mood': 'mystery', 'intensity': 0.35}],
         'sfx': [{k: v for k, v in c.items() if k != 'what'} for c in cues if c['t'] < DUR]}
json.dump(cfg, open(os.path.join(P, 'config.json'), 'w'), ensure_ascii=False, indent=1)
os.makedirs(os.path.join(P, 'story'), exist_ok=True); json.dump(story, open(os.path.join(P, 'story', 'shots.json'), 'w'), ensure_ascii=False, indent=1)
print(f"{len(story['sfx'])} efeitos. config.json e story/shots.json prontos.")

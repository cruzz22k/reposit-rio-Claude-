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

# ---------- segunda parte (frases 6 a 18) ----------
T5, T5b, T6, T7, T8, T9, T10, T11, T12 = 20.95, 25.3, 29.1, 41.85, 45.62, 52.5, 55.62, 65.45, 70.4
def baque(seed=1):                      # a parede andando: um tranco seco e grave
    n = secs(0.5); x = lp(noise(n, seed), 260) * expdec(n, 0.07) * 3 + bp(noise(n, seed + 1), 900, 3000) * expdec(n, 0.015)
    return normalize(fade(stereo(x, 0.0, 0.1), 0.002, 0.1), -3)
def pozinho(dur=3.0, seed=2):           # grãos caindo
    n = secs(dur); r = rng(seed); y = np.zeros(n, np.float32)
    for _ in range(int(dur * 60)):
        a = int(r.random() * (n - 400)); m = 200; y[a:a + m] += (bp(noise(m, int(r.integers(1e6))), 4000, 11000) * expdec(m, 0.0015) * r.random())
    return normalize(fade(stereo(y, 0.3, 0.6), 0.2, 0.4), -8)
def relogio(dur=6.0, seed=3):
    n = secs(dur); y = np.zeros(n, np.float32)
    for k in range(int(dur)):
        a = secs(k); m = secs(0.03); y[a:a + m] += bp(noise(m, seed + k), 2500 if k % 2 else 3200, 6000) * expdec(m, 0.004)
    return normalize(fade(stereo(y, 0.0, 0.1), 0.005, 0.05), -6)
save('baque', baque()); save('pozinho', pozinho()); save('relogio', relogio(E(12) - S(12) + 1)); save('trena2', trena(1.0, 5)); save('trena3', trena(0.8, 7))
save('caneta_longa', caneta(1.2, 10)); save('caneta_x', caneta(0.18, 12)); save('caneta_falta', caneta(0.9, 14)); save('maq_final', maquina(0.9, 9)); save('papel2', papel(0.7, 3)); save('papel3', papel(0.9, 5))
for k, tc in enumerate([T5, T5b, T6, T7, T8, T9, T10, T11, T12]): cues.append({'t': tc - 0.3, 'name': FX['chiado'], 'gain': -18, 'what': f'luz pisca {k}'})
cues += [
  {'t': T5 + 0.05, 'name': FX['papel2'], 'gain': -18, 'what': 'pedido do tapete'},
  {'t': S(6), 'name': FX['maq_ago'], 'gain': -19, 'what': 'SET 2021'},
  {'t': T5 + 0.3, 'name': FX['caneta_longa'], 'gain': -22, 'what': 'desenho da passadeira'},
  {'t': Pw(6, 'ponta a ponta') - 0.3, 'name': FX['caneta_barra'], 'gain': -18, 'what': 'cota 9,00'},
  {'t': Pw(6, 'sob medida'), 'name': FX['caneta_x'], 'gain': -18, 'what': 'pago'},
  {'t': T5b + 0.2, 'name': 'whoosh', 'dur': 1.5, 'gain': -22, 'pitch': 0.4, 'seed': 11, 'what': 'tapete desenrolando'},
  {'t': Pw(7, 'quinze') - 0.1, 'name': 'hit', 'gain': -18, 'pitch': 0.6, 'seed': 4, 'what': 'sobraram 15 cm'},
  {'t': S(8) + 0.6, 'name': FX['trena'], 'gain': -16, 'what': 'trena de domingo'},
  {'t': S(8), 'name': FX['maq_vist'], 'gain': -20, 'what': 'TODO DOMINGO'},
  {'t': Pw(9, 'Oito e setenta'), 'name': FX['baque'], 'gain': -12, 'what': 'parede anda (19/09)'},
  {'t': Pw(9, 'Oito e setenta') + 0.05, 'name': FX['trena2'], 'gain': -20, 'what': 'trena'},
  {'t': Pw(9, 'Oito e cinquenta'), 'name': FX['baque'], 'gain': -11, 'what': 'parede anda (26/09)'},
  {'t': Pw(9, 'Oito e cinquenta') + 0.05, 'name': FX['trena3'], 'gain': -20, 'what': 'trena'},
  {'t': Pw(10, 'Sempre'), 'name': 'tick', 'gain': -16, 'pitch': 0.5, 'seed': 30, 'what': 'sempre quinze'},
  {'t': T7 + 0.2, 'name': FX['pozinho'], 'gain': -14, 'what': 'pó caindo'},
  {'t': S(11), 'name': FX['maq_comodos'], 'gain': -21, 'what': 'SEGUNDA 06:40'},
  {'t': Pw(11, 'pó'), 'name': FX['caneta_barra'], 'gain': -20, 'what': 'etiqueta pó branco'},
  {'t': S(12), 'name': FX['relogio'], 'gain': -18, 'what': 'relógio de madrugada'},
  {'t': Pw(12, 'acendia') - 0.05, 'name': FX['clique'], 'gain': -10, 'what': 'a luz acende sozinha'},
  {'t': Pw(12, 'acendia'), 'name': 'hum', 'dur': 6.0, 'gain': -26, 'seed': 32, 'what': 'lâmpada zumbindo'},
  {'t': Pw(12, 'único interruptor'), 'name': FX['caneta_circ'], 'gain': -15, 'what': 'círculo no interruptor'},
  {'t': S(13), 'name': FX['papel3'], 'gain': -19, 'what': 'calendário'},
  {'t': S(13), 'name': FX['maq_ago'], 'gain': -20, 'what': 'OUT 2021'},
] + [{'t': Pw(13, 'viajou') + i * 0.32 + j * 0.18, 'name': FX['caneta_x'], 'gain': -17, 'what': f'X dia {15 + i}'} for i in range(4) for j in range(2)] + [
  {'t': E(13) - 0.2, 'name': FX['caneta_circ'], 'gain': -19, 'what': 'volta na terça'},
  {'t': T10 + 0.05, 'name': FX['papel2'], 'gain': -19, 'what': 'caderno'},
  {'t': Pw(14, 'já estava') - 0.2, 'name': FX['caneta_longa'], 'gain': -15, 'what': 'a linha que ela não escreveu'},
  {'t': Pw(14, 'já estava'), 'name': 'riser', 'dur': 2.5, 'gain': -26, 'pitch': 0.6, 'seed': 5, 'what': 'tensão'},
  {'t': S(15) - 0.2, 'name': FX['caneta_barra'], 'gain': -21, 'what': 'linha de inclinação 1'},
  {'t': Pw(15, 'mais inclinada') - 0.1, 'name': FX['caneta_barra'], 'gain': -19, 'what': 'linha de inclinação 2'},
  {'t': Pw(16, 'falta') - 0.15, 'name': FX['caneta_falta'], 'gain': -14, 'what': 'falta pouco'},
  {'t': Pw(16, 'falta') + 0.9, 'name': 'impact', 'dur': 3.0, 'gain': -13, 'pitch': 0.45, 'seed': 6, 'what': 'grave'},
  {'t': T11 + 0.05, 'name': FX['papel3'], 'gain': -16, 'what': 'planta original'},
  {'t': T11 + 0.1, 'name': FX['nanquim_planta'], 'gain': -22, 'what': 'planta se desenhando'},
  {'t': S(17), 'name': FX['maq_vist'], 'gain': -20, 'what': 'PLANTA ORIGINAL 1987'},
  {'t': Pw(17, 'detalhe') - 0.3, 'name': FX['caneta_barra'], 'gain': -19, 'what': 'parede em 2021'},
  {'t': Pw(17, 'nunca viu'), 'name': FX['caneta_circ'], 'gain': -14, 'what': 'o segundo interruptor'},
  {'t': Pw(17, 'nunca viu') + 0.75, 'name': 'glitch', 'dur': 0.6, 'gain': -16, 'seed': 34, 'what': 'lanterna falha'},
  {'t': Pw(17, 'nunca viu') + 0.8, 'name': 'impact', 'dur': 3.5, 'gain': -11, 'pitch': 0.4, 'seed': 7, 'what': 'blecaute'},
  {'t': T12 + 0.05, 'name': FX['clique'], 'gain': -14, 'what': 'luz volta: cartão final'},
  {'t': Pw(18, 'A solução'), 'name': FX['maq_final'], 'gain': -17, 'what': 'a solução está no arquivo'},
  {'t': Pw(18, 'treze') + 0.15, 'name': 'hit', 'gain': -11, 'pitch': 0.7, 'seed': 8, 'what': 'carimbo CASO ABERTO'},
]
src = os.path.join(P, '..', 'arquivo-morto-caso-002', 'input', 'narracao-v1.wav'); vo = f'input/narracao-{V}.wav'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-t', str(DUR), '-af', f'afade=t=out:st={DUR - 0.6}:d=0.6', os.path.join(P, vo)], check=True)
cfg = {'title': f'arquivo-morto-caso-002-planta-{V}', 'voiceover': vo, 'loudness': -14,
       'music': {'enabled': True, 'gainDb': -20, 'seed': 6}, 'sfx': {'enabled': True, 'gainDb': -4}}
story = {'duration': DUR, 'shots': [{'id': 'tudo', 'start': 0, 'end': DUR}],
         'music': [m for m in [{'start': 0, 'end': min(DUR, 20.7), 'mood': 'mystery', 'intensity': 0.35}, {'start': 20.7, 'end': 45.6, 'mood': 'mystery', 'intensity': 0.45},
                   {'start': 45.6, 'end': 65.4, 'mood': 'dark', 'intensity': 0.5}, {'start': 65.4, 'end': 70.4, 'mood': 'tension', 'intensity': 0.45}, {'start': 70.4, 'end': DUR, 'mood': 'dark', 'intensity': 0.3}] if m['start'] < DUR],
         'sfx': [{k: v for k, v in c.items() if k != 'what'} for c in cues if c['t'] < DUR]}
json.dump(cfg, open(os.path.join(P, 'config.json'), 'w'), ensure_ascii=False, indent=1)
os.makedirs(os.path.join(P, 'story'), exist_ok=True); json.dump(story, open(os.path.join(P, 'story', 'shots.json'), 'w'), ensure_ascii=False, indent=1)
print(f"{len(story['sfx'])} efeitos. config.json e story/shots.json prontos.")

# Trilha do Caso 005 (Planta no escuro). Uso: python3 tools/som.py v1 <duração>
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(P, '..', 'arquivo-morto-kit', 'tools'))
from som_kit import *
V, DUR = sys.argv[1], float(sys.argv[2])
T = Trilha(P); S, E, Pw, fx, add = T.S, T.E, T.Pw, T.fx, T.add
Tt = lambda i: S(i) - 0.25
T.trocas([Tt(i) for i in (2, 4, 5, 6, 7, 8, 10, 12, 14, 17, 18)])
add(0.28, fx('clique', clique()), -12); add(0.45, fx('maq_tag', maquina(0.65, 1)), -17)
add(Pw(1, 'A escada'), 'swish', -26, dur=0.6, pitch=0.5, seed=2); add(Pw(1, 'degraus'), fx('caneta_13', caneta(0.6, 3)), -20)
add(Tt(2) + 0.05, fx('papel1', papel(0.7, 3)), -17); add(S(2), fx('maq_1974', maquina(0.6, 2)), -19)
add(Pw(2, 'doze'), fx('lapis', caneta(1.2, 4)), -17); add(Pw(3, 'apóstolo'), fx('lapis2', caneta(1.0, 6)), -19)
for k in range(12): add(Pw(4, 'contar') + k / 4.2, fx(f'passo{k % 3}', baque(40 + k % 3)), -24)
add(Tt(5) + 0.05, fx('papel2', papel(0.7, 5)), -17)
add(Pw(5, 'carta') - 0.6, fx('maq_carta', maquina(4.2, 7)), -13); add(Pw(5, 'máquina'), fx('caneta_c1', caneta(0.6, 8)), -16)
add(Tt(6) + 0.1, fx('nanquim1', nanquim(1.4, 3)), -23); add(Pw(6, 'nunca'), fx('caneta_x', caneta(0.5, 10)), -15); add(Pw(6, 'escritório'), fx('caneta_c2', caneta(0.6, 12)), -16)
add(Tt(7) + 0.05, fx('papel3', papel(0.6, 7)), -18); add(Pw(7, 'duas'), fx('caneta_linha', caneta(1.4, 14)), -18)
add(Tt(8) + 0.1, fx('nanquim2', nanquim(1.6, 5)), -23)
for k in range(13): add(Pw(9, 'subiu') + k / 5.5, fx(f'passo{k % 3}', baque(40 + k % 3)), -23 + (6 if k == 12 else 0))
add(Pw(9, 'treze') + 0.1, 'impact', -15, dur=3.0, pitch=0.45, seed=6)
add(S(10) - 0.2, 'hum', -30, dur=8.0, seed=31)
for k in range(12): add(Pw(10, 'Doze') + k / 2.4, fx(f'rangido{k % 2}', bafo(0.5, 50 + k % 2)), -20)
add(Pw(11, 'treze') - 0.1, fx('sussurro', bafo(1.6, 18)), -11); add(Pw(11, 'treze'), 'impact', -12, dur=3.5, pitch=0.38, seed=7)
add(Tt(12) + 0.05, fx('papel4', papel(0.6, 9)), -17); add(Pw(12, 'Estou') - 0.5, 'swish', -22, dur=0.5, pitch=0.6, seed=4)
add(Pw(13, 'carimbo'), fx('caneta_c3', caneta(0.6, 16)), -15); add(Pw(13, 'carimbo') + 0.3, 'hit', -15, pitch=0.6, seed=9)
add(Tt(14) + 0.1, fx('trena', relogio(1.5, 21, 0.06)), -18); add(Pw(15, 'doze'), fx('caneta_trac', caneta(0.6, 18)), -17)
add(Pw(15, 'Dois metros'), fx('caneta_cota', caneta(0.5, 20)), -18); add(S(16) + 0.6, 'riser', -22, dur=1.5, pitch=0.5, seed=5)
add(Tt(17) + 0.1, fx('gaveta', baque(60)), -14); add(Pw(17, 'identidade'), fx('caneta_c4', caneta(0.6, 22)), -16); add(Pw(17, 'aliança'), fx('caneta_c5', caneta(0.6, 24)), -16)
add(Pw(17, 'aliança') + 0.4, 'impact', -12, dur=3.5, pitch=0.4, seed=3)
add(Tt(18) + 0.05, fx('clique', clique()), -14); add(Pw(18, 'A solução'), fx('maq_final', maquina(0.9, 9)), -17); add(Pw(18, 'treze') + 0.15, 'hit', -11, pitch=0.7, seed=8)
T.escrever(V, DUR, [{'start': 0, 'end': Tt(5), 'mood': 'mystery', 'intensity': 0.35}, {'start': Tt(5), 'end': Tt(10), 'mood': 'dark', 'intensity': 0.45},
                    {'start': Tt(10), 'end': Tt(12), 'mood': 'dark', 'intensity': 0.6}, {'start': Tt(12), 'end': Tt(18), 'mood': 'tension', 'intensity': 0.42}, {'start': Tt(18), 'end': DUR, 'mood': 'dark', 'intensity': 0.3}],
           titulo='arquivo-morto-caso-005')

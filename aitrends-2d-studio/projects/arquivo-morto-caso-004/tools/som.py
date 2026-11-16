# Trilha do Caso 004 (Planta no escuro). Uso: python3 tools/som.py v1 <duração>
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(P, '..', 'arquivo-morto-kit', 'tools'))
from som_kit import *
V, DUR = sys.argv[1], float(sys.argv[2])
T = Trilha(P); S, E, Pw, fx, add = T.S, T.E, T.Pw, T.fx, T.add
Tt = lambda i: S(i) - 0.25
T.trocas([Tt(i) for i in (2, 3, 4, 6, 10, 12, 14, 16, 18)])
add(0.28, fx('clique', clique()), -12); add(0.45, fx('maq_tag', maquina(0.65, 1)), -17)
add(Pw(1, 'O porão'), 'swish', -26, dur=0.6, pitch=0.5, seed=2); add(Pw(1, 'escritura') - 0.1, fx('caneta_ret', caneta(0.6, 3)), -20)
add(Tt(2) + 0.1, fx('nanquim_casas', nanquim(2.4, 3)), -24); add(S(2), fx('maq_2022', maquina(0.6, 2)), -19)
add(Tt(3) + 0.05, fx('papel1', papel(0.7, 3)), -17); add(Pw(3, 'cento'), fx('caneta_c1', caneta(0.6, 4)), -17); add(Pw(3, 'Sem subsolo'), fx('caneta_c2', caneta(0.6, 6)), -15)
add(Tt(4) + 0.05, fx('louca', louca()), -16); add(Pw(4, 'vizinho'), fx('caneta_c3', caneta(0.6, 8)), -17)
add(Pw(5, 'Perguntou'), fx('maq_frase', maquina(1.2, 4)), -18); add(Pw(5, 'onde fica tudo'), 'riser', -24, dur=2.0, pitch=0.5, seed=5)
add(Tt(6) + 0.1, fx('nanquim_planta', nanquim(1.6, 5)), -23); add(Pw(6, 'grelha'), 'tick', -18, pitch=0.5, seed=21)
add(S(7) - 0.2, 'hum', -30, dur=10.0, seed=31); add(Pw(7, 'próprio nome'), fx('sussurro', bafo(1.4, 12)), -12)
add(Pw(8, 'marido'), 'impact', -17, dur=3.0, pitch=0.45, seed=6)
add(Pw(9, 'briga'), fx('sussurro2', bafo(2.2, 14)), -14); add(Pw(9, 'Palavra'), fx('maq_briga', maquina(1.6, 6)), -21)
add(Tt(10) + 0.1, fx('nanquim_corte', nanquim(1.2, 7)), -23); add(Pw(10, 'rosnando'), 'buzz', -24, dur=1.6, seed=35)
for k in range(3): add(Pw(11, 'oco') - 0.4 + k * 0.18, fx(f'bate{k}', baque(20 + k)), -14)
add(Pw(11, 'oco') + 0.2, 'impact', -16, dur=3.0, pitch=0.4, seed=9)
add(Tt(12) + 0.1, 'wind', -28, dur=7.0, seed=28); add(Pw(13, 'aberta') - 0.1, fx('ferro', baque(31)), -15); add(Pw(13, 'dois dedos'), fx('caneta_cota', caneta(0.4, 10)), -19)
add(Tt(14) + 0.05, fx('papel2', papel(0.8, 5)), -17); add(Pw(14, 'aterrado'), fx('caneta_c4', caneta(0.6, 12)), -16)
add(Pw(15, 'Aurélio') - 0.3, fx('assinatura', caneta(0.9, 14)), -15); add(Pw(15, 'Aurélio') + 0.5, fx('caneta_c5', caneta(0.6, 16)), -16); add(Pw(15, 'Aurélio') + 0.9, 'hit', -13, pitch=0.6, seed=4)
add(Tt(16) + 0.1, fx('sussurro3', bafo(2.0, 16)), -20); add(S(17), fx('relogio', relogio(4.0, 3)), -19)
add(Pw(17, 'amanhã') - 0.2, fx('sussurro4', bafo(1.5, 18)), -10); add(Pw(17, 'amanhã') + 0.3, 'glitch', -18, dur=0.8, seed=33); add(Pw(17, 'amanhã') + 0.35, 'impact', -11, dur=3.5, pitch=0.38, seed=7)
add(Tt(18) + 0.05, fx('clique', clique()), -14); add(Pw(18, 'A solução'), fx('maq_final', maquina(0.9, 9)), -17); add(Pw(18, 'treze') + 0.15, 'hit', -11, pitch=0.7, seed=8)
T.escrever(V, DUR, [{'start': 0, 'end': Tt(6), 'mood': 'mystery', 'intensity': 0.38}, {'start': Tt(6), 'end': Tt(12), 'mood': 'dark', 'intensity': 0.5},
                    {'start': Tt(12), 'end': Tt(16), 'mood': 'tension', 'intensity': 0.42}, {'start': Tt(16), 'end': Tt(18), 'mood': 'dark', 'intensity': 0.55}, {'start': Tt(18), 'end': DUR, 'mood': 'dark', 'intensity': 0.3}],
           titulo='arquivo-morto-caso-004')

# Trilha do Caso 006 (Planta no escuro). Uso: python3 tools/som.py v1 <duração>
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(P, '..', 'arquivo-morto-kit', 'tools'))
from som_kit import *
V, DUR = sys.argv[1], float(sys.argv[2])
T = Trilha(P); S, E, Pw, fx, add = T.S, T.E, T.Pw, T.fx, T.add
Tt = lambda i: S(i) - 0.25
T.trocas([Tt(i) for i in (2, 3, 4, 6, 7, 10, 11, 14, 16)])
add(0.28, fx('clique', clique()), -12); add(0.45, fx('maq_tag', maquina(0.65, 1)), -17)
add(Pw(1, 'O quarto'), 'swish', -26, dur=0.6, pitch=0.5, seed=2)
add(Tt(2) + 0.1, fx('nanquim_casa', nanquim(1.8, 3)), -24); add(S(2), fx('maq_2018', maquina(0.6, 2)), -19)
add(Tt(3) + 0.05, fx('papel1', papel(0.6, 3)), -18); add(Pw(3, 'Nunca'), fx('caneta_c1', caneta(0.6, 4)), -16)
add(Tt(4) + 0.2, 'whoosh', -26, dur=1.2, pitch=0.45, seed=5); add(S(4) + 0.5, fx('caixinha', louca(11)), -26)
add(Pw(5, 'para quando'), fx('maq_frase', maquina(1.3, 4)), -19); add(Pw(5, 'chegarem'), 'riser', -24, dur=2.0, pitch=0.5, seed=5)
add(Pw(6, 'Lia'), 'ding', -24, dur=1.5, pitch=1.2, seed=14); add(Pw(6, 'Teo'), 'ding', -24, dur=1.5, pitch=1.0, seed=15)
add(Pw(7, 'fundo falso') - 0.3, fx('madeira', baque(70)), -14); add(Pw(7, 'fundo falso') - 0.2, 'whoosh', -24, dur=1.0, pitch=0.5, seed=7)
for k in range(9): add(Pw(8, 'Lia') + k * 0.18, fx(f'caixa{k % 3}', baque(80 + k % 3)), -24)
for k in range(5): add(Pw(9, 'Teo') + k * 0.22, fx(f'caixa{k % 3}', baque(80 + k % 3)), -24)
add(Pw(9, 'nenhuma'), 'impact', -15, dur=3.0, pitch=0.45, seed=6)
add(Tt(10) + 0.05, fx('papel2', papel(0.6, 5)), -18); add(Pw(10, 'este quarto'), fx('escrita1', caneta(1.3, 6)), -17); add(Pw(10, 'Não pintem'), fx('escrita2', caneta(1.0, 8)), -17)
add(Pw(10, 'batente'), fx('caneta_c2', caneta(0.6, 10)), -16)
add(Pw(11, 'lixou'), fx('lixa', dedo_vidro(2.6, 21)), -15)
add(Pw(12, 'oitenta'), fx('caneta_c3', caneta(0.6, 12)), -16); add(Pw(12, 'celular'), 'blip', -22, pitch=0.8, seed=12)
add(Pw(13, 'oitenta'), fx('caneta_c4', caneta(0.6, 14)), -16); add(Pw(13, 'igual'), 'hit', -15, pitch=0.6, seed=9)
add(Pw(14, 'pintura'), fx('nanquim_cam', nanquim(1.4, 7)), -22); add(Pw(14, 'por baixo'), 'impact', -14, dur=3.0, pitch=0.42, seed=3)
add(Pw(15, 'palavra') + 0.4, fx('caneta_c5', caneta(0.6, 16)), -14); add(Pw(15, 'palavra') + 0.7, 'impact', -11, dur=3.5, pitch=0.38, seed=7)
add(Tt(16) + 0.05, fx('clique', clique()), -14); add(Pw(16, 'A solução'), fx('maq_final', maquina(0.9, 9)), -17); add(Pw(16, 'treze') + 0.15, 'hit', -11, pitch=0.7, seed=8)
T.escrever(V, DUR, [{'start': 0, 'end': Tt(6), 'mood': 'mystery', 'intensity': 0.36}, {'start': Tt(6), 'end': Tt(11), 'mood': 'dark', 'intensity': 0.45},
                    {'start': Tt(11), 'end': Tt(14), 'mood': 'tension', 'intensity': 0.42}, {'start': Tt(14), 'end': Tt(16), 'mood': 'dark', 'intensity': 0.55}, {'start': Tt(16), 'end': DUR, 'mood': 'dark', 'intensity': 0.3}],
           titulo='arquivo-morto-caso-006')

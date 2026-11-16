# Trilha do Caso 003 (Planta no escuro). Uso: python3 tools/som.py v1 <duração>
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(P, '..', 'arquivo-morto-kit', 'tools'))
from som_kit import *
V, DUR = sys.argv[1], float(sys.argv[2])
T = Trilha(P); S, E, Pw, fx, add = T.S, T.E, T.Pw, T.fx, T.add
T2, T3, T4, T5, T6, T7, T8, T9, T10 = 3.4, 11.55, 24.5, 35.3, 46.5, 61.6, 68.35, 72.8, 80.15
T.trocas([T2, T3, T4, T5, T6, T7, T8, T9, T10])
add(0.28, fx('clique', clique()), -12); add(0.45, fx('maq_tag', maquina(0.65, 1)), -17)
add(Pw(1, 'A janela'), 'swish', -26, dur=0.6, pitch=0.5, seed=2)
add(Pw(1, 'dentro') - 0.1, fx('caneta_jan', caneta(0.5, 3)), -20)
add(T2 + 0.1, fx('nanquim_fachada', nanquim(2.4, 3)), -24); add(S(2), fx('maq_julho', maquina(0.7, 2)), -19)
add(Pw(2, 'menino'), fx('clique', clique()), -20); add(Pw(2, 'sobrado'), fx('maq_sobrado', maquina(0.6, 4)), -20)
add(T3 + 0.1, fx('nanquim_planta', nanquim(1.6, 5)), -23); add(T3 + 0.3, 'whoosh', -24, dur=1.2, pitch=0.45, seed=5)
add(Pw(3, 'rua'), fx('caneta_rua', caneta(0.4, 6)), -21); add(Pw(4, 'dentro'), fx('caneta_vidro', caneta(0.5, 8)), -19)
add(Pw(4, 'Vidro'), fx('maq_vidro', maquina(0.5, 5)), -19); add(Pw(5, 'fechado'), 'hit', -15, pitch=0.7, seed=8)
add(S(6) - 0.2, 'hum', -30, dur=10.0, seed=31)                                    # noite: zumbido baixo
add(Pw(6, 'luz'), fx('chama', bafo(1.8, 9)), -18); add(Pw(7, 'sombra'), 'riser', -24, dur=3.0, pitch=0.5, seed=5)
add(Pw(7, 'sentada'), 'impact', -16, dur=3.0, pitch=0.45, seed=6)
add(S(8), fx('relogio', relogio(5.0, 3)), -19); add(S(8) + 0.4, fx('passos', relogio(3.0, 11, 0.55)), -22)
add(Pw(9, 'santa'), fx('maq_santa', maquina(0.4, 6)), -22)
add(Pw(10, 'voltar') - 0.1, fx('pano', papel(0.6, 4)), -16); add(Pw(10, 'voltar'), fx('louca', louca()), -14); add(Pw(10, 'Vazio'), 'hit', -15, pitch=0.6, seed=4)
add(S(11) + 0.6, fx('bafo', bafo(1.3, 6)), -14); add(Pw(11, 'escreveu') + 0.1, fx('dedo1', dedo_vidro(1.1, 4)), -15)
add(Pw(12, 'apagou') - 0.05, fx('clique', clique()), -14); add(Pw(12, 'apagou'), 'impact', -14, dur=3.0, pitch=0.4, seed=7)
add(S(13), 'wind', -30, dur=5.0, seed=28); add(Pw(13, 'ao contrário') - 0.4, fx('dedo2', dedo_vidro(1.8, 7)), -17)
add(S(14), 'stinger', -18, dur=3.0, seed=16)
add(T7 + 0.1, fx('nanquim_conta', nanquim(1.2, 7)), -23)
for k in range(4): add(Pw(15, 'quatro') - 0.1 + k * 0.22, 'tick', -18, pitch=0.6 + 0.05 * k, seed=20 + k)
add(Pw(15, 'Lá dentro') - 0.3, fx('nanquim_planta', nanquim(1.6, 5)), -23); add(E(15) - 0.6, 'hit', -15, pitch=0.6, seed=9)
add(T8 + 0.1, 'whoosh', -24, dur=1.2, pitch=0.4, seed=12); add(Pw(16, 'nenhuma') - 0.3, fx('caneta_x', caneta(0.6, 12)), -16)
add(T9 + 0.05, fx('papel_doc', papel(0.7, 3)), -17); add(Pw(17, 'gêmeas'), fx('caneta_circ', caneta(0.6, 2)), -15); add(Pw(17, 'gêmeas') + 0.4, fx('caneta_circ2', caneta(0.5, 14)), -17)
add(Pw(17, 'E um caderno') - 0.3, fx('papel_cad', papel(0.6, 5)), -19); add(Pw(17, 'depois da morte') - 0.2, fx('caneta_col', caneta(0.6, 16)), -15)
add(Pw(17, 'depois da morte') + 0.3, 'impact', -13, dur=3.0, pitch=0.42, seed=3)
add(T10 + 0.05, fx('clique', clique()), -14); add(Pw(18, 'A solução'), fx('maq_final', maquina(0.9, 9)), -17); add(Pw(18, 'treze') + 0.15, 'hit', -11, pitch=0.7, seed=8)
T.escrever(V, DUR, [{'start': 0, 'end': 24.5, 'mood': 'mystery', 'intensity': 0.38}, {'start': 24.5, 'end': 46.5, 'mood': 'dark', 'intensity': 0.45},
                    {'start': 46.5, 'end': 61.6, 'mood': 'dark', 'intensity': 0.55}, {'start': 61.6, 'end': 80.15, 'mood': 'tension', 'intensity': 0.42}, {'start': 80.15, 'end': DUR, 'mood': 'dark', 'intensity': 0.3}],
           titulo='arquivo-morto-caso-003')

# Trilha do Caso 001 (Planta no escuro). Uso: python3 tools/som.py v1 <duração>
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(P, '..', 'arquivo-morto-kit', 'tools'))
from som_padrao import *
def extras(T, S, E, Pw, fx, add):
    for j, t0 in enumerate([Pw(5, 'batidas'), Pw(5, 'Sempre três'), Pw(6, 'Vinham')]):
        for k in range(3): add(t0 + k * 0.55, fx(f'bat{k}', baque(90 + k)), -11)
    for k in range(3): add(Pw(8, 'bateu de volta') + k * 0.55, fx(f'resp{k}', baque(93 + k)), -9)
    for j, d in enumerate([0.2, 2.0]):
        for k in range(3): add(Pw(10, 'respondeu') + d + k * 0.55, fx(f'bat2{k}', baque(96 + k)), -10)
    add(S(5), fx('relogio', relogio(4.0, 3)), -22)
trilha(P, sys.argv[1], float(sys.argv[2]), trocas=[2, 3, 5, 8, 11, 13, 15], sustos=[(4, 'mais grossa'), (6, 'cabeça'), (10, 'No mesmo'), (12, 'Paga'), (15, 'dez e meio')], papeis=[13], canetas=[(14, 'A.'), (15, 'doze')], extras=extras, titulo='arquivo-morto-caso-001')

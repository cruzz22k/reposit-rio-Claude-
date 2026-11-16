# Trilha do Caso 013 (Planta no escuro). Uso: python3 tools/som.py v1 <duração>
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(P, '..', 'arquivo-morto-kit', 'tools'))
from som_padrao import *
def extras(T, S, E, Pw, fx, add):
    [add(Pw(12,'três batidas') + k * 0.55, fx(f'bat{k}', baque(90 + k)), -10) for k in range(3)]; [add(S(14) + 0.3 + k * 0.55, fx(f'resp{k}', baque(93 + k)), -9) for k in range(3)]; [add(S(14) + 2.0 + k * 0.55, fx(f'bat2{k}', baque(96 + k)), -11) for k in range(3)]
trilha(P, sys.argv[1], float(sys.argv[2]), trocas=[2, 3, 5, 7, 8, 10, 12], sustos=[(3, 'era a minha'), (8, 'Morreu'), (11, 'Atrás'), (14, 'noite')], papeis=[2, 7, 8], canetas=[(2, 'sem remetente'), (4, 'mesa'), (5, 'A.'), (7, 'letra'), (8, 'Aurora')], extras=extras, titulo='arquivo-morto-caso-013')

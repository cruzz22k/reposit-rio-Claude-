# Trilha do Caso 010 (Planta no escuro). Uso: python3 tools/som.py v1 <duração>
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(P, '..', 'arquivo-morto-kit', 'tools'))
from som_padrao import *
def extras(T, S, E, Pw, fx, add):
    add(S(4), 'rain', -26, dur=6.0, seed=26); add(Pw(13,'apagou'), fx('clique', clique()), -12); add(Pw(13,'passou'), 'whoosh', -18, dur=1.4, pitch=0.6, seed=7)
trilha(P, sys.argv[1], float(sys.argv[2]), trocas=[2, 3, 4, 6, 7, 9, 11, 13, 14], sustos=[(5, 'a esquerda'), (8, 'lado errado'), (13, 'perfume'), (14, 'direita')], papeis=[6, 7, 9, 14], canetas=[(2, 'pinta'), (6, 'ordem'), (9, 'Lívia'), (10, 'gêmeas'), (14, 'direita')], extras=extras, titulo='arquivo-morto-caso-010')

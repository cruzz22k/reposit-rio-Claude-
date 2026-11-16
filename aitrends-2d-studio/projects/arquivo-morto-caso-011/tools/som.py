# Trilha do Caso 011 (Planta no escuro). Uso: python3 tools/som.py v1 <duração>
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(P, '..', 'arquivo-morto-kit', 'tools'))
from som_padrao import *
def extras(T, S, E, Pw, fx, add):
    add(S(5), fx('colmeia', bafo(6.0, 71)), -12); add(S(5), 'hum', -20, dur=6.0, seed=31); add(Pw(13,'não subiu'), 'hit', -12, pitch=0.6, seed=8)
trilha(P, sys.argv[1], float(sys.argv[2]), trocas=[2, 4, 6, 8, 10, 11, 13], sustos=[(6, 'trinta e cinco'), (9, 'mel'), (13, 'lado de cima')], papeis=[2, 9, 11], canetas=[(2, 'treze anos'), (4, 'parafusos'), (9, 'mel')], extras=extras, titulo='arquivo-morto-caso-011')

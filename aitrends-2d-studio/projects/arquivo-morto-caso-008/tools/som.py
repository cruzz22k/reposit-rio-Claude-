# Trilha do Caso 008 (Planta no escuro). Uso: python3 tools/som.py v1 <duração>
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(P, '..', 'arquivo-morto-kit', 'tools'))
from som_padrao import *
def extras(T, S, E, Pw, fx, add):
    [add(Pw(5,'três e trinta') + k * 0.66, 'buzz', -20, dur=0.4, seed=35 + k) for k in range(6)]; add(Pw(6,'moço'), fx('voz', bafo(2.5, 61)), -16); add(Pw(8,'Desliga'), fx('clique', clique()), -16); add(S(10), 'phonebuzz', -30, dur=1.6, seed=21)
trilha(P, sys.argv[1], float(sys.argv[2]), trocas=[2, 4, 5, 7, 8, 11, 12, 13], sustos=[(5, 'luzinha'), (9, 'gelada'), (14, 'Valdir')], papeis=[2, 12, 13], canetas=[(12, 'cortado'), (13, 'Faltou'), (14, 'Valdir')], extras=extras, titulo='arquivo-morto-caso-008')

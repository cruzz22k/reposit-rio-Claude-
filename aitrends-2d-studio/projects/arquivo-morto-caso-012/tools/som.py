# Trilha do Caso 012 (Planta no escuro). Uso: python3 tools/som.py v1 <duração>
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(P, '..', 'arquivo-morto-kit', 'tools'))
from som_padrao import *
def extras(T, S, E, Pw, fx, add):
    add(Pw(5,'fechada'), 'hit', -14, pitch=0.6, seed=8); add(S(8), fx('lavanda', bafo(3.0, 81)), -18); add(Pw(12,'lavanda'), fx('rangido', dedo_vidro(1.4, 83)), -14)
trilha(P, sys.argv[1], float(sys.argv[2]), trocas=[2, 3, 5, 6, 8, 9, 11], sustos=[(7, 'fio branco'), (10, 'muda de lado'), (12, 'lavanda')], papeis=[9], canetas=[(10, 'muda'), (11, 'porta de comunicação')], extras=extras, titulo='arquivo-morto-caso-012')

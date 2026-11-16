# Trilha do Caso 007 (Planta no escuro). Uso: python3 tools/som.py v1 <duração>
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(P, '..', 'arquivo-morto-kit', 'tools'))
from som_padrao import *
def extras(T, S, E, Pw, fx, add):
    add(Pw(6,'botões'), fx('botoes', relogio(1.3, 41, 0.25)), -16); add(Pw(8,'cheiro'), fx('gas', bafo(3.0, 44)), -14); [add(Pw(10,'fósforo') + d, fx(f'fosforo{j}', dedo_vidro(0.25, 50 + j)), -12) for j, d in enumerate([0, 1.3, 2.4])]
trilha(P, sys.argv[1], float(sys.argv[2]), trocas=[2, 5, 8, 11, 13, 14], sustos=[(4, 'explosão'), (10, 'Nunca a chama'), (13, 'acender'), (14, 'dobro')], papeis=[11, 13, 14], canetas=[(11, 'sete e quarenta'), (12, 'missa'), (13, 'acender'), (14, 'vinte dias'), (14, 'dobro')], extras=extras, titulo='arquivo-morto-caso-007')

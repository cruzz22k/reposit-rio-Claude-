# Trilha do Caso 009 (Planta no escuro). Uso: python3 tools/som.py v1 <duração>
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(P, '..', 'arquivo-morto-kit', 'tools'))
from som_padrao import *
def extras(T, S, E, Pw, fx, add):
    add(S(3), fx('tique', relogio(6.0, 3)), -18); add(Pw(6,'para os relógios'), 'hit', -15, pitch=0.6, seed=9); [add(Pw(9,'sai') + k * 0.12, fx(f'passo{k % 2}', baque(70 + k % 2)), -26) for k in range(24)]
trilha(P, sys.argv[1], float(sys.argv[2]), trocas=[2, 3, 6, 7, 8, 11, 12, 13], sustos=[(4, 'dezessete'), (10, 'olhando para o chão'), (12, 'três e dez'), (13, 'Não acharam')], papeis=[7, 12], canetas=[(10, 'olhando para o chão'), (12, 'três e dez')], extras=extras, titulo='arquivo-morto-caso-009')

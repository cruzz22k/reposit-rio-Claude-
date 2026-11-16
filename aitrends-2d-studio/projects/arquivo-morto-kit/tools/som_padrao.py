# Trilha padrão de um episódio (Planta no escuro): clique da lanterna, máquina no título e nas etiquetas,
# luz chiando em cada troca, papel/nanquim na entrada de cada tomada, caneta nos destaques, graves nos sustos e carimbo no fim.
# Uso no som.py do caso: from som_padrao import trilha; trilha(P, v, dur, trocas=[...], sustos=[...], papeis=[...], extras=fn)
from som_kit import *
def trilha(P, V, DUR, trocas, sustos=(), papeis=(), canetas=(), extras=None, titulo='episodio'):
    T = Trilha(P); S, E, Pw, fx, add = T.S, T.E, T.Pw, T.fx, T.add; ULT = len(T.TL)
    Tt = lambda i: S(i) - 0.25
    T.trocas([Tt(i) for i in trocas] + [Tt(ULT)])
    add(0.28, fx('clique', clique()), -12); add(0.45, fx('maq_tag', maquina(0.65, 1)), -17); add(S(1) + 0.6, 'swish', -26, dur=0.6, pitch=0.5, seed=2)
    for k, i in enumerate(trocas):
        add(Tt(i) + 0.05, fx(f'papel{k % 4}', papel(0.6, 3 + k % 4)) if i in papeis else fx(f'nanquim{k % 3}', nanquim(1.4, 5 + k % 3)), -19 if i in papeis else -23)
        add(S(i), fx(f'maq{k % 3}', maquina(0.6, 10 + k % 3)), -21)
    for k, (i, w) in enumerate(canetas): add(Pw(i, w), fx(f'caneta{k % 5}', caneta(0.6, 20 + k % 5)), -16)
    for k, (i, w) in enumerate(sustos): add(Pw(i, w), 'impact', -13, dur=3.0, pitch=0.42 - 0.02 * (k % 3), seed=3 + k)
    add(S(min(4, ULT - 1)), 'hum', -32, dur=max(4.0, S(ULT) - S(min(4, ULT - 1))), seed=31)
    if extras: extras(T, S, E, Pw, fx, add)
    add(Tt(ULT) + 0.05, fx('clique', clique()), -14); add(Pw(ULT, 'A solução'), fx('maq_final', maquina(0.9, 9)), -17); add(Pw(ULT, 'treze') + 0.15, 'hit', -11, pitch=0.7, seed=8)
    a, b, c = Tt(trocas[len(trocas) // 3]), Tt(trocas[2 * len(trocas) // 3]), Tt(ULT)
    T.escrever(V, DUR, [{'start': 0, 'end': a, 'mood': 'mystery', 'intensity': 0.36}, {'start': a, 'end': b, 'mood': 'dark', 'intensity': 0.47}, {'start': b, 'end': c, 'mood': 'tension', 'intensity': 0.44}, {'start': c, 'end': DUR, 'mood': 'dark', 'intensity': 0.3}], titulo=titulo)

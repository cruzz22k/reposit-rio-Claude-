# Gera story/shots.json a partir da narração (timeline/frases.json + words.json).
import json
F = json.load(open('timeline/frases.json')); W = json.load(open('timeline/words.json'))['words']
S = lambda i: F[i]['start']
def Wt(i, word, n=1):
    s, e = F[i]['start'], F[i]['end']; k = 0
    for w in W:
        if s - 0.01 <= w['start'] <= e and w['word'].strip('.,?…:"').lower().startswith(word.lower()):
            k += 1
            if k == n: return w['start']
    raise Exception((i, word))
END = round(F[-1]['end'] + 1.6, 2)
c = lambda i: S(i) - 0.22
P = [
 ('s01', 0, 'corredor', 'Abertura: porta de cela com luz rosa vazando no corredor escuro; título'),
 ('s02', c(1), 'corredor', 'SUÍÇA; você empurra outro detento'),
 ('s03', c(2), 'corredor', 'Dois guardas te seguram e te levam pelo corredor'),
 ('s04', c(3), 'corredor', 'A porta abre: luz rosa invade tudo'),
 ('s05', c(4), 'cela', 'Dentro: paredes, teto, chão rosa; amostra cor de chiclete'),
 ('s06', c(5), 'cela', 'Você sentado, confuso; carimbo DE PROPÓSITO'),
 ('s07', c(6), 'lab', '1979: laboratório; cartaz rosa no cavalete'),
 ('s08', Wt(6, 'com', 2) - 0.12, 'lab', 'Alexander Schauss (sem rosto)'),
 ('s09', c(7), 'lab', 'Homem olha o cartaz rosa com os braços esticados'),
 ('s10', c(8), 'lab', 'Alguém empurra os braços para baixo'),
 ('s11', c(9), 'blueprint', 'Força: olhando branco x olhando rosa'),
 ('s12', c(10), 'naval', 'Prisão da Marinha em Seattle; dois oficiais sem rosto'),
 ('s13', c(11), 'blueprint', 'Tinta vermelha + galão branco = rosa'),
 ('s14', Wt(11, 'pintaram') - 0.12, 'cela', 'Rolo pintando a cela de rosa'),
 ('s15', c(12), 'blueprint', '156 dias, 0 agressões'),
 ('s16', c(13), 'corredor', 'Preso sai calmo; relógio 30 min'),
 ('s17', c(14), 'blueprint', 'A ideia se espalha: pontos rosa no mapa'),
 ('s18', c(15), 'blueprint', 'Fileira de celas ficando rosa'),
 ('s19', c(16), 'vestiario', 'Técnico (sem rosto) pinta o vestiário visitante de rosa'),
 ('s20', Wt(16, 'pra') - 0.12, 'vestiario', 'Jogadores visitantes mansos'),
 ('s21', c(17), 'vestiario', 'Até hoje: mictórios rosa'),
 ('s22', c(18), 'cela', 'De volta a você na cela rosa'),
 ('s23', c(19), 'blueprint', 'Psicóloga suíça (sem rosto): raiva baixa em 15 min'),
 ('s24', c(20), 'cela', 'Relógio: 2 horas'),
 ('s25', c(21), 'face', 'Close: humilhado'),
 ('s26', c(22), 'corredor', 'Outros presos rindo: quarto de menininha'),
 ('s27', c(23), 'corredor', 'Você sai da cela; respeito cai'),
 ('s28', c(24), 'blueprint', 'A reviravolta'),
 ('s29', c(25), 'lab', 'Quem empurrava também via o cartaz'),
 ('s30', Wt(25, 'podia') - 0.12, 'blueprint', 'Empurrando mais forte sem perceber'),
 ('s31', c(26), 'lab', 'Schauss repete os testes: sem efeito'),
 ('s32', c(27), 'cela', 'Medo: presos mais violentos'),
 ('s33', c(28), 'corredor', '2014, prisão de verdade na Suíça; cientistas'),
 ('s34', c(29), 'blueprint', '59 presos de castigo'),
 ('s35', Wt(29, 'Metade') - 0.12, 'blueprint', 'Metade cela rosa, metade cela branca com chão cinza'),
 ('s36', c(30), 'blueprint', 'Gráfico: todos mais calmos em 3 dias'),
 ('s37', c(31), 'blueprint', 'As duas linhas iguais: nenhuma diferença'),
 ('s38', c(32), 'cela', 'Não é o rosa. É o tempo.'),
 ('s39', c(33), 'end', 'Tela final: mais calmo ou mais irritado? Comenta aí'),
]
shots = []
for k, (sid, st, se, sc) in enumerate(P):
    en = P[k + 1][1] if k + 1 < len(P) else END
    line = ' '.join(w['word'] for w in W if st <= w['start'] < en)
    sh = {'id': sid, 'start': round(max(0, st), 3), 'end': round(en, 3), 'line': line, 'scene': sc, 'set': se}
    if sid == 's01': sh['in'] = {'type': 'fade', 'dur': 0.3}; sh['captions'] = False
    if sid in ('s39',): sh['captions'] = False
    shots.append(sh)
G = lambda name, t, gain, **kw: {'t_abs': t, 'name': name, 'gain': gain, **kw}
CUES = {
 's01': [G('riser', 0.1, -14), G('hum', 0.2, -24, dur=4.0)], 's02': [G('whoosh', c(1), -12), G('hit', Wt(1, 'briga'), -6), G('murmur', c(1), -22, dur=4.0)],
 's03': [G('footstep', c(2) + k * 0.4, -16) for k in range(9)], 's04': [G('slowmo', c(3), -14), G('impact', Wt(3, 'rosa'), -8, pitch=1.2)],
 's05': [G('pop', Wt(4, w), -12) for w in ('paredes', 'teto', 'chão')] + [G('ding', Wt(4, 'chiclete'), -12, pitch=1.5)],
 's06': [G('hit', Wt(5, 'propósito'), -10)], 's07': [G('whoosh', c(6), -12), G('ding', c(6) + 0.4, -16)], 's08': [G('pop', Wt(6, 'Alexander'), -14)],
 's10': [G('swish', Wt(8, 'empurrava'), -10)], 's11': [G('blip', Wt(9, 'fraco'), -12)], 's12': [G('wind', c(10), -22, dur=5.0)],
 's13': [G('pop', Wt(11, 'vermelha'), -12), G('pop', Wt(11, 'branca'), -12), G('shimmer', Wt(11, 'branca') + 0.5, -14)], 's14': [G('whoosh', Wt(11, 'pintaram'), -12, pitch=0.6)],
 's15': [G('counter', Wt(12, '156') - 0.2, -14), G('ding', Wt(12, 'nenhum'), -12)], 's16': [G('clock', c(13), -16, dur=3.0)],
 's17': [G('blip', c(14) + k * 0.08, -18) for k in range(12)], 's18': [G('pop', c(15) + 0.6 + k * 0.18, -18) for k in range(12)],
 's19': [G('swish', c(16) + 1 + k * 0.6, -18) for k in range(5)], 's20': [G('ding', Wt(16, 'mansos'), -14)], 's21': [G('impact', Wt(17, 'mictórios'), -10, pitch=1.3)],
 's22': [G('whoosh', c(18), -12)], 's23': [G('pop', Wt(19, '15') - 0.3, -12)], 's24': [G('clock', c(20), -14, dur=2.8)], 's25': [G('hit', Wt(21, 'humilhado'), -10)],
 's26': [G('murmur', c(22), -16, dur=3.6)], 's27': [G('glitch', Wt(23, 'respeito'), -14)], 's28': [G('riser', c(24) - 0.6, -14), G('stinger', c(24) + 0.3, -8)],
 's29': [G('blip', Wt(25, 'via'), -12)], 's30': [G('hit', Wt(25, 'forte'), -10)], 's31': [G('hit', Wt(26, 'não'), -8)], 's32': [G('impact', Wt(27, 'violentos'), -8)],
 's33': [G('whoosh', c(28), -12), G('ding', c(28) + 0.4, -16)], 's34': [G('counter', c(29), -16)], 's35': [G('pop', Wt(29, 'Metade'), -12), G('pop', Wt(29, 'branca'), -12)],
 's36': [G('riser', c(30), -18)], 's37': [G('impact', Wt(31, 'nenhuma'), -8)], 's38': [G('clock', Wt(32, 'tempo') - 0.4, -14, dur=2.0), G('shimmer', Wt(32, 'tempo'), -12)],
 's39': [G('shimmer', c(33) + 0.2, -14), G('pop', S(34), -10)],
}
AMB = {'corredor': ('hum', -28), 'cela': ('hum', -26), 'lab': ('roomtone', -26), 'naval': ('wind', -24), 'vestiario': ('roomtone', -24), 'face': ('hum', -28)}
for sh in shots:
    sh['sfx'] = [{k: v for k, v in {**q, 'at': round(q['t_abs'] - sh['start'], 3)}.items() if k != 't_abs'} for q in CUES.get(sh['id'], [])]
    if sh['set'] in AMB: sh['amb'] = {'name': AMB[sh['set']][0], 'gain': AMB[sh['set']][1]}
music = [{'start': 0, 'end': c(6), 'mood': 'tension', 'intensity': 0.5}, {'start': c(6), 'end': c(18), 'mood': 'playful', 'intensity': 0.4},
         {'start': c(18), 'end': c(24), 'mood': 'sad', 'intensity': 0.4}, {'start': c(24), 'end': c(33), 'mood': 'mystery', 'intensity': 0.5}, {'start': c(33), 'end': END, 'mood': 'mystery', 'intensity': 0.3}]
json.dump({'title': 'O que aconteceria se você fosse preso numa cela toda rosa?', 'duration': END, 'shots': shots, 'music': music, 'sfx': []}, open('story/shots.json', 'w'), ensure_ascii=False, indent=1)
for s in shots: print(s['id'], f"{s['start']:6.2f}-{s['end']:6.2f} {s['end']-s['start']:4.1f}s", s['line'][:60])

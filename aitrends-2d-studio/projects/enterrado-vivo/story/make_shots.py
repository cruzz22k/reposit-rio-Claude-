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
 ('s01', 0, 'cemetery', 'Abertura: cemitério à noite; título'),
 ('s02', c(1), 'street', 'EUROPA / 1830: rua antiga ao entardecer'),
 ('s03', Wt(1, 'matando') - 0.15, 'blueprint', 'Mapa da Europa com a cólera se espalhando'),
 ('s04', c(2), 'face', 'Close: você com febre; olhos se fecham'),
 ('s05', c(3), 'blueprint', 'Coração em traço fino, pulso quase reto'),
 ('s06', c(4), 'bedroom', 'Médico se inclina com um espelho'),
 ('s07', Wt(4, 'O', 2) - 0.12, 'mirror', 'Close do espelho limpo: não embaça'),
 ('s08', c(5), 'bedroom', 'Declarado morto: médico escreve, carimbo ÓBITO'),
 ('s09', c(6), 'street', 'Carroça com caixões na rua, coveiros com lenço no rosto'),
 ('s10', Wt(6, 'às') - 0.12, 'cemetery', 'Coveiros baixam o caixão às pressas'),
 ('s11', c(7), 'coffin', 'Escuro total; seus olhos se abrem'),
 ('s12', c(8), 'coffin', 'Sua mão sobe e bate na tampa de madeira'),
 ('s13', c(9), 'underground', 'Corte do subsolo: caixão debaixo da terra'),
 ('s14', c(10), 'blueprint', 'Caixão em blueprint: 880 litros'),
 ('s15', Wt(10, 'Tirando') - 0.12, 'blueprint', 'Menos o corpo: 820 litros de ar'),
 ('s16', c(11), 'blueprint', 'Medidor de oxigênio caindo devagar'),
 ('s17', Wt(11, 'É', 2) - 0.12, 'blueprint', 'Gás carbônico (CO2) se acumulando'),
 ('s18', c(12), 'face', 'Relógio de bolso: 2 horas; você confuso'),
 ('s19', c(13), 'coffin', 'Pânico: respiração rápida, CO2 subindo mais rápido'),
 ('s20', c(14), 'bedroom', 'Flashback quente: a família com medo'),
 ('s21', c(15), 'bedroom', 'CAIXÃO DE SEGURANÇA: o caixão com tubo e sino'),
 ('s22', c(16), 'blueprint', 'Cordinhas nas mãos, pés e cabeça'),
 ('s23', c(17), 'underground', 'O tubo sobe até o sino no túmulo'),
 ('s24', c(18), 'coffin', 'Você puxa; o sino toca lá em cima'),
 ('s25', c(19), 'cemetery', 'O vigia noturno ouve, lanterna na mão'),
 ('s26', c(20), 'cemetery', 'O vigia bombeia ar com um fole'),
 ('s27', Wt(20, 'enquanto') - 0.12, 'underground', 'Ar descendo pelo tubo enquanto cavam'),
 ('s28', c(21), 'blueprint', 'Parece invenção, mas era real: patentes'),
 ('s29', Wt(21, 'Só') - 0.12, 'blueprint', 'Mais de 30 modelos patenteados na Alemanha'),
 ('s30', c(22), 'underground', 'Médico alemão (sem rosto) se enterra para testar'),
 ('s31', Wt(22, 'Ficou') - 0.12, 'underground', 'Sopa, cerveja e linguiça descendo pelo tubo'),
 ('s32', c(23), 'cemetery', 'Mas tem um problema: o sino parado na névoa'),
 ('s33', c(24), 'underground', 'Corpo se decompõe, incha e se mexe'),
 ('s34', c(25), 'underground', 'A corda puxa; o sino balança'),
 ('s35', c(26), 'face', 'O vigia ouve o sino de madrugada: você ou um morto?'),
 ('s36', c(27), 'mortuary', 'MUNIQUE / CASAS DE ESPERA'),
 ('s37', Wt(27, 'maior') - 0.4, 'mortuary', '120 corpos, dedos amarrados a um sino'),
 ('s38', c(28), 'mortuary', 'Os dias passando no salão'),
 ('s39', Wt(28, 'porque') - 0.12, 'blueprint', 'O único sinal de morte garantido'),
 ('s40', c(29), 'face', 'Quantas pessoas essas casas salvaram?'),
 ('s41', c(30), 'bedroom', 'Historiador (sem rosto) com pilhas de registros'),
 ('s42', c(31), 'blueprint', 'Resultado: nenhuma — 0'),
 ('s43', c(32), 'blueprint', 'Nenhum caso registrado de caixão de segurança'),
 ('s44', c(33), 'bedroom', 'Médicos erravam menos do que o povo achava'),
 ('s45', c(34), 'ring', 'Salvo pelo gongo: vem do boxe'),
 ('s46', c(35), 'bedroom', 'George Washington (silhueta) no leito de morte: 3 dias'),
 ('s47', c(36), 'end', 'Tela final: sino ou esperar? Comenta aí'),
]
shots = []
for k, (sid, st, se, sc) in enumerate(P):
    en = P[k + 1][1] if k + 1 < len(P) else END
    line = ' '.join(w['word'] for w in W if st <= w['start'] < en)
    sh = {'id': sid, 'start': round(max(0, st), 3), 'end': round(en, 3), 'line': line, 'scene': sc, 'set': se}
    if sid == 's01': sh['in'] = {'type': 'fade', 'dur': 0.3}; sh['captions'] = False
    if sid in ('s47',): sh['captions'] = False
    shots.append(sh)
G = lambda name, t, gain, **kw: {'t_abs': t, 'name': name, 'gain': gain, **kw}
CUES = {
 's01': [G('riser', 0.1, -14), G('ding', 2.8, -16, pitch=0.5)], 's02': [G('whoosh', c(1), -12), G('pop', Wt(1, 'epidemia'), -14)],
 's03': [G('blip', Wt(1, 'matando') - 0.1 + k * 0.22, -16) for k in range(8)],
 's04': [G('heartbeat', c(2) + 0.2, -10, bpm=110, dur=1.6), G('slowmo', Wt(2, 'apaga') - 0.2, -12)],
 's05': [G('heartbeat', c(3) + 0.1, -9, bpm=40, dur=3.0)], 's07': [G('shimmer', Wt(4, 'espelho', 2), -16)],
 's08': [G('hit', Wt(5, 'morto'), -8)], 's09': [G('footstep', c(6) + k * 0.45, -20) for k in range(8)],
 's10': [G('impact', Wt(6, 'morrendo'), -12, pitch=0.6)], 's11': [G('freeze', c(7), -16)],
 's12': [G('kick', Wt(8, 'bate'), -4, pitch=0.6), G('kick', Wt(8, 'bate') + 0.35, -7, pitch=0.6)],
 's13': [G('whoosh', c(9) + 0.2, -10, pitch=0.6)], 's14': [G('pop', Wt(10, '880'), -10)], 's15': [G('counter', Wt(10, '820') - 0.4, -14)],
 's17': [G('buzz', Wt(11, 'gás'), -18)], 's18': [G('clock', c(12), -14, dur=3.0)], 's19': [G('heartbeat', c(13) + 0.3, -8, bpm=150, dur=4.0), G('riser', c(13) + 1.5, -16)],
 's21': [G('shimmer', Wt(15, 'segurança'), -12)], 's22': [G('swish', Wt(16, w), -14) for w in ('mãos', 'pés', 'cabeça')],
 's23': [G('riser', Wt(17, 'sobem'), -16), G('ding', Wt(17, 'sino'), -12)],
 's24': [G('swish', Wt(18, 'puxa'), -10), G('ding', Wt(18, 'Lá'), -4), G('ding', Wt(18, 'Lá') + 0.7, -7)],
 's25': [G('ding', c(19) + 0.1, -16), G('ding', c(19) + 1.1, -18), G('footstep', c(19) + 0.3, -18), G('footstep', c(19) + 0.8, -18)],
 's26': [G('whoosh', Wt(20, 'bombeia') + k * 0.9, -16, pitch=0.5) for k in range(4)], 's27': [G('hit', Wt(20, 'enquanto') + k * 0.5, -18) for k in range(4)],
 's28': [G('stinger', Wt(21, 'real'), -10)], 's29': [G('counter', Wt(21, '30') - 0.6, -14)],
 's31': [G('pop', Wt(22, w), -12) for w in ('sopa', 'cerveja', 'linguiça')], 's32': [G('freeze', c(23), -12)],
 's34': [G('ding', Wt(25, 'puxava') + 0.4, -8), G('ding', Wt(25, 'puxava') + 1.1, -12)],
 's35': [G('ding', c(26) + 0.3, -20), G('ding', c(26) + 1.6, -20), G('riser', Wt(26, 'morto') - 1.2, -16)],
 's37': [G('counter', Wt(27, '120') - 0.2, -14)], 's38': [G('clock', c(28), -18, dur=3.0)], 's39': [G('ding', Wt(28, 'único'), -12)],
 's42': [G('impact', Wt(31, 'nenhuma'), -6)], 's43': [G('hit', Wt(32, 'caso'), -10)], 's44': [G('pop', Wt(33, 'erravam'), -14)],
 's45': [G('ding', Wt(34, 'gongo'), -6, pitch=1.4), G('cheer', Wt(34, 'boxe') - 0.4, -22, dur=2.5)], 's46': [G('pop', Wt(35, 'três'), -12)],
 's47': [G('shimmer', c(36) + 0.2, -14), G('pop', S(37), -10)],
}
AMB = {'cemetery': ('wind', -24), 'street': ('wind', -26), 'bedroom': ('roomtone', -26), 'coffin': ('hum', -30), 'underground': ('wind', -28), 'mortuary': ('roomtone', -24), 'face': ('roomtone', -28), 'ring': ('murmur', -24), 'mirror': ('roomtone', -28)}
for sh in shots:
    sh['sfx'] = [{k: v for k, v in {**q, 'at': round(q['t_abs'] - sh['start'], 3)}.items() if k != 't_abs'} for q in CUES.get(sh['id'], [])]
    if sh['set'] in AMB: sh['amb'] = {'name': AMB[sh['set']][0], 'gain': AMB[sh['set']][1]}
music = [{'start': 0, 'end': c(7), 'mood': 'mystery', 'intensity': 0.4}, {'start': c(7), 'end': c(14), 'mood': 'tension', 'intensity': 0.55},
         {'start': c(14), 'end': c(23), 'mood': 'tension', 'intensity': 0.45}, {'start': c(23), 'end': c(29), 'mood': 'dark', 'intensity': 0.6},
         {'start': c(29), 'end': c(36), 'mood': 'mystery', 'intensity': 0.4}, {'start': c(36), 'end': END, 'mood': 'mystery', 'intensity': 0.3}]
json.dump({'title': 'O que aconteceria se você fosse enterrado vivo no século 19?', 'duration': END, 'shots': shots, 'music': music, 'sfx': []}, open('story/shots.json', 'w'), ensure_ascii=False, indent=1)
for s in shots: print(s['id'], f"{s['start']:6.2f}-{s['end']:6.2f} {s['end']-s['start']:4.1f}s", s['line'][:60])

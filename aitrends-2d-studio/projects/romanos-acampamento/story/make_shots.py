# Gera story/shots.json: (id, início, cenário, descrição, extras). O fim de cada tomada é o início da próxima.
import json
W = json.load(open('timeline/words.json')); W = W['words'] if isinstance(W, dict) else W
END = 138.5
S = [
 ('s01', 0.0, 'acampamento', 'Abertura/capa: acampamento romano no pântano sob a lua, floresta; título', {'captions': False, 'in': {'type': 'fade', 'dur': 0.3}, 'sfx': [{'at': 0.1, 'name': 'riser', 'gain': -14}], 'amb': {'name': 'wind', 'gain': -24}}),
 ('s02', 4.45, 'floresta', 'Floresta densa à noite; rótulo GERMÂNIA / ANO 15', {'in': {'type': 'dip', 'dur': 0.35}, 'amb': {'name': 'wind', 'gain': -22}}),
 ('s03', 6.3, 'floresta', 'Você, guerreiro germânico com lança, entre as árvores, luz da lua', {'amb': {'name': 'wind', 'gain': -22}}),
 ('s04', 7.85, 'floresta', 'Você agachado atrás de um tronco, espiando; arbustos desfocados na frente', {'amb': {'name': 'wind', 'gain': -22}}),
 ('s05', 9.95, 'emboscada', 'Flashback: coluna romana numa trilha, guerreiros saltam das árvores', {'in': {'type': 'dipWhite', 'dur': 0.3}, 'sfx': [{'at': 0.5, 'name': 'impact', 'gain': -14}], 'amb': {'name': 'wind', 'gain': -24}}),
 ('s06', 12.1, 'blueprint', 'Três águias de legião em traço, riscadas uma a uma; ANO 9', {'bars': 'none', 'sfx': [{'at': 0.2, 'name': 'hit', 'gain': -12}, {'at': 0.6, 'name': 'hit', 'gain': -12}, {'at': 1.0, 'name': 'hit', 'gain': -12}]}),
 ('s07', 14.75, 'pantano', 'Coluna romana atolada no pântano com neblina, estandartes', {'in': {'type': 'dip', 'dur': 0.35}, 'amb': {'name': 'rain', 'gain': -28}}),
 ('s08', 18.4, 'pantano', 'Rosto do legionário: cansado, faminto, olha em volta', {}),
 ('s09', 21.1, 'acampamento', 'Por cima do ombro: você em primeiro plano olhando o acampamento com tochas', {'amb': {'name': 'wind', 'gain': -22}}),
 ('s10', 23.2, 'floresta', 'Rosto seu, desconfiado', {}),
 ('s11', 24.7, 'obra', 'Legionários exaustos cavando a vala com pás à luz de tochas', {'amb': {'name': 'wind', 'gain': -24}, 'sfx': [{'at': 0.6, 'name': 'footstep', 'gain': -16}, {'at': 1.6, 'name': 'footstep', 'gain': -16}, {'at': 2.6, 'name': 'footstep', 'gain': -16}]}),
 ('s12', 28.75, 'blueprint', 'Planta vista de cima: o quadrado do acampamento e a vala desenhando-se em volta', {'bars': 'none', 'sfx': [{'at': 0.2, 'name': 'swish', 'gain': -14}]}),
 ('s13', 30.75, 'blueprint', 'Corte da vala: cotas 3 M de fundo e 3,5 M de largura, figura para escala', {'bars': 'none', 'sfx': [{'at': 0.6, 'name': 'pop', 'gain': -12}, {'at': 2.4, 'name': 'pop', 'gain': -12}]}),
 ('s14', 34.35, 'blueprint', 'Corte: a terra sobe e vira o muro ao lado da vala', {'bars': 'none', 'sfx': [{'at': 0.4, 'name': 'whoosh', 'gain': -14}]}),
 ('s15', 36.2, 'obra', 'Soldados fincando estacas pontudas no alto do muro', {'sfx': [{'at': 0.8, 'name': 'hit', 'gain': -14}, {'at': 1.6, 'name': 'hit', 'gain': -14}], 'amb': {'name': 'wind', 'gain': -24}}),
 ('s16', 38.9, 'obra', 'Um legionário marchando com duas estacas amarradas nas costas', {'amb': {'name': 'wind', 'gain': -24}}),
 ('s17', 41.05, 'acampamento', 'Lapso de tempo: noites passando sobre o acampamento; TODA NOITE', {'sfx': [{'at': 0.3, 'name': 'tick', 'gain': -14}]}),
 ('s18', 43.3, 'dentro', 'Sentinelas no passadiço trocando de turno; relógio de 4 turnos', {'amb': {'name': 'wind', 'gain': -24}, 'sfx': [{'at': 2.3, 'name': 'blip', 'gain': -14}]}),
 ('s19', 46.7, 'insert', 'A trombeta curva soando, ondas de som', {'sfx': [{'at': 0.3, 'name': 'powerup', 'gain': -14}]}),
 ('s20', 48.55, 'dentro', 'Sentinela cochilando no posto, apoiado na lança', {'amb': {'name': 'wind', 'gain': -24}}),
 ('s21', 51.5, 'dentro', 'Sombras de soldados com porretes na lona de uma tenda', {'sfx': [{'at': 0.4, 'name': 'hit', 'gain': -10}], 'amb': {'name': 'wind', 'gain': -24}}),
 ('s22', 53.0, 'floresta', 'Guerreiros na beira da floresta, tochas, gritando e cantando', {'in': {'type': 'dip', 'dur': 0.3}, 'amb': {'name': 'murmur', 'gain': -18}}),
 ('s23', 55.8, 'dentro', 'Dentro da tenda: romano deitado de olhos abertos, som atravessando a lona', {'amb': {'name': 'murmur', 'gain': -24}}),
 ('s24', 57.55, 'dentro', 'Rosto do romano com olheiras', {}),
 ('s25', 58.4, 'dentro', 'Um cavalo solto galopa entre as barracas de madrugada', {'sfx': [{'at': 0.4, 'name': 'footstep', 'gain': -10}, {'at': 0.8, 'name': 'footstep', 'gain': -10}, {'at': 1.2, 'name': 'footstep', 'gain': -10}], 'amb': {'name': 'wind', 'gain': -24}}),
 ('s26', 62.35, 'dentro', 'Romanos correndo em pânico para o portão', {'sfx': [{'at': 0.2, 'name': 'whoosh', 'gain': -12}], 'amb': {'name': 'murmur', 'gain': -18}}),
 ('s27', 66.1, 'portao', 'O general (silhueta sem rosto) deitado atravessado no portão; O GENERAL / CECINA', {'sfx': [{'at': 1.4, 'name': 'impact', 'gain': -14}], 'amb': {'name': 'murmur', 'gain': -22}}),
 ('s28', 70.1, 'portao', 'Soldados param na frente do general, sem coragem de pisar', {'amb': {'name': 'murmur', 'gain': -24}}),
 ('s29', 72.65, 'floresta', 'Conselho na floresta: Armínio (silhueta sem rosto); O LÍDER / ARMÍNIO', {'in': {'type': 'dip', 'dur': 0.3}, 'amb': {'name': 'wind', 'gain': -22}}),
 ('s30', 74.9, 'blueprint', 'Plano em traço: romanos saem do acampamento e são emboscados no pântano', {'bars': 'none', 'sfx': [{'at': 0.3, 'name': 'swish', 'gain': -14}]}),
 ('s31', 78.15, 'floresta', 'Inguiomero (silhueta sem rosto) ergue a espada; O TIO / INGUIOMERO', {'sfx': [{'at': 1.8, 'name': 'stinger', 'gain': -12}], 'amb': {'name': 'wind', 'gain': -22}}),
 ('s32', 81.8, 'floresta', 'Os guerreiros erguem as lanças, concordando', {'sfx': [{'at': 0.3, 'name': 'cheer', 'gain': -16}]}),
 ('s33', 83.35, 'acampamento', 'O sol nasce sobre o pântano e o acampamento', {'in': {'type': 'fade', 'dur': 0.4}, 'amb': {'name': 'wind', 'gain': -22}}),
 ('s34', 84.3, 'campo', 'Você corre para fora da floresta com centenas de guerreiros', {'sfx': [{'at': 0.1, 'name': 'whoosh', 'gain': -10}], 'amb': {'name': 'murmur', 'gain': -18}}),
 ('s35', 87.85, 'vala', 'Você pula na vala; a lama chega no joelho', {'sfx': [{'at': 0.4, 'name': 'impact', 'gain': -12}], 'amb': {'name': 'murmur', 'gain': -20}}),
 ('s36', 90.55, 'vala', 'Guerreiros jogam feixes de galhos e escalam o muro', {'amb': {'name': 'murmur', 'gain': -20}}),
 ('s37', 93.95, 'vala', 'Alto do muro quase vazio, um ou dois defensores', {'amb': {'name': 'wind', 'gain': -22}}),
 ('s38', 96.1, 'vala', 'Rosto seu: sorriso que vira desconfiança', {}),
 ('s39', 97.6, 'muro', 'Você no alto do muro olhando para dentro', {'sfx': [{'at': 1.6, 'name': 'riser', 'gain': -14}], 'amb': {'name': 'wind', 'gain': -22}}),
 ('s40', 100.05, 'blueprint', 'Corte: muro, espaço vazio de 60 M, barracas', {'bars': 'none', 'sfx': [{'at': 3.1, 'name': 'pop', 'gain': -12}]}),
 ('s41', 103.8, 'muro', 'A lança arremessada cai no vazio, longe das barracas', {'sfx': [{'at': 0.5, 'name': 'swish', 'gain': -10}, {'at': 1.6, 'name': 'hit', 'gain': -14}]}),
 ('s42', 106.5, 'insert', 'A trombeta toca de novo, forte', {'in': {'type': 'flash', 'dur': 0.3}, 'sfx': [{'at': 0.7, 'name': 'powerup', 'gain': -10}]}),
 ('s43', 108.4, 'portao', 'Os portões laterais se abrem, romanos saindo em formação', {'sfx': [{'at': 0.3, 'name': 'impact', 'gain': -12}]}),
 ('s44', 110.0, 'blueprint', 'Vista de cima: setas vermelhas saem dos portões e cercam os germânicos por trás', {'bars': 'none', 'sfx': [{'at': 0.5, 'name': 'swish', 'gain': -12}]}),
 ('s45', 114.15, 'vala', 'Rosto seu, assustado', {'sfx': [{'at': 0.2, 'name': 'heartbeat', 'gain': -12}]}),
 ('s46', 116.4, 'vala', 'Guerreiros espremidos na vala; escudos romanos atrás', {'amb': {'name': 'murmur', 'gain': -18}}),
 ('s47', 120.45, 'vala', 'Companheiros caindo um atrás do outro', {'sfx': [{'at': 0.4, 'name': 'hit', 'gain': -14}, {'at': 1.1, 'name': 'hit', 'gain': -14}, {'at': 1.8, 'name': 'hit', 'gain': -14}]}),
 ('s48', 122.7, 'campo', 'Inguiomero ferido carregado pelos seus', {'amb': {'name': 'wind', 'gain': -22}}),
 ('s49', 124.8, 'floresta', 'Armínio foge para dentro da floresta', {'sfx': [{'at': 0.2, 'name': 'whoosh', 'gain': -12}], 'amb': {'name': 'wind', 'gain': -22}}),
 ('s50', 126.3, 'pantano', 'A coluna romana marchando de volta ao entardecer', {'in': {'type': 'dip', 'dur': 0.4}, 'amb': {'name': 'wind', 'gain': -22}}),
 ('s51', 131.6, 'floresta', 'Rosto seu olhando para nós', {'in': {'type': 'dip', 'dur': 0.3}}),
 ('s52', 132.45, 'acampamento', 'Você na beira da floresta à noite, diante do acampamento: atacar ou esperar', {'amb': {'name': 'wind', 'gain': -22}}),
 ('s53', 136.25, 'fim', 'Tela final: pergunta, ATACAR / ESPERAR, COMENTA AÍ, três personagens', {'in': {'type': 'fade', 'dur': 0.4}, 'captions': False, 'sfx': [{'at': 0.3, 'name': 'pop', 'gain': -12}]}),
]
shots = []
for i, (sid, st, setn, scene, ex) in enumerate(S):
    en = S[i + 1][1] if i + 1 < len(S) else END
    line = ' '.join(w['word'] for w in W if w['start'] >= st - 0.05 and w['start'] < en - 0.05)
    d = {'id': sid, 'start': st, 'end': en, 'line': line, 'scene': scene, 'set': setn}; d.update(ex); shots.append(d)
music = [{'start': 0, 'end': 14.75, 'mood': 'mystery', 'intensity': 0.4}, {'start': 14.75, 'end': 53.0, 'mood': 'tension', 'intensity': 0.4},
         {'start': 53.0, 'end': 83.35, 'mood': 'tension', 'intensity': 0.6}, {'start': 83.35, 'end': 106.5, 'mood': 'action', 'intensity': 0.65},
         {'start': 106.5, 'end': 126.3, 'mood': 'dark', 'intensity': 0.7}, {'start': 126.3, 'end': END, 'mood': 'sad', 'intensity': 0.35}]
json.dump({'title': 'O que aconteceria se você atacasse um exército romano enquanto ele dormia?', 'duration': END, 'shots': shots, 'music': music, 'sfx': []}, open('story/shots.json', 'w'), ensure_ascii=False, indent=1)
print(len(shots), 'tomadas; mediana', round(sorted(s['end'] - s['start'] for s in shots)[len(shots) // 2], 2))

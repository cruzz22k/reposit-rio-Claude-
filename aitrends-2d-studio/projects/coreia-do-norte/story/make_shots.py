# Gera story/shots.json a partir da lista abaixo (início de cada tomada) + timeline/words.json.
import json
W = json.load(open('timeline/words.json')); W = W['words'] if isinstance(W, dict) else W
END = 142.5
S = [  # id, start, set, scene, extra
 ('s01', 0.0, 'avenida3d', '3D: avenida de Pyongyang ao entardecer, torre com chama, formação; título', {'captions': False, 'sfx': [{'at': 0.2, 'name': 'riser', 'gain': -12}], 'amb': {'name': 'wind', 'gain': -26}}),
 ('s02', 3.15, 'bercario', 'Berçário à noite, bebê no berço, bacia de banho ainda fumegando, push-in', {'in': {'type': 'dip', 'dur': 0.4}, 'amb': {'name': 'roomtone', 'gain': -26}}),
 ('s03', 6.0, 'bercario', 'Funcionário de sobretudo ao lado do berço segura uma ficha; a ficha salta na tela', {'sfx': [{'at': 0.9, 'name': 'pop', 'gain': -12}], 'amb': {'name': 'roomtone', 'gain': -26}}),
 ('s04', 8.25, 'bercario', 'Insert: a ficha SONGBUN enche a tela, carimbo vermelho bate em "songbun"', {'sfx': [{'at': 0.95, 'name': 'impact', 'gain': -8}]}),
 ('s05', 9.8, 'blueprint', 'Blueprint: família de traço, medidor LEALDADE AO REGIME enchendo', {'bars': 'none', 'sfx': [{'at': 0.5, 'name': 'blip', 'gain': -14}, {'at': 1.2, 'name': 'counter', 'gain': -16}]}),
 ('s06', 13.4, 'bercario', 'Rosto gigante do bebê, confuso, berçário desfocado', {'amb': {'name': 'roomtone', 'gain': -26}}),
 ('s07', 15.05, 'blueprint', 'Blueprint: árvore genealógica, avós no alto, setas douradas descem até o bebê', {'sfx': [{'at': 0.3, 'name': 'swish', 'gain': -14}]}),
 ('s08', 17.55, 'guerra', 'Flashback sépia: o avô com fuzil no morro ao lado da bandeira vermelha, fumaça', {'in': {'type': 'dipWhite', 'dur': 0.35}, 'sfx': [{'at': 0.3, 'name': 'impact', 'gain': -14}], 'amb': {'name': 'wind', 'gain': -22}}),
 ('s09', 19.25, 'piramide', 'Pirâmide do songbun (LEAL / VACILANTE / HOSTIL), o bebê sobe ao topo dourado', {'sfx': [{'at': 0.6, 'name': 'shimmer', 'gain': -12}]}),
 ('s10', 20.6, 'avenida3d', '3D: Pyongyang vista do alto, rótulo PYONGYANG', {'sfx': [{'at': 0.1, 'name': 'whoosh', 'gain': -12}], 'amb': {'name': 'city', 'gain': -26}}),
 ('s11', 22.35, 'escola', 'Criança de lenço vermelho subindo a escadaria de uma escola grandiosa, luz dourada', {'amb': {'name': 'city', 'gain': -28}}),
 ('s12', 24.2, 'piramide', 'Pirâmide: o marcador cai até a base HOSTIL, vermelha', {'sfx': [{'at': 0.5, 'name': 'stinger', 'gain': -10}]}),
 ('s13', 25.85, 'rua', 'Criança andando numa rua cinzenta; a sombra na parede é um carimbo vermelho que a segue', {'amb': {'name': 'wind', 'gain': -24}}),
 ('s14', 27.55, 'blueprint', 'Três ícones carimbados: casa (mora), mina (trabalha), alianças (casar)', {'bars': 'none', 'sfx': [{'at': 1.1, 'name': 'hit', 'gain': -12}, {'at': 2.35, 'name': 'hit', 'gain': -12}, {'at': 4.0, 'name': 'hit', 'gain': -10}]}),
 ('s15', 32.25, 'casa', 'Sala: família sentada à mesa baixa, parede do fundo com dois retratos iluminados, push-in', {'in': {'type': 'dip', 'dur': 0.4}, 'amb': {'name': 'roomtone', 'gain': -24}}),
 ('s16', 35.35, 'casa', 'Close na parede: contorno pontilhado de uma foto de família, riscado', {'sfx': [{'at': 1.0, 'name': 'blip', 'gain': -14}]}),
 ('s17', 36.85, 'casa', 'Rosto gigante da criança de lenço vermelho olhando para os dois retratos', {'amb': {'name': 'roomtone', 'gain': -24}}),
 ('s18', 39.45, 'casa', 'A mãe num banquinho limpando o retrato com um pano branco; brilho', {'sfx': [{'at': 1.2, 'name': 'shimmer', 'gain': -14}], 'amb': {'name': 'roomtone', 'gain': -24}}),
 ('s19', 41.4, 'casa', 'Janela: silhuetas de vizinhos espiando de fora', {'amb': {'name': 'wind', 'gain': -26}}),
 ('s20', 42.5, 'casa', 'A porta abre: a chefe do bairro passa o dedo na moldura; a família em pé, rígida', {'sfx': [{'at': 0.15, 'name': 'impact', 'gain': -16}], 'amb': {'name': 'roomtone', 'gain': -24}}),
 ('s21', 44.1, 'cerimonia', 'Cerimônia: fileiras de crianças num palco com bandeiras vermelhas; selo 7 ANOS', {'in': {'type': 'dip', 'dur': 0.4}, 'sfx': [{'at': 0.5, 'name': 'pop', 'gain': -12}], 'amb': {'name': 'murmur', 'gain': -26}}),
 ('s22', 46.82, 'cerimonia', 'Rosto gigante da criança; o lenço vermelho é amarrado no pescoço', {'sfx': [{'at': 0.6, 'name': 'swish', 'gain': -14}]}),
 ('s23', 48.55, 'quarto', 'Noite, criança na mesa com abajur; livros JURAMENTO, REGRAS, POEMAS caem na pilha', {'amb': {'name': 'roomtone', 'gain': -24}, 'sfx': [{'at': 1.6, 'name': 'hit', 'gain': -16}, {'at': 2.5, 'name': 'hit', 'gain': -16}, {'at': 3.3, 'name': 'hit', 'gain': -16}]}),
 ('s24', 52.95, 'classe', 'Sala de aula vazia, flores de primavera na janela, carteiras vazias', {'in': {'type': 'dip', 'dur': 0.35}, 'amb': {'name': 'wind', 'gain': -26}}),
 ('s25', 54.7, 'arroz3d', '3D: arrozal com crianças curvadas plantando em fileiras, montanhas, água refletindo', {'in': {'type': 'whip', 'dur': 0.35}, 'sfx': [{'at': 0.0, 'name': 'whoosh', 'gain': -12}], 'amb': {'name': 'wind', 'gain': -22}}),
 ('s26', 57.1, 'arrozal', 'Perfil da criança plantando; o céu vai do amanhecer à noite', {'amb': {'name': 'wind', 'gain': -24}}),
 ('s27', 58.82, 'arrozal', 'Rosto cansado da criança; contador DIA 1 → DIA 30', {'sfx': [{'at': 0.2, 'name': 'counter', 'gain': -14}]}),
 ('s28', 60.22, 'insert', 'Macro: broche vermelho com os líderes preso no peito; selo 12 ANOS', {'in': {'type': 'dip', 'dur': 0.35}, 'sfx': [{'at': 1.4, 'name': 'ding', 'gain': -12}]}),
 ('s29', 63.38, 'rua', 'Manhã: a criança sai de casa, o broche brilha no peito', {'amb': {'name': 'city', 'gain': -28}}),
 ('s30', 66.12, 'classe', 'Sala de reunião: crianças em fileiras, professora à frente; selo 13 ANOS', {'in': {'type': 'dip', 'dur': 0.35}, 'sfx': [{'at': 0.4, 'name': 'pop', 'gain': -12}], 'amb': {'name': 'roomtone', 'gain': -24}}),
 ('s31', 68.8, 'classe', 'De pé na frente da turma, cabeça baixa, confessando; holofote', {'amb': {'name': 'roomtone', 'gain': -24}}),
 ('s32', 73.0, 'classe', 'Rosto gigante assustado; braços apontando de todos os lados', {'sfx': [{'at': 0.7, 'name': 'stinger', 'gain': -12}]}),
 ('s33', 75.85, 'classe', 'Agora você aponta para outro colega, relutante', {'amb': {'name': 'roomtone', 'gain': -24}}),
 ('s34', 78.02, 'casa', 'Noite, pais à mesa com uma vela, tigela vazia; lembrança sépia ANOS 90', {'in': {'type': 'dip', 'dur': 0.4}, 'amb': {'name': 'wind', 'gain': -24}}),
 ('s35', 80.58, 'blueprint', 'Grade de pequenas figuras se apagando; CENTENAS DE MILHARES → TALVEZ MILHÕES', {'bars': 'none', 'sfx': [{'at': 0.3, 'name': 'heartbeat', 'gain': -12}]}),
 ('s36', 83.9, 'mercado', 'Mercado clandestino à noite: barracas com lampiões, lonas, gente', {'amb': {'name': 'murmur', 'gain': -22}}),
 ('s37', 86.2, 'mercado', 'A mãe vendendo sobre uma lona, um comprador; dinheiro passa de mão', {'amb': {'name': 'murmur', 'gain': -22}}),
 ('s38', 88.6, 'casa', 'Rosto gigante do adolescente, preocupado', {}),
 ('s39', 90.22, 'blueprint', 'Blueprint: dois jovens lado a lado, régua, cota 10 CM; NORTE x SUL', {'bars': 'none', 'sfx': [{'at': 2.4, 'name': 'pop', 'gain': -12}]}),
 ('s40', 95.82, 'insert', 'Macro: rádio com o dial lacrado, ponteiro preso numa estação', {'in': {'type': 'dip', 'dur': 0.35}, 'sfx': [{'at': 1.4, 'name': 'glitch', 'gain': -14}], 'amb': {'name': 'hum', 'gain': -26}}),
 ('s41', 98.98, 'quarto', 'Rosto do adolescente iluminado por uma tela; ícone do globo riscado', {'sfx': [{'at': 1.6, 'name': 'buzz', 'gain': -16}]}),
 ('s42', 101.4, 'blueprint', 'Rede fechada de nós dentro de um muro, um olho vigiando: REDE INTERNA', {'bars': 'none', 'sfx': [{'at': 0.4, 'name': 'blip', 'gain': -14}]}),
 ('s43', 103.65, 'quarto', 'Debaixo da coberta, de noite, vendo novela no pendrive; lanterna entra pela porta', {'amb': {'name': 'roomtone', 'gain': -26}, 'sfx': [{'at': 0.55, 'name': 'impact', 'gain': -10}]}),
 ('s44', 106.52, 'campo', 'Campo de trabalho forçado ao amanhecer, cerca, figuras com picaretas; 5 A 15 ANOS', {'sfx': [{'at': 1.2, 'name': 'counter', 'gain': -14}], 'amb': {'name': 'wind', 'gain': -22}}),
 ('s45', 109.8, 'rua', 'Posto de controle na estrada: guarda, cancela, você mostra o salvo-conduto', {'in': {'type': 'dip', 'dur': 0.35}, 'sfx': [{'at': 2.5, 'name': 'impact', 'gain': -14}], 'amb': {'name': 'wind', 'gain': -24}}),
 ('s46', 112.9, 'quartel3d', '3D: soldados marchando no pátio do quartel, bandeiras; selo 17 ANOS', {'sfx': [{'at': 0.2, 'name': 'whoosh', 'gain': -12}], 'amb': {'name': 'wind', 'gain': -24}}),
 ('s47', 115.4, 'blueprint', 'Barras de tempo: HOMENS 10 ANOS, MULHERES 7 ANOS', {'bars': 'none', 'sfx': [{'at': 1.4, 'name': 'pop', 'gain': -12}, {'at': 2.8, 'name': 'pop', 'gain': -12}]}),
 ('s48', 118.78, 'quartel', 'Portão do quartel: você entra adolescente, farda grande demais', {'in': {'type': 'dip', 'dur': 0.3}, 'amb': {'name': 'wind', 'gain': -24}}),
 ('s49', 120.3, 'quartel', 'Mesmo enquadramento: você sai adulto, cansado; contador 17 → 29', {'in': {'type': 'flash', 'dur': 0.35}, 'sfx': [{'at': 0.0, 'name': 'flash', 'gain': -12}, {'at': 0.2, 'name': 'counter', 'gain': -14}]}),
 ('s50', 121.85, 'rua', 'Noite, rua escura: alguém sussurra no seu ouvido', {'in': {'type': 'dip', 'dur': 0.4}, 'amb': {'name': 'wind', 'gain': -22}}),
 ('s51', 123.55, 'rio3d', '3D: o rio na fronteira, luzes da China do outro lado', {'sfx': [{'at': 0.3, 'name': 'shimmer', 'gain': -14}], 'amb': {'name': 'wind', 'gain': -20}}),
 ('s52', 126.5, 'rio', 'Close na cerca de arame, placa vermelha PROIBIDO, holofote varrendo', {'sfx': [{'at': 1.25, 'name': 'stinger', 'gain': -10}], 'amb': {'name': 'wind', 'gain': -20}}),
 ('s53', 128.2, 'rio', 'Polícia chinesa com luzes de sirene; você levado; seta de volta', {'sfx': [{'at': 0.3, 'name': 'carpass', 'gain': -16}], 'amb': {'name': 'wind', 'gain': -22}}),
 ('s54', 131.0, 'campo', 'Campo de reeducação na neve, torres de vigia, barracões', {'in': {'type': 'dip', 'dur': 0.35}, 'amb': {'name': 'wind', 'gain': -18}}),
 ('s55', 134.2, 'casa', 'A porta da casa dos pais abre com lanterna; pais assustados', {'sfx': [{'at': 0.25, 'name': 'impact', 'gain': -10}], 'amb': {'name': 'roomtone', 'gain': -24}}),
 ('s56', 136.3, 'rio', 'Rosto gigante seu, adulto, olhando para nós', {'in': {'type': 'dip', 'dur': 0.3}}),
 ('s57', 137.27, 'rio3d', '3D: o rio de novo, câmera avança sobre a água', {'amb': {'name': 'wind', 'gain': -20}}),
 ('s58', 139.1, 'casa', 'Você na janela de casa, à noite, olhando para fora', {'amb': {'name': 'roomtone', 'gain': -24}}),
 ('s59', 140.1, 'fim', 'Tela final: a pergunta, balão de comentário, elenco', {'in': {'type': 'fade', 'dur': 0.4}, 'captions': False, 'sfx': [{'at': 0.3, 'name': 'pop', 'gain': -12}]}),
]
shots = []
for i, (sid, st, setn, scene, ex) in enumerate(S):
    en = S[i + 1][1] if i + 1 < len(S) else END
    line = ' '.join(w['word'] for w in W if w['start'] >= st - 0.05 and w['start'] < en - 0.05)
    d = {'id': sid, 'start': st, 'end': en, 'line': line, 'scene': scene, 'set': setn}
    d.update(ex); shots.append(d)
music = [{'start': 0, 'end': 32.25, 'mood': 'mystery', 'intensity': 0.35}, {'start': 32.25, 'end': 66.12, 'mood': 'mystery', 'intensity': 0.45},
         {'start': 66.12, 'end': 95.82, 'mood': 'sad', 'intensity': 0.4}, {'start': 95.82, 'end': 121.85, 'mood': 'tension', 'intensity': 0.55},
         {'start': 121.85, 'end': 136.3, 'mood': 'dark', 'intensity': 0.6}, {'start': 136.3, 'end': END, 'mood': 'sad', 'intensity': 0.35}]
json.dump({'title': 'O que aconteceria se você nascesse na Coreia do Norte?', 'duration': END, 'shots': shots, 'music': music, 'sfx': []}, open('story/shots.json', 'w'), ensure_ascii=False, indent=1)
print(len(shots), 'shots; median', sorted(s['end'] - s['start'] for s in shots)[len(shots) // 2])

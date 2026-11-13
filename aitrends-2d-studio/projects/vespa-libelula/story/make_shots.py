# Gera story/shots.json: (id, início, cenário, descrição, extras). O fim de cada tomada é o início da próxima.
import json
W = json.load(open('timeline/words.json')); W = W['words'] if isinstance(W, dict) else W
END = 131.9
S = [
 ('s01', 0.0, 'lago3d', '3D: lago numa tarde quente, juncos, libélula parada no ar; título por cima (capa)', {'captions': False, 'in': {'type': 'fade', 'dur': 0.3}, 'sfx': [{'at': 0.1, 'name': 'riser', 'gain': -14}], 'amb': {'name': 'wind', 'gain': -26}}),
 ('s02', 4.3, 'ceu', 'Rosto da vespa (você); rótulo VOCÊ / VESPA', {'in': {'type': 'dip', 'dur': 0.3}, 'sfx': [{'at': 0.1, 'name': 'buzz', 'gain': -18}]}),
 ('s03', 5.55, 'ceu', 'Perfil da vespa: ferrão brilha, gota de veneno; rótulos FERRÃO e VENENO', {'sfx': [{'at': 0.35, 'name': 'ding', 'gain': -14}, {'at': 1.1, 'name': 'blip', 'gain': -14}]}),
 ('s04', 7.25, 'jardim', 'Bichinhos fugindo da vespa no jardim', {'sfx': [{'at': 0.3, 'name': 'whoosh', 'gain': -14}], 'amb': {'name': 'wind', 'gain': -26}}),
 ('s05', 9.9, 'lago3d', '3D: a vespa sobrevoa o lago à tarde', {'in': {'type': 'dip', 'dur': 0.35}, 'sfx': [{'at': 0.2, 'name': 'buzz', 'gain': -18}], 'amb': {'name': 'wind', 'gain': -24}}),
 ('s06', 13.65, 'ceu', 'Rosto da vespa olhando para cima', {'amb': {'name': 'wind', 'gain': -26}}),
 ('s07', 15.5, 'lago3d', '3D: a libélula parada no ar, asas borradas, câmera girando em volta', {'sfx': [{'at': 0.1, 'name': 'hum', 'gain': -18}], 'amb': {'name': 'wind', 'gain': -24}}),
 ('s08', 17.45, 'ceu', 'Rosto da libélula: fofa, depois o olhar muda em "Ela não é"', {'sfx': [{'at': 1.5, 'name': 'stinger', 'gain': -12}]}),
 ('s09', 19.6, 'blueprint', 'Olho composto em hexágonos; contador 30.000 LENTES', {'bars': 'none', 'sfx': [{'at': 1.6, 'name': 'counter', 'gain': -14}]}),
 ('s10', 22.55, 'blueprint', 'Vista de cima: campo de visão abrindo até 360°; FRENTE, LADOS, TRÁS', {'bars': 'none', 'sfx': [{'at': 2.4, 'name': 'swish', 'gain': -14}]}),
 ('s11', 28.85, 'ceu', 'A libélula ao longe já olhando; a vespa distraída em primeiro plano', {'amb': {'name': 'wind', 'gain': -26}}),
 ('s12', 31.05, 'savana', 'Leão correndo atrás de uma zebra, em silhueta; riscado', {'in': {'type': 'whip', 'dur': 0.3}, 'sfx': [{'at': 0.0, 'name': 'whoosh', 'gain': -12}]}),
 ('s13', 34.35, 'blueprint', 'Rota da vespa tracejada; X dourado onde ela vai estar; libélula em linha reta até o X', {'bars': 'none', 'sfx': [{'at': 1.1, 'name': 'pop', 'gain': -12}]}),
 ('s14', 38.25, 'pov', 'Visão da libélula com mira: a vespa fica sempre no mesmo ponto, cada vez maior', {'sfx': [{'at': 0.5, 'name': 'heartbeat', 'gain': -14}]}),
 ('s15', 43.7, 'blueprint', 'As duas rotas se cruzam com um clarão', {'bars': 'none', 'sfx': [{'at': 1.4, 'name': 'impact', 'gain': -12}]}),
 ('s16', 45.7, 'blueprint', 'Perfil: campo de visão da vespa para a frente, ponto cego vermelho embaixo e atrás; a libélula sobe por ali', {'bars': 'none', 'sfx': [{'at': 2.5, 'name': 'blip', 'gain': -14}]}),
 ('s17', 50.15, 'pov', 'Visão de baixo: céu claro, a vespa como manchinha escura dentro do alvo', {'sfx': [{'at': 3.3, 'name': 'blip', 'gain': -14}]}),
 ('s18', 54.75, 'ceu', 'A vespa voando tranquila; a sombra da libélula logo atrás e embaixo', {'amb': {'name': 'wind', 'gain': -24}}),
 ('s19', 57.1, 'lago3d', '3D: close da libélula, as quatro asas batendo cada uma num ritmo', {'sfx': [{'at': 0.1, 'name': 'hum', 'gain': -16}], 'amb': {'name': 'wind', 'gain': -24}}),
 ('s20', 60.0, 'blueprint', 'Manobras em traço: PARA, SOBE, MEIA-VOLTA, DE RÉ', {'bars': 'none', 'sfx': [{'at': 0.2, 'name': 'blip', 'gain': -14}, {'at': 0.95, 'name': 'blip', 'gain': -14}, {'at': 1.8, 'name': 'blip', 'gain': -14}, {'at': 3.2, 'name': 'blip', 'gain': -14}]}),
 ('s21', 63.85, 'ceu', 'Libélula em disparada com linhas de velocidade; 50 KM/H', {'sfx': [{'at': 0.1, 'name': 'whoosh', 'gain': -10}]}),
 ('s22', 66.2, 'blueprint', 'Barras: LIBÉLULAS 95% dos ataques', {'in': {'type': 'dip', 'dur': 0.3}, 'bars': 'none', 'sfx': [{'at': 3.4, 'name': 'ding', 'gain': -12}]}),
 ('s23', 71.25, 'blueprint', 'Barras: LEÃO 1 EM 4 (25%)', {'bars': 'none', 'sfx': [{'at': 1.4, 'name': 'pop', 'gain': -12}]}),
 ('s24', 74.0, 'ceu', 'Rosto da vespa em choque', {'in': {'type': 'flash', 'dur': 0.3}, 'sfx': [{'at': 0.0, 'name': 'impact', 'gain': -10}]}),
 ('s25', 76.2, 'ceu', 'Macro: seis pernas espinhosas se fecham em volta da vespa como uma cestinha', {'sfx': [{'at': 2.0, 'name': 'hit', 'gain': -12}]}),
 ('s26', 80.85, 'ceu', 'A vespa tenta curvar o ferrão; a libélula segura por trás', {'amb': {'name': 'wind', 'gain': -24}}),
 ('s27', 84.6, 'ceu', 'Rosto da libélula com as mandíbulas abrindo e fechando', {'sfx': [{'at': 1.2, 'name': 'hit', 'gain': -10}]}),
 ('s28', 90.5, 'ceu', 'Close das listras amarelas e pretas brilhando como aviso', {'in': {'type': 'dip', 'dur': 0.3}, 'sfx': [{'at': 0.6, 'name': 'shimmer', 'gain': -14}]}),
 ('s29', 94.7, 'blueprint', 'Dois alvos (mosca x vespa) com desconfiança quase igual; QUASE NADA', {'bars': 'none', 'sfx': [{'at': 5.2, 'name': 'pop', 'gain': -12}]}),
 ('s30', 100.6, 'ceu', 'A libélula seguindo em frente', {}),
 ('s31', 101.65, 'lab', 'Laboratório: libélula comendo moscas, contador até 30', {'sfx': [{'at': 2.8, 'name': 'counter', 'gain': -14}], 'amb': {'name': 'roomtone', 'gain': -26}}),
 ('s32', 107.8, 'blueprint', 'Linha do tempo: 300 MILHÕES DE ANOS', {'in': {'type': 'dip', 'dur': 0.3}, 'bars': 'none', 'sfx': [{'at': 1.8, 'name': 'riser', 'gain': -16}]}),
 ('s33', 111.7, 'floresta3d', '3D: floresta pré-histórica de samambaias com uma libélula gigante; uma pessoa para escala; 60 CM', {'sfx': [{'at': 0.2, 'name': 'hum', 'gain': -16}], 'amb': {'name': 'wind', 'gain': -22}}),
 ('s34', 116.2, 'ceu', 'Rosto da vespa, determinado', {'in': {'type': 'dip', 'dur': 0.3}}),
 ('s35', 118.1, 'ceu', 'A vespa parte para cima da libélula; QUEM CAÇA / É VOCÊ', {'sfx': [{'at': 0.9, 'name': 'stinger', 'gain': -12}]}),
 ('s36', 120.5, 'ceu', 'A vespa ataca a libélula no ar; pedaço de asa voa', {'sfx': [{'at': 1.5, 'name': 'hit', 'gain': -10}, {'at': 3.0, 'name': 'hit', 'gain': -12}]}),
 ('s37', 125.0, 'ceu', 'Rosto da vespa olhando para nós', {'in': {'type': 'dip', 'dur': 0.3}}),
 ('s38', 125.9, 'ceu', 'A vespa entre duas escolhas: FUGIR? / ATACAR?', {}),
 ('s39', 129.5, 'fim', 'Tela final: pergunta, FUGIR / ATACAR, COMENTA AÍ, três personagens', {'in': {'type': 'fade', 'dur': 0.4}, 'captions': False, 'sfx': [{'at': 0.3, 'name': 'pop', 'gain': -12}]}),
]
shots = []
for i, (sid, st, setn, scene, ex) in enumerate(S):
    en = S[i + 1][1] if i + 1 < len(S) else END
    line = ' '.join(w['word'] for w in W if w['start'] >= st - 0.05 and w['start'] < en - 0.05)
    d = {'id': sid, 'start': st, 'end': en, 'line': line, 'scene': scene, 'set': setn}; d.update(ex); shots.append(d)
music = [{'start': 0, 'end': 17.45, 'mood': 'playful', 'intensity': 0.35}, {'start': 17.45, 'end': 54.75, 'mood': 'mystery', 'intensity': 0.45},
         {'start': 54.75, 'end': 74.0, 'mood': 'tension', 'intensity': 0.55}, {'start': 74.0, 'end': 107.8, 'mood': 'dark', 'intensity': 0.6},
         {'start': 107.8, 'end': 118.1, 'mood': 'wonder', 'intensity': 0.45}, {'start': 118.1, 'end': END, 'mood': 'action', 'intensity': 0.5}]
json.dump({'title': 'O que aconteceria se você fosse uma vespa e cruzasse com uma libélula?', 'duration': END, 'shots': shots, 'music': music, 'sfx': []}, open('story/shots.json', 'w'), ensure_ascii=False, indent=1)
print(len(shots), 'tomadas; mediana', round(sorted(s['end'] - s['start'] for s in shots)[len(shots) // 2], 2))

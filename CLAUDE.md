# Vídeos do canal "O que aconteceria se..."

- Seguir a skill `estilo-o-que-aconteceria` e o estúdio em `aitrends-2d-studio/`.
- **Só 2D, sem cenas em 3D.** Preferência confirmada pelo usuário em 13/11/2026: testou cenas em 3D (vespa) e o estilo chibi 3D (amostra do acampamento romano) e escolheu o 2D, como no vídeo do acampamento romano (`aitrends-2d-studio/projects/romanos-acampamento`).
- **Acabamento cinematográfico em todo vídeo novo** (pedido de 13/11/2026: "capricha mais nas animações, deixe mais cinematográfico, melhore tudo"). Usar `engine/cine.js` em todas as tomadas:
  - câmera sempre com `camPath` (trajetória suave + leve movimento de mão), nunca parada; `punch` nas batidas fortes;
  - profundidade: `fogDrift` (névoa deslizando), `bokeh` no primeiro plano, `foreLeaves`/objetos desfocados na frente, `dof` + `focus` para mudar o foco ao apresentar um personagem;
  - luz: `shafts` (feixes que respiram) saindo da fonte principal; contorno de luz da cor da fonte mais próxima (fria da lua, quente da tocha);
  - atuação: antecipação antes dos gestos (`blendPose` com easing), viradas de cabeça, olhar que muda na palavra certa; as piscadas já são automáticas no rig.
  - Referência: tomadas s01–s04 de `projects/romanos-acampamento/scenes/shots/01_noite.js`.
- Nunca rode duas renderizações ao mesmo tempo no mesmo projeto: elas compartilham `build/parts` e uma apaga a outra.

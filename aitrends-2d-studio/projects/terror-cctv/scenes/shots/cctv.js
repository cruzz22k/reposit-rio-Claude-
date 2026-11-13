// shots/cctv.js — "Regras do turno da noite": câmera de segurança fixa do posto 24h.
import { E, registerShot, ease, prog, lerp, clamp } from '/engine/core.js';
import { gasStation, tallFigure, cctvPost, typewriter } from '../sets/horror.js';

registerShot('h1', { kind: '3d',
  init(T) {
    const g = gasStation(T, { fov: 64 }), fig = tallFigure(T, { h: 2.6, eyes: true }); fig.visible = false; g.st.add(fig);
    return { stage: g.st, g, fig };
  },
  draw(s, t, info, T) {
    const cam = s.stage.camera, zoom = t > 8.6 ? 1 : 0;   // corte seco para um "zoom digital" na hora do susto
    if (!zoom) { cam.position.set(7.5, 6.2, 9.5); cam.lookAt(-0.5, 0.6, -1.5); cam.fov = 64; }
    else { cam.position.set(4.2, 4.0, 5.2); cam.lookAt(2.2, 1.4, 0.6); cam.fov = 50; }
    cam.updateProjectionMatrix();
    // a bomba 3 pisca a partir de 6,0 s
    const p3 = s.g.lamps[2], blink = t > 6.0 && t < 8.4 ? (Math.sin(t * 37) * Math.sin(t * 11) > 0.1 ? 1 : 0.05) : t >= 8.4 ? 0.25 : 1;
    p3.pl.intensity = 14 * blink; p3.panel.material.color.setScalar(blink > 0.5 ? 1 : 0.08); s.g.pumps[2].material.color.setScalar(blink > 0.5 ? 1 : 0.2);
    // a figura: aparece na beira da estrada, some, e surge do lado da bomba 3
    const f = s.fig;
    if (t > 6.8 && t < 8.3) { f.visible = true; f.position.set(-6.5, 0, 11.2); f.rotation.y = 0.6; }
    else if (t >= 8.6) { f.visible = true; f.position.set(2.6, 0, 1.3); f.rotation.y = 0.9 + Math.sin(t * 2) * 0.02; }
    else f.visible = false;
  },
  overlay(g, t, info, s) {
    typewriter(g, t, 'REGRA Nº 4', 70, 300, 0.6, 18, { size: 50, color: '#e8e8e0' });
    typewriter(g, t, 'Se as luzes da bomba 3\npiscarem, NÃO saia da loja.', 70, 380, 1.4, 24, { size: 42 });
    typewriter(g, t, 'Não importa quem\nchame seu nome.', 70, 520, 4.2, 22, { size: 42, color: '#e86a5a' });
    const gl = (t > 8.35 && t < 8.7 ? 1 : 0) + (t > 9.3 ? 1.6 : 0);
    cctvPost(g, t, { glitch: gl, noise: t > 9.3 ? 0.4 : 0.07 });
    if (t > 9.45) { g.fillStyle = '#000'; g.fillRect(0, 0, E.W, E.H); g.save(); g.globalAlpha = 0.9; g.font = '700 46px "DejaVu Sans Mono"'; g.fillStyle = '#e8e8e0'; g.textAlign = 'center'; g.fillText('SINAL PERDIDO', E.W / 2, E.H / 2); g.restore(); }
  },
});

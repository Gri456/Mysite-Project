(() => {
  'use strict';

  // ---- Mapeamento: que animação aplicar a cada página ----
  const animByArea = {
    webdev: animWebDev,
    cyber: animCyber,   // NOVO
    ai: animAI,         // NOVO
    data: animData,
    mobile: animMobile,
    cloud: animCloud,   // NOVO
  };

  const stopMap = new WeakMap();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    document.querySelectorAll('a[href$=".html"]').forEach(a => {
      const area = detectArea(a.getAttribute('href') || '');
      if (!area) return;

      const svg = a.querySelector('svg');
      if (!svg) return;

      const onEnter = () => {
        const runningStop = stopMap.get(a);
        if (runningStop) runningStop();

        const start = animByArea[area];
        if (typeof start === 'function') {
          const stop = start(svg);
          stopMap.set(a, typeof stop === 'function' ? stop : null);
        }
      };

      const onLeave = () => {
        const runningStop = stopMap.get(a);
        if (runningStop) runningStop();
        stopMap.set(a, null);
      };

      a.addEventListener('mouseenter', onEnter);
      a.addEventListener('mouseleave', onLeave);
      a.addEventListener('focus', onEnter); // teclado
      a.addEventListener('blur', onLeave);
    });
  }

  // ---- Deteção robusta da área pelo href ----
  function detectArea(hrefRaw) {
    const href = hrefRaw.toLowerCase();
    if (href.includes('webdev') || href.includes('web-development')) return 'webdev';
    if (href.includes('cyber')) return 'cyber';
    if (href.includes('artificial-intelligence') || href.includes('ai')) return 'ai';
    if (href.includes('data-science') || href.includes('datascience')) return 'data';
    if (href.includes('mobile-development') || href.includes('mobile')) return 'mobile';
    if (href.includes('cloud-computing') || href.includes('cloud')) return 'cloud';
    return null;
  }

  // =========================================================
  // 1) WEB DEV — “desenhar” (stroke-dashoffset progressivo)
  // =========================================================
  function animWebDev(svg) {
    const paths = Array.from(svg.querySelectorAll('path, line, polyline, rect, circle, ellipse'));
    if (!paths.length) return () => {};

    const originals = [];
    const lens = [];

    paths.forEach(el => {
      const len = getLen(el);
      lens.push(len);
      originals.push({
        el,
        dash: el.getAttribute('stroke-dasharray'),
        off: el.getAttribute('stroke-dashoffset'),
      });
      el.setAttribute('stroke-dasharray', String(len));
      el.setAttribute('stroke-dashoffset', String(len));
    });

    let id, t0;
    const duration = 900; // ms

    function frame(ts) {
      if (!t0) t0 = ts;
      const p = Math.min(1, (ts - t0) / duration);
      const inv = 1 - p;
      for (let i = 0; i < paths.length; i++) {
        paths[i].setAttribute('stroke-dashoffset', String(inv * lens[i]));
      }
      if (p < 1) id = requestAnimationFrame(frame);
    }
    id = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(id);
      originals.forEach(({ el, dash, off }) => {
        if (dash == null) el.removeAttribute('stroke-dasharray'); else el.setAttribute('stroke-dasharray', dash);
        if (off == null) el.removeAttribute('stroke-dashoffset'); else el.setAttribute('stroke-dashoffset', off);
      });
    };
  }

  // =========================================================
  // 2) CYBER — ring rotate + crosshair (NOVO)
  // =========================================================
  function animCyber(svg) {
    const ring = createSvgEl('circle', {
      cx: '12', cy: '12', r: '10',
      fill: 'none', stroke: '#ef4444', 'stroke-width': '1.8',
      'stroke-dasharray': '10 14', 'stroke-linecap': 'round', opacity: '0.95'
    });
    const hLine = createSvgEl('line', { x1: '4', y1: '12', x2: '20', y2: '12', stroke: '#ff0b00', 'stroke-width': '1.2', opacity: '0' });
    const vLine = createSvgEl('line', { x1: '12', y1: '4', x2: '12', y2: '20', stroke: '#fa3928', 'stroke-width': '1.2', opacity: '0' });

    svg.appendChild(ring);
    svg.appendChild(hLine);
    svg.appendChild(vLine);

    let id, t0;
    function frame(ts) {
      if (!t0) t0 = ts;
      const t = (ts - t0) / 1000;
      const off = (t * 40) % 1000; // velocidade
      ring.setAttribute('stroke-dashoffset', off.toFixed(2));
      const flash = Math.max(0, 1 - t * 2);
      const op = (flash > 0) ? (0.5 * flash) : 0;
      hLine.setAttribute('opacity', op.toFixed(2));
      vLine.setAttribute('opacity', op.toFixed(2));
      id = requestAnimationFrame(frame);
    }
    id = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(id);
      ring.remove(); hLine.remove(); vLine.remove();
    };
  }

  // =========================================================
  // 3) AI — ligações neurais (NOVO)
  // =========================================================
  function animAI(svg) {
    let running = true;
    const links = new Set();
    const timer = setInterval(spawnLink, 160);

    function stop() {
      running = false;
      clearInterval(timer);
      links.forEach(el => el.remove());
      links.clear();
    }

    function spawnLink() {
      if (!running) return;
      const x1 = 12 + (Math.random() - 0.5) * 8;
      const y1 = 12 + (Math.random() - 0.5) * 8;
      const x2 = x1 + (Math.random() - 0.5) * 6;
      const y2 = y1 + (Math.random() - 0.5) * 6;

      const p = createSvgEl('line', {
        x1: x1.toFixed(2), y1: y1.toFixed(2),
        x2: x2.toFixed(2), y2: y2.toFixed(2),
        stroke: '#ad55ffff', 'stroke-width': '1.6',
        'stroke-linecap': 'round', opacity: '1'
      });
      svg.appendChild(p);
      links.add(p);

      const len = Math.hypot(x2 - x1, y2 - y1);
      p.setAttribute('stroke-dasharray', String(len.toFixed(2)));
      p.setAttribute('stroke-dashoffset', String(len.toFixed(2)));

      const t0 = performance.now();
      const drawDur = 220 + Math.random() * 120;
      const hold = 120;
      const fadeDur = 220;

      let id;
      function frame(ts) {
        const dt = ts - t0;
        if (dt < drawDur) {
          const k = 1 - dt / drawDur;
          p.setAttribute('stroke-dashoffset', (k * len).toFixed(2));
        } else if (dt < drawDur + hold) {
          p.setAttribute('stroke-dashoffset', '0');
        } else if (dt < drawDur + hold + fadeDur) {
          const f = 1 - (dt - drawDur - hold) / fadeDur;
          p.setAttribute('opacity', Math.max(0, f).toFixed(2));
        } else {
          cancelAnimationFrame(id);
          links.delete(p);
          p.remove();
          return;
        }
        id = requestAnimationFrame(frame);
      }
      id = requestAnimationFrame(frame);
    }

    return stop;
  }

  // =========================================================
  // 4) DATA — dois pontos a orbitar dentro do viewBox (24)
  // =========================================================
  function animData(svg) {
    const dot1 = createSvgEl('circle', { cx: '12', cy: '12', r: '1.2', fill: '#19fa00' });
    const dot2 = createSvgEl('circle', { cx: '12', cy: '12', r: '1.2', fill: '#00fa41' });
    svg.appendChild(dot1);
    svg.appendChild(dot2);

    let id, t0;
    function frame(ts) {
      if (!t0) t0 = ts;
      const t = (ts - t0) / 1000; // s
      const r1 = 6, r2 = 4;

      const x1 = 12 + r1 * Math.cos(t * 2);
      const y1 = 12 + r1 * Math.sin(t * 2);
      const x2 = 12 + r2 * Math.cos(-t * 2.6);
      const y2 = 12 + r2 * Math.sin(-t * 2.6);

      dot1.setAttribute('cx', x1.toFixed(2)); dot1.setAttribute('cy', y1.toFixed(2));
      dot2.setAttribute('cx', x2.toFixed(2)); dot2.setAttribute('cy', y2.toFixed(2));

      id = requestAnimationFrame(frame);
    }
    id = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(id);
      dot1.remove(); dot2.remove();
    };
  }

  // =========================================================
  // 5) MOBILE — “piscar” do ponto home (M12 18h.01)
  // =========================================================
  function animMobile(svg) {
    const home =
      svg.querySelector('path[d^="M12 18"][d*="h.01"]') ||
      svg.querySelector('path:last-of-type');
    if (!home) return () => {};

    const originalOpacity = home.getAttribute('opacity');
    let id, t0;

    function frame(ts) {
      if (!t0) t0 = ts;
      const s = (Math.sin((ts - t0) / 100) + 1) / 2; // rápido
      const op = 0.25 + s * 0.75; // 0.25..1
      home.setAttribute('opacity', op.toFixed(2));
      id = requestAnimationFrame(frame);
    }
    id = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(id);
      if (originalOpacity == null) home.removeAttribute('opacity');
      else home.setAttribute('opacity', originalOpacity);
    };
  }

  // =========================================================
  // 6) CLOUD — upload arrows a subir (NOVO)
  // =========================================================
  function animCloud(svg) {
    const arrows = [ -4, 0, 4 ].map((dx, i) => {
      const x = 12 + dx;
      const poly = createSvgEl('polyline', {
        points: `${x},17 ${x},12  ${x-2},14  ${x},10  ${x+2},14  ${x},12`,
        fill: 'none', stroke: '#5ddcecff', 'stroke-width': '1.6', 'stroke-linejoin': 'round', 'stroke-linecap': 'round',
        opacity: '0.9'
      });
      svg.appendChild(poly);
      return { el: poly, dx, delay: i * 0.25 };
    });

    let id, t0;
    function frame(ts) {
      if (!t0) t0 = ts;
      const t = (ts - t0) / 1000; // s
      arrows.forEach((a, i) => {
        const phase = (t + a.delay) % 1.6;         // ciclo ~1.6s
        const dy = 6 - phase * 8;                  // sobe ~8px
        const fade = phase < 0.2 ? phase / 0.2 : (phase > 1.4 ? (1.6 - phase) / 0.2 : 1);
        const x = 12 + a.dx;
        const pts = [
          [x, 17 + dy], [x, 12 + dy], [x - 2, 14 + dy],
          [x, 10 + dy], [x + 2, 14 + dy], [x, 12 + dy]
        ].map(([px, py]) => `${px.toFixed(2)},${py.toFixed(2)}`).join(' ');
        a.el.setAttribute('points', pts);
        a.el.setAttribute('opacity', (0.35 + 0.55 * fade).toFixed(2));
      });
      id = requestAnimationFrame(frame);
    }
    id = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(id);
      arrows.forEach(a => a.el.remove());
    };
  }

  // ----------------- Helpers -----------------
  function createSvgEl(type, attrs = {}) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', type);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    return el;
  }

  function getLen(el) {
    try {
      if (typeof el.getTotalLength === 'function') return el.getTotalLength();
    } catch {}
    const tag = el.tagName.toLowerCase();
    if (tag === 'rect') {
      const w = +el.getAttribute('width') || 0;
      const h = +el.getAttribute('height') || 0;
      return 2 * (w + h);
    }
    if (tag === 'circle') {
      const r = +el.getAttribute('r') || 0;
      return 2 * Math.PI * r;
    }
    if (tag === 'ellipse') {
      const rx = +el.getAttribute('rx') || 0;
      const ry = +el.getAttribute('ry') || 0;
      return Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
    }
    return 120;
  }

  function lerpColor(a, b, t) {
    const c1 = hexToRgb(a), c2 = hexToRgb(b);
    const r = Math.round(c1.r + (c2.r - c1.r) * t);
    const g = Math.round(c1.g + (c2.g - c1.g) * t);
    const b2 = Math.round(c1.b + (c2.b - c1.b) * t);
    return `rgb(${r},${g},${b2})`;
  }
  function hexToRgb(hex) {
    const m = hex.replace('#', '').match(/.{1,2}/g) || ['00','00','00'];
    return { r: parseInt(m[0], 16), g: parseInt(m[1], 16), b: parseInt(m[2], 16) };
  }
})();

/* ════════════════════════════════════════════════════════════
   script.js — TMRW Unlimit · Antigravity Theme
   ════════════════════════════════════════════════════════════ */

/* ── Theme Toggle ───────────────────────────────────────── */
const html        = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

/* ── Navbar scroll shadow ───────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ── Mobile menu ────────────────────────────────────────── */
const burger = document.getElementById('burger');
const mMenu  = document.getElementById('mMenu');

burger.addEventListener('click', () => {
  const open = mMenu.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(open));

  const spans = burger.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
});

mMenu.querySelectorAll('.m-link').forEach(link => {
  link.addEventListener('click', () => {
    mMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    const spans = burger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  });
});

/* ── Scroll Reveal ──────────────────────────────────────── */
const revealEls = document.querySelectorAll('.r');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('v');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

/* ── Active nav link on scroll ──────────────────────────── */
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === `#${entry.target.id}`
        );
      });
    }
  });
}, {
  threshold: 0.4
});

sections.forEach(s => sectionObserver.observe(s));

/* ── Active nav link styles ─────────────────────────────── */
const style = document.createElement('style');
style.textContent = `
  .nav-links a.active {
    color: var(--ink) !important;
  }
  .nav-links a.active::after {
    width: 100% !important;
  }
`;
document.head.appendChild(style);

/* ── Smooth scroll for all anchor links ─────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

/* ── Contact form ───────────────────────────────────────── */
const cForm   = document.getElementById('cForm');
const fStatus = document.getElementById('fStatus');

cForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn     = cForm.querySelector('.submit-btn');
  const fname   = cForm.fname.value.trim();
  const email   = cForm.email.value.trim();
  const message = cForm.message.value.trim();

  if (!fname || !email || !message) {
    fStatus.textContent = '⚠️ Please fill in all required fields.';
    fStatus.className   = 'f-status err';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fStatus.textContent = '⚠️ Please enter a valid email address.';
    fStatus.className   = 'f-status err';
    return;
  }

  btn.disabled        = true;
  btn.textContent     = 'Sending…';
  fStatus.textContent = '';
  fStatus.className   = 'f-status';

  await new Promise(resolve => setTimeout(resolve, 1400));

  btn.disabled        = false;
  btn.textContent     = 'Send Message →';
  fStatus.textContent = '✅ Message sent! We\'ll get back to you within 24 hours.';
  fStatus.className   = 'f-status ok';
  cForm.reset();

  setTimeout(() => {
    fStatus.textContent = '';
    fStatus.className   = 'f-status';
  }, 6000);
});

/* ════════════════════════════════════════════════════════════
   Portfolio — Horizontal Scroll (3 cards visible, scroll-driven)
   ════════════════════════════════════════════════════════════ */
(function () {
  const section = document.getElementById('portfolio');
  const track   = document.getElementById('projectsTrack');
  const fill    = document.getElementById('portfolioProgress');
  const label   = document.getElementById('portfolioLabel');

  if (!section || !track) return;

  const cards      = track.querySelectorAll('.proj-card');
  const CARD_COUNT = cards.length;
  let   currentX   = 0;

  function getCardWidth() {
    return cards[0] ? cards[0].offsetWidth : 360;
  }

  function getGap() {
    return parseFloat(getComputedStyle(track).gap) || 20;
  }

  function getVisibleCount() {
    return window.innerWidth <= 768 ? 1 : 3;
  }

  function getMaxScroll() {
    const cw  = getCardWidth();
    const gap = getGap();
    const vis = getVisibleCount();
    return Math.max(0, (CARD_COUNT - vis) * (cw + gap));
  }

  function updateProgress(x) {
    const max     = getMaxScroll();
    const ratio   = max > 0 ? Math.min(Math.max(x / max, 0), 1) : 0;
    const cardIdx = Math.min(Math.round(ratio * (CARD_COUNT - 1)) + 1, CARD_COUNT);
    if (fill)  fill.style.width  = `${ratio * 100}%`;
    if (label) label.textContent = `${cardIdx} / ${CARD_COUNT}`;
  }

  function onScroll() {
    if (window.innerWidth <= 768) return;

    const rect     = section.getBoundingClientRect();
    const total    = section.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;
    const ratio    = Math.min(Math.max(scrolled / total, 0), 1);

    currentX = ratio * getMaxScroll();
    track.style.transition = 'none';
    track.style.transform  = `translateX(-${currentX}px)`;
    updateProgress(currentX);
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  const wrap = track.parentElement;
  let isDragging = false, dragStartX = 0, dragStartScroll = 0;

  function setX(x) {
    const max = getMaxScroll();
    currentX  = Math.min(Math.max(x, 0), max);
    track.style.transition = 'transform .05s linear';
    track.style.transform  = `translateX(-${currentX}px)`;
    updateProgress(currentX);
  }

  wrap.addEventListener('mousedown', (e) => {
    isDragging      = true;
    dragStartX      = e.clientX;
    dragStartScroll = currentX;
    track.style.transition = 'none';
  });
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    setX(dragStartScroll + (dragStartX - e.clientX));
  });
  window.addEventListener('mouseup', () => { isDragging = false; });

  wrap.addEventListener('touchstart', (e) => {
    dragStartX      = e.touches[0].clientX;
    dragStartScroll = currentX;
    track.style.transition = 'none';
  }, { passive: true });
  wrap.addEventListener('touchmove', (e) => {
    setX(dragStartScroll + (dragStartX - e.touches[0].clientX));
  }, { passive: true });

  updateProgress(0);
})();

/* ════════════════════════════════════════════════════════════
   BG Canvas — Particle Field (Antigravity-style)
   ════════════════════════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const CONFIG = {
    count:        120,
    baseRadius:   1.2,
    speed:        0.18,
    mouseRadius:  180,
    mouseForce:   0.055,
    returnForce:  0.028,
    friction:     0.88,
    lineDistance: 110,
    lineOpacity:  0.09,
  };

  let W, H, dpr;
  let mouse     = { x: -9999, y: -9999 };
  let particles = [];
  let raf;
  let isDark    = true;

  function resize() {
    dpr    = Math.min(window.devicePixelRatio || 1, 2);
    W      = window.innerWidth;
    H      = window.innerHeight;
    canvas.width        = W * dpr;
    canvas.height       = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makeParticle() {
    const depth = 0.3 + Math.random() * 0.7;
    return {
      x:   Math.random() * W,
      y:   Math.random() * H,
      ox:  0, oy: 0,
      vx:  (Math.random() - 0.5) * CONFIG.speed,
      vy:  (Math.random() - 0.5) * CONFIG.speed,
      dvx: 0, dvy: 0,
      depth,
      r:   CONFIG.baseRadius * depth,
    };
  }

  function initParticles() {
    particles = Array.from({ length: CONFIG.count }, makeParticle);
  }

  function getTheme() {
    return document.documentElement.getAttribute('data-theme') !== 'light';
  }

  function particleColor(depth) {
    if (isDark) {
      const r = Math.round(80  + depth * 60);
      const g = Math.round(60  + depth * 80);
      const b = Math.round(180 + depth * 75);
      return `rgba(${r},${g},${b},${0.25 + depth * 0.45})`;
    } else {
      const r = Math.round(80  + depth * 40);
      const g = Math.round(60  + depth * 60);
      const b = Math.round(200 + depth * 55);
      return `rgba(${r},${g},${b},${0.15 + depth * 0.3})`;
    }
  }

  function lineColor(alpha) {
    return isDark
      ? `rgba(108,99,255,${alpha})`
      : `rgba(91,82,240,${alpha})`;
  }

  function tick() {
    isDark = getTheme();
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p    = particles[i];
      const dx   = p.x - mouse.x;
      const dy   = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CONFIG.mouseRadius && dist > 0) {
        const force = (1 - dist / CONFIG.mouseRadius) * CONFIG.mouseForce;
        const angle = Math.atan2(dy, dx);
        p.dvx += Math.cos(angle) * force * p.depth;
        p.dvy += Math.sin(angle) * force * p.depth;
      }

      p.dvx *= CONFIG.friction;
      p.dvy *= CONFIG.friction;
      p.x   += p.vx + p.dvx;
      p.y   += p.vy + p.dvy;

      if (p.x < -10)    p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10)    p.y = H + 10;
      if (p.y > H + 10) p.y = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = particleColor(p.depth);
      ctx.fill();
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a  = particles[i];
        const b  = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d  = Math.sqrt(dx * dx + dy * dy);

        if (d < CONFIG.lineDistance) {
          const alpha = (1 - d / CONFIG.lineDistance)
                        * CONFIG.lineOpacity
                        * ((a.depth + b.depth) / 2);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = lineColor(alpha);
          ctx.lineWidth   = 0.8;
          ctx.stroke();
        }
      }
    }

    raf = requestAnimationFrame(tick);
  }

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  window.addEventListener('touchmove', (e) => {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else {
      tick();
    }
  });

  resize();
  initParticles();
  tick();

  window.addEventListener('resize', () => {
    resize();
    initParticles();
  }, { passive: true });
})();

/* ════════════════════════════════════════════════════════════
   Custom Cursor — Magnetic Fluid Style
   ════════════════════════════════════════════════════════════ */
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  /* ── Canvas overlay ── */
  const cv = document.createElement('canvas');
  cv.id    = 'cursorCanvas';
  cv.style.cssText = `
    position: fixed; inset: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    z-index: 999999;
  `;
  document.body.appendChild(cv);
  const ctx = cv.getContext('2d');

  /* ── Hide native cursor ── */
  const cursorStyle = document.createElement('style');
  cursorStyle.textContent = `*, *::before, *::after { cursor: none !important; }`;
  document.head.appendChild(cursorStyle);

  /* ── Resize ── */
  let W, H;
  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    cv.style.width  = W + 'px';
    cv.style.height = H + 'px';
    cv.width        = W * dpr;
    cv.height       = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  /* ── State ── */
  let mx = W / 2, my = H / 2;
  let cx = mx,    cy = my;
  let ex = mx,    ey = my;
  let isHover   = false;
  let isClick   = false;
  let clickTime = 0;
  let visible   = false;

  /* ── Ripple pool ── */
  const ripples = [];

  function spawnRipple(x, y) {
    for (let i = 0; i < 4; i++) {
      ripples.push({
        x, y,
        maxR:  120 + i * 40,
        alpha: 0.7 - i * 0.12,
        delay: i * 55,
        born:  performance.now(),
        hue:   [265, 195, 330, 225][i],
      });
    }
  }

  /* ── Wave tail ── */
  const tail    = [];
  const TAIL_LEN = 22;
  for (let i = 0; i < TAIL_LEN; i++) tail.push({ x: mx, y: my });

  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ── Hover detection ── */
  const HOVER_SEL = 'a,button,[role="button"],input,textarea,select,.proj-card,.svc-card,.pillar,.sk-tag,.hv-card,.nav-cta,.theme-toggle';

  function bindHover(el) {
    el.addEventListener('mouseenter', () => { isHover = true;  });
    el.addEventListener('mouseleave', () => { isHover = false; });
  }
  document.querySelectorAll(HOVER_SEL).forEach(bindHover);

  new MutationObserver(muts => {
    muts.forEach(m => m.addedNodes.forEach(n => {
      if (n.nodeType !== 1) return;
      if (n.matches?.(HOVER_SEL)) bindHover(n);
      n.querySelectorAll?.(HOVER_SEL).forEach(bindHover);
    }));
  }).observe(document.body, { childList: true, subtree: true });

  /* ── Events ── */
  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (!visible) { cx = mx; cy = my; ex = mx; ey = my; visible = true; }
  }, { passive: true });

  window.addEventListener('click', e => {
    isClick   = true;
    clickTime = performance.now();
    spawnRipple(e.clientX, e.clientY);
    setTimeout(() => { isClick = false; }, 180);
  });

  document.addEventListener('mouseleave', () => { visible = false; });
  document.addEventListener('mouseenter', () => { visible = true;  });

  /* ── Draw helpers ── */
  function drawGlow(x, y, r, color, alpha) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0,   `rgba(${color},${alpha})`);
    g.addColorStop(0.4, `rgba(${color},${alpha * 0.4})`);
    g.addColorStop(1,   `rgba(${color},0)`);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  }

  function drawRing(x, y, r, color, alpha, width = 1.5) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${color},${alpha})`;
    ctx.lineWidth   = width;
    ctx.stroke();
  }

  /* ── Color tokens — theme-aware ── */
  function getColors() {
    const light = document.documentElement.getAttribute('data-theme') === 'light';
    return light ? {
      accent: '80,60,220',
      cyan:   '0,140,200',
      pink:   '200,50,120',
      white:  '20,20,60',
      ring:   '70,50,210',
      echo:   '0,120,180',
      glow:   '100,80,240',
      isLight: true,
    } : {
      accent: '108,99,255',
      cyan:   '0,212,255',
      pink:   '255,107,157',
      white:  '220,230,255',
      ring:   '108,99,255',
      echo:   '0,212,255',
      glow:   '108,99,255',
      isLight: false,
    };
  }

  /* ── Main loop ── */
  function tick(now) {
    requestAnimationFrame(tick);
    ctx.clearRect(0, 0, W, H);
    if (!visible) return;

    const C       = getColors();
    const isLight = C.isLight;

    /* update blend mode per theme */
    cv.style.mixBlendMode = isLight ? 'multiply' : 'screen';

    cx = lerp(cx, mx, 0.18);
    cy = lerp(cy, my, 0.18);
    ex = lerp(ex, mx, 0.07);
    ey = lerp(ey, my, 0.07);

    tail.unshift({ x: cx, y: cy });
    if (tail.length > TAIL_LEN) tail.pop();

    const hoverScale = isHover ? 1.6 : 1;
    const clickScale = isClick ? 0.6 : 1;
    const scale      = hoverScale * clickScale;

    /* ── 1. Ripples ── */
    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp  = ripples[i];
      const age = now - rp.born - rp.delay;
      if (age < 0) continue;
      const prog = Math.min(age / 700, 1);
      if (prog >= 1) { ripples.splice(i, 1); continue; }

      const eased = 1 - Math.pow(1 - prog, 3);
      const r     = eased * rp.maxR;
      const alpha = (isLight ? 0.55 : 0.7) * rp.alpha * (1 - prog);
      const h     = rp.hue;
      const color = h < 230 ? C.accent : h < 280 ? C.cyan : h < 310 ? C.accent : C.pink;
      drawRing(rp.x, rp.y, r, color, alpha, 1.2 - prog * 0.8);
    }

    /* ── 2. Comet tail ── */
    for (let i = 1; i < tail.length; i++) {
      const t     = tail[i];
      const prog  = i / TAIL_LEN;
      const r     = (1 - prog) * 5 * scale;
      const alpha = (1 - prog) * (isLight ? 0.55 : 0.35);
      if (r < 0.3) continue;

      const color = prog < 0.5 ? C.accent : C.cyan;
      drawGlow(t.x, t.y, r * 3, color, alpha * 0.5);
      ctx.beginPath();
      ctx.arc(t.x, t.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color},${alpha})`;
      ctx.fill();
    }

    /* ── 3. Echo ring ── */
    const echoR     = 28 * scale;
    const echoAlpha = isLight ? 0.45 : 0.22;
    drawRing(ex, ey, echoR, C.echo, echoAlpha, 1);

    const dashAngle = now * 0.0012;
    const DASHES    = 6;
    for (let i = 0; i < DASHES; i++) {
      const a  = dashAngle + (i / DASHES) * Math.PI * 2;
      const x1 = ex + Math.cos(a) * (echoR - 4);
      const y1 = ey + Math.sin(a) * (echoR - 4);
      const x2 = ex + Math.cos(a) * (echoR + 4);
      const y2 = ey + Math.sin(a) * (echoR + 4);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `rgba(${C.cyan},${isLight ? 0.7 : 0.5})`;
      ctx.lineWidth   = 1.2;
      ctx.stroke();
    }

    /* ── 4. Main cursor ring ── */
    const mainR     = 18 * scale;
    const ringAlpha = isLight ? (isHover ? 1 : 0.85) : (isHover ? 0.9 : 0.7);

    drawGlow(cx, cy, mainR * 3.5, C.glow, (isLight ? 0.18 : 0.12) * scale);
    drawRing(cx, cy, mainR, C.ring, ringAlpha, isHover ? 2.5 : 2);

    if (isHover) {
      drawGlow(cx, cy, mainR * 0.7, C.cyan, isLight ? 0.35 : 0.25);
    }

    /* ── 5. Center dot ── */
    const dotR     = isClick ? 2 : isHover ? 4 : 3;
    const dotColor = isLight ? '10,10,40' : C.white;
    const dotAlpha = isLight ? 0.9 : 0.95;

    drawGlow(cx, cy, dotR * 4, C.glow, isLight ? 0.2 : 0.3);
    ctx.beginPath();
    ctx.arc(cx, cy, dotR, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${dotColor},${dotAlpha})`;
    ctx.fill();

    /* ── 6. Click flash ── */
    if (isClick) {
      const flashAge   = now - clickTime;
      const flashAlpha = Math.max(0, (isLight ? 0.25 : 0.4) - flashAge * 0.003);
      drawGlow(cx, cy, 60, C.glow, flashAlpha);
    }
  }

  requestAnimationFrame(tick);
})();
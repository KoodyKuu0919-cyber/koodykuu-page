/* =============================================
   ENSO — 円相 | Main JS
   ============================================= */

// =============================================
// INK CANVAS BACKGROUND
// =============================================
function initInkCanvas() {
  const canvas = document.getElementById('inkCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  const resize = () => {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  };
  window.addEventListener('resize', resize);
  resize();

  // Ink blobs that drift and pulse
  const blobs = Array.from({ length: 6 }, (_, i) => ({
    x: W * (0.15 + (i * 0.15) % 0.85),
    y: H * (0.2 + (i * 0.13) % 0.7),
    r: 80 + Math.random() * 120,
    vx: (Math.random() - 0.5) * 0.15,
    vy: (Math.random() - 0.5) * 0.12,
    phase: Math.random() * Math.PI * 2,
    hue: [210, 250, 160, 30, 20, 270][i],
    alpha: 0.04 + Math.random() * 0.04,
  }));

  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    frame += 0.003;

    blobs.forEach((b) => {
      b.x += b.vx;
      b.y += b.vy;
      if (b.x < -b.r) b.x = W + b.r;
      if (b.x > W + b.r) b.x = -b.r;
      if (b.y < -b.r) b.y = H + b.r;
      if (b.y > H + b.r) b.y = -b.r;

      const pulse = 1 + 0.08 * Math.sin(frame + b.phase);
      const r = b.r * pulse;

      const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
      g.addColorStop(0, `hsla(${b.hue}, 25%, 55%, ${b.alpha})`);
      g.addColorStop(1, `hsla(${b.hue}, 20%, 30%, 0)`);
      ctx.beginPath();
      ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();
}

// =============================================
// SCROLL REVEAL
// =============================================
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-up');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
}

// =============================================
// NAV — scroll state
// =============================================
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// =============================================
// MOBILE MENU
// =============================================
function initMobileMenu() {
  const btn = document.getElementById('menuBtn');
  const menu = document.getElementById('mobileMenu');
  const links = document.querySelectorAll('.mobile-link');
  if (!btn || !menu) return;

  let open = false;

  const toggle = () => {
    open = !open;
    menu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    const spans = btn.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.transform = 'translateY(0) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.transform = '';
    }
  };

  btn.addEventListener('click', toggle);
  links.forEach((link) => link.addEventListener('click', toggle));
}

// =============================================
// CURSOR
// =============================================
function initCursor() {
  if (!window.matchMedia('(hover: hover)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);

  let mx = 0, my = 0;
  let rx = 0, ry = 0;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });

  // Ring follows with lag
  const animRing = () => {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  };
  animRing();

  // Grow on hoverable elements
  const hoverables = 'a, button, .product-card, .process-step';
  document.querySelectorAll(hoverables).forEach((el) => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = '60px';
      ring.style.height = '60px';
      ring.style.borderColor = 'rgba(245,240,232,0.6)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width = '36px';
      ring.style.height = '36px';
      ring.style.borderColor = 'rgba(245,240,232,0.4)';
    });
  });
}

// =============================================
// PARALLAX HERO ENSO on mousemove
// =============================================
function initParallaxEnso() {
  const enso = document.querySelector('.hero-enso-wrap');
  if (!enso) return;

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    enso.style.transform = `translate(${dx * 20}px, ${dy * 12}px)`;
  });
}

// =============================================
// NEWSLETTER FORM
// =============================================
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input');
    const btn = form.querySelector('button');
    btn.textContent = '✓ 登録完了';
    btn.style.background = 'rgba(245,240,232,0.15)';
    btn.style.color = 'rgba(245,240,232,0.7)';
    btn.style.borderColor = 'rgba(245,240,232,0.2)';
    input.value = '';
    input.placeholder = 'ありがとうございます。';
    setTimeout(() => {
      btn.textContent = 'Subscribe';
      btn.style.cssText = '';
      input.placeholder = 'your@email.com';
    }, 4000);
  });
}

// =============================================
// PRODUCT CARD TILT
// =============================================
function initCardTilt() {
  const cards = document.querySelectorAll('.product-card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// =============================================
// SCROLL PROGRESS LINE (top of page)
// =============================================
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 1px;
    background: rgba(245,240,232,0.4);
    z-index: 9000;
    transition: width 0.1s linear;
    width: 0%;
    pointer-events: none;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    bar.style.width = (pct * 100) + '%';
  }, { passive: true });
}

// =============================================
// ENSO DRAW ANIMATION in philosophy section
// =============================================
function initPhilosophyEnso() {
  const svgPath = document.querySelector('.philosophy-bg-enso path');
  if (!svgPath) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const len = svgPath.getTotalLength();
          svgPath.style.strokeDasharray = len;
          svgPath.style.strokeDashoffset = len;
          svgPath.style.transition = 'stroke-dashoffset 3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
          svgPath.style.strokeDashoffset = '0';
          svgPath.style.stroke = 'rgba(245,240,232,0.08)';
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(svgPath);
}

// =============================================
// PROCESS STEPS — stagger reveal
// =============================================
function initProcessStagger() {
  const steps = document.querySelectorAll('.process-step');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = parseInt(entry.target.dataset.step) - 1;
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'none';
          }, idx * 120);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  steps.forEach((step) => {
    step.style.opacity = '0';
    step.style.transform = 'translateX(-20px)';
    step.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    observer.observe(step);
  });
}

// =============================================
// SMOOTH ANCHOR SCROLL
// =============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// =============================================
// MARQUEE — duplicate content for seamless loop
// =============================================
function initMarquee() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;
  // Already has enough content via CSS animation
  // Duplicate for seamless loop
  const original = track.innerHTML;
  track.innerHTML = original + original;
}

// =============================================
// BOOT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  initInkCanvas();
  initScrollReveal();
  initNav();
  initMobileMenu();
  initCursor();
  initParallaxEnso();
  initNewsletter();
  initCardTilt();
  initScrollProgress();
  initPhilosophyEnso();
  initProcessStagger();
  initSmoothScroll();
  initMarquee();

  // Fade in body
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});

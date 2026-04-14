/**
 * PORTFÓLIO — GEOVANE FERNANDES DO PRADO
 * Arquivo: script.js
 *
 * Funcionalidades:
 *  1. Rolagem suave animada com velocidade configurável
 *  2. Cursor customizado
 *  3. Navbar com sombra ao rolar
 *  4. Animação de entrada dos cards (Intersection Observer)
 */

/* ══════════════════════════════════════════════════
   ⚙️  CONFIGURAÇÕES — ALTERE AQUI
   ══════════════════════════════════════════════════

   DURACAO_MS → duração da animação em milissegundos
     Exemplos:
       300  = muito rápido
       600  = rápido
       900  = médio  ← padrão atual
       1400 = lento
       2000 = muito lento

   EASING → curva de aceleração da rolagem
     Opções disponíveis:
       'easeInOutQuad'  → acelera e desacelera suave  ← padrão
       'easeOutCubic'   → começa rápido, termina lento
       'easeInOutSine'  → muito suave dos dois lados
       'linear'         → velocidade constante
   ══════════════════════════════════════════════════ */

const DURACAO_MS = 900;
const EASING     = 'easeInOutQuad';

/* ── 1. ROLAGEM SUAVE ANIMADA ── */

const easings = {
  linear:        (t) => t,
  easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeOutCubic:  (t) => 1 - Math.pow(1 - t, 3),
  easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
};

function rolarSuavemente(destinoY) {
  const inicio    = window.scrollY;
  const distancia = destinoY - inicio;
  const fn        = easings[EASING] || easings.easeInOutQuad;
  let startTime   = null;

  function animar(timestamp) {
    if (!startTime) startTime = timestamp;
    const decorrido = timestamp - startTime;
    const progresso = Math.min(decorrido / DURACAO_MS, 1);
    window.scrollTo(0, inicio + distancia * fn(progresso));
    if (progresso < 1) requestAnimationFrame(animar);
  }

  requestAnimationFrame(animar);
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const href    = link.getAttribute('href');
    if (href === '#') return;
    const destino = document.querySelector(href);
    if (!destino) return;
    e.preventDefault();
    const navH    = document.getElementById('navbar').offsetHeight;
    const alvo    = destino.getBoundingClientRect().top + window.scrollY - navH - 16;
    rolarSuavemente(alvo);
  });
});

/* ── 2. CURSOR CUSTOMIZADO ── */
const cursor = document.getElementById('cursor');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});

document.querySelectorAll('a, button, .projeto, .skill-pill, .stat-card').forEach((el) => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

/* ── 3. NAVBAR — sombra ao rolar ── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── 4. ANIMAÇÃO DE ENTRADA DOS CARDS ── */
const observerOpts = { threshold: 0.15 };

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, observerOpts);

document.querySelectorAll('.projeto').forEach((card) => observer.observe(card));
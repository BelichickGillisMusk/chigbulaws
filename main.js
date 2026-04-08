/* ── COOKIE BANNER ─────────────────────────────────── */
function closeCookies() {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;
  banner.style.transition = 'opacity .3s ease, transform .3s ease';
  banner.style.opacity = '0';
  banner.style.transform = 'translateY(100%)';
  setTimeout(() => banner.remove(), 320);
}

/* ── MOBILE NAV ────────────────────────────────────── */
function toggleMenu() {
  const links = document.querySelector('.nav-links');
  const btn   = document.querySelector('.hamburger');
  if (!links) return;
  const open = links.classList.toggle('open');
  btn.setAttribute('aria-expanded', open);
  // Animate hamburger → X
  const spans = btn.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
}

/* Close menu on outside click */
document.addEventListener('click', (e) => {
  const nav = document.querySelector('.nav-inner');
  if (nav && !nav.contains(e.target)) {
    const links = document.querySelector('.nav-links');
    const btn   = document.querySelector('.hamburger');
    if (links && links.classList.contains('open')) {
      links.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      const spans = btn.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  }
});

/* ── NAVBAR SCROLL SHADOW ──────────────────────────── */
const navbar = document.getElementById('navbar');
if (navbar) {
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 12);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── SMOOTH SCROLL ANCHORS ─────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── INTERSECTION OBSERVER — stagger cards ─────────── */
if ('IntersectionObserver' in window) {
  const cards = document.querySelectorAll('.svc-card, .tcard, .blog-card');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = `${(i % 4) * 80}ms`;
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  cards.forEach(c => io.observe(c));
}

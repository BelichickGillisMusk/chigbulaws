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

/* ── 2026 SITE MAINTENANCE UPDATES ─────────────────── */
(() => {
  // Clifford received the BusinessRate recognition again for 2026.
  const awardYear = document.querySelector('.badge-year');
  if (awardYear) awardYear.textContent = '2026';

  const awardReviewDate = document.querySelector('.g-reviews');
  if (awardReviewDate) awardReviewDate.innerHTML = 'Reviews &nbsp;·&nbsp; 2026';

  // Keep the copyright current and add a discreet marketing credit.
  const footerBottom = document.querySelector('.footer-bottom');
  if (footerBottom) {
    const copyright = footerBottom.querySelector('p');
    if (copyright) {
      copyright.textContent = '© 2026 Clifford Chigbu Attorney at Law. All rights reserved.';
    }

    if (!footerBottom.querySelector('.mlb-credit')) {
      const credit = document.createElement('p');
      credit.className = 'mlb-credit';
      credit.innerHTML = 'Site design and marketing by <a href="https://mlbmarketingllc.com" target="_blank" rel="noopener noreferrer">MLB Marketing LLC</a>.';
      credit.style.fontSize = '0.82rem';
      credit.style.opacity = '0.72';
      credit.style.marginTop = '8px';
      footerBottom.appendChild(credit);
    }
  }

  // Retain useful business schema while removing the stale rating count and
  // self-published review markup that is not eligible for local-business stars.
  document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
    try {
      const data = JSON.parse(script.textContent);
      const schemas = Array.isArray(data) ? data : [data];
      let changed = false;

      schemas.forEach((schema) => {
        const types = Array.isArray(schema['@type']) ? schema['@type'] : [schema['@type']];
        if (types.includes('LegalService') || types.includes('LocalBusiness')) {
          if (schema.aggregateRating) {
            delete schema.aggregateRating;
            changed = true;
          }
          if (schema.review) {
            delete schema.review;
            changed = true;
          }
          schema.award = 'BusinessRate Best of 2026 — Family Law Attorney, Elk Grove, California';
          changed = true;
        }
      });

      if (changed) {
        script.textContent = JSON.stringify(Array.isArray(data) ? schemas : schemas[0]);
      }
    } catch (error) {
      console.warn('Schema maintenance skipped:', error);
    }
  });
})();

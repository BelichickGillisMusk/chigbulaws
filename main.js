// Cookie banner
function closeCookies() {
  const banner = document.getElementById('cookie-banner');
  if (banner) {
    banner.style.transition = 'opacity 0.3s';
    banner.style.opacity = '0';
    setTimeout(() => banner.remove(), 300);
  }
}

// Mobile nav toggle
function toggleMenu() {
  const links = document.querySelector('.nav-links');
  if (links) links.classList.toggle('open');
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Navbar scroll shadow
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (nav) {
    nav.style.boxShadow = window.scrollY > 10
      ? '0 2px 16px rgba(0,0,0,0.12)'
      : '0 1px 6px rgba(0,0,0,0.06)';
  }
});

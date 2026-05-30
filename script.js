/**
 * =====================================================
 *  NEEMA WHOLESALE — script.js
 *  Kamukunji Ndogo Mali Mali Wholesale · Naivasha
 * =====================================================
 */

'use strict';

/* ── Utility: throttle ──────────────────────────── */
function throttle(fn, wait) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn.apply(this, args);
    }
  };
}

/* ── Footer Year ────────────────────────────────── */
function setFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ── Sticky Header Shadow ───────────────────────── */
function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = throttle(() => {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, 80);

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

/* ── Mobile Menu Toggle ─────────────────────────── */
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const nav    = document.getElementById('mobileNav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    nav.setAttribute('aria-hidden', String(!isOpen));
  });

  // Close mobile nav when any link inside it is clicked
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      nav.setAttribute('aria-hidden', 'true');
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (
      nav.classList.contains('open') &&
      !nav.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      nav.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      nav.setAttribute('aria-hidden', 'true');
    }
  });
}

/* ── Smooth Scroll for anchor links ────────────── */
function initSmoothScroll() {
  const HEADER_HEIGHT = 72; // px – matches header height

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const top = target.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ── Scroll-triggered Reveal Animations ────────── */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.product-card, .value-card, .step-item, .contact-item'
  );

  if (!targets.length) return;

  // If IntersectionObserver isn't supported, just show everything
  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('animate-in'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger by index within a parent grid
          const siblings = Array.from(
            entry.target.parentElement.children
          );
          const idx = siblings.indexOf(entry.target);
          const delay = Math.min(idx * 80, 400); // cap at 400ms

          setTimeout(() => {
            entry.target.classList.add('animate-in');
            entry.target.style.opacity = '';
            entry.target.style.transform = '';
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(el => {
    // Start invisible so the animation plays
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    observer.observe(el);
  });
}

/* ── Floating WhatsApp Button – hide/show on scroll ── */
function initFloatButton() {
  const btn = document.getElementById('floatWa');
  if (!btn) return;

  let lastY = window.scrollY;
  let hideTimeout;

  const onScroll = throttle(() => {
    const currentY = window.scrollY;
    const scrollingDown = currentY > lastY;
    lastY = currentY;

    // Hide briefly while scrolling down fast, always show at rest
    if (scrollingDown && currentY > 300) {
      btn.style.opacity = '0.6';
      btn.style.transform = btn.style.transform || '';
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        btn.style.opacity = '1';
      }, 800);
    } else {
      clearTimeout(hideTimeout);
      btn.style.opacity = '1';
    }
  }, 100);

  window.addEventListener('scroll', onScroll, { passive: true });

  // Transition for opacity changes
  btn.style.transition = 'opacity 0.4s ease, background 0.25s ease, transform 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s ease';
}

/* ── Active Nav Link Highlight on Scroll ────────── */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!navLinks.length) return;

  const OFFSET = 100;

  const highlight = throttle(() => {
    let current = '';

    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top <= OFFSET) current = section.getAttribute('id');
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle(
        'active-nav',
        href === `#${current}`
      );
    });
  }, 100);

  window.addEventListener('scroll', highlight, { passive: true });
}

/* ── Add active-nav style dynamically ────────────── */
function injectActiveNavStyle() {
  const style = document.createElement('style');
  style.textContent = `
    .active-nav {
      color: var(--green-700) !important;
      background: var(--green-50) !important;
    }
  `;
  document.head.appendChild(style);
}

/* ── Product Card hover — WhatsApp icon pulse ────── */
function initCardHoverEffects() {
  document.querySelectorAll('.product-order-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      const icon = btn.querySelector('i');
      if (icon) {
        icon.style.transform = 'scale(1.2) rotate(-8deg)';
        icon.style.transition = 'transform 0.25s ease';
      }
    });
    btn.addEventListener('mouseleave', () => {
      const icon = btn.querySelector('i');
      if (icon) {
        icon.style.transform = 'scale(1) rotate(0deg)';
      }
    });
  });
}

/* ── Hero CTA ripple on click ────────────────────── */
function initRipple() {
  const buttons = document.querySelectorAll(
    '.btn-primary, .btn-secondary, .btn-catalogue, .product-order-btn, .header-cta'
  );

  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    .ripple-host { position: relative; overflow: hidden; }
    .ripple-wave {
      position: absolute;
      border-radius: 50%;
      transform: scale(0);
      background: rgba(255,255,255,0.35);
      animation: ripple-anim 0.55s linear;
      pointer-events: none;
    }
    @keyframes ripple-anim {
      to { transform: scale(4); opacity: 0; }
    }
  `;
  document.head.appendChild(rippleStyle);

  buttons.forEach(btn => {
    btn.classList.add('ripple-host');

    btn.addEventListener('click', function (e) {
      const rect   = this.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;

      const wave = document.createElement('span');
      wave.className = 'ripple-wave';
      Object.assign(wave.style, {
        width:  `${size}px`,
        height: `${size}px`,
        left:   `${x}px`,
        top:    `${y}px`,
      });

      this.appendChild(wave);
      wave.addEventListener('animationend', () => wave.remove());
    });
  });
}

/* ── Prefers Reduced Motion guard ────────────────── */
function respectReducedMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.001ms !important;
        transition-duration: 0.001ms !important;
      }
    `;
    document.head.appendChild(style);
  }
}

/* ── Init all on DOM ready ───────────────────────── */
function init() {
  respectReducedMotion();
  setFooterYear();
  injectActiveNavStyle();
  initStickyHeader();
  initMobileMenu();
  initSmoothScroll();
  initScrollReveal();
  initFloatButton();
  initActiveNavHighlight();
  initCardHoverEffects();
  initRipple();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

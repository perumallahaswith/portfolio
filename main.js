'use strict';

/* ============================================
   NAVBAR — Scroll Effect & Active Link
   ============================================ */
function initNavbar() {
  const navbar = document.querySelector('.navbar-portfolio');

  // Scrolled shadow
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // Highlight active link based on current filename
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-portfolio .nav-link[data-page]').forEach(link => {
    if (link.dataset.page === page) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

/* ============================================
   BACK TO TOP
   ============================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 450);
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ============================================
   SCROLL REVEAL ANIMATION
   ============================================ */
function initScrollReveal() {
  const els = document.querySelectorAll('.fade-in-up');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
}

/* ============================================
   PROGRESS BAR ANIMATION (Skills Page)
   ============================================ */
function initProgressBars() {
  const bars = document.querySelectorAll('.progress-bar[data-width]');
  if (!bars.length) return;

  // Reset to 0 initially
  bars.forEach(bar => { bar.style.width = '0%'; });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        setTimeout(() => {
          bar.style.width = bar.dataset.width + '%';
          bar.setAttribute('aria-valuenow', bar.dataset.width);
        }, 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.2 });

  bars.forEach(bar => observer.observe(bar));
}

/* ============================================
   TOOLTIPS
   ============================================ */
function initTooltips() {
  const tooltipEls = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltipEls.forEach(el => new bootstrap.Tooltip(el, { trigger: 'hover focus' }));
}

/* ============================================
   SCROLL INDICATOR (Home)
   ============================================ */
function initScrollIndicator() {
  const indicator = document.querySelector('.scroll-indicator');
  if (!indicator) return;
  indicator.addEventListener('click', () => {
    const target = document.querySelector('.stats-section') || document.querySelector('section');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
}

/* ============================================
   CONTACT FORM VALIDATION
   ============================================ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const successAlert = document.getElementById('formSuccess');

  /* Helper: validate Indian mobile (10 digits, starts 6-9) */
  const isValidPhone = val => /^[6-9]\d{9}$/.test(val.replace(/[\s\-]/g, ''));
  /* Helper: basic email */
  const isValidEmail = val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  /* Real-time phone feedback */
  const phoneInput = form.querySelector('#phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      const v = phoneInput.value.trim();
      if (v === '') { phoneInput.classList.remove('is-valid', 'is-invalid'); return; }
      const ok = isValidPhone(v);
      phoneInput.classList.toggle('is-valid',   ok);
      phoneInput.classList.toggle('is-invalid', !ok);
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    /* Clear previous states */
    form.querySelectorAll('.form-control, .form-select').forEach(el => {
      el.classList.remove('is-valid', 'is-invalid');
    });

    /* Name */
    const name = form.querySelector('#name');
    const nameOk = name && name.value.trim().length >= 2;
    if (name) { name.classList.toggle('is-valid', nameOk); name.classList.toggle('is-invalid', !nameOk); }
    if (!nameOk) valid = false;

    /* Email */
    const email = form.querySelector('#email');
    const emailOk = email && isValidEmail(email.value);
    if (email) { email.classList.toggle('is-valid', emailOk); email.classList.toggle('is-invalid', !emailOk); }
    if (!emailOk) valid = false;

    /* Phone */
    if (phoneInput) {
      const phoneOk = isValidPhone(phoneInput.value.trim());
      phoneInput.classList.toggle('is-valid',   phoneOk);
      phoneInput.classList.toggle('is-invalid', !phoneOk);
      if (!phoneOk) valid = false;
    }

    /* Subject */
    const subject = form.querySelector('#subject');
    if (subject) {
      const ok = subject.value.trim().length > 0;
      subject.classList.toggle('is-valid', ok);
      subject.classList.toggle('is-invalid', !ok);
      if (!ok) valid = false;
    }

    /* Message */
    const message = form.querySelector('#message');
    const msgOk = message && message.value.trim().length >= 10;
    if (message) { message.classList.toggle('is-valid', msgOk); message.classList.toggle('is-invalid', !msgOk); }
    if (!msgOk) valid = false;

    if (valid) {
      if (successAlert) {
        successAlert.classList.remove('d-none');
        successAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();
      form.querySelectorAll('.form-control, .form-select').forEach(el => {
        el.classList.remove('is-valid', 'is-invalid');
      });
    }

    form.classList.add('was-validated');
  });

  /* Dismiss resets was-validated */
  if (successAlert) {
    successAlert.querySelector('[data-bs-dismiss="alert"]')?.addEventListener('click', () => {
      form.classList.remove('was-validated');
    });
  }
}

/* ============================================
   CERTIFICATION MODAL — dynamic content
   ============================================ */
function initCertModal() {
  const modal = document.getElementById('certModal');
  if (!modal) return;

  modal.addEventListener('show.bs.modal', event => {
    const btn      = event.relatedTarget;
    const certName = btn?.dataset.certName    || 'Certificate';
    const issuer   = btn?.dataset.certIssuer  || 'Issuing Authority';
    const date     = btn?.dataset.certDate    || '2024';
    const id       = btn?.dataset.certId      || 'N/A';

    modal.querySelector('#modalCertName').textContent   = certName;
    modal.querySelector('#modalCertIssuer').textContent = issuer;
    modal.querySelector('#modalCertDate').textContent   = date;
    modal.querySelector('#modalCertId').textContent     = id;
  });
}

/* ============================================
   INIT ALL
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initBackToTop();
  initScrollReveal();
  initProgressBars();
  initTooltips();
  initScrollIndicator();
  initContactForm();
  initCertModal();
});

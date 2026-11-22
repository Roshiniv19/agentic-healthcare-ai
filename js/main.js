/**
 * Agentic AI-Powered Healthcare Intelligence and Patient Assistance System
 * Global Main Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarActiveState();
  initNavbarScrollEffect();
  initTooltips();
  initEmergencyBannerClose();
});

/**
 * Highlights active link in the navigation bar based on current URL path
 */
function initNavbarActiveState() {
  const currentPath = window.location.pathname.toLowerCase();
  const navLinks = document.querySelectorAll('.site-navbar .nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Normalizing link path
    const cleanHref = href.toLowerCase().split('/').pop();
    const cleanCurrent = currentPath.split('/').pop() || 'index.html';

    if (cleanHref === cleanCurrent || 
       (cleanCurrent === '' && cleanHref === 'index.html') ||
       (cleanCurrent === 'index.html' && (cleanHref === 'index.html' || cleanHref === './' || cleanHref === '../index.html'))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Adds subtle shadow and compact padding to navbar when scrolled
 */
function initNavbarScrollEffect() {
  const navbar = document.querySelector('.site-navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/**
 * Initializes Bootstrap tooltips if bootstrap library is available
 */
function initTooltips() {
  if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
  }
}

/**
 * Emergency disclaimer dismiss handler (persists for session only if closed)
 */
function initEmergencyBannerClose() {
  const closeBtn = document.querySelector('.emergency-banner-close');
  const banner = document.querySelector('.safety-disclaimer-banner');
  if (closeBtn && banner) {
    closeBtn.addEventListener('click', () => {
      banner.style.display = 'none';
    });
  }
}

/**
 * Global Toast Notification Helper
 * @param {string} title 
 * @param {string} message 
 * @param {string} type - 'info' | 'success' | 'warning' | 'danger'
 */
function showToast(title, message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = '1090';
    document.body.appendChild(container);
  }

  const bgClasses = {
    info: 'bg-primary text-white',
    success: 'bg-teal text-white',
    warning: 'bg-warning text-dark',
    danger: 'bg-danger text-white'
  };

  const icons = {
    info: 'bi-info-circle-fill',
    success: 'bi-check-circle-fill',
    warning: 'bi-exclamation-triangle-fill',
    danger: 'bi-shield-exclamation'
  };

  const toastId = 'toast-' + Date.now();
  const toastHtml = `
    <div id="${toastId}" class="toast align-items-center ${bgClasses[type] || 'bg-primary text-white'} border-0 shadow" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body d-flex align-items-start gap-2">
          <i class="bi ${icons[type] || 'bi-info-circle-fill'} fs-5"></i>
          <div>
            <strong>${title}</strong>
            <div class="small">${message}</div>
          </div>
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;

  container.insertAdjacentHTML('beforeend', toastHtml);
  const toastEl = document.getElementById(toastId);
  if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
    const bsToast = new bootstrap.Toast(toastEl, { delay: 4500 });
    bsToast.show();
    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
  } else {
    setTimeout(() => toastEl.remove(), 4500);
  }
}

/**
 * Formats standard timestamps
 */
function getFormattedTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

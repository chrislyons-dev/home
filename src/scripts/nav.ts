const normalizePath = (path: string | null) => {
  if (!path) return '/';
  const trimmed = path.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
};

const setActiveNavLink = () => {
  const current = normalizePath(window.location.pathname);
  document.querySelectorAll<HTMLAnchorElement>('nav a[data-route]').forEach((link) => {
    const hrefTarget = normalizePath(link.getAttribute('data-route') || link.getAttribute('href'));
    if (hrefTarget === current) {
      link.classList.add('nav-link-active');
    } else {
      link.classList.remove('nav-link-active');
    }
  });
};

const setupNavigation = () => {
  const navToggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const mobileNav = document.querySelector<HTMLElement>('[data-mobile-nav]');
  const mobileOverlay = document.querySelector<HTMLElement>('[data-mobile-overlay]');

  if (!navToggle || !mobileNav) {
    setActiveNavLink();
    return;
  }

  const setMobileNavState = (isOpen: boolean) => {
    navToggle.setAttribute('aria-expanded', String(isOpen));
    mobileNav.dataset.open = String(isOpen);
    mobileNav.style.maxHeight = isOpen ? `${mobileNav.scrollHeight}px` : '0px';
    document.documentElement.classList.toggle('nav-scroll-lock', isOpen);

    if (mobileOverlay) {
      mobileOverlay.dataset.open = String(isOpen);
      mobileOverlay.setAttribute('aria-hidden', String(!isOpen));
    }

    const menuIcon = navToggle.querySelector<SVGElement>('[data-icon="menu"]');
    const closeIcon = navToggle.querySelector<SVGElement>('[data-icon="close"]');
    if (menuIcon && closeIcon) {
      menuIcon.classList.toggle('hidden', isOpen);
      closeIcon.classList.toggle('hidden', !isOpen);
    }
  };

  const closeMobileNav = () => setMobileNavState(false);

  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    setMobileNavState(!expanded);
  });

  mobileNav
    .querySelectorAll('a[data-route]')
    .forEach((link) => link.addEventListener('click', closeMobileNav));

  mobileOverlay?.addEventListener('click', closeMobileNav);

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMobileNav();
    }
  });

  const handleRouteUpdate = () => {
    setActiveNavLink();
    closeMobileNav();
  };

  document.addEventListener('astro:page-load', handleRouteUpdate);
  document.addEventListener('astro:after-swap', handleRouteUpdate);
  window.addEventListener('popstate', handleRouteUpdate);

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      closeMobileNav();
    }
  });

  setActiveNavLink();
  closeMobileNav();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupNavigation, { once: true });
} else {
  setupNavigation();
}

export {};

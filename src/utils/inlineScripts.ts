export const getNavInteractionScript = () =>
  `
(function () {
  const normalizePath = (path) => {
    if (!path) return '/';
    const trimmed = path.replace(/\\/+$/, '');
    return trimmed === '' ? '/' : trimmed;
  };

  const setActiveNavLink = () => {
    const current = normalizePath(window.location.pathname);
    document.querySelectorAll('nav a[data-route]').forEach((link) => {
      const hrefTarget = normalizePath(link.getAttribute('data-route') || link.getAttribute('href'));
      if (hrefTarget === current) {
        link.classList.add('nav-link-active');
      } else {
        link.classList.remove('nav-link-active');
      }
    });
  };

  const navToggle = document.querySelector('[data-nav-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');
  const mobileOverlay = document.querySelector('[data-mobile-overlay]');

  if (!navToggle || !mobileNav) {
    setActiveNavLink();
    return;
  }

  const setMobileNavState = (isOpen) => {
    navToggle.setAttribute('aria-expanded', String(isOpen));
    mobileNav.dataset.open = String(isOpen);
    mobileNav.style.maxHeight = isOpen ? \`\${mobileNav.scrollHeight}px\` : '0px';
    document.documentElement.classList.toggle('nav-scroll-lock', isOpen);

    if (mobileOverlay) {
      mobileOverlay.dataset.open = String(isOpen);
      mobileOverlay.setAttribute('aria-hidden', String(!isOpen));
    }

    const menuIcon = navToggle.querySelector('[data-icon="menu"]');
    const closeIcon = navToggle.querySelector('[data-icon="close"]');
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
})();
`.trim();

export const getArchitectureMermaidScript = () =>
  `
(function () {
  let mermaidLoaded = false;

  const loadAndInitMermaid = async () => {
    if (mermaidLoaded) return;
    mermaidLoaded = true;

    const { default: mermaid } = await import('mermaid');
    const isDark = document.documentElement.classList.contains('dark');

    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      themeVariables: {
        darkMode: isDark,
      },
      securityLevel: 'loose',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    });

    await mermaid.run({
      querySelector: 'pre.mermaid',
    });
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadAndInitMermaid();
          obs.disconnect();
        }
      });
    },
    { rootMargin: '50px' }
  );

  const firstDiagram = document.querySelector('pre.mermaid');
  if (firstDiagram) {
    observer.observe(firstDiagram);
  }

  const themeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class' && mermaidLoaded) {
        document.querySelectorAll('.mermaid-container').forEach((el) => {
          const pre = document.createElement('pre');
          pre.className = 'mermaid bg-white dark:bg-slate-900 p-4 rounded overflow-x-auto';
          pre.textContent = el.dataset.mermaidCode || '';
          el.replaceWith(pre);
        });
        setTimeout(loadAndInitMermaid, 100);
      }
    });
  });

  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
})();
`.trim();

export const getProjectsMermaidScript = () =>
  `
(function () {
  let mermaidLoaded = false;

  const loadMermaid = async () => {
    if (mermaidLoaded) return;
    mermaidLoaded = true;

    const { initMermaid, refreshMermaid } = await import('../utils/mermaid');
    await initMermaid();
    await refreshMermaid();

    const themeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          refreshMermaid();
        }
      });
    });

    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadMermaid();
          obs.disconnect();
        }
      });
    },
    { rootMargin: '100px' }
  );

  const firstDiagram = document.querySelector('.mermaid');
  if (firstDiagram) {
    observer.observe(firstDiagram);
  }
})();
`.trim();

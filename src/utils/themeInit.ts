/**
 * Inline theme initialization script for preventing flash of unstyled content (FOUC)
 * This should be used in <script is:inline> tags in Astro layouts
 *
 * Note: This is duplicated logic from ThemeManager for SSR/inline script use
 * Keep this in sync with ThemeManager.ts
 */
export const getThemeInitScript = () =>
  `
(function () {
  try {
    const supportsNavigatorStorage =
      typeof navigator !== 'undefined' &&
      'storage' in navigator &&
      typeof navigator.storage?.persist === 'function';

    if (supportsNavigatorStorage) {
      navigator.storage
        .persisted()
        .then((isPersisted) => {
          if (!isPersisted) {
            navigator.storage?.persist?.().catch(() => {
              /* Ignore failures */
            });
          }
        })
        .catch(() => {
          /* Ignore failures */
        });
    }

    let theme = null;
    try {
      theme = window.localStorage.getItem('theme');
    } catch {
      theme = null;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = theme === 'dark' || (!theme && prefersDark);

    const svgFavicon = document.querySelector('link[rel="icon"][type="image/svg+xml"]');
    const icoFavicon = document.querySelector('link[rel="icon"][type="image/x-icon"]');

    const updateFavicon = (node, href) => {
      if (node && !node.href.endsWith(href)) {
        node.href = href;
      }
    };

    if (isDark) {
      document.documentElement.classList.add('dark');
      updateFavicon(svgFavicon, '/cl_dark_graphite-green.svg');
      updateFavicon(icoFavicon, '/cl_dark_graphite-green.ico');
    } else {
      document.documentElement.classList.remove('dark');
      updateFavicon(svgFavicon, '/cl_light_graphite-green.svg');
      updateFavicon(icoFavicon, '/cl_light_graphite-green.ico');
    }
  } catch (error) {
    console.warn('theme initialization failed', error);
  }
})();
`.trim();

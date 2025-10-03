/**
 * Inline theme initialization script for preventing flash of unstyled content (FOUC)
 * This should be used in <script is:inline> tags in Astro layouts
 *
 * Note: This is duplicated logic from ThemeManager for SSR/inline script use
 * Keep this in sync with ThemeManager.ts
 */
export const getThemeInitScript = () => `
  const theme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (!theme && prefersDark);

  if (isDark) {
    document.documentElement.classList.add('dark');
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) favicon.href = '/cl_dark.svg';
  }
`;

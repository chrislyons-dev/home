import type { Theme, IThemeStorage } from './ThemeStorage';
import type { IFaviconManager } from './interfaces/IFaviconManager';

export interface ThemePreference {
  theme: Theme;
  isSystemPreference: boolean;
}

export class ThemeManager {
  constructor(
    private storage: IThemeStorage,
    private faviconManager: IFaviconManager
  ) {}

  /**
   * Get the current theme preference, checking storage first, then system preference
   */
  getThemePreference(): ThemePreference {
    const stored = this.storage.getTheme();

    if (stored) {
      return { theme: stored, isSystemPreference: false };
    }

    // Fall back to system preference
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return { theme: prefersDark ? 'dark' : 'light', isSystemPreference: true };
    }

    return { theme: 'light', isSystemPreference: true };
  }

  /**
   * Apply the theme to the document
   */
  applyTheme(theme: Theme): void {
    if (typeof window === 'undefined') return;

    const isDark = theme === 'dark';

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    this.faviconManager.updateFavicon(isDark);
  }

  /**
   * Set and persist a theme preference
   */
  setTheme(theme: Theme): void {
    this.storage.setTheme(theme);
    this.applyTheme(theme);
  }

  /**
   * Initialize theme on page load
   */
  initializeTheme(): Theme {
    const { theme } = this.getThemePreference();
    this.applyTheme(theme);
    return theme;
  }

  /**
   * Toggle between light and dark theme
   */
  toggleTheme(currentTheme: Theme): Theme {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
    return newTheme;
  }
}

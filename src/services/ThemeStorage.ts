export type Theme = 'light' | 'dark';

export interface IThemeStorage {
  getTheme(): Theme | null;
  setTheme(theme: Theme): void;
  clearTheme(): void;
}

export class ThemeStorage implements IThemeStorage {
  private readonly storageKey = 'theme';

  getTheme(): Theme | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(this.storageKey);
    return stored === 'light' || stored === 'dark' ? stored : null;
  }

  setTheme(theme: Theme): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.storageKey, theme);
  }

  clearTheme(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.storageKey);
  }
}

// Singleton instance
export const themeStorage = new ThemeStorage();

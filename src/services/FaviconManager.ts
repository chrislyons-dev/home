import type { IFaviconManager } from './interfaces/IFaviconManager';

export class FaviconManager implements IFaviconManager {
  private readonly lightFavicon = '/cl_light.svg';
  private readonly darkFavicon = '/cl_dark.svg';

  updateFavicon(isDark: boolean): void {
    if (typeof window === 'undefined') return;

    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon) {
      favicon.href = isDark ? this.darkFavicon : this.lightFavicon;
    }
  }

  setLightFavicon(): void {
    this.updateFavicon(false);
  }

  setDarkFavicon(): void {
    this.updateFavicon(true);
  }
}

// Singleton instance
export const faviconManager = new FaviconManager();

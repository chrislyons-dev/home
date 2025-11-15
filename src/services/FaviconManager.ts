import type { IFaviconManager } from './interfaces/IFaviconManager';

type FaviconVariant = {
  svg: string;
  ico: string;
};

export class FaviconManager implements IFaviconManager {
  private readonly svgSelector = 'link[rel="icon"][type="image/svg+xml"]';
  private readonly icoSelector = 'link[rel="icon"][type="image/x-icon"]';

  private readonly variants: Record<'light' | 'dark', FaviconVariant> = {
    light: {
      svg: '/cl_light_graphite-green.svg',
      ico: '/cl_light_graphite-green.ico',
    },
    dark: {
      svg: '/cl_dark_graphite-green.svg',
      ico: '/cl_dark_graphite-green.ico',
    },
  };

  private updateLink(selector: string, href: string): void {
    const link = document.querySelector<HTMLLinkElement>(selector);
    if (link && !link.href.endsWith(href)) {
      link.href = href;
    }
  }

  updateFavicon(isDark: boolean): void {
    if (typeof window === 'undefined') return;

    const variant = isDark ? this.variants.dark : this.variants.light;
    this.updateLink(this.svgSelector, variant.svg);
    this.updateLink(this.icoSelector, variant.ico);
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

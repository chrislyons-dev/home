/**
 * Interface for favicon management operations
 * Allows for different favicon update strategies
 */
export interface IFaviconManager {
  /**
   * Update the favicon based on theme
   * @param isDark Whether the dark theme is active
   */
  updateFavicon(isDark: boolean): void;

  /**
   * Set the light theme favicon
   */
  setLightFavicon(): void;

  /**
   * Set the dark theme favicon
   */
  setDarkFavicon(): void;
}

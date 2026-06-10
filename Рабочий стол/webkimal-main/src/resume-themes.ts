/**
 * Stateful Design Token Engine
 * Manages theme switching with localStorage persistence and custom event broadcasting.
 */

export type ThemeName = 'classic' | 'modern' | 'minimal';

const THEME_CLASSES: Record<ThemeName, string> = {
  classic: 'theme-classic',
  modern: 'theme-modern',
  minimal: 'theme-minimal',
};

const STORAGE_KEY = 'resume-theme';
const VALID_THEMES: ThemeName[] = ['classic', 'modern', 'minimal'];

export class ThemeSwitcher {
  private activeTheme: ThemeName;

  constructor() {
    this.activeTheme = this.loadTheme();
    this.applyTheme(this.activeTheme);
  }

  /** Read persisted theme from localStorage with defensive fallback. */
  private loadTheme(): ThemeName {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && VALID_THEMES.includes(stored as ThemeName)) {
        return stored as ThemeName;
      }
    } catch {
      // Corrupted or unavailable storage — fall back silently.
    }
    return 'classic';
  }

  /** Persist theme choice to localStorage. */
  private saveTheme(theme: ThemeName): void {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Storage full or blocked — ignore.
    }
  }

  /** Apply the given theme class to <body>, removing any previous theme class. */
  private applyTheme(theme: ThemeName): void {
    VALID_THEMES.forEach((t) => document.body.classList.remove(THEME_CLASSES[t]));
    document.body.classList.add(THEME_CLASSES[theme]);
  }

  /** Switch to a new theme, persist, and broadcast. */
  switchTheme(theme: ThemeName): void {
    if (!VALID_THEMES.includes(theme)) return;
    this.activeTheme = theme;
    this.applyTheme(theme);
    this.saveTheme(theme);
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
  }

  /** Return the currently active theme name. */
  getTheme(): ThemeName {
    return this.activeTheme;
  }
}

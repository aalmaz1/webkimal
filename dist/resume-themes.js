/**
 * Resume Theme Styles
 *
 * Strict theme switcher for the resume builder with CSS variables in body scope.
 */
export const RESUME_THEMES_CSS = `
/* ============================================================================
   CSS Custom Properties for Resume Themes
   ============================================================================ */

:root {
  /* Default to Classic theme */
  --resume-theme-name: 'classic';
  
  /* Color Palette */
  --resume-primary-color: #2c3e50;
  --resume-secondary-color: #34495e;
  --resume-accent-color: #3498db;
  --resume-text-color: #333333;
  --resume-muted-color: #7f8c8d;
  --resume-border-color: #ecf0f1;
  --resume-background-color: #ffffff;
  --resume-section-bg: #f8f9fa;
  
  /* Typography */
  --resume-name-font: 'Georgia', 'Times New Roman', serif;
  --resume-section-title-font: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --resume-body-font: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --resume-subsection-font: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  
  --resume-name-font-size: 28px;
  --resume-name-font-weight: 700;
  --resume-name-letter-spacing: 0.5px;
  --resume-name-text-transform: none;
  
  --resume-section-title-font-size: 14px;
  --resume-section-title-font-weight: 700;
  --resume-section-title-letter-spacing: 1px;
  --resume-section-title-text-transform: uppercase;
  
  --resume-body-font-size: 11px;
  --resume-body-font-weight: 400;
  --resume-body-line-height: 1.5;
  
  --resume-subsection-font-size: 11px;
  --resume-subsection-font-weight: 600;
  
  /* Spacing */
  --resume-margin-x: 48px;
  --resume-margin-y: 48px;
  --resume-section-spacing: 24px;
  --resume-entry-spacing: 14px;
  --resume-highlight-indent: 16px;
  
  /* Decorative Elements */
  --resume-section-underline: true;
  --resume-section-underline-color: var(--resume-accent-color);
  --resume-section-underline-height: 2px;
  --resume-section-underline-width: 60px;
  
  --resume-bullet-style: '•';
  --resume-bullet-color: var(--resume-accent-color);
  
  --resume-divider-style: solid;
  --resume-divider-color: var(--resume-border-color);
  --resume-divider-width: 1px;
  
  /* Effects */
  --resume-shadow: none;
  --resume-border-radius: 0;
  --resume-transition-duration: 0.3s;
}

/* ============================================================================
   Classic Theme (Default)
   ============================================================================ */

[data-resume-theme="classic"],
.resume-theme-classic {
  --resume-theme-name: 'classic';
  
  /* Conservative, traditional colors */
  --resume-primary-color: #2c3e50;
  --resume-secondary-color: #34495e;
  --resume-accent-color: #3498db;
  --resume-text-color: #333333;
  --resume-muted-color: #7f8c8d;
  --resume-border-color: #ecf0f1;
  --resume-background-color: #ffffff;
  --resume-section-bg: #f8f9fa;
  
  /* Classic typography */
  --resume-name-font: 'Georgia', 'Times New Roman', serif;
  --resume-section-title-font: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --resume-body-font: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --resume-subsection-font: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  
  --resume-name-font-size: 28px;
  --resume-name-font-weight: 700;
  --resume-name-letter-spacing: 0.5px;
  --resume-name-text-transform: none;
  
  --resume-section-title-font-size: 14px;
  --resume-section-title-font-weight: 700;
  --resume-section-title-letter-spacing: 1px;
  --resume-section-title-text-transform: uppercase;
  
  /* Structured spacing */
  --resume-section-spacing: 24px;
  --resume-entry-spacing: 14px;
  
  /* Subtle underlines for sections */
  --resume-section-underline: true;
  --resume-section-underline-color: var(--resume-accent-color);
  --resume-section-underline-height: 2px;
  --resume-section-underline-width: 60px;
  
  /* Standard bullets */
  --resume-bullet-style: '•';
  --resume-bullet-color: var(--resume-muted-color);
  
  /* Clean dividers */
  --resume-divider-style: solid;
  --resume-divider-color: var(--resume-border-color);
  --resume-divider-width: 1px;
  
  /* No decorative effects */
  --resume-shadow: none;
  --resume-border-radius: 0;
}

/* ============================================================================
   Modern Theme
   ============================================================================ */

[data-resume-theme="modern"],
.resume-theme-modern {
  --resume-theme-name: 'modern';
  
  /* Bold, modern colors */
  --resume-primary-color: #1a1a2e;
  --resume-secondary-color: #16213e;
  --resume-accent-color: #e94560;
  --resume-text-color: #2d2d2d;
  --resume-muted-color: #6b7280;
  --resume-border-color: #e5e7eb;
  --resume-background-color: #ffffff;
  --resume-section-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  /* Modern typography */
  --resume-name-font: 'Montserrat', 'Poppins', 'Helvetica Neue', sans-serif;
  --resume-section-title-font: 'Montserrat', 'Poppins', 'Helvetica Neue', sans-serif;
  --resume-body-font: 'Open Sans', 'Roboto', 'Helvetica Neue', sans-serif;
  --resume-subsection-font: 'Montserrat', 'Poppins', 'Helvetica Neue', sans-serif;
  
  --resume-name-font-size: 36px;
  --resume-name-font-weight: 800;
  --resume-name-letter-spacing: 2px;
  --resume-name-text-transform: uppercase;
  
  --resume-section-title-font-size: 12px;
  --resume-section-title-font-weight: 800;
  --resume-section-title-letter-spacing: 2px;
  --resume-section-title-text-transform: uppercase;
  
  /* Generous spacing */
  --resume-section-spacing: 32px;
  --resume-entry-spacing: 18px;
  
  /* Bold section styling */
  --resume-section-underline: true;
  --resume-section-underline-color: var(--resume-accent-color);
  --resume-section-underline-height: 3px;
  --resume-section-underline-width: 100%;
  
  /* Custom bullets */
  --resume-bullet-style: '▸';
  --resume-bullet-color: var(--resume-accent-color);
  
  /* Gradient dividers */
  --resume-divider-style: gradient;
  --resume-divider-color: var(--resume-accent-color);
  --resume-divider-width: 2px;
  
  /* Subtle shadows and rounded corners */
  --resume-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  --resume-border-radius: 4px;
}

/* ============================================================================
   Minimalist Theme (Bonus)
   ============================================================================ */

[data-resume-theme="minimalist"],
.resume-theme-minimalist {
  --resume-theme-name: 'minimalist';
  
  /* Monochromatic palette */
  --resume-primary-color: #000000;
  --resume-secondary-color: #333333;
  --resume-accent-color: #000000;
  --resume-text-color: #1a1a1a;
  --resume-muted-color: #999999;
  --resume-border-color: #eeeeee;
  --resume-background-color: #ffffff;
  --resume-section-bg: transparent;
  
  /* Clean typography */
  --resume-name-font: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --resume-section-title-font: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --resume-body-font: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --resume-subsection-font: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  
  --resume-name-font-size: 24px;
  --resume-name-font-weight: 600;
  --resume-name-letter-spacing: 0px;
  --resume-name-text-transform: none;
  
  --resume-section-title-font-size: 11px;
  --resume-section-title-font-weight: 600;
  --resume-section-title-letter-spacing: 0.5px;
  --resume-section-title-text-transform: uppercase;
  
  /* Compact spacing */
  --resume-section-spacing: 18px;
  --resume-entry-spacing: 10px;
  
  /* No decorative elements */
  --resume-section-underline: false;
  --resume-section-underline-color: transparent;
  --resume-section-underline-height: 0;
  --resume-section-underline-width: 0;
  
  /* Simple bullets */
  --resume-bullet-style: '·';
  --resume-bullet-color: var(--resume-muted-color);
  
  /* Invisible dividers */
  --resume-divider-style: none;
  --resume-divider-color: transparent;
  --resume-divider-width: 0;
  
  /* No effects */
  --resume-shadow: none;
  --resume-border-radius: 0;
}

/* ============================================================================
   Theme Transition Utilities
   ============================================================================ */

.resume-container {
  transition: 
    background-color var(--resume-transition-duration) ease,
    color var(--resume-transition-duration) ease;
}

.resume-element {
  transition: 
    color var(--resume-transition-duration) ease,
    font-family var(--resume-transition-duration) ease,
    font-size var(--resume-transition-duration) ease,
    letter-spacing var(--resume-transition-duration) ease;
}

.resume-section {
  transition: 
    border-color var(--resume-transition-duration) ease,
    background-color var(--resume-transition-duration) ease,
    padding var(--resume-transition-duration) ease;
}
`;
/**
 * Predefined theme configurations
 */
export const THEME_CONFIGS = {
    classic: {
        name: 'classic',
        primaryColor: '#2c3e50',
        secondaryColor: '#34495e',
        accentColor: '#3498db',
        textColor: '#333333',
        mutedColor: '#7f8c8d',
        borderColor: '#ecf0f1',
        backgroundColor: '#ffffff',
        sectionBg: '#f8f9fa',
        nameFont: '"Georgia", "Times New Roman", serif',
        sectionTitleFont: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        bodyFont: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        subsectionFont: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        nameFontSize: '28px',
        nameFontWeight: 700,
        nameLetterSpacing: '0.5px',
        nameTextTransform: 'none',
        sectionTitleFontSize: '14px',
        sectionTitleFontWeight: 700,
        sectionTitleLetterSpacing: '1px',
        sectionTitleTextTransform: 'uppercase',
        bodyFontSize: '11px',
        bodyFontWeight: 400,
        bodyLineHeight: 1.5,
        subsectionFontSize: '11px',
        subsectionFontWeight: 600,
        sectionSpacing: 24,
        entrySpacing: 14,
        highlightIndent: 16,
        sectionUnderline: true,
        sectionUnderlineColor: '#3498db',
        sectionUnderlineHeight: 2,
        sectionUnderlineWidth: 60,
        bulletStyle: '•',
        bulletColor: '#7f8c8d',
        dividerStyle: 'solid',
        dividerColor: '#ecf0f1',
        dividerWidth: 1,
        shadow: 'none',
        borderRadius: 0,
        transitionDuration: 300,
    },
    modern: {
        name: 'modern',
        primaryColor: '#1a1a2e',
        secondaryColor: '#16213e',
        accentColor: '#e94560',
        textColor: '#2d2d2d',
        mutedColor: '#6b7280',
        borderColor: '#e5e7eb',
        backgroundColor: '#ffffff',
        sectionBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        nameFont: '"Montserrat", "Poppins", "Helvetica Neue", sans-serif',
        sectionTitleFont: '"Montserrat", "Poppins", "Helvetica Neue", sans-serif',
        bodyFont: '"Open Sans", "Roboto", "Helvetica Neue", sans-serif',
        subsectionFont: '"Montserrat", "Poppins", "Helvetica Neue", sans-serif',
        nameFontSize: '36px',
        nameFontWeight: 800,
        nameLetterSpacing: '2px',
        nameTextTransform: 'uppercase',
        sectionTitleFontSize: '12px',
        sectionTitleFontWeight: 800,
        sectionTitleLetterSpacing: '2px',
        sectionTitleTextTransform: 'uppercase',
        bodyFontSize: '11px',
        bodyFontWeight: 400,
        bodyLineHeight: 1.5,
        subsectionFontSize: '11px',
        subsectionFontWeight: 600,
        sectionSpacing: 32,
        entrySpacing: 18,
        highlightIndent: 20,
        sectionUnderline: true,
        sectionUnderlineColor: '#e94560',
        sectionUnderlineHeight: 3,
        sectionUnderlineWidth: 100,
        bulletStyle: '▸',
        bulletColor: '#e94560',
        dividerStyle: 'gradient',
        dividerColor: '#e94560',
        dividerWidth: 2,
        shadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        borderRadius: 4,
        transitionDuration: 300,
    },
    minimalist: {
        name: 'minimalist',
        primaryColor: '#000000',
        secondaryColor: '#333333',
        accentColor: '#000000',
        textColor: '#1a1a1a',
        mutedColor: '#999999',
        borderColor: '#eeeeee',
        backgroundColor: '#ffffff',
        sectionBg: 'transparent',
        nameFont: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
        sectionTitleFont: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
        bodyFont: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
        subsectionFont: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
        nameFontSize: '24px',
        nameFontWeight: 600,
        nameLetterSpacing: '0px',
        nameTextTransform: 'none',
        sectionTitleFontSize: '11px',
        sectionTitleFontWeight: 600,
        sectionTitleLetterSpacing: '0.5px',
        sectionTitleTextTransform: 'uppercase',
        bodyFontSize: '11px',
        bodyFontWeight: 400,
        bodyLineHeight: 1.5,
        subsectionFontSize: '11px',
        subsectionFontWeight: 600,
        sectionSpacing: 18,
        entrySpacing: 10,
        highlightIndent: 12,
        sectionUnderline: false,
        sectionUnderlineColor: 'transparent',
        sectionUnderlineHeight: 0,
        sectionUnderlineWidth: 0,
        bulletStyle: '·',
        bulletColor: '#999999',
        dividerStyle: 'none',
        dividerColor: 'transparent',
        dividerWidth: 0,
        shadow: 'none',
        borderRadius: 0,
        transitionDuration: 300,
    },
};
/**
 * Inject theme CSS into the document
 */
export function injectThemeStyles() {
    if (typeof document === 'undefined')
        return;
    const existingStyle = document.getElementById('resume-theme-styles');
    if (existingStyle)
        return;
    const styleElement = document.createElement('style');
    styleElement.id = 'resume-theme-styles';
    styleElement.textContent = RESUME_THEMES_CSS;
    document.head.appendChild(styleElement);
}
/**
 * Apply a theme to a container element
 * @param themeName - The theme to apply
 * @param container - The container element (defaults to document.body)
 */
export function applyTheme(themeName, container) {
    if (typeof document === 'undefined')
        return;
    const target = container || document.body;
    // Remove existing theme classes
    target.classList.remove('resume-theme-classic', 'resume-theme-modern', 'resume-theme-minimalist');
    target.removeAttribute('data-resume-theme');
    // Apply new theme
    target.classList.add(`resume-theme-${themeName}`);
    target.setAttribute('data-resume-theme', themeName);
}
/**
 * Get the current theme from a container element
 * @param container - The container element (defaults to document.body)
 * @returns The current theme name
 */
export function getCurrentTheme(container) {
    if (typeof document === 'undefined')
        return 'classic';
    const target = container || document.body;
    const themeAttr = target.getAttribute('data-resume-theme');
    if (themeAttr && ['classic', 'modern', 'minimalist'].includes(themeAttr)) {
        return themeAttr;
    }
    return 'classic';
}
/**
 * Get computed CSS variable value
 * @param variableName - The CSS variable name (without --)
 * @param container - The container element to query
 * @returns The computed value or undefined
 */
export function getComputedVariable(variableName, container) {
    if (typeof document === 'undefined' || typeof window === 'undefined')
        return undefined;
    const target = container || document.body;
    const styles = window.getComputedStyle(target);
    return styles.getPropertyValue(`--resume-${variableName}`).trim() || undefined;
}
/**
 * Get the stored theme from localStorage
 * @returns The stored theme name, or null if none is stored
 */
function getStoredTheme() {
    try {
        if (typeof localStorage === 'undefined')
            return null;
        const stored = localStorage.getItem('resume-theme');
        if (stored && ['classic', 'modern', 'minimalist'].includes(stored)) {
            return stored;
        }
    }
    catch {
        // Safari private browsing or restricted storage
    }
    return null;
}
/**
 * Store a theme name in localStorage
 * @param theme - The theme name to store
 */
function setStoredTheme(theme) {
    try {
        if (typeof localStorage === 'undefined')
            return;
        localStorage.setItem('resume-theme', theme);
    }
    catch {
        // Safari private browsing or restricted storage — silently ignore
    }
}
/**
 * Theme Switcher Class
 * Provides a complete API for managing resume themes with callbacks
 */
export class ThemeSwitcher {
    constructor(container) {
        this.currentTheme = 'classic';
        this.container = null;
        this.onThemeChangeCallbacks = [];
        this.stylesInjected = false;
        this.container = container || null;
    }
    /**
     * Initialize the theme switcher
     * Injects CSS and applies initial theme
     */
    initialize(initialTheme = 'classic') {
        if (!this.stylesInjected) {
            injectThemeStyles();
            this.stylesInjected = true;
        }
        const storedTheme = getStoredTheme();
        const themeToApply = storedTheme ?? initialTheme;
        this.currentTheme = themeToApply;
        applyTheme(themeToApply, this.container || undefined);
        setStoredTheme(themeToApply);
    }
    /**
     * Switch to a new theme
     * @param themeName - The theme to switch to
     * @param triggerCallbacks - Whether to trigger onChange callbacks
     */
    switchTheme(themeName, triggerCallbacks = true) {
        if (themeName === this.currentTheme)
            return;
        this.currentTheme = themeName;
        applyTheme(themeName, this.container || undefined);
        setStoredTheme(themeName);
        const dispatchTarget = this.container || (typeof document !== 'undefined' ? document.body : null);
        if (dispatchTarget) {
            dispatchTarget.dispatchEvent(new CustomEvent('themeChanged', { bubbles: true, detail: { theme: themeName } }));
        }
        if (triggerCallbacks) {
            this.onThemeChangeCallbacks.forEach(callback => callback(themeName));
        }
    }
    /**
     * Toggle between Classic and Modern themes
     */
    togglePrimaryThemes() {
        const newTheme = this.currentTheme === 'classic' ? 'modern' : 'classic';
        this.switchTheme(newTheme);
    }
    /**
     * Cycle through all available themes
     */
    cycleTheme() {
        const themes = ['classic', 'modern', 'minimalist'];
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.switchTheme(themes[nextIndex]);
    }
    /**
     * Toggle to the next theme in the cycle
     * Cycles through classic → modern → minimalist → classic
     */
    toggleTheme() {
        this.cycleTheme();
    }
    /**
     * Get the current theme
     */
    getTheme() {
        return this.currentTheme;
    }
    /**
     * Subscribe to theme change events
     * @param callback - Function to call when theme changes
     * @returns Unsubscribe function
     */
    onThemeChange(callback) {
        this.onThemeChangeCallbacks.push(callback);
        return () => {
            const index = this.onThemeChangeCallbacks.indexOf(callback);
            if (index !== -1) {
                this.onThemeChangeCallbacks.splice(index, 1);
            }
        };
    }
    /**
     * Get the current theme configuration
     */
    getThemeConfig() {
        return THEME_CONFIGS[this.currentTheme];
    }
    /**
     * Set container element for theme application
     */
    setContainer(container) {
        this.container = container;
        applyTheme(this.currentTheme, container);
    }
}
/**
 * Create a theme switcher instance with automatic initialization
 * @param container - Optional container element
 * @param initialTheme - Optional initial theme
 * @returns Configured ThemeSwitcher instance
 */
export function createThemeSwitcher(container, initialTheme = 'classic') {
    const switcher = new ThemeSwitcher(container);
    switcher.initialize(initialTheme);
    return switcher;
}
//# sourceMappingURL=resume-themes.js.map
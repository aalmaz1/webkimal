/**
 * Resume Theme Styles
 *
 * CSS custom properties (variables) for theme switching between
 * Professional and Creative resume styles.
 */
export declare const RESUME_THEMES_CSS = "\n/* ============================================================================\n   CSS Custom Properties for Resume Themes\n   ============================================================================ */\n\n:root {\n  /* Default to Professional theme */\n  --resume-theme-name: 'professional';\n  \n  /* Color Palette */\n  --resume-primary-color: #2c3e50;\n  --resume-secondary-color: #34495e;\n  --resume-accent-color: #3498db;\n  --resume-text-color: #333333;\n  --resume-muted-color: #7f8c8d;\n  --resume-border-color: #ecf0f1;\n  --resume-background-color: #ffffff;\n  --resume-section-bg: #f8f9fa;\n  \n  /* Typography */\n  --resume-name-font: 'Georgia', 'Times New Roman', serif;\n  --resume-section-title-font: 'Helvetica Neue', Helvetica, Arial, sans-serif;\n  --resume-body-font: 'Helvetica Neue', Helvetica, Arial, sans-serif;\n  --resume-subsection-font: 'Helvetica Neue', Helvetica, Arial, sans-serif;\n  \n  --resume-name-font-size: 28px;\n  --resume-name-font-weight: 700;\n  --resume-name-letter-spacing: 0.5px;\n  --resume-name-text-transform: none;\n  \n  --resume-section-title-font-size: 14px;\n  --resume-section-title-font-weight: 700;\n  --resume-section-title-letter-spacing: 1px;\n  --resume-section-title-text-transform: uppercase;\n  \n  --resume-body-font-size: 11px;\n  --resume-body-font-weight: 400;\n  --resume-body-line-height: 1.5;\n  \n  --resume-subsection-font-size: 11px;\n  --resume-subsection-font-weight: 600;\n  \n  /* Spacing */\n  --resume-margin-x: 48px;\n  --resume-margin-y: 48px;\n  --resume-section-spacing: 24px;\n  --resume-entry-spacing: 14px;\n  --resume-highlight-indent: 16px;\n  \n  /* Decorative Elements */\n  --resume-section-underline: true;\n  --resume-section-underline-color: var(--resume-accent-color);\n  --resume-section-underline-height: 2px;\n  --resume-section-underline-width: 60px;\n  \n  --resume-bullet-style: '\u2022';\n  --resume-bullet-color: var(--resume-accent-color);\n  \n  --resume-divider-style: solid;\n  --resume-divider-color: var(--resume-border-color);\n  --resume-divider-width: 1px;\n  \n  /* Effects */\n  --resume-shadow: none;\n  --resume-border-radius: 0;\n  --resume-transition-duration: 0.3s;\n}\n\n/* ============================================================================\n   Professional Theme (Default)\n   ============================================================================ */\n\n[data-resume-theme=\"professional\"],\n.resume-theme-professional {\n  --resume-theme-name: 'professional';\n  \n  /* Conservative, traditional colors */\n  --resume-primary-color: #2c3e50;\n  --resume-secondary-color: #34495e;\n  --resume-accent-color: #3498db;\n  --resume-text-color: #333333;\n  --resume-muted-color: #7f8c8d;\n  --resume-border-color: #ecf0f1;\n  --resume-background-color: #ffffff;\n  --resume-section-bg: #f8f9fa;\n  \n  /* Classic typography */\n  --resume-name-font: 'Georgia', 'Times New Roman', serif;\n  --resume-section-title-font: 'Helvetica Neue', Helvetica, Arial, sans-serif;\n  --resume-body-font: 'Helvetica Neue', Helvetica, Arial, sans-serif;\n  --resume-subsection-font: 'Helvetica Neue', Helvetica, Arial, sans-serif;\n  \n  --resume-name-font-size: 28px;\n  --resume-name-font-weight: 700;\n  --resume-name-letter-spacing: 0.5px;\n  --resume-name-text-transform: none;\n  \n  --resume-section-title-font-size: 14px;\n  --resume-section-title-font-weight: 700;\n  --resume-section-title-letter-spacing: 1px;\n  --resume-section-title-text-transform: uppercase;\n  \n  /* Structured spacing */\n  --resume-section-spacing: 24px;\n  --resume-entry-spacing: 14px;\n  \n  /* Subtle underlines for sections */\n  --resume-section-underline: true;\n  --resume-section-underline-color: var(--resume-accent-color);\n  --resume-section-underline-height: 2px;\n  --resume-section-underline-width: 60px;\n  \n  /* Standard bullets */\n  --resume-bullet-style: '\u2022';\n  --resume-bullet-color: var(--resume-muted-color);\n  \n  /* Clean dividers */\n  --resume-divider-style: solid;\n  --resume-divider-color: var(--resume-border-color);\n  --resume-divider-width: 1px;\n  \n  /* No decorative effects */\n  --resume-shadow: none;\n  --resume-border-radius: 0;\n}\n\n/* ============================================================================\n   Creative Theme\n   ============================================================================ */\n\n[data-resume-theme=\"creative\"],\n.resume-theme-creative {\n  --resume-theme-name: 'creative';\n  \n  /* Bold, modern colors */\n  --resume-primary-color: #1a1a2e;\n  --resume-secondary-color: #16213e;\n  --resume-accent-color: #e94560;\n  --resume-text-color: #2d2d2d;\n  --resume-muted-color: #6b7280;\n  --resume-border-color: #e5e7eb;\n  --resume-background-color: #ffffff;\n  --resume-section-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  \n  /* Modern typography */\n  --resume-name-font: 'Montserrat', 'Poppins', 'Helvetica Neue', sans-serif;\n  --resume-section-title-font: 'Montserrat', 'Poppins', 'Helvetica Neue', sans-serif;\n  --resume-body-font: 'Open Sans', 'Roboto', 'Helvetica Neue', sans-serif;\n  --resume-subsection-font: 'Montserrat', 'Poppins', 'Helvetica Neue', sans-serif;\n  \n  --resume-name-font-size: 36px;\n  --resume-name-font-weight: 800;\n  --resume-name-letter-spacing: 2px;\n  --resume-name-text-transform: uppercase;\n  \n  --resume-section-title-font-size: 12px;\n  --resume-section-title-font-weight: 800;\n  --resume-section-title-letter-spacing: 2px;\n  --resume-section-title-text-transform: uppercase;\n  \n  /* Generous spacing */\n  --resume-section-spacing: 32px;\n  --resume-entry-spacing: 18px;\n  \n  /* Bold section styling */\n  --resume-section-underline: true;\n  --resume-section-underline-color: var(--resume-accent-color);\n  --resume-section-underline-height: 3px;\n  --resume-section-underline-width: 100%;\n  \n  /* Custom bullets */\n  --resume-bullet-style: '\u25B8';\n  --resume-bullet-color: var(--resume-accent-color);\n  \n  /* Gradient dividers */\n  --resume-divider-style: gradient;\n  --resume-divider-color: var(--resume-accent-color);\n  --resume-divider-width: 2px;\n  \n  /* Subtle shadows and rounded corners */\n  --resume-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);\n  --resume-border-radius: 4px;\n}\n\n/* ============================================================================\n   Minimalist Theme (Bonus)\n   ============================================================================ */\n\n[data-resume-theme=\"minimalist\"],\n.resume-theme-minimalist {\n  --resume-theme-name: 'minimalist';\n  \n  /* Monochromatic palette */\n  --resume-primary-color: #000000;\n  --resume-secondary-color: #333333;\n  --resume-accent-color: #000000;\n  --resume-text-color: #1a1a1a;\n  --resume-muted-color: #999999;\n  --resume-border-color: #eeeeee;\n  --resume-background-color: #ffffff;\n  --resume-section-bg: transparent;\n  \n  /* Clean typography */\n  --resume-name-font: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;\n  --resume-section-title-font: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;\n  --resume-body-font: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;\n  --resume-subsection-font: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;\n  \n  --resume-name-font-size: 24px;\n  --resume-name-font-weight: 600;\n  --resume-name-letter-spacing: 0px;\n  --resume-name-text-transform: none;\n  \n  --resume-section-title-font-size: 11px;\n  --resume-section-title-font-weight: 600;\n  --resume-section-title-letter-spacing: 0.5px;\n  --resume-section-title-text-transform: uppercase;\n  \n  /* Compact spacing */\n  --resume-section-spacing: 18px;\n  --resume-entry-spacing: 10px;\n  \n  /* No decorative elements */\n  --resume-section-underline: false;\n  --resume-section-underline-color: transparent;\n  --resume-section-underline-height: 0;\n  --resume-section-underline-width: 0;\n  \n  /* Simple bullets */\n  --resume-bullet-style: '\u00B7';\n  --resume-bullet-color: var(--resume-muted-color);\n  \n  /* Invisible dividers */\n  --resume-divider-style: none;\n  --resume-divider-color: transparent;\n  --resume-divider-width: 0;\n  \n  /* No effects */\n  --resume-shadow: none;\n  --resume-border-radius: 0;\n}\n\n/* ============================================================================\n   Theme Transition Utilities\n   ============================================================================ */\n\n.resume-container {\n  transition: \n    background-color var(--resume-transition-duration) ease,\n    color var(--resume-transition-duration) ease;\n}\n\n.resume-element {\n  transition: \n    color var(--resume-transition-duration) ease,\n    font-family var(--resume-transition-duration) ease,\n    font-size var(--resume-transition-duration) ease,\n    letter-spacing var(--resume-transition-duration) ease;\n}\n\n.resume-section {\n  transition: \n    border-color var(--resume-transition-duration) ease,\n    background-color var(--resume-transition-duration) ease,\n    padding var(--resume-transition-duration) ease;\n}\n";
/**
 * Theme configuration types
 */
export type ResumeThemeName = 'professional' | 'creative' | 'minimalist';
export type ResumeThemeConfig = {
    name: ResumeThemeName;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    textColor: string;
    mutedColor: string;
    borderColor: string;
    backgroundColor: string;
    sectionBg: string;
    nameFont: string;
    sectionTitleFont: string;
    bodyFont: string;
    subsectionFont: string;
    nameFontSize: string;
    nameFontWeight: number;
    nameLetterSpacing: string;
    nameTextTransform: string;
    sectionTitleFontSize: string;
    sectionTitleFontWeight: number;
    sectionTitleLetterSpacing: string;
    sectionTitleTextTransform: string;
    bodyFontSize: string;
    bodyFontWeight: number;
    bodyLineHeight: number;
    subsectionFontSize: string;
    subsectionFontWeight: number;
    sectionSpacing: number;
    entrySpacing: number;
    highlightIndent: number;
    sectionUnderline: boolean;
    sectionUnderlineColor: string;
    sectionUnderlineHeight: number;
    sectionUnderlineWidth: number;
    bulletStyle: string;
    bulletColor: string;
    dividerStyle: string;
    dividerColor: string;
    dividerWidth: number;
    shadow: string;
    borderRadius: number;
    transitionDuration: number;
};
/**
 * Predefined theme configurations
 */
export declare const THEME_CONFIGS: Record<ResumeThemeName, ResumeThemeConfig>;
/**
 * Inject theme CSS into the document
 */
export declare function injectThemeStyles(): void;
/**
 * Apply a theme to a container element
 * @param themeName - The theme to apply
 * @param container - The container element (defaults to document.body)
 */
export declare function applyTheme(themeName: ResumeThemeName, container?: HTMLElement): void;
/**
 * Get the current theme from a container element
 * @param container - The container element (defaults to document.body)
 * @returns The current theme name
 */
export declare function getCurrentTheme(container?: HTMLElement): ResumeThemeName;
/**
 * Get computed CSS variable value
 * @param variableName - The CSS variable name (without --)
 * @param container - The container element to query
 * @returns The computed value or undefined
 */
export declare function getComputedVariable(variableName: string, container?: HTMLElement): string | undefined;
/**
 * Theme Switcher Class
 * Provides a complete API for managing resume themes with callbacks
 */
export declare class ThemeSwitcher {
    private currentTheme;
    private container;
    private onThemeChangeCallbacks;
    private stylesInjected;
    constructor(container?: HTMLElement | null);
    /**
     * Initialize the theme switcher
     * Injects CSS and applies initial theme
     */
    initialize(initialTheme?: ResumeThemeName): void;
    /**
     * Switch to a new theme
     * @param themeName - The theme to switch to
     * @param triggerCallbacks - Whether to trigger onChange callbacks
     */
    switchTheme(themeName: ResumeThemeName, triggerCallbacks?: boolean): void;
    /**
     * Toggle between Professional and Creative themes
     */
    togglePrimaryThemes(): void;
    /**
     * Cycle through all available themes
     */
    cycleTheme(): void;
    /**
     * Get the current theme
     */
    getTheme(): ResumeThemeName;
    /**
     * Subscribe to theme change events
     * @param callback - Function to call when theme changes
     * @returns Unsubscribe function
     */
    onThemeChange(callback: (theme: ResumeThemeName) => void): () => void;
    /**
     * Get the current theme configuration
     */
    getThemeConfig(): ResumeThemeConfig;
    /**
     * Set container element for theme application
     */
    setContainer(container: HTMLElement): void;
}
/**
 * Create a theme switcher instance with automatic initialization
 * @param container - Optional container element
 * @param initialTheme - Optional initial theme
 * @returns Configured ThemeSwitcher instance
 */
export declare function createThemeSwitcher(container?: HTMLElement | null, initialTheme?: ResumeThemeName): ThemeSwitcher;
//# sourceMappingURL=resume-themes.d.ts.map
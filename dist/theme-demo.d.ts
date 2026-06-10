/**
 * Theme Switcher Demo for Resume Builder
 *
 * This example demonstrates how to use the ThemeSwitcher class
 * to dynamically switch between Professional, Creative, and Minimalist themes.
 */
import { type ResumeThemeName } from './resume-themes';
import type { ResumeData } from './resume-builder';
declare const sampleResume: ResumeData;
export declare function demoBasicThemeSwitcher(): void;
export declare function demoDirectThemeConfig(): void;
export declare function demoDynamicThemeSwitching(): void;
export declare function demoCustomThemeOverride(): void;
/**
 * Example hook/component pattern for framework integration
 * This would be used in a browser environment
 */
export declare class ResumeViewerWithTheme {
    private switcher;
    private container;
    private currentBlocks;
    constructor(containerId?: string);
    /**
     * Set resume data and render with current theme
     */
    setResumeData(data: ResumeData): void;
    /**
     * Switch theme and re-render
     */
    switchTheme(theme: ResumeThemeName): void;
    /**
     * Toggle between Professional and Creative
     */
    toggleTheme(): void;
    /**
     * Render blocks to DOM (placeholder - actual implementation depends on your rendering pipeline)
     */
    private render;
    /**
     * Get current theme
     */
    getCurrentTheme(): ResumeThemeName;
    /**
     * Subscribe to theme changes
     */
    onThemeChange(callback: (theme: ResumeThemeName) => void): () => void;
}
export { sampleResume };
//# sourceMappingURL=theme-demo.d.ts.map
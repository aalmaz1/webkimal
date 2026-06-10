/**
 * Theme Switcher Demo for Resume Builder
 *
 * Demonstrates how to use the ThemeSwitcher class with the refactored
 * 2-parameter renderResume(data, container) API.
 */
import { type ResumeThemeName } from './resume-themes.js';
import type { ResumeData } from './types.js';
export declare const sampleResume: ResumeData;
/**
 * Demonstrates theme switching with a container element.
 * Creates a ThemeSwitcher, renders the resume, and cycles themes.
 */
export declare function demoThemeSwitching(container?: HTMLElement): void;
/**
 * Example class for framework integration (React, Vue, etc.)
 * Uses the refactored 2-parameter renderResume API.
 */
export declare class ResumeViewerWithTheme {
    private switcher;
    private container;
    private currentData;
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
     * Toggle between Classic and Modern
     */
    toggleTheme(): void;
    /**
     * Render data to DOM using 2-parameter API
     */
    private render;
    getCurrentTheme(): ResumeThemeName;
    onThemeChange(callback: (theme: ResumeThemeName) => void): () => void;
}
//# sourceMappingURL=theme-demo.d.ts.map
/**
 * Resume Builder for Pretext Engine
 *
 * This module provides a function to render resume data using the Pretext layout engine.
 * It maps structured resume JSON data into Pretext layout elements.
 *
 * Supports theme switching via CSS variables and theme configurations.
 */
import { type LayoutLine } from '@chenglou/pretext';
import { type ResumeThemeName, type ResumeThemeConfig } from './resume-themes';
export type ContactInfo = {
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    github?: string;
};
export type EducationEntry = {
    institution: string;
    degree: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    gpa?: string;
    highlights?: string[];
};
export type ExperienceEntry = {
    company: string;
    position: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    highlights?: string[];
};
export type ResumeData = {
    name: string;
    contact: ContactInfo;
    education: EducationEntry[];
    experience: ExperienceEntry[];
    skills?: string[];
    summary?: string;
};
export type ResumeLayoutConfig = {
    pageWidth: number;
    pageHeight: number;
    marginLeft: number;
    marginRight: number;
    marginTop: number;
    marginBottom: number;
    nameFont: string;
    sectionTitleFont: string;
    bodyFont: string;
    subsectionFont: string;
    lineHeight: number;
    sectionSpacing: number;
    entrySpacing: number;
    highlightIndent: number;
    theme?: ResumeThemeName;
    themeConfig?: ResumeThemeConfig;
};
export declare const DEFAULT_LAYOUT_CONFIG: ResumeLayoutConfig;
/**
 * Build layout config from a theme configuration
 * @param themeConfig - The theme configuration to use
 * @param baseConfig - Optional base config to override (defaults to DEFAULT_LAYOUT_CONFIG)
 * @returns A new layout config with theme-based fonts and spacing
 */
export declare function buildThemeLayoutConfig(themeConfig: ResumeThemeConfig, baseConfig?: ResumeLayoutConfig): ResumeLayoutConfig;
type LayoutElement = {
    type: 'name';
    text: string;
} | {
    type: 'contact';
    items: string[];
} | {
    type: 'sectionTitle';
    text: string;
} | {
    type: 'entry';
    heading: string;
    subheading?: string;
    meta?: string;
    highlights?: string[];
} | {
    type: 'spacer';
    height: number;
};
type PositionedBlock = {
    x: number;
    y: number;
    width: number;
    lines: LayoutLine[];
    type: LayoutElement['type'];
};
/**
 * Renders resume data into positioned layout blocks using the Pretext engine.
 *
 * @param data - The resume data object containing name, contact, education, and experience
 * @param config - Optional layout configuration (defaults to DEFAULT_LAYOUT_CONFIG)
 *               Can include a theme name or theme config for styled rendering
 * @returns An array of positioned blocks with line information for rendering
 */
export declare function renderResume(data: ResumeData, config?: ResumeLayoutConfig): PositionedBlock[];
/**
 * Callback type for streaming resume rendering
 */
export type BlockCallback = (block: PositionedBlock) => void;
/**
 * Renders resume data with a streaming callback API.
 * Useful for progressively rendering large resumes or integrating with virtual scrolling.
 *
 * @param data - The resume data object
 * @param callback - Called for each positioned block
 * @param config - Optional layout configuration
 */
export declare function renderResumeStreaming(data: ResumeData, callback: BlockCallback, config?: ResumeLayoutConfig): void;
/**
 * Calculates the total height required for the resume
 */
export declare function calculateResumeHeight(data: ResumeData, config?: ResumeLayoutConfig): number;
/**
 * Validates resume data structure
 */
export declare function validateResumeData(data: unknown): data is ResumeData;
export {};
//# sourceMappingURL=resume-builder.d.ts.map
/**
 * Resume Builder for Pretext Engine
 *
 * Provides functions to render structured resume data into DOM elements
 * using the Pretext layout engine for precise text measurement.
 */
import type { ResumeData } from './types.js';
import { type LayoutLine as PretextLayoutLine } from '@chenglou/pretext';
export type { ResumeData };
/**
 * A positioned block representing a laid-out text element on the page.
 * Used for precise text measurement and positioning.
 */
export type PositionedBlock = {
    x: number;
    y: number;
    width: number;
    lines: PretextLayoutLine[];
    type: 'name' | 'title' | 'contact' | 'section' | 'entry' | 'summary' | 'skill';
};
/**
 * An augmented layout line with styling information for rendering.
 */
export type LayoutLine = {
    text: string;
    width: number;
    fontFamily: string;
    fontSize: number;
    fontWeight: number | string;
    color: string;
};
/**
 * Create a PositionedBlock with the given parameters.
 */
export declare function createPositionedBlock(type: PositionedBlock['type'], x: number, y: number, width: number, lines: PretextLayoutLine[]): PositionedBlock;
/**
 * Create a LayoutLine with styling information.
 */
export declare function createLayoutLine(text: string, width: number, fontFamily: string, fontSize: number, fontWeight: number | string, color: string): LayoutLine;
/**
 * Render resume data into a container element using CSS custom properties
 * for all styling values.
 *
 * @param data   - The resume data to render
 * @param container - The DOM element to render into
 */
export declare function renderResume(data: ResumeData, container: HTMLElement): void;
//# sourceMappingURL=resume-builder.d.ts.map
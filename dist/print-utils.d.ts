/**
 * Print Utilities Module
 * Handles print-to-PDF functionality with optimized @media print styles
 */
export interface PrintOptions {
    enableBackgrounds?: boolean;
    scale?: number;
    margins?: string;
}
/**
 * Triggers the browser's native print dialog
 * Ensures current theme styles are preserved
 */
export declare function printResume(options?: PrintOptions): void;
/**
 * Validates if print is supported in current environment
 */
export declare function isPrintSupported(): boolean;
/**
 * Generates a PDF-friendly version of the resume
 * Note: This uses browser's native print-to-PDF
 * For server-side PDF generation, consider using Puppeteer or similar
 */
export declare function generatePDF(filename?: string): Promise<void>;
/**
 * Prepares the document for printing by applying print-specific classes
 */
export declare function prepareForPrint(): void;
/**
 * Cleans up after print operation
 */
export declare function cleanupAfterPrint(): void;
//# sourceMappingURL=print-utils.d.ts.map
/**
 * Print-to-PDF Functionality for Pretext Resume Builder
 *
 * Provides CSS @media print styles and a TypeScript function to trigger
 * the browser's native print dialog with proper theme support.
 */
export declare const PRINT_CSS = "\n/* ============================================================================\n   Print Styles for Resume Builder\n   Optimized for A4 paper format\n   ============================================================================ */\n\n@media print {\n  /* Page setup for A4 */\n  @page {\n    size: A4;\n    margin: 0;\n  }\n\n  /* Ensure colors print correctly */\n  * {\n    -webkit-print-color-adjust: exact !important;\n    print-color-adjust: exact !important;\n    color-adjust: exact !important;\n  }\n\n  /* Hide UI elements that shouldn't appear in print */\n  .theme-switcher,\n  .theme-switcher *,\n  [data-theme-switcher],\n  [data-theme-switcher] *,\n  .no-print,\n  .no-print *,\n  nav,\n  navigation,\n  .navigation,\n  .nav-buttons,\n  .btn-print,\n  button,\n  input,\n  select,\n  textarea,\n  .controls,\n  .toolbar,\n  header:not(.resume-header),\n  footer:not(.resume-footer),\n  aside,\n  .sidebar,\n  .modal,\n  .dialog,\n  .popup {\n    display: none !important;\n    visibility: hidden !important;\n    opacity: 0 !important;\n    position: absolute !important;\n    left: -9999px !important;\n  }\n\n  /* Reset body margins for print */\n  body {\n    margin: 0 !important;\n    padding: 0 !important;\n    background: white !important;\n    color: black !important;\n  }\n\n  /* Ensure resume container is properly sized and centered */\n  .resume-container,\n  #resume-container,\n  .resume,\n  #resume,\n  .resume-content,\n  #resume-content {\n    width: 210mm !important; /* A4 width */\n    min-height: 297mm !important; /* A4 height */\n    margin: 0 auto !important;\n    padding: 15mm !important; /* Standard print margin */\n    box-shadow: none !important;\n    background: white !important;\n    position: relative !important;\n    left: 0 !important;\n    top: 0 !important;\n    float: none !important;\n    clear: both !important;\n    page-break-after: always !important;\n  }\n\n  /* Ensure text is readable in print */\n  .resume-container *,\n  #resume-container * {\n    text-shadow: none !important;\n    box-shadow: none !important;\n  }\n\n  /* Prevent content from breaking awkwardly */\n  .resume-section,\n  .resume-entry,\n  .resume-block {\n    page-break-inside: avoid !important;\n    break-inside: avoid !important;\n  }\n\n  /* Force section titles to stay with their content */\n  .resume-section-title {\n    page-break-after: avoid !important;\n    break-after: avoid !important;\n  }\n\n  /* Ensure links are visible (optional: show URLs) */\n  a[href]:after {\n    content: \"\" !important;\n  }\n\n  /* Remove hover effects */\n  *:hover {\n    background: transparent !important;\n  }\n\n  /* Ensure images scale properly */\n  img {\n    max-width: 100% !important;\n    height: auto !important;\n    page-break-inside: avoid !important;\n  }\n\n  /* Force background graphics for gradients and colored sections */\n  .resume-section-bg,\n  [style*=\"background\"] {\n    -webkit-print-color-adjust: exact !important;\n    print-color-adjust: exact !important;\n  }\n}\n\n/* Screen-specific adjustments when preparing for print */\n.print-preview-mode {\n  .theme-switcher,\n  .controls,\n  .toolbar {\n    opacity: 0.3;\n    pointer-events: none;\n  }\n}\n";
/**
 * Inject print CSS into the document
 * Should be called once during initialization
 */
export declare function injectPrintStyles(): void;
/**
 * Options for printResume function
 */
export type PrintOptions = {
    /** Callback before print dialog opens */
    onBeforePrint?: () => void;
    /** Callback after print dialog closes (or is cancelled) */
    onAfterPrint?: () => void;
    /** Force inject styles before printing (default: true) */
    injectStyles?: boolean;
    /** Theme to apply before printing (default: current theme) */
    theme?: string;
    /** Container element selector or reference */
    container?: HTMLElement | string;
};
/**
 * Triggers the browser's native print dialog with proper theme support.
 *
 * This function ensures that:
 * - Print styles are injected
 * - Current theme is preserved
 * - UI elements are hidden during print
 * - Lifecycle callbacks are executed
 *
 * @param options - Optional configuration for print behavior
 *
 * @example
 * // Basic usage
 * printResume()
 *
 * @example
 * // With callbacks
 * printResume({
 *   onBeforePrint: () => console.log('Preparing to print...'),
 *   onAfterPrint: () => console.log('Print completed or cancelled')
 * })
 *
 * @example
 * // With specific theme
 * printResume({ theme: 'professional' })
 */
export declare function printResume(options?: PrintOptions): void;
/**
 * Prepares the resume for print preview mode without opening the dialog.
 * Useful for showing users how their resume will look when printed.
 *
 * @param container - Container element or selector
 * @param enable - Whether to enable or disable preview mode
 */
export declare function setPrintPreviewMode(enable: boolean, container?: HTMLElement | string): void;
/**
 * Creates a print-ready version of the resume by cloning and styling it.
 * Returns the cloned element which can be used for custom print workflows.
 *
 * @param container - Source container element or selector
 * @param theme - Optional theme to apply
 * @returns Cloned and styled resume element
 */
export declare function createPrintReadyClone(container: HTMLElement | string, theme?: string): HTMLElement | null;
/**
 * Initialize all print-related styles and utilities.
 * Call this once during application startup.
 */
export declare function initializePrintSupport(): void;
//# sourceMappingURL=resume-print.d.ts.map
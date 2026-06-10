/**
 * Print Utilities Module
 *
 * Handles print-to-PDF functionality with optimized @media print styles.
 * Consolidated with the richer print support from resume-print.ts.
 */

import { injectThemeStyles, getCurrentTheme, applyTheme } from './resume-themes.js'

// ============================================================================
// Print CSS Styles
// ============================================================================

export const PRINT_CSS = `
/* ============================================================================
   Print Styles for Resume Builder
   Optimized for A4 paper format
   ============================================================================ */

@media print {
  /* Page setup for A4 */
  @page {
    size: A4;
    margin: 0;
  }

  /* Ensure colors print correctly */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  /* Hide UI elements that shouldn't appear in print */
  .theme-switcher,
  .theme-switcher *,
  [data-theme-switcher],
  [data-theme-switcher] *,
  .no-print,
  .no-print *,
  nav,
  navigation,
  .navigation,
  .nav-buttons,
  .btn-print,
  button,
  input,
  select,
  textarea,
  .controls,
  .toolbar,
  header:not(.resume-header),
  footer:not(.resume-footer),
  aside,
  .sidebar,
  .modal,
  .dialog,
  .popup {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    position: absolute !important;
    left: -9999px !important;
  }

  /* Reset body margins for print */
  body {
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
    color: black !important;
  }

  /* Ensure resume container is properly sized and centered */
  .resume-container,
  #resume-container,
  .resume,
  #resume,
  .resume-content,
  #resume-content {
    width: 210mm !important;
    min-height: 297mm !important;
    margin: 0 auto !important;
    padding: 15mm !important;
    box-shadow: none !important;
    background: white !important;
    position: relative !important;
    left: 0 !important;
    top: 0 !important;
    float: none !important;
    clear: both !important;
    page-break-after: always !important;
  }

  /* Ensure text is readable in print */
  .resume-container *,
  #resume-container * {
    text-shadow: none !important;
    box-shadow: none !important;
  }

  /* Prevent content from breaking awkwardly */
  .resume-section,
  .resume-entry,
  .resume-block {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  /* Force section titles to stay with their content */
  .resume-section-title {
    page-break-after: avoid !important;
    break-after: avoid !important;
  }

  /* Ensure links are visible (optional: show URLs) */
  a[href]:after {
    content: "" !important;
  }

  /* Remove hover effects */
  *:hover {
    background: transparent !important;
  }

  /* Ensure images scale properly */
  img {
    max-width: 100% !important;
    height: auto !important;
    page-break-inside: avoid !important;
  }

  /* Force background graphics for gradients and colored sections */
  .resume-section-bg,
  [style*="background"] {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}

/* Screen-specific adjustments when preparing for print */
.print-preview-mode {
  .theme-switcher,
  .controls,
  .toolbar {
    opacity: 0.3;
    pointer-events: none;
  }
}
`

// ============================================================================
// Print Utility Functions
// ============================================================================

/**
 * Options for printResume function
 */
export type PrintOptions = {
  /** Callback before print dialog opens */
  onBeforePrint?: () => void
  /** Callback after print dialog closes (or is cancelled) */
  onAfterPrint?: () => void
  /** Force inject styles before printing (default: true) */
  injectStyles?: boolean
  /** Theme to apply before printing (default: current theme) */
  theme?: string
  /** Container element selector or reference */
  container?: HTMLElement | string
}

/**
 * Inject print CSS into the document.
 * Idempotent — only injects once.
 */
export function injectPrintStyles(): void {
  if (typeof document === 'undefined') return

  const existingStyle = document.getElementById('resume-print-styles')
  if (existingStyle) return

  const styleElement = document.createElement('style')
  styleElement.id = 'resume-print-styles'
  styleElement.setAttribute('media', 'print, screen')
  styleElement.textContent = PRINT_CSS
  document.head.appendChild(styleElement)
}

/**
 * Check whether print is supported in the current environment.
 */
export function isPrintSupported(): boolean {
  return typeof window !== 'undefined' && typeof window.print === 'function'
}

/**
 * Validate that a container has rendered children before printing.
 * Returns true if the container is valid for printing.
 */
export function validatePrintContainer(container?: HTMLElement | string): boolean {
  if (typeof document === 'undefined' || typeof window === 'undefined') return false

  let element: HTMLElement | null = null
  if (!container) {
    element = document.querySelector('.resume-container, #resume-container')
  } else if (typeof container === 'string') {
    element = document.querySelector(container)
  } else {
    element = container
  }

  if (!element) {
    console.warn('Print: resume container not found')
    return false
  }

  if (element.children.length === 0) {
    console.warn('Print: resume container has no children — nothing to print')
    return false
  }

  return true
}

/**
 * Triggers the browser's native print dialog with proper theme support.
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
 */
export function printResume(options: PrintOptions = {}): void {
  const {
    onBeforePrint,
    onAfterPrint,
    injectStyles = true,
    theme,
    container,
  } = options

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    console.warn('printResume() requires a browser environment')
    return
  }

  // Validate container before printing
  if (!validatePrintContainer(container)) {
    console.warn('Print validation failed — aborting print')
    return
  }

  // Inject styles if requested
  if (injectStyles) {
    injectPrintStyles()
    injectThemeStyles()
  }

  // Resolve container element
  let containerElement: HTMLElement | null = null
  if (container) {
    if (typeof container === 'string') {
      containerElement = document.querySelector(container)
    } else {
      containerElement = container
    }
  }

  // Store current theme to restore after printing
  const previousTheme = getCurrentTheme(containerElement || undefined)

  // Apply specified theme if provided
  if (theme && ['classic', 'modern', 'minimal'].includes(theme)) {
    applyTheme(theme as 'classic' | 'modern' | 'minimal', containerElement || undefined)
  }

  // Execute before print callback
  if (onBeforePrint) {
    onBeforePrint()
  }

  // Add a small delay to ensure styles are applied
  setTimeout(() => {
    try {
      window.print()
    } catch (error) {
      console.error('Error triggering print dialog:', error)
      alert('Print dialog could not be opened automatically. Please use Ctrl+P (Cmd+P on Mac) to print.')
    } finally {
      if (onAfterPrint) {
        onAfterPrint()
      }

      if (theme && theme !== previousTheme) {
        setTimeout(() => {
          applyTheme(previousTheme, containerElement || undefined)
        }, 100)
      }
    }
  }, 50)

  window.addEventListener('afterprint', () => {
    console.log('Print operation completed')
  }, { once: true })
}

/**
 * Prepares the resume for print preview mode without opening the dialog.
 * Useful for showing users how their resume will look when printed.
 *
 * @param enable  - Whether to enable or disable preview mode
 * @param container - Container element or selector
 */
export function setPrintPreviewMode(
  enable: boolean,
  container?: HTMLElement | string,
): void {
  if (typeof document === 'undefined') return

  let containerElement: HTMLElement | null = null
  if (container) {
    if (typeof container === 'string') {
      containerElement = document.querySelector(container)
    } else {
      containerElement = container
    }
  }

  const target = containerElement || document.body

  if (enable) {
    target.classList.add('print-preview-mode')
  } else {
    target.classList.remove('print-preview-mode')
  }
}

/**
 * Creates a print-ready version of the resume by cloning and styling it.
 * Returns the cloned element which can be used for custom print workflows.
 *
 * @param container - Source container element or selector
 * @param theme     - Optional theme to apply
 * @returns Cloned and styled resume element, or null if not found
 */
export function createPrintReadyClone(
  container: HTMLElement | string,
  theme?: string,
): HTMLElement | null {
  if (typeof document === 'undefined') return null

  let sourceElement: HTMLElement | null = null
  if (typeof container === 'string') {
    sourceElement = document.querySelector(container)
  } else {
    sourceElement = container
  }

  if (!sourceElement) {
    console.warn('Source container not found')
    return null
  }

  const clone = sourceElement.cloneNode(true) as HTMLElement

  clone.style.width = '210mm'
  clone.style.minHeight = '297mm'
  clone.style.margin = '0'
  clone.style.padding = '15mm'
  clone.style.background = 'white'
  clone.style.boxShadow = 'none'

  if (theme && ['classic', 'modern', 'minimal'].includes(theme)) {
    clone.classList.add(`resume-theme-${theme}`)
    clone.setAttribute('data-resume-theme', theme)
  }

  return clone
}

/**
 * Initialize all print-related styles and utilities.
 * Call this once during application startup.
 */
export function initializePrintSupport(): void {
  injectPrintStyles()
  injectThemeStyles()
}

/**
 * Prepares the document for printing by applying print-specific classes.
 */
export function prepareForPrint(): void {
  if (typeof document === 'undefined') return
  document.body.classList.add('printing')

  const images = document.querySelectorAll('img')
  images.forEach(img => {
    img.setAttribute('loading', 'eager')
  })

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      console.log('All fonts loaded for print')
    })
  }
}

/**
 * Cleans up after print operation.
 */
export function cleanupAfterPrint(): void {
  if (typeof document === 'undefined') return
  document.body.classList.remove('printing')
}

/**
 * Generates a PDF-friendly version of the resume using the browser's
 * native print-to-PDF workflow.
 */
export async function generatePDF(filename: string = 'resume.pdf'): Promise<void> {
  if (!isPrintSupported()) {
    throw new Error('Print functionality is not supported in this environment')
  }

  console.log(`Generating PDF: ${filename}`)
  printResume()
  console.log('In the print dialog, select "Save as PDF" as the destination')
}
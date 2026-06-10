/**
 * Print Utilities Module
 * Handles print-to-PDF functionality with optimized @media print styles
 */

export interface PrintOptions {
    enableBackgrounds?: boolean;
    scale?: number;
    margins?: string;
}

const DEFAULT_PRINT_OPTIONS: PrintOptions = {
    enableBackgrounds: true,
    scale: 1,
    margins: '0'
};

/**
 * Injects print-specific CSS styles into the document
 */
function injectPrintStyles(): void {
    const existingStyle = document.getElementById('print-styles');
    if (existingStyle) {
        return; // Already injected
    }

    const style = document.createElement('style');
    style.id = 'print-styles';
    style.media = 'print';
    style.textContent = `
        @media print {
            /* Page setup for A4 */
            @page {
                size: A4;
                margin: 0;
            }

            /* Hide UI elements */
            .controls,
            .theme-switcher,
            .no-print,
            button,
            select,
            input,
            nav,
            header:not(.resume-header) {
                display: none !important;
            }

            /* Body reset for print */
            body {
                background: white !important;
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
            }

            /* Resume container optimization */
            #resume-container,
            .resume-container {
                width: 100% !important;
                max-width: none !important;
                box-shadow: none !important;
                margin: 0 !important;
                padding: 20mm !important;
                page-break-after: always;
            }

            /* Ensure colors print correctly */
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
            }

            /* Prevent content from splitting awkwardly */
            .section,
            .entry {
                page-break-inside: avoid;
                break-inside: avoid;
            }

            /* Typography optimization for print */
            body {
                font-size: 11pt;
                line-height: 1.4;
            }

            /* Links should show URLs or be plain text */
            a[href]:after {
                content: none !important;
            }

            /* Remove hover effects */
            *:hover {
                background: transparent !important;
            }
        }
    `;

    document.head.appendChild(style);
}

/**
 * Triggers the browser's native print dialog
 * Ensures current theme styles are preserved
 */
export function printResume(options: PrintOptions = DEFAULT_PRINT_OPTIONS): void {
    // Inject print styles if not already present
    injectPrintStyles();

    // Wait for any pending DOM updates
    requestAnimationFrame(() => {
        // Before print event (optional logging)
        console.log('🖨️ Preparing document for print...');

        // Trigger print dialog
        try {
            window.print();
            console.log('✅ Print dialog opened successfully');
        } catch (error) {
            console.error('❌ Error opening print dialog:', error);
            
            // Fallback: Show user instructions
            alert('Print dialog could not be opened automatically. Please use Ctrl+P (Cmd+P on Mac) to print.');
        }

        // After print event handling
        window.addEventListener('afterprint', () => {
            console.log('📄 Print operation completed');
        }, { once: true });
    });
}

/**
 * Validates if print is supported in current environment
 */
export function isPrintSupported(): boolean {
    return typeof window !== 'undefined' && typeof window.print === 'function';
}

/**
 * Generates a PDF-friendly version of the resume
 * Note: This uses browser's native print-to-PDF
 * For server-side PDF generation, consider using Puppeteer or similar
 */
export async function generatePDF(filename: string = 'resume.pdf'): Promise<void> {
    if (!isPrintSupported()) {
        throw new Error('Print functionality is not supported in this environment');
    }

    console.log(`📝 Generating PDF: ${filename}`);
    
    // Note: Browser security prevents automatic PDF download without user interaction
    // The print dialog must be triggered by user action
    printResume();
    
    // Inform user about manual save step
    console.log('ℹ️ In the print dialog, select "Save as PDF" as the destination');
}

/**
 * Prepares the document for printing by applying print-specific classes
 */
export function prepareForPrint(): void {
    document.body.classList.add('printing');
    
    // Add print-specific attributes to images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.setAttribute('loading', 'eager');
    });

    // Ensure all fonts are loaded
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            console.log('✅ All fonts loaded for print');
        });
    }
}

/**
 * Cleans up after print operation
 */
export function cleanupAfterPrint(): void {
    document.body.classList.remove('printing');
    console.log('🧹 Print cleanup completed');
}

// Auto-inject print styles on module load
if (typeof document !== 'undefined') {
    injectPrintStyles();
}

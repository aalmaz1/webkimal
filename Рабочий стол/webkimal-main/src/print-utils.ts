/**
 * Production Print Optimizer
 * PDF/Print lifecycle orchestration hooks.
 */

const PRINT_STYLE_ID = 'resume-print-styles';

/**
 * Inject a <style> block with rigorous @media print rules.
 * Idempotent — only injects once.
 */
function ensurePrintStyles(): void {
  if (document.getElementById(PRINT_STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = PRINT_STYLE_ID;
  style.textContent = `
    @media print {
      /* --- A4 sizing --- */
      @page {
        size: A4;
        margin: 0;
      }

      /* --- Rendering quality --- */
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }

      /* --- Interface purging: hide all interactive / non-resume UI --- */
      .controls-bar,
      .sidebar,
      .instructions,
      button,
      input,
      select,
      textarea,
      nav,
      aside,
      .no-print {
        display: none !important;
      }

      /* --- Pagination break protections --- */
      .positioned-block.entity-item,
      .positioned-block.section-block {
        page-break-inside: avoid;
        break-inside: avoid;
      }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Trigger the browser print dialog after sanity-checking the resume container.
 */
export function printResume(): void {
  const container = document.getElementById('resume-container');

  // Sanity check: abort if the resume area is empty or missing.
  if (!container || container.innerHTML.trim() === '') {
    alert('Nothing to print — the resume has not been rendered yet.');
    return;
  }

  ensurePrintStyles();
  window.print();
}

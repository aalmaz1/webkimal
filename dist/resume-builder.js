/**
 * Resume Builder for Pretext Engine
 *
 * This module provides a function to render resume data using the Pretext layout engine.
 * It maps structured resume JSON data into Pretext layout elements.
 *
 * Supports theme switching via CSS variables and theme configurations.
 */
import { prepareWithSegments, layoutWithLines, } from '@chenglou/pretext';
import { THEME_CONFIGS, } from './resume-themes.js';
export const DEFAULT_LAYOUT_CONFIG = {
    pageWidth: 816, // Letter size at 96 DPI (8.5 inches)
    pageHeight: 1056, // Letter size at 96 DPI (11 inches)
    marginLeft: 48,
    marginRight: 48,
    marginTop: 48,
    marginBottom: 48,
    nameFont: 'bold 24px "Helvetica Neue", Helvetica, Arial, sans-serif',
    sectionTitleFont: 'bold 14px "Helvetica Neue", Helvetica, Arial, sans-serif',
    bodyFont: '400 11px "Helvetica Neue", Helvetica, Arial, sans-serif',
    subsectionFont: 'bold 11px "Helvetica Neue", Helvetica, Arial, sans-serif',
    lineHeight: 16,
    sectionSpacing: 20,
    entrySpacing: 12,
    highlightIndent: 16,
    theme: 'professional',
};
/**
 * Build layout config from a theme configuration
 * @param themeConfig - The theme configuration to use
 * @param baseConfig - Optional base config to override (defaults to DEFAULT_LAYOUT_CONFIG)
 * @returns A new layout config with theme-based fonts and spacing
 */
export function buildThemeLayoutConfig(themeConfig, baseConfig = DEFAULT_LAYOUT_CONFIG) {
    return {
        ...baseConfig,
        theme: themeConfig.name,
        themeConfig,
        nameFont: `bold ${themeConfig.nameFontSize} ${themeConfig.nameFont}`,
        sectionTitleFont: `bold ${themeConfig.sectionTitleFontSize} ${themeConfig.sectionTitleFont}`,
        bodyFont: `${themeConfig.bodyFontWeight} ${themeConfig.bodyFontSize} ${themeConfig.bodyFont}`,
        subsectionFont: `bold ${themeConfig.subsectionFontSize} ${themeConfig.subsectionFont}`,
        sectionSpacing: themeConfig.sectionSpacing,
        entrySpacing: themeConfig.entrySpacing,
        highlightIndent: themeConfig.highlightIndent,
    };
}
// ============================================================================
// Helper Functions
// ============================================================================
function prepareText(text, font) {
    return prepareWithSegments(text, font);
}
function measureTextHeight(prepared, maxWidth, lineHeight) {
    const result = layoutWithLines(prepared, maxWidth, lineHeight);
    return result.height;
}
function formatContactItem(key, value) {
    const labels = {
        email: '',
        phone: '',
        location: '',
        website: '',
        linkedin: '',
        github: '',
    };
    // For URLs, strip protocol for cleaner display
    let displayValue = value;
    if (key === 'website' || key === 'linkedin' || key === 'github') {
        displayValue = value.replace(/^https?:\/\//, '').replace(/^www\./, '');
        if (key === 'linkedin') {
            displayValue = displayValue.replace(/^linkedin\.com\/in\//, '');
        }
        else if (key === 'github') {
            displayValue = displayValue.replace(/^github\.com\//, '');
        }
    }
    return displayValue;
}
function buildContactLine(contact) {
    const items = [];
    if (contact.email)
        items.push(formatContactItem('email', contact.email));
    if (contact.phone)
        items.push(formatContactItem('phone', contact.phone));
    if (contact.location)
        items.push(formatContactItem('location', contact.location));
    const separator = ' | ';
    return items.join(separator);
}
function buildExperienceHeading(entry) {
    let heading = entry.position;
    if (entry.company) {
        heading += ` at ${entry.company}`;
    }
    return heading;
}
function buildExperienceMeta(entry) {
    const parts = [];
    if (entry.location) {
        parts.push(entry.location);
    }
    let dateRange = '';
    if (entry.startDate) {
        dateRange = entry.startDate;
        if (entry.current) {
            dateRange += ' – Present';
        }
        else if (entry.endDate) {
            dateRange += ` – ${entry.endDate}`;
        }
    }
    if (dateRange) {
        parts.push(dateRange);
    }
    return parts.join(' • ');
}
function buildEducationHeading(entry) {
    let heading = entry.degree;
    if (entry.institution) {
        heading += ` — ${entry.institution}`;
    }
    return heading;
}
function buildEducationMeta(entry) {
    const parts = [];
    if (entry.location) {
        parts.push(entry.location);
    }
    let dateRange = '';
    if (entry.startDate) {
        dateRange = entry.startDate;
        if (entry.endDate) {
            dateRange += ` – ${entry.endDate}`;
        }
    }
    if (dateRange) {
        parts.push(dateRange);
    }
    if (entry.gpa) {
        parts.push(`GPA: ${entry.gpa}`);
    }
    return parts.join(' • ');
}
// ============================================================================
// Main Render Function
// ============================================================================
/**
 * Renders resume data into positioned layout blocks using the Pretext engine.
 *
 * @param data - The resume data object containing name, contact, education, and experience
 * @param config - Optional layout configuration (defaults to DEFAULT_LAYOUT_CONFIG)
 *               Can include a theme name or theme config for styled rendering
 * @returns An array of positioned blocks with line information for rendering
 */
export function renderResume(data, config = DEFAULT_LAYOUT_CONFIG) {
    // Apply theme configuration if specified
    const effectiveConfig = config.themeConfig
        ? buildThemeLayoutConfig(config.themeConfig, config)
        : config.theme
            ? buildThemeLayoutConfig(THEME_CONFIGS[config.theme], config)
            : config;
    const contentWidth = effectiveConfig.pageWidth - effectiveConfig.marginLeft - effectiveConfig.marginRight;
    const blocks = [];
    let currentY = effectiveConfig.marginTop;
    // Helper to add a block
    function addBlock(element, font) {
        let text = '';
        switch (element.type) {
            case 'name':
                text = element.text;
                break;
            case 'contact':
                text = element.items.join(' | ');
                break;
            case 'sectionTitle':
                text = element.text.toUpperCase();
                break;
            case 'entry':
                text = element.heading;
                if (element.subheading) {
                    text = `${element.heading} — ${element.subheading}`;
                }
                break;
            case 'spacer':
                // Spacers don't need text preparation
                currentY += element.height;
                return;
        }
        const prepared = prepareText(text, font);
        const linesResult = layoutWithLines(prepared, contentWidth, effectiveConfig.lineHeight);
        blocks.push({
            x: effectiveConfig.marginLeft,
            y: currentY,
            width: contentWidth,
            lines: linesResult.lines,
            type: element.type,
        });
        currentY += linesResult.height;
    }
    // Helper to add highlights (bullet points)
    function addHighlights(highlights) {
        for (const highlight of highlights) {
            const text = `• ${highlight}`;
            const prepared = prepareText(text, effectiveConfig.bodyFont);
            const linesResult = layoutWithLines(prepared, contentWidth - effectiveConfig.highlightIndent, effectiveConfig.lineHeight);
            // Indent highlights
            const indentedLines = linesResult.lines.map(line => ({
                ...line,
                start: line.start,
                end: line.end,
            }));
            blocks.push({
                x: effectiveConfig.marginLeft + effectiveConfig.highlightIndent,
                y: currentY,
                width: contentWidth - effectiveConfig.highlightIndent,
                lines: indentedLines,
                type: 'entry',
            });
            currentY += linesResult.height;
        }
    }
    // 1. Name
    addBlock({ type: 'name', text: data.name }, effectiveConfig.nameFont);
    currentY += 4; // Extra spacing after name
    // 2. Contact Info
    const contactItems = [];
    if (data.contact.email)
        contactItems.push(formatContactItem('email', data.contact.email));
    if (data.contact.phone)
        contactItems.push(formatContactItem('phone', data.contact.phone));
    if (data.contact.location)
        contactItems.push(formatContactItem('location', data.contact.location));
    const secondaryContactItems = [];
    if (data.contact.website)
        secondaryContactItems.push(formatContactItem('website', data.contact.website));
    if (data.contact.linkedin)
        secondaryContactItems.push(formatContactItem('linkedin', data.contact.linkedin));
    if (data.contact.github)
        secondaryContactItems.push(formatContactItem('github', data.contact.github));
    if (contactItems.length > 0) {
        addBlock({ type: 'contact', items: contactItems }, effectiveConfig.bodyFont);
    }
    if (secondaryContactItems.length > 0) {
        addBlock({ type: 'contact', items: secondaryContactItems }, effectiveConfig.bodyFont);
    }
    currentY += effectiveConfig.sectionSpacing;
    // 3. Summary (optional)
    if (data.summary) {
        addBlock({ type: 'entry', heading: data.summary }, effectiveConfig.bodyFont);
        currentY += effectiveConfig.sectionSpacing;
    }
    // 4. Experience
    if (data.experience && data.experience.length > 0) {
        addBlock({ type: 'sectionTitle', text: 'Experience' }, effectiveConfig.sectionTitleFont);
        currentY += effectiveConfig.entrySpacing;
        for (const exp of data.experience) {
            const heading = exp.position;
            const subheading = exp.company;
            const meta = buildExperienceMeta(exp);
            // Create combined heading line
            let headingText = heading;
            if (subheading) {
                headingText = `${heading} — ${subheading}`;
            }
            addBlock({ type: 'entry', heading: headingText, meta }, effectiveConfig.subsectionFont);
            if (exp.highlights && exp.highlights.length > 0) {
                addHighlights(exp.highlights);
            }
            currentY += effectiveConfig.entrySpacing;
        }
        currentY += effectiveConfig.sectionSpacing - effectiveConfig.entrySpacing;
    }
    // 5. Education
    if (data.education && data.education.length > 0) {
        addBlock({ type: 'sectionTitle', text: 'Education' }, effectiveConfig.sectionTitleFont);
        currentY += effectiveConfig.entrySpacing;
        for (const edu of data.education) {
            const heading = edu.degree;
            const subheading = edu.institution;
            const meta = buildEducationMeta(edu);
            let headingText = heading;
            if (subheading) {
                headingText = `${heading} — ${subheading}`;
            }
            addBlock({ type: 'entry', heading: headingText, meta }, effectiveConfig.subsectionFont);
            if (edu.highlights && edu.highlights.length > 0) {
                addHighlights(edu.highlights);
            }
            currentY += effectiveConfig.entrySpacing;
        }
        currentY += effectiveConfig.sectionSpacing - effectiveConfig.entrySpacing;
    }
    // 6. Skills (optional)
    if (data.skills && data.skills.length > 0) {
        addBlock({ type: 'sectionTitle', text: 'Skills' }, effectiveConfig.sectionTitleFont);
        currentY += effectiveConfig.entrySpacing;
        const skillsText = data.skills.join(' • ');
        addBlock({ type: 'entry', heading: skillsText }, effectiveConfig.bodyFont);
    }
    return blocks;
}
/**
 * Renders resume data with a streaming callback API.
 * Useful for progressively rendering large resumes or integrating with virtual scrolling.
 *
 * @param data - The resume data object
 * @param callback - Called for each positioned block
 * @param config - Optional layout configuration
 */
export function renderResumeStreaming(data, callback, config = DEFAULT_LAYOUT_CONFIG) {
    const contentWidth = config.pageWidth - config.marginLeft - config.marginRight;
    let currentY = config.marginTop;
    function emitBlock(element, font) {
        let text = '';
        switch (element.type) {
            case 'name':
                text = element.text;
                break;
            case 'contact':
                text = element.items.join(' | ');
                break;
            case 'sectionTitle':
                text = element.text.toUpperCase();
                break;
            case 'entry':
                text = element.heading;
                if (element.subheading) {
                    text = `${element.heading} — ${element.subheading}`;
                }
                break;
            case 'spacer':
                currentY += element.height;
                return;
        }
        const prepared = prepareText(text, font);
        const linesResult = layoutWithLines(prepared, contentWidth, config.lineHeight);
        callback({
            x: config.marginLeft,
            y: currentY,
            width: contentWidth,
            lines: linesResult.lines,
            type: element.type,
        });
        currentY += linesResult.height;
    }
    function emitHighlights(highlights) {
        for (const highlight of highlights) {
            const text = `• ${highlight}`;
            const prepared = prepareText(text, config.bodyFont);
            const linesResult = layoutWithLines(prepared, contentWidth - config.highlightIndent, config.lineHeight);
            callback({
                x: config.marginLeft + config.highlightIndent,
                y: currentY,
                width: contentWidth - config.highlightIndent,
                lines: linesResult.lines,
                type: 'entry',
            });
            currentY += linesResult.height;
        }
    }
    // Name
    emitBlock({ type: 'name', text: data.name }, config.nameFont);
    currentY += 4;
    // Contact
    const contactItems = [];
    if (data.contact.email)
        contactItems.push(formatContactItem('email', data.contact.email));
    if (data.contact.phone)
        contactItems.push(formatContactItem('phone', data.contact.phone));
    if (data.contact.location)
        contactItems.push(formatContactItem('location', data.contact.location));
    const secondaryContactItems = [];
    if (data.contact.website)
        secondaryContactItems.push(formatContactItem('website', data.contact.website));
    if (data.contact.linkedin)
        secondaryContactItems.push(formatContactItem('linkedin', data.contact.linkedin));
    if (data.contact.github)
        secondaryContactItems.push(formatContactItem('github', data.contact.github));
    if (contactItems.length > 0) {
        emitBlock({ type: 'contact', items: contactItems }, config.bodyFont);
    }
    if (secondaryContactItems.length > 0) {
        emitBlock({ type: 'contact', items: secondaryContactItems }, config.bodyFont);
    }
    currentY += config.sectionSpacing;
    // Summary
    if (data.summary) {
        emitBlock({ type: 'entry', heading: data.summary }, config.bodyFont);
        currentY += config.sectionSpacing;
    }
    // Experience
    if (data.experience && data.experience.length > 0) {
        emitBlock({ type: 'sectionTitle', text: 'Experience' }, config.sectionTitleFont);
        currentY += config.entrySpacing;
        for (const exp of data.experience) {
            let headingText = exp.position;
            if (exp.company) {
                headingText = `${exp.position} — ${exp.company}`;
            }
            const meta = buildExperienceMeta(exp);
            emitBlock({ type: 'entry', heading: headingText, meta }, config.subsectionFont);
            if (exp.highlights && exp.highlights.length > 0) {
                emitHighlights(exp.highlights);
            }
            currentY += config.entrySpacing;
        }
        currentY += config.sectionSpacing - config.entrySpacing;
    }
    // Education
    if (data.education && data.education.length > 0) {
        emitBlock({ type: 'sectionTitle', text: 'Education' }, config.sectionTitleFont);
        currentY += config.entrySpacing;
        for (const edu of data.education) {
            let headingText = edu.degree;
            if (edu.institution) {
                headingText = `${edu.degree} — ${edu.institution}`;
            }
            const meta = buildEducationMeta(edu);
            emitBlock({ type: 'entry', heading: headingText, meta }, config.subsectionFont);
            if (edu.highlights && edu.highlights.length > 0) {
                emitHighlights(edu.highlights);
            }
            currentY += config.entrySpacing;
        }
        currentY += config.sectionSpacing - config.entrySpacing;
    }
    // Skills
    if (data.skills && data.skills.length > 0) {
        emitBlock({ type: 'sectionTitle', text: 'Skills' }, config.sectionTitleFont);
        currentY += config.entrySpacing;
        const skillsText = data.skills.join(' • ');
        emitBlock({ type: 'entry', heading: skillsText }, config.bodyFont);
    }
}
// ============================================================================
// Utility Functions
// ============================================================================
/**
 * Calculates the total height required for the resume
 */
export function calculateResumeHeight(data, config = DEFAULT_LAYOUT_CONFIG) {
    const blocks = renderResume(data, config);
    if (blocks.length === 0)
        return 0;
    const lastBlock = blocks[blocks.length - 1];
    const lastLine = lastBlock.lines[lastBlock.lines.length - 1];
    if (!lastLine)
        return 0;
    return lastBlock.y + config.lineHeight;
}
/**
 * Validates resume data structure
 */
export function validateResumeData(data) {
    if (!data || typeof data !== 'object')
        return false;
    const obj = data;
    if (typeof obj.name !== 'string' || !obj.name.trim())
        return false;
    if (typeof obj.contact !== 'object' || obj.contact === null)
        return false;
    if (!Array.isArray(obj.education))
        return false;
    if (!Array.isArray(obj.experience))
        return false;
    const contact = obj.contact;
    for (const key of ['email', 'phone', 'location', 'website', 'linkedin', 'github']) {
        if (key in contact && typeof contact[key] !== 'string')
            return false;
    }
    for (const edu of obj.education) {
        if (!edu || typeof edu !== 'object')
            return false;
        const e = edu;
        if (typeof e.institution !== 'string' || typeof e.degree !== 'string')
            return false;
    }
    for (const exp of obj.experience) {
        if (!exp || typeof exp !== 'object')
            return false;
        const e = exp;
        if (typeof e.company !== 'string' || typeof e.position !== 'string')
            return false;
    }
    return true;
}
//# sourceMappingURL=resume-builder.js.map
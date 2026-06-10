/**
 * Resume Builder for Pretext Engine
 *
 * Provides functions to render structured resume data into DOM elements
 * using the Pretext layout engine for precise text measurement.
 */

import type { ResumeData, Skills, SkillCategory } from './types.js'
import { prepareWithSegments, layoutWithLines, type PreparedTextWithSegments, type LayoutLine as PretextLayoutLine } from '@chenglou/pretext'

export type { ResumeData }

/**
 * A positioned block representing a laid-out text element on the page.
 * Used for precise text measurement and positioning.
 */
export type PositionedBlock = {
  x: number
  y: number
  width: number
  lines: PretextLayoutLine[]
  type: 'name' | 'title' | 'contact' | 'section' | 'entry' | 'summary' | 'skill'
}

/**
 * An augmented layout line with styling information for rendering.
 */
export type LayoutLine = {
  text: string
  width: number
  fontFamily: string
  fontSize: number
  fontWeight: number | string
  color: string
}

/**
 * Create a PositionedBlock with the given parameters.
 */
export function createPositionedBlock(
  type: PositionedBlock['type'],
  x: number,
  y: number,
  width: number,
  lines: PretextLayoutLine[],
): PositionedBlock {
  return { type, x, y, width, lines }
}

/**
 * Create a LayoutLine with styling information.
 */
export function createLayoutLine(
  text: string,
  width: number,
  fontFamily: string,
  fontSize: number,
  fontWeight: number | string,
  color: string,
): LayoutLine {
  return { text, width, fontFamily, fontSize, fontWeight, color }
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function prepareText(text: string, font: string): PreparedTextWithSegments {
  return prepareWithSegments(text, font)
}

function measureTextHeight(prepared: PreparedTextWithSegments, maxWidth: number, lineHeight: number): number {
  const result = layoutWithLines(prepared, maxWidth, lineHeight)
  return result.height
}

function formatContactItem(value: string): string {
  return value.replace(/^https?:\/\//, '').replace(/^www\./, '')
}

function buildContactLine(personal: { email: string; phone: string; location: string; linkedin?: string; github?: string }): string {
  const items: string[] = []
  if (personal.email) items.push(personal.email)
  if (personal.phone) items.push(personal.phone)
  if (personal.location) items.push(personal.location)
  if (personal.linkedin) items.push(formatContactItem(personal.linkedin))
  if (personal.github) items.push(formatContactItem(personal.github))
  return items.join(' • ')
}

function createBlock<K extends keyof HTMLElementTagNameMap>(tagName: K, className: string, textContent?: string): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName)
  element.className = className
  if (textContent) {
    element.textContent = textContent
  }
  return element
}

function createParagraph(text: string, font: string, maxWidth: number, lineHeight: number, className: string): HTMLElement {
  const prepared = prepareText(text, font)
  const estimatedHeight = measureTextHeight(prepared, maxWidth, lineHeight)
  const paragraph = createBlock('div', className, text)
  paragraph.style.whiteSpace = 'pre-wrap'
  paragraph.style.lineHeight = `${lineHeight}px`
  paragraph.style.minHeight = `${Math.max(estimatedHeight, lineHeight)}px`
  return paragraph
}

function createSection(title: string): HTMLElement {
  const section = createBlock('section', 'resume-section')
  const heading = createBlock('h2', 'resume-section-title', title)
  section.appendChild(heading)
  return section
}

function createEntry(
  title: string,
  subtitle: string | undefined,
  meta: string | undefined,
  highlights: string[] | undefined,
  entrySpacing: number,
): HTMLElement {
  const entry = createBlock('div', 'resume-entry')
  entry.appendChild(createBlock('h3', 'entry-title', title))
  if (subtitle) {
    entry.appendChild(createBlock('div', 'entry-subtitle', subtitle))
  }
  if (meta) {
    entry.appendChild(createBlock('div', 'entry-meta', meta))
  }
  if (highlights?.length) {
    const list = document.createElement('ul')
    list.className = 'entry-highlights'
    highlights.forEach((highlight) => {
      if (!highlight) return
      const item = document.createElement('li')
      item.textContent = highlight
      list.appendChild(item)
    })
    entry.appendChild(list)
  }
  entry.style.marginBottom = `${entrySpacing}px`
  return entry
}

function createSkillSection(skills: Skills): HTMLElement {
  const section = createSection('Skills')
  const content = createBlock('div', 'skills-content')
  if (!Array.isArray(skills) || !skills.length) return section
  if (typeof skills[0] === 'string') {
    content.appendChild(createBlock('div', 'skills-row', (skills as string[]).join(' · ')))
  } else {
    (skills as SkillCategory[]).forEach((category) => {
      const group = createBlock('div', 'skill-category')
      group.appendChild(createBlock('h3', 'skill-category-title', category.category))
      group.appendChild(createBlock('div', 'skill-category-list', category.skills.join(' · ')))
      content.appendChild(group)
    })
  }
  section.appendChild(content)
  return section
}

// ── CSS variable helpers ──────────────────────────────────────────────────────

function readCssVar(style: CSSStyleDeclaration, name: string, fallback: string): string {
  return style.getPropertyValue(`--resume-${name}`).trim() || fallback
}

function readCssVarPx(style: CSSStyleDeclaration, name: string, fallback: number): number {
  const val = readCssVar(style, name, `${fallback}px`)
  return parseInt(val, 10) || fallback
}

function readCssVarNum(style: CSSStyleDeclaration, name: string, fallback: number): number {
  const val = readCssVar(style, name, `${fallback}`)
  return parseFloat(val) || fallback
}

function buildFontShorthand(style: CSSStyleDeclaration, prefix: string): string {
  const weight = readCssVar(style, `${prefix}-font-weight`, '400')
  const size = readCssVar(style, `${prefix}-font-size`, '11px')
  const family = readCssVar(style, `${prefix}-font`, '"Helvetica Neue", Helvetica, Arial, sans-serif')
  return `${weight} ${size} ${family}`
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Render resume data into a container element using CSS custom properties
 * for all styling values.
 *
 * @param data   - The resume data to render
 * @param container - The DOM element to render into
 */
export function renderResume(data: ResumeData, container: HTMLElement): void {
  if (!data) return
  if (!container) throw new Error('renderResume: container is required')

  // Save overflow-line if it exists
  const overflowLine = container.querySelector('#overflow-line')
  
  container.innerHTML = ''
  container.classList.add('resume-container')

  // Restore overflow-line after clearing
  if (overflowLine) {
    container.appendChild(overflowLine)
  }

  const style = getComputedStyle(container)

  const marginX = readCssVarPx(style, 'margin-x', 48)
  const marginY = readCssVarPx(style, 'margin-y', 48)
  const pageWidth = readCssVarPx(style, 'page-width', 816)
  const lineHeight = readCssVarNum(style, 'body-line-height', 1.5) * readCssVarPx(style, 'body-font-size', 11)
  const sectionSpacing = readCssVarPx(style, 'section-spacing', 24)
  const entrySpacing = readCssVarPx(style, 'entry-spacing', 14)

  const nameFont = buildFontShorthand(style, 'name')
  const subsectionFont = buildFontShorthand(style, 'subsection')
  const bodyFont = buildFontShorthand(style, 'body')

  container.style.padding = `${marginY}px ${marginX}px ${marginY}px ${marginX}px`
  container.style.maxWidth = `${pageWidth}px`
  container.style.boxSizing = 'border-box'

  const { personal, summary, experience, education, skills } = data

  // Header
  const header = createBlock('header', 'resume-header')
  const nameElement = createBlock('h1', 'resume-name', personal?.name)
  nameElement.style.font = nameFont
  header.appendChild(nameElement)

  if (personal?.title) {
    const titleElement = createBlock('div', 'resume-title', personal.title)
    titleElement.style.font = subsectionFont
    header.appendChild(titleElement)
  }

  if (personal) {
    const contactLine = buildContactLine(personal)
    if (contactLine) {
      const contactElement = createBlock('div', 'resume-contact', contactLine)
      contactElement.style.font = bodyFont
      header.appendChild(contactElement)
    }
  }

  container.appendChild(header)

  // Summary
  if (summary) {
    const summarySection = createSection('Professional Summary')
    summarySection.appendChild(
      createParagraph(summary, bodyFont, pageWidth - marginX * 2, lineHeight, 'resume-summary'),
    )
    container.appendChild(summarySection)
  }

  // Experience
  if (experience?.length) {
    const experienceSection = createSection('Experience')
    experience.forEach((item) => {
      if (!item) return
      const heading = `${item.role} · ${item.company}`
      const metaParts: string[] = []
      if (item.startDate) {
        metaParts.push(item.startDate)
        if (item.current) {
          metaParts.push('Present')
        } else if (item.endDate) {
          metaParts.push(item.endDate)
        }
      }
      const meta = metaParts.length ? metaParts.join(' – ') : undefined
      experienceSection.appendChild(createEntry(heading, item.location, meta, item.highlights, entrySpacing))
    })
    container.appendChild(experienceSection)
  }

  // Education
  if (education?.length) {
    const educationSection = createSection('Education')
    education.forEach((item) => {
      if (!item) return
      const heading = `${item.degree} · ${item.institution}`
      const metaParts: string[] = []
      if (item.startDate) {
        metaParts.push(item.startDate)
        if (item.endDate) metaParts.push(item.endDate)
      }
      if (item.gpa) metaParts.push(`GPA ${item.gpa}`)
      const meta = metaParts.length ? metaParts.join(' • ') : undefined
      educationSection.appendChild(createEntry(heading, item.location, meta, item.highlights, entrySpacing))
    })
    container.appendChild(educationSection)
  }

  // Skills
  if (skills?.length) {
    container.appendChild(createSkillSection(skills))
  }
  
  console.log('Resume rendered successfully')
}
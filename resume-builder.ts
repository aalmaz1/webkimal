import type { ResumeData, Skills, SkillCategory } from './types.js'
import type { ResumeThemeConfig } from './resume-themes.js'
import { prepareWithSegments, layoutWithLines, type PreparedTextWithSegments } from '@chenglou/pretext'

export type ResumeLayoutConfig = {
  pageWidth: number
  pageHeight: number
  marginLeft: number
  marginRight: number
  marginTop: number
  marginBottom: number
  nameFont: string
  sectionTitleFont: string
  bodyFont: string
  subsectionFont: string
  lineHeight: number
  sectionSpacing: number
  entrySpacing: number
  highlightIndent: number
  theme?: string
  themeConfig?: ResumeThemeConfig
}

export const DEFAULT_LAYOUT_CONFIG: ResumeLayoutConfig = {
  pageWidth: 816,
  pageHeight: 1056,
  marginLeft: 48,
  marginRight: 48,
  marginTop: 48,
  marginBottom: 48,
  nameFont: 'bold 24px "Helvetica Neue", Helvetica, Arial, sans-serif',
  sectionTitleFont: 'bold 14px "Helvetica Neue", Helvetica, Arial, sans-serif',
  bodyFont: '400 11px "Helvetica Neue", Helvetica, Arial, sans-serif',
  subsectionFont: 'bold 11px "Helvetica Neue", Helvetica, Arial, sans-serif',
  lineHeight: 18,
  sectionSpacing: 24,
  entrySpacing: 14,
  highlightIndent: 16,
}

export function buildThemeLayoutConfig(
  themeConfig: ResumeThemeConfig,
  baseConfig: ResumeLayoutConfig = DEFAULT_LAYOUT_CONFIG,
): ResumeLayoutConfig {
  return {
    ...baseConfig,
    themeConfig,
    nameFont: `bold ${themeConfig.nameFontSize} ${themeConfig.nameFont}`,
    sectionTitleFont: `bold ${themeConfig.sectionTitleFontSize} ${themeConfig.sectionTitleFont}`,
    bodyFont: `${themeConfig.bodyFontWeight} ${themeConfig.bodyFontSize} ${themeConfig.bodyFont}`,
    subsectionFont: `bold ${themeConfig.subsectionFontSize} ${themeConfig.subsectionFont}`,
    sectionSpacing: themeConfig.sectionSpacing,
    entrySpacing: themeConfig.entrySpacing,
    highlightIndent: themeConfig.highlightIndent,
  }
}

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
  const heading = createBlock('div', 'resume-section-title', title)
  section.appendChild(heading)
  return section
}

function createEntry(title: string, subtitle: string | undefined, meta: string | undefined, highlights: string[] | undefined, config: ResumeLayoutConfig): HTMLElement {
  const entry = createBlock('div', 'resume-entry')
  entry.appendChild(createBlock('div', 'entry-title', title))
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
  entry.style.marginBottom = `${config.entrySpacing}px`
  return entry
}

function createSkillSection(skills: Skills, config: ResumeLayoutConfig): HTMLElement {
  const section = createSection('Skills')
  const content = createBlock('div', 'skills-content')
  if (!skills.length) return section
  if (typeof skills[0] === 'string') {
    content.appendChild(createBlock('div', 'skills-row', (skills as string[]).join(' · ')))
  } else {
    ;(skills as SkillCategory[]).forEach((category) => {
      const group = createBlock('div', 'skill-category')
      group.appendChild(createBlock('div', 'skill-category-title', category.category))
      group.appendChild(createBlock('div', 'skill-category-list', category.skills.join(' · ')))
      content.appendChild(group)
    })
  }
  section.appendChild(content)
  return section
}

export function renderResume(data: ResumeData, container: HTMLElement, config: ResumeLayoutConfig = DEFAULT_LAYOUT_CONFIG): void {
  container.innerHTML = ''
  container.classList.add('resume-container')
  container.style.padding = `${config.marginTop}px ${config.marginRight}px ${config.marginBottom}px ${config.marginLeft}px`
  container.style.maxWidth = `${config.pageWidth}px`
  container.style.boxSizing = 'border-box'

  const { personal, summary, experience, education, skills } = data

  const header = createBlock('header', 'resume-header')
  const nameElement = createBlock('div', 'resume-name', personal.name)
  nameElement.style.font = config.nameFont
  header.appendChild(nameElement)

  if (personal.title) {
    const titleElement = createBlock('div', 'resume-title', personal.title)
    titleElement.style.font = config.subsectionFont
    header.appendChild(titleElement)
  }

  const contactLine = buildContactLine(personal)
  if (contactLine) {
    const contactElement = createBlock('div', 'resume-contact', contactLine)
    contactElement.style.font = config.bodyFont
    header.appendChild(contactElement)
  }

  container.appendChild(header)

  if (summary) {
    const summarySection = createSection('Professional Summary')
    summarySection.appendChild(createParagraph(summary, config.bodyFont, config.pageWidth - config.marginLeft - config.marginRight, config.lineHeight, 'resume-summary'))
    container.appendChild(summarySection)
  }

  if (experience?.length) {
    const experienceSection = createSection('Experience')
    experience.forEach((item) => {
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
      experienceSection.appendChild(createEntry(heading, item.location, meta, item.highlights, config))
    })
    container.appendChild(experienceSection)
  }

  if (education?.length) {
    const educationSection = createSection('Education')
    education.forEach((item) => {
      const heading = `${item.degree} · ${item.institution}`
      const metaParts: string[] = []
      if (item.startDate) {
        metaParts.push(item.startDate)
        if (item.endDate) metaParts.push(item.endDate)
      }
      if (item.gpa) metaParts.push(`GPA ${item.gpa}`)
      const meta = metaParts.length ? metaParts.join(' • ') : undefined
      educationSection.appendChild(createEntry(heading, item.location, meta, item.highlights, config))
    })
    container.appendChild(educationSection)
  }

  if (skills?.length) {
    container.appendChild(createSkillSection(skills, config))
  }
}

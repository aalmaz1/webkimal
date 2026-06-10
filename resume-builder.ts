/**
 * Resume Builder for Pretext Engine
 * 
 * This module provides a function to render resume data using the Pretext layout engine.
 * It maps structured resume JSON data into Pretext layout elements.
 */

import {
  prepareWithSegments,
  layoutWithLines,
  walkLineRanges,
  materializeLineRange,
  type PreparedTextWithSegments,
  type LayoutLine,
  type PrepareOptions,
} from '@chenglou/pretext'

// ============================================================================
// Resume Data Types
// ============================================================================

export type ContactInfo = {
  email?: string
  phone?: string
  location?: string
  website?: string
  linkedin?: string
  github?: string
}

export type EducationEntry = {
  institution: string
  degree: string
  location?: string
  startDate?: string
  endDate?: string
  gpa?: string
  highlights?: string[]
}

export type ExperienceEntry = {
  company: string
  position: string
  location?: string
  startDate?: string
  endDate?: string
  current?: boolean
  highlights?: string[]
}

export type ResumeData = {
  name: string
  contact: ContactInfo
  education: EducationEntry[]
  experience: ExperienceEntry[]
  skills?: string[]
  summary?: string
}

// ============================================================================
// Layout Configuration
// ============================================================================

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
}

export const DEFAULT_LAYOUT_CONFIG: ResumeLayoutConfig = {
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
}

// ============================================================================
// Internal Layout Elements
// ============================================================================

type LayoutElement =
  | { type: 'name'; text: string }
  | { type: 'contact'; items: string[] }
  | { type: 'sectionTitle'; text: string }
  | { type: 'entry'; heading: string; subheading?: string; meta?: string; highlights?: string[] }
  | { type: 'spacer'; height: number }

type PreparedElement = {
  prepared: PreparedTextWithSegments
  height: number
  type: LayoutElement['type']
}

type PositionedBlock = {
  x: number
  y: number
  width: number
  lines: LayoutLine[]
  type: LayoutElement['type']
}

// ============================================================================
// Helper Functions
// ============================================================================

function prepareText(text: string, font: string): PreparedTextWithSegments {
  return prepareWithSegments(text, font)
}

function measureTextHeight(prepared: PreparedTextWithSegments, maxWidth: number, lineHeight: number): number {
  const result = layoutWithLines(prepared, maxWidth, lineHeight)
  return result.height
}

function formatContactItem(key: string, value: string): string {
  const labels: Record<string, string> = {
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
  }
  
  // For URLs, strip protocol for cleaner display
  let displayValue = value
  if (key === 'website' || key === 'linkedin' || key === 'github') {
    displayValue = value.replace(/^https?:\/\//, '').replace(/^www\./, '')
    if (key === 'linkedin') {
      displayValue = displayValue.replace(/^linkedin\.com\/in\//, '')
    } else if (key === 'github') {
      displayValue = displayValue.replace(/^github\.com\//, '')
    }
  }
  
  return displayValue
}

function buildContactLine(contact: ContactInfo): string {
  const items: string[] = []
  
  if (contact.email) items.push(formatContactItem('email', contact.email))
  if (contact.phone) items.push(formatContactItem('phone', contact.phone))
  if (contact.location) items.push(formatContactItem('location', contact.location))
  
  const separator = ' | '
  return items.join(separator)
}

function buildExperienceHeading(entry: ExperienceEntry): string {
  let heading = entry.position
  if (entry.company) {
    heading += ` at ${entry.company}`
  }
  return heading
}

function buildExperienceMeta(entry: ExperienceEntry): string {
  const parts: string[] = []
  
  if (entry.location) {
    parts.push(entry.location)
  }
  
  let dateRange = ''
  if (entry.startDate) {
    dateRange = entry.startDate
    if (entry.current) {
      dateRange += ' – Present'
    } else if (entry.endDate) {
      dateRange += ` – ${entry.endDate}`
    }
  }
  
  if (dateRange) {
    parts.push(dateRange)
  }
  
  return parts.join(' • ')
}

function buildEducationHeading(entry: EducationEntry): string {
  let heading = entry.degree
  if (entry.institution) {
    heading += ` — ${entry.institution}`
  }
  return heading
}

function buildEducationMeta(entry: EducationEntry): string {
  const parts: string[] = []
  
  if (entry.location) {
    parts.push(entry.location)
  }
  
  let dateRange = ''
  if (entry.startDate) {
    dateRange = entry.startDate
    if (entry.endDate) {
      dateRange += ` – ${entry.endDate}`
    }
  }
  
  if (dateRange) {
    parts.push(dateRange)
  }
  
  if (entry.gpa) {
    parts.push(`GPA: ${entry.gpa}`)
  }
  
  return parts.join(' • ')
}

// ============================================================================
// Main Render Function
// ============================================================================

/**
 * Renders resume data into positioned layout blocks using the Pretext engine.
 * 
 * @param data - The resume data object containing name, contact, education, and experience
 * @param config - Optional layout configuration (defaults to DEFAULT_LAYOUT_CONFIG)
 * @returns An array of positioned blocks with line information for rendering
 */
export function renderResume(
  data: ResumeData,
  config: ResumeLayoutConfig = DEFAULT_LAYOUT_CONFIG,
): PositionedBlock[] {
  const contentWidth = config.pageWidth - config.marginLeft - config.marginRight
  const blocks: PositionedBlock[] = []
  let currentY = config.marginTop
  
  // Helper to add a block
  function addBlock(element: LayoutElement, font: string): void {
    let text = ''
    
    switch (element.type) {
      case 'name':
        text = element.text
        break
      case 'contact':
        text = element.items.join(' | ')
        break
      case 'sectionTitle':
        text = element.text.toUpperCase()
        break
      case 'entry':
        text = element.heading
        if (element.subheading) {
          text = `${element.heading} — ${element.subheading}`
        }
        break
      case 'spacer':
        // Spacers don't need text preparation
        currentY += element.height
        return
    }
    
    const prepared = prepareText(text, font)
    const linesResult = layoutWithLines(prepared, contentWidth, config.lineHeight)
    
    blocks.push({
      x: config.marginLeft,
      y: currentY,
      width: contentWidth,
      lines: linesResult.lines,
      type: element.type,
    })
    
    currentY += linesResult.height
  }
  
  // Helper to add highlights (bullet points)
  function addHighlights(highlights: string[]): void {
    for (const highlight of highlights) {
      const text = `• ${highlight}`
      const prepared = prepareText(text, config.bodyFont)
      const linesResult = layoutWithLines(prepared, contentWidth - config.highlightIndent, config.lineHeight)
      
      // Indent highlights
      const indentedLines = linesResult.lines.map(line => ({
        ...line,
        start: line.start,
        end: line.end,
      }))
      
      blocks.push({
        x: config.marginLeft + config.highlightIndent,
        y: currentY,
        width: contentWidth - config.highlightIndent,
        lines: indentedLines,
        type: 'entry',
      })
      
      currentY += linesResult.height
    }
  }
  
  // 1. Name
  addBlock({ type: 'name', text: data.name }, config.nameFont)
  currentY += 4 // Extra spacing after name
  
  // 2. Contact Info
  const contactItems: string[] = []
  if (data.contact.email) contactItems.push(formatContactItem('email', data.contact.email))
  if (data.contact.phone) contactItems.push(formatContactItem('phone', data.contact.phone))
  if (data.contact.location) contactItems.push(formatContactItem('location', data.contact.location))
  
  const secondaryContactItems: string[] = []
  if (data.contact.website) secondaryContactItems.push(formatContactItem('website', data.contact.website))
  if (data.contact.linkedin) secondaryContactItems.push(formatContactItem('linkedin', data.contact.linkedin))
  if (data.contact.github) secondaryContactItems.push(formatContactItem('github', data.contact.github))
  
  if (contactItems.length > 0) {
    addBlock({ type: 'contact', items: contactItems }, config.bodyFont)
  }
  
  if (secondaryContactItems.length > 0) {
    addBlock({ type: 'contact', items: secondaryContactItems }, config.bodyFont)
  }
  
  currentY += config.sectionSpacing
  
  // 3. Summary (optional)
  if (data.summary) {
    addBlock({ type: 'entry', heading: data.summary }, config.bodyFont)
    currentY += config.sectionSpacing
  }
  
  // 4. Experience
  if (data.experience && data.experience.length > 0) {
    addBlock({ type: 'sectionTitle', text: 'Experience' }, config.sectionTitleFont)
    currentY += config.entrySpacing
    
    for (const exp of data.experience) {
      const heading = exp.position
      const subheading = exp.company
      const meta = buildExperienceMeta(exp)
      
      // Create combined heading line
      let headingText = heading
      if (subheading) {
        headingText = `${heading} — ${subheading}`
      }
      
      addBlock({ type: 'entry', heading: headingText, meta }, config.subsectionFont)
      
      if (exp.highlights && exp.highlights.length > 0) {
        addHighlights(exp.highlights)
      }
      
      currentY += config.entrySpacing
    }
    
    currentY += config.sectionSpacing - config.entrySpacing
  }
  
  // 5. Education
  if (data.education && data.education.length > 0) {
    addBlock({ type: 'sectionTitle', text: 'Education' }, config.sectionTitleFont)
    currentY += config.entrySpacing
    
    for (const edu of data.education) {
      const heading = edu.degree
      const subheading = edu.institution
      const meta = buildEducationMeta(edu)
      
      let headingText = heading
      if (subheading) {
        headingText = `${heading} — ${subheading}`
      }
      
      addBlock({ type: 'entry', heading: headingText, meta }, config.subsectionFont)
      
      if (edu.highlights && edu.highlights.length > 0) {
        addHighlights(edu.highlights)
      }
      
      currentY += config.entrySpacing
    }
    
    currentY += config.sectionSpacing - config.entrySpacing
  }
  
  // 6. Skills (optional)
  if (data.skills && data.skills.length > 0) {
    addBlock({ type: 'sectionTitle', text: 'Skills' }, config.sectionTitleFont)
    currentY += config.entrySpacing
    
    const skillsText = data.skills.join(' • ')
    addBlock({ type: 'entry', heading: skillsText }, config.bodyFont)
  }
  
  return blocks
}

// ============================================================================
// Alternative: Streaming API for Large Resumes
// ============================================================================

/**
 * Callback type for streaming resume rendering
 */
export type BlockCallback = (block: PositionedBlock) => void

/**
 * Renders resume data with a streaming callback API.
 * Useful for progressively rendering large resumes or integrating with virtual scrolling.
 * 
 * @param data - The resume data object
 * @param callback - Called for each positioned block
 * @param config - Optional layout configuration
 */
export function renderResumeStreaming(
  data: ResumeData,
  callback: BlockCallback,
  config: ResumeLayoutConfig = DEFAULT_LAYOUT_CONFIG,
): void {
  const contentWidth = config.pageWidth - config.marginLeft - config.marginRight
  let currentY = config.marginTop
  
  function emitBlock(element: LayoutElement, font: string): void {
    let text = ''
    
    switch (element.type) {
      case 'name':
        text = element.text
        break
      case 'contact':
        text = element.items.join(' | ')
        break
      case 'sectionTitle':
        text = element.text.toUpperCase()
        break
      case 'entry':
        text = element.heading
        if (element.subheading) {
          text = `${element.heading} — ${element.subheading}`
        }
        break
      case 'spacer':
        currentY += element.height
        return
    }
    
    const prepared = prepareText(text, font)
    const linesResult = layoutWithLines(prepared, contentWidth, config.lineHeight)
    
    callback({
      x: config.marginLeft,
      y: currentY,
      width: contentWidth,
      lines: linesResult.lines,
      type: element.type,
    })
    
    currentY += linesResult.height
  }
  
  function emitHighlights(highlights: string[]): void {
    for (const highlight of highlights) {
      const text = `• ${highlight}`
      const prepared = prepareText(text, config.bodyFont)
      const linesResult = layoutWithLines(prepared, contentWidth - config.highlightIndent, config.lineHeight)
      
      callback({
        x: config.marginLeft + config.highlightIndent,
        y: currentY,
        width: contentWidth - config.highlightIndent,
        lines: linesResult.lines,
        type: 'entry',
      })
      
      currentY += linesResult.height
    }
  }
  
  // Name
  emitBlock({ type: 'name', text: data.name }, config.nameFont)
  currentY += 4
  
  // Contact
  const contactItems: string[] = []
  if (data.contact.email) contactItems.push(formatContactItem('email', data.contact.email))
  if (data.contact.phone) contactItems.push(formatContactItem('phone', data.contact.phone))
  if (data.contact.location) contactItems.push(formatContactItem('location', data.contact.location))
  
  const secondaryContactItems: string[] = []
  if (data.contact.website) secondaryContactItems.push(formatContactItem('website', data.contact.website))
  if (data.contact.linkedin) secondaryContactItems.push(formatContactItem('linkedin', data.contact.linkedin))
  if (data.contact.github) secondaryContactItems.push(formatContactItem('github', data.contact.github))
  
  if (contactItems.length > 0) {
    emitBlock({ type: 'contact', items: contactItems }, config.bodyFont)
  }
  
  if (secondaryContactItems.length > 0) {
    emitBlock({ type: 'contact', items: secondaryContactItems }, config.bodyFont)
  }
  
  currentY += config.sectionSpacing
  
  // Summary
  if (data.summary) {
    emitBlock({ type: 'entry', heading: data.summary }, config.bodyFont)
    currentY += config.sectionSpacing
  }
  
  // Experience
  if (data.experience && data.experience.length > 0) {
    emitBlock({ type: 'sectionTitle', text: 'Experience' }, config.sectionTitleFont)
    currentY += config.entrySpacing
    
    for (const exp of data.experience) {
      let headingText = exp.position
      if (exp.company) {
        headingText = `${exp.position} — ${exp.company}`
      }
      
      const meta = buildExperienceMeta(exp)
      emitBlock({ type: 'entry', heading: headingText, meta }, config.subsectionFont)
      
      if (exp.highlights && exp.highlights.length > 0) {
        emitHighlights(exp.highlights)
      }
      
      currentY += config.entrySpacing
    }
    
    currentY += config.sectionSpacing - config.entrySpacing
  }
  
  // Education
  if (data.education && data.education.length > 0) {
    emitBlock({ type: 'sectionTitle', text: 'Education' }, config.sectionTitleFont)
    currentY += config.entrySpacing
    
    for (const edu of data.education) {
      let headingText = edu.degree
      if (edu.institution) {
        headingText = `${edu.degree} — ${edu.institution}`
      }
      
      const meta = buildEducationMeta(edu)
      emitBlock({ type: 'entry', heading: headingText, meta }, config.subsectionFont)
      
      if (edu.highlights && edu.highlights.length > 0) {
        emitHighlights(edu.highlights)
      }
      
      currentY += config.entrySpacing
    }
    
    currentY += config.sectionSpacing - config.entrySpacing
  }
  
  // Skills
  if (data.skills && data.skills.length > 0) {
    emitBlock({ type: 'sectionTitle', text: 'Skills' }, config.sectionTitleFont)
    currentY += config.entrySpacing
    
    const skillsText = data.skills.join(' • ')
    emitBlock({ type: 'entry', heading: skillsText }, config.bodyFont)
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Calculates the total height required for the resume
 */
export function calculateResumeHeight(
  data: ResumeData,
  config: ResumeLayoutConfig = DEFAULT_LAYOUT_CONFIG,
): number {
  const blocks = renderResume(data, config)
  if (blocks.length === 0) return 0
  
  const lastBlock = blocks[blocks.length - 1]!
  const lastLine = lastBlock.lines[lastBlock.lines.length - 1]
  if (!lastLine) return 0
  
  return lastBlock.y + config.lineHeight
}

/**
 * Validates resume data structure
 */
export function validateResumeData(data: unknown): data is ResumeData {
  if (!data || typeof data !== 'object') return false
  
  const obj = data as Record<string, unknown>
  
  if (typeof obj.name !== 'string' || !obj.name.trim()) return false
  if (typeof obj.contact !== 'object' || obj.contact === null) return false
  if (!Array.isArray(obj.education)) return false
  if (!Array.isArray(obj.experience)) return false
  
  const contact = obj.contact as Record<string, unknown>
  for (const key of ['email', 'phone', 'location', 'website', 'linkedin', 'github']) {
    if (key in contact && typeof contact[key] !== 'string') return false
  }
  
  for (const edu of obj.education) {
    if (!edu || typeof edu !== 'object') return false
    const e = edu as Record<string, unknown>
    if (typeof e.institution !== 'string' || typeof e.degree !== 'string') return false
  }
  
  for (const exp of obj.experience) {
    if (!exp || typeof exp !== 'object') return false
    const e = exp as Record<string, unknown>
    if (typeof e.company !== 'string' || typeof e.position !== 'string') return false
  }
  
  return true
}

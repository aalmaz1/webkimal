export type SkillCategory = {
  category: string
  skills: string[]
}

export type Skills = string[] | SkillCategory[]

/**
 * TimeBoundedEntity represents an entity with a time period (start/end dates).
 * Used for both education and experience entries as an alternative schema.
 */
export interface TimeBoundedEntity {
  institution?: string      // For education
  company?: string          // For experience
  role?: string             // For experience
  degree?: string           // For education
  period: {
    start: string
    end?: string
  }
  description: string[]     // Array of bullet point strings
}

export interface PersonalDetails {
  name: string
  title: string
  email: string
  phone: string
  location: string
  linkedin?: string
  github?: string
}

export interface ExperienceItem {
  company: string
  role: string
  startDate?: string
  endDate?: string
  current?: boolean
  location?: string
  description?: string
  highlights?: string[]
}

export interface EducationItem {
  institution: string
  degree: string
  startDate?: string
  endDate?: string
  location?: string
  description?: string
  gpa?: string
  highlights?: string[]
}

export interface ResumeData {
  personal: PersonalDetails
  summary?: string
  education?: EducationItem[]
  experience?: ExperienceItem[]
  skills?: Skills
}

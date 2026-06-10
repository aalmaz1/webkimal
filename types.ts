export type SkillCategory = {
  category: string
  skills: string[]
}

export type Skills = string[] | SkillCategory[]

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
  highlights?: string[]
}

export interface ResumeData {
  personal: PersonalDetails
  summary?: string
  experience?: ExperienceItem[]
  education?: EducationItem[]
  skills?: Skills
}

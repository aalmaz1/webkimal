import { renderResume, buildThemeLayoutConfig } from './resume-builder.js'
import { ThemeSwitcher, type ResumeThemeName } from './resume-themes.js'
import { printResume } from './print-utils.js'
import type { ResumeData } from './types.js'

const sampleResumeData: ResumeData = {
  personal: {
    name: 'Alex Johnson',
    title: 'Senior Software Engineer',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/alexjohnson',
    github: 'https://github.com/alexjohnson',
  },
  summary:
    'Senior Software Engineer with 8+ years of experience in full-stack development. Specialized in building scalable web applications using modern TypeScript practices and cloud infrastructure. Proven track record of leading engineering teams and delivering polished products.',
  experience: [
    {
      company: 'Tech Innovations Inc.',
      role: 'Senior Frontend Engineer',
      startDate: '2020-03',
      endDate: undefined,
      current: true,
      location: 'San Francisco, CA',
      highlights: [
        'Led migration of legacy codebase to modern, accessible frontend architecture.',
        'Architected reusable UI systems adopted across 15+ product teams.',
        'Mentored engineers through design reviews and rollout strategies.',
      ],
    },
    {
      company: 'Digital Solutions LLC',
      role: 'Full Stack Developer',
      startDate: '2017-06',
      endDate: '2020-02',
      current: false,
      location: 'Oakland, CA',
      highlights: [
        'Built RESTful APIs serving 1M+ daily requests.',
        'Reduced deployment cycle time by 60% through CI/CD automation.',
        'Collaborated with cross-functional product teams on UX redesigns.',
      ],
    },
    {
      company: 'StartUp Hub',
      role: 'Junior Developer',
      startDate: '2015-08',
      endDate: '2017-05',
      current: false,
      location: 'Berkeley, CA',
      highlights: [
        'Developed responsive web applications using Vue.js and Node.js.',
        'Optimized database queries to improve application performance.',
      ],
    },
  ],
  education: [
    {
      institution: 'University of California, Berkeley',
      degree: 'B.S. in Computer Science',
      startDate: '2011-09',
      endDate: '2015-05',
      location: 'Berkeley, CA',
      highlights: [
        "Dean's List all semesters",
        'President of Coding Club',
        'Capstone project: AI-powered code reviewer',
      ],
    },
  ],
  skills: [
    'TypeScript',
    'React',
    'Node.js',
    'Python',
    'AWS',
    'Docker',
    'GraphQL',
    'PostgreSQL',
    'Redis',
    'Git',
  ],
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('resume-container')
  if (!container) {
    console.error('Resume container is missing from the page.')
    return
  }

  const themeSwitcher = new ThemeSwitcher(document.body)
  themeSwitcher.initialize('classic')

  const themeSelect = document.getElementById('theme-select') as HTMLSelectElement | null
  if (themeSelect) {
    themeSelect.value = themeSwitcher.getTheme()
    themeSelect.addEventListener('change', (event) => {
      const selectedTheme = (event.target as HTMLSelectElement).value as ResumeThemeName
      themeSwitcher.switchTheme(selectedTheme)
      renderCurrentResume()
    })
  }

  const toggleButton = document.getElementById('toggle-theme-btn')
  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      themeSwitcher.toggleTheme()
      if (themeSelect) {
        themeSelect.value = themeSwitcher.getTheme()
      }
      renderCurrentResume()
    })
  }

  const printButton = document.getElementById('print-btn')
  if (printButton) {
    printButton.addEventListener('click', () => {
      printResume()
    })
  }

  const renderCurrentResume = (): void => {
    const themeConfig = themeSwitcher.getThemeConfig()
    const layoutConfig = buildThemeLayoutConfig(themeConfig)
    renderResume(sampleResumeData, container, layoutConfig)
  }

  renderCurrentResume()

  document.body.addEventListener('themeChanged', () => {
    renderCurrentResume()
  })
})

# Pretext Resume Builder

A professional resume builder powered by the Pretext layout engine, featuring dynamic theme switching and print-to-PDF capabilities.

## Features

- **JSON-based Resume Data**: Define your resume using a simple JSON structure
- **Pretext Layout Engine**: High-quality typography and text layout
- **Theme Switching**: Toggle between Professional, Creative, and Minimalist styles
- **Print-to-PDF**: Generate perfectly formatted PDFs optimized for A4 paper

## Installation

```bash
npm install @chenglou/pretext
```

## Quick Start

### 1. Import the Modules

```typescript
import { renderResume, type ResumeData } from './resume-builder'
import { createThemeSwitcher, THEME_CONFIGS } from './resume-themes'
import { printResume, initializePrintSupport } from './resume-print'
```

### 2. Initialize Print Support (once at startup)

```typescript
// Call this during application initialization
initializePrintSupport()
```

### 3. Create Your Resume Data

```typescript
const resumeData: ResumeData = {
  name: 'Jane Doe',
  contact: {
    email: 'jane.doe@email.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    website: 'janedoe.dev',
    linkedin: 'linkedin.com/in/janedoe',
    github: 'github.com/janedoe'
  },
  summary: 'Experienced software engineer with 5+ years of building scalable web applications.',
  experience: [
    {
      company: 'Tech Corp',
      position: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2021-01',
      current: true,
      highlights: [
        'Led development of microservices architecture serving 1M+ users',
        'Reduced API response time by 40% through optimization',
        'Mentored team of 4 junior developers'
      ]
    },
    {
      company: 'StartupXYZ',
      position: 'Software Engineer',
      location: 'Remote',
      startDate: '2019-03',
      endDate: '2020-12',
      highlights: [
        'Built real-time dashboard using React and WebSocket',
        'Implemented CI/CD pipeline reducing deployment time by 60%'
      ]
    }
  ],
  education: [
    {
      institution: 'University of California, Berkeley',
      degree: 'B.S. Computer Science',
      location: 'Berkeley, CA',
      startDate: '2015-08',
      endDate: '2019-05',
      gpa: '3.8'
    }
  ],
  skills: ['TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker']
}
```

### 4. Set Up Theme Switcher

```typescript
// Create theme switcher instance
const themeSwitcher = createThemeSwitcher(
  document.getElementById('resume-container'),
  'professional' // initial theme
)

// Subscribe to theme changes
themeSwitcher.onThemeChange((theme) => {
  console.log(`Theme changed to: ${theme}`)
  // Re-render resume with new theme if needed
})

// Switch themes programmatically
themeSwitcher.switchTheme('creative')
themeSwitcher.togglePrimaryThemes() // Toggle between professional/creative
themeSwitcher.cycleTheme() // Cycle through all themes
```

### 5. Render the Resume

```typescript
// Basic rendering with default theme
const blocks = renderResume(resumeData)

// Render with specific theme
const creativeBlocks = renderResume(resumeData, { 
  theme: 'creative' 
})

// Render with custom theme configuration
const customBlocks = renderResume(resumeData, {
  ...DEFAULT_LAYOUT_CONFIG,
  themeConfig: {
    ...THEME_CONFIGS.professional,
    accentColor: '#10b981',
    sectionSpacing: 28
  }
})
```

### 6. Print to PDF

```typescript
// Basic print
printResume()

// Print with callbacks
printResume({
  onBeforePrint: () => console.log('Preparing print...'),
  onAfterPrint: () => console.log('Print completed')
})

// Print with specific theme
printResume({ theme: 'professional' })

// Print with container reference
printResume({ 
  container: '#resume-container',
  theme: 'creative'
})
```

## Module Reference

### resume-builder.ts

| Function | Description |
|----------|-------------|
| `renderResume(data, config)` | Renders resume data to positioned blocks |
| `renderResumeStreaming(data, callback, config)` | Streaming API for large resumes |
| `buildThemeLayoutConfig(themeConfig, baseConfig)` | Convert theme config to layout config |

### resume-themes.ts

| Function/Class | Description |
|----------------|-------------|
| `createThemeSwitcher(container, initialTheme)` | Create initialized theme switcher |
| `ThemeSwitcher` | Class for managing theme state |
| `injectThemeStyles()` | Inject CSS variables into document |
| `applyTheme(themeName, container)` | Apply theme to container |
| `THEME_CONFIGS` | Predefined theme configurations |

### resume-print.ts

| Function | Description |
|----------|-------------|
| `printResume(options)` | Trigger browser print dialog |
| `initializePrintSupport()` | Initialize print styles (call once) |
| `setPrintPreviewMode(enable, container)` | Toggle print preview mode |
| `createPrintReadyClone(container, theme)` | Create print-ready clone |

## CSS Classes

Add these classes to your HTML elements for proper styling:

```html
<!-- Main resume container -->
<div id="resume-container" class="resume-container resume-theme-professional">
  <!-- Resume content rendered here -->
</div>

<!-- Theme switcher UI (hidden during print) -->
<div class="theme-switcher">
  <button onclick="themeSwitcher.switchTheme('professional')">Professional</button>
  <button onclick="themeSwitcher.switchTheme('creative')">Creative</button>
  <button onclick="themeSwitcher.switchTheme('minimalist')">Minimalist</button>
  <button onclick="printResume()">🖨️ Print PDF</button>
</div>
```

## Print Optimization

The `@media print` styles automatically:

- Hide theme switcher, navigation, and UI controls
- Set A4 page size with appropriate margins
- Preserve theme colors and backgrounds
- Prevent awkward page breaks within sections
- Center and scale content properly

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- For best PDF results, use "Save as PDF" or Chrome's built-in PDF printer

## License

MIT
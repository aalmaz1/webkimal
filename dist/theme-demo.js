/**
 * Theme Switcher Demo for Resume Builder
 *
 * Demonstrates how to use the ThemeSwitcher class with the refactored
 * 2-parameter renderResume(data, container) API.
 */
import { renderResume } from './resume-builder.js';
import { createThemeSwitcher } from './resume-themes.js';
// ============================================================================
// Sample Resume Data
// ============================================================================
export const sampleResume = {
    personal: {
        name: 'Alex Johnson',
        title: 'Software Engineer',
        email: 'alex.johnson@email.com',
        phone: '(555) 123-4567',
        location: 'San Francisco, CA',
        linkedin: 'https://linkedin.com/in/alexjohnson',
        github: 'https://github.com/alexjohnson',
    },
    summary: 'Full-stack developer with 8+ years of experience building scalable web applications and leading engineering teams.',
    experience: [
        {
            company: 'TechCorp Inc.',
            role: 'Senior Software Engineer',
            location: 'San Francisco, CA',
            startDate: '2020-01',
            current: true,
            highlights: [
                'Led migration of monolithic architecture to microservices, reducing deployment time by 60%',
                'Mentored team of 5 junior developers, conducting code reviews and career development sessions',
                'Implemented CI/CD pipeline that reduced production bugs by 40%',
            ],
        },
        {
            company: 'StartupXYZ',
            role: 'Software Engineer',
            location: 'San Francisco, CA',
            startDate: '2017-06',
            endDate: '2019-12',
            highlights: [
                'Built real-time analytics dashboard serving 100K+ daily active users',
                'Optimized database queries reducing API response time by 50%',
                'Collaborated with design team to implement responsive UI components',
            ],
        },
    ],
    education: [
        {
            institution: 'University of California, Berkeley',
            degree: 'B.S. Computer Science',
            location: 'Berkeley, CA',
            startDate: '2013-09',
            endDate: '2017-05',
            gpa: '3.8',
            highlights: [
                'Dean\'s List all semesters',
                'Teaching Assistant for Data Structures course',
            ],
        },
    ],
    skills: [
        'TypeScript',
        'React',
        'Node.js',
        'Python',
        'PostgreSQL',
        'AWS',
        'Docker',
        'GraphQL',
    ],
};
// ============================================================================
// Demo: Basic Theme Switching
// ============================================================================
/**
 * Demonstrates theme switching with a container element.
 * Creates a ThemeSwitcher, renders the resume, and cycles themes.
 */
export function demoThemeSwitching(container) {
    const target = container || (typeof document !== 'undefined' ? document.createElement('div') : null);
    if (!target) {
        console.log('Theme demo requires a DOM environment');
        return;
    }
    const switcher = createThemeSwitcher(target);
    const unsubscribe = switcher.onThemeChange((theme) => {
        console.log(`Theme changed to: ${theme}`);
    });
    renderResume(sampleResume, target);
    console.log(`Rendered resume with ${switcher.getTheme()} theme`);
    // Cycle through all themes
    switcher.switchTheme('modern');
    renderResume(sampleResume, target);
    console.log(`Rendered resume with modern theme`);
    switcher.cycleTheme();
    renderResume(sampleResume, target);
    console.log(`Current theme: ${switcher.getTheme()}`);
    unsubscribe();
}
// ============================================================================
// Demo: Framework-style Viewer Component
// ============================================================================
/**
 * Example class for framework integration (React, Vue, etc.)
 * Uses the refactored 2-parameter renderResume API.
 */
export class ResumeViewerWithTheme {
    constructor(containerId) {
        this.container = null;
        this.currentData = null;
        if (typeof document !== 'undefined' && containerId) {
            this.container = document.getElementById(containerId);
        }
        this.switcher = createThemeSwitcher(this.container || undefined);
    }
    /**
     * Set resume data and render with current theme
     */
    setResumeData(data) {
        this.currentData = data;
        this.render();
    }
    /**
     * Switch theme and re-render
     */
    switchTheme(theme) {
        this.switcher.switchTheme(theme);
        this.render();
    }
    /**
     * Toggle between Classic and Modern
     */
    toggleTheme() {
        this.switcher.togglePrimaryThemes();
        this.render();
    }
    /**
     * Render data to DOM using 2-parameter API
     */
    render() {
        if (!this.container || !this.currentData) {
            console.log('Cannot render resume: missing container or data');
            return;
        }
        renderResume(this.currentData, this.container);
        console.log(`Rendered resume with ${this.switcher.getTheme()} theme`);
    }
    getCurrentTheme() {
        return this.switcher.getTheme();
    }
    onThemeChange(callback) {
        return this.switcher.onThemeChange(callback);
    }
}
//# sourceMappingURL=theme-demo.js.map
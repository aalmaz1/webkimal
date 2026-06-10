/**
 * Theme Switcher Demo for Resume Builder
 *
 * This example demonstrates how to use the ThemeSwitcher class
 * to dynamically switch between Classic, Modern, and Minimalist themes.
 */
import { renderResume, buildThemeLayoutConfig, DEFAULT_LAYOUT_CONFIG } from './resume-builder.js';
import { createThemeSwitcher, THEME_CONFIGS, } from './resume-themes.js';
// ============================================================================
// Sample Resume Data
// ============================================================================
const sampleResume = {
    name: 'Alex Johnson',
    contact: {
        email: 'alex.johnson@email.com',
        phone: '(555) 123-4567',
        location: 'San Francisco, CA',
        website: 'https://alexjohnson.dev',
        linkedin: 'https://linkedin.com/in/alexjohnson',
        github: 'https://github.com/alexjohnson',
    },
    summary: 'Full-stack developer with 8+ years of experience building scalable web applications and leading engineering teams.',
    experience: [
        {
            company: 'TechCorp Inc.',
            position: 'Senior Software Engineer',
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
            position: 'Software Engineer',
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
// Example 1: Basic Theme Switching with ThemeSwitcher Class
// ============================================================================
export function demoBasicThemeSwitcher() {
    console.log('=== Basic Theme Switcher Demo ===\n');
    // Create theme switcher (auto-initializes with Classic theme)
    const switcher = createThemeSwitcher();
    // Subscribe to theme changes
    const unsubscribe = switcher.onThemeChange((theme) => {
        console.log(`Theme changed to: ${theme}`);
    });
    // Render with current theme
    let blocks = renderResume(sampleResume, {
        ...DEFAULT_LAYOUT_CONFIG,
        theme: switcher.getTheme(),
    });
    console.log(`Rendered ${blocks.length} blocks with ${switcher.getTheme()} theme\n`);
    // Toggle to Modern theme
    switcher.switchTheme('modern');
    blocks = renderResume(sampleResume, {
        ...DEFAULT_LAYOUT_CONFIG,
        theme: 'modern',
    });
    console.log(`Rendered ${blocks.length} blocks with modern theme\n`);
    // Cycle through all themes
    switcher.cycleTheme(); // Now minimalist
    console.log(`Current theme: ${switcher.getTheme()}\n`);
    // Cleanup
    unsubscribe();
}
// ============================================================================
// Example 2: Using Theme Configurations Directly
// ============================================================================
export function demoDirectThemeConfig() {
    console.log('=== Direct Theme Configuration Demo ===\n');
    // Get Modern theme config
    const creativeConfig = THEME_CONFIGS.modern;
    // Build layout config from theme
    const layoutConfig = buildThemeLayoutConfig(creativeConfig);
    console.log('Modern Theme Layout Config:');
    console.log(`  Name Font: ${layoutConfig.nameFont}`);
    console.log(`  Section Spacing: ${layoutConfig.sectionSpacing}px`);
    console.log(`  Entry Spacing: ${layoutConfig.entrySpacing}px`);
    console.log(`  Highlight Indent: ${layoutConfig.highlightIndent}px\n`);
    // Render with theme config
    const blocks = renderResume(sampleResume, layoutConfig);
    console.log(`Rendered ${blocks.length} blocks with direct theme config\n`);
}
// ============================================================================
// Example 3: Dynamic Theme Switching in Rendering Flow
// ============================================================================
export function demoDynamicThemeSwitching() {
    console.log('=== Dynamic Theme Switching Demo ===\n');
    const themes = ['classic', 'modern', 'minimalist'];
    for (const theme of themes) {
        console.log(`Rendering with ${theme.toUpperCase()} theme:`);
        const blocks = renderResume(sampleResume, {
            ...DEFAULT_LAYOUT_CONFIG,
            theme: theme,
        });
        console.log(`  - Total blocks: ${blocks.length}`);
        console.log(`  - First block Y: ${blocks[0]?.y}px`);
        console.log(`  - Last block Y: ${blocks[blocks.length - 1]?.y}px\n`);
    }
}
// ============================================================================
// Example 4: Custom Theme Overrides
// ============================================================================
export function demoCustomThemeOverride() {
    console.log('=== Custom Theme Override Demo ===\n');
    // Start with classic theme
    const baseConfig = THEME_CONFIGS.classic;
    // Override specific properties
    const customConfig = {
        ...baseConfig,
        accentColor: '#10b981', // Emerald green
        sectionSpacing: 28,
        entrySpacing: 16,
        nameFontSize: '32px',
    };
    const layoutConfig = buildThemeLayoutConfig(customConfig);
    console.log('Custom Theme Overrides:');
    console.log(`  Accent Color: ${customConfig.accentColor}`);
    console.log(`  Section Spacing: ${customConfig.sectionSpacing}px`);
    console.log(`  Name Font Size: ${customConfig.nameFontSize}\n`);
    const blocks = renderResume(sampleResume, layoutConfig);
    console.log(`Rendered ${blocks.length} blocks with custom theme\n`);
}
// ============================================================================
// Example 5: Browser-based Theme Switching (for React/Vue/etc.)
// ============================================================================
/**
 * Example hook/component pattern for framework integration
 * This would be used in a browser environment
 */
export class ResumeViewerWithTheme {
    constructor(containerId) {
        this.container = null;
        this.currentBlocks = [];
        if (typeof document !== 'undefined' && containerId) {
            this.container = document.getElementById(containerId);
        }
        this.switcher = createThemeSwitcher(this.container || undefined);
    }
    /**
     * Set resume data and render with current theme
     */
    setResumeData(data) {
        this.currentBlocks = renderResume(data, {
            ...DEFAULT_LAYOUT_CONFIG,
            theme: this.switcher.getTheme(),
        });
        this.render();
    }
    /**
     * Switch theme and re-render
     */
    switchTheme(theme) {
        this.switcher.switchTheme(theme);
        // Re-render with new theme
        this.currentBlocks = renderResume(
        // In real app, you'd store the resume data
        sampleResume, {
            ...DEFAULT_LAYOUT_CONFIG,
            theme: this.switcher.getTheme(),
        });
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
     * Render blocks to DOM (placeholder - actual implementation depends on your rendering pipeline)
     */
    render() {
        console.log(`Rendering ${this.currentBlocks.length} blocks`);
        // In a real implementation, you would:
        // 1. Clear container
        // 2. Create elements for each block
        // 3. Position them based on x/y coordinates
        // 4. Apply CSS variables from current theme
    }
    /**
     * Get current theme
     */
    getCurrentTheme() {
        return this.switcher.getTheme();
    }
    /**
     * Subscribe to theme changes
     */
    onThemeChange(callback) {
        return this.switcher.onThemeChange(callback);
    }
}
// ============================================================================
// Run Demos (Browser-safe environment check)
// ============================================================================
/**
 * Check if running in Node.js environment and execute demos
 * This uses a type-safe approach that works without @types/node
 */
function runDemosIfNode() {
    // Type-safe check for Node.js environment
    const globalObj = typeof globalThis !== 'undefined' ? globalThis : window;
    if (globalObj.process?.versions?.node && globalObj.require?.main === globalObj.module) {
        console.log('Running Resume Theme Switcher Demos\n');
        console.log('='.repeat(50));
        console.log();
        demoBasicThemeSwitcher();
        console.log('='.repeat(50));
        console.log();
        demoDirectThemeConfig();
        console.log('='.repeat(50));
        console.log();
        demoDynamicThemeSwitching();
        console.log('='.repeat(50));
        console.log();
        demoCustomThemeOverride();
        console.log('='.repeat(50));
        console.log();
        console.log('All demos completed!');
    }
}
// Execute if in Node.js
runDemosIfNode();
// Export for use in other modules
export { sampleResume };
//# sourceMappingURL=theme-demo.js.map
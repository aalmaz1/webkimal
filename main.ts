/**
 * Main Entry Point for Pretext-based Interactive Resume Engine
 * 
 * This file demonstrates the integration of:
 * 1. JSON Resume Builder (renderResume)
 * 2. Theme Switcher System
 * 3. Print-to-PDF functionality
 */

// Import types and functions from our modules
// Note: In a real build environment, these would be compiled from separate .ts files
// For this demo, we assume the modules are available or bundled.

import { renderResume, DEFAULT_LAYOUT_CONFIG, buildThemeLayoutConfig, type ResumeLayoutConfig } from './resume-builder';
import { ThemeSwitcher, THEME_CONFIGS, type ResumeThemeName } from './resume-themes';
import { printResume } from './print-utils';

// Sample Resume Data (JSON)
const sampleResumeData = {
    name: "Alex Johnson",
    contact: {
        email: "alex.johnson@example.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        website: "alexjohnson.dev",
        linkedin: "linkedin.com/in/alexjohnson",
        github: "github.com/alexjohnson"
    },
    summary: "Senior Software Engineer with 8+ years of experience in full-stack development. Specialized in building scalable web applications using modern TypeScript frameworks and cloud infrastructure. Proven track record of leading teams and delivering high-impact projects.",
    experience: [
        {
            company: "Tech Innovations Inc.",
            position: "Senior Frontend Engineer",
            startDate: "2020-03",
            endDate: undefined, // Current job
            isCurrent: true,
            highlights: [
                "Led migration of legacy codebase to React/TypeScript, improving performance by 40%",
                "Architected reusable component library used across 15+ products",
                "Mentored team of 5 junior developers and conducted code reviews"
            ]
        },
        {
            company: "Digital Solutions LLC",
            position: "Full Stack Developer",
            startDate: "2017-06",
            endDate: "2020-02",
            isCurrent: false,
            highlights: [
                "Developed RESTful APIs serving 1M+ daily requests",
                "Implemented CI/CD pipelines reducing deployment time by 60%",
                "Collaborated with UX team to redesign core user flows"
            ]
        },
        {
            company: "StartUp Hub",
            position: "Junior Developer",
            startDate: "2015-08",
            endDate: "2017-05",
            isCurrent: false,
            highlights: [
                "Built responsive web applications using Vue.js and Node.js",
                "Optimized database queries reducing load times by 30%"
            ]
        }
    ],
    education: [
        {
            institution: "University of California, Berkeley",
            degree: "B.S. in Computer Science",
            startDate: "2011-09",
            endDate: "2015-05",
            gpa: "3.8/4.0",
            highlights: [
                "Dean's List all semesters",
                "President of Coding Club",
                "Capstone Project: AI-powered code reviewer"
            ]
        }
    ],
    skills: [
        "TypeScript", "React", "Node.js", "Python", "AWS", 
        "Docker", "GraphQL", "PostgreSQL", "Redis", "Git"
    ]
};

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Initializing Pretext Resume Engine...");

    const container = document.getElementById('resume-container');
    if (!container) {
        console.error("Error: Resume container not found!");
        return;
    }

    // 1. Initialize Theme Switcher
    const themeSwitcher = new ThemeSwitcher(container);
    themeSwitcher.initialize('professional');

    // 2. Render Initial Resume
    function renderCurrentResume() {
        const currentTheme = themeSwitcher.getTheme();
        const themeConfig = themeSwitcher.getThemeConfig();
        
        // Build layout config based on current theme
        const layoutConfig = buildThemeLayoutConfig(themeConfig);
        
        // Clear container (null check already done above)
        if (container) container.innerHTML = '';
        
        // Render resume with theme-aware configuration
        try {
            const blocks = renderResume(sampleResumeData, layoutConfig);
            
            // Convert Pretext blocks to DOM elements
            // (In a real Pretext implementation, this would use Pretext's DOM renderer)
            // For demo purposes, we'll simulate the rendering
            blocks.forEach(block => {
                const element = document.createElement('div');
                element.style.position = 'absolute';
                element.style.left = `${block.x}px`;
                element.style.top = `${block.y}px`;
                
                if (block.lines && block.lines.length > 0) {
                    block.lines.forEach(line => {
                        const lineEl = document.createElement('div');
                        lineEl.textContent = line.text || '';
                        // Access font properties from the line object structure
                        const fontInfo = (line as any).font;
                        lineEl.style.fontFamily = fontInfo?.family || 'Arial';
                        lineEl.style.fontSize = `${fontInfo?.size || 12}px`;
                        lineEl.style.fontWeight = fontInfo?.weight || 'normal';
                        lineEl.style.color = (line as any).color || '#000';
                        lineEl.style.lineHeight = `${(line as any).height || layoutConfig.lineHeight}px`;
                        element.appendChild(lineEl);
                    });
                }
                
                if (container) container.appendChild(element);
            });
            
            console.log(`✅ Resume rendered successfully with theme: ${currentTheme}`);
        } catch (error) {
            console.error("❌ Error rendering resume:", error);
            if (container) {
                container.innerHTML = `<p style="color: red; padding: 20px;">Error rendering resume. Check console for details.</p>`;
            }
        }
    }

    // Initial render
    renderCurrentResume();

    // 3. Setup Event Listeners
    
    // Theme selector dropdown
    const themeSelect = document.getElementById('theme-select') as HTMLSelectElement;
    if (themeSelect) {
        themeSelect.value = themeSwitcher.getTheme();
        themeSelect.addEventListener('change', (e) => {
            const newTheme = (e.target as HTMLSelectElement).value as ResumeThemeName;
            themeSwitcher.switchTheme(newTheme);
            renderCurrentResume();
        });
    }

    // Toggle theme button (cycles between Professional and Creative)
    const toggleBtn = document.getElementById('toggle-theme-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            themeSwitcher.togglePrimaryThemes();
            renderCurrentResume();
            
            // Update dropdown to match
            if (themeSelect) {
                themeSelect.value = themeSwitcher.getTheme();
            }
        });
    }

    // Print button
    const printBtn = document.getElementById('print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            console.log("🖨️ Initiating print...");
            printResume();
        });
    }

    // Listen for theme changes (optional logging)
    const unsubscribe = themeSwitcher.onThemeChange((theme: ResumeThemeName) => {
        console.log(`🎨 Theme changed to: ${theme}`);
    });

    console.log("✅ Application initialized successfully!");
    console.log("📋 Features active:");
    console.log("   - JSON Resume Builder (renderResume)");
    console.log("   - Theme Switcher (Professional/Creative/Minimalist)");
    console.log("   - Print-to-PDF (@media print optimization)");

    // Cleanup on page unload (optional)
    window.addEventListener('beforeunload', () => {
        unsubscribe();
    });
});

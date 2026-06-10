import { renderResume } from './resume-builder.js'
import { ThemeSwitcher, type ResumeThemeName } from './resume-themes.js'
import { printResume } from './print-utils.js'
import type { ResumeData } from './types.js'
import { analyzeResume, enhanceBulletPoint, checkATSCompatibility, type ResumeAnalysis } from './ai-utils.js'

// --- State Management ---

interface AppState {
    resumeData: ResumeData;
    layoutSettings: {
        marginX: number;
        marginY: number;
        sectionSpacing: number;
        entrySpacing: number;
        bodySize: number;
        nameSize: number;
        lineHeight: number;
    };
    theme: ResumeThemeName;
}

const DEFAULT_RESUME: ResumeData = {
    personal: {
        name: 'Alex Johnson',
        title: 'Senior Software Engineer',
        email: 'alex.johnson@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        linkedin: 'https://linkedin.com/in/alexjohnson',
        github: 'https://github.com/alexjohnson',
    },
    summary: 'Senior Software Engineer with 8+ years of experience in full-stack development. Specialized in building scalable web applications using modern TypeScript practices and cloud infrastructure. Proven track record of leading engineering teams and delivering polished products.',
    experience: [
        {
            company: 'Tech Innovations Inc.',
            role: 'Senior Frontend Engineer',
            startDate: '2020-03',
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
            ],
        }
    ],
    education: [
        {
            institution: 'University of California, Berkeley',
            degree: 'B.S. in Computer Science',
            startDate: '2011-09',
            endDate: '2015-05',
            location: 'Berkeley, CA',
            highlights: ["Dean's List all semesters"],
        },
    ],
    skills: ['TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'GraphQL', 'PostgreSQL'],
};

const DEFAULT_SETTINGS = {
    marginX: 48,
    marginY: 48,
    sectionSpacing: 24,
    entrySpacing: 14,
    bodySize: 11,
    nameSize: 28,
    lineHeight: 150,
};

let state: AppState = {
    resumeData: JSON.parse(JSON.stringify(DEFAULT_RESUME)),
    layoutSettings: { ...DEFAULT_SETTINGS },
    theme: 'classic',
};

// --- Initialization ---

let themeSwitcher: ThemeSwitcher;

document.addEventListener('DOMContentLoaded', () => {
    loadState();
    initUI();
    updatePreview();
});

function initUI() {
    const container = document.getElementById('resume-container')!;
    themeSwitcher = new ThemeSwitcher(container);
    themeSwitcher.initialize(state.theme);

    // Tab Switching
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            const target = tab.getAttribute('data-tab');
            document.getElementById(`tab-${target}`)?.classList.add('active');
            
            if (target === 'code') {
                updateCodeEditor();
            } else if (target === 'content') {
                syncFormFromState();
            }
        });
    });

    // Theme Selector
    const themeSelect = document.getElementById('theme-select') as HTMLSelectElement;
    themeSelect.value = state.theme;
    themeSelect.addEventListener('change', () => {
        state.theme = themeSelect.value as ResumeThemeName;
        themeSwitcher.switchTheme(state.theme);
        saveState();
        updatePreview();
    });

    // Sliders
    const sliderConfigs = [
        { id: 'margin-x', key: 'marginX', unit: 'px' },
        { id: 'margin-y', key: 'marginY', unit: 'px' },
        { id: 'section-spacing', key: 'sectionSpacing', unit: 'px' },
        { id: 'entry-spacing', key: 'entrySpacing', unit: 'px' },
        { id: 'body-size', key: 'bodySize', unit: 'px' },
        { id: 'name-size', key: 'nameSize', unit: 'px' },
        { id: 'line-height', key: 'lineHeight', unit: '', factor: 100 },
    ];

    sliderConfigs.forEach(s => {
        const slider = document.getElementById(`slider-${s.id}`) as HTMLInputElement;
        const valDisplay = document.getElementById(`val-${s.id}`)!;
        
        // Set initial values
        const currentVal = (state.layoutSettings as any)[s.key];
        slider.value = currentVal.toString();
        valDisplay.textContent = s.factor ? (currentVal / s.factor).toFixed(1) : `${currentVal}${s.unit}`;

        slider.addEventListener('input', () => {
            const val = parseInt(slider.value);
            (state.layoutSettings as any)[s.key] = val;
            valDisplay.textContent = s.factor ? (val / s.factor).toFixed(1) : `${val}${s.unit}`;
            updatePreview();
            saveState();
        });
    });

    // Form Editor Path-based delegation
    const formEditor = document.getElementById('form-editor')!;
    formEditor.addEventListener('input', (e) => {
        const target = e.target as HTMLElement;
        const path = target.getAttribute('data-path');
        if (path) {
            updateDataByPath(path, (target as HTMLInputElement | HTMLTextAreaElement).value);
            updatePreview();
            saveState();
        }
    });

    // Skills handling
    const skillsInput = document.getElementById('skills-input') as HTMLTextAreaElement;
    skillsInput.addEventListener('input', () => {
        state.resumeData.skills = skillsInput.value.split(',').map(s => s.trim()).filter(s => s);
        updatePreview();
        saveState();
    });

    // Add/Remove buttons for Experience/Education
    document.getElementById('add-experience-btn')?.addEventListener('click', () => {
        if (!state.resumeData.experience) state.resumeData.experience = [];
        state.resumeData.experience.push({
            company: 'New Company',
            role: 'Role Name',
            startDate: '2023-01',
            highlights: ['New achievement...']
        });
        renderExperienceList();
        updatePreview();
        saveState();
    });

    document.getElementById('add-education-btn')?.addEventListener('click', () => {
        if (!state.resumeData.education) state.resumeData.education = [];
        state.resumeData.education.push({
            institution: 'University Name',
            degree: 'Degree Name',
            startDate: '2019',
            endDate: '2023'
        });
        renderEducationList();
        updatePreview();
        saveState();
    });

    // Code Editor
    const jsonEditor = document.getElementById('json-editor') as HTMLTextAreaElement;
    const codeTab = document.getElementById('tab-code')!;
    jsonEditor.addEventListener('input', () => {
        try {
            const data = JSON.parse(jsonEditor.value);
            state.resumeData = data;
            codeTab.classList.remove('has-error');
            updatePreview();
            saveState();
        } catch (e) {
            codeTab.classList.add('has-error');
        }
    });

    // Import/Export
    document.getElementById('export-json-btn')?.addEventListener('click', exportJSON);
    document.getElementById('import-json-trigger')?.addEventListener('click', () => {
        document.getElementById('import-json-input')?.click();
    });
    document.getElementById('import-json-input')?.addEventListener('change', importJSON);

    // Auto-fit
    document.getElementById('autofit-btn')?.addEventListener('click', runAutoFit);

    // Feature 4: AI Resume Analysis
    document.getElementById('analyze-resume-btn')?.addEventListener('click', analyzeResumeAction);

    // Feature 5: ATS Compatibility Check
    document.getElementById('check-ats-btn')?.addEventListener('click', checkATSAction);

    // Print
    document.getElementById('print-btn')?.addEventListener('click', () => {
        printResume();
    });

    // AI Modal
    document.getElementById('close-ai-modal')?.addEventListener('click', () => {
        document.getElementById('ai-modal')!.style.display = 'none';
    });

    syncFormFromState();
}

function syncFormFromState() {
    const formInputs = document.querySelectorAll('#form-editor .input-field[data-path]');
    formInputs.forEach(input => {
        const htmlInput = input as HTMLInputElement | HTMLTextAreaElement;
        const path = htmlInput.getAttribute('data-path')!;
        setInputValueFromPath(htmlInput, path);
    });

    const skillsInput = document.getElementById('skills-input') as HTMLTextAreaElement;
    skillsInput.value = Array.isArray(state.resumeData.skills) ? (state.resumeData.skills as string[]).join(', ') : '';

    renderExperienceList();
    renderEducationList();
}

function setInputValueFromPath(input: HTMLInputElement | HTMLTextAreaElement, path: string) {
    const parts = path.split('.');
    let current: any = state.resumeData;
    for (const part of parts) {
        if (current === undefined || current === null || current[part] === undefined) {
            input.value = '';
            return;
        }
        current = current[part];
    }
    input.value = current || '';
}

function updateDataByPath(path: string, value: string) {
    const parts = path.split('.');
    let current: any = state.resumeData;
    for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) current[parts[i]] = {};
        current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
}

function renderExperienceList() {
    const list = document.getElementById('experience-list')!;
    list.innerHTML = '';
    state.resumeData.experience?.forEach((exp, index) => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <div class="list-item-header">
                <span class="list-item-title">${exp.company || 'New Company'}</span>
                <button class="btn btn-danger btn-small remove-exp" data-index="${index}">🗑️</button>
            </div>
            <div class="control-group">
                <input type="text" class="input-field" data-path="experience.${index}.company" value="${exp.company || ''}" placeholder="Company">
            </div>
            <div class="control-group">
                <input type="text" class="input-field" data-path="experience.${index}.role" value="${exp.role || ''}" placeholder="Role">
            </div>
            <div class="actions-grid">
                <input type="text" class="input-field" data-path="experience.${index}.startDate" value="${exp.startDate || ''}" placeholder="Start Date">
                <input type="text" class="input-field" data-path="experience.${index}.endDate" value="${exp.endDate || ''}" placeholder="End Date">
            </div>
            <div class="highlights-list">
                <label style="font-size: 0.75rem; color: var(--text-dim); display: block; margin-top: 12px; margin-bottom: 8px;">Highlights</label>
                <div id="exp-${index}-highlights"></div>
                <button class="btn btn-secondary btn-small btn-block add-h" data-index="${index}">+ Add Bullet</button>
            </div>
        `;
        list.appendChild(item);

        const hList = document.getElementById(`exp-${index}-highlights`)!;
        (exp.highlights || []).forEach((h, hIndex) => {
            const hItem = document.createElement('div');
            hItem.className = 'bullet-point-item';
            hItem.innerHTML = `
                <div style="flex-grow: 1;">
                    <textarea class="input-field" data-path="experience.${index}.highlights.${hIndex}">${h}</textarea>
                    <button class="ai-opt-btn" data-exp-index="${index}" data-h-index="${hIndex}">✨ AI Optimize</button>
                </div>
                <button class="btn btn-danger btn-small remove-h" data-exp-index="${index}" data-h-index="${hIndex}">🗑️</button>
            `;
            hList.appendChild(hItem);
        });
    });

    // Add event listeners for dynamic buttons
    list.querySelectorAll('.remove-exp').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-index')!);
            state.resumeData.experience!.splice(idx, 1);
            renderExperienceList();
            updatePreview();
            saveState();
        });
    });

    list.querySelectorAll('.add-h').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-index')!);
            if (!state.resumeData.experience![idx].highlights) state.resumeData.experience![idx].highlights = [];
            state.resumeData.experience![idx].highlights!.push('New achievement...');
            renderExperienceList();
            updatePreview();
            saveState();
        });
    });

    list.querySelectorAll('.remove-h').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const expIdx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-exp-index')!);
            const hIdx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-h-index')!);
            state.resumeData.experience![expIdx].highlights!.splice(hIdx, 1);
            renderExperienceList();
            updatePreview();
            saveState();
        });
    });

    list.querySelectorAll('.ai-opt-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const expIdx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-exp-index')!);
            const hIdx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-h-index')!);
            openAIModal(expIdx, hIdx);
        });
    });
}

function renderEducationList() {
    const list = document.getElementById('education-list')!;
    list.innerHTML = '';
    state.resumeData.education?.forEach((edu, index) => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <div class="list-item-header">
                <span class="list-item-title">${edu.institution || 'New University'}</span>
                <button class="btn btn-danger btn-small remove-edu" data-index="${index}">🗑️</button>
            </div>
            <div class="control-group">
                <input type="text" class="input-field" data-path="education.${index}.institution" value="${edu.institution || ''}" placeholder="Institution">
            </div>
            <div class="control-group">
                <input type="text" class="input-field" data-path="education.${index}.degree" value="${edu.degree || ''}" placeholder="Degree">
            </div>
            <div class="actions-grid">
                <input type="text" class="input-field" data-path="education.${index}.startDate" value="${edu.startDate || ''}" placeholder="Start Year">
                <input type="text" class="input-field" data-path="education.${index}.endDate" value="${edu.endDate || ''}" placeholder="End Year">
            </div>
        `;
        list.appendChild(item);
    });

    list.querySelectorAll('.remove-edu').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-index')!);
            state.resumeData.education!.splice(idx, 1);
            renderEducationList();
            updatePreview();
            saveState();
        });
    });
}

// --- Preview and Layout logic ---

function updatePreview() {
    const container = document.getElementById('resume-container')!;
    
    // Apply layout settings as CSS variables
    container.style.setProperty('--resume-margin-x', `${state.layoutSettings.marginX}px`);
    container.style.setProperty('--resume-margin-y', `${state.layoutSettings.marginY}px`);
    container.style.setProperty('--resume-section-spacing', `${state.layoutSettings.sectionSpacing}px`);
    container.style.setProperty('--resume-entry-spacing', `${state.layoutSettings.entrySpacing}px`);
    container.style.setProperty('--resume-body-font-size', `${state.layoutSettings.bodySize}px`);
    container.style.setProperty('--resume-name-font-size', `${state.layoutSettings.nameSize}px`);
    container.style.setProperty('--resume-body-line-height', (state.layoutSettings.lineHeight / 100).toString());

    renderResume(state.resumeData, container);
    measureFullness();
}

function measureFullness() {
    const container = document.getElementById('resume-container')!;
    const originalHeightStyle = container.style.height;
    const originalMinHeightStyle = container.style.minHeight;

    container.style.height = 'auto';
    container.style.minHeight = '0px';

    const height = container.offsetHeight;

    container.style.height = originalHeightStyle;
    container.style.minHeight = originalMinHeightStyle;

    const A4_HEIGHT = 1123; // 96 DPI
    const percent = Math.round((height / A4_HEIGHT) * 100);
    
    const usagePercent = document.getElementById('usage-percent')!;
    const usageBar = document.getElementById('usage-bar')!;
    const overflowLine = document.getElementById('overflow-line')!;

    usagePercent.textContent = `${percent}%`;
    usageBar.style.width = `${Math.min(percent, 100)}%`;

    if (height > A4_HEIGHT) {
        usageBar.classList.add('overflow');
        overflowLine.style.display = 'block';
    } else {
        usageBar.classList.remove('overflow');
        overflowLine.style.display = 'none';
    }
}

// --- Binary Search Auto-Fit ---

function runAutoFit() {
    const baseSettings = JSON.parse(JSON.stringify(state.layoutSettings));
    let low = 0.6;
    let high = 1.4;
    let bestScale = 1.0;

    for (let i = 0; i < 12; i++) {
        const mid = (low + high) / 2;
        applyScale(mid, baseSettings);
        
        const container = document.getElementById('resume-container')!;
        
        // Temporarily apply style to measure
        container.style.setProperty('--resume-margin-x', `${state.layoutSettings.marginX}px`);
        container.style.setProperty('--resume-margin-y', `${state.layoutSettings.marginY}px`);
        container.style.setProperty('--resume-section-spacing', `${state.layoutSettings.sectionSpacing}px`);
        container.style.setProperty('--resume-entry-spacing', `${state.layoutSettings.entrySpacing}px`);
        container.style.setProperty('--resume-body-font-size', `${state.layoutSettings.bodySize}px`);
        container.style.setProperty('--resume-name-font-size', `${state.layoutSettings.nameSize}px`);
        
        renderResume(state.resumeData, container);

        const originalHeightStyle = container.style.height;
        container.style.height = 'auto';
        container.style.minHeight = '0px';
        const height = container.offsetHeight;
        container.style.height = originalHeightStyle;

        if (height <= 1123) {
            bestScale = mid;
            low = mid;
        } else {
            high = mid;
        }
    }

    applyScale(bestScale, baseSettings);
    syncSlidersToState();
    updatePreview();
    saveState();
}

function applyScale(scale: number, base: any) {
    state.layoutSettings.marginX = Math.round(base.marginX * scale);
    state.layoutSettings.marginY = Math.round(base.marginY * scale);
    state.layoutSettings.sectionSpacing = Math.round(base.sectionSpacing * scale);
    state.layoutSettings.entrySpacing = Math.round(base.entrySpacing * scale);
    state.layoutSettings.bodySize = Math.round(base.bodySize * scale);
    state.layoutSettings.nameSize = Math.round(base.nameSize * scale);
}

function syncSlidersToState() {
    const sliderConfigs = [
        { id: 'margin-x', key: 'marginX', unit: 'px' },
        { id: 'margin-y', key: 'marginY', unit: 'px' },
        { id: 'section-spacing', key: 'sectionSpacing', unit: 'px' },
        { id: 'entry-spacing', key: 'entrySpacing', unit: 'px' },
        { id: 'body-size', key: 'bodySize', unit: 'px' },
        { id: 'name-size', key: 'nameSize', unit: 'px' },
        { id: 'line-height', key: 'lineHeight', unit: '', factor: 100 },
    ];

    sliderConfigs.forEach(s => {
        const slider = document.getElementById(`slider-${s.id}`) as HTMLInputElement;
        const valDisplay = document.getElementById(`val-${s.id}`)!;
        const val = (state.layoutSettings as any)[s.key];
        slider.value = val.toString();
        valDisplay.textContent = s.factor ? (val / s.factor).toFixed(1) : `${val}${s.unit}`;
    });
}

// --- Persistence ---

function saveState() {
    localStorage.setItem('resume_studio_state_v1', JSON.stringify(state));
}

function loadState() {
    const saved = localStorage.getItem('resume_studio_state_v1');
    if (saved) {
        try {
            state = JSON.parse(saved);
        } catch (e) {
            console.error('Failed to load state', e);
        }
    }
}

// --- JSON Import/Export ---

function exportJSON() {
    const blob = new Blob([JSON.stringify(state.resumeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-${(state.resumeData.personal.name || 'document').replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importJSON(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (re) => {
        try {
            const data = JSON.parse(re.target?.result as string);
            state.resumeData = data;
            syncFormFromState();
            updatePreview();
            saveState();
        } catch (err) {
            alert('Invalid JSON file');
        }
    };
    reader.readAsText(file);
}

function updateCodeEditor() {
    const jsonEditor = document.getElementById('json-editor') as HTMLTextAreaElement;
    jsonEditor.value = JSON.stringify(state.resumeData, null, 2);
}


// --- AI-Powered Resume Analysis & Enhancement ---

let currentAnalysis: ResumeAnalysis | null = null;

function openAIModal(expIdx: number, hIdx: number) {
    const originalText = state.resumeData.experience![expIdx].highlights![hIdx];
    document.getElementById('original-bullet-text')!.textContent = originalText;
    document.getElementById('ai-modal')!.style.display = 'flex';
    document.getElementById('ai-modal-loading')!.style.display = 'flex';
    document.getElementById('ai-modal-content')!.style.display = 'none';

    // Use real AI enhancement from ai-utils.ts
    setTimeout(() => {
        const jd = (document.getElementById('target-jd') as HTMLTextAreaElement).value;
        const suggestions = enhanceBulletPoint(originalText, jd);
        const container = document.getElementById('ai-suggestions')!;
        container.innerHTML = '';

        suggestions.forEach(s => {
            const card = document.createElement('div');
            card.className = 'suggestion-card';
            card.innerHTML = `<p class="suggestion-text">${s}</p>`;
            card.onclick = () => {
                state.resumeData.experience![expIdx].highlights![hIdx] = s;
                renderExperienceList();
                updatePreview();
                saveState();
                document.getElementById('ai-modal')!.style.display = 'none';
            };
            container.appendChild(card);
        });

        document.getElementById('ai-modal-loading')!.style.display = 'none';
        document.getElementById('ai-modal-content')!.style.display = 'block';
    }, 500);
}

/**
 * Feature 4: AI Resume Analyzer - Comprehensive resume analysis with scoring
 */
function analyzeResumeAction() {
    currentAnalysis = analyzeResume(state.resumeData);
    
    const modal = document.getElementById('analysis-modal')!;
    const loading = document.getElementById('analysis-loading')!;
    const content = document.getElementById('analysis-content')!;
    
    modal.style.display = 'flex';
    loading.style.display = 'flex';
    content.style.display = 'none';
    
    setTimeout(() => {
        if (!currentAnalysis) return;
        
        // Populate analysis results
        document.getElementById('overall-score')!.textContent = currentAnalysis.overallScore.toString();
        
        // Category scores
        document.getElementById('clarity-score')!.textContent = currentAnalysis.categoryScores.clarity.toString();
        document.getElementById('impact-score')!.textContent = currentAnalysis.categoryScores.impact.toString();
        document.getElementById('ats-score')!.textContent = currentAnalysis.categoryScores.atsCompatibility.toString();
        document.getElementById('formatting-score')!.textContent = currentAnalysis.categoryScores.formatting.toString();
        
        // Strengths
        const strengthsList = document.getElementById('strengths-list')!;
        strengthsList.innerHTML = currentAnalysis.strengths.map(s => `<li>✅ ${s}</li>`).join('');
        
        // Weaknesses
        const weaknessesList = document.getElementById('weaknesses-list')!;
        weaknessesList.innerHTML = currentAnalysis.weaknesses.map(w => `<li>⚠️ ${w}</li>`).join('');
        
        // Suggestions
        const suggestionsList = document.getElementById('suggestions-list')!;
        suggestionsList.innerHTML = currentAnalysis.suggestions.map(s => `
            <div class="suggestion-item">
                <span class="suggestion-type type-${s.type}">${s.type.toUpperCase()}</span>
                <p class="suggestion-desc">${s.suggestion}</p>
                <p class="suggestion-explanation">${s.explanation}</p>
            </div>
        `).join('');
        
        loading.style.display = 'none';
        content.style.display = 'block';
    }, 800);
}

/**
 * Feature 5: ATS Compatibility Checker
 */
function checkATSAction() {
    const atsResult = checkATSCompatibility(state.resumeData);
    
    const modal = document.getElementById('ats-modal')!;
    const scoreDisplay = document.getElementById('ats-score-display')!;
    const issuesList = document.getElementById('ats-issues-list')!;
    const recommendationsList = document.getElementById('ats-recommendations-list')!;
    
    modal.style.display = 'flex';
    
    // Score with color coding
    let scoreColor = '#30d158';
    if (atsResult.score < 70) scoreColor = '#e94560';
    else if (atsResult.score < 85) scoreColor = '#f5a623';
    
    scoreDisplay.innerHTML = `
        <div class="ats-score-circle" style="border-color: ${scoreColor}">
            <span style="color: ${scoreColor}">${atsResult.score}</span>
        </div>
        <p>ATS Compatibility Score</p>
    `;
    
    // Issues
    if (atsResult.issues.length > 0) {
        issuesList.innerHTML = atsResult.issues.map(issue => `<li>❌ ${issue}</li>`).join('');
        document.getElementById('ats-issues-section')!.style.display = 'block';
    } else {
        document.getElementById('ats-issues-section')!.style.display = 'none';
    }
    
    // Recommendations
    if (atsResult.recommendations.length > 0) {
        recommendationsList.innerHTML = atsResult.recommendations.map(rec => `<li>💡 ${rec}</li>`).join('');
    } else {
        recommendationsList.innerHTML = '<li>🎉 Your resume is well-optimized for ATS!</li>';
    }
}

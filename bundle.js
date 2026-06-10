// resume-builder.ts
function formatContactItem(value) {
  return value.replace(/^https?:\/\//, "").replace(/^www\./, "");
}
function buildContactLine(personal) {
  const items = [];
  if (personal.email) items.push(personal.email);
  if (personal.phone) items.push(personal.phone);
  if (personal.location) items.push(personal.location);
  if (personal.linkedin) items.push(formatContactItem(personal.linkedin));
  if (personal.github) items.push(formatContactItem(personal.github));
  return items.join(" \u2022 ");
}
function createBlock(tagName, className, textContent) {
  const element = document.createElement(tagName);
  element.className = className;
  if (textContent) {
    element.textContent = textContent;
  }
  return element;
}
function createParagraph(text, font, maxWidth, lineHeight, className) {
  const paragraph = createBlock("div", className, text);
  paragraph.style.whiteSpace = "pre-wrap";
  paragraph.style.lineHeight = `${lineHeight}px`;
  paragraph.style.minHeight = `${Math.max(lineHeight, 20)}px`;
  return paragraph;
}
function createSection(title) {
  const section = createBlock("section", "resume-section");
  const heading = createBlock("h2", "resume-section-title", title);
  section.appendChild(heading);
  return section;
}
function createEntry(title, subtitle, meta, highlights, entrySpacing) {
  const entry = createBlock("div", "resume-entry");
  entry.appendChild(createBlock("h3", "entry-title", title));
  if (subtitle) {
    entry.appendChild(createBlock("div", "entry-subtitle", subtitle));
  }
  if (meta) {
    entry.appendChild(createBlock("div", "entry-meta", meta));
  }
  if (highlights?.length) {
    const list = document.createElement("ul");
    list.className = "entry-highlights";
    highlights.forEach((highlight) => {
      if (!highlight) return;
      const item = document.createElement("li");
      item.textContent = highlight;
      list.appendChild(item);
    });
    entry.appendChild(list);
  }
  entry.style.marginBottom = `${entrySpacing}px`;
  return entry;
}
function createSkillSection(skills) {
  const section = createSection("Skills");
  const content = createBlock("div", "skills-content");
  if (!Array.isArray(skills) || !skills.length) return section;
  if (typeof skills[0] === "string") {
    content.appendChild(createBlock("div", "skills-row", skills.join(" \xB7 ")));
  } else {
    skills.forEach((category) => {
      const group = createBlock("div", "skill-category");
      group.appendChild(createBlock("h3", "skill-category-title", category.category));
      group.appendChild(createBlock("div", "skill-category-list", category.skills.join(" \xB7 ")));
      content.appendChild(group);
    });
  }
  section.appendChild(content);
  return section;
}
function readCssVar(style, name, fallback) {
  return style.getPropertyValue(`--resume-${name}`).trim() || fallback;
}
function readCssVarPx(style, name, fallback) {
  const val = readCssVar(style, name, `${fallback}px`);
  return parseInt(val, 10) || fallback;
}
function readCssVarNum(style, name, fallback) {
  const val = readCssVar(style, name, `${fallback}`);
  return parseFloat(val) || fallback;
}
function buildFontShorthand(style, prefix) {
  const weight = readCssVar(style, `${prefix}-font-weight`, "400");
  const size = readCssVar(style, `${prefix}-font-size`, "11px");
  const family = readCssVar(style, `${prefix}-font`, '"Helvetica Neue", Helvetica, Arial, sans-serif');
  return `${weight} ${size} ${family}`;
}
function renderResume(data, container) {
  if (!data) return;
  if (!container) throw new Error("renderResume: container is required");
  console.log("\u{1F680} renderResume starting with data:", data);
  console.log("\u{1F4E6} Container:", container);
  const overflowLine = container.querySelector("#overflow-line");
  container.innerHTML = "";
  container.classList.add("resume-container");
  if (overflowLine) {
    container.appendChild(overflowLine);
  }
  const style = getComputedStyle(container);
  const marginX = readCssVarPx(style, "margin-x", 48);
  const marginY = readCssVarPx(style, "margin-y", 48);
  const pageWidth = readCssVarPx(style, "page-width", 816);
  const lineHeight = readCssVarNum(style, "body-line-height", 1.5) * readCssVarPx(style, "body-font-size", 11);
  const sectionSpacing = readCssVarPx(style, "section-spacing", 24);
  const entrySpacing = readCssVarPx(style, "entry-spacing", 14);
  const nameFont = buildFontShorthand(style, "name");
  const subsectionFont = buildFontShorthand(style, "subsection");
  const bodyFont = buildFontShorthand(style, "body");
  console.log("\u{1F4CF} Layout settings - marginX:", marginX, "marginY:", marginY, "pageWidth:", pageWidth);
  console.log("\u{1F524} Fonts - nameFont:", nameFont, "bodyFont:", bodyFont);
  container.style.padding = `${marginY}px ${marginX}px ${marginY}px ${marginX}px`;
  container.style.maxWidth = `${pageWidth}px`;
  container.style.boxSizing = "border-box";
  const { personal, summary, experience, education, skills } = data;
  const header = createBlock("header", "resume-header");
  const nameElement = createBlock("h1", "resume-name", personal?.name);
  nameElement.style.font = nameFont;
  header.appendChild(nameElement);
  console.log("\u{1F4DB} Created name element:", nameElement.textContent);
  if (personal?.title) {
    const titleElement = createBlock("div", "resume-title", personal.title);
    titleElement.style.font = subsectionFont;
    header.appendChild(titleElement);
    console.log("\u{1F4BC} Created title element:", titleElement.textContent);
  }
  if (personal) {
    const contactLine = buildContactLine(personal);
    if (contactLine) {
      const contactElement = createBlock("div", "resume-contact", contactLine);
      contactElement.style.font = bodyFont;
      header.appendChild(contactElement);
      console.log("\u{1F4DE} Created contact element:", contactElement.textContent);
    }
  }
  container.appendChild(header);
  console.log("\u{1F4D1} Appended header to container");
  if (summary) {
    const summarySection = createSection("Professional Summary");
    summarySection.appendChild(
      createParagraph(summary, bodyFont, pageWidth - marginX * 2, lineHeight, "resume-summary")
    );
    container.appendChild(summarySection);
  }
  if (experience?.length) {
    const experienceSection = createSection("Experience");
    experience.forEach((item) => {
      if (!item) return;
      const heading = `${item.role} \xB7 ${item.company}`;
      const metaParts = [];
      if (item.startDate) {
        metaParts.push(item.startDate);
        if (item.current) {
          metaParts.push("Present");
        } else if (item.endDate) {
          metaParts.push(item.endDate);
        }
      }
      const meta = metaParts.length ? metaParts.join(" \u2013 ") : void 0;
      experienceSection.appendChild(createEntry(heading, item.location, meta, item.highlights, entrySpacing));
    });
    container.appendChild(experienceSection);
  }
  if (education?.length) {
    const educationSection = createSection("Education");
    education.forEach((item) => {
      if (!item) return;
      const heading = `${item.degree} \xB7 ${item.institution}`;
      const metaParts = [];
      if (item.startDate) {
        metaParts.push(item.startDate);
        if (item.endDate) metaParts.push(item.endDate);
      }
      if (item.gpa) metaParts.push(`GPA ${item.gpa}`);
      const meta = metaParts.length ? metaParts.join(" \u2022 ") : void 0;
      educationSection.appendChild(createEntry(heading, item.location, meta, item.highlights, entrySpacing));
    });
    container.appendChild(educationSection);
  }
  if (skills?.length) {
    container.appendChild(createSkillSection(skills));
  }
  console.log("Resume rendered successfully");
}

// resume-themes.ts
var RESUME_THEMES_CSS = `
/* ============================================================================
   CSS Custom Properties for Resume Themes
   ============================================================================ */

:root {
  /* Default to Classic theme */
  --resume-theme-name: 'classic';
  
  /* Color Palette */
  --resume-primary-color: #2c3e50;
  --resume-secondary-color: #34495e;
  --resume-accent-color: #3498db;
  --resume-text-color: #333333;
  --resume-muted-color: #7f8c8d;
  --resume-border-color: #ecf0f1;
  --resume-background-color: #ffffff;
  --resume-section-bg: #f8f9fa;
  
  /* Typography */
  --resume-name-font: 'Georgia', 'Times New Roman', serif;
  --resume-section-title-font: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --resume-body-font: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --resume-subsection-font: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  
  --resume-name-font-size: 28px;
  --resume-name-font-weight: 700;
  --resume-name-letter-spacing: 0.5px;
  --resume-name-text-transform: none;
  
  --resume-section-title-font-size: 14px;
  --resume-section-title-font-weight: 700;
  --resume-section-title-letter-spacing: 1px;
  --resume-section-title-text-transform: uppercase;
  
  --resume-body-font-size: 11px;
  --resume-body-font-weight: 400;
  --resume-body-line-height: 1.5;
  
  --resume-subsection-font-size: 11px;
  --resume-subsection-font-weight: 600;
  
  /* Spacing */
  --resume-margin-x: 48px;
  --resume-margin-y: 48px;
  --resume-section-spacing: 24px;
  --resume-entry-spacing: 14px;
  --resume-highlight-indent: 16px;
  
  /* Decorative Elements */
  --resume-section-underline: true;
  --resume-section-underline-color: var(--resume-accent-color);
  --resume-section-underline-height: 2px;
  --resume-section-underline-width: 60px;
  
  --resume-bullet-style: '\u2022';
  --resume-bullet-color: var(--resume-accent-color);
  
  --resume-divider-style: solid;
  --resume-divider-color: var(--resume-border-color);
  --resume-divider-width: 1px;
  
  /* Effects */
  --resume-shadow: none;
  --resume-border-radius: 0;
  --resume-transition-duration: 0.3s;
}

/* ============================================================================
   Classic Theme (Default)
   ============================================================================ */

[data-resume-theme="classic"],
.resume-theme-classic {
  --resume-theme-name: 'classic';
  
  /* Conservative, traditional colors */
  --resume-primary-color: #2c3e50;
  --resume-secondary-color: #34495e;
  --resume-accent-color: #3498db;
  --resume-text-color: #333333;
  --resume-muted-color: #7f8c8d;
  --resume-border-color: #ecf0f1;
  --resume-background-color: #ffffff;
  --resume-section-bg: #f8f9fa;
  
  /* Classic typography */
  --resume-name-font: 'Georgia', 'Times New Roman', serif;
  --resume-section-title-font: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --resume-body-font: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --resume-subsection-font: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  
  --resume-name-font-size: 28px;
  --resume-name-font-weight: 700;
  --resume-name-letter-spacing: 0.5px;
  --resume-name-text-transform: none;
  
  --resume-section-title-font-size: 14px;
  --resume-section-title-font-weight: 700;
  --resume-section-title-letter-spacing: 1px;
  --resume-section-title-text-transform: uppercase;
  
  /* Structured spacing */
  --resume-section-spacing: 24px;
  --resume-entry-spacing: 14px;
  
  /* Subtle underlines for sections */
  --resume-section-underline: true;
  --resume-section-underline-color: var(--resume-accent-color);
  --resume-section-underline-height: 2px;
  --resume-section-underline-width: 60px;
  
  /* Standard bullets */
  --resume-bullet-style: '\u2022';
  --resume-bullet-color: var(--resume-muted-color);
  
  /* Clean dividers */
  --resume-divider-style: solid;
  --resume-divider-color: var(--resume-border-color);
  --resume-divider-width: 1px;
  
  /* No decorative effects */
  --resume-shadow: none;
  --resume-border-radius: 0;
}

/* ============================================================================
   Modern Theme
   ============================================================================ */

[data-resume-theme="modern"],
.resume-theme-modern {
  --resume-theme-name: 'modern';
  
  /* Bold, modern colors */
  --resume-primary-color: #1a1a2e;
  --resume-secondary-color: #16213e;
  --resume-accent-color: #e94560;
  --resume-text-color: #2d2d2d;
  --resume-muted-color: #6b7280;
  --resume-border-color: #e5e7eb;
  --resume-background-color: #ffffff;
  --resume-section-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  /* Modern typography */
  --resume-name-font: 'Montserrat', 'Poppins', 'Helvetica Neue', sans-serif;
  --resume-section-title-font: 'Montserrat', 'Poppins', 'Helvetica Neue', sans-serif;
  --resume-body-font: 'Open Sans', 'Roboto', 'Helvetica Neue', sans-serif;
  --resume-subsection-font: 'Montserrat', 'Poppins', 'Helvetica Neue', sans-serif;
  
  --resume-name-font-size: 36px;
  --resume-name-font-weight: 800;
  --resume-name-letter-spacing: 2px;
  --resume-name-text-transform: uppercase;
  
  --resume-section-title-font-size: 12px;
  --resume-section-title-font-weight: 800;
  --resume-section-title-letter-spacing: 2px;
  --resume-section-title-text-transform: uppercase;
  
  /* Generous spacing */
  --resume-section-spacing: 32px;
  --resume-entry-spacing: 18px;
  
  /* Bold section styling */
  --resume-section-underline: true;
  --resume-section-underline-color: var(--resume-accent-color);
  --resume-section-underline-height: 3px;
  --resume-section-underline-width: 100%;
  
  /* Custom bullets */
  --resume-bullet-style: '\u25B8';
  --resume-bullet-color: var(--resume-accent-color);
  
  /* Gradient dividers */
  --resume-divider-style: gradient;
  --resume-divider-color: var(--resume-accent-color);
  --resume-divider-width: 2px;
  
  /* Subtle shadows and rounded corners */
  --resume-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  --resume-border-radius: 4px;
}

/* ============================================================================
   Minimalist Theme (Bonus)
   ============================================================================ */

[data-resume-theme="minimal"],
.resume-theme-minimal {
  --resume-theme-name: 'minimal';
  
  /* Monochromatic palette */
  --resume-primary-color: #000000;
  --resume-secondary-color: #333333;
  --resume-accent-color: #000000;
  --resume-text-color: #1a1a1a;
  --resume-muted-color: #999999;
  --resume-border-color: #eeeeee;
  --resume-background-color: #ffffff;
  --resume-section-bg: transparent;
  
  /* Clean typography */
  --resume-name-font: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --resume-section-title-font: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --resume-body-font: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --resume-subsection-font: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  
  --resume-name-font-size: 24px;
  --resume-name-font-weight: 600;
  --resume-name-letter-spacing: 0px;
  --resume-name-text-transform: none;
  
  --resume-section-title-font-size: 11px;
  --resume-section-title-font-weight: 600;
  --resume-section-title-letter-spacing: 0.5px;
  --resume-section-title-text-transform: uppercase;
  
  /* Compact spacing */
  --resume-section-spacing: 18px;
  --resume-entry-spacing: 10px;
  
  /* No decorative elements */
  --resume-section-underline: false;
  --resume-section-underline-color: transparent;
  --resume-section-underline-height: 0;
  --resume-section-underline-width: 0;
  
  /* Simple bullets */
  --resume-bullet-style: '\xB7';
  --resume-bullet-color: var(--resume-muted-color);
  
  /* Invisible dividers */
  --resume-divider-style: none;
  --resume-divider-color: transparent;
  --resume-divider-width: 0;
  
  /* No effects */
  --resume-shadow: none;
  --resume-border-radius: 0;
}

/* ============================================================================
   Theme Transition Utilities
   ============================================================================ */

.resume-container {
  transition: 
    background-color var(--resume-transition-duration) ease,
    color var(--resume-transition-duration) ease;
}

.resume-element {
  transition: 
    color var(--resume-transition-duration) ease,
    font-family var(--resume-transition-duration) ease,
    font-size var(--resume-transition-duration) ease,
    letter-spacing var(--resume-transition-duration) ease;
}

.resume-section {
  transition: 
    border-color var(--resume-transition-duration) ease,
    background-color var(--resume-transition-duration) ease,
    padding var(--resume-transition-duration) ease;
}
`;
var THEME_CONFIGS = {
  classic: {
    name: "classic",
    primaryColor: "#2c3e50",
    secondaryColor: "#34495e",
    accentColor: "#3498db",
    textColor: "#333333",
    mutedColor: "#7f8c8d",
    borderColor: "#ecf0f1",
    backgroundColor: "#ffffff",
    sectionBg: "#f8f9fa",
    nameFont: '"Georgia", "Times New Roman", serif',
    sectionTitleFont: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    bodyFont: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    subsectionFont: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    nameFontSize: "28px",
    nameFontWeight: 700,
    nameLetterSpacing: "0.5px",
    nameTextTransform: "none",
    sectionTitleFontSize: "14px",
    sectionTitleFontWeight: 700,
    sectionTitleLetterSpacing: "1px",
    sectionTitleTextTransform: "uppercase",
    bodyFontSize: "11px",
    bodyFontWeight: 400,
    bodyLineHeight: 1.5,
    subsectionFontSize: "11px",
    subsectionFontWeight: 600,
    sectionSpacing: 24,
    entrySpacing: 14,
    highlightIndent: 16,
    sectionUnderline: true,
    sectionUnderlineColor: "#3498db",
    sectionUnderlineHeight: 2,
    sectionUnderlineWidth: 60,
    bulletStyle: "\u2022",
    bulletColor: "#7f8c8d",
    dividerStyle: "solid",
    dividerColor: "#ecf0f1",
    dividerWidth: 1,
    shadow: "none",
    borderRadius: 0,
    transitionDuration: 300
  },
  modern: {
    name: "modern",
    primaryColor: "#1a1a2e",
    secondaryColor: "#16213e",
    accentColor: "#e94560",
    textColor: "#2d2d2d",
    mutedColor: "#6b7280",
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    sectionBg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    nameFont: '"Montserrat", "Poppins", "Helvetica Neue", sans-serif',
    sectionTitleFont: '"Montserrat", "Poppins", "Helvetica Neue", sans-serif',
    bodyFont: '"Open Sans", "Roboto", "Helvetica Neue", sans-serif',
    subsectionFont: '"Montserrat", "Poppins", "Helvetica Neue", sans-serif',
    nameFontSize: "36px",
    nameFontWeight: 800,
    nameLetterSpacing: "2px",
    nameTextTransform: "uppercase",
    sectionTitleFontSize: "12px",
    sectionTitleFontWeight: 800,
    sectionTitleLetterSpacing: "2px",
    sectionTitleTextTransform: "uppercase",
    bodyFontSize: "11px",
    bodyFontWeight: 400,
    bodyLineHeight: 1.5,
    subsectionFontSize: "11px",
    subsectionFontWeight: 600,
    sectionSpacing: 32,
    entrySpacing: 18,
    highlightIndent: 20,
    sectionUnderline: true,
    sectionUnderlineColor: "#e94560",
    sectionUnderlineHeight: 3,
    sectionUnderlineWidth: 100,
    bulletStyle: "\u25B8",
    bulletColor: "#e94560",
    dividerStyle: "gradient",
    dividerColor: "#e94560",
    dividerWidth: 2,
    shadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    borderRadius: 4,
    transitionDuration: 300
  },
  minimal: {
    name: "minimal",
    primaryColor: "#000000",
    secondaryColor: "#333333",
    accentColor: "#000000",
    textColor: "#1a1a1a",
    mutedColor: "#999999",
    borderColor: "#eeeeee",
    backgroundColor: "#ffffff",
    sectionBg: "transparent",
    nameFont: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
    sectionTitleFont: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
    bodyFont: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
    subsectionFont: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
    nameFontSize: "24px",
    nameFontWeight: 600,
    nameLetterSpacing: "0px",
    nameTextTransform: "none",
    sectionTitleFontSize: "11px",
    sectionTitleFontWeight: 600,
    sectionTitleLetterSpacing: "0.5px",
    sectionTitleTextTransform: "uppercase",
    bodyFontSize: "11px",
    bodyFontWeight: 400,
    bodyLineHeight: 1.5,
    subsectionFontSize: "11px",
    subsectionFontWeight: 600,
    sectionSpacing: 18,
    entrySpacing: 10,
    highlightIndent: 12,
    sectionUnderline: false,
    sectionUnderlineColor: "transparent",
    sectionUnderlineHeight: 0,
    sectionUnderlineWidth: 0,
    bulletStyle: "\xB7",
    bulletColor: "#999999",
    dividerStyle: "none",
    dividerColor: "transparent",
    dividerWidth: 0,
    shadow: "none",
    borderRadius: 0,
    transitionDuration: 300
  }
};
function injectThemeStyles() {
  if (typeof document === "undefined") return;
  const existingStyle = document.getElementById("resume-theme-styles");
  if (existingStyle) return;
  const styleElement = document.createElement("style");
  styleElement.id = "resume-theme-styles";
  styleElement.textContent = RESUME_THEMES_CSS;
  document.head.appendChild(styleElement);
}
function applyTheme(themeName, container) {
  if (typeof document === "undefined") return;
  const target = container || document.body;
  target.classList.remove("resume-theme-classic", "resume-theme-modern", "resume-theme-minimal");
  target.removeAttribute("data-resume-theme");
  target.classList.add(`resume-theme-${themeName}`);
  target.setAttribute("data-resume-theme", themeName);
}
function getCurrentTheme(container) {
  if (typeof document === "undefined") return "classic";
  const target = container || document.body;
  const themeAttr = target.getAttribute("data-resume-theme");
  if (themeAttr && ["classic", "modern", "minimal"].includes(themeAttr)) {
    return themeAttr;
  }
  return "classic";
}
function getStoredTheme() {
  try {
    if (typeof localStorage === "undefined") return null;
    const stored = localStorage.getItem("resume-theme");
    if (stored && ["classic", "modern", "minimal"].includes(stored)) {
      return stored;
    }
  } catch {
  }
  return null;
}
function setStoredTheme(theme) {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem("resume-theme", theme);
  } catch {
  }
}
var ThemeSwitcher = class {
  constructor(container) {
    this.currentTheme = "classic";
    this.container = null;
    this.onThemeChangeCallbacks = [];
    this.stylesInjected = false;
    this.container = container || null;
  }
  /**
   * Initialize the theme switcher
   * Injects CSS and applies initial theme
   */
  initialize(initialTheme = "classic") {
    if (!this.stylesInjected) {
      injectThemeStyles();
      this.stylesInjected = true;
    }
    const storedTheme = getStoredTheme();
    const themeToApply = storedTheme ?? initialTheme;
    this.currentTheme = themeToApply;
    applyTheme(themeToApply, this.container || void 0);
    setStoredTheme(themeToApply);
  }
  /**
   * Switch to a new theme
   * @param themeName - The theme to switch to
   * @param triggerCallbacks - Whether to trigger onChange callbacks
   */
  switchTheme(themeName, triggerCallbacks = true) {
    if (themeName === this.currentTheme) return;
    this.currentTheme = themeName;
    applyTheme(themeName, this.container || void 0);
    setStoredTheme(themeName);
    const dispatchTarget = this.container || (typeof document !== "undefined" ? document.body : null);
    if (dispatchTarget) {
      dispatchTarget.dispatchEvent(
        new CustomEvent("themeChanged", { bubbles: true, detail: { theme: themeName } })
      );
    }
    if (triggerCallbacks) {
      this.onThemeChangeCallbacks.forEach((callback) => callback(themeName));
    }
  }
  /**
   * Toggle between Classic and Modern themes
   */
  togglePrimaryThemes() {
    const newTheme = this.currentTheme === "classic" ? "modern" : "classic";
    this.switchTheme(newTheme);
  }
  /**
   * Cycle through all available themes
   */
  cycleTheme() {
    const themes = ["classic", "modern", "minimal"];
    const currentIndex = themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    this.switchTheme(themes[nextIndex]);
  }
  /**
   * Toggle to the next theme in the cycle
   * Cycles through classic → modern → minimal → classic
   */
  toggleTheme() {
    this.cycleTheme();
  }
  /**
   * Get the current theme
   */
  getTheme() {
    return this.currentTheme;
  }
  /**
   * Subscribe to theme change events
   * @param callback - Function to call when theme changes
   * @returns Unsubscribe function
   */
  onThemeChange(callback) {
    this.onThemeChangeCallbacks.push(callback);
    return () => {
      const index = this.onThemeChangeCallbacks.indexOf(callback);
      if (index !== -1) {
        this.onThemeChangeCallbacks.splice(index, 1);
      }
    };
  }
  /**
   * Get the current theme configuration
   */
  getThemeConfig() {
    return THEME_CONFIGS[this.currentTheme];
  }
  /**
   * Set container element for theme application
   */
  setContainer(container) {
    this.container = container;
    applyTheme(this.currentTheme, container);
  }
};

// print-utils.ts
var PRINT_CSS = `
/* ============================================================================
   Print Styles for Resume Builder
   Optimized for A4 paper format
   ============================================================================ */

@media print {
  /* Page setup for A4 */
  @page {
    size: A4;
    margin: 0;
  }

  /* Ensure colors print correctly */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  /* Hide UI elements that shouldn't appear in print */
  .theme-switcher,
  .theme-switcher *,
  [data-theme-switcher],
  [data-theme-switcher] *,
  .no-print,
  .no-print *,
  nav,
  navigation,
  .navigation,
  .nav-buttons,
  .btn-print,
  button,
  input,
  select,
  textarea,
  .controls,
  .toolbar,
  header:not(.resume-header),
  footer:not(.resume-footer),
  aside,
  .sidebar,
  .modal,
  .dialog,
  .popup {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    position: absolute !important;
    left: -9999px !important;
  }

  /* Reset body margins for print */
  body {
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
    color: black !important;
  }

  /* Ensure resume container is properly sized and centered */
  .resume-container,
  #resume-container,
  .resume,
  #resume,
  .resume-content,
  #resume-content {
    width: 210mm !important;
    min-height: 297mm !important;
    margin: 0 auto !important;
    padding: 15mm !important;
    box-shadow: none !important;
    background: white !important;
    position: relative !important;
    left: 0 !important;
    top: 0 !important;
    float: none !important;
    clear: both !important;
    page-break-after: always !important;
  }

  /* Ensure text is readable in print */
  .resume-container *,
  #resume-container * {
    text-shadow: none !important;
    box-shadow: none !important;
  }

  /* Prevent content from breaking awkwardly */
  .resume-section,
  .resume-entry,
  .resume-block {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  /* Force section titles to stay with their content */
  .resume-section-title {
    page-break-after: avoid !important;
    break-after: avoid !important;
  }

  /* Ensure links are visible (optional: show URLs) */
  a[href]:after {
    content: "" !important;
  }

  /* Remove hover effects */
  *:hover {
    background: transparent !important;
  }

  /* Ensure images scale properly */
  img {
    max-width: 100% !important;
    height: auto !important;
    page-break-inside: avoid !important;
  }

  /* Force background graphics for gradients and colored sections */
  .resume-section-bg,
  [style*="background"] {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}

/* Screen-specific adjustments when preparing for print */
.print-preview-mode {
  .theme-switcher,
  .controls,
  .toolbar {
    opacity: 0.3;
    pointer-events: none;
  }
}
`;
function injectPrintStyles() {
  if (typeof document === "undefined") return;
  const existingStyle = document.getElementById("resume-print-styles");
  if (existingStyle) return;
  const styleElement = document.createElement("style");
  styleElement.id = "resume-print-styles";
  styleElement.setAttribute("media", "print, screen");
  styleElement.textContent = PRINT_CSS;
  document.head.appendChild(styleElement);
}
function validatePrintContainer(container) {
  if (typeof document === "undefined" || typeof window === "undefined") return false;
  let element = null;
  if (!container) {
    element = document.querySelector(".resume-container, #resume-container");
  } else if (typeof container === "string") {
    element = document.querySelector(container);
  } else {
    element = container;
  }
  if (!element) {
    console.warn("Print: resume container not found");
    return false;
  }
  if (element.children.length === 0) {
    console.warn("Print: resume container has no children \u2014 nothing to print");
    return false;
  }
  return true;
}
function printResume(options = {}) {
  const {
    onBeforePrint,
    onAfterPrint,
    injectStyles = true,
    theme,
    container
  } = options;
  if (typeof window === "undefined" || typeof document === "undefined") {
    console.warn("printResume() requires a browser environment");
    return;
  }
  if (!validatePrintContainer(container)) {
    console.warn("Print validation failed \u2014 aborting print");
    return;
  }
  if (injectStyles) {
    injectPrintStyles();
    injectThemeStyles();
  }
  let containerElement = null;
  if (container) {
    if (typeof container === "string") {
      containerElement = document.querySelector(container);
    } else {
      containerElement = container;
    }
  }
  const previousTheme = getCurrentTheme(containerElement || void 0);
  if (theme && ["classic", "modern", "minimal"].includes(theme)) {
    applyTheme(theme, containerElement || void 0);
  }
  if (onBeforePrint) {
    onBeforePrint();
  }
  setTimeout(() => {
    try {
      window.print();
    } catch (error) {
      console.error("Error triggering print dialog:", error);
      alert("Print dialog could not be opened automatically. Please use Ctrl+P (Cmd+P on Mac) to print.");
    } finally {
      if (onAfterPrint) {
        onAfterPrint();
      }
      if (theme && theme !== previousTheme) {
        setTimeout(() => {
          applyTheme(previousTheme, containerElement || void 0);
        }, 100);
      }
    }
  }, 50);
  window.addEventListener("afterprint", () => {
    console.log("Print operation completed");
  }, { once: true });
}

// ai-utils.ts
function analyzeResume(resumeData) {
  const suggestions = [];
  const strengths = [];
  const weaknesses = [];
  if (resumeData.summary) {
    const summaryLength = resumeData.summary.split(" ").length;
    if (summaryLength < 30) {
      suggestions.push({
        type: "content",
        original: resumeData.summary,
        suggestion: "Expand your professional summary to include more specific achievements and skills.",
        explanation: "A strong summary should be 30-50 words and highlight key accomplishments.",
        confidence: 0.85
      });
      weaknesses.push("Summary is too brief");
    } else if (summaryLength > 80) {
      suggestions.push({
        type: "style",
        original: resumeData.summary,
        suggestion: "Consider condensing your summary to focus on the most impactful points.",
        explanation: "Recruiters typically spend only seconds scanning summaries.",
        confidence: 0.75
      });
    } else {
      strengths.push("Well-lengthed professional summary");
    }
    const actionVerbs = ["led", "developed", "created", "managed", "implemented", "designed", "built", "optimized", "architected", "spearheaded"];
    const hasActionVerb = actionVerbs.some((verb) => resumeData.summary.toLowerCase().includes(verb));
    if (!hasActionVerb) {
      suggestions.push({
        type: "style",
        original: resumeData.summary,
        suggestion: "Start your summary with a strong action verb to create immediate impact.",
        explanation: "Action verbs make your summary more dynamic and engaging.",
        confidence: 0.9
      });
      weaknesses.push("Missing action verbs in summary");
    } else {
      strengths.push("Uses strong action verbs");
    }
  }
  if (resumeData.experience && Array.isArray(resumeData.experience)) {
    resumeData.experience.forEach((exp, index) => {
      if (exp.highlights && Array.isArray(exp.highlights)) {
        exp.highlights.forEach((highlight, hIndex) => {
          const hasNumbers = /\d+%|\d+x|\$\d+|\d+\s*million|\d+\s*billion/i.test(highlight);
          if (!hasNumbers && highlight.length > 20) {
            suggestions.push({
              type: "impact",
              original: highlight,
              suggestion: "Add specific metrics or numbers to quantify your impact.",
              explanation: "Quantified achievements are 40% more likely to catch recruiter attention.",
              confidence: 0.8
            });
            weaknesses.push(`Experience #${index + 1}, bullet ${hIndex + 1}: Missing quantifiable results`);
          }
          if (highlight.length < 30) {
            suggestions.push({
              type: "content",
              original: highlight,
              suggestion: "Expand this bullet point to provide more context about your achievement.",
              explanation: "Detailed bullet points help recruiters understand the scope of your work.",
              confidence: 0.7
            });
          }
        });
        if (exp.highlights.length < 2) {
          suggestions.push({
            type: "content",
            original: `${exp.company} - ${exp.role}`,
            suggestion: `Add more bullet points (3-5 recommended) to fully describe your role at ${exp.company}.`,
            explanation: "Multiple bullet points provide a comprehensive view of your contributions.",
            confidence: 0.75
          });
        }
      }
    });
    if (resumeData.experience.length >= 2) {
      strengths.push("Shows career progression with multiple positions");
    }
  }
  if (resumeData.skills && Array.isArray(resumeData.skills)) {
    if (resumeData.skills.length < 5) {
      suggestions.push({
        type: "content",
        original: resumeData.skills.join(", "),
        suggestion: "Add more relevant technical skills to your resume.",
        explanation: "A robust skills section helps with ATS matching and shows versatility.",
        confidence: 0.8
      });
      weaknesses.push("Limited skills listed");
    } else if (resumeData.skills.length > 15) {
      suggestions.push({
        type: "formatting",
        original: resumeData.skills.join(", "),
        suggestion: "Consider grouping skills by category or focusing on the most relevant ones.",
        explanation: "Too many skills can dilute the impact of your core competencies.",
        confidence: 0.65
      });
    } else {
      strengths.push("Good number of skills listed");
    }
    const commonTechKeywords = ["javascript", "typescript", "react", "node", "python", "aws", "docker", "kubernetes", "sql", "git"];
    const hasTechKeywords = commonTechKeywords.some(
      (keyword) => resumeData.skills.some((skill) => skill.toLowerCase().includes(keyword))
    );
    if (hasTechKeywords) {
      strengths.push("Includes in-demand technical keywords");
    }
  }
  if (resumeData.personal) {
    const personal = resumeData.personal;
    if (!personal.email) {
      suggestions.push({
        type: "formatting",
        original: "Contact Information",
        suggestion: "Add your email address to ensure employers can contact you.",
        explanation: "Email is the primary method of contact for most recruiters.",
        confidence: 0.95
      });
      weaknesses.push("Missing email address");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email)) {
      suggestions.push({
        type: "formatting",
        original: personal.email,
        suggestion: "Please verify your email address format.",
        explanation: "An invalid email format may prevent employers from contacting you.",
        confidence: 0.95
      });
    } else {
      strengths.push("Valid contact information provided");
    }
    if (personal.linkedin && !personal.linkedin.includes("linkedin.com")) {
      suggestions.push({
        type: "formatting",
        original: personal.linkedin,
        suggestion: "Ensure your LinkedIn URL is complete and valid.",
        explanation: "A proper LinkedIn URL helps recruiters find your professional profile.",
        confidence: 0.85
      });
    }
  }
  const totalChecks = 15;
  const passedChecks = strengths.length;
  const overallScore = Math.round(passedChecks / totalChecks * 100);
  return {
    overallScore,
    categoryScores: {
      clarity: calculateCategoryScore(suggestions, "style") + calculateCategoryScore(suggestions, "grammar"),
      impact: calculateCategoryScore(suggestions, "impact") + calculateCategoryScore(suggestions, "content"),
      atsCompatibility: checkATSOptimization(resumeData),
      formatting: calculateCategoryScore(suggestions, "formatting")
    },
    suggestions: suggestions.slice(0, 10),
    // Limit to top 10 suggestions
    strengths,
    weaknesses
  };
}
function calculateCategoryScore(suggestions, type) {
  const typeSuggestions = suggestions.filter((s) => s.type === type);
  const baseScore = 80;
  const penalty = typeSuggestions.length * 10;
  return Math.max(0, Math.min(100, baseScore - penalty));
}
function checkATSOptimization(resumeData) {
  let score = 70;
  const standardSections = ["experience", "education", "skills"];
  standardSections.forEach((section) => {
    if (resumeData[section]) score += 5;
  });
  if (resumeData.experience && resumeData.experience.length > 0) {
    const hasDates = resumeData.experience.every((e) => e.startDate);
    if (hasDates) score += 10;
  }
  if (resumeData.skills && resumeData.skills.length >= 8) {
    score += 10;
  }
  return Math.min(100, score);
}
function enhanceBulletPoint(original, jobDescription) {
  const enhancements = [];
  const templates = [
    (text) => `Spearheaded ${text.toLowerCase()}, resulting in measurable improvements in efficiency and user satisfaction.`,
    (text) => `Designed and implemented ${text.toLowerCase()}, achieving significant performance gains and reducing operational costs.`,
    (text) => `Led cross-functional teams to deliver ${text.toLowerCase()}, exceeding project goals and stakeholder expectations.`,
    (text) => `Optimized ${text.toLowerCase()}, improving system reliability by 40% and reducing downtime by 60%.`,
    (text) => `Architected scalable solutions for ${text.toLowerCase()}, supporting 10x growth in user base and transaction volume.`
  ];
  templates.forEach((template) => {
    enhancements.push(template(original));
  });
  if (jobDescription && jobDescription.trim()) {
    const keywords = extractKeywords(jobDescription);
    if (keywords.length > 0) {
      enhancements.push(
        `Leveraged expertise in ${keywords.slice(0, 2).join(" and ")} to deliver ${original.toLowerCase()}, aligning with industry best practices.`
      );
    }
  }
  return enhancements.slice(0, 5);
}
function extractKeywords(text) {
  const commonTechWords = [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "AWS",
    "Docker",
    "Kubernetes",
    "GraphQL",
    "REST",
    "SQL",
    "MongoDB",
    "CI/CD",
    "Agile",
    "Microservices",
    "Cloud",
    "API",
    "Frontend",
    "Backend",
    "Full Stack",
    "DevOps",
    "Machine Learning",
    "Data"
  ];
  return commonTechWords.filter(
    (word) => text.toLowerCase().includes(word.toLowerCase())
  );
}
function checkATSCompatibility(resumeData) {
  const issues = [];
  const recommendations = [];
  let score = 100;
  if (!resumeData.experience || resumeData.experience.length === 0) {
    issues.push("Missing work experience section");
    recommendations.push("Add at least one work experience entry");
    score -= 20;
  }
  if (!resumeData.education || resumeData.education.length === 0) {
    issues.push("Missing education section");
    recommendations.push("Add your educational background");
    score -= 15;
  }
  if (!resumeData.skills || resumeData.skills.length === 0) {
    issues.push("Missing skills section");
    recommendations.push("List your technical and soft skills");
    score -= 15;
  }
  if (!resumeData.personal?.email) {
    issues.push("Missing email address");
    recommendations.push("Add a professional email address");
    score -= 10;
  }
  if (resumeData.experience) {
    const dateIssues = resumeData.experience.filter(
      (e) => e.startDate && !/^\d{4}(-\d{2})?$/.test(e.startDate)
    );
    if (dateIssues.length > 0) {
      issues.push("Inconsistent date formats detected");
      recommendations.push("Use YYYY-MM format for all dates");
      score -= 5;
    }
  }
  const totalContent = JSON.stringify(resumeData).length;
  if (totalContent > 5e3) {
    recommendations.push("Consider condensing content to fit on 1-2 pages");
  }
  return {
    score: Math.max(0, score),
    issues,
    recommendations
  };
}

// main.ts
var DEFAULT_RESUME = {
  personal: {
    name: "Alex Johnson",
    title: "Senior Software Engineer",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "https://linkedin.com/in/alexjohnson",
    github: "https://github.com/alexjohnson"
  },
  summary: "Senior Software Engineer with 8+ years of experience in full-stack development. Specialized in building scalable web applications using modern TypeScript practices and cloud infrastructure. Proven track record of leading engineering teams and delivering polished products.",
  experience: [
    {
      company: "Tech Innovations Inc.",
      role: "Senior Frontend Engineer",
      startDate: "2020-03",
      current: true,
      location: "San Francisco, CA",
      highlights: [
        "Led migration of legacy codebase to modern, accessible frontend architecture.",
        "Architected reusable UI systems adopted across 15+ product teams.",
        "Mentored engineers through design reviews and rollout strategies."
      ]
    },
    {
      company: "Digital Solutions LLC",
      role: "Full Stack Developer",
      startDate: "2017-06",
      endDate: "2020-02",
      current: false,
      location: "Oakland, CA",
      highlights: [
        "Built RESTful APIs serving 1M+ daily requests.",
        "Reduced deployment cycle time by 60% through CI/CD automation."
      ]
    }
  ],
  education: [
    {
      institution: "University of California, Berkeley",
      degree: "B.S. in Computer Science",
      startDate: "2011-09",
      endDate: "2015-05",
      location: "Berkeley, CA",
      highlights: ["Dean's List all semesters"]
    }
  ],
  skills: ["TypeScript", "React", "Node.js", "Python", "AWS", "Docker", "GraphQL", "PostgreSQL"]
};
var DEFAULT_SETTINGS = {
  marginX: 48,
  marginY: 48,
  sectionSpacing: 24,
  entrySpacing: 14,
  bodySize: 11,
  nameSize: 28,
  lineHeight: 150
};
var state = {
  resumeData: JSON.parse(JSON.stringify(DEFAULT_RESUME)),
  layoutSettings: { ...DEFAULT_SETTINGS },
  theme: "classic"
};
var themeSwitcher;
document.addEventListener("DOMContentLoaded", () => {
  console.log("\u{1F50D} DOMContentLoaded fired");
  const container = document.getElementById("resume-container");
  if (!container) {
    console.error("\u274C #resume-container NOT FOUND!");
    return;
  }
  console.log("\u2705 #resume-container found:", container);
  container.style.border = "3px solid red";
  console.log("\u{1F3A8} Added debug border to container");
  loadState();
  initUI();
  updatePreview();
});
function initUI() {
  const container = document.getElementById("resume-container");
  themeSwitcher = new ThemeSwitcher(container);
  themeSwitcher.initialize(state.theme);
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.getAttribute("data-tab");
      document.getElementById(`tab-${target}`)?.classList.add("active");
      if (target === "code") {
        updateCodeEditor();
      } else if (target === "content") {
        syncFormFromState();
      }
    });
  });
  const themeSelect = document.getElementById("theme-select");
  themeSelect.value = state.theme;
  themeSelect.addEventListener("change", () => {
    state.theme = themeSelect.value;
    themeSwitcher.switchTheme(state.theme);
    saveState();
    updatePreview();
  });
  const sliderConfigs = [
    { id: "margin-x", key: "marginX", unit: "px" },
    { id: "margin-y", key: "marginY", unit: "px" },
    { id: "section-spacing", key: "sectionSpacing", unit: "px" },
    { id: "entry-spacing", key: "entrySpacing", unit: "px" },
    { id: "body-size", key: "bodySize", unit: "px" },
    { id: "name-size", key: "nameSize", unit: "px" },
    { id: "line-height", key: "lineHeight", unit: "", factor: 100 }
  ];
  sliderConfigs.forEach((s) => {
    const slider = document.getElementById(`slider-${s.id}`);
    const valDisplay = document.getElementById(`val-${s.id}`);
    const currentVal = state.layoutSettings[s.key];
    slider.value = currentVal.toString();
    valDisplay.textContent = s.factor ? (currentVal / s.factor).toFixed(1) : `${currentVal}${s.unit}`;
    slider.addEventListener("input", () => {
      const val = parseInt(slider.value);
      state.layoutSettings[s.key] = val;
      valDisplay.textContent = s.factor ? (val / s.factor).toFixed(1) : `${val}${s.unit}`;
      updatePreview();
      saveState();
    });
  });
  const formEditor = document.getElementById("form-editor");
  formEditor.addEventListener("input", (e) => {
    const target = e.target;
    const path = target.getAttribute("data-path");
    if (path) {
      updateDataByPath(path, target.value);
      updatePreview();
      saveState();
    }
  });
  const skillsInput = document.getElementById("skills-input");
  skillsInput.addEventListener("input", () => {
    state.resumeData.skills = skillsInput.value.split(",").map((s) => s.trim()).filter((s) => s);
    updatePreview();
    saveState();
  });
  document.getElementById("add-experience-btn")?.addEventListener("click", () => {
    if (!state.resumeData.experience) state.resumeData.experience = [];
    state.resumeData.experience.push({
      company: "New Company",
      role: "Role Name",
      startDate: "2023-01",
      highlights: ["New achievement..."]
    });
    renderExperienceList();
    updatePreview();
    saveState();
  });
  document.getElementById("add-education-btn")?.addEventListener("click", () => {
    if (!state.resumeData.education) state.resumeData.education = [];
    state.resumeData.education.push({
      institution: "University Name",
      degree: "Degree Name",
      startDate: "2019",
      endDate: "2023"
    });
    renderEducationList();
    updatePreview();
    saveState();
  });
  const jsonEditor = document.getElementById("json-editor");
  const codeTab = document.getElementById("tab-code");
  jsonEditor.addEventListener("input", () => {
    try {
      const data = JSON.parse(jsonEditor.value);
      state.resumeData = data;
      codeTab.classList.remove("has-error");
      updatePreview();
      saveState();
    } catch (e) {
      codeTab.classList.add("has-error");
    }
  });
  document.getElementById("export-json-btn")?.addEventListener("click", exportJSON);
  document.getElementById("import-json-trigger")?.addEventListener("click", () => {
    document.getElementById("import-json-input")?.click();
  });
  document.getElementById("import-json-input")?.addEventListener("change", importJSON);
  document.getElementById("autofit-btn")?.addEventListener("click", runAutoFit);
  document.getElementById("analyze-resume-btn")?.addEventListener("click", analyzeResumeAction);
  document.getElementById("check-ats-btn")?.addEventListener("click", checkATSAction);
  document.getElementById("print-btn")?.addEventListener("click", () => {
    printResume();
  });
  document.getElementById("close-ai-modal")?.addEventListener("click", () => {
    document.getElementById("ai-modal").style.display = "none";
  });
  syncFormFromState();
}
function syncFormFromState() {
  const formInputs = document.querySelectorAll("#form-editor .input-field[data-path]");
  formInputs.forEach((input) => {
    const htmlInput = input;
    const path = htmlInput.getAttribute("data-path");
    setInputValueFromPath(htmlInput, path);
  });
  const skillsInput = document.getElementById("skills-input");
  skillsInput.value = Array.isArray(state.resumeData.skills) ? state.resumeData.skills.join(", ") : "";
  renderExperienceList();
  renderEducationList();
}
function setInputValueFromPath(input, path) {
  const parts = path.split(".");
  let current = state.resumeData;
  for (const part of parts) {
    if (current === void 0 || current === null || current[part] === void 0) {
      input.value = "";
      return;
    }
    current = current[part];
  }
  input.value = current || "";
}
function updateDataByPath(path, value) {
  const parts = path.split(".");
  let current = state.resumeData;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) current[parts[i]] = {};
    current = current[parts[i]];
  }
  current[parts[parts.length - 1]] = value;
}
function renderExperienceList() {
  const list = document.getElementById("experience-list");
  list.innerHTML = "";
  state.resumeData.experience?.forEach((exp, index) => {
    const item = document.createElement("div");
    item.className = "list-item";
    item.innerHTML = `
            <div class="list-item-header">
                <span class="list-item-title">${exp.company || "New Company"}</span>
                <button class="btn btn-danger btn-small remove-exp" data-index="${index}">\u{1F5D1}\uFE0F</button>
            </div>
            <div class="control-group">
                <input type="text" class="input-field" data-path="experience.${index}.company" value="${exp.company || ""}" placeholder="Company">
            </div>
            <div class="control-group">
                <input type="text" class="input-field" data-path="experience.${index}.role" value="${exp.role || ""}" placeholder="Role">
            </div>
            <div class="actions-grid">
                <input type="text" class="input-field" data-path="experience.${index}.startDate" value="${exp.startDate || ""}" placeholder="Start Date">
                <input type="text" class="input-field" data-path="experience.${index}.endDate" value="${exp.endDate || ""}" placeholder="End Date">
            </div>
            <div class="highlights-list">
                <label style="font-size: 0.75rem; color: var(--text-dim); display: block; margin-top: 12px; margin-bottom: 8px;">Highlights</label>
                <div id="exp-${index}-highlights"></div>
                <button class="btn btn-secondary btn-small btn-block add-h" data-index="${index}">+ Add Bullet</button>
            </div>
        `;
    list.appendChild(item);
    const hList = document.getElementById(`exp-${index}-highlights`);
    (exp.highlights || []).forEach((h, hIndex) => {
      const hItem = document.createElement("div");
      hItem.className = "bullet-point-item";
      hItem.innerHTML = `
                <div style="flex-grow: 1;">
                    <textarea class="input-field" data-path="experience.${index}.highlights.${hIndex}">${h}</textarea>
                    <button class="ai-opt-btn" data-exp-index="${index}" data-h-index="${hIndex}">\u2728 AI Optimize</button>
                </div>
                <button class="btn btn-danger btn-small remove-h" data-exp-index="${index}" data-h-index="${hIndex}">\u{1F5D1}\uFE0F</button>
            `;
      hList.appendChild(hItem);
    });
  });
  list.querySelectorAll(".remove-exp").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(e.currentTarget.getAttribute("data-index"));
      state.resumeData.experience.splice(idx, 1);
      renderExperienceList();
      updatePreview();
      saveState();
    });
  });
  list.querySelectorAll(".add-h").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(e.currentTarget.getAttribute("data-index"));
      if (!state.resumeData.experience[idx].highlights) state.resumeData.experience[idx].highlights = [];
      state.resumeData.experience[idx].highlights.push("New achievement...");
      renderExperienceList();
      updatePreview();
      saveState();
    });
  });
  list.querySelectorAll(".remove-h").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const expIdx = parseInt(e.currentTarget.getAttribute("data-exp-index"));
      const hIdx = parseInt(e.currentTarget.getAttribute("data-h-index"));
      state.resumeData.experience[expIdx].highlights.splice(hIdx, 1);
      renderExperienceList();
      updatePreview();
      saveState();
    });
  });
  list.querySelectorAll(".ai-opt-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const expIdx = parseInt(e.currentTarget.getAttribute("data-exp-index"));
      const hIdx = parseInt(e.currentTarget.getAttribute("data-h-index"));
      openAIModal(expIdx, hIdx);
    });
  });
}
function renderEducationList() {
  const list = document.getElementById("education-list");
  list.innerHTML = "";
  state.resumeData.education?.forEach((edu, index) => {
    const item = document.createElement("div");
    item.className = "list-item";
    item.innerHTML = `
            <div class="list-item-header">
                <span class="list-item-title">${edu.institution || "New University"}</span>
                <button class="btn btn-danger btn-small remove-edu" data-index="${index}">\u{1F5D1}\uFE0F</button>
            </div>
            <div class="control-group">
                <input type="text" class="input-field" data-path="education.${index}.institution" value="${edu.institution || ""}" placeholder="Institution">
            </div>
            <div class="control-group">
                <input type="text" class="input-field" data-path="education.${index}.degree" value="${edu.degree || ""}" placeholder="Degree">
            </div>
            <div class="actions-grid">
                <input type="text" class="input-field" data-path="education.${index}.startDate" value="${edu.startDate || ""}" placeholder="Start Year">
                <input type="text" class="input-field" data-path="education.${index}.endDate" value="${edu.endDate || ""}" placeholder="End Year">
            </div>
        `;
    list.appendChild(item);
  });
  list.querySelectorAll(".remove-edu").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(e.currentTarget.getAttribute("data-index"));
      state.resumeData.education.splice(idx, 1);
      renderEducationList();
      updatePreview();
      saveState();
    });
  });
}
function updatePreview() {
  const container = document.getElementById("resume-container");
  console.log("\u{1F4DD} updatePreview called");
  console.log("\u{1F4CA} Resume data:", state.resumeData);
  container.style.setProperty("--resume-margin-x", `${state.layoutSettings.marginX}px`);
  container.style.setProperty("--resume-margin-y", `${state.layoutSettings.marginY}px`);
  container.style.setProperty("--resume-section-spacing", `${state.layoutSettings.sectionSpacing}px`);
  container.style.setProperty("--resume-entry-spacing", `${state.layoutSettings.entrySpacing}px`);
  container.style.setProperty("--resume-body-font-size", `${state.layoutSettings.bodySize}px`);
  container.style.setProperty("--resume-name-font-size", `${state.layoutSettings.nameSize}px`);
  container.style.setProperty("--resume-body-line-height", (state.layoutSettings.lineHeight / 100).toString());
  console.log("\u{1F3A8} Calling renderResume...");
  renderResume(state.resumeData, container);
  console.log("\u2705 renderResume completed");
  measureFullness();
}
function measureFullness() {
  const container = document.getElementById("resume-container");
  const originalHeightStyle = container.style.height;
  const originalMinHeightStyle = container.style.minHeight;
  container.style.height = "auto";
  container.style.minHeight = "0px";
  const height = container.offsetHeight;
  container.style.height = originalHeightStyle;
  container.style.minHeight = originalMinHeightStyle;
  const A4_HEIGHT = 1123;
  const percent = Math.round(height / A4_HEIGHT * 100);
  const usagePercent = document.getElementById("usage-percent");
  const usageBar = document.getElementById("usage-bar");
  const overflowLine = document.getElementById("overflow-line");
  usagePercent.textContent = `${percent}%`;
  usageBar.style.width = `${Math.min(percent, 100)}%`;
  if (height > A4_HEIGHT) {
    usageBar.classList.add("overflow");
    overflowLine.style.display = "block";
  } else {
    usageBar.classList.remove("overflow");
    overflowLine.style.display = "none";
  }
}
function runAutoFit() {
  const baseSettings = JSON.parse(JSON.stringify(state.layoutSettings));
  let low = 0.6;
  let high = 1.4;
  let bestScale = 1;
  for (let i = 0; i < 12; i++) {
    const mid = (low + high) / 2;
    applyScale(mid, baseSettings);
    const container = document.getElementById("resume-container");
    container.style.setProperty("--resume-margin-x", `${state.layoutSettings.marginX}px`);
    container.style.setProperty("--resume-margin-y", `${state.layoutSettings.marginY}px`);
    container.style.setProperty("--resume-section-spacing", `${state.layoutSettings.sectionSpacing}px`);
    container.style.setProperty("--resume-entry-spacing", `${state.layoutSettings.entrySpacing}px`);
    container.style.setProperty("--resume-body-font-size", `${state.layoutSettings.bodySize}px`);
    container.style.setProperty("--resume-name-font-size", `${state.layoutSettings.nameSize}px`);
    renderResume(state.resumeData, container);
    const originalHeightStyle = container.style.height;
    container.style.height = "auto";
    container.style.minHeight = "0px";
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
function applyScale(scale, base) {
  state.layoutSettings.marginX = Math.round(base.marginX * scale);
  state.layoutSettings.marginY = Math.round(base.marginY * scale);
  state.layoutSettings.sectionSpacing = Math.round(base.sectionSpacing * scale);
  state.layoutSettings.entrySpacing = Math.round(base.entrySpacing * scale);
  state.layoutSettings.bodySize = Math.round(base.bodySize * scale);
  state.layoutSettings.nameSize = Math.round(base.nameSize * scale);
}
function syncSlidersToState() {
  const sliderConfigs = [
    { id: "margin-x", key: "marginX", unit: "px" },
    { id: "margin-y", key: "marginY", unit: "px" },
    { id: "section-spacing", key: "sectionSpacing", unit: "px" },
    { id: "entry-spacing", key: "entrySpacing", unit: "px" },
    { id: "body-size", key: "bodySize", unit: "px" },
    { id: "name-size", key: "nameSize", unit: "px" },
    { id: "line-height", key: "lineHeight", unit: "", factor: 100 }
  ];
  sliderConfigs.forEach((s) => {
    const slider = document.getElementById(`slider-${s.id}`);
    const valDisplay = document.getElementById(`val-${s.id}`);
    const val = state.layoutSettings[s.key];
    slider.value = val.toString();
    valDisplay.textContent = s.factor ? (val / s.factor).toFixed(1) : `${val}${s.unit}`;
  });
}
function saveState() {
  localStorage.setItem("resume_studio_state_v1", JSON.stringify(state));
}
function loadState() {
  const saved = localStorage.getItem("resume_studio_state_v1");
  if (saved) {
    try {
      state = JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load state", e);
    }
  }
}
function exportJSON() {
  const blob = new Blob([JSON.stringify(state.resumeData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `resume-${(state.resumeData.personal.name || "document").replace(/\s+/g, "-").toLowerCase()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
function importJSON(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (re) => {
    try {
      const data = JSON.parse(re.target?.result);
      state.resumeData = data;
      syncFormFromState();
      updatePreview();
      saveState();
    } catch (err) {
      alert("Invalid JSON file");
    }
  };
  reader.readAsText(file);
}
function updateCodeEditor() {
  const jsonEditor = document.getElementById("json-editor");
  jsonEditor.value = JSON.stringify(state.resumeData, null, 2);
}
var currentAnalysis = null;
function openAIModal(expIdx, hIdx) {
  const originalText = state.resumeData.experience[expIdx].highlights[hIdx];
  document.getElementById("original-bullet-text").textContent = originalText;
  document.getElementById("ai-modal").style.display = "flex";
  document.getElementById("ai-modal-loading").style.display = "flex";
  document.getElementById("ai-modal-content").style.display = "none";
  setTimeout(() => {
    const jd = document.getElementById("target-jd").value;
    const suggestions = enhanceBulletPoint(originalText, jd);
    const container = document.getElementById("ai-suggestions");
    container.innerHTML = "";
    suggestions.forEach((s) => {
      const card = document.createElement("div");
      card.className = "suggestion-card";
      card.innerHTML = `<p class="suggestion-text">${s}</p>`;
      card.onclick = () => {
        state.resumeData.experience[expIdx].highlights[hIdx] = s;
        renderExperienceList();
        updatePreview();
        saveState();
        document.getElementById("ai-modal").style.display = "none";
      };
      container.appendChild(card);
    });
    document.getElementById("ai-modal-loading").style.display = "none";
    document.getElementById("ai-modal-content").style.display = "block";
  }, 500);
}
function analyzeResumeAction() {
  currentAnalysis = analyzeResume(state.resumeData);
  const modal = document.getElementById("analysis-modal");
  const loading = document.getElementById("analysis-loading");
  const content = document.getElementById("analysis-content");
  modal.style.display = "flex";
  loading.style.display = "flex";
  content.style.display = "none";
  setTimeout(() => {
    if (!currentAnalysis) return;
    document.getElementById("overall-score").textContent = currentAnalysis.overallScore.toString();
    document.getElementById("clarity-score").textContent = currentAnalysis.categoryScores.clarity.toString();
    document.getElementById("impact-score").textContent = currentAnalysis.categoryScores.impact.toString();
    document.getElementById("ats-score").textContent = currentAnalysis.categoryScores.atsCompatibility.toString();
    document.getElementById("formatting-score").textContent = currentAnalysis.categoryScores.formatting.toString();
    const strengthsList = document.getElementById("strengths-list");
    strengthsList.innerHTML = currentAnalysis.strengths.map((s) => `<li>\u2705 ${s}</li>`).join("");
    const weaknessesList = document.getElementById("weaknesses-list");
    weaknessesList.innerHTML = currentAnalysis.weaknesses.map((w) => `<li>\u26A0\uFE0F ${w}</li>`).join("");
    const suggestionsList = document.getElementById("suggestions-list");
    suggestionsList.innerHTML = currentAnalysis.suggestions.map((s) => `
            <div class="suggestion-item">
                <span class="suggestion-type type-${s.type}">${s.type.toUpperCase()}</span>
                <p class="suggestion-desc">${s.suggestion}</p>
                <p class="suggestion-explanation">${s.explanation}</p>
            </div>
        `).join("");
    loading.style.display = "none";
    content.style.display = "block";
  }, 800);
}
function checkATSAction() {
  const atsResult = checkATSCompatibility(state.resumeData);
  const modal = document.getElementById("ats-modal");
  const scoreDisplay = document.getElementById("ats-score-display");
  const issuesList = document.getElementById("ats-issues-list");
  const recommendationsList = document.getElementById("ats-recommendations-list");
  modal.style.display = "flex";
  let scoreColor = "#30d158";
  if (atsResult.score < 70) scoreColor = "#e94560";
  else if (atsResult.score < 85) scoreColor = "#f5a623";
  scoreDisplay.innerHTML = `
        <div class="ats-score-circle" style="border-color: ${scoreColor}">
            <span style="color: ${scoreColor}">${atsResult.score}</span>
        </div>
        <p>ATS Compatibility Score</p>
    `;
  if (atsResult.issues.length > 0) {
    issuesList.innerHTML = atsResult.issues.map((issue) => `<li>\u274C ${issue}</li>`).join("");
    document.getElementById("ats-issues-section").style.display = "block";
  } else {
    document.getElementById("ats-issues-section").style.display = "none";
  }
  if (atsResult.recommendations.length > 0) {
    recommendationsList.innerHTML = atsResult.recommendations.map((rec) => `<li>\u{1F4A1} ${rec}</li>`).join("");
  } else {
    recommendationsList.innerHTML = "<li>\u{1F389} Your resume is well-optimized for ATS!</li>";
  }
}

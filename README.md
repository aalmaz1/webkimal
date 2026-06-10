# Pretext-based Interactive Resume Engine

A professional, type-safe resume generation system built on the **Pretext layout engine**. This project transforms structured JSON data into precise, print-ready document layouts with dynamic theming and robust export capabilities.

---

## 🚀 How to Run

Follow these steps to set up and run the project locally:

### 1. Prerequisites
Ensure you have the following installed:
- **Node.js** (v14 or later)
- **npm** or **yarn** package manager
- A modern web browser (Chrome, Firefox, or Edge recommended for print testing)

### 2. Installation
Clone the repository or navigate to your project directory in the terminal:
```bash
cd /path/to/your/project
```

Install the necessary dependencies:
```bash
npm install
# OR
yarn install
```

### 3. Compilation
Compile the TypeScript source code into JavaScript:
```bash
npx tsc
# OR if you have TypeScript installed globally
tsc
```

### 4. Running the Application
Open the `index.html` file in your browser. If you are using a development server (recommended for proper module loading):
```bash
# Example using live-server
npx live-server
# Or using Vite/Webpack if configured
npm run dev
```
Navigate to `http://localhost:8080` (or the port indicated in your terminal) to view the application.

---

## ✨ Feature Highlights

This project implements three core functional modules that demonstrate advanced web programming concepts:

### 1. JSON-to-Layout Resume Builder (`renderResume`)
- **Functionality**: Parses a strictly typed JSON object containing personal details, education, and experience, then maps this data directly to Pretext layout primitives (`PositionedBlock`, `LayoutLine`).
- **Value**: Eliminates the need for rigid HTML templates. It dynamically constructs the document structure based on data volume, ensuring pixel-perfect typography and alignment regardless of content length.

### 2. Dynamic Theme Switcher System
- **Functionality**: A real-time UI control that toggles CSS Custom Properties (variables) to switch between distinct visual styles: *Classic*, *Modern*, and *Minimalist*.
- **Value**: Empowers users to customize the resume's aesthetic to match specific industry standards (e.g., conservative for law, bold for design) without reloading the page or altering the underlying data.

### 3. Print-to-PDF Optimization (`printResume`)
- **Functionality**: Triggers the browser's native print dialog while applying a specialized `@media print` stylesheet. This style sheet hides UI controls (buttons, selectors), forces A4 page dimensions, and ensures background colors and fonts are preserved.
- **Value**: Provides a seamless "Export to PDF" workflow, ensuring the digital preview matches the final printed document exactly, a critical requirement for professional resume submission.

---

## 🤝 Contribution and AI Usage

### Development Methodology
This project was developed using an **iterative agile approach**, focusing on modular architecture and strict type safety. The core logic relies on the **Pretext layout engine**, utilizing its low-level primitives to achieve high-fidelity document rendering that standard DOM manipulation cannot easily provide.

### Role of AI Assistance
The development process was significantly accelerated through collaboration with **Qwen (AI)**. AI support was utilized in the following capacities:
- **Architecture Design**: Structuring the modular separation between data parsing (`resume-builder.ts`), theming (`resume-themes.ts`), and print utilities.
- **TypeScript Implementation**: Generating strict interfaces and helper functions to ensure type safety and reduce runtime errors.
- **CSS Optimization**: Crafting efficient CSS variable structures for the theme system and precise `@media print` queries for cross-browser compatibility.
- **Code Refinement**: Iteratively reviewing and refining code blocks to adhere to best practices in performance and readability.

*Note: All final logic integration, feature validation, and academic reporting were performed by the student to ensure alignment with course objectives.*

---

## 📄 Project Structure

```
/workspace
├── index.html          # Main HTML entry point with UI controls
├── main.ts             # Application initialization and event handling
├── resume-builder.ts   # Core JSON-to-layout rendering engine
├── resume-themes.ts    # Theme definitions and switcher logic
├── print-utils.ts      # Print-to-PDF functionality
├── tsconfig.json       # TypeScript configuration
└── dist/               # Compiled JavaScript output
```

---

## 🎓 Academic Compliance

This project fulfills the Kongju National University Web Programming final exam requirements:
- ✅ **At least 3 new functions**: `renderResume()`, `ThemeSwitcher` class methods, `printResume()`
- ✅ **Practically valuable features**: All three functions provide real-world utility for resume creation
- ✅ **UI/UX improvements**: Dynamic theme switching, responsive layout, print optimization
- ✅ **Type safety**: Strict TypeScript typing throughout the codebase
- ✅ **Modular architecture**: Clean separation of concerns between modules

---

## License
This project is submitted as a final examination requirement for the Web Programming course at Kongju National University.

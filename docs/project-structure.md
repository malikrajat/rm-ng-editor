# Project Structure

This document explains the codebase organization and file structure of `rm-ng-editor`.

## Table of Contents

- [Repository Structure](#repository-structure)
- [Library Structure](#library-structure)
- [Demo Application](#demo-application)
- [Build Output](#build-output)
- [Configuration Files](#configuration-files)
- [Key Directories](#key-directories)

## Repository Structure

```
rm-ng-editor-main/
├── .angular/                  # Angular build cache
├── .github/                   # GitHub configuration
│   ├── copilot-instructions.md
│   └── workflows/
│       └── ci.yml             # Format, lint, type-check, build and Vitest suite
├── .vscode/                   # VS Code settings (extensions, launch, tasks)
├── dist/                      # Build output
│   ├── demo/                  # Built demo application
│   └── rm-ng-editor/          # Published package
├── docs/                      # Documentation (this folder)
│   ├── README.md
│   ├── installation.md
│   ├── usage.md
│   ├── api-reference.md
│   ├── architecture.md
│   ├── project-structure.md
│   ├── core-concepts.md
│   ├── advanced-configuration.md
│   ├── best-practices.md
│   ├── performance-optimization.md
│   ├── browser-support.md
│   ├── troubleshooting.md
│   ├── faq.md
│   ├── peer-dependencies.md
│   ├── versioning-and-breaking-changes.md
│   ├── changelog.md
│   └── extending-the-project.md
├── examples/                  # Copy-paste examples (see examples/README.md)
├── node_modules/              # Dependencies
├── projects/                  # Angular projects
│   ├── demo/                  # Demo application
│   └── rm-ng-editor/          # Library source
├── .editorconfig              # Editor configuration
├── .gitignore                 # Git ignore rules
├── .npmignore                 # npm publish ignore rules
├── .prettierignore            # Prettier ignore rules
├── .prettierrc                # Prettier configuration (HTML/SCSS)
├── angular.json               # Angular CLI configuration
├── biome.jsonc                # Biome lint/format configuration
├── CHANGELOG.md               # Version history
├── CI-BRANCH-POLICY.md        # Which Git refs are allowed to run CI
├── eslint.config.js           # ESLint flat config (ESM)
├── LICENSE                    # MIT License
├── package.json               # Root package.json
├── pnpm-lock.yaml             # pnpm lockfile
├── README.md                  # Root README
└── tsconfig.json              # TypeScript root config
```

## Library Structure

### Source Code (`projects/rm-ng-editor/`)

```
rm-ng-editor/
├── src/
│   ├── lib/                                   # Library code
│   │   ├── rm-ng-editor.ts                    # Main component (3004 lines)
│   │   ├── rm-ng-editor.component.html        # Template (945 lines)
│   │   ├── rm-ng-editor.component.scss        # Styles
│   │   ├── rm-ng-editor.interfaces.ts         # Type definitions (605 lines)
│   │   ├── rm-ng-editor.service.ts            # Utility service (1624 lines)
│   │   ├── rm-ng-editor.component.spec.ts     # Component specs
│   │   ├── rm-ng-editor.configuration.spec.ts # Configuration specs
│   │   ├── rm-ng-editor.table.spec.ts         # Table specs
│   │   ├── rm-ng-editor.service.spec.ts       # Service specs
│   │   ├── rm-ng-editor.service-utils.spec.ts # Service utility specs
│   │   ├── state-management/                  # Internal (not exported)
│   │   │   ├── index.ts
│   │   │   ├── circular-update-guard.ts
│   │   │   ├── staleness-aware-signals.ts
│   │   │   ├── resource-cleanup-manager.ts
│   │   │   ├── state-management.spec.ts
│   │   │   └── state-management-cleanup.spec.ts
│   │   └── media-embeds/                      # Internal (not exported)
│   │       ├── index.ts
│   │       ├── media-embed-validator.ts
│   │       ├── embed-preview-manager.ts
│   │       ├── responsive-embed-container.ts
│   │       ├── broken-embed-handler.ts
│   │       ├── media-embeds.spec.ts
│   │       └── media-embeds-preview.spec.ts
│   ├── public-api.ts                          # Public API exports
│   ├── test-setup.ts                          # Vitest global setup (jsdom shims)
│   └── jasmine-compat.d.ts                    # Ambient types for the compat globals
├── assets/                                    # README artwork (demo.png, demo1.png, generate-hero.py)
├── ng-package.json                            # ng-packagr configuration
├── package.json                               # Library package.json
├── tsconfig.lib.json                          # Build TypeScript config
├── tsconfig.lib.prod.json                     # Production build config
└── tsconfig.spec.json                         # Test TypeScript config
```

There is no changelog, licence or readme inside `projects/rm-ng-editor/` — the
changelog, licence and readme all live at the repository root. The one asset
folder in the repository also lives here: `assets/` holds `demo1.png` (light
hero), `demo.png` (dark hero) and `generate-hero.py`, and `ng-package.json`
copies it to `assets/` in the published package.

### File Breakdown

#### `rm-ng-editor.ts` (Main Component) - 3,004 lines

The core component containing:

- **Imports & setup**
  - Angular core imports
  - Interface imports
  - Injection token definitions (`EDITOR_DEFAULT_CONFIG`, `EDITOR_DEFAULT_ICONS`,
    `EDITOR_PERFORMANCE_CONFIG`)

- **Component class**
  - Signal inputs (`config`, `value`) and signal outputs (`valueChange`,
    `focusEvent`, `blurEvent`, `stateChange`, `wordCountChange`,
    `spellCheckResults`, `fullScreenChange`, `themeChange`, `tableInsert`,
    `tableModify`)
  - Public signals (content, toolbar state, validation stats, table state, …)
  - Constructor and performance-manager factory
  - Lifecycle hooks and `DestroyRef` cleanup registration
  - Safe wrappers (`safeTimeout`, `safeInterval`, `safeAddEventListener`)
  - Debounced operations (editor state, word count, spell check)
  - Editor commands (`execCommand`, formatting methods)
  - Content manipulation, link handling and media embeds
  - Table operations
  - HTML source editing, validation and spell check

#### `rm-ng-editor.component.html` - 945 lines

Template structure:

```html
<!-- Host wrapper -->
<div
  class="ng-rm-editor-wrapper"
  [class.disabled]="disabled()"
  [class.full-screen]="isFullScreen()"
  [class.distraction-free]="isDistractionFree()"
  [attr.data-theme]="currentTheme()"
>
  <!-- Toolbar Section -->
  <div class="toolbar" #toolbar role="toolbar" id="editor-toolbar">
    <!-- Text Formatting Tools -->
    <!-- Font Controls -->
    <!-- Alignment Tools -->
    <!-- List Controls -->
    <!-- Link & Media Tools -->
    <!-- Table Tools -->
    <!-- View Mode Controls -->
  </div>

  <!-- Content Editable Area -->
  <div class="editor-content" contenteditable="true" role="textbox">
    <!-- User content -->
  </div>

  <!-- Validation statistics -->
  <div class="validation-stats"><!-- word count, character count, reading time --></div>

  <!-- Conditional panels -->
  <!-- Spell-check suggestions (class="spell-check-suggestions") -->
  <!-- Validation errors (class="validation-errors") -->
  <!-- HTML edit modal (class="html-edit-modal") -->
  <!-- Shortcuts modal (class="shortcuts-modal") -->
</div>
```

#### `rm-ng-editor.component.scss`

Styling organization:

```scss
// Variables
// Mixins
// Base editor styles
// Toolbar styles
// Content area styles
// Statistics panel styles
// Modal styles
// Theme styles (light/dark)
// Responsive styles
```

#### `rm-ng-editor.interfaces.ts` - 605 lines

Type definitions:

- `EditorConfig` - Main configuration (11 optional properties)
- `ToolbarConfig` - Toolbar features (74 optional flags)
- `ToolbarIcons` - Icon customization (55 optional icon keys)
- `ValidationConfig` - Content validation
- `ThemeConfig` - Theme settings
- `FullScreenConfig` - Full-screen mode
- `TableConfig` - Table features
- `EditorState` - Editor state
- `LinkData` - Link information
- `LinkPreview` - Link preview metadata
- `MediaEmbedData` - Media embed data
- `TableData`, `TableCell`, `TableStyle`, `CellStyle` - Table structures
- `WordCountStats` - Statistics (`words`, `characters`, `charactersNoSpaces`,
  `paragraphs`, `sentences`, `readingTime`)
- `SpellCheckSuggestion` - Spell-check results
- `KeyboardShortcutConfig`, `PlatformKeyboardConfig` - Keyboard configuration
- Default configurations

#### `rm-ng-editor.service.ts` - 1624 lines

Utility methods:

- `htmlToText()` - HTML to plain text
- `sanitizeHtml()` - XSS prevention
- `getWordCount()` - Word counting
- `getCharacterCount()` - Character counting
- `extractHeadings()` - Heading extraction
- `validateContent()` - Validation
- `convertToFormat()` - Format conversion (`'text' | 'markdown'`)

#### `public-api.ts` - Entry Point

```typescript
// Public API Surface of rm-ng-editor
export * from './lib/rm-ng-editor';
export * from './lib/rm-ng-editor.service';
export * from './lib/rm-ng-editor.interfaces';
```

Three exported entry points, nothing else. `src/lib/state-management/*` and
`src/lib/media-embeds/*` are internal and are **not** re-exported.

## Demo Application

### Structure (`projects/demo/`)

```
demo/
├── src/
│   ├── app/
│   │   ├── app.ts                 # Main demo component (class `App`)
│   │   ├── app.html               # Demo template
│   │   ├── app.scss               # Demo styles
│   │   ├── app.config.ts          # Application config (provideRouter, ...)
│   │   └── app.routes.ts          # Routes
│   ├── index.html                 # HTML entry point
│   ├── main.ts                    # Bootstrap file (provideZonelessChangeDetection)
│   └── styles.scss                # Global styles
├── public/                        # Static assets (favicon.ico)
├── tsconfig.app.json              # App TypeScript config
└── tsconfig.spec.json             # Test TypeScript config
```

### Purpose

The demo application showcases:

- All editor features
- Configuration examples
- Integration patterns
- Real-world usage

### Running the Demo

```bash
pnpm start
# or
pnpm run serve:demo
```

## Build Output

### Distribution (`dist/rm-ng-editor/`)

After building (`pnpm run build:lib`), the output structure is:

```
dist/rm-ng-editor/
├── fesm2022/
│   ├── codewithrajat-rm-ng-editor.mjs
│   └── codewithrajat-rm-ng-editor.mjs.map
├── types/
│   └── codewithrajat-rm-ng-editor.d.ts
└── package.json
```

### Output Files

- **FESM (Flattened ES Modules)**: the single bundle modern bundlers consume
- **Source map**: `fesm2022/codewithrajat-rm-ng-editor.mjs.map`
- **Type declarations**: `types/codewithrajat-rm-ng-editor.d.ts`
- **Package metadata**: the generated `package.json` that points at both

No UMD bundle, no `esm2022/` folder, no copied README/CHANGELOG/LICENCE files are
emitted into `dist/rm-ng-editor/`.

## Configuration Files

### `angular.json`

Angular CLI configuration:

```json
{
  "projects": {
    "demo": {
      "projectType": "application",
      "root": "projects/demo"
    },
    "rm-ng-editor": {
      "projectType": "library",
      "root": "projects/rm-ng-editor"
    }
  }
}
```

### `package.json` (Root)

Private workspace package. It pins the package manager and defines every script:

```json
{
  "name": "rm-ng-editor-main",
  "version": "1.0.0",
  "packageManager": "pnpm@10.11.1",
  "type": "module",
  "private": true,
  "scripts": {
    "ng": "ng",
    "start": "ng serve demo",
    "build": "ng build",
    "build:demo": "ng build demo",
    "build:lib": "ng build rm-ng-editor && node copy-extra-files.js",
    "build:all": "pnpm run build:lib && ng build demo",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "test:demo": "ng test demo",
    "test:lib": "ng test rm-ng-editor",
    "test:lib:watch": "ng test rm-ng-editor --watch",
    "test:lib:coverage": "ng test rm-ng-editor --coverage",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "lint:eslint": "eslint .",
    "typecheck": "tsc -p projects/rm-ng-editor/tsconfig.lib.json --noEmit --inlineSources false && tsc -p projects/rm-ng-editor/tsconfig.spec.json --noEmit && tsc -p projects/demo/tsconfig.app.json --noEmit && tsc -p projects/demo/tsconfig.spec.json --noEmit",
    "format": "biome format --write . && prettier --write \"projects/**/*.{html,scss}\" \".github/**/*.{yml,yaml}\"",
    "format:check": "biome format . && prettier --check \"projects/**/*.{html,scss}\" \".github/**/*.{yml,yaml}\"",
    "format:biome": "biome format --write .",
    "format:biome:check": "biome format .",
    "format:prettier": "prettier --write \"projects/**/*.{html,scss}\" \".github/**/*.{yml,yaml}\"",
    "format:prettier:check": "prettier --check \"projects/**/*.{html,scss}\" \".github/**/*.{yml,yaml}\"",
    "serve:demo": "ng serve demo"
  }
}
```

### `package.json` (Library)

Published package:

```json
{
  "name": "@codewithrajat/rm-ng-editor",
  "version": "1.0.0",
  "peerDependencies": {
    "@angular/common": ">=16.0.0 <=26.0.0",
    "@angular/core": ">=16.0.0 <=26.0.0"
  },
  "dependencies": {
    "tslib": "^2.6.0"
  }
}
```

### `tsconfig.json`

Root TypeScript configuration. It is strict, compiles to `ES2022`, and maps the
`rm-ng-editor` specifier to the built package:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "isolatedModules": true,
    "target": "ES2022",
    "module": "preserve",
    "experimentalDecorators": true,
    "importHelpers": true,
    "paths": {
      "rm-ng-editor": ["./dist/rm-ng-editor"]
    }
  },
  "angularCompilerOptions": {
    "strictTemplates": true
  },
  "files": [],
  "references": [
    { "path": "./projects/demo/tsconfig.app.json" },
    { "path": "./projects/demo/tsconfig.spec.json" },
    { "path": "./projects/rm-ng-editor/tsconfig.lib.json" },
    { "path": "./projects/rm-ng-editor/tsconfig.spec.json" }
  ]
}
```

### `.prettierrc`

Prettier only formats HTML and SCSS (Biome handles JS/TS/JSON). Its configuration
lives in `.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "overrides": [
    { "files": "*.html", "options": { "parser": "angular" } },
    { "files": "*.scss", "options": { "parser": "scss" } }
  ]
}
```

### `eslint.config.js`

Angular 22 workspaces use flat ESM config, so this file uses `import`/`export default`
rather than `module.exports`:

```javascript
// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', '.angular/**', 'coverage/**'],
  },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
  }
);
```

## Key Directories

### `/docs` - Documentation

All project documentation:
- User guides
- API reference
- Architecture docs
- Best practices

### `/projects` - Source Code

**Monorepo structure:**
- `demo/` - Demo application
- `rm-ng-editor/` - Library source

### `/dist` - Build Artifacts

**Generated files:**
- Published npm package
- Build outputs
- Type declarations

### `/.vscode` - VS Code

**IDE configuration:**
- Settings
- Launch configurations
- Recommended extensions

### `/.github` - GitHub

**Repository config:**
- `.github/workflows/ci.yml` — the CI pipeline (`guard`, then format checks, Biome
  lint, ESLint, type-check, library build, demo build and the Vitest suites for the
  library and the demo, then a tag-only `publish` job)
- `.github/dependabot.yml` — grouped weekly dependency and GitHub Actions updates
- `.github/copilot-instructions.md`

### Root policies

- `CI-BRANCH-POLICY.md` documents which Git refs (pushes to `main`, pull requests
  targeting `main`, tags reachable from `main`) are allowed to run CI, what the
  pipeline runs, and how a `v*` tag is published to npm.

## Public vs Internal Boundaries

### Public API (Exported)

From `public-api.ts`:
- ✅ `RmNgEditor` component
- ✅ `RmNgEditorService` service
- ✅ All interfaces and exported classes from `rm-ng-editor.interfaces.ts`
- ✅ Injection tokens `EDITOR_DEFAULT_CONFIG`, `EDITOR_DEFAULT_ICONS`,
  `EDITOR_PERFORMANCE_CONFIG`
- ✅ Default configuration constants (`DEFAULT_TOOLBAR_CONFIG`,
  `DEFAULT_TOOLBAR_ICONS`, `DEFAULT_THEME_CONFIG`, `DEFAULT_FULLSCREEN_CONFIG`,
  `DEFAULT_VALIDATION_CONFIG`, `DEFAULT_TABLE_CONFIG`)

### Internal Implementation (Not Exported)

- ❌ `src/lib/state-management/*`
- ❌ `src/lib/media-embeds/*`
- ❌ Private methods and properties
- ❌ Internal utilities and helper functions
- ❌ Template/style files (bundled)

## File Size Analysis

### Source Files

Verified line counts:

| File | Lines | Purpose |
|------|-------|---------|
| `rm-ng-editor.ts` | 3004 | Main component |
| `rm-ng-editor.interfaces.ts` | 605 | Types |
| `rm-ng-editor.service.ts` | 1624 | Service |
| `rm-ng-editor.component.html` | 945 | Template |

No byte-size or bundle-size figures are published — measure them from your own build
(`pnpm run build:lib`, then inspect `dist/rm-ng-editor/`).

## Development Workflow

```
1. Edit source files in projects/rm-ng-editor/src/lib/
        │
        ▼
2. Build library: pnpm run build:lib
        │
        ▼
3. Output to dist/rm-ng-editor/
        │
        ▼
4. Test in demo: pnpm start
        │
        ▼
5. Publish: npm publish ./dist/rm-ng-editor   # publishes @codewithrajat/rm-ng-editor
   # or let CI do it: git tag v1.2.0 && git push origin v1.2.0
```

### Test Tooling

Unit tests run on **Vitest** through the `@angular/build:unit-test` builder
(`runner: "vitest"`, jsdom environment, setup file
`projects/rm-ng-editor/src/test-setup.ts`). This workspace has no browser-based test
runner — the specs are Vitest specs that also see a small Jasmine-compatibility shim
(`spyOn`, `jasmine.any`, …) installed by the setup file. Coverage thresholds are
statements 90, branches 80, functions 90, lines 90.

## Next Steps

- **[Architecture](./architecture.md)**: Understand system design
- **[Core Concepts](./core-concepts.md)**: Learn key concepts
- **[Extending](./extending-the-project.md)**: Add custom features

---

**Structure Version**: 1.0  
**Last Updated**: July 2026

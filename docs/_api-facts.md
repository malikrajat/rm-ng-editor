# rm-ng-editor — verified API and project reference

A maintainer's reference describing what this repository **actually** exports,
supports and runs, as opposed to what documentation elsewhere may have claimed.

Use it when writing or reviewing docs, examples or the README: every fact here was
read out of the source, `package.json`, `angular.json`, the lockfile or the CI
workflow, so it is the authoritative description of the current state. Where the
code and the prose disagree, the code wins and this file records which.

Scope notes:

- It also lists common mistakes that used to appear in this project's docs, so
  that they are not reintroduced.
- Internal folders (`state-management/`, `media-embeds/`) are deliberately
  described as non-public.
- It is a developer reference, not end-user documentation.

---

## 1. Version matrix — verified

| Item | Verified value | Source |
|------|---------------|--------|
| Angular framework | **22.0.4** | `pnpm-lock.yaml` (root importer), `package.json` `^22.0.4` |
| Angular CLI / `@angular/build` | **22.0.5** | `package.json` `^22.0.5`, lockfile |
| `@angular/compiler-cli` | 22.0.4 | `package.json` `^22.0.4` |
| TypeScript | **6.0.3** | `package.json` `~6.0.3`, lockfile |
| Node.js | **22+** | `.github/workflows/ci.yml` (`NODE_VERSION: '22'`) |
| pnpm | **10.11.1** | `package.json` `packageManager`, CI `PNPM_VERSION` |
| ng-packagr | 22.0.1 | `package.json` |
| Vitest | 4.1.9 / `^4.0.8` | `package.json`, lockfile |
| Builders | `@angular/build:application`, `@angular/build:dev-server`, `@angular/build:ng-packagr`, `@angular/build:unit-test` (runner `vitest`) | `angular.json` |
| Angular compiler targets | `target: ES2022`, `module: preserve` | `tsconfig.json` |
| TypeScript strict extras | `strict`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `isolatedModules`, Angular `strictTemplates` | `tsconfig.json` |
| Zoneless API | `provideZonelessChangeDetection()` — **stable, not experimental** | `projects/demo/src/main.ts` |

### Supported Angular range for the published library

`projects/rm-ng-editor/package.json` declares:

```json
"peerDependencies": {
  "@angular/common": ">=16.0.0 <=26.0.0",
  "@angular/core": ">=16.0.0 <=26.0.0"
}
```

The library's own published description says "Supports Angular 16-26".
Note honestly that the workspace is built and tested on Angular 22 only; the
16–26 range is the declared peer range. Do **not** claim "Angular 21+" or
"requires Angular 21" anymore.

- Never claim `provideExperimentalZonelessChangeDetection` — it was removed;
  the stable name is `provideZonelessChangeDetection`.
- Never claim TypeScript 5.9.2 or pnpm 10.15.1 — they are wrong.
- Do not invent Node/TS minimums beyond the verified table. TypeScript 6.0.3 is
  what the workspace uses; Angular 22 requires TS >= 5.9, so "TypeScript 5.9+"
  is acceptable phrasing where a floor is needed.

## 2. Package identity

| Item | Value |
|------|-------|
| npm package | `@codewithrajat/rm-ng-editor` |
| Root workspace package | `rm-ng-editor-main` (private) |
| Library version | `1.0.0` |
| Runtime deps | `tslib` only (`^2.6.0`) |
| `sideEffects` | `false` |
| License | MIT |
| Repo | https://github.com/malikrajat/rm-ng-editor |
| npm URL | https://www.npmjs.com/package/@codewithrajat/rm-ng-editor |
| `engines` (published) | `node: ">=16.0.0"`, `npm: ">=8.0.0"` — note this is looser than the Node 22+ the workspace itself requires |

Import in consumer code: `from '@codewithrajat/rm-ng-editor'`.
Inside this workspace the demo imports from `../../../rm-ng-editor/src/public-api`.

## 3. Component API — `RmNgEditor` (verified against `rm-ng-editor.ts`)

Selector: `app-rm-ng-editor`. Standalone. `ChangeDetectionStrategy.OnPush`.
Lifecycle: implements `OnInit`, `OnDestroy`.

### Inputs (signal inputs — `input()`)

| Input | Type | Declared default | Notes |
|-------|------|------------------|-------|
| `config` | `EditorConfig \| null` | `null` | Configuration object |
| `value` | `string` | `''` | HTML content |

### Outputs (signal outputs — `output()`)

| Output | Payload |
|--------|---------|
| `valueChange` | `string` |
| `focusEvent` | `void` |
| `blurEvent` | `void` |
| `stateChange` | `EditorState` |
| `wordCountChange` | `WordCountStats` |
| `spellCheckResults` | `SpellCheckSuggestion[]` |
| `fullScreenChange` | `boolean` |
| `themeChange` | `string` |
| `tableInsert` | `TableData` |
| `tableModify` | `TableData` |

There is **no** `focus` output, **no** `blur` output and **no** `wordCountUpdate`
output. Use the exact names above.

### Public signals (readable from templates / `viewChild` refs)

`content`, `disabled`, `placeholder`, `height`, `maxHeight`, `showToolbar`,
`toolbarConfig`, `toolbarIcons`, `editorState`, `wordCountStats`, `isFullScreen`,
`isDistractionFree`, `currentTheme`, `isHtmlEditMode`, `showShortcutsModal`,
`validationConfig`, `spellCheckSuggestions`, `selectedTable`, `tableConfig`,
`shouldShowStats`, `editorElement` (`viewChild.required`), `toolbarElement`.

### Component defaults (real values)

| Setting | Default |
|---------|---------|
| `placeholder` | `'Start typing...'` |
| `height` | `'300px'` |
| `maxHeight` | `'600px'` |
| `showToolbar` | `true` |
| `disabled` | `false` |
| `currentTheme` | `'light'` |
| `validationConfig` | `{ showWordCount: true, showCharacterCount: true, showReadingTime: true, spellCheck: { enabled: false, language: 'en-US', highlightErrors: true, showSuggestions: true } }` |
| `tableConfig` | `{ defaultRows: 3, defaultColumns: 3, allowResize: true }` (merged with `allowMerge: false` when `config.table` is provided) |
| debounce delay | `100` ms (`EDITOR_PERFORMANCE_CONFIG`) |
| chunk size | `1000`, `maxContentSize` 100000 |

### Public methods (verified — these exist)

**Commands / formatting**
`execCommand(command, value?)`, `setFontFamily(event)`, `setFontSize(event)`,
`setTextColor(event)`, `setHeading(event)`, `setAlignment(command)`,
`toggleList(command)`, `clearFormatting()`, `setHeadingByTag(tag)`,
`changeFontSize(delta)`

**Content**
`getContent(): string`, `setContent(content: string): void`,
`getTextContent(): string`, `isEmpty(): boolean`, `focus(): void`,
`blur(): void`, `refreshWordCount(): void`

**Insertion**
`insertPageBreak()`, `insertSectionDivider()`, `insertImage()`,
`insertVideo()`, `insertAudio()`, `insertLink()`, `editLink()`, `removeLink()`,
`insertTable(rows?, columns?)`, `insertRowAbove()`, `insertRowBelow()`,
`insertColumnLeft()`, `insertColumnRight()`, `deleteRow()`, `deleteColumn()`,
`splitCells()`, `resizeTableSmaller()`, `resizeTableLarger()`,
`resetTableSize()`, `deleteTable()`

**Media embeds**
`embedYouTube()`, `embedVimeo()`, `embedTwitter()`, `embedInstagram()`,
`embedCustomMedia()`, `generateLinkPreview(url)`

**View / theme**
`toggleFullScreen()`, `enterFullScreen()`, `exitFullScreen()`, `toggleTheme()`,
`setTheme(theme: 'light' | 'dark' | 'auto')`, `toggleDistractionFree()`

**HTML editing / a11y**
`toggleHtmlEdit()`, `getHtmlContent(): string`, `updateHtmlContent(event)`,
`applyHtmlChanges()`, `showKeyboardShortcuts()`, `hideKeyboardShortcuts()`

**Validation / spell check**
`isContentValid(): boolean`, `getValidationErrors(): string[]`,
`updateWordCount()`, `runSpellCheck()`, `toggleSpellCheck()`,
`acceptSpellingSuggestion(original, suggestion)`,
`ignoreSpellingSuggestion(word)`

**State / diagnostics**
`updateEditorState()`, `onContentChange()`, `onKeyDown(event)`, `onFocus()`,
`onBlur()`, `getPerformanceMetrics()`, `checkForMemoryLeaks()`

### Methods that DO NOT exist — never document them

`getHtmlContent()` exists, but there is **no** `getHtmlContent()`-style
`setHtmlContent()`. Specifically these are **fiction** and must be removed from
docs:

- `setHtmlContent(html)`
- `insertText(text)`
- `toggleBold()`, `toggleItalic()`, `toggleUnderline()`
- `insertList()`, `insertOrderedList()`, `insertUnorderedList()`
- `getWordCount()`, `getCharacterCount()` on the **component** (they exist on
  `RmNgEditorService`, not the component)
- any `ngModel` / `formControlName` support

### Forms integration — important correction

`RmNgEditor` does **not** implement `ControlValueAccessor`. Therefore
`[(ngModel)]`, `formControlName` and `[formControl]` do **not** work directly on
`<app-rm-ng-editor>`. Document the working pattern instead:

```html
<app-rm-ng-editor
  [config]="config()"
  [value]="form.controls.content.value ?? ''"
  (valueChange)="form.controls.content.setValue($event)"
/>
```

`(valueChange)` is **not** two-way bindable via `[(value)]` — there is no
`valueChange`-backed model input. Use the explicit `[value]` + `(valueChange)`
pair. (Angular's `[(value)]` banana-in-a-box would require a `valueChange`
output *and* a matching `value` input — technically the names line up, so
`[(value)]` does compile; but the input is a one-way signal input that does not
write back, so the docs must show the explicit pair as the recommended pattern
and must not present `[(ngModel)]` as supported.)

## 4. Interfaces and exported types

From `public-api.ts` → `rm-ng-editor.ts`, `rm-ng-editor.service.ts`,
`rm-ng-editor.interfaces.ts`:

**Interfaces:** `EditorConfig`, `EditorState`, `LinkData`, `MediaEmbedData`,
`LinkPreview`, `TableData`, `TableCell`, `TableStyle`, `CellStyle`,
`WordCountStats`, `SpellCheckSuggestion`, `ValidationConfig`, `ThemeConfig`,
`FullScreenConfig`, `TableConfig`, `ToolbarConfig`, `ToolbarIcons`,
`KeyboardShortcutConfig`, `PlatformKeyboardConfig`

**Classes:** `RmNgEditor`, `RmNgEditorService`, `KeyboardShortcutManager`,
`PlatformAwareShortcutHandler`, `KeyboardLayoutHandler`, `SpellCheckManager`,
`TableSelectionManager`, `CellMergeValidator`, `NestedTableSanitizer`

**Injection tokens:** `EDITOR_DEFAULT_CONFIG`, `EDITOR_DEFAULT_ICONS`,
`EDITOR_PERFORMANCE_CONFIG`

**Constants:** `DEFAULT_TOOLBAR_CONFIG`, `DEFAULT_TOOLBAR_ICONS`,
`DEFAULT_THEME_CONFIG`, `DEFAULT_FULLSCREEN_CONFIG`, `DEFAULT_VALIDATION_CONFIG`,
`DEFAULT_TABLE_CONFIG`

**Not exported:** `src/lib/state-management/*` and `src/lib/media-embeds/*` are
internal — do not document them as public API.

### `EditorConfig` — exact shape

```typescript
interface EditorConfig {
  placeholder?: string;
  disabled?: boolean;
  height?: string;
  maxHeight?: string;
  showToolbar?: boolean;
  enabledTools?: string[];
  toolbarConfig?: ToolbarConfig;
  validation?: ValidationConfig;
  theme?: ThemeConfig;
  fullScreen?: FullScreenConfig;
  table?: TableConfig;
}
```

**`toolbarIcons` is NOT a member of `EditorConfig`.** The component reads icons
from the `EDITOR_DEFAULT_ICONS` injection token and does a permissive cast on
the config (`(config as any)?.toolbarIcons`). Documenting
`config.toolbarIcons` is therefore inaccurate — to customise icons, override the
`EDITOR_DEFAULT_ICONS` token (a `ToolbarIcons` object) via providers.

**`enabledTools` and ToolbarConfig's `showLinkTarget`** are declared but not
consumed by the template or `isFeatureEnabled()`. Do not present them as
working features.

**`showBlockFormatting` is a no-op.** The template renders
`<div class="toolbar-group"></div>` — an *empty* group — when
`toolbarConfig().showBlockFormatting` is true. There is no blockquote, code-block
or `<pre>` toolbar button. `formatBlock` is only reachable via the heading
`<select>` (H1–H6 and paragraph) and the Alt+0…Alt+6 shortcuts. Do not document
blockquote/code-block toolbar support.

**`setContent(content)` sets the internal `content` signal but does NOT emit
`valueChange`.** It also does not write to the DOM. To push content in from the
outside, set the `value` input.

### `FullScreenConfig` — exact shape

```typescript
interface FullScreenConfig {
  enabled?: boolean;
  hideToolbarInFullScreen?: boolean;
  exitOnEscape?: boolean;
  distractionFree?: boolean;
}
```

There is no `escapeKey` and no `showToolbarInFullScreen` property.

### `ValidationConfig` — exact shape

```typescript
interface ValidationConfig {
  showWordCount?: boolean;
  showCharacterCount?: boolean;
  showReadingTime?: boolean;
  maxWords?: number;
  maxCharacters?: number;
  minWords?: number;
  minCharacters?: number;
  spellCheck?: {
    enabled?: boolean;
    language?: string;
    highlightErrors?: boolean;
    showSuggestions?: boolean;
    ignoredWords?: string[];
    customDictionary?: string[];
  };
}
```

Note: validation lives under `config.validation`, **not**
`config.validationConfig`.

### `DEFAULT_TOOLBAR_CONFIG` — real defaults

Every flag below is `true` in `DEFAULT_TOOLBAR_CONFIG` **except**
`showDistractionFree: false`:

`showTextFormatting, showBold, showItalic, showUnderline, showStrikethrough,`
`showScriptFormatting, showSubscript, showSuperscript, showFontControls,`
`showFontFamily, showFontSize, showColorControls, showTextColor, showHeadings,`
`showBlockFormatting, showAlignment, showAlignLeft, showAlignCenter,`
`showAlignRight, showAlignJustify, showLists, showUnorderedList,`
`showOrderedList, showIndent, showOutdent, showIndentIncrease, showUndoRedo,`
`showUndo, showRedo, showClearFormatting, showPageBreak, showSectionDivider,`
`showLinkMedia, showInsertLink, showEditLink, showRemoveLink, showLinkTarget,`
`showInsertImage, showInsertVideo, showInsertAudio, showMediaEmbed,`
`showYouTubeEmbed, showTwitterEmbed, showInstagramEmbed, showVimeoEmbed,`
`showCustomEmbed, showLinkPreview, showValidation, showWordCount,`
`showCharacterCount, showReadingTime, showSpellCheck, showViewMode,`
`showFullScreen, showThemeToggle, showTable, showInsertTable,`
`showTableProperties, showInsertRow, showInsertColumn, showDeleteRow,`
`showDeleteColumn, showMergeCells, showSplitCells, showTableResize,`
`showDeleteTable, showAccessibility, showHtmlEdit, showKeyboardShortcuts`

`showDistractionFree: false` (opt-in).

There are **no** `showInsertOrderedList`, `showInsertUnorderedList`,
`showJustifyLeft`, `showJustifyCenter`, `showJustifyRight`, `showJustifyFull`,
`showBackgroundColor`, `showImageInsert` properties. The correct names are
`showOrderedList`, `showUnorderedList`, `showAlignLeft`, `showAlignCenter`,
`showAlignRight`, `showAlignJustify`, `showInsertImage`.

## 5. Service API — `RmNgEditorService`

`@Injectable({ providedIn: 'root' })`. Public methods:

| Method | Signature |
|--------|-----------|
| `htmlToText` | `(html: string \| null \| undefined) => string` |
| `sanitizeHtml` | `(html: string \| null \| undefined) => string` |
| `getWordCount` | `(html: string \| null \| undefined) => number` |
| `getCharacterCount` | `(html: string \| null \| undefined) => number` |
| `extractHeadings` | `(html) => { level: number; text: string; id?: string }[]` |
| `validateContent` | `(html) => { isValid: boolean; errors: string[] }` |
| `convertToFormat` | `(html: string, format: 'text' \| 'markdown') => string` |

Internals worth knowing: `sanitizeHtml` strips
`script, object, embed, iframe, form, input, textarea, button, select, option,
frame, frameset, applet, meta, link[rel="import"]`, removes `on*` attributes,
`javascript:`/`vbscript:` values, `formaction`, non-image `data:` URIs,
dangerous CSS (`expression()`, `@import`, `behavior:`, `-moz-binding`), and caps
output at 1 MB (1024 × 1024) after serialization.
`getWordCount` handles CJK (1 word per character), emoji, zero-width chars.

`KeyboardShortcutManager` is a static utility class
(`initializeDefaults`, `registerShortcut`, `registerCustomShortcut`,
`getShortcut`, `handleKeyboardEvent`, `disableShortcut`, `enableShortcut`,
`isShortcutEnabled`, `getAllShortcuts`, `resetToDefaults`,
`getConflictingShortcuts`, `clearAllShortcuts`).
`PlatformAwareShortcutHandler` and `KeyboardLayoutHandler` are static too.
`SpellCheckManager` is a static debounce/dictionary helper.
`TableSelectionManager`, `CellMergeValidator`, `NestedTableSanitizer` are static
DOM helpers used by the table tools.

## 6. Real keyboard shortcuts (from `onKeyDown`)

Ctrl = ⌘ on macOS.

| Shortcut | Action |
|----------|--------|
| Ctrl+B / Ctrl+I / Ctrl+U | Bold / Italic / Underline |
| Ctrl+Shift+S | Strikethrough |
| Ctrl+= / Ctrl+Shift+= | Subscript / Superscript |
| Ctrl+Shift+L / E / R / J | Align left / center / right / justify |
| Ctrl+Shift+8 / Ctrl+Shift+7 | Bullet list / numbered list |
| Ctrl+K | Insert link |
| Ctrl+] / Ctrl+[ | Indent / outdent |
| Ctrl+Shift+T | Insert table |
| Ctrl+Z / Ctrl+Shift+Z / Ctrl+Y | Undo / redo / redo |
| Ctrl+\ | Clear formatting |
| Ctrl+Shift+. / Ctrl+Shift+, | Increase / decrease font size |
| Ctrl+Enter | Insert page break |
| Ctrl+Shift+H | Toggle HTML source edit |
| Alt+1…Alt+6 / Alt+0 | H1…H6 / paragraph |
| F1 | Show keyboard-shortcuts dialog |
| Escape | Close modal, else focus the editor |

## 7. DOM structure (for testing / e2e docs)

```html
<div class="ng-rm-editor-wrapper" [attr.data-theme]="theme">   <!-- host wrapper -->
  <div class="toolbar" role="toolbar" id="editor-toolbar"> … </div>
  <div class="editor-content" contenteditable="true" role="textbox"> … </div>
  <div class="validation-stats"> … </div>          <!-- when enabled -->
  <div class="spell-check-suggestions"> … </div>   <!-- when enabled + results -->
  <div class="validation-errors"> … </div>         <!-- when invalid -->
  <div class="html-edit-modal"> … </div>           <!-- when open -->
  <div class="shortcuts-modal"> … </div>           <!-- when open -->
</div>
```

The host element is `<app-rm-ng-editor>`; its inner wrapper is
`.ng-rm-editor-wrapper`. `.ng-rm-editor-wrapper` carries `full-screen`,
`distraction-free`, `disabled`, `theme-light` / `theme-dark` / `theme-auto` and
`theme-auto-light` / `theme-auto-dark` classes and `data-theme`.

## 8. Workspace / tooling facts

Scripts (root `package.json`):
`ng`, `start`, `build`, `build:demo`, `build:lib`, `build:all`, `watch`,
`test`, `test:demo`, `test:lib`, `test:lib:watch`, `test:lib:coverage`,
`lint` (biome), `lint:fix`, `lint:eslint`, `typecheck`, `format`,
`format:check`, `format:biome`, `format:biome:check`, `format:prettier`,
`format:prettier:check`, `serve:demo`.

`build:lib` is `ng build rm-ng-editor && node copy-extra-files.js`, so building
the library also copies `README.md`, `CHANGELOG.md` and `LICENSE` into
`dist/rm-ng-editor`. `build:all` is `pnpm run build:lib && ng build demo`.
`typecheck` covers four tsconfigs: library, library specs, demo app, demo specs.

CI pipeline (`.github/workflows/ci.yml`): a `guard` job enforces the branch
policy, then three independent jobs run **in parallel**, each with `needs: guard`
and its own checkout plus `pnpm install --frozen-lockfile`:

- `lint` — Biome format check, Prettier check, Biome lint, ESLint, typecheck
- `build` — `build:lib`, `build:demo`
- `test` — `test:lib:ci`, `test:demo:ci`, uploads the `library-coverage` artifact,
  and runs `pnpm audit --audit-level high` as an advisory (non-failing) step

There is **no** `publish` job in the workflow file. CI runs on pushes to `main`,
pull requests that target `main`, `v*` tags, and manual runs.

Test runner: **Vitest** via `@angular/build:unit-test` (`runner: "vitest"`),
`jsdom` environment, setup file `projects/rm-ng-editor/src/test-setup.ts` and a
`jasmine-compat.d.ts` shim. Coverage thresholds: statements 90, branches 80,
functions 90, lines 90. **Not Karma, not Jest.**

Lint/format: **Biome** (`lint`, `format:biome`) plus **ESLint**
(`lint:eslint`) and **Prettier** for HTML/SCSS.

Library test/spec files that exist:
`rm-ng-editor.component.spec.ts`, `rm-ng-editor.service.spec.ts`,
`rm-ng-editor.service-utils.spec.ts`, `rm-ng-editor.table.spec.ts`,
`rm-ng-editor.configuration.spec.ts`, `state-management.spec.ts`,
`state-management-cleanup.spec.ts`, `media-embeds.spec.ts`,
`media-embeds-preview.spec.ts`.

Source layout under `projects/rm-ng-editor/src/lib/`:
`rm-ng-editor.ts`, `rm-ng-editor.component.html`, `rm-ng-editor.component.scss`,
`rm-ng-editor.interfaces.ts`, `rm-ng-editor.service.ts`,
`state-management/{index,circular-update-guard,staleness-aware-signals,resource-cleanup-manager}.ts`,
`media-embeds/{index,media-embed-validator,embed-preview-manager,responsive-embed-container,broken-embed-handler}.ts`.

Demo app: `projects/demo/src/app/app.ts` (class name `App`, uses
`ChangeDetectionStrategy.Eager`), `app.html`, `app.scss`, `app.config.ts`
(`provideBrowserGlobalErrorListeners`, `provideRouter`), `app.routes.ts`,
`main.ts` (`provideZonelessChangeDetection`).

## 9. Browser support

The declared target is modern evergreen browsers: Chrome/Edge 119+,
Firefox 120+, Safari 17+, no IE 11. This is a reasonable statement for an
Angular 22 + ES2022 target; keep it, but describe it as "the minimum versions
required by the Angular 22 toolchain and the Web APIs the editor uses" rather
than attributing the versions to "Angular 21 features".

## 10. Files that do not exist — never link them

- `docs/accessibility.md` **now exists** (created deliberately, verified against source:
  template ARIA attributes, `onKeyDown` shortcuts and the component stylesheet). It is
  no longer a "files that do not exist" entry — keep it and keep it accurate. The
  uppercase `ACCESSIBILITY.md` variant is still not used anywhere.
- `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`
- `examples/customization/*`, `examples/performance/*`, `examples/testing/*`,
  `examples/integration/*`, `examples/edge-cases/*`
- `.ts` files for examples other than:
  `examples/basic/{basic-usage,form-integration}.ts`,
  `examples/advanced/{advanced-configuration,content-processing}.ts`,
  `examples/async-and-lifecycle/auto-save.ts`,
  `examples/failure-cases/error-handling.ts`
- `biome.json` (the Biome config location was not confirmed — do not claim a
  specific path)

### Root files that DO exist (verified on disk) — safe to link

`.editorconfig`, `.gitignore`, `.npmignore`, `.prettierrc`, `LICENSE`,
`CHANGELOG.md`, `eslint.config.js`, `biome.jsonc`, `copy-extra-files.js`,
`angular.json`, `package.json`,
`pnpm-lock.yaml`, `tsconfig.json`, `README.md`, `CI-BRANCH-POLICY.md`,
`.github/workflows/ci.yml`, `.github/dependabot.yml`,
`.github/copilot-instructions.md`, `.vscode/*`,
`docs/`, `examples/`, `projects/`, `dist/`.

`projects/rm-ng-editor/assets/` exists and is the repository's only asset
folder; it holds `demo.png` (dark hero), `demo1.png` (light hero) and
`generate-hero.py`.

`LICENSE` is a real MIT licence (Copyright (c) 2026 RM-NG-Editor
Contributors). Root `CHANGELOG.md` and `docs/changelog.md` both exist and
currently hold the same 1.0.0 content — prefer linking `CHANGELOG.md` from the
root README and `./changelog.md` from inside `docs/`.

Documentation folder actually contains: `README.md`, `accessibility.md`,
`advanced-configuration.md`, `api-reference.md`, `architecture.md`,
`best-practices.md`, `browser-support.md`, `changelog.md`, `core-concepts.md`,
`extending-the-project.md`, `faq.md`, `installation.md`, `peer-dependencies.md`,
`performance-optimization.md`, `project-structure.md`, `troubleshooting.md`,
`usage.md`, `versioning-and-breaking-changes.md`.

## 11. Known false claims to purge

These statements appear in current docs and are wrong:

1. "Angular 21", "Angular 21+", "21.0.0-next.0", "requires Angular 21",
   "Angular v16–v26" as the *tested* range attributed to Angular 21.
2. `provideExperimentalZonelessChangeDetection` (removed API).
3. TypeScript 5.9.2, "latest 5.x", pnpm 10.15.1, Node 22.14.0 as exact floors.
4. `[(ngModel)]`, `formControlName`, `[formControl]` support, "Two-way binding
   with form controls", "Angular Forms integration" via ControlValueAccessor.
5. `config.toolbarIcons` as a supported configuration path.
6. `config.validationConfig` / `config.performance` / `config.plugins` /
   `config.toolbarConfig.tools` / `config.toolbarConfig.exclude`.
7. `BLOCK_FORMATTING_EXCLUDE`, `MINIMAL_CONFIG`-style constants and any
   `DEFAULT_*` constant not listed in §4.
8. `focus` / `blur` / `wordCountUpdate` outputs; `setHtmlContent`,
   `insertText`, `getHtmlContent` on the component before checking §3.
9. `showImageInsert`, `showInsertOrderedList`, `showInsertUnorderedList`,
   `showJustifyLeft/Center/Right/Full`, `showBackgroundColor`,
   `fullScreen.escapeKey`, `fullScreen.showToolbarInFullScreen`.
10. `Math.ceiling(...)` (not a real function) and similar typos.
11. "Karma", "Jasmine only", "Webpack bundle analyzer" as the project's stack
    (the workspace uses `@angular/build` + esbuild/Vite + Vitest).
12. Specific unverified metrics presented as measured fact (e.g. "40% faster
    initialization", "60% reduction in memory", "18MB → 24MB", "720ms cold
    start", "~40 KB gzipped"). Either remove them or clearly label them as
    illustrative order-of-magnitude estimates, not benchmarks. Prefer removing.

## 12. Assertion counts to use instead of invented precision

Corrected counts:
- `ToolbarConfig`: 74 optional flags.
- `ToolbarIcons`: 55 optional icon keys.
- `EditorConfig`: 11 optional properties.
- `WordCountStats`: 6 fields (`words`, `characters`, `charactersNoSpaces`,
  `paragraphs`, `sentences`, `readingTime`).
- Component source: 3004 lines (`rm-ng-editor.ts`).
- `rm-ng-editor.interfaces.ts`: 605 lines.
- `rm-ng-editor.service.ts`: 1624 lines.
- Template `rm-ng-editor.component.html`: 945 lines.
- The editor file list, not module counts: 3 exported entry points from
  `public-api.ts`.

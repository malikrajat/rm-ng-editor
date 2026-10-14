# API Reference

Complete API documentation for `rm-ng-editor`.

Package: `@codewithrajat/rm-ng-editor` (built and tested on Angular 22; the declared peer range is `@angular/core` / `@angular/common` `>=16.0.0 <=26.0.0`).

## Table of Contents

- [Components](#components)
- [Interfaces](#interfaces)
- [Services](#services)
- [Configuration](#configuration)
- [Default Values](#default-values)
- [Injection Tokens](#injection-tokens)
- [Keyboard Shortcuts](#keyboard-shortcuts)

## Components

### RmNgEditor

The main editor component.

- Selector: `app-rm-ng-editor`
- Standalone component with `ChangeDetectionStrategy.OnPush`
- Implements `OnInit` and `OnDestroy`
- Inputs and outputs are Angular signal inputs (`input()`) and signal outputs (`output()`)

#### Selector

```html
<app-rm-ng-editor />
```

#### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `config` | `EditorConfig \| null` | `null` | Editor configuration object |
| `value` | `string` | `''` | HTML content |

There are exactly two component inputs. `placeholder`, `height`, `maxHeight`, `disabled` and
`showToolbar` are **not** component inputs — they are `EditorConfig` fields supplied through `config`.

#### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `valueChange` | `string` | Emitted when the HTML content changes |
| `focusEvent` | `void` | Emitted when the editor gains focus |
| `blurEvent` | `void` | Emitted when the editor loses focus |
| `stateChange` | `EditorState` | Emitted when the caret/format state changes |
| `wordCountChange` | `WordCountStats` | Emitted whenever the word-count statistics are recalculated |
| `spellCheckResults` | `SpellCheckSuggestion[]` | Emitted with the current spell-check suggestions |
| `fullScreenChange` | `boolean` | Emitted when full-screen mode is entered or left |
| `themeChange` | `string` | Emitted when the theme changes |
| `tableInsert` | `TableData` | Emitted when a table is inserted |
| `tableModify` | `TableData` | Emitted when a table is modified |

There is no `focus`, `blur` or `wordCountUpdate` output — use the names above.

#### Example

`[value]` + `(valueChange)` is the recommended pattern. The component does not implement
`ControlValueAccessor`, so `[(ngModel)]` and `formControlName` do not work on it.

```typescript
import { Component, signal } from '@angular/core';
import { RmNgEditor, EditorConfig } from '@codewithrajat/rm-ng-editor';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [RmNgEditor],
  template: `
    <app-rm-ng-editor
      [config]="config()"
      [value]="content()"
      (valueChange)="onContentChange($event)"
    />
  `
})
export class ExampleComponent {
  config = signal<EditorConfig>({
    placeholder: 'Start typing...',
    height: '300px'
  });

  content = signal('<p>Hello World</p>');

  onContentChange(html: string) {
    this.content.set(html);
  }
}
```

#### Public Methods

These methods are reachable through a template reference variable or `viewChild`. They are grouped
by purpose; commands delegate to the browser editing command pipeline.

**Content**

| Method | Signature |
|--------|-----------|
| `getContent` | `(): string` |
| `setContent` | `(content: string): void` |
| `getTextContent` | `(): string` |
| `isEmpty` | `(): boolean` |
| `focus` | `(): void` |
| `blur` | `(): void` |
| `refreshWordCount` | `(): void` |

```html
<app-rm-ng-editor #editor [value]="content()" />
<button (click)="editor.setContent('<p>Replaced</p>')">Replace</button>
```

**Formatting commands**

| Method | Signature |
|--------|-----------|
| `execCommand` | `(command: string, value?: string): void` |
| `setFontFamily` | `(event: Event): void` |
| `setFontSize` | `(event: Event): void` |
| `setTextColor` | `(event: Event): void` |
| `setHeading` | `(event: Event): void` |
| `setHeadingByTag` | `(tag: string): void` |
| `setAlignment` | `(command: string): void` |
| `toggleList` | `(command: string): void` |
| `changeFontSize` | `(delta: number): void` |
| `clearFormatting` | `(): void` |

**Insertion**

| Method | Signature |
|--------|-----------|
| `insertPageBreak` | `(): void` |
| `insertSectionDivider` | `(): void` |
| `insertImage` | `(): void` |
| `insertVideo` | `(): void` |
| `insertAudio` | `(): void` |
| `insertLink` | `(): void` |
| `editLink` | `(): void` |
| `removeLink` | `(): void` |
| `insertTable` | `(rows?: number, columns?: number): void` |
| `insertRowAbove` | `(): void` |
| `insertRowBelow` | `(): void` |
| `insertColumnLeft` | `(): void` |
| `insertColumnRight` | `(): void` |
| `deleteRow` | `(): void` |
| `deleteColumn` | `(): void` |
| `splitCells` | `(): void` |
| `resizeTableSmaller` | `(): void` |
| `resizeTableLarger` | `(): void` |
| `resetTableSize` | `(): void` |
| `deleteTable` | `(): void` |

**Media embeds**

| Method | Signature |
|--------|-----------|
| `embedYouTube` | `(): void` |
| `embedVimeo` | `(): void` |
| `embedTwitter` | `(): void` |
| `embedInstagram` | `(): void` |
| `embedCustomMedia` | `(): void` |
| `generateLinkPreview` | `(url: string): void` |

**View / theme**

| Method | Signature |
|--------|-----------|
| `toggleFullScreen` | `(): void` |
| `enterFullScreen` | `(): void` |
| `exitFullScreen` | `(): void` |
| `toggleDistractionFree` | `(): void` |
| `toggleTheme` | `(): void` |
| `setTheme` | `(theme: 'light' \| 'dark' \| 'auto'): void` |

**HTML editing / accessibility**

| Method | Signature |
|--------|-----------|
| `toggleHtmlEdit` | `(): void` |
| `getHtmlContent` | `(): string` |
| `updateHtmlContent` | `(event: Event): void` |
| `applyHtmlChanges` | `(): void` |
| `showKeyboardShortcuts` | `(): void` |
| `hideKeyboardShortcuts` | `(): void` |

**Validation / spell check**

| Method | Signature |
|--------|-----------|
| `isContentValid` | `(): boolean` |
| `getValidationErrors` | `(): string[]` |
| `updateWordCount` | `(): void` |
| `runSpellCheck` | `(): void` |
| `toggleSpellCheck` | `(): void` |
| `acceptSpellingSuggestion` | `(original: string, suggestion: string): void` |
| `ignoreSpellingSuggestion` | `(word: string): void` |

**State / diagnostics**

| Method | Signature |
|--------|-----------|
| `updateEditorState` | `(): void` |
| `onContentChange` | `(): void` |
| `onKeyDown` | `(event: KeyboardEvent): void` |
| `onFocus` | `(): void` |
| `onBlur` | `(): void` |
| `getPerformanceMetrics` | `(): { activeResources: number; debounceTimeouts: number; isOptimized: boolean; memoryUsage?: number }` |
| `checkForMemoryLeaks` | `(): void` |

The component has **no** `setHtmlContent()`, `insertText()`, `toggleBold()`, `toggleItalic()`,
`toggleUnderline()`, `insertList()`, `insertOrderedList()`, `insertUnorderedList()`,
`getWordCount()` or `getCharacterCount()` method. Use `execCommand('bold')`-style calls for
formatting toggles, `setContent()` to replace content, and `RmNgEditorService.getWordCount()` /
`RmNgEditorService.getCharacterCount()` for counting.

## Interfaces

### EditorConfig

Main configuration interface. It has exactly eleven optional properties.

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

**`toolbarIcons` is NOT part of `EditorConfig`.** Icon customisation is done by overriding the
`EDITOR_DEFAULT_ICONS` injection token with a `ToolbarIcons` object (see
[Injection Tokens](#injection-tokens)). The component reads icons from that token, so adding
`toolbarIcons` to `config` is not a supported configuration path.

#### Properties

**placeholder** `string` (optional)  
Default: `'Start typing...'`  
Placeholder text shown when the editor is empty.

```typescript
{ placeholder: 'Start typing...' }
```

**disabled** `boolean` (optional)  
Default: `false`  
Disables the editor (read-only mode).

```typescript
{ disabled: true }  // Read-only
```

**height** `string` (optional)  
Default: `'300px'`  
Editor content area height.

```typescript
{ height: '600px' }
{ height: 'auto' }  // Auto-height
```

**maxHeight** `string` (optional)  
Default: `'600px'`  
Maximum height before the content area scrolls.

```typescript
{ maxHeight: '800px' }
```

**showToolbar** `boolean` (optional)  
Default: `true`  
Show/hide the toolbar.

```typescript
{ showToolbar: false }  // Hide toolbar
```

**enabledTools** `string[]` (optional)  
Declared on the interface but not consumed by the template or by `isFeatureEnabled()`.
Prefer `toolbarConfig` for controlling toolbar features.

**toolbarConfig** `ToolbarConfig` (optional)  
Toolbar feature configuration (recommended).

**validation** `ValidationConfig` (optional)  
Content validation rules. Validation lives under `config.validation` — there is no
`config.validationConfig`.

**theme** `ThemeConfig` (optional)  
Theme and appearance settings.

**fullScreen** `FullScreenConfig` (optional)  
Full-screen mode settings.

**table** `TableConfig` (optional)  
Table feature configuration.

---

### ToolbarConfig

Controls toolbar feature visibility.

```typescript
interface ToolbarConfig {
  // Text Formatting Group
  showTextFormatting?: boolean;
  showBold?: boolean;
  showItalic?: boolean;
  showUnderline?: boolean;
  showStrikethrough?: boolean;

  // Script Formatting Group
  showScriptFormatting?: boolean;
  showSubscript?: boolean;
  showSuperscript?: boolean;

  // Font Controls Group
  showFontControls?: boolean;
  showFontFamily?: boolean;
  showFontSize?: boolean;

  // Color Controls Group
  showColorControls?: boolean;
  showTextColor?: boolean;

  // Headings Group
  showHeadings?: boolean;

  // Block Formatting Group
  showBlockFormatting?: boolean;

  // Alignment Group
  showAlignment?: boolean;
  showAlignLeft?: boolean;
  showAlignCenter?: boolean;
  showAlignRight?: boolean;
  showAlignJustify?: boolean;

  // Lists Group
  showLists?: boolean;
  showUnorderedList?: boolean;
  showOrderedList?: boolean;

  // Indent Group
  showIndent?: boolean;
  showOutdent?: boolean;
  showIndentIncrease?: boolean;

  // Undo/Redo Group
  showUndoRedo?: boolean;
  showUndo?: boolean;
  showRedo?: boolean;

  // Clear Formatting Group
  showClearFormatting?: boolean;
  showPageBreak?: boolean;
  showSectionDivider?: boolean;

  // Link & Media Group
  showLinkMedia?: boolean;
  showInsertLink?: boolean;
  showEditLink?: boolean;
  showRemoveLink?: boolean;
  showLinkTarget?: boolean;
  showMediaEmbed?: boolean;
  showInsertImage?: boolean;
  showInsertVideo?: boolean;
  showInsertAudio?: boolean;
  showYouTubeEmbed?: boolean;
  showTwitterEmbed?: boolean;
  showInstagramEmbed?: boolean;
  showVimeoEmbed?: boolean;
  showCustomEmbed?: boolean;
  showLinkPreview?: boolean;

  // Validation & Stats Group
  showValidation?: boolean;
  showWordCount?: boolean;
  showCharacterCount?: boolean;
  showReadingTime?: boolean;
  showSpellCheck?: boolean;

  // View & Mode Group
  showViewMode?: boolean;
  showFullScreen?: boolean;
  showThemeToggle?: boolean;
  showDistractionFree?: boolean;

  // Table Group
  showTable?: boolean;
  showInsertTable?: boolean;
  showTableProperties?: boolean;
  showInsertRow?: boolean;
  showInsertColumn?: boolean;
  showDeleteRow?: boolean;
  showDeleteColumn?: boolean;
  showMergeCells?: boolean;
  showSplitCells?: boolean;
  showTableResize?: boolean;
  showDeleteTable?: boolean;

  // Accessibility & HTML Editing Group
  showAccessibility?: boolean;
  showHtmlEdit?: boolean;
  showKeyboardShortcuts?: boolean;
}
```

`ToolbarConfig` declares 74 optional flags. Note that `showLinkTarget` is declared but not
consumed by the template or by `isFeatureEnabled()`, so it does not currently hide anything.

#### Example

```typescript
const config: EditorConfig = {
  toolbarConfig: {
    showTextFormatting: true,
    showBold: true,
    showItalic: true,
    showUnderline: false,
    showLists: true,
    showTable: false
  }
};
```

There is no `toolbarConfig.tools` and no `toolbarConfig.exclude` — the flags above are the only
way to control toolbar visibility.

---

### ValidationConfig

Content validation and statistics configuration. Supplied as `config.validation`.

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

#### Example

```typescript
const config: EditorConfig = {
  validation: {
    showWordCount: true,
    showReadingTime: true,
    minWords: 100,
    maxWords: 5000,
    spellCheck: {
      enabled: true,
      language: 'en-US',
      highlightErrors: true
    }
  }
};
```

---

### ThemeConfig

Theme and appearance configuration.

```typescript
interface ThemeConfig {
  mode?: 'light' | 'dark' | 'auto';
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  customCss?: string;
}
```

#### Example

```typescript
const config: EditorConfig = {
  theme: {
    mode: 'dark',
    primaryColor: '#4CAF50',
    backgroundColor: '#1E1E1E',
    textColor: '#FFFFFF'
  }
};
```

---

### FullScreenConfig

Full-screen mode configuration.

```typescript
interface FullScreenConfig {
  enabled?: boolean;
  hideToolbarInFullScreen?: boolean;
  exitOnEscape?: boolean;
  distractionFree?: boolean;
}
```

There is no `escapeKey` property and no `showToolbarInFullScreen` property.

#### Example

```typescript
const config: EditorConfig = {
  fullScreen: {
    enabled: true,
    exitOnEscape: true,
    hideToolbarInFullScreen: false,
    distractionFree: false
  }
};
```

---

### TableConfig

Table feature configuration.

```typescript
interface TableConfig {
  enabled?: boolean;
  defaultRows?: number;
  defaultColumns?: number;
  maxRows?: number;
  maxColumns?: number;
  resizable?: boolean;
  sortable?: boolean;
  allowAddDelete?: boolean;
  allowResize?: boolean;
  cellPadding?: string;
  borderWidth?: string;
  borderColor?: string;
  headerBackgroundColor?: string;
  alternateRowColor?: boolean;
  showBorders?: boolean;
  showGridLines?: boolean;
  cellMinWidth?: string;
  cellMinHeight?: string;
  allowMerge?: boolean;
  allowSplit?: boolean;
  tableClasses?: string[];
}
```

#### Example

```typescript
const config: EditorConfig = {
  table: {
    defaultRows: 4,
    defaultColumns: 4,
    maxRows: 50,
    allowMerge: true,
    showBorders: true
  }
};
```

---

### EditorState

Current editor state (read-only).

```typescript
interface EditorState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  subscript: boolean;
  superscript: boolean;
  fontSize: string;
  fontFamily: string;
  textColor: string;
  alignment: string;
  heading: string;
  listType: string;
}
```

---

### LinkData

Link insertion/editing data.

```typescript
interface LinkData {
  url: string;
  text: string;
  target: '_blank' | '_self' | '_parent' | '_top';
  title?: string;
}
```

#### Example

```typescript
const linkData: LinkData = {
  url: 'https://example.com',
  text: 'Click here',
  target: '_blank',
  title: 'Visit Example'
};
```

---

### MediaEmbedData

Embed data for the media-embed tools.

```typescript
interface MediaEmbedData {
  type: 'youtube' | 'twitter' | 'instagram' | 'vimeo' | 'custom';
  url: string;
  embedCode?: string;
  width?: string;
  height?: string;
  previewUrl?: string;
  title?: string;
}
```

---

### LinkPreview

Metadata resolved by `generateLinkPreview(url)`.

```typescript
interface LinkPreview {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  domain?: string;
}
```

---

### TableData

Payload of the `tableInsert` and `tableModify` outputs.

```typescript
interface TableData {
  rows: number;
  columns: number;
  cells: TableCell[][];
  style?: {
    width?: string;
    height?: string;
    borderCollapse?: string;
    border?: string;
  };
}

interface TableCell {
  content: string;
  style?: CellStyle;
  colspan?: number;
  rowspan?: number;
  isHeader?: boolean;
}
```

`TableStyle` (table-level: width, height, border collapse, border, background colour, margin) and
`CellStyle` (cell-level: padding, border, background colour, alignment, font weight, colour, width,
height) are the exported inline-style records used by `TableData` and `TableCell`.

#### Example

```typescript
import { TableData } from '@codewithrajat/rm-ng-editor';

const onTableModify = (table: TableData) => {
  console.log(`${table.rows} x ${table.columns} table`);
};
```

---

### WordCountStats

Word count statistics. Payload of the `wordCountChange` output.

```typescript
interface WordCountStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  paragraphs: number;
  sentences: number;
  readingTime: number;  // in minutes
}
```

---

### SpellCheckSuggestion

A single spell-check suggestion. Element type of the `spellCheckResults` output.

```typescript
interface SpellCheckSuggestion {
  word: string;
  suggestions: string[];
  position: { start: number; end: number };
  startOffset: number;
  endOffset?: number;
  description?: string;
  type?: string;
}
```

---

### Other Exported Types

The public API also exports `KeyboardShortcutConfig` and `PlatformKeyboardConfig`, used by the
keyboard-shortcut helpers, plus the helper classes `KeyboardShortcutManager`,
`PlatformAwareShortcutHandler`, `KeyboardLayoutHandler`, `SpellCheckManager`,
`TableSelectionManager`, `CellMergeValidator` and `NestedTableSanitizer`. These are static utility
classes used internally by the component and are documented here only for completeness.

The internal folders `src/lib/state-management/` and `src/lib/media-embeds/` are **not** part of the
public API and are not exported from the package entry point.

## Services

### RmNgEditorService

Utility service for content manipulation. `@Injectable({ providedIn: 'root' })`.

#### Methods

**htmlToText(html: string | null | undefined): string**

Converts HTML to plain text.

```typescript
import { Component, inject } from '@angular/core';
import { RmNgEditorService } from '@codewithrajat/rm-ng-editor';

@Component({
  selector: 'app-text-extractor',
  template: ``
})
export class MyComponent {
  private editorService = inject(RmNgEditorService);

  extractText(html: string) {
    const plainText = this.editorService.htmlToText(html);
    console.log(plainText);
  }
}
```

**sanitizeHtml(html: string | null | undefined): string**

Sanitizes HTML by removing dangerous elements and attributes.

```typescript
const clean = this.editorService.sanitizeHtml(unsafeHtml);
```

`sanitizeHtml` strips `script`, `object`, `embed`, `iframe`, `form`, `input`, `textarea`, `button`,
`select`, `option`, `frame`, `frameset`, `applet`, `meta` and `link[rel="import"]`; removes all
`on*` attributes, `javascript:` / `vbscript:` values, `formaction`, non-image `data:` URIs and the
dangerous CSS constructs `expression()`, `@import`, `behavior:` and `-moz-binding`. The serialized
output is capped at **1 MB** (1024 × 1024 characters); anything beyond that is truncated. Inputs
that are `null` or `undefined` yield an empty string.

**getWordCount(html: string | null | undefined): number**

Counts words in HTML content. CJK characters count as one word each; emoji and zero-width
characters are handled explicitly.

```typescript
const count = this.editorService.getWordCount(html);
console.log(`${count} words`);
```

**getCharacterCount(html: string | null | undefined): number**

Counts characters in HTML content.

```typescript
const count = this.editorService.getCharacterCount(html);
```

**extractHeadings(html: string | null | undefined): { level: number; text: string; id?: string }[]**

Extracts all headings from content.

```typescript
const headings = this.editorService.extractHeadings(html);
console.log(headings);
// [{ level: 1, text: 'Title', id: 'title' }, ...]
```

**validateContent(html: string | null | undefined): { isValid: boolean; errors: string[] }**

Validates HTML content structure.

```typescript
const result = this.editorService.validateContent(html);
if (!result.isValid) {
  console.error('Validation errors:', result.errors);
}
```

**convertToFormat(html: string, format: 'text' | 'markdown'): string**

Converts content to plain text or Markdown.

```typescript
const markdown = this.editorService.convertToFormat(html, 'markdown');
const text = this.editorService.convertToFormat(html, 'text');
console.log(markdown);
```

## Configuration

### How `config` Is Merged

`config` is a signal input typed `EditorConfig | null` with a declared default of `null`, so the
template always supplies `[config]="someConfig()"` where the signal may hold `null`. The component
falls back to the module defaults when a section is absent:

- toolbar flags come from `EDITOR_DEFAULT_CONFIG` (a copy of `DEFAULT_TOOLBAR_CONFIG`),
- icons come from `EDITOR_DEFAULT_ICONS` (a copy of `DEFAULT_TOOLBAR_ICONS`),
- validation falls back to `DEFAULT_VALIDATION_CONFIG` under `config.validation`,
- theme falls back to `DEFAULT_THEME_CONFIG`,
- full-screen falls back to `DEFAULT_FULLSCREEN_CONFIG`,
- tables fall back to `DEFAULT_TABLE_CONFIG` merged with `config.table` (`{ defaultRows: 3, defaultColumns: 3, allowResize: true, allowMerge: false, ...config.table }`),
- debounce/chunking come from `EDITOR_PERFORMANCE_CONFIG`.

Word-count statistics are recalculated on content changes and once after initialization, which is
when `wordCountChange` is emitted.

## Default Values

### DEFAULT_TOOLBAR_CONFIG

Every flag below is `true` except `showDistractionFree`, which is opt-in.

```typescript
export const DEFAULT_TOOLBAR_CONFIG: ToolbarConfig = {
  showTextFormatting: true,
  showBold: true,
  showItalic: true,
  showUnderline: true,
  showStrikethrough: true,
  showScriptFormatting: true,
  showSubscript: true,
  showSuperscript: true,
  showFontControls: true,
  showFontFamily: true,
  showFontSize: true,
  showColorControls: true,
  showTextColor: true,
  showHeadings: true,
  showBlockFormatting: true,
  showAlignment: true,
  showAlignLeft: true,
  showAlignCenter: true,
  showAlignRight: true,
  showAlignJustify: true,
  showLists: true,
  showUnorderedList: true,
  showOrderedList: true,
  showIndent: true,
  showOutdent: true,
  showIndentIncrease: true,
  showUndoRedo: true,
  showUndo: true,
  showRedo: true,
  showClearFormatting: true,
  showPageBreak: true,
  showSectionDivider: true,
  showLinkMedia: true,
  showInsertLink: true,
  showEditLink: true,
  showRemoveLink: true,
  showLinkTarget: true,
  showInsertImage: true,
  showInsertVideo: true,
  showInsertAudio: true,
  showMediaEmbed: true,
  showYouTubeEmbed: true,
  showTwitterEmbed: true,
  showInstagramEmbed: true,
  showVimeoEmbed: true,
  showCustomEmbed: true,
  showLinkPreview: true,
  showValidation: true,
  showWordCount: true,
  showCharacterCount: true,
  showReadingTime: true,
  showSpellCheck: true,
  showViewMode: true,
  showFullScreen: true,
  showThemeToggle: true,
  showDistractionFree: false,
  showTable: true,
  showInsertTable: true,
  showTableProperties: true,
  showInsertRow: true,
  showInsertColumn: true,
  showDeleteRow: true,
  showDeleteColumn: true,
  showMergeCells: true,
  showSplitCells: true,
  showTableResize: true,
  showDeleteTable: true,
  showAccessibility: true,
  showHtmlEdit: true,
  showKeyboardShortcuts: true
};
```

There are no `showInsertOrderedList`, `showInsertUnorderedList`, `showJustifyLeft`,
`showJustifyCenter`, `showJustifyRight`, `showJustifyFull`, `showBackgroundColor` or
`showImageInsert` flags. The real names are `showOrderedList`, `showUnorderedList`,
`showAlignLeft`, `showAlignCenter`, `showAlignRight`, `showAlignJustify` and `showInsertImage`.

### DEFAULT_TOOLBAR_ICONS

The icon map that backs the `EDITOR_DEFAULT_ICONS` token — a `ToolbarIcons` object with 55 optional
icon keys (`bold`, `italic`, `underline`, `strikethrough`, `subscript`, `superscript`, `pageBreak`,
`sectionDivider`, `alignLeft`…`alignJustify`, `unorderedList`, `orderedList`, `indent`, `outdent`,
`undo`, `redo`, `clearFormatting`, `insertLink`, `editLink`, `removeLink`, `mediaEmbed`,
`insertImage`, `insertVideo`, `insertAudio`, `youtubeEmbed`, `twitterEmbed`, `instagramEmbed`,
`vimeoEmbed`, `customEmbed`, `linkPreview`, `wordCount`, `characterCount`, `readingTime`,
`spellCheck`, `spellCheckError`, `fullScreen`, `exitFullScreen`, `darkTheme`, `lightTheme`,
`distractionFree`, `insertTable`, `tableProperties`, `insertRowAbove`, `insertRowBelow`,
`insertColumnLeft`, `insertColumnRight`, `deleteRow`, `deleteColumn`, `mergeCells`, `splitCells`,
`tableResizeSmaller`, `tableResizeLarger`, `tableReset`, `deleteTable`, `htmlEdit`,
`accessibility`, `keyboardShortcuts`).

### DEFAULT_THEME_CONFIG

```typescript
export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  mode: 'light'
};
```

### DEFAULT_FULLSCREEN_CONFIG

```typescript
export const DEFAULT_FULLSCREEN_CONFIG: FullScreenConfig = {
  enabled: true,
  hideToolbarInFullScreen: false,
  exitOnEscape: true,
  distractionFree: false
};
```

### DEFAULT_VALIDATION_CONFIG

```typescript
export const DEFAULT_VALIDATION_CONFIG: ValidationConfig = {
  showWordCount: true,
  showCharacterCount: true,
  showReadingTime: true,
  spellCheck: {
    enabled: false,
    language: 'en-US',
    highlightErrors: true,
    showSuggestions: true
  }
};
```

### DEFAULT_TABLE_CONFIG

```typescript
export const DEFAULT_TABLE_CONFIG: TableConfig = {
  enabled: true,
  defaultRows: 3,
  defaultColumns: 3,
  maxRows: 50,
  maxColumns: 20,
  resizable: true,
  sortable: false,
  allowAddDelete: true,
  cellPadding: '8px',
  borderWidth: '1px',
  borderColor: '#ddd',
  showBorders: true,
  showGridLines: true,
  cellMinWidth: '50px',
  cellMinHeight: '25px',
  allowMerge: true,
  allowSplit: true
};
```

## Injection Tokens

### EDITOR_DEFAULT_CONFIG

Provides the default toolbar configuration (`InjectionToken<ToolbarConfig>`, root-provided with
`DEFAULT_TOOLBAR_CONFIG`).

```typescript
import { ApplicationConfig } from '@angular/core';
import { EDITOR_DEFAULT_CONFIG, ToolbarConfig } from '@codewithrajat/rm-ng-editor';

const customToolbarConfig: ToolbarConfig = {
  showDistractionFree: true
};

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: EDITOR_DEFAULT_CONFIG,
      useValue: customToolbarConfig
    }
  ]
};
```

### EDITOR_DEFAULT_ICONS

Provides the default toolbar icons (`InjectionToken<ToolbarIcons>`, root-provided with
`DEFAULT_TOOLBAR_ICONS`). This is the supported way to customise icons.

```typescript
import { ApplicationConfig } from '@angular/core';
import { EDITOR_DEFAULT_ICONS, ToolbarIcons } from '@codewithrajat/rm-ng-editor';

const customIcons: ToolbarIcons = {
  bold: '<strong>B</strong>',
  italic: '<em>I</em>',
  insertImage: '📷'
};

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: EDITOR_DEFAULT_ICONS,
      useValue: { ...customIcons }
    }
  ]
};
```

### EDITOR_PERFORMANCE_CONFIG

Provides the performance configuration. Its real shape is
`{ debounceDelay: number; chunkSize: number; maxContentSize: number }` with the defaults
`100`, `1000` and `100000`.

```typescript
import { ApplicationConfig } from '@angular/core';
import { EDITOR_PERFORMANCE_CONFIG } from '@codewithrajat/rm-ng-editor';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: EDITOR_PERFORMANCE_CONFIG,
      useValue: {
        debounceDelay: 300,
        chunkSize: 1000,
        maxContentSize: 100000
      }
    }
  ]
};
```

## Keyboard Shortcuts

Built-in shortcuts handled by the component's keydown handler. `Ctrl` is `⌘` on macOS.

| Shortcut | Action |
|----------|--------|
| `Ctrl+B` / `Ctrl+I` / `Ctrl+U` | Bold / Italic / Underline |
| `Ctrl+Shift+S` | Strikethrough |
| `Ctrl+=` / `Ctrl+Shift+=` | Subscript / Superscript |
| `Ctrl+Shift+L` / `Ctrl+Shift+E` / `Ctrl+Shift+R` / `Ctrl+Shift+J` | Align left / center / right / justify |
| `Ctrl+Shift+8` / `Ctrl+Shift+7` | Bullet list / numbered list |
| `Ctrl+K` | Insert link |
| `Ctrl+]` / `Ctrl+[` | Indent / outdent |
| `Ctrl+Shift+T` | Insert table |
| `Ctrl+Z` / `Ctrl+Shift+Z` / `Ctrl+Y` | Undo / redo / redo |
| `Ctrl+\` | Clear formatting |
| `Ctrl+Shift+.` / `Ctrl+Shift+,` | Increase / decrease font size |
| `Ctrl+Enter` | Insert page break |
| `Ctrl+Shift+H` | Toggle HTML source edit |
| `Alt+1` … `Alt+6` / `Alt+0` | H1 … H6 / paragraph |
| `F1` | Show keyboard-shortcuts dialog |
| `Escape` | Close modal, else focus the editor |

The `KeyboardShortcutManager` class (`initializeDefaults`, `registerShortcut`,
`registerCustomShortcut`, `getShortcut`, `handleKeyboardEvent`, `disableShortcut`,
`enableShortcut`, `isShortcutEnabled`, `getAllShortcuts`, `resetToDefaults`,
`getConflictingShortcuts`, `clearAllShortcuts`) is exported for programmatic shortcut handling.

---

**See Also:**
- [Usage Guide](./usage.md)
- [Advanced Configuration](./advanced-configuration.md)
- [Best Practices](./best-practices.md)

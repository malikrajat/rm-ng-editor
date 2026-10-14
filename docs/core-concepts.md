# Core Concepts

This document explains the fundamental concepts and patterns used in `rm-ng-editor`.

## Table of Contents

- [Signal-based State Management](#signal-based-state-management)
- [Zoneless Change Detection](#zoneless-change-detection)
- [Content Editable](#content-editable)
- [Configuration System](#configuration-system)
- [Resource Management](#resource-management)
- [Error Handling](#error-handling)
- [Performance Optimization](#performance-optimization)

## Signal-based State Management

### What are Signals?

Signals are Angular's reactive primitives that provide fine-grained reactivity:

```typescript
// Create a signal
const count = signal(0);

// Read the signal value
console.log(count());  // 0

// Update the signal
count.set(5);
count.update(n => n + 1);
```

### Why Signals in rm-ng-editor?

1. **Fine-grained Updates**: Only re-render what changed
2. **Automatic Tracking**: Dependencies tracked automatically
3. **No Subscriptions**: No manual cleanup needed
4. **Better Performance**: Optimized by Angular

### Signal Types in the Editor

#### 1. Input Signals

Receive data from parent components:

```typescript
// Configuration from parent (null until the parent provides one)
config = input<EditorConfig | null>(null);

// Initial content from parent
value = input<string>('');
```

#### 2. State Signals

Manage internal component state:

```typescript
// Editor content (public — it is also exposed to the template and to viewChild refs)
content = signal('');

// UI state
isFullScreen = signal(false);
isHtmlEditMode = signal(false);
```

#### 3. Computed Signals

Derive values from other signals:

```typescript
// Automatically recomputes when the config signal or injected defaults change
toolbarConfig = computed<ToolbarConfig>(() => ({
  ...this.defaultConfig,
  ...this.configSignal().toolbarConfig,
}));

// Recomputes when the validation config changes
shouldShowStats = computed(() => {
  const config = this.validationConfig();
  return (
    config.showWordCount ||
    config.showCharacterCount ||
    config.showReadingTime
  );
});
```

#### 4. Effects

Side-effects when signals change:

```typescript
// Copies the parent `config` input into the private config signal and
// pushes the individual settings onto their own signals
private configEffect = effect(() => {
  const configValue = this.config();
  if (configValue) {
    this.configSignal.set(configValue);
    // …placeholder(), disabled(), height(), maxHeight(), showToolbar(), theme
  }
});

// Pushes the content signal back into the contenteditable element
private updateStateEffect = effect(() => {
  const editor = this.editorElement().nativeElement;
  if (editor && editor.innerHTML !== this.content()) {
    editor.innerHTML = this.content();
  }
});
```

### Data Flow with Signals

```
Parent Component Config
        │
        ▼
Input Signal (config)
        │
        ▼
Private Signal (configSignal)
        │
        ▼
Computed Signal (toolbarConfig)
        │
        ▼
Template Binding
        │
        ▼
DOM Update
```

## Zoneless Change Detection

### What is Zoneless?

Traditional Angular uses Zone.js to detect changes. Zoneless architecture removes this dependency. In Angular 22 the API is the stable `provideZonelessChangeDetection()` (the older experimental provider name has been removed).

### How it Works

```typescript
// projects/demo/src/main.ts
import { provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(App, {
  ...appConfig,
  providers: [provideZonelessChangeDetection(), ...appConfig.providers],
}).catch(err => console.error(err));
```

### Change Detection with Signals

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RmNgEditor {
  // Signals trigger change detection automatically
  content = signal('');

  // Simplified — the real handler also guards against re-entrant updates
  onContentChange() {
    const editor = this.editorElement().nativeElement;
    this.content.set(editor.innerHTML);
    this.valueChange.emit(editor.innerHTML);
    // Change detection runs automatically!
  }
}
```

### Benefits

1. **Less Overhead**: No Zone.js patching of browser APIs
2. **Smaller Bundle**: No Zone.js runtime to ship
3. **Explicit**: Clear when changes happen
4. **Future-proof**: Angular's direction

## Content Editable

### How Content Editing Works

The editor uses the browser's native `contenteditable` attribute:

```html
<div
  #editor
  class="editor-content"
  contenteditable="true"
  role="textbox"
  [attr.aria-label]="'Rich text editor content'"
  (input)="onContentChange()"
>
  <!-- User-editable content -->
</div>
```

### Document.execCommand()

The editor uses the browser's editing API:

```typescript
execCommand(command: string, value?: string) {
  if (this.disabled()) return;

  // The full implementation also early-returns here when the toolbar flag that
  // gates this command is off — see "Feature Gates" below
  document.execCommand(command, false, value);
  this.updateEditorState();
  this.onContentChange();
}

// Examples:
execCommand('bold');                        // Toggle bold
execCommand('fontSize', '4');               // Set font size (1–7)
execCommand('insertHTML', '<p>Hello</p>');  // Insert HTML
```

The private `insertHtml(html)` helper uses the same `insertHTML` command (with a
`Range.createContextualFragment()` fallback) for page breaks, images, audio/video
and the media embeds.

### Supported Commands

| Command | Purpose | Example |
|---------|---------|---------|
| `bold` | Toggle bold | `execCommand('bold')` |
| `italic` | Toggle italic | `execCommand('italic')` |
| `underline` | Toggle underline | `execCommand('underline')` |
| `strikeThrough` | Toggle strikethrough | `execCommand('strikeThrough')` |
| `subscript` | Toggle subscript | `execCommand('subscript')` |
| `superscript` | Toggle superscript | `execCommand('superscript')` |
| `fontName` | Set font family | `execCommand('fontName', 'Arial')` |
| `fontSize` | Set font size (1–7) | `execCommand('fontSize', '4')` |
| `foreColor` | Set text color | `execCommand('foreColor', '#FF0000')` |
| `justifyLeft` | Align left | `execCommand('justifyLeft')` |
| `justifyCenter` | Center align | `execCommand('justifyCenter')` |
| `justifyRight` | Align right | `execCommand('justifyRight')` |
| `justifyFull` | Justify | `execCommand('justifyFull')` |
| `insertOrderedList` | Numbered list | `execCommand('insertOrderedList')` |
| `insertUnorderedList` | Bullet list | `execCommand('insertUnorderedList')` |
| `indent` | Increase indent | `execCommand('indent')` |
| `outdent` | Decrease indent | `execCommand('outdent')` |
| `undo` | Undo | `execCommand('undo')` |
| `redo` | Redo | `execCommand('redo')` |
| `removeFormat` | Clear formatting | `execCommand('removeFormat')` |
| `formatBlock` | Set block/heading | `execCommand('formatBlock', '<h2>')` |
| `insertHTML` | Insert raw HTML | `execCommand('insertHTML', '<p>Hello</p>')` |
| `createLink` | Wrap the selection in a link | `execCommand('createLink', 'https://example.com')` |
| `unlink` | Remove a link | `execCommand('unlink')` |

Notes:

- The feature map gates `bold`, `italic`, `underline`, `strikeThrough`,
  `subscript`, `superscript`, `justifyLeft`, `justifyCenter`, `justifyRight`,
  `justifyFull`, `insertUnorderedList`, `insertOrderedList`, `indent`, `outdent`,
  `undo`, `redo` and `removeFormat`.
- The remaining commands (`fontName`, `fontSize`, `foreColor`, `formatBlock`,
  `insertHTML`, `createLink`, `unlink`) are reached through the higher-level
  helpers — `setFontFamily()`, `setFontSize()`, `setTextColor()`, `setHeading()`,
  `insertLink()`, `removeLink()` and the private `insertHtml()` — rather than
  through the feature map.
- `hiliteColor` (background colour) is a browser-native editing command but is
  **not** wired to any toolbar action in this editor.
- These are all part of the deprecated `document.execCommand` API, which the
  editor uses because it is built on `contenteditable`.

### Selection and Range API

The editor reads and restores the DOM selection around content writes, so pushing
the `content` signal into the `contenteditable` element does not move the caret:

```typescript
// Pushes content into the DOM while preserving the caret position
private updateStateEffect = effect(() => {
  const editor = this.editorElement().nativeElement;
  if (editor && editor.innerHTML !== this.content()) {
    const selection = document.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
    const startContainer = range?.startContainer;
    const startOffset = range?.startOffset;

    editor.innerHTML = this.content();

    if (startContainer && selection && range && startOffset !== undefined) {
      try {
        range.setStart(startContainer, startOffset);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      } catch {
        // Selection restoration failed, ignore
      }
    }
  }
});
```

## Configuration System

### Configuration Hierarchy

```
1. Built-in Defaults (DEFAULT_TOOLBAR_CONFIG)
        │
        ▼
2. Injection Token Override (EDITOR_DEFAULT_CONFIG)
        │
        ▼
3. Component Input (config input)
        │
        ▼
4. Private Signal (configSignal, updated by an effect)
        │
        ▼
5. Final Computed Configuration (toolbarConfig)
```

### How Configuration Merging Works

```typescript
// Step 1: Defaults supplied through the injection token
private readonly defaultConfig = inject(EDITOR_DEFAULT_CONFIG);

// Step 2: The parent config arrives through a signal input…
config = input<EditorConfig | null>(null);

// …and is copied into a private signal by an effect
private configSignal = signal<EditorConfig>({});
private configEffect = effect(() => {
  const configValue = this.config();
  if (configValue) {
    this.configSignal.set(configValue);
  }
});

// Step 3: Merge on read
toolbarConfig = computed<ToolbarConfig>(() => ({
  ...this.defaultConfig,                // Defaults
  ...this.configSignal().toolbarConfig, // User overrides
}));
```

### Configuration Example

```typescript
// User provides partial config
const userConfig: EditorConfig = {
  toolbarConfig: {
    showBold: true,
    showItalic: true
    // Other values use the editor defaults
  }
};

// Editor merges with defaults (every flag is true by default except
// showDistractionFree)
const finalConfig = {
  showBold: true,           // User value
  showItalic: true,         // User value
  showUnderline: true,      // Default value
  showStrikethrough: true,  // Default value
  // ... all other defaults
};
```

### Feature Gates

Configuration controls feature availability:

```typescript
execCommand(command: string, value?: string) {
  if (this.disabled()) return;

  // Map the browser command name to the toolbar flag that gates it
  const featureMap: Record<string, string> = {
    bold: 'bold',
    italic: 'italic',
    underline: 'underline',
    strikeThrough: 'strikethrough',
    subscript: 'subscript',
    superscript: 'superscript',
    justifyLeft: 'alignLeft',
    justifyCenter: 'alignCenter',
    justifyRight: 'alignRight',
    justifyFull: 'alignJustify',
    insertUnorderedList: 'unorderedList',
    insertOrderedList: 'orderedList',
    indent: 'indent',
    outdent: 'outdent',
    undo: 'undo',
    redo: 'redo',
    removeFormat: 'clearFormatting',
  };

  const featureName = featureMap[command];
  if (featureName && !this.isFeatureEnabled(featureName)) {
    console.warn(`Feature '${featureName}' is disabled in editor configuration`);
    return;
  }

  document.execCommand(command, false, value);
  this.updateEditorState();
  this.onContentChange();
}

// The flag lookup is an explicit switch — not a string-built `show${feature}` key
private isFeatureEnabled(feature: string): boolean {
  const config = this.toolbarConfig();

  switch (feature) {
    case 'bold':
      return config.showBold ?? true;
    case 'italic':
      return config.showItalic ?? true;
    case 'underline':
      return config.showUnderline ?? true;
    case 'strikethrough':
      return config.showStrikethrough ?? true;
    case 'subscript':
      return config.showSubscript ?? true;
    case 'superscript':
      return config.showSuperscript ?? true;
    case 'alignLeft':
      return config.showAlignLeft ?? true;
    // …one case per gated feature:
    // unorderedList, orderedList, indent, outdent, undo, redo, insertLink,
    // insertTable, clearFormatting, htmlEdit, fontFamily, fontSize
    default:
      return true; // Unknown features are allowed
  }
}
```

## Resource Management

### The Problem

Web applications can leak memory through:
- Event listeners not removed
- Timers (setTimeout/setInterval) not cleared
- Observers not disconnected

### The Solution: Performance Manager

```typescript
interface EditorPerformanceManager {
  debounce<T extends (...args: any[]) => void>(
    key: string,
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void;
  cleanup(): void;
  track(resource: { cleanup: () => void }): void;
  getActiveResourceCount(): number;
}
```

### How It Works

```
Component Created
        │
        ▼
Create Performance Manager
        │
        ▼
Setup Resources (timers, listeners, observers)
        │
        ▼
Track Each Resource
        │
        ▼
Component Destroyed
        │
        ▼
Performance Manager Cleanup
        │
        ▼
All Resources Released
```

### Safe Wrappers

#### Safe Timeout

```typescript
private safeTimeout(callback: () => void, delay = 0): number {
  if (this.isDestroyed) return -1;

  const id = window.setTimeout(() => {
    if (!this.isDestroyed) {
      callback();
    }
  }, delay);

  // Track for cleanup
  this.performanceManager.track({
    cleanup: () => clearTimeout(id),
  });

  return id;
}
```

#### Safe Interval

```typescript
private safeInterval(callback: () => void, delay: number): void {
  if (this.isDestroyed) return;

  const id = window.setInterval(() => {
    if (this.isDestroyed) {
      clearInterval(id);
      return;
    }
    callback();
  }, delay);

  // Track for cleanup
  this.performanceManager.track({
    cleanup: () => clearInterval(id),
  });
}
```

#### Safe Event Listener

```typescript
private safeAddEventListener(
  target: EventTarget,
  event: string,
  listener: EventListener,
  options?: AddEventListenerOptions
): void {
  if (this.isDestroyed) return;

  target.addEventListener(event, listener, options);

  // Track for cleanup
  this.performanceManager.track({
    cleanup: () => target.removeEventListener(event, listener),
  });
}
```

### Automatic Cleanup

Cleanup is registered once with Angular's `DestroyRef`, so it also runs if the
component is destroyed without `ngOnDestroy()` being reached:

```typescript
constructor() {
  // …
  this.destroyRef.onDestroy(() => {
    this.performanceManager.cleanup();
    this.resourceCleanup.forEach(cleanup => cleanup());
    this.observerCleanup.forEach(cleanup => cleanup());
    this.resourceCleanup.clear();
    this.observerCleanup.clear();
  });
}
```

## Error Handling

### Validation Errors

Validation limits live under `config.validation` and are read through the
`validationConfig()` signal. The component exposes the result through
`isContentValid()` and `getValidationErrors()`:

```typescript
isContentValid(): boolean {
  const stats = this.wordCountStats();
  const config = this.validationConfig();

  if (config.maxWords && stats.words > config.maxWords) return false;
  if (config.minWords && stats.words < config.minWords) return false;
  if (config.maxCharacters && stats.characters > config.maxCharacters) return false;
  if (config.minCharacters && stats.characters < config.minCharacters) return false;

  return true;
}

getValidationErrors(): string[] {
  const errors: string[] = [];
  const stats = this.wordCountStats();
  const config = this.validationConfig();

  if (config.minWords && stats.words < config.minWords) {
    errors.push(
      `Content below minimum word requirement of ${config.minWords} (current: ${stats.words})`
    );
  }

  // …the same pattern for maxWords, maxCharacters and minCharacters

  return errors;
}
```

The reusable helpers live on `RmNgEditorService`: `validateContent(html)` returns
`{ isValid, errors }`, and `getWordCount(html)` / `getCharacterCount(html)` count
without instantiating an editor.

### Graceful Degradation

If a browser API isn't available, the editor keeps working and simply skips the
optimisation that depends on it:

```typescript
private setupResizeObserver(): void {
  if (!('ResizeObserver' in window)) return;

  this.resizeObserver = new ResizeObserver(entries => {
    // Debounce resize handling under the 'resize' key
    this.debounce(
      'resize',
      () => {
        entries.forEach(() => {
          this.handleEditorResize();
        });
      },
      100
    )();
  });

  const editorElement = this.editorElement().nativeElement;
  this.resizeObserver.observe(editorElement);
}
```

### Platform Checks

Server-side rendering support. `ngOnInit()` guards the `document.execCommand`
setup with a `typeof document` check, while the observers guard with
`isPlatformBrowser(this.platformId)`:

```typescript
ngOnInit() {
  if (typeof document !== 'undefined') {
    document.execCommand('defaultParagraphSeparator', false, 'p');
    document.execCommand('fontName', false, 'Arial');
  }

  this.initializePerformanceOptimizations();
}

private setupMutationObserver(): void {
  if (!isPlatformBrowser(this.platformId) || !('MutationObserver' in window)) {
    return;
  }

  // …create and track the observer
}
```

## Performance Optimization

### Debouncing

Reduce expensive operations:

```typescript
// Initialized once in the constructor, using the injected debounce delay
// (100 ms by default — see EDITOR_PERFORMANCE_CONFIG)
constructor() {
  this.debouncedUpdateEditorState = this.performanceManager.debounce(
    'updateEditorState',
    () => this.updateEditorState(),
    this.perfConfig.debounceDelay
  );
  this.debouncedUpdateWordCount = this.performanceManager.debounce(
    'updateWordCount',
    () => this.updateWordCount(),
    this.perfConfig.debounceDelay
  );
  this.debouncedRunSpellCheck = this.performanceManager.debounce(
    'runSpellCheck',
    () => this.runSpellCheck(),
    this.perfConfig.debounceDelay * 3
  );
}

onContentChange() {
  // …update the content signal and emit valueChange
  this.debouncedUpdateWordCount();

  // Spell check is the most expensive operation, so it runs last
  if (this.validationConfig().spellCheck?.enabled) {
    this.debouncedRunSpellCheck();
  }
}
```

Debounce keys used by the editor are `'updateEditorState'`, `'updateWordCount'`,
`'runSpellCheck'` and `'resize'`.

### Lazy Initialization

Only create what's needed. The three observers are set up from `ngOnInit()`, and
each setup returns early when its browser API is unavailable:

```typescript
private initializePerformanceOptimizations(): void {
  this.setupIntersectionObserver();
  this.setupResizeObserver();
  this.setupMutationObserver();
}
```

### Computed Values

Cache expensive calculations:

```typescript
// Recomputes only when the validation config changes
shouldShowStats = computed(() => {
  const config = this.validationConfig();
  return (
    config.showWordCount ||
    config.showCharacterCount ||
    config.showReadingTime
  );
});

// wordCountStats is a signal rather than a computed value: updateWordCount()
// reads getTextContent(), runs the counts once and calls wordCountStats.set(stats).
```

### OnPush Change Detection

Minimize change detection cycles:

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RmNgEditor {
  // Only updates when signals change
}
```

## Key Takeaways

1. **Signals**: Use signals for all state management
2. **Zoneless**: No Zone.js dependency (`provideZonelessChangeDetection()`)
3. **ContentEditable**: Leverage browser's native editing capabilities
4. **Configuration**: Hierarchical config with sensible defaults
5. **Resource Management**: Automatic cleanup prevents memory leaks
6. **Validation**: Limits come from `config.validation`; `isContentValid()` and `getValidationErrors()` report them
7. **Performance**: Debouncing, lazy setup, and computed values

## Next Steps

- **[Architecture](./architecture.md)**: Understand the system design
- **[Best Practices](./best-practices.md)**: Follow recommended patterns
- **[Performance Optimization](./performance-optimization.md)**: Optimize your usage

---

**Concepts Version**: 1.0  
**Last Updated**: July 2026

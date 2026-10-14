# Architecture

This document explains the system design, architecture patterns, and technical decisions behind `rm-ng-editor`.

## Table of Contents

- [High-Level Overview](#high-level-overview)
- [Application Architecture](#application-architecture)
- [Data Flow](#data-flow)
- [Design Patterns](#design-patterns)
- [Component Structure](#component-structure)
- [State Management](#state-management)
- [Performance Architecture](#performance-architecture)
- [Change Detection Strategy](#change-detection-strategy)

## High-Level Overview

`rm-ng-editor` is built as a modern Angular library following these architectural principles:

- **Zoneless Architecture**: No Zone.js dependency for better performance
- **Signal-based State**: Angular Signals for reactive state management
- **Standalone Components**: No NgModule required
- **OnPush Change Detection**: Optimized rendering
- **Resource Management**: Automatic cleanup and leak prevention

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Angular Application                       │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              Host Component (Consumer)                 │ │
│  │  ┌─────────────────────────────────────────────────┐  │ │
│  │  │         RmNgEditor Component                     │  │ │
│  │  │                                                   │  │ │
│  │  │  ┌───────────┐  ┌────────────┐  ┌────────────┐  │  │ │
│  │  │  │  Toolbar  │  │  Content   │  │ Statistics │  │  │ │
│  │  │  │  Manager  │  │ Editable   │  │   Panel    │  │  │ │
│  │  │  └───────────┘  └────────────┘  └────────────┘  │  │ │
│  │  │        │              │                │          │  │ │
│  │  │        └──────────────┴────────────────┘          │  │ │
│  │  │                      │                            │  │ │
│  │  │              ┌───────┴──────┐                     │  │ │
│  │  │              │   Signals    │                     │  │ │
│  │  │              │ State Store  │                     │  │ │
│  │  │              └──────────────┘                     │  │ │
│  │  │                      │                            │  │ │
│  │  │        ┌─────────────┴─────────────┐              │  │ │
│  │  │        │                           │              │  │ │
│  │  │  ┌─────┴──────┐           ┌───────┴────────┐     │  │ │
│  │  │  │ Performance│           │    Services    │     │  │ │
│  │  │  │  Manager   │           │   (Utility)    │     │  │ │
│  │  │  └────────────┘           └────────────────┘     │  │ │
│  │  └─────────────────────────────────────────────────┘  │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Application Architecture

### Layer Architecture

```
┌──────────────────────────────────────────┐
│         Presentation Layer               │
│  (Component, Template, Styles)           │
├──────────────────────────────────────────┤
│         State Management Layer           │
│  (Signals, Computed, Effects)            │
├──────────────────────────────────────────┤
│         Business Logic Layer             │
│  (Editor Commands, Validation)           │
├──────────────────────────────────────────┤
│         Service Layer                    │
│  (RmNgEditorService, Utilities)          │
├──────────────────────────────────────────┤
│         Infrastructure Layer             │
│  (Performance Manager, DOM APIs)         │
└──────────────────────────────────────────┘
```

### Component Hierarchy

```
RmNgEditor (Main Component)
├── Toolbar Section
│   ├── Text Formatting Tools
│   ├── Font Controls
│   ├── Alignment Tools
│   ├── List Controls
│   ├── Link & Media Tools
│   ├── Table Tools
│   └── View Mode Controls
│
├── Content Editable Area
│   └── ContentEditable Div (native)
│
└── Statistics Panel
    ├── Word Count Display
    ├── Character Count Display
    └── Reading Time Display
```

## Data Flow

### Content Update Flow

```
User Input (Keyboard/Mouse)
        │
        ▼
  (input) handler on .editor-content
        │
        ▼
  onContentChange()
        │
        ├──────────────────────┬──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
  content signal        valueChange            debouncedUpdateWordCount()
  updated               emitted                        │
        │                      │                      ▼
        ▼                      ▼               wordCountStats signal
  updateStateEffect    Parent Component               │
  (DOM sync)                                          ▼
                                              wordCountChange

  MutationObserver (separate path)
        │
        ▼
  debouncedUpdateWordCount() — a debounced word-count refresh only;
  it never writes the content signal
```

Content updates are driven by the template's `(input)` handler on the
`contenteditable` element. The `MutationObserver` exists only to refresh the
word count (debounced, and skipped while the editor is writing to the DOM).

### Configuration Flow

```
Parent Component Config
        │
        ▼
  Input Signal (config)
        │
        ▼
  configEffect → private configSignal
        │
        ▼
  Computed and derived signals
  (toolbarConfig, toolbarIcons, placeholder, height, …)
        │
        ├────────────────────┬────────────────┐
        │                    │                │
        ▼                    ▼                ▼
  Toolbar Visibility   Theme Application   Feature Gates
        │                    │                │
        ▼                    ▼                ▼
   Toolbar UI          CSS Classes       Feature Logic
```

## Design Patterns

### 1. Signal-based State Management

The editor uses Angular Signals for reactive state:

```typescript
// State signals (public, so the template and viewChild refs can read them)
content = signal('');
isHtmlEditMode = signal(false);
currentTheme = signal<'light' | 'dark' | 'auto'>('light');

// Computed state
toolbarConfig = computed<ToolbarConfig>(() => ({
  ...this.defaultConfig,
  ...this.configSignal().toolbarConfig,
}));

// Effects for side-effects
private configEffect = effect(() => {
  const configValue = this.config();
  if (configValue) {
    this.configSignal.set(configValue);
  }
});
```

### 2. Factory Pattern (Performance Manager)

Avoids global singletons:

```typescript
private createPerformanceManager(): EditorPerformanceManager {
  const debounceTimeouts = new Map<string, number>();
  const trackedResources = new Set<{ cleanup: () => void }>();

  return {
    debounce: <T extends (...args: any[]) => void>(
      key: string,
      func: T,
      delay: number
    ) => {
      return (...args: Parameters<T>) => {
        const existingTimeout = debounceTimeouts.get(key);
        if (existingTimeout) {
          clearTimeout(existingTimeout);
        }

        const timeoutId = window.setTimeout(() => {
          func.apply(this, args);
          debounceTimeouts.delete(key);
        }, delay);

        debounceTimeouts.set(key, timeoutId);
      };
    },
    cleanup: () => {
      // Clear all debounce timeouts
      debounceTimeouts.forEach(id => clearTimeout(id));
      debounceTimeouts.clear();

      // Cleanup tracked resources
      trackedResources.forEach(resource => {
        try {
          resource.cleanup();
        } catch {
          // Silent cleanup error handling
        }
      });
      trackedResources.clear();
    },
    track: (resource: { cleanup: () => void }) => {
      trackedResources.add(resource);
    },
    getActiveResourceCount: () => {
      return trackedResources.size + debounceTimeouts.size;
    },
  };
}
```

### 3. Observer Pattern (DOM Monitoring)

Uses modern Web APIs:

```typescript
private setupMutationObserver(): void {
  if (!isPlatformBrowser(this.platformId) || !('MutationObserver' in window)) {
    return;
  }

  const mutationObserver = new MutationObserver(mutations => {
    const hasMeaningfulChanges = mutations.some(
      mutation =>
        mutation.type === 'childList' ||
        (mutation.type === 'characterData' && mutation.target.textContent)
    );

    if (hasMeaningfulChanges && !this.isUpdatingContent) {
      this.debouncedUpdateWordCount();
    }
  });

  const editorElement = this.editorElement().nativeElement;
  mutationObserver.observe(editorElement, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: false, // Skip attribute changes for performance
  });

  this.performanceManager.track({
    cleanup: () => mutationObserver.disconnect(),
  });
}
```

### 4. Dependency Injection Pattern

Uses Angular's DI system:

```typescript
private readonly destroyRef = inject(DestroyRef);
private readonly platformId = inject(PLATFORM_ID);
private readonly defaultConfig = inject(EDITOR_DEFAULT_CONFIG);
private readonly defaultIcons = inject(EDITOR_DEFAULT_ICONS);
private readonly perfConfig = inject(EDITOR_PERFORMANCE_CONFIG);
```

### 5. Command Pattern (Editor Commands)

Encapsulates editing operations:

```typescript
execCommand(command: string, value?: string) {
  if (this.disabled()) return;

  const featureMap: Record<string, string> = {
    bold: 'bold',
    italic: 'italic',
    underline: 'underline',
    strikeThrough: 'strikethrough',
    // …justifyLeft/Center/Right/Full, insertUnorderedList/insertOrderedList,
    // indent, outdent, undo, redo, removeFormat
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
```

## Component Structure

### File Organization

```
projects/rm-ng-editor/src/lib/
├── rm-ng-editor.ts                      # Main component
├── rm-ng-editor.component.html          # Template
├── rm-ng-editor.component.scss          # Styles
├── rm-ng-editor.interfaces.ts           # Types, defaults, injection tokens
├── rm-ng-editor.service.ts              # Utility service
├── state-management/                    # Internal signal / cleanup helpers
│   ├── index.ts
│   ├── circular-update-guard.ts
│   ├── staleness-aware-signals.ts
│   ├── resource-cleanup-manager.ts
│   ├── state-management.spec.ts
│   └── state-management-cleanup.spec.ts
├── media-embeds/                        # Internal embed helpers
│   ├── index.ts
│   ├── media-embed-validator.ts
│   ├── embed-preview-manager.ts
│   ├── responsive-embed-container.ts
│   ├── broken-embed-handler.ts
│   ├── media-embeds.spec.ts
│   └── media-embeds-preview.spec.ts
├── rm-ng-editor.component.spec.ts
├── rm-ng-editor.service.spec.ts
├── rm-ng-editor.service-utils.spec.ts
├── rm-ng-editor.table.spec.ts
└── rm-ng-editor.configuration.spec.ts
```

`state-management/` and `media-embeds/` are internal: nothing from them is
re-exported by `public-api.ts`.

### Component Responsibilities

**RmNgEditor Component** (`rm-ng-editor.ts`)
- Main component logic
- State management via signals (`content`, `editorState`, `wordCountStats`, `currentTheme`, …)
- Event handling
- Performance management and resource cleanup
- Reads its defaults from three injection tokens: `EDITOR_DEFAULT_CONFIG`,
  `EDITOR_DEFAULT_ICONS` and `EDITOR_PERFORMANCE_CONFIG`

**Template** (`rm-ng-editor.component.html`)
- Toolbar rendering
- Content editable area
- Statistics panel
- Modal dialogs (HTML source editing, keyboard shortcuts)

**Service** (`rm-ng-editor.service.ts`)
- `htmlToText()` / `sanitizeHtml()` — HTML to text conversion and sanitization
- `getWordCount()` / `getCharacterCount()` — word and character counting
- `extractHeadings()` — heading extraction
- `validateContent()` — validation returning `{ isValid, errors }`
- `convertToFormat(html, 'text' | 'markdown')` — format conversion

**Interfaces** (`rm-ng-editor.interfaces.ts`)
- TypeScript type definitions
- Configuration interfaces
- Default configuration constants (`DEFAULT_TOOLBAR_CONFIG`,
  `DEFAULT_TOOLBAR_ICONS`, `DEFAULT_THEME_CONFIG`, `DEFAULT_FULLSCREEN_CONFIG`,
  `DEFAULT_VALIDATION_CONFIG`, `DEFAULT_TABLE_CONFIG`) and the injection tokens

## State Management

### Signal-based Reactive State

```
Input Signals (from parent)
        │
        ▼
Internal State Signals
        │
        ▼
Computed Signals (derived state)
        │
        ▼
Effects (side-effects)
        │
        ▼
Output Events (to parent)
```

### State Categories

**1. Configuration State**
```typescript
config = input<EditorConfig | null>(null);
private configSignal = signal<EditorConfig>({});

toolbarConfig = computed<ToolbarConfig>(() => ({
  ...this.defaultConfig,
  ...this.configSignal().toolbarConfig,
}));
```

**2. Content State**
```typescript
// Public: the contenteditable HTML, updated by onContentChange()
content = signal('');

// Private: the buffer used by the HTML source-edit modal
private htmlContent = signal('');
```

**3. UI State**
```typescript
isFullScreen = signal(false);
isDistractionFree = signal(false);
isHtmlEditMode = signal(false);
showShortcutsModal = signal(false);
```

**4. Editor State**
```typescript
editorState = signal<EditorState>({
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
  subscript: false,
  superscript: false,
  fontSize: '3',
  fontFamily: 'Arial',
  textColor: '#000000',
  alignment: 'left',
  heading: '',
  listType: '',
});
```

**5. Statistics State**
```typescript
wordCountStats = signal<WordCountStats>({
  words: 0,
  characters: 0,
  charactersNoSpaces: 0,
  paragraphs: 0,
  sentences: 0,
  readingTime: 0,
});

// updateWordCount() reads getTextContent(), runs the counts once and
// calls wordCountStats.set(stats); the (wordCountChange) output emits the same object.
```

## Performance Architecture

### Resource Management

```
Component Lifecycle
        │
        ▼
  ngOnInit()
        │
        ▼
  Create Performance Manager
        │
        ▼
  Setup Observers & Listeners
        │
        ▼
  Track Resources
        │
        ▼
  [Component Active]
        │
        ▼
  ngOnDestroy()
        │
        ▼
  Performance Manager Cleanup
        │
        ▼
  All Resources Released
```

### Memory Leak Prevention

1. **Timeout/Interval Tracking**
```typescript
private safeTimeout(callback: () => void, delay = 0): number {
  if (this.isDestroyed) return -1;

  const id = window.setTimeout(() => {
    if (!this.isDestroyed) {
      callback();
    }
  }, delay);

  this.performanceManager.track({
    cleanup: () => clearTimeout(id),
  });

  return id;
}
```

2. **Event Listener Cleanup**
```typescript
private safeAddEventListener(
  target: EventTarget,
  event: string,
  listener: EventListener,
  options?: AddEventListenerOptions
): void {
  if (this.isDestroyed) return;

  target.addEventListener(event, listener, options);
  this.performanceManager.track({
    cleanup: () => target.removeEventListener(event, listener),
  });
}
```

3. **Observer Cleanup**
```typescript
private setupMutationObserver(): void {
  if (!isPlatformBrowser(this.platformId) || !('MutationObserver' in window)) {
    return;
  }

  const mutationObserver = new MutationObserver(() => {
    /* debounced word-count refresh — see Design Pattern 3 */
  });

  this.performanceManager.track({
    cleanup: () => mutationObserver.disconnect(),
  });
}
```

### Debouncing Strategy

```typescript
private debounce<T extends (...args: any[]) => void>(
  key: string,
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  return (...args: Parameters<T>) => {
    if (this.isDestroyed) return;

    const existingTimeout = this.debounceTimeouts.get(key);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    const timeoutId = this.safeTimeout(() => {
      func.apply(this, args);
      this.debounceTimeouts.delete(key);
    }, delay);

    this.debounceTimeouts.set(key, timeoutId);
  };
}
```

The performance manager's `debounce()` follows the same keyed pattern but keeps its
own `Map<string, number>`, which is what the three named debounces
(`'updateEditorState'`, `'updateWordCount'`, `'runSpellCheck'`) use. The default
delay comes from `EDITOR_PERFORMANCE_CONFIG` (100 ms); the spell-check debounce is
3× that.

## Change Detection Strategy

### OnPush with Signals

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RmNgEditor {
  // Input signals trigger change detection
  config = input<EditorConfig | null>(null);
  value = input<string>('');

  // Computed signals re-evaluate automatically
  toolbarConfig = computed<ToolbarConfig>(() => ({
    ...this.defaultConfig,
    ...this.configSignal().toolbarConfig,
  }));

  // Effects run when dependencies change
  private updateStateEffect = effect(() => {
    const editor = this.editorElement().nativeElement;
    if (editor && editor.innerHTML !== this.content()) {
      editor.innerHTML = this.content();
    }
  });
}
```

### Benefits

1. **Predictable Updates**: Only updates when signals change
2. **No Zone.js**: Zoneless architecture
3. **Better Performance**: Fewer change detection cycles
4. **Explicit**: Clear dependency tracking

### Change Detection Flow

```
User Action
     │
     ▼
Signal Update
     │
     ▼
Computed Re-evaluation
     │
     ▼
Effect Execution
     │
     ▼
Template Update
```

## Platform-Aware Initialization

### Server-Side Rendering Support

`ngOnInit()` guards the `document.execCommand` setup with a `typeof document`
check, and each observer guards with `isPlatformBrowser(this.platformId)`:

```typescript
ngOnInit() {
  // `document` only exists in a browser
  if (typeof document !== 'undefined') {
    document.execCommand('defaultParagraphSeparator', false, 'p');
    document.execCommand('fontName', false, 'Arial');
  }

  this.initializePerformanceOptimizations();
}

private setupIntersectionObserver(): void {
  if (!isPlatformBrowser(this.platformId) || !('IntersectionObserver' in window)) {
    return;
  }

  // Browser-only observer setup
}
```

## Key Architectural Decisions

### 1. Why Zoneless?

- **Better Performance**: No Zone.js overhead
- **Smaller Bundle**: Reduced bundle size
- **Modern Approach**: Aligns with Angular's future direction
- **Explicit**: Clear when changes propagate

### 2. Why Signals?

- **Fine-grained Reactivity**: Only update what changed
- **Automatic Dependency Tracking**: No manual subscriptions
- **Built-in**: No external state management library
- **Performance**: Optimized for Angular's rendering

### 3. Why Standalone Components?

- **Simpler Imports**: No NgModule boilerplate
- **Tree-shakeable**: Better dead code elimination
- **Modern**: Angular's recommended approach
- **Easier Testing**: Simplified test setup

### 4. Why OnPush?

- **Performance**: Fewer change detection cycles
- **Predictable**: Explicit change tracking
- **Works with Signals**: Perfect pairing
- **Best Practice**: Industry standard

### 5. Why Performance Manager?

- **Memory Safety**: Prevents leaks
- **Resource Tracking**: Central cleanup
- **Maintainable**: Easy to track resources
- **Testable**: Can verify cleanup

## Next Steps

- **[Core Concepts](./core-concepts.md)**: Understand key concepts
- **[Performance Optimization](./performance-optimization.md)**: Optimize usage
- **[Best Practices](./best-practices.md)**: Follow recommended patterns

---

**Architecture Version**: 1.0  
**Last Updated**: July 2026

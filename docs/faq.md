# Frequently Asked Questions (FAQ)

Common questions about `rm-ng-editor`.

## General Questions

### What is rm-ng-editor?

`rm-ng-editor` is a modern, high-performance rich text editor library for Angular. It uses zoneless architecture and signal-based state management for optimal performance.

### Which Angular versions are supported?

The published package declares this peer range:

```json
"peerDependencies": {
  "@angular/common": ">=16.0.0 <=26.0.0",
  "@angular/core": ">=16.0.0 <=26.0.0"
}
```

The library in this repository is built, type-checked and tested on **Angular 22** (Angular 22.0.4, `@angular/build` 22.0.5). The `16`–`26` bound is the *declared* peer range; only Angular 22 is exercised by the build and the Vitest suite here.

### Why is the library written for that range?

It is a zoneless, signal-based library:
- **Zoneless change detection**: no Zone.js required
- **Signal-based state**: `input()`, `output()` and signals throughout
- **Standalone components**: no `NgModule` needed
- **ES2022 output**: as configured in the workspace `tsconfig.json`

### Can I use this with an older Angular version?

Your package manager will accept anything the declared peer range allows (`>=16.0.0 <=26.0.0`). Be aware that earlier majors inside that range are not verified here — this repository builds and tests against Angular 22 only.

### Is this library production-ready?

Yes. Angular 22 is a stable release, and the library ships with:
- Comprehensive error handling
- Memory leak prevention
- Automated browser-independent tests (Vitest + jsdom)
- Performance optimizations (debounced word count, spell check and state updates)

## Installation & Setup

### Do I need to install any peer dependencies?

Yes, you need:
- `@angular/common` within `>=16.0.0 <=26.0.0`
- `@angular/core` within `>=16.0.0 <=26.0.0`

Both are declared as **peer dependencies** of `@codewithrajat/rm-ng-editor`, so npm/pnpm/yarn warn if the Angular version already installed in your app does not satisfy that range.

### Can I use npm instead of pnpm?

Yes. While pnpm is recommended for performance, the library works with:
- pnpm 10.11.1+ (recommended — the version this workspace pins via `packageManager`)
- npm 10.8+
- yarn 4+

Note that CI in this repository runs on Node.js 22 with pnpm 10.11.1 only.

###  Do I need Zone.js?

No! The library is built for zoneless Angular and does not require Zone.js. In fact, removing Zone.js improves performance.

## Configuration

### Can I customize the toolbar?

Yes, extensively! You can:
- Show/hide individual buttons
- Show/hide entire button groups
- Customize button icons (text, emoji, SVG)
- Reorder toolbar sections (via CSS)

Example:
```typescript
const config: EditorConfig = {
  toolbarConfig: {
    showBold: true,
    showItalic: true,
    showUnderline: false,  // Hide specific features
    showStrikethrough: false
  }
};
```

### How do I disable specific features?

Set the corresponding configuration property to `false`:

```typescript
const config: EditorConfig = {
  toolbarConfig: {
    showTable: false,        // Disable tables
    showYouTubeEmbed: false, // Disable YouTube
    showTwitterEmbed: false  // Disable Twitter
  }
};
```

### Can I use custom icons?

Yes, but not through `EditorConfig`. Icons come from the `EDITOR_DEFAULT_ICONS` injection token (a `ToolbarIcons` object); override it in `providers`:

```typescript
import { Component } from '@angular/core';
import { RmNgEditor, EDITOR_DEFAULT_ICONS } from 'rm-ng-editor';

@Component({
  selector: 'app-custom-icons',
  imports: [RmNgEditor],
  providers: [
    {
      provide: EDITOR_DEFAULT_ICONS,
      useValue: {
        bold: '<strong>B</strong>',
        italic: '<em>I</em>',
        insertLink: '🔗',
        insertImage: '📷'
      }
    }
  ],
  template: `<app-rm-ng-editor />`
})
export class CustomIconsComponent {}
```

Any key you leave out falls back to `DEFAULT_TOOLBAR_ICONS`. The full key list is the `ToolbarIcons` interface (55 optional keys).

### How do I set a height limit?

Use the `height` and `maxHeight` properties:

```typescript
const config: EditorConfig = {
  height: '400px',     // Initial height
  maxHeight: '800px'   // Maximum before scrolling
};
```

## Usage & Features

### How do I get the editor content?

Hold the content in a signal and listen to the `(valueChange)` output:

```typescript
import { Component, signal } from '@angular/core';

@Component({
  template: `
    <app-rm-ng-editor
      [value]="content()"
      (valueChange)="onContentChange($event)"
    />
  `
})
export class MyComponent {
  content = signal('');

  onContentChange(html: string) {
    this.content.set(html);
  }
}
```

`[(value)]` does compile — there is a `value` input and a matching `valueChange`
output — but `value` is a one-way signal input that does not write back, so prefer
the explicit `[value]` + `(valueChange)` pair shown above.

### Does the editor work with Angular forms?

Not directly. `RmNgEditor` does **not** implement `ControlValueAccessor`, so the standard form directives cannot bind to `<app-rm-ng-editor>`. Bridge it to a `FormControl` by hand:

```typescript
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RmNgEditor } from 'rm-ng-editor';

@Component({
  imports: [ReactiveFormsModule, RmNgEditor],
  template: `
    <form [formGroup]="form">
      <app-rm-ng-editor
        [value]="form.controls.content.value"
        (valueChange)="form.controls.content.setValue($event)"
      />
    </form>
  `
})
export class MyComponent {
  form = new FormGroup({
    content: new FormControl('', { nonNullable: true })
  });
}
```

If you need a form directive to work on the editor, write a thin `ControlValueAccessor` wrapper component in your own app that forwards `writeValue` to `[value]` and `registerOnChange` to `(valueChange)`.

### How do I set initial content?

Use the `value` input:

```html
<app-rm-ng-editor [value]="initialContent" />
```

```typescript
export class MyComponent {
  initialContent = '<h1>Hello World</h1><p>Initial content</p>';
}
```

### Can I make the editor read-only?

Yes, set `disabled` to `true`:

```typescript
const config: EditorConfig = {
  disabled: true
};
```

### Does it support markdown?

The editor works with HTML. However, the service provides HTML to Markdown conversion:

```typescript
import { inject } from '@angular/core';
import { RmNgEditorService } from 'rm-ng-editor';

export class MyComponent {
  editorService = inject(RmNgEditorService);

  convertToMarkdown(html: string) {
    return this.editorService.convertToFormat(html, 'markdown');
  }
}
```

### How do I validate content?

Use the `validation` configuration:

```typescript
const config: EditorConfig = {
  validation: {
    minWords: 100,
    maxWords: 5000,
    maxCharacters: 20000
  }
};
```

Or use the service for custom validation:

```typescript
import { inject } from '@angular/core';
import { RmNgEditorService } from 'rm-ng-editor';

export class MyComponent {
  private editorService = inject(RmNgEditorService);

  check(html: string) {
    const result = this.editorService.validateContent(html);
    if (!result.isValid) {
      console.error(result.errors);
    }
  }
}
```

### Can I insert images?

Yes, in several ways:

1. **Via the toolbar** (built-in):
   - Click the insert image button
   - Enter image URL
   - Optionally set dimensions

2. **Programmatically**, through the component's `insertImage()` method — get a reference with a `viewChild` query:
```typescript
import { Component, viewChild } from '@angular/core';
import { RmNgEditor } from 'rm-ng-editor';

export class MyComponent {
  private readonly editor = viewChild.required(RmNgEditor);

  insertImage() {
    this.editor().insertImage();
  }
}
```

Note that writing to the contenteditable DOM yourself (for example with `document.execCommand('insertHTML', …)`) bypasses the component and does not emit `(valueChange)`.

### Does it support video embedding?

Yes. The toolbar controls and the matching component methods are:
- YouTube — `embedYouTube()`
- Vimeo — `embedVimeo()`
- Twitter — `embedTwitter()`
- Instagram — `embedInstagram()`
- Custom embeds — `embedCustomMedia()`
- Video and audio files — `insertVideo()` and `insertAudio()`
- Link previews — `generateLinkPreview(url)`

### How do I implement auto-save?

Use Angular effects:

```typescript
import { effect, signal } from '@angular/core';

export class MyComponent {
  content = signal('');
  private saveTimeoutId?: number;

  constructor() {
    effect(() => {
      const html = this.content();
      
      // Debounce autosave
      clearTimeout(this.saveTimeoutId);
      this.saveTimeoutId = setTimeout(() => {
        this.autoSave(html);
      }, 2000) as unknown as number;
    });
  }

  autoSave(html: string) {
    // Save to backend
    console.log('Auto-saving:', html);
  }
}
```

## Performance

### Why is initialization slow?

Possible causes:
1. **Large initial content**: Split content into chunks
2. **Too many features enabled**: Disable unused features
3. **Not using lazy loading**: Load editor component lazily
4. **Development mode**: Build with `--configuration=production`

### How do I optimize performance?

1. **Disable unused features**:
```typescript
const config: EditorConfig = {
  toolbarConfig: {
    showSpellCheck: false,
    showWordCount: false
  }
};
```

2. **Tune the internal debounce delay**:
The component debounces word count, spell check and editor-state updates using
`EDITOR_PERFORMANCE_CONFIG` (`debounceDelay`, default `100` ms). Override the token
if you need a longer delay:

```typescript
import { EDITOR_PERFORMANCE_CONFIG } from 'rm-ng-editor';

providers: [
  {
    provide: EDITOR_PERFORMANCE_CONFIG,
    useValue: { debounceDelay: 300, chunkSize: 1000, maxContentSize: 100000 }
  }
]
```

3. **Use production build**:
```bash
ng build --configuration=production
```

4. **Lazy load the editor**:
```typescript
loadComponent: () => import('rm-ng-editor').then(m => m.RmNgEditor)
```

### Does it cause memory leaks?

No. The library includes comprehensive memory leak prevention:
- Automatic cleanup of timers
- Event listener cleanup
- Observer disconnection
- Resource tracking

All cleanup happens automatically in `ngOnDestroy()`.

### What's the bundle size impact?

No size figures are published here — measure the impact in your own build. The
library ships as an ES2022 FESM bundle with `sideEffects: false`, so a bundler can
tree-shake the toolbar and features you do not enable.

```bash
pnpm run build:demo
# then inspect the emitted files in dist/demo/browser/
```

## Browser Support

### Does it work in Internet Explorer?

No. IE 11 is not supported due to:
- No Angular 22 / ES2022 support
- No modern JavaScript features
- Security vulnerabilities

### What's the minimum browser version?

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 119+ |
| Firefox | 120+ |
| Safari | 17+ |
| Edge | 119+ |

### Does it work on mobile?

Yes! Fully supported on:
- iOS 17+ (Safari, Chrome)
- Android 12+ (Chrome, Firefox)

Features include:
- Touch-friendly toolbar
- Virtual keyboard support
- Responsive design
- Mobile gestures

### Why these specific browser versions?

These are the minimum versions required by:
- The Angular 22 toolchain and the `ES2022` output target set in `tsconfig.json`
- The modern Web APIs the editor relies on (`MutationObserver`, `ResizeObserver`, `contenteditable`, and the Selection/Range APIs)

## Customization

### Can I add custom buttons to the toolbar?

Currently, the toolbar is configured via the `toolbarConfig` interface. For fully custom buttons, you would need to:

1. Fork the library, or
2. Create a wrapper component with additional controls

### Can I integrate with my own backend?

Yes! Handle the `valueChange` event and save to your backend:

```typescript
export class MyComponent {
  async onContentChange(html: string) {
    await fetch('/api/save-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: html })
    });
  }
}
```

### How do I apply custom styling?

Use Angular's view encapsulation and CSS:

```typescript
@Component({
  styles: [`
    :host ::ng-deep app-rm-ng-editor .ng-rm-editor-wrapper {
      border: 1px solid #0066cc;
    }

    :host ::ng-deep app-rm-ng-editor .toolbar {
      background: #f5f5f5;
    }
  `]
})
```

The wrapper classes emitted by the component are `ng-rm-editor-wrapper`, `toolbar`,
`editor-content`, `validation-stats`, `spell-check-suggestions`, `validation-errors`,
`html-edit-modal` and `shortcuts-modal`.

Or use the theme configuration, which accepts a `ThemeConfig`:

```typescript
const config: EditorConfig = {
  theme: {
    mode: 'light',
    primaryColor: '#4CAF50',
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
    textColor: '#1f2937'
  }
};
```

### Can I use my own fonts?

Yes, via `toolbarConfig`:

```typescript
const config: EditorConfig = {
  toolbarConfig: {
    showFontFamily: true
  }
};
```

The font-family control offers a fixed list of built-in choices: Arial, Helvetica,
Georgia, Times New Roman, Courier New and Verdana.

## Architecture & Design

### Why zoneless?

Benefits of zoneless architecture:
- **Better performance**: No Zone.js overhead
- **More predictable**: Explicit change detection
- **Future-proof**: The direction Angular itself recommends

### Why signals instead of RxJS?

Signals provide:
- **Simpler API**: No manual subscriptions
- **Fine-grained reactivity**: Only update what changed
- **Built-in**: No extra dependency for the component's own state
- **Better performance**: Optimized by Angular

The component holds its state in signals and does not subscribe to RxJS observables
internally. RxJS is an Angular peer dependency and is useful in *your* integration
code — for example the debounced auto-save pattern.

### Is it accessible?

Yes! The editor includes:
- ARIA labels for screen readers
- Keyboard navigation
- Focus management
- High contrast mode support
- Comprehensive keyboard shortcuts

### Does it work with SSR (Server-Side Rendering)?

Yes, with platform checks:

```typescript
ngOnInit() {
  if (!isPlatformBrowser(this.platformId)) {
    return; // Skip browser-only features
  }
  // Browser initialization
}
```

## Troubleshooting

### Content is not updating

Check if you're using signals correctly:

```typescript
// ✅ Correct
const content = signal('');
content.set('new value');

// ❌ Incorrect
let content = '';
content = 'new value';
```

### Toolbar buttons are missing

Verify configuration:

```typescript
const config: EditorConfig = {
  showToolbar: true,  // Must be true
  toolbarConfig: {
    showBold: true    // Enable specific features
  }
};
```

### Getting TypeScript errors

Check that your TypeScript version is compatible with Angular 22 (TypeScript 5.9 or
newer). This workspace pins TypeScript 6.0.3:

```bash
pnpm add -D typescript@~6.0.3
```

## Support & Community

### Where can I get help?

1. Check this FAQ
2. Read the [Troubleshooting Guide](./troubleshooting.md)
3. Review [GitHub Issues](https://github.com/malikrajat/rm-ng-editor/issues)
4. Open a new issue with details

### How do I report a bug?

Open a GitHub issue with:
1. Browser and OS version
2. Angular and rm-ng-editor version
3. Minimal reproduction code
4. Expected vs actual behavior
5. Console errors/warnings

### Can I contribute?

Yes! Contributions are welcome. See [Extending the Project](./extending-the-project.md) for development guidelines.

### Is there a roadmap?

Yes, see the [CHANGELOG.md](../CHANGELOG.md) file for released changes and planned work. The same history is kept in the documentation as [./changelog.md](./changelog.md).

### What's the license?

MIT License. See [LICENSE](../LICENSE) for details.

---

**Still have questions?**
- Check [Troubleshooting Guide](./troubleshooting.md)
- Review [API Reference](./api-reference.md)
- Open a [GitHub Issue](https://github.com/malikrajat/rm-ng-editor/issues)

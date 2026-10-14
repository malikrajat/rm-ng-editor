# Troubleshooting

Common issues and their solutions when using `rm-ng-editor`.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Build Errors](#build-errors)
- [Runtime Errors](#runtime-errors)
- [Editor Behavior Issues](#editor-behavior-issues)
- [Performance Issues](#performance-issues)
- [Browser Compatibility Issues](#browser-compatibility-issues)

## Installation Issues

### Issue: Peer Dependency Warnings

**Symptoms:**
```
npm WARN  peer dependency @angular/core@">=16.0.0 <=26.0.0" required
```

**Solution:**
Install an Angular version inside the declared peer range. To move a workspace onto
the version this library is built and verified against:
```bash
ng update @angular/core@22 @angular/cli@22
```

###  Issue: Module Not Found

**Symptoms:**
```
Error: Cannot find module '@codewithrajat/rm-ng-editor'
```

**Solutions:**

1. Verify installation:
```bash
pnpm list @codewithrajat/rm-ng-editor
```

2. Clear cache and reinstall:
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

3. Check import statement:
```typescript
// Correct — the published package is scoped
import { RmNgEditor } from '@codewithrajat/rm-ng-editor';

// Incorrect
import { RmNgEditor } from '@rm-ng-editor';   // ❌
import RmNgEditor from '@codewithrajat/rm-ng-editor';  // ❌ named export, not default
```

Inside *this* repository the short specifier `rm-ng-editor` also resolves, because the
root `tsconfig.json` maps it to `./dist/rm-ng-editor`. That alias does not exist in a
consumer application.

### Issue: TypeScript Version Mismatch

**Symptoms:**
```
error TS2304: Cannot find name 'Signal'
error TS2304: Cannot find name 'WritableSignal'
```

**Solution:**
Use a TypeScript version compatible with Angular 22 (TypeScript 5.9 or newer). This
workspace pins TypeScript 6.0.3:
```bash
pnpm add -D typescript@~6.0.3
```

## Build Errors

### Issue: Zoneless Configuration Error

**Symptoms:**
The application bootstraps without zoneless change detection, or the bootstrap fails
because `provideZonelessChangeDetection()` is not in the providers.

**Solution:**
Add `provideZonelessChangeDetection()` to your bootstrap providers. This matches
`projects/demo/src/main.ts` in this repository:

```typescript
import { provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, {
  ...appConfig,
  providers: [provideZonelessChangeDetection(), ...appConfig.providers],
}).catch(err => console.error(err));
```

Use the stable API name `provideZonelessChangeDetection()`. The experimental name it
replaced was removed from Angular and is no longer importable.

### Issue: SCSS Compilation Errors

**Symptoms:**
```
Error: Cannot compile SCSS in component styles
```

**Solution:**
Enable SCSS in `angular.json`:

```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "inlineStyleLanguage": "scss"
          }
        }
      }
    }
  }
}
```

### Issue: Build Size Too Large

**Symptoms:**
Bundle size exceeds budget limits.

**Solutions:**

1. Enable production optimization:
```bash
ng build --configuration=production
```

2. Use lazy loading:
```typescript
const routes = [
  {
    path: 'editor',
    loadComponent: () => import('./editor/editor.component')
  }
];
```

3. Adjust budgets in `angular.json`:
```json
{
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "1MB",
      "maximumError": "2MB"
    }
  ]
}
```

## Runtime Errors

### Issue: Content Not Updating

**Symptoms:**
Changes not reflected in the editor.

**Solutions:**

1. Check if using signals correctly:
```typescript
// ✅ Correct
const content = signal('');
content.set('new value');

// ❌ Incorrect
let content = '';
content = 'new value';  // Won't trigger updates
```

2. Verify OnPush change detection:
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush  // Required
})
```

3. Use signal update properly:
```typescript
// For objects/arrays
config.update(current => ({
  ...current,
  newProperty: 'value'
}));
```

### Issue: valueChange Event Not Firing

**Symptoms:**
`(valueChange)` output not emitting.

**Solutions:**

1. Check binding syntax:
```html
<!-- ✅ Correct -->
<app-rm-ng-editor (valueChange)="onContentChange($event)" />

<!-- ❌ Incorrect -->
<app-rm-ng-editor [valueChange]="onContentChange($event)" />
<app-rm-ng-editor (change)="onContentChange($event)" />
```

2. Ensure handler is defined:
```typescript
export class MyComponent {
  onContentChange(html: string) {  // Must exist
    console.log(html);
  }
}
```

### Issue: Toolbar Buttons Not Showing

**Symptoms:**
Some or all toolbar buttons are missing.

**Solutions:**

1. Check configuration:
```typescript
config = signal<EditorConfig>({
  showToolbar: true,  // Must be true
  toolbarConfig: {
    showBold: true,   // Enable specific features
    showItalic: true
  }
});
```

2. Verify parent configuration doesn't disable features:
```typescript
// This disables all features
toolbarConfig: {
  showTextFormatting: false  // ❌ Disables all text formatting
}
```

3. Ensure CSS is loading:
Check browser DevTools → Network tab for CSS files.

### Issue: Cannot Read Property of Undefined

**Symptoms:**
```
TypeError: Cannot read properties of undefined (reading 'nativeElement')
```

**Solution:**
The editor has not been rendered yet. Query it with the signal-based `viewChild`
query instead of the decorator form:

```typescript
import { Component, viewChild } from '@angular/core';
import { RmNgEditor } from 'rm-ng-editor';

@Component({
  selector: 'app-host',
  imports: [RmNgEditor],
  template: `<app-rm-ng-editor />`
})
export class HostComponent {
  // Signal query — resolves with the component instance once the view exists.
  readonly editor = viewChild(RmNgEditor);

  useEditor(): void {
    // Returns `undefined` until the view is created, so check before using it.
    const editor = this.editor();
    if (editor) {
      editor.focus();
    }
  }
}
```

If you prefer the classic hook, the query is populated by the time `ngAfterViewInit`
runs — never touch it from the constructor:

```typescript
import { AfterViewInit, Component, viewChild } from '@angular/core';
import { RmNgEditor } from 'rm-ng-editor';

export class HostComponent implements AfterViewInit {
  readonly editor = viewChild(RmNgEditor);

  ngAfterViewInit(): void {
    this.editor()?.focus();
  }
}
```

Use `viewChild.required(RmNgEditor)` when the editor is always rendered: it throws
instead of returning `undefined`, so a missing editor surfaces immediately rather
than as a later `Cannot read properties of undefined`.

## Editor Behavior Issues

### Issue: Formatting Not Applied

**Symptoms:**
Bold/italic/etc. buttons don't work.

**Solutions:**

1. Check if text is selected:
```typescript
// Bold requires text selection
const selection = window.getSelection();
if (!selection || selection.isCollapsed) {
  alert('Please select text first');
}
```

2. Verify feature is enabled:
```typescript
const config: EditorConfig = {
  toolbarConfig: {
    showBold: true  // Must be true
  }
};
```

3. Check for conflicting styles:
```css
/* This might prevent formatting */
[contenteditable] * {
  all: unset;  /* ❌ Don't do this */
}
```

### Issue: Links Not Clickable

**Symptoms:**
Links in content are not clickable.

**Solution:**
Links are editable by default in contenteditable. For read-only view:

```typescript
config = signal<EditorConfig>({
  disabled: true  // Makes editor read-only
});
```

Or handle click programmatically:
```typescript
onClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target.tagName === 'A') {
    window.open((target as HTMLAnchorElement).href, '_blank');
    event.preventDefault();
  }
}
```

### Issue: Undo/Redo Not Working

**Symptoms:**
Undo/redo doesn't restore previous states.

**Solutions:**

1. Don't rewrite the contenteditable DOM outside of `execCommand`. This is guidance
   for **your own** handler code — the editor's own undo/redo buttons go through
   `execCommand` internally:

```typescript
// ❌ Incorrect - breaks the browser's undo history
editorElement.innerHTML = 'new content';

// ✅ Correct - preserves history (your own code, not a library API)
document.execCommand('insertHTML', false, 'new content');
```

2. Check if undo/redo is enabled:
```typescript
const config: EditorConfig = {
  toolbarConfig: {
    showUndoRedo: true,
    showUndo: true,
    showRedo: true
  }
};
```

3. Prefer the component's own content APIs so the editor can track the change:
```typescript
this.editor().setContent('<p>new content</p>');
```

### Issue: Pasted Content Loses Formatting

**Symptoms:**
Pasted content doesn't preserve formatting.

**Solution:**
Add your **own** paste handler to intercept the paste before it reaches the
contenteditable. This is consumer code — the library does not expose a paste hook.
Paste events bubble, so a binding on the host element works:

```html
<app-rm-ng-editor (paste)="onPaste($event)" />
```

```typescript
onPaste(event: ClipboardEvent) {
  event.preventDefault();

  const html = event.clipboardData?.getData('text/html');
  const text = event.clipboardData?.getData('text/plain');

  if (html) {
    // Preserve formatting
    document.execCommand('insertHTML', false, html);
  } else if (text) {
    // Plain text fallback
    document.execCommand('insertText', false, text);
  }
}
```

## Performance Issues

### Issue: Slow Initialization

**Symptoms:**
Editor takes long time to load.

**Solutions:**

1. Use lazy loading:
```typescript
loadComponent: () => import('rm-ng-editor').then(m => m.RmNgEditor)
```

2. Reduce initial configuration:
```typescript
// Start with minimal config
config = signal<EditorConfig>({
  toolbarConfig: {
    // Only enable essentials initially
  }
});
```

3. Check for large initial content:
```typescript
// Split large content into chunks
if (initialContent.length > 100000) {
  // Load progressively
}
```

### Issue: High Memory Usage

**Symptoms:**
Browser tab uses excessive memory.

**Solutions:**

1. Ensure proper cleanup:
```typescript
ngOnDestroy() {
  // Cleanup is automatic, but verify
  console.log('Component destroyed');
}
```

2. Limit undo history:
```typescript
// Clear undo history periodically
document.execCommand('selectAll');
document.execCommand('delete');
document.execCommand('insertHTML', false, currentContent);
```

3. Check for memory leaks:
```typescript
// In Chrome DevTools:
// Performance → Memory → Take heap snapshot
```

### Issue: Laggy Typing

**Symptoms:**
Noticeable delay when typing.

**Solutions:**

1. Debounce expensive work in your own code:
```typescript
import { DestroyRef, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

private readonly contentChanges = new Subject<string>();
private readonly destroyRef = inject(DestroyRef);

constructor() {
  // Debounce your own downstream work (search indexing, autosave, ...)
  this.contentChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe(html => this.onContentChange(html));
}
```
The editor already debounces its own word count, spell check and state updates
(`EDITOR_PERFORMANCE_CONFIG`, `debounceDelay` default `100` ms) — override that token
rather than adding another debounce around the editor itself.

2. Disable expensive features temporarily:
```typescript
const config: EditorConfig = {
  toolbarConfig: {
    showSpellCheck: false,  // Can be CPU-intensive
    showWordCount: false    // Reduce real-time stats
  }
};
```

3. Reduce content complexity:
```html
<!-- Avoid deeply nested structures -->
<div>
  <div>
    <div>
      <div>Content</div>  <!-- ❌ Too deep -->
    </div>
  </div>
</div>
```

## Browser Compatibility Issues

### Issue: Editor Not Working in Safari

**Symptoms:**
Features don't work in Safari.

**Solutions:**

1. Confirm the browser meets the minimum version (Safari 17+). A user-agent sniff is
   unreliable — check for the features the editor needs instead:

```typescript
const supported =
  typeof ResizeObserver !== 'undefined' &&
  typeof MutationObserver !== 'undefined' &&
  CSS.supports('display', 'grid');
```

   Or, if you must read the version, use `navigator.userAgent` only as a hint and
   treat a failed feature check as the real signal.

2. Verify vendor prefixes:
```css
/* Add webkit prefixes for Safari */
-webkit-appearance: none;
-webkit-user-select: text;
```

3. Test in latest Safari version

### Issue: Mobile Keyboard Issues

**Symptoms:**
Virtual keyboard behaves incorrectly.

**Solutions:**

1. Set proper input mode:
```html
<div contenteditable="true" 
     inputmode="text">
</div>
```

2. Disable autocorrect if needed:
```html
<div contenteditable="true"
     autocorrect="off"
     autocapitalize="off"
     spellcheck="false">
</div>
```

3. Handle viewport changes:
```typescript
window.visualViewport?.addEventListener('resize', () => {
  // Adjust editor height
});
```

## Getting More Help

### Debugging Tools

1. **Enable Debug Mode:**
```typescript
// Add to component
constructor() {
  if (isDevMode()) {
    console.log('Editor config:', this.config());
  }
}
```

2. **Check Console Warnings:**
Open browser DevTools → Console for warnings.

3. **Inspect Element:**
Use DevTools → Elements to inspect the editor DOM.

### Reporting Issues

When reporting issues, include:

1. **Environment:**
   - Browser name and version
   - Operating system
   - Angular version
   - rm-ng-editor version

2. **Code:**
   - Minimal reproduction code
   - Configuration used
   - Component setup

3. **Error:**
   - Full error message
   - Stack trace
   - Console warnings

4. **Steps to Reproduce:**
   - Numbered steps
   - Expected vs actual behavior

### Additional Resources

- **[FAQ](./faq.md)**: Frequently asked questions
- **[Browser Support](./browser-support.md)**: Compatibility information
- **[API Reference](./api-reference.md)**: Complete API documentation
- **[Best Practices](./best-practices.md)**: Recommended patterns

---

**Need More Help?**
- Check the [FAQ](./faq.md)
- Review [GitHub Issues](https://github.com/malikrajat/rm-ng-editor/issues)
- Open a new issue with reproduction steps

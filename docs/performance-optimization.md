# Performance Optimization

Optimize `rm-ng-editor` for production use.

## Bundle Size Optimization

### Measure It Yourself

This document deliberately does not quote bundle sizes — they depend entirely on
your build, your Angular version and what your application actually imports. To get
real numbers:

```bash
# Production build of the demo application
ng build --configuration=production

# The @angular/build:application builder is esbuild/Vite based, so it emits its own
# output plus source maps into dist/ (there is no webpack stats.json).
```

Watch the `budgets` configured in `angular.json`: the build fails when a bundle
exceeds its `maximumError`.

### Tree-Shaking

The library is fully tree-shakeable (`"sideEffects": false`):

```typescript
// Only import what you need
import { RmNgEditor } from '@codewithrajat/rm-ng-editor';  // Component only
import { RmNgEditorService } from '@codewithrajat/rm-ng-editor';  // Service only
```

### Lazy Loading

Load the editor only when needed:

```typescript
// routes.ts
export const routes = [
  {
    path: 'editor',
    loadComponent: () => import('./editor/editor.component')
      .then(m => m.EditorComponent)
  }
];
```

## Runtime Performance

### Use OnPush Change Detection

```typescript
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class EditorComponent {}
```

**Benefits:**
- Pairs with signal-based state: the editor re-renders only when its signals change
- Explicit update control for your own component
- Avoids change-detection work in the rest of your application

### Debounce Content Changes

```typescript
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export class EditorComponent {
  private contentSubject = new Subject<string>();

  ngOnInit() {
    this.contentSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(html => {
      this.processContent(html);
    });
  }

  onContentChange(html: string) {
    this.contentSubject.next(html);
  }
}
```

**Impact:**
- Fewer downstream calls than one-per-keystroke
- Smoother typing experience
- Lower CPU usage

The editor debounces its own expensive work internally. `'updateEditorState'`,
`'updateWordCount'` and `'runSpellCheck'` are keyed debounces driven by
`EDITOR_PERFORMANCE_CONFIG.debounceDelay`; that is **100 ms** by default, and the
spell-check debounce is 3× the base delay (300 ms). A consumer cannot set
`debounceDelay` through `EditorConfig` — the only supported route is providing your
own `EDITOR_PERFORMANCE_CONFIG` value:

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { EDITOR_PERFORMANCE_CONFIG } from '@codewithrajat/rm-ng-editor';

bootstrapApplication(App, {
  providers: [
    {
      provide: EDITOR_PERFORMANCE_CONFIG,
      // All three fields are required by the token's type
      useValue: { debounceDelay: 50, chunkSize: 1000, maxContentSize: 100000 },
    },
  ],
});
```

### Use Computed Signals

```typescript
import { computed, inject, signal } from '@angular/core';
import { RmNgEditorService } from '@codewithrajat/rm-ng-editor';

export class EditorComponent {
  private editorService = inject(RmNgEditorService);
  content = signal('');

  // ❌ Bad - recalculates on every read
  get wordCount(): number {
    const text = this.editorService.htmlToText(this.content()).trim();
    return text ? text.split(/\s+/).length : 0;
  }

  // ✅ Good - cached automatically
  wordCountCached = computed(() => {
    const text = this.editorService.htmlToText(this.content()).trim();
    return text ? text.split(/\s+/).length : 0;
  });
}
```

**Benefits:**
- Automatic caching
- Only recomputes when dependencies change
- Better performance

The component already computes this for you: read its `wordCountStats()` signal or
bind the `(wordCountChange)` output instead of counting in the consumer.

## Memory Management

### Automatic Cleanup

The editor handles cleanup automatically. Cleanup is registered with Angular's
`DestroyRef` when the component is constructed:

```typescript
// No manual cleanup needed in the consumer!
ngOnDestroy() {
  // The editor has already cleaned up:
  // - Event listeners
  // - Timers and debounce timeouts
  // - IntersectionObserver / ResizeObserver / MutationObserver
}
```

### Monitor Memory Usage

```typescript
// `performance.memory` is Chrome-only (the library's test setup stubs it)
const perf = performance as Performance & {
  memory?: { usedJSHeapSize: number };
};

if (perf.memory) {
  console.log(
    'Used JS Heap:',
    (perf.memory.usedJSHeapSize / 1048576).toFixed(2),
    'MB'
  );
}
```

The component also exposes its own counters for development builds:

```typescript
// From a template reference: #editor
editor.getPerformanceMetrics();
// → { activeResources, debounceTimeouts, isOptimized, memoryUsage? }

editor.checkForMemoryLeaks();
// Warns when active resources or debounce timeouts look suspicious
```

### Clear Large Content

A consumer cannot write to the editor's internal `content` signal. Clear the editor
through the `[value]` input or `setContent()` on a template reference:

```html
<app-rm-ng-editor #editor [value]="content()" (valueChange)="content.set($event)" />
```

```typescript
import { viewChild } from '@angular/core';
import { RmNgEditor } from '@codewithrajat/rm-ng-editor';

private readonly editor = viewChild.required<RmNgEditor>('editor');

cleanup() {
  // Either clear the bound signal…
  this.content.set('');

  // …or write through the editor reference (use either, not both)
  this.editor().setContent('');
}
```

## Network Optimization

### Batch API Calls

```typescript
// ❌ Bad - save on every change
onContentChange(html: string) {
  this.saveToBackend(html);
}

// ✅ Good - batch saves
private saveQueue: string[] = [];
private saveTimeout?: number;

onContentChange(html: string) {
  this.content.set(html);
  this.queueSave(html);
}

private queueSave(html: string) {
  this.saveQueue.push(html);
  
  clearTimeout(this.saveTimeout);
  this.saveTimeout = setTimeout(() => {
    const latestContent = this.saveQueue[this.saveQueue.length - 1];
    this.saveToBackend(latestContent);
    this.saveQueue = [];
  }, 2000) as unknown as number;
}
```

### Use HTTP Compression

```typescript
// Enable gzip compression in the response headers
const headers = {
  'Content-Encoding': 'gzip',
  'Content-Type': 'application/json'
};
```

## Rendering Optimization

### Virtual Scrolling for Lists

**Requires `@angular/cdk`** — it is not a dependency of `rm-ng-editor`, so add it to
your application before using this example:

```typescript
import { ScrollingModule } from '@angular/cdk/scrolling';
import { RmNgEditor } from '@codewithrajat/rm-ng-editor';

@Component({
  standalone: true,
  imports: [ScrollingModule, RmNgEditor],
  template: `
    <cdk-virtual-scroll-viewport [itemSize]="50">
      <div *cdkVirtualFor="let item of items; trackBy: trackById">
        <app-rm-ng-editor [value]="item.content" />
      </div>
    </cdk-virtual-scroll-viewport>
  `
})
export class EditorListComponent {
  items: { id: number; content: string }[] = [];

  trackById = (_index: number, item: { id: number }) => item.id;
}
```

### Track By Functions

Angular 22 templates use `@for` with a `track` expression instead of the legacy
`*ngFor` + `trackBy` pair:

```html
@for (editor of editors(); track editor.id) {
  <app-rm-ng-editor [config]="editor.config" />
}
```

## Configuration Optimization

### Disable Unused Features

```typescript
const optimizedConfig: EditorConfig = {
  toolbarConfig: {
    // Disable heavy features
    showSpellCheck: false,
    showWordCount: false,  // Count with RmNgEditorService.getWordCount() if needed
    showTable: false,     // If not using tables
    showYouTubeEmbed: false
  }
};
```

### Use Minimal Toolbar

```typescript
const minimalConfig: EditorConfig = {
  toolbarConfig: {
    showTextFormatting: true,
    showBold: true,
    showItalic: true,
    showLists: true,
    // Every other flag keeps its default (enabled) — set the ones you want
    // to hide to false explicitly.
  }
};
```

## Build Optimization

### Production Build

```bash
ng build --configuration=production
```

**Optimizations Applied:**
- AOT compilation (the default for Angular builds)
- Minification and dead-code elimination
- Tree-shaking
- Output hashing
- Budget enforcement

### Analyze Bundle Size

```bash
# Build first — the @angular/build (esbuild + Vite) builder writes dist/ plus
# source maps.
ng build --configuration=production

# There is no webpack stats.json in this workspace. For a machine-readable bundle
# report, run esbuild yourself with metafile: true, or point an esbuild/Vite-aware
# analyser at the files in dist/.
```

### Enable Budget Monitoring

In `angular.json`, under the application's `build` target (the demo uses these
values):

```json
{
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "500kB",
      "maximumError": "1MB"
    }
  ]
}
```

## Benchmarking

Numbers published by a library author are not measurements of *your* build, so this
document does not publish any. Measure your own application instead:

- Run `ng build --configuration=production` and read the real bundle sizes from
  `dist/`; the `budgets` in `angular.json` tell you when you have regressed.
- Use `performance.mark()` / `performance.measure()` around editor creation and the
  operations you care about (see [Performance Markers](#performance-markers)).
- Profile with the Chrome DevTools Performance and Memory panels.
- In development, read `getPerformanceMetrics()` and call `checkForMemoryLeaks()`
  from a template reference.

## Performance Checklist

### ✅ Build Time

- [ ] Enable production mode
- [ ] Use AOT compilation
- [ ] Enable minification
- [ ] Enable tree-shaking
- [ ] Analyze bundle size

### ✅ Runtime

- [ ] Use OnPush change detection
- [ ] Debounce expensive operations
- [ ] Use computed signals
- [ ] Implement lazy loading
- [ ] Use `@for` with `track` instead of `*ngFor` + `trackBy`

### ✅ Network

- [ ] Batch API calls
- [ ] Enable HTTP compression
- [ ] Cache responses
- [ ] Use CDN for assets

### ✅ Memory

- [ ] Monitor memory usage
- [ ] Clear unused content
- [ ] Verify cleanup on destroy
- [ ] Avoid memory leaks

## Monitoring

### Performance Markers

```typescript
// Mark performance points
performance.mark('editor-start');

// ... editor operations

performance.mark('editor-end');
performance.measure('editor-init', 'editor-start', 'editor-end');

const measure = performance.getEntriesByName('editor-init')[0];
console.log('Editor init took:', measure?.duration, 'ms');
```

### Resource Timing

```typescript
// Monitor resource loading
const resources = performance.getEntriesByType('resource');
resources.forEach(resource => {
  console.log(resource.name, resource.duration);
});
```

## Advanced Techniques

### Code Splitting

```typescript
// Split large features
const heavyFeature = await import('./heavy-feature');
heavyFeature.initialize();
```

### Web Workers

```typescript
// Offload heavy processing
const worker = new Worker(new URL('./content.worker', import.meta.url));

worker.postMessage({ html: largeContent });
worker.onmessage = ({ data }) => {
  this.processedContent.set(data);
};
```

### Request Idle Callback

```typescript
// Defer non-critical work
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    this.updateStatistics();
  });
} else {
  setTimeout(() => {
    this.updateStatistics();
  }, 100);
}
```

## Best Practices Summary

1. **Always use production builds** for deployment
2. **Enable OnPush** change detection
3. **Debounce** expensive operations
4. **Lazy load** when possible
5. **Monitor** performance regularly
6. **Disable** unused features
7. **Clean up** resources properly
8. **Use signals** for reactive state

---

**Next Steps:**
- [Best Practices](./best-practices.md)
- [Troubleshooting](./troubleshooting.md)
- [Browser Support](./browser-support.md)

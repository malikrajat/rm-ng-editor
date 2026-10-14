# Best Practices

Recommended patterns and anti-patterns for using `rm-ng-editor`.

## Component Usage

### ✅ Do: Use Signals for State

```typescript
import { Component, signal } from '@angular/core';
import { RmNgEditor, EditorConfig } from '@codewithrajat/rm-ng-editor';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [RmNgEditor],
  template: `<app-rm-ng-editor [config]="config()" (valueChange)="content.set($event)" />`
})
export class EditorComponent {
  config = signal<EditorConfig>({
    placeholder: 'Start typing...',
    height: '400px'
  });
  
  content = signal('');
}
```

### ❌ Don't: Use Mutable Objects

```typescript
// ❌ Bad - mutating objects directly
config = {
  placeholder: 'Type here'
};

updateConfig() {
  this.config.placeholder = 'New text';  // Won't trigger updates
}

// ✅ Good - using signals
config = signal<EditorConfig>({
  placeholder: 'Type here'
});

updateConfig() {
  this.config.update(c => ({
    ...c,
    placeholder: 'New text'
  }));
}
```

## Configuration

### ✅ Do: Provide Sensible Defaults

```typescript
const defaultConfig: EditorConfig = {
  placeholder: 'Start typing...',
  height: '400px',
  showToolbar: true,
  toolbarConfig: {
    showTextFormatting: true,
    showBold: true,
    showItalic: true,
    showLists: true
  }
};

config = signal<EditorConfig>(defaultConfig);
```

### ❌ Don't: Over-Configure

```typescript
// ❌ Bad - too many unnecessary configurations
config = signal<EditorConfig>({
  showToolbar: true,
  toolbarConfig: {
    showBold: true,
    showItalic: true,
    // ... 50+ properties all set to defaults
  }
});

// ✅ Good - only configure what you need
config = signal<EditorConfig>({
  toolbarConfig: {
    showTable: false,  // Only override what's different
    showYouTubeEmbed: false
  }
});
```

## Event Handling

### ✅ Do: Handle Events Appropriately

```typescript
// Immediate UI updates
onContentChange(html: string) {
  this.content.set(html);
}

// Expensive operations on interaction end
onDragEnd(event: any) {
  this.saveToBackend(this.content());
}
```

The editor already maintains its own word/character statistics and emits them, so
prefer the built-in `(wordCountChange)` output over recomputing on every
keystroke:

```html
<app-rm-ng-editor
  [value]="content()"
  (valueChange)="onContentChange($event)"
  (wordCountChange)="stats.set($event)"
/>
```

### ❌ Don't: Make API Calls on Every Change

```typescript
// ❌ Bad - API call on every keystroke
onContentChange(html: string) {
  this.saveToBackend(html);  // Too frequent!
}

// ✅ Good - debounce before saving
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

private autoSave = new Subject<string>();

constructor() {
  this.autoSave.pipe(
    debounceTime(2000)
  ).subscribe(() => {
    this.saveToBackend(this.content());
  });
}

onContentChange(html: string) {
  this.content.set(html);
  this.autoSave.next(html);
}
```

## Content Management

### ✅ Do: Sanitize User Content

```typescript
import { inject } from '@angular/core';
import { RmNgEditorService } from '@codewithrajat/rm-ng-editor';

export class MyComponent {
  private editorService = inject(RmNgEditorService);

  onContentChange(html: string) {
    const sanitized = this.editorService.sanitizeHtml(html);
    this.content.set(sanitized);
  }
}
```

### ❌ Don't: Trust User Input Blindly

```typescript
// ❌ Bad - directly using user HTML
displayContent(html: string) {
  document.getElementById('output')!.innerHTML = html;  // XSS risk!
}

// ✅ Good - sanitize first
displayContent(html: string) {
  const clean = this.editorService.sanitizeHtml(html);
  document.getElementById('output')!.innerHTML = clean;
}
```

## Performance

### ✅ Do: Use OnPush Change Detection

```typescript
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,  // ✅
  // ...
})
export class EditorComponent {}
```

### ✅ Do: Debounce Expensive Operations

```typescript
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

private contentSubject = new Subject<string>();

ngOnInit() {
  this.contentSubject.pipe(
    debounceTime(300)
  ).subscribe(html => {
    this.updateStatistics(html);
  });
}

onContentChange(html: string) {
  this.contentSubject.next(html);
}
```

### ❌ Don't: Perform Heavy Calculations on Every Change

```typescript
// ❌ Bad
onContentChange(html: string) {
  this.calculateComplexStatistics(html);  // Heavy operation
  this.updateAllCharts(html);
  this.generatePreview(html);
}

// ✅ Good - use computed signals
stats = computed(() => {
  const html = this.content();
  return this.calculateStats(html);  // Only when content changes
});
```

## Validation

### ✅ Do: Validate Content

```typescript
onContentChange(html: string) {
  const validation = this.editorService.validateContent(html);
  
  if (!validation.isValid) {
    this.errors.set(validation.errors);
  } else {
    this.errors.set([]);
  }
  
  this.content.set(html);
}
```

### ✅ Do: Provide User Feedback

```typescript
@Component({
  template: `
    <app-rm-ng-editor (valueChange)="onContentChange($event)" />
    
    @if (errors().length > 0) {
      <div class="validation-errors">
        @for (error of errors(); track error) {
          <p class="error">{{ error }}</p>
        }
      </div>
    }
  `
})
```

## Accessibility

### ✅ Do: Provide ARIA Labels

```html
<!-- Label the surrounding region; the component sets its own role/aria-label
     internally on .toolbar and .editor-content -->
<div role="region" aria-label="Text editor">
  <app-rm-ng-editor [config]="config()" />
</div>
```

### ✅ Do: Support Keyboard Navigation

```typescript
config = signal<EditorConfig>({
  toolbarConfig: {
    showKeyboardShortcuts: true,  // Enable shortcuts
    showAccessibility: true        // Enable accessibility features
  }
});
```

## Error Handling

### ✅ Do: Handle Errors Gracefully

```typescript
onContentChange(html: string) {
  try {
    const validation = this.editorService.validateContent(html);
    
    if (validation.isValid) {
      this.content.set(html);
    } else {
      this.showErrors(validation.errors);
    }
  } catch (error) {
    console.error('Validation error:', error);
    this.showErrorMessage('Failed to validate content');
  }
}
```

### ❌ Don't: Ignore Errors

```typescript
// ❌ Bad
onContentChange(html: string) {
  this.editorService.validateContent(html);  // Ignoring result
  this.content.set(html);
}
```

## Testing

### ✅ Do: Write Tests

The library's specs run on **Vitest** through the `@angular/build:unit-test` builder
(with a small Jasmine-compat shim in `projects/rm-ng-editor/src/test-setup.ts`).
`TestBed` and `ComponentFixture` are the same Angular APIs regardless of the runner:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RmNgEditor } from '@codewithrajat/rm-ng-editor';

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RmNgEditor, EditorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
  });

  it('should update content on change', () => {
    const html = '<p>Test</p>';
    component.onContentChange(html);
    expect(component.content()).toBe(html);
  });
});
```

## Security

### ✅ Do: Sanitize Before Displaying

```typescript
// Always sanitize user-generated content
const clean = this.editorService.sanitizeHtml(userHtml);
```

### ❌ Don't: Allow Dangerous HTML

```typescript
// ❌ Bad - allows script injection
innerHTML = userContent;  // Direct assignment

// ✅ Good - sanitize first
innerHTML = this.editorService.sanitizeHtml(userContent);
```

## Resource Management

### ✅ Do: Clean Up Resources

```typescript
// The editor handles cleanup automatically
// But if you create your own resources:

ngOnDestroy() {
  this.subscription?.unsubscribe();
  this.intervalId && clearInterval(this.intervalId);
}
```

## Common Patterns

### Auto-Save Pattern

```typescript
export class AutoSaveComponent {
  private saveSubject = new Subject<string>();
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.saveSubject.pipe(
      debounceTime(2000),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(html => {
      this.saveToBackend(html);
    });
  }

  onContentChange(html: string) {
    this.content.set(html);
    this.saveSubject.next(html);
  }

  private async saveToBackend(html: string) {
    try {
      await fetch('/api/save', {
        method: 'POST',
        body: JSON.stringify({ content: html })
      });
      this.lastSaved.set(new Date());
    } catch (error) {
      console.error('Save failed:', error);
    }
  }
}
```

### Validation Pattern

```typescript
import { computed, inject, signal } from '@angular/core';
import { RmNgEditorService } from '@codewithrajat/rm-ng-editor';

export class ValidatedEditorComponent {
  // getWordCount() lives on the service, not on the component
  private editorService = inject(RmNgEditorService);

  content = signal('');
  errors = signal<string[]>([]);

  validate = computed(() => {
    const html = this.content();
    const wordCount = this.editorService.getWordCount(html);
    const errors: string[] = [];

    if (wordCount < 100) {
      errors.push('Minimum 100 words required');
    }

    return errors;
  });

  isValid = computed(() => this.validate().length === 0);
}
```

Alternatively, bind the editor's own `(wordCountChange)` output and read the
`WordCountStats` object it emits, instead of counting again in the consumer.

### Conditional Features Pattern

```typescript
export class ConditionalEditorComponent {
  userRole = signal<'viewer' | 'editor' | 'admin'>('viewer');
  
  config = computed<EditorConfig>(() => {
    const role = this.userRole();
    
    return {
      disabled: role === 'viewer',
      toolbarConfig: {
        showTextFormatting: role !== 'viewer',
        showTable: role === 'admin',
        showHtmlEdit: role === 'admin'
      }
    };
  });
}
```

## Anti-Patterns to Avoid

### ❌ Modifying DOM Directly

```typescript
// ❌ Bad - reaching into the DOM behind the editor's back
document.querySelector('.editor')!.innerHTML = 'New content';

// ✅ Good - go through the editor's own API (see below)
```

Content is **not** part of `EditorConfig`: it is the separate `[value]` input, and
that input is one-way. Bind `[value]` and `(valueChange)`, or write to the
component through a template reference:

```html
<app-rm-ng-editor #editor [value]="content()" (valueChange)="content.set($event)" />
```

```typescript
import { signal, viewChild } from '@angular/core';
import { RmNgEditor } from '@codewithrajat/rm-ng-editor';

export class EditorComponent {
  content = signal('');

  private readonly editor = viewChild.required<RmNgEditor>('editor');

  replaceContent() {
    // Updates the content signal; the component's effect syncs it into the DOM.
    // Note: setContent() does not emit (valueChange) — that output fires on edits.
    this.editor().setContent('New content');
  }
}
```

### ❌ Circular Dependencies

```typescript
// ❌ Bad
onContentChange(html: string) {
  this.content.set(html);
  this.updateEditor(html);  // Triggers another change!
}

// ✅ Good - use guards
private isUpdating = false;

onContentChange(html: string) {
  if (this.isUpdating) return;
  
  this.isUpdating = true;
  this.content.set(html);
  this.isUpdating = false;
}
```

### ❌ Memory Leaks

```typescript
// ❌ Bad
ngOnInit() {
  setInterval(() => {
    this.checkContent();
  }, 1000);  // Never cleared!
}

// ✅ Good
private intervalId?: number;

ngOnInit() {
  this.intervalId = setInterval(() => {
    this.checkContent();
  }, 1000) as unknown as number;
}

ngOnDestroy() {
  if (this.intervalId) {
    clearInterval(this.intervalId);
  }
}
```

## Summary

**Key Takeaways:**

1. ✅ Use signals for reactive state
2. ✅ Sanitize user content
3. ✅ Use OnPush change detection
4. ✅ Debounce expensive operations
5. ✅ Handle errors gracefully
6. ✅ Write tests
7. ✅ Support accessibility
8. ❌ Don't modify DOM directly
9. ❌ Don't ignore validation
10. ❌ Don't create memory leaks

---

**Next Steps:**
- [Performance Optimization](./performance-optimization.md)
- [Advanced Configuration](./advanced-configuration.md)
- [Troubleshooting](./troubleshooting.md)

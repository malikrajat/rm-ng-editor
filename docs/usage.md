# Usage Guide

This guide demonstrates common usage patterns and real-world examples for `rm-ng-editor`.

The package is `@codewithrajat/rm-ng-editor`. Inside this repository the demo imports the library
from `../../../rm-ng-editor/src/public-api`.

## Table of Contents

- [Basic Usage](#basic-usage)
- [Configuration Examples](#configuration-examples)
- [Event Handling](#event-handling)
- [Working with Content](#working-with-content)
- [Forms Integration](#forms-integration)
- [Toolbar Customization](#toolbar-customization)
- [Theme Configuration](#theme-configuration)
- [Validation & Statistics](#validation--statistics)
- [Common Use Cases](#common-use-cases)

## Basic Usage

### Minimal Setup

The simplest way to use the editor:

```typescript
import { Component } from '@angular/core';
import { RmNgEditor } from '@codewithrajat/rm-ng-editor';

@Component({
  selector: 'app-simple-editor',
  standalone: true,
  imports: [RmNgEditor],
  template: `
    <app-rm-ng-editor />
  `
})
export class SimpleEditorComponent {}
```

The editor works out-of-the-box with sensible defaults. No configuration required!

### Basic Configuration

Add placeholder and height via the `config` input:

```typescript
import { Component, signal } from '@angular/core';
import { RmNgEditor, EditorConfig } from '@codewithrajat/rm-ng-editor';

@Component({
  selector: 'app-basic-editor',
  standalone: true,
  imports: [RmNgEditor],
  template: `
    <app-rm-ng-editor
      [config]="editorConfig()"
      (valueChange)="onContentChange($event)"
    />
  `
})
export class BasicEditorComponent {
  editorConfig = signal<EditorConfig>({
    placeholder: 'Start typing your content here...',
    height: '400px',
    maxHeight: '600px'
  });

  onContentChange(html: string) {
    console.log('Content updated:', html);
  }
}
```

`config` is a signal input typed `EditorConfig | null` with a default of `null`, so a signal that
holds an `EditorConfig` is the expected usage. `placeholder`, `height`, `maxHeight`, `disabled`
and `showToolbar` are `EditorConfig` fields — they are not inputs on `<app-rm-ng-editor>`.

## Configuration Examples

The snippets in this section show the component class body; each one assumes the same import block:

```typescript
import { Component, signal } from '@angular/core';
import { RmNgEditor, EditorConfig } from '@codewithrajat/rm-ng-editor';
```

### Minimal Editor (Text Only)

For simple text editing without advanced features:

```typescript
@Component({
  selector: 'app-minimal-editor',
  standalone: true,
  imports: [RmNgEditor],
  template: `<app-rm-ng-editor [config]="config()" />`
})
export class MinimalEditorComponent {
  config = signal<EditorConfig>({
    placeholder: 'Simple text editor...',
    height: '300px',
    toolbarConfig: {
      // Enable basic text formatting only
      showTextFormatting: true,
      showBold: true,
      showItalic: true,
      showUnderline: true,
      
      // Disable everything else
      showStrikethrough: false,
      showScriptFormatting: false,
      showFontControls: false,
      showColorControls: false,
      showHeadings: false,
      showAlignment: false,
      showLists: false,
      showTable: false,
      showLinkMedia: false,
      showAccessibility: false
    }
  });
}
```

### Business Document Editor

For professional business documents:

```typescript
export class BusinessEditorComponent {
  config = signal<EditorConfig>({
    placeholder: 'Create your business document...',
    height: '500px',
    toolbarConfig: {
      // Professional text formatting
      showTextFormatting: true,
      showFontControls: true,
      showHeadings: true,
      showAlignment: true,
      showLists: true,
      
      // Business features
      showTable: true,
      showInsertLink: true,
      showInsertImage: true,
      showPageBreak: true,
      
      // Statistics for business writing
      showWordCount: true,
      showReadingTime: true,
      
      // Disable social media
      showYouTubeEmbed: false,
      showTwitterEmbed: false,
      showInstagramEmbed: false,
      
      // Enable productivity
      showFullScreen: true,
      showHtmlEdit: true
    }
  });
}
```

### Blog Post Editor

For blog and content creation:

```typescript
export class BlogEditorComponent {
  config = signal<EditorConfig>({
    placeholder: 'Write your blog post...',
    height: '600px',
    maxHeight: '800px',
    toolbarConfig: {
      // Full text formatting
      showTextFormatting: true,
      showFontControls: true,
      showColorControls: true,
      showHeadings: true,
      showBlockFormatting: true,
      showAlignment: true,
      showLists: true,
      
      // Media embedding
      showLinkMedia: true,
      showInsertLink: true,
      showInsertImage: true,
      showInsertVideo: true,
      showYouTubeEmbed: true,
      showVimeoEmbed: true,
      
      // Content quality
      showWordCount: true,
      showCharacterCount: true,
      showReadingTime: true,
      showSpellCheck: true,
      
      // Blogging tools
      showFullScreen: true,
      showThemeToggle: true
    },
    theme: {
      mode: 'auto'  // Follows system preference
    }
  });
}
```

### Read-Only Viewer

Display content without editing:

```typescript
@Component({
  selector: 'app-read-only-editor',
  standalone: true,
  imports: [RmNgEditor],
  template: `
    <app-rm-ng-editor
      [config]="config()"
      [value]="content()"
    />
  `
})
export class ReadOnlyEditorComponent {
  config = signal<EditorConfig>({
    disabled: true,        // Disable editing
    showToolbar: false,    // Hide toolbar
    height: 'auto'         // Auto-height based on content
  });
  
  content = signal('<h1>Read-Only Content</h1><p>This editor is in read-only mode.</p>');
}
```

```html
<app-rm-ng-editor
  [config]="config()"
  [value]="content()"
/>
```

`disabled` and `showToolbar` are `EditorConfig` fields, so they belong inside `[config]`, while
`[value]` supplies the HTML to display.

## Event Handling

### Content Change Events

Track content changes in real-time:

```typescript
import { Component, signal } from '@angular/core';

export class EditorEventsComponent {
  content = signal('');
  lastSaved = signal<Date | null>(null);
  hasUnsavedChanges = signal(false);

  onContentChange(html: string) {
    this.content.set(html);
    this.hasUnsavedChanges.set(true);
  }

  saveContent() {
    const htmlContent = this.content();
    
    // Save to backend
    fetch('/api/save', {
      method: 'POST',
      body: JSON.stringify({ content: htmlContent }),
      headers: { 'Content-Type': 'application/json' }
    }).then(() => {
      this.hasUnsavedChanges.set(false);
      this.lastSaved.set(new Date());
    });
  }
}
```

```html
<div>
  <app-rm-ng-editor (valueChange)="onContentChange($event)" />
  
  <button (click)="saveContent()" [disabled]="!hasUnsavedChanges()">
    Save {{ hasUnsavedChanges() ? '*' : '' }}
  </button>
  
  @if (lastSaved()) {
    <span>Last saved: {{ lastSaved()! | date:'short' }}</span>
  }
</div>
```

The component also emits `focusEvent`, `blurEvent`, `stateChange`, `wordCountChange`,
`spellCheckResults`, `fullScreenChange`, `themeChange`, `tableInsert` and `tableModify`.

### Auto-Save

Implement auto-save functionality:

```typescript
import { effect } from '@angular/core';

export class AutoSaveEditorComponent {
  content = signal('');
  private saveTimeoutId?: number;

  constructor() {
    // Auto-save effect
    effect(() => {
      const html = this.content();
      
      // Clear existing timeout
      if (this.saveTimeoutId) {
        clearTimeout(this.saveTimeoutId);
      }
      
      // Save after 2 seconds of no changes
      this.saveTimeoutId = setTimeout(() => {
        this.autoSave(html);
      }, 2000) as unknown as number;
    });
  }

  onContentChange(html: string) {
    this.content.set(html);
  }

  private autoSave(html: string) {
    console.log('Auto-saving content...');
    // Implement your save logic here
  }
}
```

## Working with Content

### Setting Initial Content

```typescript
export class EditorWithInitialContent {
  initialContent = `
    <h1>Welcome to my Document</h1>
    <p>This is some initial content.</p>
    <ul>
      <li>First item</li>
      <li>Second item</li>
    </ul>
  `;
}
```

```html
<app-rm-ng-editor [value]="initialContent" />
```

### Getting Content Programmatically

Using signals for reactive content access:

```typescript
export class ContentAccessComponent {
  private editorContent = signal('');

  onContentChange(html: string) {
    this.editorContent.set(html);
  }

  // Computed values
  wordCount = computed(() => {
    const text = this.stripHtml(this.editorContent());
    return text.trim().split(/\s+/).length;
  });

  characterCount = computed(() => {
    return this.stripHtml(this.editorContent()).length;
  });

  isEmpty = computed(() => {
    return this.editorContent().trim() === '';
  });

  private stripHtml(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  exportContent() {
    const html = this.editorContent();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.html';
    a.click();
    
    URL.revokeObjectURL(url);
  }
}
```

You can also read the content imperatively through a template reference variable:

```html
<app-rm-ng-editor #editor [value]="initialContent" />
<button (click)="save(editor.getContent())">Save</button>
<button (click)="save(editor.getTextContent())">Save as text</button>
```

### Forms Integration

`RmNgEditor` does **not** implement `ControlValueAccessor`, so `[(ngModel)]`, `formControlName`
and `[formControl]` do not work on `<app-rm-ng-editor>`. Bridge a reactive form control manually:
feed `[value]` from the control and write back in `(valueChange)`.

```typescript
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RmNgEditor, EditorConfig } from '@codewithrajat/rm-ng-editor';

@Component({
  selector: 'app-form-editor',
  standalone: true,
  imports: [RmNgEditor, ReactiveFormsModule],
  template: `
    <app-rm-ng-editor
      [config]="config"
      [value]="contentControl.value ?? ''"
      (valueChange)="contentControl.setValue($event)"
    />
    <p>Dirty: {{ contentControl.dirty }}</p>
  `
})
export class FormEditorComponent {
  config: EditorConfig = { placeholder: 'Write something...' };
  contentControl = new FormControl('', { nonNullable: true });
}
```

The same pattern works with `FormGroup`: read `form.controls.content.value ?? ''` for `[value]` and
call `form.controls.content.setValue($event)` from `(valueChange)`.

### Content Validation

Validate content before submission:

```typescript
export class ValidatedEditorComponent {
  content = signal('');
  errors = signal<string[]>([]);

  onContentChange(html: string) {
    this.content.set(html);
    this.validateContent(html);
  }

  validateContent(html: string) {
    const errors: string[] = [];
    const text = this.stripHtml(html);
    const wordCount = text.trim().split(/\s+/).length;

    if (wordCount < 100) {
      errors.push('Content must be at least 100 words');
    }

    if (wordCount > 5000) {
      errors.push('Content cannot exceed 5000 words');
    }

    if (!html.includes('<h1>')) {
      errors.push('Content must include a main heading (H1)');
    }

    this.errors.set(errors);
  }

  private stripHtml(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }
}
```

```html
<app-rm-ng-editor (valueChange)="onContentChange($event)" />

@if (errors().length > 0) {
  <div class="validation-errors">
    @for (error of errors(); track error) {
      <div class="error">{{ error }}</div>
    }
  </div>
}
```

## Toolbar Customization

### Custom Toolbar Icons

`toolbarIcons` is **not** a member of `EditorConfig`. Icons come from the `EDITOR_DEFAULT_ICONS`
injection token (a `ToolbarIcons` object), so override that token at bootstrap or at component
level:

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { EDITOR_DEFAULT_ICONS, ToolbarIcons } from '@codewithrajat/rm-ng-editor';

const customIcons: ToolbarIcons = {
  bold: '<strong>B</strong>',
  italic: '<em>I</em>',
  underline: '<u>U</u>',
  insertLink: '🔗',
  insertImage: '📷',
  insertTable: '⊞',
  undo: '↶',
  redo: '↷',
  fullScreen: '⛶',
  htmlEdit: '</>'
};

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: EDITOR_DEFAULT_ICONS, useValue: { ...customIcons } }
  ]
};
```

The icons are supplied through a root-scoped injection token, so this affects every editor in the
application. The same provider entry also works in a component's `providers: [...]` metadata when
the token is overridden at that injector level.

### Selective Toolbar Display

Show only specific tools:

```typescript
export class SelectiveToolbarComponent {
  config = signal<EditorConfig>({
    toolbarConfig: {
      // Text formatting
      showBold: true,
      showItalic: true,
      showUnderline: false,        // Hide underline
      showStrikethrough: false,    // Hide strikethrough
      
      // Headings
      showHeadings: true,
      
      // Lists
      showLists: true,
      showUnorderedList: true,
      showOrderedList: true,
      
      // Links only (no other media)
      showLinkMedia: true,
      showInsertLink: true,
      showInsertImage: false,      // Hide image
      showInsertVideo: false,      // Hide video
      showYouTubeEmbed: false,     // Hide YouTube
      
      // Undo/Redo
      showUndoRedo: true
    }
  });
}
```

## Theme Configuration

### Light/Dark Theme Toggle

```typescript
export class ThemeToggleEditorComponent {
  currentTheme = signal<'light' | 'dark' | 'auto'>('light');

  editorConfig = computed<EditorConfig>(() => ({
    theme: {
      mode: this.currentTheme()
    }
  }));

  toggleTheme() {
    const themes: ('light' | 'dark' | 'auto')[] = ['light', 'dark', 'auto'];
    const current = this.currentTheme();
    const currentIndex = themes.indexOf(current);
    const nextIndex = (currentIndex + 1) % themes.length;
    this.currentTheme.set(themes[nextIndex]);
  }
}
```

```html
<button (click)="toggleTheme()">
  Current Theme: {{ currentTheme() }}
</button>

<app-rm-ng-editor [config]="editorConfig()" />
```

`theme.mode` accepts `'light'`, `'dark'` or `'auto'` only. The component also exposes
`toggleTheme()` and `setTheme('light' | 'dark' | 'auto')` for programmatic control via a template
reference variable.

### Custom Colors

```typescript
export class CustomThemeEditorComponent {
  config = signal<EditorConfig>({
    theme: {
      mode: 'light',
      primaryColor: '#4CAF50',
      secondaryColor: '#FFC107',
      backgroundColor: '#FFFFFF',
      textColor: '#212121',
      borderColor: '#E0E0E0'
    }
  });
}
```

## Validation & Statistics

### Word Count Limits

```typescript
export class WordLimitEditorComponent {
  config = signal<EditorConfig>({
    validation: {
      showWordCount: true,
      showCharacterCount: true,
      showReadingTime: true,
      minWords: 50,
      maxWords: 1000,
      maxCharacters: 5000
    }
  });
}
```

Validation lives under `config.validation`. There is no `config.validationConfig` and no
`config.performance` — performance settings come from the `EDITOR_PERFORMANCE_CONFIG` token.

The editor will display: "Word Count: 245/1000" and warn when limits are exceeded.

### Custom Statistics Display

```typescript
export class CustomStatsEditorComponent {
  content = signal('');
  
  stats = computed(() => {
    const html = this.content();
    const text = this.stripHtml(html);
    const words = text.trim().split(/\s+/).length;
    const characters = text.length;
    const readingTime = Math.ceil(words / 200); // 200 words per minute
    
    return { words, characters, readingTime };
  });

  private stripHtml(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }
}
```

```html
<app-rm-ng-editor (valueChange)="content.set($event)" />

<div class="custom-stats">
  <span>Words: {{ stats().words }}</span>
  <span>Characters: {{ stats().characters }}</span>
  <span>Reading Time: {{ stats().readingTime }} min</span>
</div>
```

For accurate statistics, prefer the built-in `wordCountChange` output (`WordCountStats`) or
`RmNgEditorService.getWordCount()` / `getCharacterCount()`, which handle CJK text and emoji.

## Common Use Cases

### Comment System

```typescript
export class CommentEditorComponent {
  config = signal<EditorConfig>({
    placeholder: 'Write a comment...',
    height: '150px',
    toolbarConfig: {
      showTextFormatting: true,
      showBold: true,
      showItalic: true,
      showInsertLink: true,
      // Disable most features for comments
      showHeadings: false,
      showTable: false,
      showInsertImage: false
    }
  });

  comment = signal('');

  submitComment() {
    const content = this.comment();
    if (content.trim()) {
      // Submit to backend
      console.log('Submitting comment:', content);
      this.comment.set(''); // Clear after submit
    }
  }
}
```

### Email Composer

```typescript
export class EmailEditorComponent {
  config = signal<EditorConfig>({
    placeholder: 'Compose your email...',
    height: '400px',
    toolbarConfig: {
      showTextFormatting: true,
      showFontControls: true,
      showColorControls: true,
      showAlignment: true,
      showLists: true,
      showInsertLink: true,
      showInsertImage: true,
      // No YouTube/social for email
      showYouTubeEmbed: false,
      showTwitterEmbed: false
    },
    validation: {
      maxCharacters: 10000
    }
  });
}
```

### Note Taking

```typescript
import { Component, effect, signal } from '@angular/core';

export class NoteEditorComponent {
  config = signal<EditorConfig>({
    placeholder: 'Take notes...',
    height: '500px',
    toolbarConfig: {
      showTextFormatting: true,
      showHeadings: true,
      showLists: true,
      showInsertLink: true,
      showFullScreen: true,
      showThemeToggle: true
    },
    theme: {
      mode: 'auto'  // Follows system preference
    }
  });

  noteContent = signal(
    localStorage.getItem('note') || ''
  );

  // Auto-save to localStorage
  constructor() {
    effect(() => {
      const content = this.noteContent();
      localStorage.setItem('note', content);
    });
  }
}
```

## Next Steps

- **Advanced Configuration**: See [advanced-configuration.md](./advanced-configuration.md)
- **API Reference**: See [api-reference.md](./api-reference.md)
- **Best Practices**: See [best-practices.md](./best-practices.md)
- **Performance**: See [performance-optimization.md](./performance-optimization.md)

---

**Questions?** Check the [FAQ](./faq.md) or [Troubleshooting Guide](./troubleshooting.md)

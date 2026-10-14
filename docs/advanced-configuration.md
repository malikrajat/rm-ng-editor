# Advanced Configuration

Advanced features and configuration options for power users of `rm-ng-editor`.

## Custom Configuration Patterns

### Theme Configuration

Create custom editor themes. `theme.mode` accepts only `'light'`, `'dark'` or `'auto'`; the
remaining `ThemeConfig` members are the colour overrides and `customCss`.

```typescript
import { Component, computed, signal } from '@angular/core';
import { RmNgEditor, EditorConfig, ThemeConfig } from '@codewithrajat/rm-ng-editor';

@Component({
  selector: 'app-themed-editor',
  standalone: true,
  imports: [RmNgEditor],
  template: `
    <div class="theme-selector">
      <button (click)="setTheme('light')">Light</button>
      <button (click)="setTheme('dark')">Dark</button>
      <button (click)="setTheme('auto')">Auto</button>
    </div>
    
    <app-rm-ng-editor [config]="config()" />
  `
})
export class ThemedEditorComponent {
  currentTheme = signal<'light' | 'dark' | 'auto'>('light');
  
  config = computed<EditorConfig>(() => ({
    theme: this.getThemeConfig(this.currentTheme())
  }));

  private getThemeConfig(theme: 'light' | 'dark' | 'auto'): ThemeConfig {
    const themes: Record<'light' | 'dark' | 'auto', ThemeConfig> = {
      light: {
        mode: 'light',
        primaryColor: '#3b82f6',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        borderColor: '#e5e7eb'
      },
      dark: {
        mode: 'dark',
        primaryColor: '#60a5fa',
        backgroundColor: '#1f2937',
        textColor: '#f9fafb',
        borderColor: '#374151'
      },
      auto: {
        mode: 'auto',
        primaryColor: '#8b5cf6',
        backgroundColor: '#faf5ff',
        textColor: '#3b0764',
        borderColor: '#c4b5fd'
      }
    };
    
    return themes[theme];
  }

  setTheme(theme: 'light' | 'dark' | 'auto') {
    this.currentTheme.set(theme);
  }
}
```

`ThemeConfig` has no `customTheme` member. Internally the component spreads
`{ mode: 'light', customTheme: undefined, ...themeConfig }` before applying CSS variables, so a
`customTheme` record is an implementation detail rather than a supported configuration field —
use `customCss` (or the colour members above) instead.

### Conditional Feature Loading

Enable features based on user permissions:

```typescript
import { Component, computed, signal } from '@angular/core';
import { EditorConfig } from '@codewithrajat/rm-ng-editor';

export class ConditionalEditorComponent {
  userRole = signal<'viewer' | 'editor' | 'admin'>('editor');
  
  config = computed<EditorConfig>(() => {
    const role = this.userRole();
    
    const baseConfig: EditorConfig = {
      disabled: role === 'viewer',
      toolbarConfig: {
        // Basic features for everyone
        showTextFormatting: role !== 'viewer',
        showBold: role !== 'viewer',
        showItalic: role !== 'viewer',
        
        // Advanced features for editors
        showFontControls: role === 'editor' || role === 'admin',
        showLinkMedia: role === 'editor' || role === 'admin',
        showTable: role === 'editor' || role === 'admin',
        
        // Admin-only features
        showHtmlEdit: role === 'admin',
        showAccessibility: role === 'admin',
        showFullScreen: role === 'admin'
      }
    };
    
    return baseConfig;
  });
}
```

### Dynamic Validation Rules

Configure validation based on context:

```typescript
import { Component, computed, signal } from '@angular/core';
import { EditorConfig, ValidationConfig } from '@codewithrajat/rm-ng-editor';

export class DynamicValidationComponent {
  documentType = signal<'blog' | 'report' | 'email'>('blog');
  
  config = computed<EditorConfig>(() => ({
    validation: this.getValidationRules(this.documentType())
  }));

  private getValidationRules(type: string): ValidationConfig {
    const rules = {
      blog: {
        showWordCount: true,
        showReadingTime: true,
        minWords: 300,
        maxWords: 5000,
        spellCheck: {
          enabled: true,
          language: 'en-US'
        }
      },
      report: {
        showWordCount: true,
        showCharacterCount: true,
        minWords: 500,
        maxWords: 10000,
        spellCheck: {
          enabled: true,
          language: 'en-US',
          highlightErrors: true
        }
      },
      email: {
        showCharacterCount: true,
        maxCharacters: 2000,
        spellCheck: {
          enabled: true,
          language: 'en-US'
        }
      }
    };
    
    return rules[type];
  }
}
```

## Advanced Table Configuration

### Custom Table Styling

```typescript
import { Component, signal } from '@angular/core';
import { RmNgEditor, EditorConfig } from '@codewithrajat/rm-ng-editor';

@Component({
  selector: 'app-table-editor',
  standalone: true,
  imports: [RmNgEditor],
  template: `<app-rm-ng-editor [config]="config()" />`
})
export class StyledTableEditorComponent {
  config = signal<EditorConfig>({
    table: {
      defaultRows: 3,
      defaultColumns: 3,
      maxRows: 50,
      maxColumns: 20,
      resizable: true,
      cellPadding: '12px',
      borderWidth: '2px',
      borderColor: '#3b82f6',
      headerBackgroundColor: '#dbeafe',
      alternateRowColor: true,
      showBorders: true,
      showGridLines: true,
      cellMinWidth: '100px',
      cellMinHeight: '40px',
      allowMerge: true,
      allowSplit: true,
      tableClasses: ['custom-table', 'bordered']
    }
  });
}
```

### Table Event Handling

The component emits `tableInsert` and `tableModify`, both carrying a `TableData` payload:

```typescript
import { Component, signal } from '@angular/core';
import { RmNgEditor, EditorConfig, TableData } from '@codewithrajat/rm-ng-editor';

@Component({
  selector: 'app-table-editor',
  standalone: true,
  imports: [RmNgEditor],
  template: `
    <app-rm-ng-editor
      [config]="config()"
      (tableInsert)="onTableInsert($event)"
      (tableModify)="onTableModify($event)"
    />
  `
})
export class TableEditorComponent {
  config = signal<EditorConfig>({
    table: {
      defaultRows: 3,
      defaultColumns: 3,
      allowMerge: true
    }
  });

  onTableInsert(table: TableData) {
    console.log(`Table inserted: ${table.rows} x ${table.columns}`);
  }

  onTableModify(table: TableData) {
    console.log('Table modified:', table.cells);
  }
}
```

There are no `onCellMerge` or `onRowDelete` outputs — cell merges, row inserts and row deletes all
surface through `tableModify`.

## Custom Toolbar Icons

Icons are **not** configured through `EditorConfig` — there is no `toolbarIcons` member. The
component reads them from the `EDITOR_DEFAULT_ICONS` injection token (`InjectionToken<ToolbarIcons>`,
root-provided with `DEFAULT_TOOLBAR_ICONS`), so override that token.

### Using SVG Icons

```typescript
import { EDITOR_DEFAULT_ICONS, ToolbarIcons } from '@codewithrajat/rm-ng-editor';

const svgIcons: ToolbarIcons = {
  bold: `<svg width="16" height="16" viewBox="0 0 16 16">
    <path d="M4 2h5a3 3 0 0 1 0 6H4V2zm0 6h5.5a3.5 3.5 0 0 1 0 7H4V8z"/>
  </svg>`,
  italic: `<svg width="16" height="16" viewBox="0 0 16 16">
    <path d="M7 2h6l-1 2H9l-2 8h3l-1 2H3l1-2h3l2-8H6l1-2z"/>
  </svg>`,
  // ... more icons
};

export const editorIconProviders = [
  { provide: EDITOR_DEFAULT_ICONS, useValue: { ...svgIcons } }
];
```

Register `editorIconProviders` in the application bootstrap providers (or in a component's
`providers` metadata, which overrides the token at that injector level):

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [editorIconProviders]
};
```

### Icon Library Integration

```typescript
import { Component, signal } from '@angular/core';
import { RmNgEditor, EditorConfig, EDITOR_DEFAULT_ICONS, ToolbarIcons } from '@codewithrajat/rm-ng-editor';

const libraryIcons: ToolbarIcons = {
  bold: getIcon('bold'),
  italic: getIcon('italic'),
  underline: getIcon('underline')
};

function getIcon(name: string): string {
  // Integration with an icon library (FontAwesome, Material Icons, etc.)
  return `<i class="icon-${name}"></i>`;
}

@Component({
  selector: 'app-icon-editor',
  standalone: true,
  imports: [RmNgEditor],
  providers: [{ provide: EDITOR_DEFAULT_ICONS, useValue: { ...libraryIcons } }],
  template: `
    <app-rm-ng-editor [config]="config()" />
  `
})
export class IconEditorComponent {
  config = signal<EditorConfig>({
    placeholder: 'Icons come from EDITOR_DEFAULT_ICONS'
  });
}
```

## Multi-Language Support

### Spell-Check Language

The only localisable setting exposed today is the spell-check language under
`config.validation.spellCheck.language`. `EditorConfig` has no tooltip/UI-string translation
option, so the toolbar labels themselves are not configurable.

```typescript
import { Component, computed, signal } from '@angular/core';
import { EditorConfig } from '@codewithrajat/rm-ng-editor';

export class MultiLanguageEditorComponent {
  currentLang = signal<'en' | 'es' | 'fr'>('en');
  
  config = computed<EditorConfig>(() => ({
    validation: {
      spellCheck: {
        enabled: true,
        language: this.getSpellCheckLanguage(this.currentLang())
      }
    }
  }));

  private getSpellCheckLanguage(lang: string): string {
    const languages = {
      en: 'en-US',
      es: 'es-ES',
      fr: 'fr-FR'
    };
    return languages[lang];
  }

  setLanguage(lang: 'en' | 'es' | 'fr') {
    this.currentLang.set(lang);
  }
}
```

## Content Templates

### Pre-defined Templates

```typescript
import { Component, signal } from '@angular/core';
import { RmNgEditor } from '@codewithrajat/rm-ng-editor';

@Component({
  selector: 'app-template-editor',
  standalone: true,
  imports: [RmNgEditor],
  template: `<app-rm-ng-editor [value]="content()" />`
})
export class TemplateEditorComponent {
  templates = {
    blog: `
      <h1>Blog Post Title</h1>
      <p>Introduction paragraph...</p>
      <h2>Section 1</h2>
      <p>Content here...</p>
    `,
    report: `
      <h1>Report Title</h1>
      <h2>Executive Summary</h2>
      <p>Summary...</p>
      <h2>Introduction</h2>
      <p>Introduction...</p>
    `,
    email: `
      <p>Dear [Name],</p>
      <p>Email body...</p>
      <p>Best regards,<br>[Your Name]</p>
    `
  };

  content = signal(this.templates.blog);

  loadTemplate(type: keyof typeof this.templates) {
    const template = this.templates[type];
    // Set editor content to template
    this.content.set(template);
  }
}
```

## Integration Patterns

### Form Integration

```typescript
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RmNgEditor } from '@codewithrajat/rm-ng-editor';

@Component({
  selector: 'app-form-editor',
  standalone: true,
  imports: [RmNgEditor, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <app-rm-ng-editor
        [value]="form.controls.content.value ?? ''"
        (valueChange)="form.controls.content.setValue($event)"
      />
      <button type="submit">Submit</button>
    </form>
  `
})
export class FormEditorComponent {
  form = new FormGroup({
    content: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(100)]
    })
  });

  onSubmit() {
    if (this.form.valid) {
      console.log('Form data:', this.form.value);
    }
  }
}
```

`RmNgEditor` has no `ControlValueAccessor`, so the control cannot be attached with
`formControlName` / `[formControl]`. The manual `[value]` + `(valueChange)` bridge above is the
supported pattern; without it the form control never receives the editor content.

### State Management Integration

```typescript
import { Component, inject } from '@angular/core';
import { RmNgEditor } from '@codewithrajat/rm-ng-editor';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-store-editor',
  standalone: true,
  imports: [RmNgEditor],
  template: `
    <app-rm-ng-editor (valueChange)="onContentChange($event)" />
  `
})
export class StoreEditorComponent {
  private store = inject(Store);
  
  content$ = this.store.select('editor', 'content');

  onContentChange(html: string) {
    this.store.dispatch({ 
      type: '[Editor] Content Changed', 
      payload: html 
    });
  }
}
```

## Performance Tuning

### Content Chunking

The editor's own chunk size comes from the `EDITOR_PERFORMANCE_CONFIG` token
(`{ debounceDelay, chunkSize, maxContentSize }`, defaults `100` / `1000` / `100000`). When you
process the HTML yourself, keep chunks at a similar size:

```typescript
export class ChunkedEditorComponent {
  private chunkSize = 10000;

  onContentChange(html: string) {
    if (html.length > this.chunkSize) {
      this.processInChunks(html);
    } else {
      this.processContent(html);
    }
  }

  private processInChunks(html: string) {
    const chunks: string[] = [];
    for (let i = 0; i < html.length; i += this.chunkSize) {
      chunks.push(html.slice(i, i + this.chunkSize));
    }
    
    chunks.forEach((chunk, index) => {
      setTimeout(() => {
        this.processChunk(chunk);
      }, index * 100);
    });
  }

  private processContent(html: string) {
    // Process the whole document in one pass
  }

  private processChunk(chunk: string) {
    // Process individual chunk
  }
}
```

### Lazy Feature Loading

```typescript
import { signal } from '@angular/core';

export class LazyEditorComponent {
  advancedFeaturesLoaded = signal(false);

  async enableAdvancedFeatures() {
    if (this.advancedFeaturesLoaded()) return;
    
    // Load heavy features on demand
    const module = await import('./advanced-features');
    module.initialize();
    
    this.advancedFeaturesLoaded.set(true);
  }
}
```

## Custom Plugins (Not Implemented)

There is **no plugin API** in the current release. `EditorConfig` has no `plugins` member, and no
`EditorPlugin` interface, plugin loader or lifecycle hook ships with the library. The only
extension points available today are the documented configuration interfaces, the
`EDITOR_DEFAULT_CONFIG` / `EDITOR_DEFAULT_ICONS` / `EDITOR_PERFORMANCE_CONFIG` injection tokens and
the public methods on `RmNgEditor`. Treat any plugin example as a wish-list item, not as working
API.

## Advanced Debugging

### Debug Mode

Statistics toggles live under `config.validation`, not at the top level of `EditorConfig`:

```typescript
import { Component, inject, isDevMode, signal } from '@angular/core';
import { EditorConfig, RmNgEditorService } from '@codewithrajat/rm-ng-editor';

export class DebugEditorComponent {
  private editorService = inject(RmNgEditorService);

  content = signal('');

  config = signal<EditorConfig>({
    // Enable debug features in development
    validation: isDevMode()
      ? {
          showWordCount: true,
          showCharacterCount: true,
          showReadingTime: true
        }
      : {
          showWordCount: false,
          showCharacterCount: false,
          showReadingTime: false
        }
  });

  onContentChange(html: string) {
    if (isDevMode()) {
      console.group('Editor Content Change');
      console.log('HTML:', html);
      console.log('Word Count:', this.editorService.getWordCount(html));
      console.log('Character Count:', this.editorService.getCharacterCount(html));
      console.groupEnd();
    }
    
    this.content.set(html);
  }
}
```

## Summary

Advanced configuration enables:

- ✅ Custom themes and styling
- ✅ Role-based feature access
- ✅ Dynamic validation rules
- ✅ Custom toolbar icons
- ✅ Multi-language support
- ✅ Content templates
- ✅ Form integration
- ✅ Performance tuning
- ✅ Debug mode

---

**Next Steps:**
- [Best Practices](./best-practices.md)
- [Performance Optimization](./performance-optimization.md)
- [API Reference](./api-reference.md)

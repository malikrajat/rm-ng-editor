# Extending the Project

Guide for contributing to and extending `rm-ng-editor`.

## Development Setup

### Prerequisites

- Node.js 22+
- pnpm 10.11.1+ (the version pinned in `package.json` `packageManager`)
- Git
- VS Code (recommended)

### Clone and Install

```bash
# Clone the repository
git clone https://github.com/malikrajat/rm-ng-editor.git
cd rm-ng-editor

# Install dependencies
pnpm install

# Start demo application
pnpm start
```

### Project Commands

```bash
# Development
pnpm start                # Start demo app
pnpm run serve:demo       # Same as start

# Building
pnpm run build:lib        # Build library
pnpm run build:demo       # Build demo app
pnpm run build:all        # Build both

# Testing (Vitest via @angular/build:unit-test)
pnpm run test:lib         # Run library tests
pnpm run test:demo        # Run demo tests
pnpm test                 # Run all tests
pnpm run test:lib:watch   # Library tests in watch mode
pnpm run test:lib:coverage # Library tests with coverage

# Code Quality
pnpm run lint             # Lint with Biome
pnpm run lint:eslint      # Lint with ESLint
pnpm run lint:fix         # Biome autofix
pnpm run typecheck        # tsc --noEmit across all four tsconfigs
pnpm run format           # Biome + Prettier (HTML/SCSS)
pnpm run format:check     # Check formatting
```

## Project Structure

```
rm-ng-editor-main/
├── projects/
│   ├── rm-ng-editor/              # Library source
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── rm-ng-editor.ts            # Main component
│   │   │   │   ├── rm-ng-editor.component.html
│   │   │   │   ├── rm-ng-editor.component.scss
│   │   │   │   ├── rm-ng-editor.interfaces.ts # Type definitions
│   │   │   │   ├── rm-ng-editor.service.ts    # Utility service
│   │   │   │   ├── rm-ng-editor.component.spec.ts
│   │   │   │   ├── rm-ng-editor.configuration.spec.ts
│   │   │   │   ├── rm-ng-editor.table.spec.ts
│   │   │   │   ├── rm-ng-editor.service.spec.ts
│   │   │   │   ├── rm-ng-editor.service-utils.spec.ts
│   │   │   │   ├── state-management/          # Internal (not exported)
│   │   │   │   └── media-embeds/              # Internal (not exported)
│   │   │   ├── public-api.ts      # Public exports
│   │   │   ├── test-setup.ts      # Vitest global setup
│   │   │   └── jasmine-compat.d.ts
│   │   ├── ng-package.json
│   │   ├── package.json
│   │   ├── tsconfig.lib.json
│   │   ├── tsconfig.lib.prod.json
│   │   └── tsconfig.spec.json
│   └── demo/                      # Demo application
│       ├── src/
│       │   ├── app/               # app.ts, app.html, app.scss,
│       │   │                      # app.config.ts, app.routes.ts
│       │   ├── index.html
│       │   ├── main.ts
│       │   └── styles.scss
│       ├── public/
│       ├── tsconfig.app.json
│       └── tsconfig.spec.json
├── docs/                          # Documentation
├── examples/                      # Copy-paste examples
├── dist/                          # Build output
├── .github/workflows/ci.yml       # CI pipeline
├── .vscode/                       # VS Code settings
├── angular.json
├── biome.jsonc                    # Biome lint/format config
├── eslint.config.js               # ESLint flat config (ESM)
├── .editorconfig
├── .prettierrc                    # Prettier config (HTML/SCSS)
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── CHANGELOG.md
├── LICENSE
└── README.md
```

## Adding New Features

### 1. Define the Feature Interface

Add type definitions to `rm-ng-editor.interfaces.ts`:

```typescript
export interface NewFeatureConfig {
  enabled?: boolean;
  option1?: string;
  option2?: number;
}

// Add to EditorConfig
export interface EditorConfig {
  // ... existing properties
  newFeature?: NewFeatureConfig;
}
```

### 2. Add Default Configuration

```typescript
// rm-ng-editor.interfaces.ts
export const DEFAULT_NEW_FEATURE_CONFIG: NewFeatureConfig = {
  enabled: true,
  option1: 'default',
  option2: 100
};
```

### 3. Implement Feature Logic

In `rm-ng-editor.ts`:

```typescript
export class RmNgEditor {
  // Add configuration signal
  newFeatureConfig = computed(() => ({
    ...DEFAULT_NEW_FEATURE_CONFIG,
    ...this.config()?.newFeature
  }));

  // Implement feature method
  executeNewFeature() {
    const config = this.newFeatureConfig();
    
    if (!config.enabled) {
      console.warn('New feature is disabled');
      return;
    }
    
    // Feature implementation
    console.log('Executing new feature with:', config);
  }
}
```

### 4. Add to Template

In `rm-ng-editor.component.html`:

```html
@if (newFeatureConfig().enabled) {
  <button 
    class="toolbar-button"
    (click)="executeNewFeature()"
    [attr.aria-label]="'New Feature'"
  >
    <span>🆕</span>
  </button>
}
```

### 5. Add Styles

In `rm-ng-editor.component.scss`:

```scss
.new-feature {
  // Feature-specific styles
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: var(--hover-bg);
  }
}
```

### 6. Write Tests

The runner is **Vitest**, driven by the `@angular/build:unit-test` builder
(`runner: "vitest"`, jsdom environment). `describe`, `it`, `expect` and `vi` are
globals — `tsconfig.spec.json` sets `"types": ["vitest/globals"]` — and
`projects/rm-ng-editor/src/test-setup.ts` installs the jsdom stubs plus a small
Jasmine-compatibility shim (`spyOn`, `jasmine.any`, …) for the older specs.

The component **cannot be constructed with `new RmNgEditor()`**: it calls `inject()`
in its field initialisers and takes part in the DI tree. Always go through `TestBed`,
and query the component through a host template:

```typescript
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RmNgEditor } from './rm-ng-editor';
import { EditorConfig } from './rm-ng-editor.interfaces';

@Component({
  template: `<app-rm-ng-editor [config]="editorConfig()" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RmNgEditor],
})
class TestHostComponent {
  readonly editorConfig = signal<EditorConfig | null>(null);
}

describe('RmNgEditor - New Feature', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let component: RmNgEditor;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    component = fixture.debugElement.query(
      By.directive(RmNgEditor)
    ).componentInstance;
  });

  it('should execute new feature when enabled', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    host.editorConfig.set({ newFeature: { enabled: true } });
    fixture.detectChanges();

    component.executeNewFeature();

    expect(logSpy).toHaveBeenCalled();
  });

  it('should not execute when disabled', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    host.editorConfig.set({ newFeature: { enabled: false } });
    fixture.detectChanges();

    component.executeNewFeature();

    expect(warnSpy).toHaveBeenCalledWith('New feature is disabled');
  });
});
```

`config` is an `input()`, not a writable signal — you cannot call
`component.config.set(...)`. Drive it from the host (as above) or use
`fixture.componentRef.setInput('config', { … })`.

### 7. Update Documentation

Add to relevant documentation files:

- `docs/api-reference.md` - API documentation
- `docs/usage.md` - Usage examples
- `docs/README.md` - Feature list
- [`docs/changelog.md`](./changelog.md) - Version history

### 8. Create Example

Add example to demo app:

```typescript
// projects/demo/src/app/new-feature-example.component.ts
@Component({
  selector: 'app-new-feature-example',
  standalone: true,
  imports: [RmNgEditor],
  template: `
    <app-rm-ng-editor
      [config]="config()"
      (valueChange)="onContentChange($event)"
    />
  `
})
export class NewFeatureExampleComponent {
  config = signal<EditorConfig>({
    newFeature: {
      enabled: true,
      option1: 'custom',
      option2: 200
    }
  });

  onContentChange(html: string) {
    console.log('Content:', html);
  }
}
```

## Code Style Guidelines

### TypeScript

```typescript
// Use PascalCase for classes and interfaces
export class EditorComponent {}
export interface EditorConfig {}

// Use camelCase for variables and functions
const editorConfig = {};
function formatContent() {}

// Use UPPER_SNAKE_CASE for constants
const DEFAULT_TIMEOUT = 5000;

// Use type annotations
function processContent(html: string): string {
  return html;
}

// Prefer interfaces over types for objects
interface Config {
  enabled: boolean;
}

// Use readonly for immutable properties
interface Config {
  readonly id: string;
}

// Use optional chaining
const value = config?.newFeature?.enabled;

// Use nullish coalescing
const timeout = config.timeout ?? DEFAULT_TIMEOUT;
```

### Angular

```typescript
// Use signals for state
const count = signal(0);
const doubled = computed(() => count() * 2);

// Use OnPush change detection
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})

// Use standalone components
@Component({
  standalone: true,
  imports: [CommonModule]
})

// Use dependency injection
private service = inject(EditorService);

// Use DestroyRef for cleanup
private destroyRef = inject(DestroyRef);
```

### HTML Template

```html
<!-- Use semantic HTML -->
<button type="button" aria-label="Bold">
  <span class="icon">B</span>
</button>

<!-- Use @if instead of *ngIf (Angular 17+) -->
@if (condition) {
  <div>Content</div>
}

<!-- Use @for instead of *ngFor -->
@for (item of items; track item.id) {
  <div>{{ item.name }}</div>
}

<!-- Prefer signal syntax -->
<div>{{ content() }}</div>
```

### SCSS

```scss
// Use BEM naming convention
.editor {
  &__toolbar {
    display: flex;
    
    &--compact {
      padding: 4px;
    }
  }
  
  &__button {
    cursor: pointer;
    
    &:hover {
      background-color: var(--hover-bg);
    }
  }
}

// Use CSS variables for theming
:host {
  --primary-color: #3b82f6;
  --text-color: #1f2937;
  --bg-color: #ffffff;
}

// Use nesting wisely (max 3 levels)
.editor {
  .toolbar {
    .button {  // Avoid going deeper
    }
  }
}
```

## Testing Guidelines

### Unit Tests

Because the component depends on DI, build it with `TestBed` rather than with `new`.
Plain helper classes and the service can still be tested directly:

```typescript
import { TestBed } from '@angular/core/testing';
import { RmNgEditorService } from './rm-ng-editor.service';

describe('RmNgEditorService', () => {
  let service: RmNgEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RmNgEditorService);
  });

  it('should count words in HTML', () => {
    expect(service.getWordCount('<p>Hello world</p>')).toBe(2);
  });

  it('should strip dangerous markup', () => {
    const sanitized = service.sanitizeHtml(
      '<p>ok</p><script>alert("xss")</script>'
    );
    expect(sanitized).not.toContain('<script>');
  });
});
```

### Component Tests

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RmNgEditor } from './rm-ng-editor';

describe('RmNgEditor Component', () => {
  let fixture: ComponentFixture<RmNgEditor>;
  let component: RmNgEditor;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RmNgEditor]
    }).compileComponents();

    fixture = TestBed.createComponent(RmNgEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render toolbar', () => {
    const toolbar = fixture.nativeElement.querySelector('.toolbar');
    expect(toolbar).toBeTruthy();
  });

  it('should emit valueChange when the editor content changes', () => {
    const emitted: string[] = [];
    component.valueChange.subscribe(html => emitted.push(html));

    // `onContentChange()` takes no arguments — it reads the editor DOM.
    const editor = fixture.nativeElement.querySelector('.editor-content');
    editor.innerHTML = '<p>Test</p>';
    component.onContentChange();

    expect(emitted).toEqual(['<p>Test</p>']);
  });
});
```

`valueChange` is an `OutputEmitterRef`, not an RxJS `Observable`. It does expose
`subscribe(...)`, and `TestBed` also lets you spy on it through a host component's
`(valueChange)` binding. Note that `onContentChange()` accepts **no** arguments: it
reads `editorElement().nativeElement.innerHTML`, so drive the DOM first.

## Performance Considerations

### Avoid Memory Leaks

```typescript
// ✅ Good - automatic cleanup
constructor() {
  effect(() => {
    const html = this.content();
    this.updateStats(html);
  });
}

// ❌ Bad - manual subscription without cleanup
ngOnInit() {
  this.subscription = this.observable.subscribe(...);
}
// Missing ngOnDestroy cleanup!
```

### Use Computed Signals

```typescript
// ✅ Good - cached automatically
wordCount = computed(() => {
  return this.calculateWordCount(this.content());
});

// ❌ Bad - recalculates every time
get wordCount() {
  return this.calculateWordCount(this.content());
}
```

### Debounce Expensive Operations

```typescript
private contentSubject = new Subject<string>();

ngOnInit() {
  this.contentSubject.pipe(
    debounceTime(300)
  ).subscribe(html => {
    this.expensiveOperation(html);
  });
}
```

## Contributing Guidelines

### Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/my-feature`
3. **Make changes**
4. **Write tests**
5. **Update documentation**
6. **Commit**: `git commit -m "Add: my feature description"`
7. **Push**: `git push origin feature/my-feature`
8. **Open Pull Request**

### Commit Message Format

```
Type: Short description

Longer description if needed

Fixes #123
```

**Types:**
- `Add:` New feature
- `Fix:` Bug fix
- `Update:` Update existing feature
- `Docs:` Documentation only
- `Style:` Code style changes
- `Refactor:` Code refactoring
- `Test:` Adding tests
- `Chore:` Maintenance tasks

### Pull Request Checklist

- [ ] Code follows style guidelines
- [ ] Tests added/updated (Vitest via `@angular/build:unit-test`)
- [ ] Documentation updated
- [ ] [`docs/changelog.md`](./changelog.md) updated
- [ ] All tests passing (`pnpm run test:lib`)
- [ ] Type check passing (`pnpm run typecheck`)
- [ ] Lint passing (`pnpm run lint` for Biome and `pnpm run lint:eslint` for ESLint)
- [ ] Code formatted: Biome for TS/JSON, Prettier for HTML/SCSS (`pnpm run format`)

## Release Process

### Version Bumping

```bash
# Patch release (bug fixes)
npm version patch

# Minor release (new features)
npm version minor

# Major release (breaking changes)
npm version major
```

### Build and Publish

The published package is `@codewithrajat/rm-ng-editor`. `build:lib` also copies
`README.md`, `CHANGELOG.md` and `LICENSE` into `dist/rm-ng-editor`, so the tarball
is complete as soon as the build finishes.

```bash
# Build library (partial compilation, then copies the release files)
pnpm run build:lib

# Inspect the tarball before publishing
cd dist/rm-ng-editor
npm pack

# Publish to npm (publishes @codewithrajat/rm-ng-editor)
npm publish --access public
```

Releases normally go through CI: bump the version in
`projects/rm-ng-editor/package.json`, push that to `main`, then push a matching
`v*` tag. The `publish` job refuses to publish when the tag and the manifest
version disagree. See [CI-BRANCH-POLICY.md](../CI-BRANCH-POLICY.md).

## Resources

- [Angular Style Guide](https://angular.dev/style-guide)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)

---

**Questions?**
- Open a [GitHub Discussion](https://github.com/malikrajat/rm-ng-editor/discussions)
- Check the [FAQ](./faq.md)
- Read the [Best Practices](./best-practices.md)

# rm-ng-editor Examples

Complete, working examples demonstrating real-world usage of `rm-ng-editor`.

## Overview

This folder contains **production-ready examples** organized by use case. Each example includes:
- ✅ A working TypeScript file (`.ts`)
- ✅ Documentation explaining the example (`.md`)
- ✅ Real code using only public APIs
- ✅ Type-safe, copy-paste ready

## Quick Start

```bash
# Navigate to an example
cd examples/basic

# View the documentation
cat basic-usage.md

# Use the code  
# Copy basic-usage.ts into your Angular project
```

## Examples Index

### 🟢 Beginner

| Example | Description | File |
|---------|-------------|------|
| **Basic Usage** | Minimal working editor implementation | [basic-usage.md](./basic/basic-usage.md) |
| **Form Integration** | Using the editor with Angular form controls | [form-integration.md](./basic/form-integration.md) |

### 🟡 Intermediate

| Example | Description | File |
|---------|-------------|------|
| **Advanced Configuration** | Custom toolbar, validation, themes | [advanced-configuration.md](./advanced/advanced-configuration.md) |
| **Content Processing** | Using RmNgEditorService utilities | [content-processing.md](./advanced/content-processing.md) |

### 🔴 Production Patterns

| Example | Description | File |
|---------|-------------|------|
| **Auto-Save** | Debounced auto-save pattern | [auto-save.md](./async-and-lifecycle/auto-save.md) |
| **Error Handling** | Validation and error recovery | [error-handling.md](./failure-cases/error-handling.md) |

## Example Structure

Each example folder contains:

```
example-name/
├── example-name.md    # Detailed explanation
└── example-name.ts    # Working TypeScript code
```

## Usage Guidelines

### Running Examples

1. **Copy the TypeScript file** into your Angular project
2. **Import required dependencies** as shown in the file
3. **Adjust configuration** for your needs
4. **Run your application**

### Importing the Library

The example sources import from `rm-ng-editor` because that specifier is mapped to the
built package inside this workspace (`paths` in the root `tsconfig.json`). In your own
application, install and import the published package:

```typescript
// In a consumer application
import { RmNgEditor, RmNgEditorService, EditorConfig } from '@codewithrajat/rm-ng-editor';
```

### Prerequisites

All examples assume:
- Angular 22 (the library's declared peer range is `>=16.0.0 <=26.0.0`; only
  Angular 22 is built and tested in this repository)
- TypeScript 6.0.3 (compatible with Angular 22, which requires TypeScript 5.9+)
- `@codewithrajat/rm-ng-editor` installed via npm/pnpm/yarn
- Zoneless change detection configured with `provideZonelessChangeDetection()` (recommended)

### TypeScript Configuration

Examples use strict TypeScript:

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "preserve"
  }
}
```

## Learning Path

**New to rm-ng-editor?**

1. Start with [Basic Usage](./basic/basic-usage.md)
2. Review [Form Integration](./basic/form-integration.md)
3. Explore [Advanced Configuration](./advanced/advanced-configuration.md)
4. Process output with [Content Processing](./advanced/content-processing.md)
5. Study [Error Handling](./failure-cases/error-handling.md)

**Building for Production?**

1. [Auto-Save Pattern](./async-and-lifecycle/auto-save.md)
2. [Error Recovery](./failure-cases/error-handling.md)
3. [Content Processing](./advanced/content-processing.md)
4. [Advanced Configuration](./advanced/advanced-configuration.md)

## Contributing Examples

Have a useful example? Contributions welcome!

1. Create a new folder in the appropriate category
2. Add `.ts` file with working code
3. Add `.md` file with explanation
4. Follow existing example structure
5. Test your example thoroughly
6. Submit a pull request

## Common Patterns

### Signal-Based State

```typescript
import { signal, computed } from '@angular/core';

const content = signal('');
const wordCount = computed(() => {
  const text = content().replace(/<[^>]*>/g, '');
  return text.split(/\s+/).filter(Boolean).length;
});
```

### Debounced Auto-Save

```typescript
import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export class DraftComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly saveSubject = new Subject<string>();

  constructor() {
    this.saveSubject
      .pipe(debounceTime(2000), takeUntilDestroyed(this.destroyRef))
      .subscribe(html => this.save(html));
  }

  private save(html: string): void {
    // persist `html`
  }
}
```

Feed `saveSubject` from `(valueChange)` on the editor.

### Type-Safe Configuration

```typescript
import { EditorConfig } from '@codewithrajat/rm-ng-editor';

const config: EditorConfig = {
  placeholder: 'Start typing...',
  toolbarConfig: {
    showBold: true,
    showItalic: true
  }
};
```

## API Reference

For complete API documentation, see [docs/api-reference.md](../docs/api-reference.md).

## Support

- **Documentation**: [docs/](../docs/)
- **Issues**: [GitHub Issues](https://github.com/malikrajat/rm-ng-editor/issues)
- **Discussions**: [GitHub Discussions](https://github.com/malikrajat/rm-ng-editor/discussions)

---

**Examples Version**: 1.0.0  
**Last Updated**: July 2026  
**Compatible with**: `@codewithrajat/rm-ng-editor` 1.0.0, Angular 22 (declared peer range `>=16.0.0 <=26.0.0`)

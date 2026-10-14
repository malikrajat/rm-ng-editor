# Peer Dependencies

Dependency requirements and compatibility information for `rm-ng-editor`.

## Required Peer Dependencies

### Angular

| Package | Declared Range | Status | Purpose |
|---------|----------------|:------:|---------|
| `@angular/core` | `>=16.0.0 <=26.0.0` | Required | Core framework |
| `@angular/common` | `>=16.0.0 <=26.0.0` | Required | Common utilities |

**Installation:**

Angular is a peer dependency, so you install it yourself:

```bash
pnpm add @angular/core @angular/common
```

The workspace that publishes this package is built and tested on **Angular 22** (framework `22.0.4`, CLI `22.0.5`). Angular has its own peer dependencies — `rxjs` amongst them — and those are resolved by your Angular installation, not declared by this library.

### TypeScript

TypeScript is **not** a peer dependency of the library; it is a development dependency of this workspace. The workspace compiles with **TypeScript 6.0.3**, and Angular 22 requires TypeScript 5.9 or higher.

**Installation:**
```bash
pnpm add -D typescript@6.0.3
```

## Runtime Dependencies

`rm-ng-editor` ships exactly one runtime dependency:

| Package | Purpose |
|---------|---------|
| `tslib` | TypeScript helpers, required by Angular's compiled output (`^2.6.0`) |

## Version Compatibility Matrix

### Angular Versions

| rm-ng-editor | Angular (declared peer range) | TypeScript | Node.js | Status |
|--------------|-------------------------------|------------|---------|:------:|
| **1.0.0** | `>=16.0.0 <=26.0.0` (built and tested on 22.0.4) | 5.9+ (workspace: 6.0.3) | 22+ | ✅ Current |

### Why Angular 17.2+ APIs?

The published peer range is `>=16.0.0 <=26.0.0`, but the workspace is only built and verified against Angular 22. The component relies on framework APIs that arrived at different points in Angular's history:

1. **Signal inputs and outputs** (`input()` / `output()`, Angular 17.2+)
   ```typescript
   value = input<string>('');
   valueChange = output<string>();
   ```

2. **Signal queries** — the component reads its content element with `viewChild.required` (Angular 17.2+)

3. **Signals** — `signal()`, `computed()` and `effect()` for state (Angular 16+)

4. **Standalone components** — no NgModule wrapper is required (Angular 15+)
   ```typescript
   @Component({
     standalone: true,
     imports: [...]
   })
   ```

5. **OnPush change detection** — the editor is signal-driven and change-detection friendly
   ```typescript
   changeDetection: ChangeDetectionStrategy.OnPush
   ```

6. **Zoneless change detection** — the editor does not depend on `NgZone`, so it runs in a zoneless application configured with `provideZonelessChangeDetection()` from `@angular/core`.

## Development Dependencies

These are only needed for library development, not for usage:

| Package | Version | Purpose |
|---------|---------|---------|
| `@angular/cli` | ^22.0.5 | Build tooling |
| `@angular/build` | ^22.0.5 | Application and library builders (esbuild + Vite) |
| `@angular/compiler-cli` | ^22.0.4 | Angular compiler |
| `ng-packagr` | ^22.0.1 | Library packaging |
| `typescript` | ~6.0.3 | TypeScript compiler |
| `vitest` | ^4.0.8 | Unit test runner, used through `@angular/build:unit-test` |
| `jsdom` | ^30.1.1 | DOM environment for unit tests |
| `@biomejs/biome` | ^2.5.14 | Linting and formatting |
| `eslint` | ^9.35.0 | Additional lint rules (`lint:eslint`) |
| `prettier` | ^3.6.2 | Formatting for HTML and SCSS |

## Installation Guide

### Fresh Project

```bash
# Create a new Angular project
ng new my-app --standalone --skip-tests

# Install rm-ng-editor
pnpm add @codewithrajat/rm-ng-editor
```

To run the app zoneless, register the stable provider in `main.ts`:

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

### Existing Project

```bash
# Upgrade Angular (the workspace is built and tested on 22)
ng update @angular/core@22 @angular/cli@22

# Install rm-ng-editor
pnpm add @codewithrajat/rm-ng-editor
```

## Dependency Resolution

### Peer Dependency Warnings

If you see warnings like:

```
npm WARN  peer dependency @angular/core@">=16.0.0 <=26.0.0" required by @codewithrajat/rm-ng-editor
```

**Solution:** Install an Angular version inside the declared peer range:

```bash
ng update @angular/core@22 @angular/cli@22
```

### Version Conflicts

If multiple packages require different Angular versions:

```bash
# Check what requires what
pnpm why @angular/core
```

Force a resolution (use carefully) in `package.json`:

```json
{
  "pnpm": {
    "overrides": {
      "@angular/core": "22.0.4"
    }
  }
}
```

## Package Manager Compatibility

### pnpm (Recommended)

```bash
pnpm add @codewithrajat/rm-ng-editor
```

**Benefits:**
- Disk space efficient
- Strict dependency resolution
- Better monorepo support

### npm

```bash
npm install @codewithrajat/rm-ng-editor
```

**Compatibility:** the npm that ships with Node.js 22

### Yarn

```bash
yarn add @codewithrajat/rm-ng-editor
```

**Compatibility:** modern Yarn releases with peer-dependency support

## Reducing Bundle Size

### Import Only What You Need

```typescript
// ✅ Good - tree-shakeable
import { RmNgEditor } from '@codewithrajat/rm-ng-editor';

// ❌ Avoid - imports everything
import * as Editor from '@codewithrajat/rm-ng-editor';
```

### Use Production Build

```bash
ng build --configuration=production
```

**Optimizations:**
- Tree-shaking removes unused code
- Minification reduces file size
- Dead code elimination
- Lazy loading chunks

## Compatibility Verification

### Check Installed Versions

```bash
# Check Angular version
ng version

# Check TypeScript version
tsc --version

# Check Node.js version
node --version

# Check package manager version
pnpm --version  # or npm --version
```

### Verify Peer Dependencies

```bash
# List all peer dependencies
npm ls --depth=0

# Check for peer dependency issues
npm ls @codewithrajat/rm-ng-editor
```

## Migration Guides

### From Angular 20 or Earlier

```bash
# 1. Upgrade Angular to the version this workspace is verified against
ng update @angular/core@22 @angular/cli@22

# 2. Update TypeScript to the version Angular 22 expects
pnpm add -D typescript@6.0.3

# 3. Install rm-ng-editor
pnpm add @codewithrajat/rm-ng-editor

# 4. Optional: enable zoneless change detection in main.ts
#    See the Installation Guide above
```

Note: although the declared peer range starts at Angular 16, the component's signal inputs/outputs and `viewChild.required` queries need **Angular 17.2 or newer**, so upgrading to 22 is the verified path.

### Dependency Update Strategy

```bash
# Check for outdated packages
pnpm outdated

# Update Angular packages
ng update @angular/core @angular/cli

# Update other dependencies
pnpm update

# Verify everything works
pnpm test
pnpm build
```

## Security Considerations

### Keep Dependencies Updated

```bash
# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Check specific package
pnpm audit
```

### Supported Versions

We only support:
- **Angular**: the declared peer range `>=16.0.0 <=26.0.0`, built and tested on Angular 22
- **Node.js 22+**: the version used in CI
- **TypeScript 5.9+**: the floor required by Angular 22 (this workspace uses 6.0.3)

## Troubleshooting

### Issue: Peer Dependency Conflict

**Error:**
```
ERESOLVE unable to resolve dependency tree
```

**Solution:**
```bash
# Use force flag (not recommended)
npm install --force

# Better: Update conflicting packages
ng update @angular/core@22
```

### Issue: TypeScript Version Mismatch

**Error:**
```
error TS2304: Cannot find name 'Signal'
```

**Solution:**
```bash
pnpm add -D typescript@6.0.3
```

### Issue: Missing Peer Dependencies

**Error:**
```
Cannot find module '@angular/common'
```

**Solution:**
```bash
pnpm add @angular/common@^22.0.4
```

## Dependency Philosophy

### Why So Few Runtime Dependencies?

The only runtime dependency is `tslib`:

1. **Smaller Bundle**: No extra packages to download
2. **Fewer Conflicts**: Less chance of version conflicts
3. **Better Security**: Smaller attack surface
4. **Faster Loads**: Fewer files to fetch and parse
5. **Simpler Updates**: Only update Angular and the library

### What About Angular?

Angular is a **peer dependency**, meaning:
- You control the Angular version
- No duplicate Angular in your bundle
- Better compatibility with your app
- Smaller overall bundle size

## Summary

- ✅ **One runtime dependency** (`tslib`) — Angular itself is a peer dependency
- ✅ **Declared Angular peer range `>=16.0.0 <=26.0.0`**, built and tested on Angular 22
- ✅ **TypeScript 5.9+** required by Angular 22 (this workspace uses 6.0.3)
- ✅ **Node.js 22+** for development
- ✅ **Works with pnpm, npm, yarn**
- ❌ **Angular versions outside the declared range are not covered**

---

**Next Steps:**
- [Installation Guide](./installation.md)
- [Versioning & Breaking Changes](./versioning-and-breaking-changes.md)
- [Troubleshooting](./troubleshooting.md)

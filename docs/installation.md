# Installation Guide

This guide provides step-by-step instructions for installing and setting up `rm-ng-editor` in your Angular application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Version Compatibility](#version-compatibility)
- [First-Time Setup](#first-time-setup)
- [Verification](#verification)
- [Common Installation Issues](#common-installation-issues)

## Prerequisites

Before installing `rm-ng-editor`, ensure your development environment meets these requirements:

### Required Software

| Software | Minimum Version | Recommended | Check Command |
|----------|----------------|-------------|---------------|
| **Node.js** | 22+ | Latest Node.js 22 LTS | `node --version` |
| **Angular** | 22.x | 22.0.4 framework / 22.0.5 CLI | `ng version` |
| **TypeScript** | 5.9+ | 6.0.3 (used by this workspace) | `tsc --version` |
| **Package Manager** | pnpm 10 | pnpm 10.11.1 | `pnpm --version` |

### Package Manager Options

**Recommended: pnpm**
```bash
# Install pnpm globally
npm install -g pnpm@10.11.1

# Verify installation
pnpm --version  # Should show 10.11.1 or higher
```

**Alternative: npm**
```bash
# npm ships with Node.js
npm --version
```

**Alternative: yarn**
```bash
# Install yarn
npm install -g yarn

# Verify installation
yarn --version
```

### Environment Requirements

Your project must be:
- An Angular 22 application
- Using TypeScript 5.9 or higher
- Targeting ES2022 or higher
- Using standalone components (recommended)

## Installation

### Step 1: Install the Package

Choose your package manager:

**Using pnpm (Recommended)**
```bash
pnpm add @codewithrajat/rm-ng-editor
```

**Using npm**
```bash
npm install @codewithrajat/rm-ng-editor
```

**Using yarn**
```bash
yarn add @codewithrajat/rm-ng-editor
```

### Step 2: Verify Installation

Check that the package was installed correctly:

```bash
# Using pnpm
pnpm list @codewithrajat/rm-ng-editor

# Using npm
npm list @codewithrajat/rm-ng-editor

# Using yarn
yarn list --pattern @codewithrajat/rm-ng-editor
```

Expected output:
```
@codewithrajat/rm-ng-editor 1.0.0
```

## Environment Setup

### TypeScript Configuration

Ensure your `tsconfig.json` includes these settings:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "preserve",
    "strict": true,
    "experimentalDecorators": true,
    "importHelpers": true,
    "skipLibCheck": true
  }
}
```

### Angular Configuration

Update `angular.json` if needed:

```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "src/styles.scss"
            ]
          }
        }
      }
    }
  }
}
```

### Optional: Path Alias

For development, add a path alias in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@codewithrajat/rm-ng-editor": ["./node_modules/@codewithrajat/rm-ng-editor"]
    }
  }
}
```

## Version Compatibility

### Angular Version Matrix

| rm-ng-editor Version | Angular Peer Range | Status |
|---------------------|--------------------|--------|
| 1.0.0 | `>=16.0.0 <=26.0.0` (built and tested on Angular 22.0.4 / CLI 22.0.5) | ✅ Current |

`@angular/core` and `@angular/common` are peer dependencies, so your app decides the Angular version. The workspace itself is only built and tested against Angular 22.

### Node.js Version Matrix

| Node.js Version | Status | Notes |
|----------------|--------|-------|
| 22+ | ✅ Recommended | The version this workspace builds and tests with |
| < 22 | ⚠️ Not verified | No verification is published for older releases |

### Browser Compatibility

See [Browser Support](./browser-support.md) for detailed compatibility information.

## First-Time Setup

### 1. Import the Component

In your standalone component:

```typescript
import { Component } from '@angular/core';
import { RmNgEditor } from '@codewithrajat/rm-ng-editor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RmNgEditor],  // Add here
  template: `
    <app-rm-ng-editor />
  `
})
export class AppComponent {}
```

### 2. Add to Your Template

```html
<app-rm-ng-editor
  [config]="editorConfig"
  (valueChange)="onContentChange($event)"
/>
```

### 3. Configure the Editor (Optional)

```typescript
export class AppComponent {
  editorConfig = {
    placeholder: 'Start typing...',
    height: '400px',
    showToolbar: true
  };

  onContentChange(html: string) {
    console.log('Content:', html);
  }
}
```

### 4. Run Your Application

```bash
# Using pnpm
pnpm start

# Using npm
npm start

# Using yarn
yarn start
```

Navigate to `http://localhost:4200` to see the editor in action.

## Verification

### Quick Test

Create a test component to verify the installation:

```typescript
// src/app/editor-test/editor-test.component.ts
import { Component, signal } from '@angular/core';
import { EditorConfig, RmNgEditor } from '@codewithrajat/rm-ng-editor';

@Component({
  selector: 'app-editor-test',
  standalone: true,
  imports: [RmNgEditor],
  template: `
    <div style="padding: 20px;">
      <h2>Editor Test</h2>
      <app-rm-ng-editor
        [config]="config()"
        [value]="content()"
        (valueChange)="content.set($event)"
      />
      <div style="margin-top: 20px;">
        <h3>Output:</h3>
        <pre>{{ content() }}</pre>
      </div>
    </div>
  `
})
export class EditorTestComponent {
  config = signal<EditorConfig>({
    placeholder: 'Type here to test...',
    height: '300px'
  });
  
  content = signal('');
}
```

Add to your routes:

```typescript
export const routes = [
  { path: 'test', component: EditorTestComponent }
];
```

Visit `http://localhost:4200/test` and verify:
- ✅ Editor renders correctly
- ✅ Toolbar appears with all buttons
- ✅ Typing works and content updates
- ✅ No console errors

## Common Installation Issues

### Issue 1: Peer Dependency Warnings

**Problem:**
```
npm WARN peer dependency @angular/core@">=16.0.0 <=26.0.0" required by @codewithrajat/rm-ng-editor
```

**Solution:**
Install an Angular version inside the declared peer range. The workspace is built and tested on Angular 22:
```bash
ng update @angular/core@22 @angular/cli@22
```

### Issue 2: TypeScript Version Mismatch

**Problem:**
```
error TS2304: Cannot find name 'Signal'
```

**Solution:**
Update TypeScript to the version Angular 22 expects:
```bash
pnpm add -D typescript@6.0.3
```

### Issue 3: Module Not Found

**Problem:**
```
Error: Cannot find module '@codewithrajat/rm-ng-editor'
```

**Solution:**
1. Verify installation:
   ```bash
   pnpm list @codewithrajat/rm-ng-editor
   ```

2. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   pnpm install
   ```

3. Restart your dev server

### Issue 4: Build Errors with Zoneless

**Problem:** The build fails because `main.ts` imports the experimental zoneless change-detection provider, which no longer exists in Angular 22 (it reports that the symbol is not defined).

**Solution:**
Use the stable `provideZonelessChangeDetection` from `@angular/core` in your `main.ts`:

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

### Issue 5: SCSS Compilation Errors

**Problem:**
```
Error: Cannot compile SCSS
```

**Solution:**
Ensure SCSS is enabled in `angular.json`:

```json
{
  "projects": {
    "your-app": {
      "schematics": {
        "@schematics/angular:component": {
          "style": "scss"
        }
      },
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

### Issue 6: pnpm Installation Issues

**Problem:**
```
ERR_PNPM_UNSUPPORTED_ENGINE  Unsupported environment
```

**Solution:**
Update Node.js to version 22 or newer:

```bash
# Using nvm
nvm install 22
nvm use 22

# Verify
node --version
```

## Next Steps

After successful installation:

1. **Learn Basic Usage**: Read the [Usage Guide](./usage.md)
2. **Explore Features**: Check the [API Reference](./api-reference.md)
3. **Configure Advanced Options**: See [Advanced Configuration](./advanced-configuration.md)
4. **Optimize Performance**: Review [Performance Optimization](./performance-optimization.md)

## Additional Resources

- **Peer Dependencies**: See [peer-dependencies.md](./peer-dependencies.md)
- **Troubleshooting**: See [troubleshooting.md](./troubleshooting.md)
- **Migration Guide**: See [versioning-and-breaking-changes.md](./versioning-and-breaking-changes.md)

---

**Need Help?**
- Check [Troubleshooting Guide](./troubleshooting.md)
- Review [FAQ](./faq.md)
- Open an [Issue on GitHub](https://github.com/malikrajat/rm-ng-editor/issues)

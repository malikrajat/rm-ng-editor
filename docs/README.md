# rm-ng-editor Documentation

> A rich text editor for Angular applications with a zoneless architecture and signal-based state management. Declared peer range: Angular 16–26; built and verified on Angular 22.

## What is rm-ng-editor?

`rm-ng-editor` is an Angular library that provides a fully-featured WYSIWYG rich text editor component. It is built on Angular 22 with zoneless change detection and signal-based reactivity, and declares a peer-dependency range of Angular 16–26 (`@angular/core` and `@angular/common`, `>=16.0.0 <=26.0.0`). The workspace itself is built and verified on Angular 22 only.

## When Should You Use It?

Use `rm-ng-editor` when you need:

- **Rich Text Editing**: Content creation with formatting, media, and tables
- **Modern Angular**: Declares an Angular 16–26 peer range; built and verified on Angular 22 with a zoneless architecture
- **Signal-based**: Uses Angular signals with OnPush change detection
- **Full Control**: Granular configuration of every feature and toolbar item
- **Accessibility**: ARIA roles and labels on the toolbar and content area, plus keyboard shortcuts
- **Resource-safe**: Tracked timers, listeners and observers, released on destroy

## Key Features

### Rich Text Editing
- **Text Formatting**: Bold, italic, underline, strikethrough, subscript, superscript
- **Font Controls**: Font family and size selection
- **Colors**: Text color customization
- **Alignment**: Left, center, right, justify text alignment
- **Lists**: Ordered and unordered lists with indent/outdent

### Document Structure
- **Headings**: H1-H6 heading styles
- **Block Formatting**: Paragraph and heading block formats
- **Page Breaks**: Visual section dividers and page breaks
- **Tables**: Full table support with row/column manipulation

### Media & Links
- **Links**: Insert, edit and remove hyperlinks
- **Images**: Image insertion via URL
- **Videos**: YouTube and Vimeo embedding
- **Audio**: Audio insertion
- **Social Media**: Twitter, Instagram content embedding

### Advanced Features
- **HTML Editing**: Direct HTML source editing mode
- **Word Count**: Real-time statistics (words, characters, reading time)
- **Themes**: Light/dark/auto theme switching
- **Full-Screen**: Distraction-free editing mode
- **Keyboard Shortcuts**: Comprehensive keyboard support (Ctrl+B, Ctrl+I, etc.)
- **Undo/Redo**: Full editing history management

## Tech Stack

| Component | Version | Purpose |
|-----------|---------|---------|
| **Angular** | 22.0.4 | Framework (peer range 16–26) |
| **TypeScript** | 6.0.3 | Language |
| **RxJS** | 7.8 | Reactive programming |
| **SCSS** | - | Styling |
| **pnpm** | 10.11.1 | Package manager (recommended) |
| **Node.js** | 22+ | Runtime |

## Quick Start

### Installation

```bash
# Using pnpm (recommended)
pnpm add @codewithrajat/rm-ng-editor

# Using npm
npm install @codewithrajat/rm-ng-editor

# Using yarn
yarn add @codewithrajat/rm-ng-editor
```

### Basic Usage

```typescript
import { Component } from '@angular/core';
import { RmNgEditor } from '@codewithrajat/rm-ng-editor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RmNgEditor],
  template: `
    <app-rm-ng-editor
      [config]="editorConfig"
      (valueChange)="onContentChange($event)"
    />
  `
})
export class AppComponent {
  editorConfig = {
    placeholder: 'Start typing...',
    height: '400px'
  };

  onContentChange(html: string) {
    console.log('Content changed:', html);
  }
}
```

## Project Structure

```
rm-ng-editor-main/
├── docs/                          # Documentation (this folder)
│   ├── README.md                  # This file
│   ├── installation.md            # Installation guide
│   ├── usage.md                   # Usage examples
│   ├── api-reference.md           # Complete API docs
│   ├── architecture.md            # System architecture
│   ├── project-structure.md       # Codebase layout
│   ├── core-concepts.md           # Key concepts
│   ├── advanced-configuration.md  # Power user features
│   ├── best-practices.md          # Recommended patterns
│   ├── performance-optimization.md # Performance tuning
│   ├── browser-support.md         # Browser compatibility
│   ├── accessibility.md           # Keyboard, ARIA and screen-reader behaviour
│   ├── troubleshooting.md         # Common issues
│   ├── faq.md                     # FAQ
│   ├── peer-dependencies.md       # Dependencies
│   ├── versioning-and-breaking-changes.md
│   ├── extending-the-project.md   # Extension guide
│   ├── changelog.md               # Version history
│   └── api-source-reference.md    # Verified API/project reference (maintainers)
├── projects/
│   ├── rm-ng-editor/              # Library source code
│   │   └── src/lib/
│   │       ├── rm-ng-editor.ts
│   │       ├── rm-ng-editor.component.html
│   │       ├── rm-ng-editor.component.scss
│   │       ├── rm-ng-editor.interfaces.ts
│   │       ├── rm-ng-editor.service.ts
│   │       ├── state-management/  # Internal helpers
│   │       └── media-embeds/      # Internal helpers
│   └── demo/                      # Demo application
├── examples/                      # Example snippets
├── dist/                          # Build output
├── angular.json                   # Workspace / builder configuration
├── package.json                   # Scripts and dependencies
├── tsconfig.json
├── eslint.config.js
├── .editorconfig
├── .gitignore
├── .prettierrc
├── .npmignore
├── LICENSE                        # MIT licence
├── CHANGELOG.md                   # Version history
└── README.md                      # Root README
```

## Documentation Index

### Getting Started
- **[Installation Guide](./installation.md)** - Install and configure rm-ng-editor
- **[Usage Guide](./usage.md)** - Common usage patterns and examples
- **[API Reference](./api-reference.md)** - Complete API documentation

### Understanding the Library
- **[Architecture](./architecture.md)** - System design and data flow
- **[Core Concepts](./core-concepts.md)** - Key concepts and patterns
- **[Project Structure](./project-structure.md)** - Codebase organization

### Advanced Topics
- **[Advanced Configuration](./advanced-configuration.md)** - Power user features
- **[Best Practices](./best-practices.md)** - Recommended patterns
- **[Performance Optimization](./performance-optimization.md)** - Performance tuning
- **[Extending the Project](./extending-the-project.md)** - Custom extensions

### Support & Reference
- **[Browser Support](./browser-support.md)** - Compatibility matrix
- **[Accessibility](./accessibility.md)** - Keyboard, ARIA and screen-reader behaviour
- **[Peer Dependencies](./peer-dependencies.md)** - Required dependencies
- **[Troubleshooting](./troubleshooting.md)** - Common issues and fixes
- **[FAQ](./faq.md)** - Frequently asked questions
- **[Versioning & Breaking Changes](./versioning-and-breaking-changes.md)** - Migration guide
- **[Changelog](./changelog.md)** - Version history
- **[Verified API Reference](./api-source-reference.md)** - What the source actually exports (maintainers)

## Why rm-ng-editor?

### Modern Angular Architecture
- Declares an Angular 16–26 peer range; built and verified on Angular 22 with a zoneless approach
- Signal-based reactive state management
- Standalone components (no NgModule required)
- OnPush change detection for optimal performance

### Performance First
- Debounced editor-state, word-count and spell-check updates
- Automatic tracking and cleanup of timers, listeners and observers
- `IntersectionObserver` pauses word-count and spell-check work while the editor is off-screen
- Chunked content processing for large documents

### Fully Configurable
- Granular control over every feature
- 74 individual toolbar visibility flags (`ToolbarConfig`)
- Custom icons by overriding the `EDITOR_DEFAULT_ICONS` injection token
- Theme configuration for light, dark and auto modes

### Enterprise Ready
- TypeScript strict mode with additional strictness flags
- Content sanitization and validation helpers in `RmNgEditorService`
- ARIA roles and labels on the toolbar and content area
- Resource tracking plus `checkForMemoryLeaks()` diagnostics

### Developer Experience
- Comprehensive documentation
- Working code examples under `examples/`
- MIT licensed

## Browser Support

| Browser | Minimum Version | Recommended |
|---------|----------------|-------------|
| Chrome | 119+ | Latest |
| Firefox | 120+ | Latest |
| Safari | 17+ | Latest |
| Edge | 119+ | Latest |

**Mobile Support**: iOS 17+, Android Chrome 119+

These minimums reflect the Angular 22 toolchain (ES2022 output) and the Web APIs the
editor relies on (`contenteditable`, `execCommand`, `MutationObserver`,
`IntersectionObserver`, `ResizeObserver`). Internet Explorer is not supported.

## System Requirements

- **Node.js**: 22 or higher (the version CI uses)
- **Angular**: 16–26 declared peer range; the workspace is built and verified on Angular 22.0.4
- **TypeScript**: 5.9 or higher (Angular 22's floor); the workspace uses TypeScript 6.0.3
- **Package Manager**: pnpm 10.11.1 (the version pinned by `packageManager`); npm or yarn also work

## License

MIT License - see [LICENSE](../LICENSE) file for details

## Support

- **Issues**: [GitHub Issues](https://github.com/malikrajat/rm-ng-editor/issues)
- **Documentation**: This documentation folder
- **Source Code**: [GitHub Repository](https://github.com/malikrajat/rm-ng-editor)
- **Package**: [@codewithrajat/rm-ng-editor on npm](https://www.npmjs.com/package/@codewithrajat/rm-ng-editor)

## Next Steps

1. **Install the library**: Follow the [Installation Guide](./installation.md)
2. **Learn the basics**: Read the [Usage Guide](./usage.md)
3. **Explore the API**: Check the [API Reference](./api-reference.md)
4. **Understand the architecture**: Review the [Architecture](./architecture.md) guide

---

**Version**: 1.0.0  
**Last Updated**: July 2026  
**Maintained By**: RM-NG-Editor Contributors

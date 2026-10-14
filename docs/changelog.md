# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- **CI no longer fails before it runs anything.** Biome reported `package.json` as
  unformatted, which failed `format:biome:check` (and `lint`) on the first step of
  the pipeline, so lint, type-check, both builds and every test were skipped.
- **The library can be published again.** `compilationMode` was unset, so ng-packagr
  built the library in full compilation mode and injected a `prepublishOnly` script
  into `dist/rm-ng-editor/package.json` that unconditionally exits 1.
  `projects/rm-ng-editor/tsconfig.lib.prod.json` now sets
  `"compilationMode": "partial"`.
- **The published tarball contains its licence and readme.** `copy-extra-files.js`
  imported `fs-extra` (not a dependency), was invoked by no script, and copied
  `LICENSE` to a malformed path, so `dist/rm-ng-editor` shipped without `README.md`,
  `CHANGELOG.md` or `LICENSE`. It now uses `node:fs`, runs as part of `build:lib`,
  and fails the build if a file is missing.
- **`pnpm run test:demo` works.** The demo project had no specs, so the target
  failed with "No tests found". `projects/demo/src/app/app.spec.ts` adds 18 smoke
  tests for the demo shell.

### Added

- CI runs on pull requests that target an allowed branch. The `guard` job judges
  pull requests by `github.base_ref`, so a contributor's own branch name cannot
  widen access.
- A `publish` job publishes `v*` tags to npm with `--provenance`, after checking
  that the tag matches `projects/rm-ng-editor/package.json`, that the built package
  contains its readme/changelog/licence, and that the full-compilation
  `prepublishOnly` guard is absent. It needs the `NPM_TOKEN` repository secret.
- The library coverage report is uploaded as the `library-coverage` artifact
  instead of being discarded with the runner.
- Dependency audit runs as an advisory (non-failing) step, and
  `.github/dependabot.yml` opens grouped weekly dependency and Actions updates.
- `pnpm run typecheck` also type-checks `projects/demo/tsconfig.spec.json`.

### Changed

- Upgraded the workspace to **Angular 22.0.4** with **@angular/cli / @angular/build
  22.0.5** and **TypeScript 6.0.3**.
- Migrated every Angular builder to the `@angular/build` family:
  `@angular/build:application` (demo), `@angular/build:dev-server`,
  `@angular/build:ng-packagr` (library) and `@angular/build:unit-test` (tests).
- Adopted `provideZonelessChangeDetection()` — the stable API — in
  `projects/demo/src/main.ts`. The experimental prefix is gone.
- Component API now uses the modern signal APIs: `input()` for `config` and `value`,
  `output()` for all ten outputs, and signal queries (`viewChild.required` for
  `editorElement`, `viewChild` for `toolbarElement`).
- Unit tests now run on **Vitest** through `@angular/build:unit-test`
  (`runner: "vitest"`, jsdom) instead of a browser-based runner, with coverage
  thresholds of statements 90, branches 80, functions 90, lines 90.
- Lint/format split across **Biome** (`lint`, `format:biome`), **ESLint**
  (`lint:eslint`) and **Prettier** for HTML/SCSS.
- Added `typecheck` and `format:prettier` / `format:prettier:check` workspace scripts
  and wired them into CI (`.github/workflows/ci.yml`).
- `projects/demo` was restructured to the current CLI layout — `app.ts`, `app.html`,
  `app.scss`, `app.config.ts`, `app.routes.ts` — and the demo root component is
  `App`.

### Added

- Spec coverage split into focused suites: `rm-ng-editor.component.spec.ts`,
  `rm-ng-editor.service.spec.ts`, `rm-ng-editor.service-utils.spec.ts`,
  `rm-ng-editor.table.spec.ts`, `rm-ng-editor.configuration.spec.ts`,
  `state-management.spec.ts`, `state-management-cleanup.spec.ts`,
  `media-embeds.spec.ts` and `media-embeds-preview.spec.ts`.
- `projects/rm-ng-editor/src/test-setup.ts`, providing the jsdom shims
  (`document.execCommand`, `ResizeObserver`, `IntersectionObserver`,
  `matchMedia`, …) and a small Jasmine-compatibility layer for the specs.
- Internal `state-management/` and `media-embeds/` modules (not part of the public
  API).
- Documentation refresh across `docs/` and `examples/` to match the real public API.

## [1.0.0] - 2026-07-01

### Added

- Complete rich text editor with all core editing features:
  - **Text Formatting**: Bold, italic, underline, strikethrough
  - **Script Formatting**: Subscript, superscript
  - **Font Controls**: Font family, font size, text color, background color
  - **Document Structure**: Headings (H1-H6), paragraphs, blockquotes, code blocks
  - **Text Alignment**: Left, center, right, justify
  - **Lists**: Ordered and unordered lists with indent/outdent
  - **Editor Controls**: Undo/redo, clear formatting
  - **Keyboard Shortcuts**: Ctrl+B, Ctrl+I, Ctrl+U, Ctrl+Z, Ctrl+Shift+Z
- Angular workspace setup (zoneless) with the Angular CLI
- pnpm package manager configuration
- SCSS styling framework
- Comprehensive demo application
- RmNgEditorService with utility functions:
  - HTML to text conversion
  - Word and character counting
  - Heading extraction
  - Content validation
  - Format conversion (HTML to Markdown)
  - Content sanitization
- High-performance architecture:
  - Angular Signals for reactive state management
  - OnPush change detection strategy
  - Zoneless compatibility
  - Standalone components
- Complete development toolchain:
  - ESLint configuration for code quality
  - Prettier for code formatting
  - TypeScript strict mode
  - Comprehensive documentation


_This changelog follows [Keep a Changelog](https://keepachangelog.com/) format and [Semantic Versioning](https://semver.org/) principles._


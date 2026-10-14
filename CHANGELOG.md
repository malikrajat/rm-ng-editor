# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-10-15


### Changed

- **Upgraded the workspace to Angular 22.** Framework `@angular/*` is now
  `22.0.4`, `@angular/cli` and `@angular/build` are `22.0.5`, and
  `@angular/compiler-cli` is `22.0.4`.
- **TypeScript upgraded to `6.0.3`** with the compiler target staying at
  `ES2022` and `module: preserve`.
- **Build tooling moved to the `@angular/build` builders**: `application`
  (demo), `dev-server`, `ng-packagr` (library) and `unit-test`.
- **Unit tests now run on Vitest** through the `@angular/build:unit-test`
  builder (jsdom environment), replacing the previous Karma setup. Coverage
  thresholds are configured at 90/80/90/90 for
  statements/branches/functions/lines; the last recorded run reports 92.04%
  statements, 81.89% branches and 94.21% functions, so the branch threshold is
  declared intent and is not currently met.
- **Zoneless change detection uses the stable API**
  `provideZonelessChangeDetection()`. The pre-release
  `provideExperimentalZonelessChangeDetection()` API no longer exists and has
  been removed from the demo bootstrap.
- Library and demo code uses the modern signal APIs throughout: signal inputs
  (`input()`), signal outputs (`output()`) and signal queries
  (`viewChild`, `viewChild.required`).
- Demo application uses `provideBrowserGlobalErrorListeners()` and
  `ChangeDetectionStrategy.Eager`.
- Formatting and linting split across Biome (TypeScript/JSON), ESLint and
  Prettier (HTML/SCSS).
- Documentation reviewed end to end and brought in line with the Angular 22
  workspace and the actual exported API.
- **CI verification split into three parallel jobs.** The former `build-test` job
  ran format, lint, typecheck, both builds and both test suites sequentially, so
  the run took the sum of all of them and a lint failure hid whether the build or
  the tests would have passed. `lint`, `build` and `test` are now separate jobs
  that each declare `needs: guard`, so GitHub Actions runs them in parallel and
  reports three independent checks.

### Fixed

- Documentation no longer claims Angular 21 support, no longer references the
  removed `provideExperimentalZonelessChangeDetection()` API, and no longer
  documents APIs, configuration keys or form bindings that the library does not
  actually implement.
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

- Complete rich text editor with all core editing features:
  - **Text Formatting**: Bold, italic, underline, strikethrough
  - **Script Formatting**: Subscript, superscript
  - **Font Controls**: Font family, font size, text color, background color
  - **Document Structure**: Headings (H1-H6), paragraphs, blockquotes, code blocks
  - **Text Alignment**: Left, center, right, justify
  - **Lists**: Ordered and unordered lists with indent/outdent
  - **Editor Controls**: Undo/redo, clear formatting
  - **Keyboard Shortcuts**: Ctrl+B, Ctrl+I, Ctrl+U, Ctrl+Z, Ctrl+Shift+Z
- Angular workspace setup (zoneless)
- pnpm package manager configuration
- SCSS styling framework
- Comprehensive demo application
- `RmNgEditorService` with utility functions:
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
- Test suites covering table operations, the utility service, service helpers,
  configuration, state management and media embeds.
- `CI-BRANCH-POLICY.md` documenting which Git refs may trigger the CI workflow.
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


_This changelog follows [Keep a Changelog](https://keepachangelog.com/) format and [Semantic Versioning](https://semver.org/) principles._


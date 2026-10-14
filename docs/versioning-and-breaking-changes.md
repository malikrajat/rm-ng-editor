# Versioning & Breaking Changes

Semantic versioning policy and migration guides for `rm-ng-editor`.

## Versioning Policy

`rm-ng-editor` follows [Semantic Versioning 2.0.0](https://semver.org/).

### Version Format

```
MAJOR.MINOR.PATCH

Example: 1.2.3
         │ │ └─ Patch: Bug fixes
         │ └─── Minor: New features (backward compatible)
         └───── Major: Breaking changes
```

### Release Types

**Major (1.x.x → 2.x.x)**
- Breaking API changes
- Incompatible behavior changes
- Angular version requirements change
- Requires migration

**Minor (1.1.x → 1.2.x)**
- New features (backward compatible)
- New configuration options
- Performance improvements
- Deprecations (with warnings)

**Patch (1.1.1 → 1.1.2)**
- Bug fixes
- Documentation updates
- Security patches
- Performance optimizations

## Current Version: 1.0.0

**Latest Stable:** 1.0.0  
**Angular Compatibility:** declared peer range `>=16.0.0 <=26.0.0` for `@angular/core` and `@angular/common`; built and tested on Angular 22 (framework 22.0.4, CLI 22.0.5)  
**Release Date:** 2026-07-01

## Breaking Changes Policy

### What Constitutes a Breaking Change?

✅ **Breaking Changes** (Major version bump):
- Removing public APIs
- Changing method signatures
- Changing default behavior
- Minimum Angular version increase
- Removing configuration options
- Changing output event structures

❌ **Not Breaking Changes** (Minor/Patch bump):
- Adding new features
- Adding new configuration options
- Bug fixes
- Performance improvements
- Deprecating (but not removing) features
- Adding new methods to classes

### Deprecation Process

Before removing features:

1. **Deprecation Notice** (Minor version)
   ```typescript
   /**
    * @deprecated Use newMethod() instead. Will be removed in v2.0.0
    */
   oldMethod() {
     console.warn('oldMethod is deprecated');
     this.newMethod();
   }
   ```

2. **Migration Period** (At least 1 major version)
   - Feature remains functional
   - Warning messages in console
   - Documentation updated

3. **Removal** (Next major version)
   - Feature removed
   - Migration guide provided

## Migration Guides

### Future: v1.x → v2.x

*To be determined when v2.0 is planned*

Nothing is finalised yet. Any breaking change will ship with a major version bump and a migration guide in the changelog.

### From Other Editors

**From contenteditable DIVs:**

```typescript
// Before: Plain contenteditable
<div contenteditable="true" #editor></div>

// After: rm-ng-editor
<app-rm-ng-editor
  [config]="config()"
  (valueChange)="onContentChange($event)"
/>
```

**From Angular Forms:**

```typescript
// Before: FormControl with textarea
<textarea [formControl]="contentControl"></textarea>

// After: rm-ng-editor with an explicit [value] + (valueChange) bridge
<app-rm-ng-editor
  [value]="contentControl.value ?? ''"
  (valueChange)="contentControl.setValue($event)"
/>
```

`RmNgEditor` does not implement `ControlValueAccessor`, so `[(ngModel)]`,
`formControlName` and `[formControl]` cannot be placed directly on
`<app-rm-ng-editor>`. The explicit bridge above is the supported pattern. Note
that `[(value)]="content"` does compile — there is a `value` input and a matching
`valueChange` output — but `value` is a one-way signal input, so the explicit
pair is preferred.

## Upgrade Guide

### Checking Current Version

```bash
# Check installed version
pnpm list @codewithrajat/rm-ng-editor

# Check latest available version
pnpm info @codewithrajat/rm-ng-editor version
```

### Upgrading Minor/Patch Versions

```bash
# Update to latest patch (1.0.x)
pnpm update @codewithrajat/rm-ng-editor

# Update to latest minor (1.x.0)
pnpm add @codewithrajat/rm-ng-editor@^1
```

### Upgrading Major Versions

```bash
# Update to latest version
pnpm add @codewithrajat/rm-ng-editor@latest

# Or specific major version
pnpm add @codewithrajat/rm-ng-editor@2.0.0
```

After upgrading:

1. **Read Release Notes**
   - Check the [changelog](./changelog.md)
   - Review breaking changes
   - Check deprecation notices

2. **Update Code**
   - Fix API changes
   - Update tests
   - Verify behavior

3. **Test Thoroughly**
   - Run unit tests
   - Test in development
   - UAT before production

## Compatibility  Matrix

### Library Version vs Angular Version

| rm-ng-editor | Angular (declared peer range) | TypeScript | Node.js | Status |
|--------------|-------------------------------|------------|---------|:------:|
| **1.0.0** | `>=16.0.0 <=26.0.0` (built and tested on 22.0.4) | 5.9+ (workspace: 6.0.3) | 22+ | ✅ Current |
| **future 2.x** | TBD (planned) | TBD | 22+ | 🔮 Planned |

### Support Timeline

| Version | Released | Support Until | Status |
|---------|----------|---------------|--------|
| **1.0.0** | Jul 2026 | Jul 2027 (12 months) | ✅ Active |
| **future 2.x** | TBD | TBD | 🔮 Planned |

## Release Schedule

### Regular Releases

- **Patch releases**: As needed for bug fixes
- **Minor releases**: Monthly (features, improvements)
- **Major releases**: Yearly (if breaking changes needed)

### Security Releases

- **Critical**: Within 24 hours
- **High**: Within 1 week
- **Medium**: Next regular release
- **Low**: Included in regular releases

## Changelog Format

Our changelog follows [Keep a Changelog](https://keepachangelog.com/):

```markdown
## [1.1.0] - 2026-02-01

### Added
- New feature description

### Changed
- Changed behavior description

### Deprecated
- Feature to be removed in future

### Removed
- Removed feature (breaking change)

### Fixed
- Bug fix description

### Security
- Security fix description
```

## Breaking Change Notification

We notify users of breaking changes through:

1. **[Changelog](./changelog.md)** - Detailed list
2. **GitHub Releases** - Release notes
3. **npm publish** - Package updates
4. **Console Warnings** - Deprecation notices

## Backward Compatibility

### What We Guarantee

✅ **Guaranteed:**
- Patch versions are 100% backward compatible
- Minor versions are backward compatible
- Deprecation warnings before removal
- Migration guides for major versions

❌ **Not Guaranteed:**
- Internal implementation details
- Undocumented behavior
- Private APIs
- Development dependencies

### Experimental Features

Features marked as experimental may change without major version bump:

```typescript
/**
 * @experimental This feature is experimental and may change
 */
experimentalFeature() {}
```

## Version Support Policy

### Active Support

- Latest major version receives all updates
- Critical bug fixes
- Security patches
- New features

### Maintenance Support  

- Previous major version receives:
  - Critical security fixes only
  - No new features
  - Limited bug fixes

### End of Life

- Two versions back receives:
  - No updates
  - No support
  - Upgrade recommended

## Dependency Updates

### Angular Version Policy

- The published peer range is `>=16.0.0 <=26.0.0` for `@angular/core` and `@angular/common`
- The workspace builds and tests against Angular 22 (framework 22.0.4, CLI 22.0.5)
- The range is widened only after a version has been verified

### TypeScript Version Policy

- Support the TypeScript versions Angular supports
- The workspace compiles with TypeScript 6.0.3 (Angular 22 requires 5.9+)
- Drop unsupported versions

## Communication Channels

Stay updated on version changes:

- **GitHub Releases**: https://github.com/malikrajat/rm-ng-editor/releases
- **npm**: https://www.npmjs.com/package/@codewithrajat/rm-ng-editor
- **[Changelog](./changelog.md)**: In the repository
- **GitHub Discussions**: For questions

## Frequently Asked Questions

**Q: How long are major versions supported?**

A: Each major version receives 12 months of full support, followed by 6 months of security-only updates.

**Q: Will you support older Angular versions?**

A: The declared peer range already covers Angular 16 through 26 for `@angular/core` and `@angular/common`. The library is built and tested on Angular 22, and it relies on signal inputs/outputs (`input()` / `output()`) and `viewChild.required`, which require Angular 17.2 or newer — so 17.2 is the practical floor.

**Q: How can I stay on an older version?**

A: Lock your version in `package.json`:

```json
{
  "dependencies": {
    "@codewithrajat/rm-ng-editor": "1.0.0"
  }
}
```

**Q: What if a breaking change affects my code?**

A: Check the migration guide in the [changelog](./changelog.md). We provide detailed instructions for all breaking changes.

**Q: Can I request a feature to stay compatible?**

A: Yes! Open a GitHub issue to discuss. We consider backward compatibility seriously.

## Version Upgrade Checklist

Before upgrading to a new major version:

- [ ] Read the [changelog](./changelog.md) thoroughly
- [ ] Check breaking changes section
- [ ] Review migration guide
- [ ] Update code for API changes
- [ ] Update tests
- [ ] Test in development environment
- [ ] Run full test suite
- [ ] User acceptance testing
- [ ] Deploy to staging
- [ ] Monitor for issues
- [ ] Deploy to production

## Summary

- ✅ Semantic versioning (MAJOR.MINOR.PATCH)
- ✅ Deprecation warnings before removal
- ✅ 12-month support for major versions
- ✅ Migration guides for breaking changes
- ✅ Regular security updates
- ✅ Clear communication of changes

---

**Next Steps:**
- [Changelog](./changelog.md)
- [Peer Dependencies](./peer-dependencies.md)
- [Installation Guide](./installation.md)

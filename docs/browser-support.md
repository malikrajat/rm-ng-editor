# Browser Support

Comprehensive browser compatibility information for `rm-ng-editor`.

## Summary

| Browser | Minimum Version | Recommended | Status |
|---------|----------------|-------------|--------|
| Chrome | 119+ | Latest | ✅ Full Support |
| Firefox | 120+ | Latest | ✅ Full Support |
| Safari | 17+ | Latest | ✅ Full Support |
| Edge | 119+ | Latest | ✅ Full Support |
| Opera | 105+ | Latest | ✅ Full Support |
| IE 11 | - | - | ❌ Not Supported |

## Mobile Support

| Platform | Minimum Version | Status |
|----------|----------------|--------|
| **iOS Safari** | 17+ | ✅ Full Support |
| **Android Chrome** | 119+ | ✅ Full Support |
| **Android Firefox** | 120+ | ✅ Full Support |
| **Samsung Internet** | 23+ | ✅ Supported |

## Feature Compatibility Matrix

### Core Editor Features

| Feature | Chrome | Firefox | Safari | Edge | Notes |
|---------|:------:|:-------:|:------:|:----:|-------|
| **contenteditable** | 1+ | 3+ | 3.1+ | 12+ | Universal support |
| **document.execCommand()** | 1+ | 9+ | 1.3+ | 12+ | Universal support |
| **Selection API** | 1+ | 1+ | 1.3+ | 12+ | Universal support |
| **Range API** | 1+ | 1+ | 1.3+ | 12+ | Universal support |

### Modern Web APIs

| API | Chrome | Firefox | Safari | Edge | Fallback Strategy |
|-----|:------:|:-------:|:------:|:----:|-------------------|
| **MutationObserver** | 26+ | 14+ | 7+ | 12+ | Polling fallback |
| **ResizeObserver** | 64+ | 69+ | 13.1+ | 79+ | Manual resize detection |
| **IntersectionObserver** | 51+ | 55+ | 12.1+ | 15+ | Optional feature |
| **requestAnimationFrame** | 24+ | 23+ | 6.1+ | 12+ | setTimeout fallback |

### Angular 22 / ES2022 Requirements

The library is built for Angular 22 and compiled to the `ES2022` target set in the
workspace `tsconfig.json`.

| Feature | Chrome | Firefox | Safari | Edge | Required For |
|---------|:------:|:-------:|:------:|:----:|--------------|
| **ES2022** | 94+ | 93+ | 16+ | 94+ | Language features |
| **Signal-based State** | 119+ | 120+ | 17+ | 119+ | Reactivity |
| **Zoneless Detection** | 119+ | 120+ | 17+ | 119+ | Performance |

### CSS Features

| Feature | Chrome | Firefox | Safari | Edge | Fallback |
|---------|:------:|:-------:|:------:|:----:|----------|
| **Flexbox** | 29+ | 28+ | 9+ | 12+ | Table layout |
| **CSS Grid** | 57+ | 52+ | 10.1+ | 16+ | Flexbox |
| **CSS Custom Properties** | 49+ | 31+ | 9.1+ | 15+ | SCSS variables |
| **CSS Transforms** | 36+ | 16+ | 9+ | 12+ | Static layout |

## Browser Testing

The library **targets** the browsers listed above. The repository does not run a
browser matrix: CI (`.github/workflows/ci.yml`) runs on Node.js 22 and executes
format checks, lint, type-check, the library and demo builds, and the Vitest unit
suite (jsdom) — no Chrome/Firefox/Safari/Edge jobs exist.

The lists below are therefore the environments the library is expected to work in,
not an automated test matrix:

### Desktop

- ✅ Chrome 119+ (latest)
- ✅ Firefox 120+ (latest)
- ✅ Safari 17+ (latest)
- ✅ Edge 119+ (latest)

### Mobile

- ✅ iOS 17+ (Safari, Chrome)
- ✅ Android 12+ (Chrome, Firefox)
- ✅ Samsung Internet 23+

## Known Limitations

### Internet Explorer 11

❌ **Not Supported**

Reasons:
- Does not meet the Angular 22 / ES2022 baseline
- No Signal API
- No modern Observer APIs
- Security vulnerabilities

### Older Browsers

| Browser Version | Status | Reason |
|-----------------|:------:|--------|
| Chrome < 119 | ❌ | Does not meet the Angular 22 / ES2022 baseline |
| Firefox < 120 | ❌ | Does not meet the Angular 22 / ES2022 baseline |
| Safari < 17 | ❌ | Does not meet the Angular 22 / ES2022 baseline |
| Edge < 119 | ❌ | Does not meet the Angular 22 / ES2022 baseline |

## Polyfills

### Not Required

`rm-ng-editor` does not require polyfills for modern browsers (as listed above).

### For Older Browsers (Unsupported)

If you absolutely need support for older browsers (not recommended), you would need:

```typescript
// main.ts - DO NOT USE, provided for reference only
import 'core-js/es/array';
import 'core-js/es/object';
import 'core-js/es/promise';
import 'whatwg-fetch';
```

⚠️ **Warning**: Even with polyfills, Angular 22 requirements cannot be met. Older
browsers are outside the supported baseline and are not tested.

## Progressive Enhancement

### Graceful Degradation

The editor degrades gracefully when features are unavailable:

```typescript
// ResizeObserver fallback
if (typeof ResizeObserver === 'undefined') {
  console.warn('ResizeObserver not supported');
  // Use window.resize event instead
}

// IntersectionObserver fallback
if (typeof IntersectionObserver === 'undefined') {
  // Visibility features disabled
  console.warn('IntersectionObserver not supported');
}
```

### Feature Detection

Check before using features:

```typescript
// Check for clipboard API
if (navigator.clipboard) {
  await navigator.clipboard.writeText(content);
} else {
  // Fallback to execCommand
  document.execCommand('copy');
}
```

## Performance by Browser

### Desktop Performance

| Browser | Initialization | Rendering | Memory Usage |
|---------|:-------------:|:---------:|:------------:|
| **Chrome** | ⚡ Excellent | ⚡ Excellent | ⚡ Excellent |
| **Firefox** | ⚡ Excellent | ⚡ Excellent | ✅ Good |
| **Safari** | ✅ Good | ✅ Good | ⚡ Excellent |
| **Edge** | ⚡ Excellent | ⚡ Excellent | ⚡ Excellent |

### Mobile Performance

| Platform | Initialization | Rendering | Touch Support |
|----------|:-------------:|:---------:|:-------------:|
| **iOS 17+** | ✅ Good | ✅ Good | ⚡ Excellent |
| **Android 12+** | ✅ Good | ✅ Good | ✅ Good |

## Accessibility (ARIA) Support

| Browser | Screen Reader | Keyboard Nav | ARIA Labels |
|---------|:-------------:|:------------:|:-----------:|
| **Chrome** | ✅ NVDA/JAWS | ✅ Full | ✅ Full |
| **Firefox** | ✅ NVDA/JAWS | ✅ Full | ✅ Full |
| **Safari** | ✅ VoiceOver | ✅ Full | ✅ Full |
| **Edge** | ✅ Narrator | ✅ Full | ✅ Full |

## Mobile Specific Features

### Touch Support

- ✅ Touch events for all interactions
- ✅ Pinch to zoom (if enabled)
- ✅ Long press context menu
- ✅ Swipe gestures for undo/redo

### Virtual Keyboard

- ✅ Keyboard appears on focus
- ✅ Toolbar stays visible
- ✅ Auto-scroll to cursor
- ✅ Smart spacing

### Responsive Design

- ✅ Mobile-optimized toolbar
- ✅ Touch-friendly buttons (44x44px minimum)
- ✅ Responsive modals
- ✅ Adaptive font sizes

## Testing Coverage

### Automated Tests

The repository's automated suite is a **unit** suite, not a browser matrix. CI runs
`pnpm run test:lib -- --watch=false` and `pnpm run test:demo -- --watch=false`, which
execute the library and demo specs on Vitest through the
`@angular/build:unit-test` builder with a jsdom environment (library setup file
`projects/rm-ng-editor/src/test-setup.ts`). There are no Chrome, Firefox, Safari or
Edge jobs in `.github/workflows/ci.yml`.

### Manual Verification

Because no browser matrix is automated, browser-specific behaviour should be verified
manually. The recommended targets match the summary table above:

- macOS (Safari, Chrome, Firefox, Edge)
- Windows 11 (Chrome, Firefox, Edge)
- iOS 17+ (Safari, Chrome)
- Android 12+ (Chrome, Firefox)

## Reporting Browser Issues

If you encounter browser-specific issues:

1. Check if your browser version meets minimum requirements
2. Clear browser cache and cookies
3. Disable browser extensions
4. Test in incognito/private mode
5. Check the [Troubleshooting Guide](./troubleshooting.md)
6. Report issue with:
   - Browser name and version
   - Operating system
   - Console errors
   - Steps to reproduce

## Future Browser Support

The minimum versions in the summary table are driven by the Angular 22 toolchain and
the `ES2022` output target, so they advance when the Angular baseline advances. This
library does not publish a separate deprecation schedule.

## Next Steps

- **[Troubleshooting](./troubleshooting.md)**: Resolve browser issues
- **[FAQ](./faq.md)**: Common browser questions
- **[Peer Dependencies](./peer-dependencies.md)**: Version requirements

---

**Browser Support Doc Version**: 1.0  
**Last Updated**: July 2026

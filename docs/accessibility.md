# Accessibility

What `rm-ng-editor` implements for keyboard, screen-reader and low-vision users,
what it does **not** implement, and how to close the remaining gaps in your own
application.

Everything on this page was verified against the library source
(`projects/rm-ng-editor/src/lib/rm-ng-editor.ts`,
`rm-ng-editor.component.html`, `rm-ng-editor.component.scss`). Where a behaviour
is missing or only partial, it is listed as such rather than glossed over.

## Status

| Claim | Status |
|-------|--------|
| ARIA roles and labels on toolbar, editable area and both dialogs | ✅ Implemented |
| Keyboard operation of every toolbar control | ✅ Implemented (native `button` / `select` / `input`) |
| Documented keyboard shortcut set (formatting, alignment, lists, tables, headings) | ✅ Implemented |
| Focus management (Escape closes a dialog, otherwise focuses the editor) | ✅ Implemented |
| Visible focus indicators | ✅ Implemented for most controls |
| `prefers-reduced-motion` and `prefers-contrast: high` support | ✅ Implemented |
| Formal WCAG 2.2 audit, VPAT or ACR | ❌ Not performed |
| Automated accessibility testing (axe / jest-axe / Lighthouse CI) | ❌ Not present |
| Toggle state exposed to assistive technology (`aria-pressed`) | ❌ Not implemented |
| Focus trap / initial focus in the HTML-source and shortcuts dialogs | ❌ Not implemented |
| Live-region announcements for word count, validation errors, spell check | ❌ Not implemented |

**No formal WCAG audit has been performed or published for this library.** Treat the
"implemented" rows above as the baseline the code actually ships, and run your own
accessibility testing against your configuration and content before making a
conformance claim.

## ARIA in the rendered DOM

Rendered structure (see [Project Structure](./project-structure.md) for the source layout):

```html
<div class="ng-rm-editor-wrapper" data-theme="light">
  <div class="toolbar" id="editor-toolbar" role="toolbar"
       aria-label="Rich text editor toolbar" aria-controls="editor"> … </div>

  <div class="editor-content" contenteditable="true" role="textbox"
       aria-label="Rich text editor content" aria-multiline="true" tabindex="0"> … </div>

  <div class="validation-stats"> … </div>          <!-- when validation stats are enabled -->
  <div class="spell-check-suggestions"> … </div>   <!-- when spell check produces results -->
  <div class="validation-errors"> … </div>         <!-- when the content is invalid -->

  <div class="html-edit-modal" role="dialog" aria-modal="true"
       aria-labelledby="html-edit-title"> … </div>   <!-- when HTML edit mode is open -->

  <div class="shortcuts-modal" role="dialog" aria-modal="true"
       aria-labelledby="shortcuts-title"> … </div>   <!-- when the shortcuts dialog is open -->
</div>
```

### Attribute reference

| Element | ARIA / accessibility attributes |
|---------|--------------------------------|
| `.toolbar` | `role="toolbar"`, `aria-label="Rich text editor toolbar"`, `aria-controls="editor"`, `id="editor-toolbar"` |
| `.editor-content` | `contenteditable="true"`, `role="textbox"`, `aria-label="Rich text editor content"`, `aria-multiline="true"`, `[attr.tabindex]="disabled() ? -1 : 0"` |
| HTML-source dialog | `role="dialog"`, `aria-modal="true"`, `aria-labelledby="html-edit-title"` → `<h3 id="html-edit-title">Edit HTML Source</h3>` |
| HTML-source `<textarea>` | `aria-label="HTML source code"`, `placeholder="Enter HTML code here..."` |
| HTML-source dialog buttons | `aria-label="Close HTML editor"`, `aria-label="Apply HTML changes to editor"`, `aria-label="Cancel HTML editing"` |
| Shortcuts dialog | `role="dialog"`, `aria-modal="true"`, `aria-labelledby="shortcuts-title"` → `<h3 id="shortcuts-title">Keyboard Shortcuts</h3>` |
| Shortcuts dialog buttons | `aria-label="Close shortcuts dialog"` (the ✕ button and the Close button) |
| "Edit HTML Source" toolbar button | `aria-label="Edit HTML source code directly"` plus `title` |
| "Keyboard Shortcuts" toolbar button | `aria-label="Show available keyboard shortcuts"` plus `title` |
| All other toolbar buttons, `<select>`s and the colour input | `title` only (Bold, Italic, Align Left, Insert Table, …) |
| Table row/column buttons | native `disabled` attribute while no table is selected (`[disabled]="!selectedTable()"`) |

`data-theme` (`light` / `dark` / `auto`) is a data attribute, not an ARIA attribute;
theme is not announced to assistive technology. The wrapper also carries
`full-screen`, `distraction-free`, `disabled` and `theme-*` classes.

## Keyboard support

### Shortcut reference

`Ctrl` is `⌘` on macOS — the handler accepts `event.ctrlKey || event.metaKey`.

The listener is bound to the **editable area** (`(keydown)="onKeyDown($event)"` on
`.editor-content`), so the editor must have focus for these shortcuts to fire. They
are not registered globally.

| Shortcut | Action |
|----------|--------|
| `Ctrl+B` / `Ctrl+I` / `Ctrl+U` | Bold / Italic / Underline |
| `Ctrl+Shift+S` | Strikethrough |
| `Ctrl+=` / `Ctrl+Shift+=` | Subscript / Superscript |
| `Ctrl+Shift+L` / `E` / `R` / `J` | Align left / centre / right / justify |
| `Ctrl+Shift+8` / `Ctrl+Shift+7` | Bullet list / numbered list |
| `Ctrl+K` | Insert link |
| `Ctrl+]` / `Ctrl+[` | Indent / outdent |
| `Ctrl+Shift+T` | Insert table |
| `Ctrl+Z` / `Ctrl+Shift+Z` / `Ctrl+Y` | Undo / redo / redo |
| `Ctrl+\` | Clear formatting |
| `Ctrl+Shift+.` / `Ctrl+Shift+,` | Increase / decrease font size |
| `Ctrl+Enter` | Insert page break |
| `Ctrl+Shift+H` | Toggle HTML source edit |
| `Alt+1` … `Alt+6` / `Alt+0` | Heading 1…6 / paragraph |
| `F1` | Open the keyboard-shortcuts dialog |
| `Escape` | Close the open dialog, otherwise focus the editable area |
| `Escape` (in full screen) | Exit full screen, when `fullScreen.exitOnEscape` is not `false` (document-level listener) |

The dialog opened with `F1` or the toolbar button lists a shorter subset of this
table (formatting, alignment, lists and structure, actions) — the full list above is
the authoritative one.

### How shortcuts are gated

- `Ctrl`-based formatting shortcuts call `isFeatureEnabled(...)` first, which reads the
  matching `toolbarConfig` flag (for example `Ctrl+B` requires `showBold !== false`).
  Flipping a flag to `false` also removes its keyboard shortcut. The exceptions are
  `Ctrl+Shift+.` / `Ctrl+Shift+,` (font size) and `Ctrl+Enter` (page break), which are not
  feature-gated.
- `Alt+1` … `Alt+0` call `setHeadingByTag()` **without** a feature check, so heading
  shortcuts keep working even when `showHeadings` is `false`.
- `F1` is handled before the feature checks, so it opens the shortcuts dialog even when
  `showKeyboardShortcuts` is `false` (that flag only hides the toolbar button).
- `Ctrl+Shift+H` is also handled by the accessibility handler before the gated branch,
  so it opens the HTML-source dialog even when `showHtmlEdit` is `false`.
- When `disabled` is `true`, `onKeyDown()` calls `event.preventDefault()` and returns,
  so every shortcut is inert while the editor is disabled.

### Tab and focus order

- The editable area is reachable with `Tab` (`tabindex="0"`), or removed from the tab
  order when disabled (`tabindex="-1"`).
- `Tab` inside the editor is deliberately **not** intercepted — the handler's comment
  reads "Allow default tab behavior for accessibility". `Tab` therefore moves focus out
  of the editor; it never inserts a tab character or indents content.
- Toolbar controls are real `<button>`, `<select>` and `<input type="color">` elements,
  so they are reachable and operable with `Tab`, arrow keys, `Enter`/`Space` and the
  browser's native select behaviour.

### Native browser dialogs

Link, image, video, audio and embed insertion use `window.prompt()`; link targets and a
few confirmations use `window.confirm()`; errors use `window.alert()`. For example,
`insertImage()` prompts for the image URL **and** for alt text (defaulting to
`"Image"`), and `embedYouTube()` prompts for the URL, width and height.

That means:

- ✅ The prompts are owned by the browser, so they are keyboard-operable and announced by
  screen readers without any extra work.
- ⚠️ They block the page, cannot be styled or themed, cannot be validated before the user
  submits, and interrupt the editing flow. Author a custom insert UI and call the public
  methods (`insertLink()`, `insertImage()`, `execCommand(...)`) directly if that matters
  for your product.
- ⚠️ The alt-text prompt shows a default of `"Image"` when left empty, which is a poor
  accessible name for a content image. Prefer your own UI, or verify authored alt text
  before publishing.

## Focus visibility, motion and contrast

| Concern | Implementation |
|---------|----------------|
| Toolbar buttons / dialog buttons | `.toolbar-btn:focus-visible`, `.btn:focus-visible` → `outline: 2px solid #007bff; outline-offset: 2px` |
| Toolbar `<select>`s | `.toolbar-select:focus` → `outline: 2px solid #007bff; outline-offset: -2px` |
| Editable area | `.editor-content:focus` → `background-color: #fafafa` (light) and `box-shadow: 0 0 0 2px #0e639c` (dark / full screen) |
| HTML-source textarea | `.html-textarea:focus` → `outline: none; border-color: #007bff; box-shadow: 0 0 0 2px rgba(0,123,255,.25)` |
| Colour input | no custom style — relies on the browser's default focus ring |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` removes transitions on `.toolbar-btn`, `.suggestion-btn`, `.ignore-btn` and the full-screen animation |
| High contrast | `@media (prefers-contrast: high)` adds 2px borders to the wrapper, 1px borders to toolbar buttons and a solid 2px focus outline |
| Dark theme | `data-theme="dark"` plus `theme-auto` resolved through `window.matchMedia('(prefers-color-scheme: dark)')` |
| Zoom / reflow | No zoom blocking and no fixed-height traps in the toolbar; note that sizes are in `px`, so text scaling is left to browser zoom |

The default palette (including the `#007bff` focus colour) is fixed by the component
stylesheet and has **not** been contrast-audited. Verify it against your background, or
override the relevant selectors in your own global stylesheet.

## Screen-reader notes

- The editable area is a `<div>` with `role="textbox"` and `aria-multiline="true"`. It is
  announced as a multi-line text field labelled "Rich text editor content". Screen readers
  enter a forms/browse mode depending on the reader; NVDA and JAWS users generally need
  "focus mode" (or `Insert+Space`) to type.
- The placeholder (`placeholder` config, default `Start typing...`) is rendered as CSS
  generated content (`.editor-content:empty::before { content: attr(data-placeholder) }`).
  It is therefore **not** an accessible name or description and may not be announced.
- The validation stats row (words, characters, reading time) and the spell-check
  suggestion panel are plain `<div>`/`<span>` elements with no live-region semantics, so
  changes are not announced. Use the `(wordCountChange)` and `(spellCheckResults)` outputs
  to build your own `aria-live` region (recipe below).
- The `(stateChange)` output gives you the formatting state, but the toolbar does not
  expose it: active buttons are marked only with a CSS class (`[class.active]`), with no
  `aria-pressed`. A screen reader cannot tell whether bold is on.
- `validationConfig.spellCheck.highlightErrors` is accepted, and `.spelling-error` /
  `.grammar-error` styles exist in the component stylesheet, but no code applies those
  classes to the content. Misspellings surface only in the suggestion panel, and the
  built-in dictionary is a small demo list of common misspellings rather than a real
  dictionary — do not present it as an accessibility feature.

## Known gaps and workarounds

| Gap | Impact | Workaround |
|-----|--------|-----------|
| Only the HTML-edit and shortcuts buttons have explicit `aria-label`; other toolbar buttons expose an icon glyph as their text content, with `title` as the name fallback | Screen readers may announce an unhelpful symbol name | Mirror `title` into `aria-label` (recipe 1) |
| No `aria-pressed` on toggle buttons | Formatting state is invisible to assistive tech | Sync `(stateChange)` to `aria-pressed` (recipe 2) |
| `aria-controls="editor"` on the toolbar references an element with that `id`, but the editable `<div>` has no `id` (only a template reference) | `aria-controls` is a dangling reference and is ignored | Set `id="editor"` on the editable element yourself, or ignore the attribute |
| Dialogs (`role="dialog"`, `aria-modal="true"`) are rendered at the end of the widget with no initial focus move, no focus trap and no focus restore on close | Keyboard focus can leave a modal; the reader is not placed in it | Move focus into the dialog on open and restore it on close in app code (recipe 3) |
| `contenteditable` stays `"true"` when `disabled` is set; disabled relies on `.disabled { pointer-events: none }`, `tabindex="-1"` and `preventDefault()` in `onKeyDown` | The content stays programmatically focusable and technically editable | Wrap the editor in a `<fieldset disabled>`-equivalent you control, or avoid `disabled` for non-editable content and render read-only HTML instead |
| Word count, validation errors and spell-check results are visual only | Assistive-tech users get no status feedback | Announce through `aria-live` (recipe 4) |
| `<select>` and colour controls are labelled with `title` only, no `<label>`/`aria-label` | Names fall back to `title`; some tools report "unlabelled combobox" | Same as recipe 1 |

## App-side recipes

### Recipe 1 — Give every toolbar control an accessible name

Toolbar tooltips already describe each control (`title="Bold (Ctrl+B)"`). Promote them to
accessible names after the editor renders. The `MutationObserver` is needed because the
toolbar is re-rendered when `toolbarConfig` changes.

```typescript
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  viewChild,
} from '@angular/core';
import { EditorConfig, RmNgEditor } from '@codewithrajat/rm-ng-editor';

@Component({
  selector: 'app-article-editor',
  standalone: true,
  imports: [RmNgEditor],
  template: `
    <h2 id="article-heading">Article body</h2>
    <section aria-labelledby="article-heading">
      <app-rm-ng-editor #host [config]="config" />
    </section>
  `,
})
export class ArticleEditorComponent implements AfterViewInit, OnDestroy {
  readonly config: EditorConfig = {
    placeholder: 'Write the article…',
    height: '400px',
    showAccessibility: true, // keeps the HTML-source and shortcut buttons
  };

  private readonly hostRef = viewChild.required<ElementRef<HTMLElement>>('host', {
    read: ElementRef,
  });
  private toolbarObserver?: MutationObserver;

  ngAfterViewInit(): void {
    const toolbar = this.hostRef().nativeElement.querySelector('.toolbar');
    if (!toolbar) return;

    this.applyAccessibleNames(toolbar);
    this.toolbarObserver = new MutationObserver(() =>
      this.applyAccessibleNames(toolbar)
    );
    this.toolbarObserver.observe(toolbar, { childList: true, subtree: true });
  }

  ngOnDestroy(): void {
    this.toolbarObserver?.disconnect();
  }

  private applyAccessibleNames(toolbar: Element): void {
    toolbar.querySelectorAll<HTMLElement>('[title]').forEach(element => {
      if (element.hasAttribute('aria-label')) return;
      const title = element.getAttribute('title');
      if (title) element.setAttribute('aria-label', title);
    });
  }
}
```

### Recipe 2 — Expose toggle state (optional)

If your users rely on assistive technology to confirm formatting, mirror
`(stateChange)` onto the matching buttons:

```typescript
import { signal } from '@angular/core';
import { EditorState } from '@codewithrajat/rm-ng-editor';

readonly state = signal<EditorState | null>(null);

// template: <app-rm-ng-editor #host [config]="config" (stateChange)="state.set($event)" />

private syncPressedState(toolbar: Element): void {
  const state = this.state();
  if (!state) return;

  const pressed: Record<string, boolean> = {
    Bold: state.bold,
    Italic: state.italic,
    Underline: state.underline,
    Strikethrough: state.strikethrough,
  };

  toolbar.querySelectorAll<HTMLButtonElement>('button[title]').forEach(button => {
    const key = Object.keys(pressed).find(name =>
      button.title.startsWith(name)
    );
    if (key) button.setAttribute('aria-pressed', String(pressed[key]));
  });
}
```

Call `syncPressedState()` from the same observer callback as recipe 1. This is app-side
decoration only — the library's own `active` class remains the visual source of truth.

### Recipe 3 — Manage focus for the two dialogs

The dialogs render inside `.ng-rm-editor-wrapper` and are not focus-managed. Detect them
with an observer on the wrapper, move focus to the first control, and restore focus to the
previously focused element when they close:

```typescript
private lastFocused: HTMLElement | null = null;

private watchDialogs(wrapper: HTMLElement): void {
  new MutationObserver(() => {
    const dialog = wrapper.querySelector<HTMLElement>('[role="dialog"]');

    if (dialog && !dialog.contains(document.activeElement)) {
      this.lastFocused ??= document.activeElement as HTMLElement;
      dialog
        .querySelector<HTMLElement>('textarea, button, [href], input, select')
        ?.focus();
    }

    if (!dialog && this.lastFocused) {
      this.lastFocused.focus();
      this.lastFocused = null;
    }
  }).observe(wrapper, { childList: true, subtree: true });
}
```

A full focus trap (cycling `Tab` within the dialog while it is open) has to be added by
your application as well; the library only closes the dialog on `Escape`.

### Recipe 4 — Announce word count and validation

Render a permanent (always-present) live region and feed it from the debounced
`(wordCountChange)` output. Announce on blur rather than on every keystroke if the
chatter is distracting:

```typescript
import { computed, signal } from '@angular/core';
import { WordCountStats } from '@codewithrajat/rm-ng-editor';

readonly stats = signal<WordCountStats | null>(null);

readonly statsAnnouncement = computed(() => {
  const stats = this.stats();
  return stats ? `${stats.words} words, ${stats.characters} characters` : '';
});
```

```html
<app-rm-ng-editor [config]="config" (wordCountChange)="stats.set($event)" />

<p class="visually-hidden" aria-live="polite" aria-atomic="true">
  {{ statsAnnouncement() }}
</p>
```

```scss
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}
```

Use the same pattern with `(spellCheckResults)` for spelling feedback, and announce
validation failures from `getValidationErrors()` or the `(stateChange)` output.

### Recipe 5 — Content you publish

- Encourage authors to apply real heading levels (`Alt+1` … `Alt+6`, or the headings
  select) instead of bold text.
- Always supply alt text for images. The library prompts for it, but defaults an empty
  answer to `"Image"`.
- Run user-supplied HTML through `RmNgEditorService.sanitizeHtml()` before rendering it
  outside the editor; see [Core Concepts](./core-concepts.md) and
  [Best Practices](./best-practices.md).

## Testing

### What the repository covers today

The Vitest suite has no accessibility assertions beyond one behavioural spec,
`should handle accessibility shortcuts` in
`projects/rm-ng-editor/src/lib/rm-ng-editor.component.spec.ts`, which checks `F1`,
`Escape` and `Ctrl+Shift+H`. There is no axe/jest-axe integration, no rendered-DOM
ARIA assertions, and no browser matrix in `.github/workflows/ci.yml`.

### Recommended manual pass

1. **Keyboard only** — reach the toolbar, the editable area and both dialogs with `Tab`;
   operate every control with `Enter`/`Space`/arrows; confirm the focus indicator is
   always visible; confirm `Escape` closes each dialog and returns focus.
2. **Screen reader** — NVDA + Firefox, JAWS + Chrome, VoiceOver + Safari (macOS/iOS).
   Check that the toolbar and editor are announced with their names, that the dialogs are
   announced as dialogs, and that formatting state is discoverable (expected to fail until
   recipe 2 is applied).
3. **Zoom / reflow** — 200% browser zoom and 320 px viewport width; the wrapping toolbar
   should stay operable.
4. **Preferences** — `prefers-reduced-motion: reduce` and `prefers-contrast: high`.
5. **Automated sweep** — axe DevTools or Lighthouse on a page that mounts the editor,
   with your own configuration, to catch contrast and labelling issues in *your* theme.

## WCAG 2.2 mapping (indicative)

Honest status of the criteria an editor widget typically affects. Re-verify against your
own configuration; this is not a conformance statement.

| Criterion | Status | Notes |
|-----------|--------|-------|
| 1.3.1 Info and Relationships | Partial | `toolbar`, `textbox` and `dialog` roles are present; toolbar groups are unlabelled and there is no programmatic link to the page's own heading |
| 1.4.1 Use of Colour | Partial | The active-button state is colour-only (no `aria-pressed`, no icon change) |
| 1.4.3 Contrast (Minimum) | Not audited | Default palette is fixed in the component stylesheet |
| 1.4.11 Non-text Contrast | Not audited | The `#007bff` focus outline meets 3:1 against the default light surface; verify custom themes |
| 1.4.13 Content on Hover or Focus | Not applicable | Only native `title` tooltips, which are dismissable/hoverable by browser behaviour |
| 2.1.1 Keyboard | Partial | All controls are native and keyboard-operable; dialogs are not focus-trapped |
| 2.1.2 No Keyboard Trap | Supported | `Tab` is never intercepted inside the editor |
| 2.4.3 Focus Order | Partial | DOM order matches visual order in the toolbar; opening a dialog does not move focus |
| 2.4.6 Headings and Labels | Partial | Labels exist as `title`/`aria-label`; some controls have no dedicated label element |
| 2.4.7 Focus Visible | Supported | Explicit `:focus-visible` / `:focus` styles for buttons, selects, the editor and the source textarea |
| 2.5.3 Label in Name | Partial | Accessible names come from icon glyphs and `title`; apply recipe 1 to make them descriptive |
| 4.1.2 Name, Role, Value | Partial | Names and roles are present; toggle values (`aria-pressed`) are not exposed and `aria-controls` has no target |
| 4.1.3 Status Messages | Not addressed | Word count, validation and spell-check output are not announced |

## Next Steps

- **[Browser Support](./browser-support.md)**: screen-reader and browser combinations
- **[Best Practices](./best-practices.md)**: sanitising and rendering authored content
- **[API Reference](./api-reference.md)**: `EditorState`, `WordCountStats` and the outputs used above
- **[Advanced Configuration](./advanced-configuration.md)**: toolbar flags referenced on this page

---

**Accessibility Doc Version**: 1.0  
**Last Updated**: July 2026

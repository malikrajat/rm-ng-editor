# Form Integration

Integrating `rm-ng-editor` with Angular Reactive Forms.

## What This Demonstrates

- Bridging the editor to a `FormControl` by hand
- Form validation
- Accessing editor value from form
- Setting editor value programmatically

## When to Use This

- Building forms with rich text input
- Need form validation
- Submitting editor content to backend
- Integration with existing form systems

## APIs Used

- `RmNgEditor` - Editor component
- `value` input - Set editor content
- `valueChange` output - Get editor content
- Angular `ReactiveFormsModule`
- `FormControl`, `FormGroup`

## Code

See [form-integration.ts](./form-integration.ts)

The source imports from `rm-ng-editor`, which resolves inside this workspace. In your
own application, import from the published package:

```typescript
import { RmNgEditor, EditorConfig } from '@codewithrajat/rm-ng-editor';
```

## Important: There Is No ControlValueAccessor

`RmNgEditor` does **not** implement `ControlValueAccessor`, so Angular's form
directives cannot bind to `<app-rm-ng-editor>`. The editor is wired up manually:

```html
<app-rm-ng-editor
  [config]="editorConfig()"
  [value]="articleForm.get('content')?.value || ''"
  (valueChange)="onContentChange($event)"
/>
```

```typescript
onContentChange(html: string): void {
  this.articleForm.get('content')?.setValue(html);
  this.articleForm.get('content')?.markAsTouched();
}
```

Plain `<input>` elements in the same form (such as the title field) use
`[formControl]="articleForm.controls.title"` as usual — the limitation applies only to
the editor component.

If you need a form directive to work directly on the editor, write a thin
`ControlValueAccessor` wrapper in your own app that forwards `writeValue` to `[value]`
and `registerOnChange` to `(valueChange)`.

## Expected Behavior

1. Editor content is pushed into the form control on every `(valueChange)`
2. Form validation applies to editor content
3. Can set/get value via form API
4. Submit includes editor content

## Validation Example

```typescript
content: new FormControl('', [
  Validators.required,
  this.minContentLengthValidator(100)
])
```

## Key Points

✅ **Reactive Forms** - The editor can drive a `FormControl`  
✅ **Validation** - Built-in and custom validators  
✅ **Manual synchronization** - `[value]` in, `(valueChange)` out; no automatic two-way binding  
✅ **Type-safe** - `FormControl<string>`

## Related Examples

- [Basic Usage](./basic-usage.md)
- [Error Handling](../failure-cases/error-handling.md)
- [Auto-Save](../async-and-lifecycle/auto-save.md)

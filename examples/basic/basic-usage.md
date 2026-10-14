# Basic Usage

The simplest possible working example of `rm-ng-editor`.

## What This Demonstrates

- Minimal component setup
- Required imports
- Default editor configuration
- Content change handling

## When to Use This

- First-time implementation
- Quick prototyping
- Learning the basics
- Minimal overhead scenarios

## APIs Used

- `RmNgEditor` - Main editor component
- `EditorConfig` - Configuration interface (optional)
- `value` input - Initial HTML content
- `valueChange` output - Emits the current HTML

## Code

See [basic-usage.ts](./basic-usage.ts)

The source imports from `rm-ng-editor`, which resolves inside this workspace (the root
`tsconfig.json` maps it to `./dist/rm-ng-editor`). In your own application, import from
the published package:

```typescript
import { RmNgEditor } from '@codewithrajat/rm-ng-editor';
```

## Expected Behavior

1. Editor renders with default toolbar
2. User can type and format text
3. `valueChange` event emits on every content change
4. Content is captured in component state

## Output Example

When user types "Hello **World**":

```html
<p>Hello <strong>World</strong></p>
```

## Key Points

✅ **Standalone component** - No NgModule required  
✅ **Default configuration** - Works out of the box  
✅ **Signal-based** - Uses Angular signals for reactivity  
✅ **Type-safe** - Full TypeScript support

## Common Variations

### With Initial Content

```typescript
// Template: <app-rm-ng-editor [value]="content()" (valueChange)="content.set($event)" />
content = signal('<p>Initial content here</p>');
```

### With Placeholder

```typescript
config = signal<EditorConfig>({
  placeholder: 'Start typing your article...'
});
```

### Read-Only Mode

```typescript
config = signal<EditorConfig>({
  disabled: true
});
```

## Next Steps

- [Advanced Configuration](../advanced/advanced-configuration.md) - Customize the editor
- [Form Integration](./form-integration.md) - Use with Angular forms
- [Content Processing](../advanced/content-processing.md) - Process editor output

## Related Examples

- [Form Integration](./form-integration.md)
- [Advanced Configuration](../advanced/advanced-configuration.md)
- [Error Handling](../failure-cases/error-handling.md)

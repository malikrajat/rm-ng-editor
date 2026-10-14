# Error Handling

Proper error handling and validation patterns.

## What This Demonstrates

- Content validation
- Error display
- User feedback
- Recovery strategies
- Input sanitization

## When to Use This

- Form submissions
- Content publishing
- User-generated content
- Quality control
- Data integrity

## APIs Used

- `RmNgEditorService.getWordCount()` - Word counting for the live stats
- `RmNgEditorService.extractHeadings()` - Heading detection (`{ level, text, id? }[]`)
- `RmNgEditorService.validateContent()` - Structure validation
- `RmNgEditorService.sanitizeHtml()` - Removal of dangerous markup
- Your own validators and error-display state

## Code

See [error-handling.ts](./error-handling.ts)

The source imports from `rm-ng-editor`, which resolves inside this workspace. In your
own application, import from the published package:

```typescript
import { RmNgEditor, RmNgEditorService, EditorConfig } from '@codewithrajat/rm-ng-editor';
```

## Error Types

### Validation Errors
- Minimum/maximum length
- Required content
- Missing headings

### Content Errors
- Dangerous HTML (`<script>`, `<object>`, `<embed>`, `<iframe>`)
- Invalid structure returned by `validateContent()`

## Key Points

✅ **User-friendly** - Clear error messages  
✅ **Preventive** - Validation before submission  
✅ **Secure** - Sanitization of dangerous content  
✅ **Recoverable** - Guidance for fixing errors

## Related Examples

- [Form Integration](../basic/form-integration.md)
- [Content Processing](../advanced/content-processing.md)
- [Basic Usage](../basic/basic-usage.md)

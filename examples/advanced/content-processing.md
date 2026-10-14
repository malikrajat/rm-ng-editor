# Content Processing with RmNgEditorService

Using the utility service for content manipulation.

## What This Demonstrates

- HTML to plain text conversion
- Content sanitization (XSS prevention)
- Word and character counting
- Heading extraction
- Content validation
- Format conversion (HTML to Markdown)

## When to Use This

- Backend processing of editor content
- Search indexing
- Content preview generation
- Security validation
- SEO optimization

## APIs Used

- `RmNgEditorService` - Utility service
- `htmlToText()` - Extract plain text
- `sanitizeHtml()` - Remove dangerous HTML
- `getWordCount()` - Count words
- `getCharacterCount()` - Count characters
- `extractHeadings()` - Get headings (`{ level, text, id? }[]`)
- `validateContent()` - Validate structure (`{ isValid, errors }`)
- `convertToFormat()` - Convert to other formats (`'text' | 'markdown'`)

## Code

See [content-processing.ts](./content-processing.ts)

The source imports from `rm-ng-editor`, which resolves inside this workspace. In your
own application, import from the published package:

```typescript
import { RmNgEditor, RmNgEditorService } from '@codewithrajat/rm-ng-editor';
```

## Key Operations

### Text Extraction
```typescript
const plainText = service.htmlToText(html);
```

### Sanitization
```typescript
const clean = service.sanitizeHtml(userHtml);
```

### Heading Extraction Returns Objects
```typescript
const headings = service.extractHeadings(html);
// [{ level: 1, text: 'Sample Article', id: undefined }, ...]
const titles = headings.map(heading => heading.text);
```

### Validation
```typescript
const result = service.validateContent(html);
if (!result.isValid) {
  console.error(result.errors);
}
```

## Key Points

✅ **Security** - Built-in XSS protection  
✅ **Utility functions** - Common operations  
✅ **Framework-agnostic** - Works anywhere  
✅ **Type-safe** - Full TypeScript support

## Related Examples

- [Basic Usage](../basic/basic-usage.md)
- [Error Handling](../failure-cases/error-handling.md)
- [Form Integration](../basic/form-integration.md)

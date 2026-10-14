# Advanced Configuration

Comprehensive editor configuration for production use.

## What This Demonstrates

- Custom toolbar configuration
- Theme customization
- Validation rules
- Feature gates
- Settings that are configured through `EditorConfig`

## When to Use This

- Production deployments
- Custom branding requirements
- Specific feature requirements
- Feature-gated deployments

## APIs Used

- `EditorConfig` - Main configuration (11 optional properties)
- `ToolbarConfig` - Toolbar customization (74 optional flags)
- `ThemeConfig` - Theme settings
- `ValidationConfig` - Content validation
- `FullScreenConfig` - Full-screen mode

## Code

See [advanced-configuration.ts](./advanced-configuration.ts)

The source imports from `rm-ng-editor`, which resolves inside this workspace (the root
`tsconfig.json` maps it to `./dist/rm-ng-editor`). In your own application, import from
the published package:

```typescript
import { RmNgEditor, EditorConfig, ToolbarConfig } from '@codewithrajat/rm-ng-editor';
```

## Configuration Categories

### Toolbar Customization
- Enable/disable specific `ToolbarConfig` flags
- Three presets (`minimal`, `standard`, `full`) selected by feature level
- Flags are typed, so a misspelled flag fails the build

### Theme Configuration
- Light/dark mode via `ThemeConfig`
- Custom colors and branding

### Validation
- Word count limits
- Character limits
- Spell checking

### Full-Screen
- `enabled`, `exitOnEscape`, `hideToolbarInFullScreen`, `distractionFree`

## Key Points

✅ **Type-safe** - Full TypeScript configuration  
✅ **Granular control** - Enable/disable individual features  
✅ **Computed configuration** - Dynamic based on context  
✅ **Performance-optimized** - Minimal overhead

## Related Examples

- [Content Processing](./content-processing.md)
- [Basic Usage](../basic/basic-usage.md)
- [Form Integration](../basic/form-integration.md)

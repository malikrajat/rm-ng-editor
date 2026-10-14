# Auto-Save Pattern

Implementing debounced auto-save for editor content.

## What This Demonstrates

- Automatic content saving
- Debouncing to reduce API calls
- RxJS in *your* integration code
- Lifecycle management
- Error handling

## When to Use This

- Blog/CMS platforms
- Form auto-save
- Draft saving
- Preventing data loss
- Improving UX

## APIs Used

- `valueChange` output event
- RxJS `Subject`, `Subscription` and `debounceTime`
- `DestroyRef` for cleanup
- `takeUntilDestroyed` operator

## Code

See [auto-save.ts](./auto-save.ts)

The source imports from `rm-ng-editor`, which resolves inside this workspace. In your
own application, import from the published package:

```typescript
import { RmNgEditor, EditorConfig } from '@codewithrajat/rm-ng-editor';
```

The editor itself does not use RxJS internally — the `Subject`, `debounceTime` and
`takeUntilDestroyed` pipeline below is consumer code.

## Key Concepts

### Debouncing
Delays save operation until user stops typing:
```typescript
debounceTime(2000) // Wait 2 seconds after last change
```

### Auto Cleanup
Using `takeUntilDestroyed` ensures no memory leaks:
```typescript
pipe(takeUntilDestroyed(this.destroyRef))
```

### Changing the Delay Without Leaking
`debounceTime(...)` is baked in when the pipeline is built, so re-subscribing to
`contentSubject` with a new delay would leave the old subscription alive. The example
keeps the subscription in a field and unsubscribes before rebuilding:

```typescript
private saveSubscription?: Subscription;

private setupAutoSave(): void {
  this.saveSubscription?.unsubscribe();
  this.saveSubscription = this.contentSubject
    .pipe(debounceTime(this.debounceDelayMs()), takeUntilDestroyed(this.destroyRef))
    .subscribe(html => this.save(html));
}
```

## Key Points

✅ **Automatic** - No user action required  
✅ **Efficient** - Batches changes to reduce API calls  
✅ **Safe** - Proper cleanup on destroy, and no leaked subscriptions when the delay changes  
✅ **User-friendly** - Visual feedback

## Related Examples

- [Form Integration](../basic/form-integration.md)
- [Error Handling](../failure-cases/error-handling.md)
- [Content Processing](../advanced/content-processing.md)

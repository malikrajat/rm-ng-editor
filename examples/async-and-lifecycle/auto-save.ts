/**
 * Auto-Save Example
 *
 * Demonstrates implementing a debounced auto-save pattern for editor content.
 * Shows proper RxJS usage, lifecycle management, and error handling.
 */

import { Component, signal, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RmNgEditor, EditorConfig } from 'rm-ng-editor';

interface SaveStatus {
  status: 'idle' | 'saving' | 'saved' | 'error';
  message: string;
  lastSaved: Date | null;
}

@Component({
  selector: 'app-auto-save-editor',
  standalone: true,
  imports: [CommonModule, RmNgEditor],
  template: `
    <div class="auto-save-container">
      <div class="header">
        <h2>Auto-Save Editor</h2>
        
        <!-- Save Status Indicator -->
        <div class="save-status" [class]="saveStatus().status">
          <span class="indicator"></span>
          <span class="message">{{ saveStatus().message }}</span>
          @if (saveStatus().lastSaved) {
            <span class="timestamp">
              Last saved: {{ formatTime(saveStatus().lastSaved!) }}
            </span>
          }
        </div>
      </div>

      <!-- Configuration -->
      <div class="config-panel">
        <label>
          Auto-save delay:
          <select (change)="setDebounceTime(+$any($event.target).value)">
            <option value="1000">1 second</option>
            <option value="2000" selected>2 seconds</option>
            <option value="5000">5 seconds</option>
            <option value="10000">10 seconds</option>
          </select>
        </label>
        
        <label>
          <input
            type="checkbox"
            [checked]="autoSaveEnabled()"
            (change)="toggleAutoSave($any($event.target).checked)"
          />
          Enable auto-save
        </label>

        <button (click)="manualSave()" class="btn-secondary">
          Save Now
        </button>
      </div>

      <!-- Editor -->
      <app-rm-ng-editor
        [config]="editorConfig()"
        [value]="content()"
        (valueChange)="onContentChange($event)"
      />

      <!-- Stats -->
      <div class="stats">
        <p>Changes made: {{ changeCount() }}</p>
        <p>Successful saves: {{ saveCount() }}</p>
        <p>Failed saves: {{ errorCount() }}</p>
      </div>

      <!-- Save History -->
      @if (saveHistory().length > 0) {
        <div class="save-history">
          <h3>Save History</h3>
          <ul>
            @for (entry of saveHistory(); track entry.timestamp) {
              <li class="{{ entry.success ? 'success' : 'error' }}">
                {{ formatTime(entry.timestamp) }} - {{ entry.message }}
              </li>
            }
          </ul>
        </div>
      }
    </div>
  `,
  styles: [
    `
    .auto-save-container {
      max-width: 900px;
      margin: 20px auto;
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    h2 {
      margin: 0;
      color: #1f2937;
    }

    .save-status {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 14px;
      background-color: #f3f4f6;
    }

    .save-status.saving {
      background-color: #dbeafe;
      color: #1e40af;
    }

    .save-status.saved {
      background-color: #d1fae5;
      color: #065f46;
    }

    .save-status.error {
      background-color: #fee2e2;
      color: #991b1b;
    }

    .indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: currentColor;
    }

    .save-status.saving .indicator {
      animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .timestamp {
      margin-left: auto;
      font-size: 12px;
      opacity: 0.7;
    }

    .config-panel {
      display: flex;
      gap: 20px;
      align-items: center;
      margin-bottom: 20px;
      padding: 15px;
      background-color: #f9fafb;
      border-radius: 6px;
      flex-wrap: wrap;
    }

    .config-panel label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #374151;
    }

    .config-panel select {
      padding: 6px 10px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      font-size: 14px;
    }

    .btn-secondary {
      padding: 6px 16px;
      background-color: #3b82f6;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .btn-secondary:hover {
      background-color: #2563eb;
    }

    .stats {
      margin-top: 20px;
      padding: 15px;
      background-color: #f9fafb;
      border-radius: 6px;
    }

    .stats p {
      margin: 5px 0;
      color: #6b7280;
      font-size: 14px;
    }

    .save-history {
      margin-top: 30px;
    }

    .save-history h3 {
      color: #374151;
      margin-bottom: 15px;
    }

    .save-history ul {
      list-style: none;
      padding: 0;
      max-height: 200px;
      overflow-y: auto;
    }

    .save-history li {
      padding: 8px 12px;
      margin: 4px 0;
      border-radius: 4px;
      font-size: 13px;
    }

    .save-history li.success {
      background-color: #d1fae5;
      color: #065f46;
    }

    .save-history li.error {
      background-color: #fee2e2;
      color: #991b1b;
    }
  `,
  ],
})
export class AutoSaveEditorComponent {
  /**
   * Inject DestroyRef for automatic cleanup
   */
  private readonly destroyRef = inject(DestroyRef);

  /**
   * Subject for content changes
   */
  private readonly contentSubject = new Subject<string>();

  /**
   * The currently active debounced-save subscription. Held so that changing the
   * delay can tear the previous pipeline down instead of leaking it.
   */
  private saveSubscription?: Subscription;

  /**
   * Current debounce delay in milliseconds
   */
  private readonly debounceDelayMs = signal(2000);

  /**
   * Auto-save enabled flag
   */
  autoSaveEnabled = signal(true);

  /**
   * Editor content
   */
  content = signal('');

  /**
   * Save status
   */
  saveStatus = signal<SaveStatus>({
    status: 'idle',
    message: 'No changes',
    lastSaved: null,
  });

  /**
   * Counters
   */
  changeCount = signal(0);
  saveCount = signal(0);
  errorCount = signal(0);

  /**
   * Save history
   */
  saveHistory = signal<
    Array<{ timestamp: Date; message: string; success: boolean }>
  >([]);

  /**
   * Editor configuration
   */
  editorConfig = signal<EditorConfig>({
    placeholder: 'Start typing... Content will auto-save',
    height: '400px',
  });

  constructor() {
    this.setupAutoSave();
  }

  /**
   * (Re)build the debounced-save pipeline for the current delay.
   *
   * `debounceTime(...)` is evaluated when the pipeline is built, so the previous
   * subscription must be disposed of first — otherwise every change of the delay
   * would leave a second live subscription behind.
   */
  private setupAutoSave(): void {
    this.saveSubscription?.unsubscribe();

    this.saveSubscription = this.contentSubject
      .pipe(
        debounceTime(this.debounceDelayMs()), // Wait for a pause in typing
        distinctUntilChanged(), // Only save if content actually changed
        takeUntilDestroyed(this.destroyRef) // Auto cleanup
      )
      .subscribe(html => {
        if (this.autoSaveEnabled()) {
          void this.saveContent(html);
        }
      });
  }

  /**
   * Update debounce time
   */
  setDebounceTime(ms: number): void {
    this.debounceDelayMs.set(ms);
    // Rebuild the pipeline so the new delay takes effect.
    this.setupAutoSave();
  }

  /**
   * Toggle auto-save
   */
  toggleAutoSave(enabled: boolean): void {
    this.autoSaveEnabled.set(enabled);

    if (!enabled) {
      this.saveStatus.set({
        status: 'idle',
        message: 'Auto-save disabled',
        lastSaved: this.saveStatus().lastSaved,
      });
    }
  }

  /**
   * Handle content changes
   */
  onContentChange(html: string): void {
    this.content.set(html);
    this.changeCount.update(count => count + 1);

    // Update status to show unsaved changes
    if (this.autoSaveEnabled()) {
      this.saveStatus.update(status => ({
        ...status,
        status: 'idle',
        message: 'Unsaved changes...',
      }));
    }

    // Push to subject for debounced save
    this.contentSubject.next(html);
  }

  /**
   * Save content to backend (simulated)
   */
  private async saveContent(html: string): Promise<void> {
    // Update status to saving
    this.saveStatus.set({
      status: 'saving',
      message: 'Saving...',
      lastSaved: this.saveStatus().lastSaved,
    });

    try {
      // Simulate API call
      await this.simulateApiCall(html);

      // Success
      const now = new Date();
      this.saveStatus.set({
        status: 'saved',
        message: 'All changes saved',
        lastSaved: now,
      });

      this.saveCount.update(count => count + 1);

      // Add to history
      this.saveHistory.update(history =>
        [
          { timestamp: now, message: 'Saved successfully', success: true },
          ...history,
        ].slice(0, 10)
      ); // Keep last 10
    } catch (error) {
      // Error
      this.saveStatus.set({
        status: 'error',
        message: 'Save failed - will retry',
        lastSaved: this.saveStatus().lastSaved,
      });

      this.errorCount.update(count => count + 1);

      // Add to history
      this.saveHistory.update(history =>
        [
          { timestamp: new Date(), message: 'Save failed', success: false },
          ...history,
        ].slice(0, 10)
      );

      console.error('Save error:', error);
    }
  }

  /**
   * Manual save trigger
   */
  async manualSave(): Promise<void> {
    if (this.content().trim()) {
      await this.saveContent(this.content());
    }
  }

  /**
   * Simulate API call to backend
   */
  private simulateApiCall(html: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 10% failure rate
        if (Math.random() < 0.1) {
          reject(new Error('Network error'));
        } else {
          console.log(
            'Content saved to backend:',
            html.substring(0, 50) + '...'
          );
          resolve();
        }
      }, 1000);
    });
  }

  /**
   * Format timestamp
   */
  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }
}

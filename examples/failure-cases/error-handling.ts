/**
 * Error Handling Example
 *
 * Demonstrates proper error handling, validation, and user feedback
 * for editor content. Shows various error scenarios and recovery patterns.
 */

import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RmNgEditor, RmNgEditorService, EditorConfig } from 'rm-ng-editor';

interface ValidationError {
  type: 'warning' | 'error';
  message: string;
  field?: string;
}

@Component({
  selector: 'app-error-handling',
  standalone: true,
  imports: [CommonModule, RmNgEditor],
  template: `
    <div class="error-handling-container">
      <h2>Error Handling & Validation</h2>

      <!-- Validation Rules Display -->
      <div class="rules-panel">
        <h3>Validation Rules</h3>
        <ul>
          <li>Minimum 50 words required</li>
          <li>Maximum 1000 words allowed</li>
          <li>Must contain at least one heading</li>
          <li>No dangerous HTML (scripts, objects, etc.)</li>
        </ul>
      </div>

      <!-- Editor -->
      <div class="editor-section">
        <label>Article Content *</label>
        <app-rm-ng-editor
          [config]="editorConfig()"
          [value]="content()"
          (valueChange)="onContentChange($event)"
        />
        
        <!-- Real-time Validation Feedback -->
        <div class="validation-feedback">
          <div class="stat" [class.error]="wordCount() < minWords()">
            Words: {{ wordCount() }} / {{ minWords() }}+ required
          </div>
          <div class="stat" [class.error]="wordCount() > maxWords()">
            Max words: {{ wordCount() }} / {{ maxWords() }}
          </div>
          <div class="stat" [class.error]="!hasHeadings()">
            Headings: {{ headingCount() }} ({{ hasHeadings() ? '✓' : '✗ required' }})
          </div>
        </div>
      </div>

      <!-- Validation Errors -->
      @if (errors().length > 0) {
        <div class="errors-panel">
          <h4>⚠️ Validation Errors</h4>
          @for (error of errors(); track error.message) {
            <div class="error-item" [class]="error.type">
              <span class="type-badge">{{ error.type.toUpperCase() }}</span>
              <span class="message">{{ error.message }}</span>
              @if (error.field) {
                <span class="field">Field: {{ error.field }}</span>
              }
            </div>
          }
        </div>
      }

      <!-- Success Message -->
      @if (isValid() && content()) {
        <div class="success-panel">
          ✓ Content is valid and ready to publish
        </div>
      }

      <!-- Actions -->
      <div class="actions">
        <button
          (click)="validate()"
          class="btn-primary"
        >
          Validate
        </button>
        
        <button
          (click)="sanitizeContent()"
          class="btn-secondary"
        >
          Sanitize HTML
        </button>
        
        <button
          (click)="publish()"
          [disabled]="!isValid() || !content()"
          class="btn-success"
        >
          Publish
        </button>
        
        <button
          (click)="loadInvalidContent()"
          class="btn-danger"
        >
          Test: Load Invalid Content
        </button>
      </div>

      <!-- Sanitization Result -->
      @if (sanitizationResult()) {
        <div class="sanitization-panel">
          <h4>Sanitization Result</h4>
          <p class="removed">Removed: {{ sanitizationResult()?.removedElements?.join(', ') || 'None' }}</p>
          <details>
            <summary>View Sanitized HTML</summary>
            <pre>{{ sanitizationResult()?.sanitized }}</pre>
          </details>
        </div>
      }
    </div>
  `,
  styles: [
    `
    .error-handling-container {
      max-width: 900px;
      margin: 20px auto;
      padding: 20px;
    }

    h2 {
      color: #1f2937;
      margin-bottom: 30px;
    }

    .rules-panel {
      padding: 20px;
      background-color: #eff6ff;
      border-left: 4px solid #3b82f6;
      border-radius: 4px;
      margin-bottom: 30px;
    }

    .rules-panel h3 {
      margin-top: 0;
      color: #1e3a8a;
    }

    .rules-panel ul {
      margin: 10px 0;
      padding-left: 20px;
    }

    .rules-panel li {
      margin: 8px 0;
      color: #1e40af;
    }

    .editor-section {
      margin-bottom: 20px;
    }

    .editor-section label {
      display: block;
      margin-bottom: 10px;
      font-weight: 500;
      color: #374151;
    }

    .validation-feedback {
      display: flex;
      gap: 20px;
      margin-top: 15px;
      padding: 15px;
      background-color: #f9fafb;
      border-radius: 6px;
      flex-wrap: wrap;
    }

    .stat {
      padding: 8px 12px;
      background-color: #d1fae5;
      color: #065f46;
      border-radius: 4px;
      font-size: 14px;
    }

    .stat.error {
      background-color: #fee2e2;
      color: #991b1b;
    }

    .errors-panel {
      margin: 20px 0;
      padding: 20px;
      background-color: #fef2f2;
      border: 2px solid #fca5a5;
      border-radius: 8px;
    }

    .errors-panel h4 {
      margin-top: 0;
      color: #991b1b;
    }

    .error-item {
      display: flex;
      gap: 12px;
      align-items: center;
      padding: 10px;
      margin: 8px 0;
      border-radius: 4px;
      font-size: 14px;
    }

    .error-item.error {
      background-color: #fee2e2;
    }

    .error-item.warning {
      background-color: #fef3c7;
    }

    .type-badge {
      padding: 2px 8px;
      border-radius: 3px;
      font-size: 11px;
      font-weight: 600;
    }

    .error-item.error .type-badge {
      background-color: #dc2626;
      color: white;
    }

    .error-item.warning .type-badge {
      background-color: #f59e0b;
      color: white;
    }

    .message {
      flex: 1;
      color: #374151;
    }

    .field {
      font-size: 12px;
      color: #6b7280;
      font-style: italic;
    }

    .success-panel {
      padding: 15px 20px;
      background-color: #d1fae5;
      border: 1px solid #86efac;
      border-radius: 6px;
      color: #065f46;
      font-weight: 500;
      margin: 20px 0;
    }

    .actions {
      display: flex;
      gap: 12px;
      margin: 30px 0;
      flex-wrap: wrap;
    }

    .btn-primary, .btn-secondary, .btn-success, .btn-danger {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background-color: #3b82f6;
      color: white;
    }

    .btn-primary:hover {
      background-color: #2563eb;
    }

    .btn-secondary {
      background-color: #6b7280;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #4b5563;
    }

    .btn-success {
      background-color: #10b981;
      color: white;
    }

    .btn-success:hover:not(:disabled) {
      background-color: #059669;
    }

    .btn-success:disabled {
      background-color: #9ca3af;
      cursor: not-allowed;
    }

    .btn-danger {
      background-color: #ef4444;
      color: white;
    }

    .btn-danger:hover {
      background-color: #dc2626;
    }

    .sanitization-panel {
      margin-top: 20px;
      padding: 20px;
      background-color: #f9fafb;
      border-radius: 6px;
    }

    .sanitization-panel h4 {
      margin-top: 0;
      color: #374151;
    }

    .removed {
      color: #dc2626;
      font-weight: 500;
    }

    .sanitization-panel pre {
      background-color: #1f2937;
      color: #f9fafb;
      padding: 15px;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 13px;
      margin-top: 10px;
    }
  `,
  ],
})
export class ErrorHandlingComponent {
  private editorService = inject(RmNgEditorService);

  editorConfig = signal<EditorConfig>({
    placeholder: 'Write your article here...',
    height: '300px',
  });

  content = signal('');
  errors = signal<ValidationError[]>([]);
  sanitizationResult = signal<{
    sanitized: string;
    removedElements: string[];
  } | null>(null);

  minWords = signal(50);
  maxWords = signal(1000);

  /**
   * Computed word count
   */
  wordCount = computed(() => {
    return this.editorService.getWordCount(this.content());
  });

  /**
   * Computed heading count
   */
  headingCount = computed(() => {
    const headings = this.editorService.extractHeadings(this.content());
    return headings.length;
  });

  /**
   * Has headings check
   */
  hasHeadings = computed(() => this.headingCount() > 0);

  /**
   * Is content valid
   */
  isValid = computed(() => this.errors().length === 0);

  /**
   * Handle content changes
   */
  onContentChange(html: string): void {
    this.content.set(html);
    this.sanitizationResult.set(null);
    // Auto-validate on change
    this.validate();
  }

  /**
   * Validate content
   */
  validate(): void {
    const html = this.content();
    const errors: ValidationError[] = [];

    // Word count validation
    const words = this.wordCount();
    if (words < this.minWords()) {
      errors.push({
        type: 'error',
        message: `Content must be at least ${this.minWords()} words (currently: ${words})`,
        field: 'content',
      });
    }

    if (words > this.maxWords()) {
      errors.push({
        type: 'error',
        message: `Content must not exceed ${this.maxWords()} words (currently: ${words})`,
        field: 'content',
      });
    }

    // Heading validation
    if (!this.hasHeadings()) {
      errors.push({
        type: 'error',
        message: 'Content must include at least one heading (H1-H6)',
        field: 'content',
      });
    }

    // Use service validation
    const serviceValidation = this.editorService.validateContent(html);
    if (!serviceValidation.isValid) {
      serviceValidation.errors.forEach(error => {
        errors.push({
          type: 'warning',
          message: error,
          field: 'content',
        });
      });
    }

    // Check for dangerous content
    if (
      html.includes('<script') ||
      html.includes('<object') ||
      html.includes('<embed')
    ) {
      errors.push({
        type: 'error',
        message:
          'Content contains dangerous HTML elements that must be removed',
        field: 'content',
      });
    }

    this.errors.set(errors);
  }

  /**
   * Sanitize content
   */
  sanitizeContent(): void {
    const html = this.content();
    const original = html;

    const sanitized = this.editorService.sanitizeHtml(html);

    // Detect what was removed
    const removedElements: string[] = [];
    if (original.includes('<script')) removedElements.push('script');
    if (original.includes('<object')) removedElements.push('object');
    if (original.includes('<embed')) removedElements.push('embed');
    if (original.includes('<iframe')) removedElements.push('iframe');

    this.sanitizationResult.set({
      sanitized,
      removedElements,
    });

    this.content.set(sanitized);
    this.validate();
  }

  /**
   * Publish content
   */
  publish(): void {
    if (this.isValid()) {
      console.log('Publishing content:', {
        html: this.content(),
        wordCount: this.wordCount(),
        headings: this.headingCount(),
      });

      alert('Content published successfully!');
    } else {
      alert('Please fix validation errors before publishing');
    }
  }

  /**
   * Load invalid content for testing
   */
  loadInvalidContent(): void {
    const invalid = `
      <p>This is a short paragraph without any headings.</p>
      <script>alert('XSS attack!')</script>
      <object data="malicious.swf"></object>
    `;

    this.content.set(invalid.trim());
    this.validate();
  }
}

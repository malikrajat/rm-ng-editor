/**
 * Form Integration Example
 *
 * Demonstrates integration of rm-ng-editor with Angular Reactive Forms.
 * Shows form validation, value access, and submission handling.
 */

import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RmNgEditor, EditorConfig } from 'rm-ng-editor';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RmNgEditor],
  template: `
    <div class="form-container">
      <h2>Article Form</h2>
      
      <form [formGroup]="articleForm" (ngSubmit)="onSubmit()">
        <!-- Title Field -->
        <div class="form-group">
          <label for="title">Title *</label>
          <input
            id="title"
            type="text"
            [formControl]="articleForm.controls.title"
            placeholder="Enter article title"
            class="form-control"
          />
          @if (articleForm.get('title')?.invalid && articleForm.get('title')?.touched) {
            <div class="error-message">
              Title is required (minimum 5 characters)
            </div>
          }
        </div>

        <!-- Content Field (Editor) -->
        <div class="form-group">
          <label>Content *</label>
          <app-rm-ng-editor
            [config]="editorConfig()"
            [value]="articleForm.get('content')?.value || ''"
            (valueChange)="onContentChange($event)"
          />
          @if (articleForm.get('content')?.invalid && articleForm.get('content')?.touched) {
            <div class="error-message">
              {{ getContentError() }}
            </div>
          }
          <div class="helper-text">
            Minimum 100 characters required
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button
            type="submit"
            [disabled]="articleForm.invalid"
            class="btn-primary"
          >
            Publish Article
          </button>
          <button
            type="button"
            (click)="onReset()"
            class="btn-secondary"
          >
            Reset
          </button>
        </div>

        <!-- Form Status -->
        <div class="form-status">
          <p>Form Valid: {{ articleForm.valid ? '✓' : '✗' }}</p>
          <p>Content Length: {{ getContentLength() }} characters</p>
        </div>
      </form>

      <!-- Submission Result -->
      @if (submittedData()) {
        <div class="submission-result">
          <h3>Submitted Data:</h3>
          <pre>{{ submittedData() | json }}</pre>
        </div>
      }
    </div>
  `,
  styles: [
    `
    .form-container {
      max-width: 800px;
      margin: 20px auto;
      padding: 20px;
    }

    h2 {
      color: #1f2937;
      margin-bottom: 30px;
    }

    .form-group {
      margin-bottom: 25px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #374151;
    }

    .form-control {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 16px;
      transition: border-color 0.2s;
    }

    .form-control:focus {
      outline: none;
      border-color: #3b82f6;
    }

    .error-message {
      margin-top: 8px;
      color: #ef4444;
      font-size: 14px;
    }

    .helper-text {
      margin-top: 8px;
      color: #6b7280;
      font-size: 14px;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 30px;
    }

    .btn-primary,
    .btn-secondary {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background-color: #3b82f6;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #2563eb;
    }

    .btn-primary:disabled {
      background-color: #9ca3af;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: #e5e7eb;
      color: #374151;
    }

    .btn-secondary:hover {
      background-color: #d1d5db;
    }

    .form-status {
      margin-top: 20px;
      padding: 15px;
      background-color: #f9fafb;
      border-radius: 6px;
    }

    .form-status p {
      margin: 5px 0;
      color: #6b7280;
    }

    .submission-result {
      margin-top: 30px;
      padding: 20px;
      background-color: #f0fdf4;
      border: 1px solid #86efac;
      border-radius: 8px;
    }

    .submission-result h3 {
      margin-top: 0;
      color: #166534;
    }

    .submission-result pre {
      background-color: white;
      padding: 15px;
      border-radius: 4px;
      overflow-x: auto;
    }
  `,
  ],
})
export class FormEditorComponent {
  /**
   * Editor configuration
   */
  editorConfig = signal<EditorConfig>({
    placeholder: 'Write your article content here...',
    height: '300px',
    toolbarConfig: {
      showTextFormatting: true,
      showLists: true,
      showLinkMedia: true,
    },
  });

  /**
   * Reactive form with validation
   */
  articleForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(5)]),
    content: new FormControl('', [
      Validators.required,
      this.minContentLengthValidator(100),
    ]),
  });

  /**
   * Signal to store submitted data
   */
  submittedData = signal<any>(null);

  /**
   * Custom validator for minimum content length
   * Strips HTML tags before checking length
   */
  private minContentLengthValidator(minLength: number) {
    return (control: FormControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null;
      }

      // Strip HTML tags to get plain text length
      const plainText = control.value.replace(/<[^>]*>/g, '').trim();

      if (plainText.length < minLength) {
        return {
          minContentLength: {
            required: minLength,
            actual: plainText.length,
          },
        };
      }

      return null;
    };
  }

  /**
   * Handle editor content changes
   * Updates form control value
   */
  onContentChange(html: string): void {
    this.articleForm.get('content')?.setValue(html);
    this.articleForm.get('content')?.markAsTouched();
  }

  /**
   * Get content error message
   */
  getContentError(): string {
    const contentControl = this.articleForm.get('content');

    if (contentControl?.hasError('required')) {
      return 'Content is required';
    }

    if (contentControl?.hasError('minContentLength')) {
      const error = contentControl.getError('minContentLength');
      return `Minimum ${error.required} characters required (current: ${error.actual})`;
    }

    return '';
  }

  /**
   * Get current content length (plain text)
   */
  getContentLength(): number {
    const content = this.articleForm.get('content')?.value || '';
    return content.replace(/<[^>]*>/g, '').trim().length;
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.articleForm.valid) {
      const formData = this.articleForm.value;

      console.log('Form submitted:', formData);

      // Store for display
      this.submittedData.set(formData);

      // Here you would typically send to backend:
      // this.http.post('/api/articles', formData).subscribe(...)

      // Reset form after submission
      // this.articleForm.reset();
    }
  }

  /**
   * Reset form to initial state
   */
  onReset(): void {
    this.articleForm.reset();
    this.submittedData.set(null);
  }
}

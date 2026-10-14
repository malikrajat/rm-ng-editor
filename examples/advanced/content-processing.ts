/**
 * Content Processing Example
 *
 * Demonstrates using RmNgEditorService for content manipulation,
 * validation, and conversion operations.
 */

import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RmNgEditor, RmNgEditorService, EditorConfig } from 'rm-ng-editor';

interface ProcessedContent {
  plainText: string;
  sanitized: string;
  wordCount: number;
  characterCount: number;
  headings: { level: number; text: string; id?: string }[];
  isValid: boolean;
  validationErrors: string[];
  markdown: string;
}

@Component({
  selector: 'app-content-processing',
  standalone: true,
  imports: [CommonModule, RmNgEditor],
  template: `
    <div class="processing-container">
      <h2>Content Processing Example</h2>

      <!-- Input Editor -->
      <div class="section">
        <h3>Input Content</h3>
        <app-rm-ng-editor
          [config]="editorConfig()"
          [value]="rawContent()"
          (valueChange)="onContentChange($event)"
        />
      </div>

      <!-- Processing Controls -->
      <div class="controls">
        <button (click)="processContent()" class="btn-primary">
          Process Content
        </button>
        <button (click)="clearContent()" class="btn-secondary">
          Clear
        </button>
        <button (click)="loadSampleContent()" class="btn-secondary">
          Load Sample
        </button>
      </div>

      <!-- Processed Results -->
      @if (processed()) {
        <div class="results">
          <!-- Plain Text -->
          <div class="result-card">
            <h4>Plain Text</h4>
            <pre>{{ processed()?.plainText }}</pre>
          </div>

          <!-- Statistics -->
          <div class="result-card">
            <h4>Statistics</h4>
            <ul>
              <li>Word Count: {{ processed()?.wordCount }}</li>
              <li>Character Count: {{ processed()?.characterCount }}</li>
              <li>Headings Found: {{ processed()?.headings.length }}</li>
            </ul>
          </div>

          <!-- Headings -->
          @if (processed()?.headings && processed()!.headings.length > 0) {
            <div class="result-card">
              <h4>Extracted Headings</h4>
              <ol>
                @for (heading of processed()?.headings; track heading.text) {
                  <li>H{{ heading.level }}: {{ heading.text }}</li>
                }
              </ol>
            </div>
          }

          <!-- Validation -->
          <div class="result-card" [class.error]="!processed()?.isValid">
            <h4>Validation</h4>
            <p class="status">
              Status: {{ processed()?.isValid ? '✓ Valid' : '✗ Invalid' }}
            </p>
            @if (!processed()?.isValid && processed()?.validationErrors) {
              <ul class="errors">
                @for (error of processed()?.validationErrors; track error) {
                  <li>{{ error }}</li>
                }
              </ul>
            }
          </div>

          <!-- Sanitized HTML -->
          <div class="result-card">
            <h4>Sanitized HTML</h4>
            <pre>{{ processed()?.sanitized }}</pre>
          </div>

          <!-- Markdown Conversion -->
          <div class="result-card">
            <h4>Markdown Conversion</h4>
            <pre>{{ processed()?.markdown }}</pre>
          </div>
        </div>
      }

      <!-- Documentation -->
      <div class="documentation">
        <h3>Service Methods Used</h3>
        <ul>
          <li><code>htmlToText(html)</code> - Extract plain text from HTML</li>
          <li><code>sanitizeHtml(html)</code> - Remove dangerous HTML elements</li>
          <li><code>getWordCount(html)</code> - Count words in content</li>
          <li><code>getCharacterCount(html)</code> - Count characters</li>
          <li><code>extractHeadings(html)</code> - Get all headings</li>
          <li><code>validateContent(html)</code> - Validate HTML structure</li>
          <li><code>convertToFormat(html, 'markdown')</code> - Convert to Markdown</li>
        </ul>
      </div>
    </div>
  `,
  styles: [
    `
    .processing-container {
      max-width: 1200px;
      margin: 20px auto;
      padding: 20px;
    }

    h2 {
      color: #1f2937;
      margin-bottom: 30px;
    }

    .section {
      margin-bottom: 30px;
    }

    .section h3 {
      color: #374151;
      margin-bottom: 15px;
    }

    .controls {
      display: flex;
      gap: 12px;
      margin: 30px 0;
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

    .btn-primary:hover {
      background-color: #2563eb;
    }

    .btn-secondary {
      background-color: #e5e7eb;
      color: #374151;
    }

    .btn-secondary:hover {
      background-color: #d1d5db;
    }

    .results {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 20px;
      margin-top: 30px;
    }

    .result-card {
      padding: 20px;
      background-color: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
    }

    .result-card.error {
      border-color: #fca5a5;
      background-color: #fef2f2;
    }

    .result-card h4 {
      margin-top: 0;
      color: #1f2937;
    }

    .result-card pre {
      background-color: #f9fafb;
      padding: 12px;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 13px;
      line-height: 1.5;
      max-height: 200px;
      overflow-y: auto;
    }

    .result-card ul,
    .result-card ol {
      margin: 10px 0;
      padding-left: 20px;
    }

    .result-card li {
      margin: 5px 0;
      color: #374151;
    }

    .status {
      font-weight: 500;
      color: #166534;
    }

    .result-card.error .status {
      color: #991b1b;
    }

    .errors {
      color: #dc2626;
    }

    .documentation {
      margin-top: 50px;
      padding: 20px;
      background-color: #f0f9ff;
      border-left: 4px solid #3b82f6;
      border-radius: 4px;
    }

    .documentation h3 {
      margin-top: 0;
      color: #1e3a8a;
    }

    .documentation code {
      background-color: #dbeafe;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      color: #1e40af;
    }

    .documentation li {
      margin: 8px 0;
      color: #1e3a8a;
    }
  `,
  ],
})
export class ContentProcessingComponent {
  /**
   * Inject the editor service
   */
  private editorService = inject(RmNgEditorService);

  /**
   * Editor configuration
   */
  editorConfig = signal<EditorConfig>({
    placeholder: 'Enter content to process...',
    height: '300px',
    toolbarConfig: {
      showTextFormatting: true,
      showLists: true,
      showAlignment: true,
    },
  });

  /**
   * Raw content from editor
   */
  rawContent = signal<string>('');

  /**
   * Processed content results
   */
  processed = signal<ProcessedContent | null>(null);

  /**
   * Handle content changes
   */
  onContentChange(html: string): void {
    this.rawContent.set(html);
  }

  /**
   * Process the current content using service methods
   */
  processContent(): void {
    const html = this.rawContent();

    if (!html.trim()) {
      alert('Please enter some content first');
      return;
    }

    // Use service methods to process content
    const plainText = this.editorService.htmlToText(html);
    const sanitized = this.editorService.sanitizeHtml(html);
    const wordCount = this.editorService.getWordCount(html);
    const characterCount = this.editorService.getCharacterCount(html);
    const headings = this.editorService.extractHeadings(html);
    const validation = this.editorService.validateContent(html);
    const markdown = this.editorService.convertToFormat(html, 'markdown');

    // Store processed results
    this.processed.set({
      plainText,
      sanitized,
      wordCount,
      characterCount,
      headings,
      isValid: validation.isValid,
      validationErrors: validation.errors,
      markdown,
    });

    console.log('Content processed:', {
      plainText,
      wordCount,
      characterCount,
      headingsFound: headings.length,
      isValid: validation.isValid,
    });
  }

  /**
   * Clear all content
   */
  clearContent(): void {
    this.rawContent.set('');
    this.processed.set(null);
  }

  /**
   * Load sample content for demonstration
   */
  loadSampleContent(): void {
    const sample = `
      <h1>Sample Article</h1>
      <p>This is a <strong>sample article</strong> with various HTML elements.</p>
      
      <h2>Introduction</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. This demonstrates 
      the content processing capabilities.</p>
      
      <h3>Key Points</h3>
      <ul>
        <li>Point one with <em>emphasis</em></li>
        <li>Point two with <u>underline</u></li>
        <li>Point three with <mark>highlight</mark></li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>This sample content will be processed using the RmNgEditorService.</p>
      
      <!-- This comment should be removed during sanitization -->
      <script>console.log('This should be sanitized')</script>
    `;

    this.rawContent.set(sample.trim());
  }
}

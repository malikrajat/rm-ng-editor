/**
 * Advanced Configuration Example
 *
 * Demonstrates comprehensive configuration of rm-ng-editor for production use.
 * Shows toolbar customization, theming, validation, and performance optimization.
 */

import { Component, signal, computed } from '@angular/core';
import {
  RmNgEditor,
  EditorConfig,
  ToolbarConfig,
  ThemeConfig,
  ValidationConfig,
} from 'rm-ng-editor';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-advanced-editor',
  standalone: true,
  imports: [CommonModule, RmNgEditor],
  template: `
    <div class="advanced-editor-container">
      <h2>Advanced Editor Configuration</h2>

      <!-- Configuration Controls -->
      <div class="controls">
        <div class="control-group">
          <label>Document Type:</label>
          <select (change)="setDocumentType($any($event.target).value)">
            <option value="blog">Blog Post</option>
            <option value="report">Report</option>
            <option value="email">Email</option>
          </select>
        </div>

        <div class="control-group">
          <label>Theme:</label>
          <select (change)="setTheme($any($event.target).value)">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="custom">Custom Brand</option>
          </select>
        </div>

        <div class="control-group">
          <label>Feature Set:</label>
          <select (change)="setFeatureLevel($any($event.target).value)">
            <option value="minimal">Minimal</option>
            <option value="standard">Standard</option>
            <option value="full">Full Features</option>
          </select>
        </div>
      </div>

      <!-- The Editor -->
      <app-rm-ng-editor
        [config]="editorConfig()"
        [value]="content()"
        (valueChange)="onContentChange($event)"
      />

      <!-- Validation Status -->
      <div class="validation-status" [class.error]="!isValid()">
        <h4>Validation Status:</h4>
        <p>Word Count: {{ wordCount() }} / {{ validationLimits().maxWords }}</p>
        <p>Character Count: {{ characterCount() }} / {{ validationLimits().maxCharacters }}</p>
        <p>Status: {{ isValid() ? '✓ Valid' : '✗ Invalid' }}</p>
        @if (!isValid()) {
          <ul class="errors">
            @for (error of validationErrors(); track error) {
              <li>{{ error }}</li>
            }
          </ul>
        }
      </div>

      <!-- Current Configuration -->
      <details class="config-display">
        <summary>Current Configuration (click to expand)</summary>
        <pre>{{ JSON.stringify(editorConfig(), null, 2) }}</pre>
      </details>
    </div>
  `,
  styles: [
    `
    .advanced-editor-container {
      max-width: 1000px;
      margin: 20px auto;
      padding: 20px;
    }

    h2 {
      color: #1f2937;
      margin-bottom: 30px;
    }

    .controls {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
      padding: 20px;
      background-color: #f9fafb;
      border-radius: 8px;
      flex-wrap: wrap;
    }

    .control-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .control-group label {
      font-weight: 500;
      color: #374151;
      font-size: 14px;
    }

    .control-group select {
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      background-color: white;
      cursor: pointer;
    }

    .validation-status {
      margin-top: 20px;
      padding: 15px;
      background-color: #f0fdf4;
      border: 1px solid #86efac;
      border-radius: 6px;
    }

    .validation-status.error {
      background-color: #fef2f2;
      border-color: #fca5a5;
    }

    .validation-status h4 {
      margin-top: 0;
      color: #166534;
    }

    .validation-status.error h4 {
      color: #991b1b;
    }

    .validation-status p {
      margin: 5px 0;
      color: #374151;
    }

    .errors {
      margin: 10px 0 0 20px;
      color: #dc2626;
    }

    .config-display {
      margin-top: 30px;
      padding: 15px;
      background-color: #f9fafb;
      border-radius: 6px;
    }

    .config-display summary {
      cursor: pointer;
      font-weight: 500;
      color: #374151;
      user-select: none;
    }

    .config-display pre {
      margin-top: 15px;
      padding: 15px;
      background-color: #1f2937;
      color: #f9fafb;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 12px;
    }
  `,
  ],
})
export class AdvancedEditorComponent {
  // JSON for template
  JSON = JSON;

  /**
   * Current document type
   */
  documentType = signal<'blog' | 'report' | 'email'>('blog');

  /**
   * Current theme name
   */
  themeName = signal<'light' | 'dark' | 'custom'>('light');

  /**
   * Current feature level
   */
  featureLevel = signal<'minimal' | 'standard' | 'full'>('standard');

  /**
   * Editor content
   */
  content = signal<string>('');

  /**
   * Computed word count
   */
  wordCount = computed(() => {
    const text = this.content()
      .replace(/<[^>]*>/g, '')
      .trim();
    return text ? text.split(/\s+/).length : 0;
  });

  /**
   * Computed character count
   */
  characterCount = computed(() => {
    return this.content()
      .replace(/<[^>]*>/g, '')
      .trim().length;
  });

  /**
   * Validation limits based on document type
   */
  validationLimits = computed(() => {
    const limits = {
      blog: { minWords: 300, maxWords: 5000, maxCharacters: 20000 },
      report: { minWords: 500, maxWords: 10000, maxCharacters: 50000 },
      email: { minWords: 0, maxWords: 500, maxCharacters: 2000 },
    };
    return limits[this.documentType()];
  });

  /**
   * Validation errors
   */
  validationErrors = computed(() => {
    const errors: string[] = [];
    const limits = this.validationLimits();
    const words = this.wordCount();
    const chars = this.characterCount();

    if (words < limits.minWords) {
      errors.push(
        `Minimum ${limits.minWords} words required (current: ${words})`
      );
    }
    if (words > limits.maxWords) {
      errors.push(
        `Maximum ${limits.maxWords} words exceeded (current: ${words})`
      );
    }
    if (chars > limits.maxCharacters) {
      errors.push(
        `Maximum ${limits.maxCharacters} characters exceeded (current: ${chars})`
      );
    }

    return errors;
  });

  /**
   * Is content valid
   */
  isValid = computed(() => this.validationErrors().length === 0);

  /**
   * Theme configurations
   */
  private themes: Record<string, ThemeConfig> = {
    light: {
      mode: 'light',
      primaryColor: '#3b82f6',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      borderColor: '#e5e7eb',
    },
    dark: {
      mode: 'dark',
      primaryColor: '#60a5fa',
      backgroundColor: '#1f2937',
      textColor: '#f9fafb',
      borderColor: '#374151',
    },
    custom: {
      mode: 'light',
      primaryColor: '#8b5cf6',
      backgroundColor: '#faf5ff',
      textColor: '#3b0764',
      borderColor: '#c4b5fd',
    },
  };

  /**
   * Toolbar configurations based on feature level
   */
  private getToolbarConfig(): ToolbarConfig {
    const level = this.featureLevel();

    // Typed as `Record<string, ToolbarConfig>` (not `Partial<...>` with a cast) so a
    // misspelled flag is an excess-property error at compile time.
    const configs: Record<string, ToolbarConfig> = {
      minimal: {
        showTextFormatting: true,
        showBold: true,
        showItalic: true,
        showUnderline: false,
        showLists: true,
        showOrderedList: true,
        showUnorderedList: true,
        // All other features disabled
        showFontControls: false,
        showLinkMedia: false,
        showTable: false,
        showFullScreen: false,
      },
      standard: {
        showTextFormatting: true,
        showBold: true,
        showItalic: true,
        showUnderline: true,
        showLists: true,
        showAlignment: true,
        showLinkMedia: true,
        showInsertLink: true,
        showInsertImage: true,
        showFullScreen: true,
        // Advanced features disabled
        showTable: false,
        showHtmlEdit: false,
      },
      full: {
        showTextFormatting: true,
        showBold: true,
        showItalic: true,
        showUnderline: true,
        showStrikethrough: true,
        showSubscript: true,
        showSuperscript: true,
        showFontControls: true,
        showFontFamily: true,
        showFontSize: true,
        showTextColor: true,
        showLists: true,
        showOrderedList: true,
        showUnorderedList: true,
        showAlignment: true,
        showAlignLeft: true,
        showAlignCenter: true,
        showAlignRight: true,
        showAlignJustify: true,
        showLinkMedia: true,
        showInsertLink: true,
        showInsertImage: true,
        showYouTubeEmbed: true,
        showVimeoEmbed: true,
        showTwitterEmbed: true,
        showTable: true,
        showHtmlEdit: true,
        showFullScreen: true,
        showUndoRedo: true,
      },
    };

    return configs[level];
  }

  /**
   * Validation configuration based on document type
   */
  private getValidationConfig(): ValidationConfig {
    const limits = this.validationLimits();

    return {
      showWordCount: true,
      showCharacterCount: true,
      showReadingTime: this.documentType() === 'blog',
      minWords: limits.minWords,
      maxWords: limits.maxWords,
      maxCharacters: limits.maxCharacters,
      spellCheck: {
        enabled: true,
        language: 'en-US',
        highlightErrors: this.documentType() !== 'email',
      },
    };
  }

  /**
   * Complete editor configuration (computed)
   */
  editorConfig = computed<EditorConfig>(() => ({
    placeholder: this.getPlaceholder(),
    height: this.getHeight(),
    maxHeight: '600px',
    showToolbar: true,
    toolbarConfig: this.getToolbarConfig(),
    theme: this.themes[this.themeName()],
    validation: this.getValidationConfig(),
    fullScreen: {
      enabled: this.featureLevel() !== 'minimal',
      exitOnEscape: true,
      hideToolbarInFullScreen: false,
      distractionFree: this.featureLevel() === 'full',
    },
  }));

  /**
   * Get placeholder based on document type
   */
  private getPlaceholder(): string {
    const placeholders = {
      blog: 'Write your blog post here...',
      report: 'Start writing your report...',
      email: 'Compose your email...',
    };
    return placeholders[this.documentType()];
  }

  /**
   * Get editor height based on document type
   */
  private getHeight(): string {
    const heights = {
      blog: '400px',
      report: '500px',
      email: '200px',
    };
    return heights[this.documentType()];
  }

  /**
   * Set document type
   */
  setDocumentType(type: 'blog' | 'report' | 'email'): void {
    this.documentType.set(type);
  }

  /**
   * Set theme
   */
  setTheme(theme: 'light' | 'dark' | 'custom'): void {
    this.themeName.set(theme);
  }

  /**
   * Set feature level
   */
  setFeatureLevel(level: 'minimal' | 'standard' | 'full'): void {
    this.featureLevel.set(level);
  }

  /**
   * Handle content changes
   */
  onContentChange(html: string): void {
    this.content.set(html);
  }
}

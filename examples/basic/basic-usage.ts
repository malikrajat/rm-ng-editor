/**
 * Basic Usage Example
 *
 * Minimal working implementation of rm-ng-editor.
 * This example shows the simplest possible setup with default configuration.
 */

import { Component, signal } from '@angular/core';
import { RmNgEditor } from 'rm-ng-editor';

@Component({
  selector: 'app-basic-editor',
  standalone: true,
  imports: [RmNgEditor],
  template: `
    <div class="editor-container">
      <h2>Basic Editor Example</h2>
      
      <!-- The editor component -->
      <app-rm-ng-editor
        (valueChange)="onContentChange($event)"
      />
      
      <!-- Display current content -->
      <div class="output">
        <h3>Current Content:</h3>
        <pre>{{ content() }}</pre>
      </div>
    </div>
  `,
  styles: [
    `
    .editor-container {
      max-width: 800px;
      margin: 20px auto;
      padding: 20px;
    }

    h2 {
      color: #1f2937;
      margin-bottom: 20px;
    }

    .output {
      margin-top: 30px;
      padding: 20px;
      background-color: #f3f4f6;
      border-radius: 8px;
    }

    .output h3 {
      margin-top: 0;
      color: #374151;
    }

    pre {
      background-color: #ffffff;
      padding: 15px;
      border-radius: 4px;
      overflow-x: auto;
      font-family: 'Courier New', monospace;
      font-size: 14px;
    }
  `,
  ],
})
export class BasicEditorComponent {
  /**
   * Signal to store editor content
   * Reactive - automatically updates UI when changed
   */
  content = signal<string>('');

  /**
   * Handle content changes from the editor
   * Called on every keystroke or formatting change
   *
   * @param html - The current HTML content from the editor
   */
  onContentChange(html: string): void {
    this.content.set(html);
    console.log('Content updated:', html);
  }
}

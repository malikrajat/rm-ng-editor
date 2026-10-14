import * as _angular_core from '@angular/core';
import { InjectionToken, OnInit, OnDestroy, ElementRef } from '@angular/core';

interface EditorConfig {
    placeholder?: string;
    disabled?: boolean;
    height?: string;
    maxHeight?: string;
    showToolbar?: boolean;
    enabledTools?: string[];
    toolbarConfig?: ToolbarConfig;
    validation?: ValidationConfig;
    theme?: ThemeConfig;
    fullScreen?: FullScreenConfig;
    table?: TableConfig;
}
interface EditorState {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
    subscript: boolean;
    superscript: boolean;
    fontSize: string;
    fontFamily: string;
    textColor: string;
    alignment: string;
    heading: string;
    listType: string;
}
interface LinkData {
    url: string;
    text: string;
    target: '_blank' | '_self' | '_parent' | '_top';
    title?: string;
}
interface MediaEmbedData {
    type: 'youtube' | 'twitter' | 'instagram' | 'vimeo' | 'custom';
    url: string;
    embedCode?: string;
    width?: string;
    height?: string;
    previewUrl?: string;
    title?: string;
}
interface LinkPreview {
    url: string;
    title?: string;
    description?: string;
    image?: string;
    domain?: string;
}
interface TableData {
    rows: number;
    columns: number;
    cells: TableCell[][];
    style?: {
        width?: string;
        height?: string;
        borderCollapse?: string;
        border?: string;
    };
}
interface TableCell {
    content: string;
    style?: CellStyle;
    colspan?: number;
    rowspan?: number;
    isHeader?: boolean;
}
interface TableStyle {
    width?: string;
    height?: string;
    borderCollapse?: string;
    border?: string;
    backgroundColor?: string;
    margin?: string;
}
interface CellStyle {
    padding?: string;
    border?: string;
    backgroundColor?: string;
    textAlign?: string;
    verticalAlign?: string;
    fontWeight?: string;
    color?: string;
    width?: string;
    height?: string;
}
interface WordCountStats {
    words: number;
    characters: number;
    charactersNoSpaces: number;
    paragraphs: number;
    sentences: number;
    readingTime: number;
}
interface SpellCheckSuggestion {
    word: string;
    suggestions: string[];
    position: {
        start: number;
        end: number;
    };
    startOffset: number;
    endOffset?: number;
    description?: string;
    type?: string;
}
interface ValidationConfig {
    showWordCount?: boolean;
    showCharacterCount?: boolean;
    showReadingTime?: boolean;
    maxWords?: number;
    maxCharacters?: number;
    minWords?: number;
    minCharacters?: number;
    spellCheck?: {
        enabled?: boolean;
        language?: string;
        highlightErrors?: boolean;
        showSuggestions?: boolean;
        ignoredWords?: string[];
        customDictionary?: string[];
    };
}
interface ThemeConfig {
    mode?: 'light' | 'dark' | 'auto';
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    customCss?: string;
}
interface FullScreenConfig {
    enabled?: boolean;
    hideToolbarInFullScreen?: boolean;
    exitOnEscape?: boolean;
    distractionFree?: boolean;
}
interface TableConfig {
    enabled?: boolean;
    defaultRows?: number;
    defaultColumns?: number;
    maxRows?: number;
    maxColumns?: number;
    resizable?: boolean;
    sortable?: boolean;
    allowAddDelete?: boolean;
    allowResize?: boolean;
    cellPadding?: string;
    borderWidth?: string;
    borderColor?: string;
    headerBackgroundColor?: string;
    alternateRowColor?: boolean;
    showBorders?: boolean;
    showGridLines?: boolean;
    cellMinWidth?: string;
    cellMinHeight?: string;
    allowMerge?: boolean;
    allowSplit?: boolean;
    tableClasses?: string[];
}
interface ToolbarConfig {
    showTextFormatting?: boolean;
    showBold?: boolean;
    showItalic?: boolean;
    showUnderline?: boolean;
    showStrikethrough?: boolean;
    showScriptFormatting?: boolean;
    showSubscript?: boolean;
    showSuperscript?: boolean;
    showFontControls?: boolean;
    showFontFamily?: boolean;
    showFontSize?: boolean;
    showColorControls?: boolean;
    showTextColor?: boolean;
    showHeadings?: boolean;
    showBlockFormatting?: boolean;
    showAlignment?: boolean;
    showAlignLeft?: boolean;
    showAlignCenter?: boolean;
    showAlignRight?: boolean;
    showAlignJustify?: boolean;
    showLists?: boolean;
    showUnorderedList?: boolean;
    showOrderedList?: boolean;
    showIndent?: boolean;
    showOutdent?: boolean;
    showIndentIncrease?: boolean;
    showUndoRedo?: boolean;
    showUndo?: boolean;
    showRedo?: boolean;
    showClearFormatting?: boolean;
    showPageBreak?: boolean;
    showSectionDivider?: boolean;
    showLinkMedia?: boolean;
    showInsertLink?: boolean;
    showEditLink?: boolean;
    showRemoveLink?: boolean;
    showLinkTarget?: boolean;
    showMediaEmbed?: boolean;
    showInsertImage?: boolean;
    showInsertVideo?: boolean;
    showInsertAudio?: boolean;
    showYouTubeEmbed?: boolean;
    showTwitterEmbed?: boolean;
    showInstagramEmbed?: boolean;
    showVimeoEmbed?: boolean;
    showCustomEmbed?: boolean;
    showLinkPreview?: boolean;
    showValidation?: boolean;
    showWordCount?: boolean;
    showCharacterCount?: boolean;
    showReadingTime?: boolean;
    showSpellCheck?: boolean;
    showViewMode?: boolean;
    showFullScreen?: boolean;
    showThemeToggle?: boolean;
    showDistractionFree?: boolean;
    showTable?: boolean;
    showInsertTable?: boolean;
    showTableProperties?: boolean;
    showInsertRow?: boolean;
    showInsertColumn?: boolean;
    showDeleteRow?: boolean;
    showDeleteColumn?: boolean;
    showMergeCells?: boolean;
    showSplitCells?: boolean;
    showTableResize?: boolean;
    showDeleteTable?: boolean;
    showAccessibility?: boolean;
    showHtmlEdit?: boolean;
    showKeyboardShortcuts?: boolean;
}
interface ToolbarIcons {
    bold?: string;
    italic?: string;
    underline?: string;
    strikethrough?: string;
    subscript?: string;
    superscript?: string;
    pageBreak?: string;
    sectionDivider?: string;
    alignLeft?: string;
    alignCenter?: string;
    alignRight?: string;
    alignJustify?: string;
    unorderedList?: string;
    orderedList?: string;
    outdent?: string;
    indent?: string;
    undo?: string;
    redo?: string;
    clearFormatting?: string;
    insertLink?: string;
    editLink?: string;
    removeLink?: string;
    mediaEmbed?: string;
    insertImage?: string;
    insertVideo?: string;
    insertAudio?: string;
    youtubeEmbed?: string;
    twitterEmbed?: string;
    instagramEmbed?: string;
    vimeoEmbed?: string;
    customEmbed?: string;
    linkPreview?: string;
    wordCount?: string;
    characterCount?: string;
    readingTime?: string;
    spellCheck?: string;
    spellCheckError?: string;
    fullScreen?: string;
    exitFullScreen?: string;
    darkTheme?: string;
    lightTheme?: string;
    distractionFree?: string;
    insertTable?: string;
    tableProperties?: string;
    insertRowAbove?: string;
    insertRowBelow?: string;
    insertColumnLeft?: string;
    insertColumnRight?: string;
    deleteRow?: string;
    deleteColumn?: string;
    mergeCells?: string;
    splitCells?: string;
    tableResizeSmaller?: string;
    tableResizeLarger?: string;
    tableReset?: string;
    deleteTable?: string;
    htmlEdit?: string;
    accessibility?: string;
    keyboardShortcuts?: string;
}
declare const DEFAULT_TOOLBAR_CONFIG: ToolbarConfig;
declare const DEFAULT_TOOLBAR_ICONS: ToolbarIcons;
declare const DEFAULT_THEME_CONFIG: ThemeConfig;
declare const DEFAULT_FULLSCREEN_CONFIG: FullScreenConfig;
declare const DEFAULT_VALIDATION_CONFIG: ValidationConfig;
declare const DEFAULT_TABLE_CONFIG: TableConfig;

declare const EDITOR_DEFAULT_CONFIG: InjectionToken<ToolbarConfig>;
declare const EDITOR_DEFAULT_ICONS: InjectionToken<ToolbarIcons>;
declare const EDITOR_PERFORMANCE_CONFIG: InjectionToken<{
    debounceDelay: number;
    chunkSize: number;
    maxContentSize: number;
}>;
/**
 * High-Performance Rich Text Editor Component
 *
 * PERFORMANCE OPTIMIZATIONS IMPLEMENTED:
 *
 * 1. Memory Leak Prevention:
 *    - Proper cleanup of event listeners, timeouts, and intervals
 *    - Automatic observer disconnection (MutationObserver, ResizeObserver, IntersectionObserver)
 *    - DOM reference cleanup to prevent retention
 *    - Effect cleanup using Angular's DestroyRef
 *
 * 2. Performance Optimizations:
 *    - Debounced methods for expensive operations (word count, spell check)
 *    - Intersection observer for visibility-based optimization
 *    - Batched DOM updates using requestAnimationFrame
 *    - Content chunking for large text processing
 *    - OnPush change detection strategy
 *
 * 3. DOM Optimization:
 *    - Safe event listener wrappers with automatic cleanup
 *    - DocumentFragment for efficient DOM manipulation
 *    - Lazy loading for heavy features
 *    - Mutation observer for efficient content change detection
 *
 * 4. Resource Management:
 *    - Timeout/interval tracking and cleanup
 *    - Pause/resume operations based on visibility
 *    - Enhanced cleanup for complex DOM structures
 *    - Memory-conscious content processing
 */
declare class RmNgEditor implements OnInit, OnDestroy {
    private readonly destroyRef;
    private readonly injector;
    private readonly platformId;
    private readonly rendererFactory;
    private readonly defaultConfig;
    private readonly defaultIcons;
    private readonly perfConfig;
    editorElement: _angular_core.Signal<ElementRef<HTMLDivElement>>;
    toolbarElement: _angular_core.Signal<ElementRef<HTMLDivElement> | undefined>;
    private readonly resourceCleanup;
    private readonly observerCleanup;
    private readonly renderer;
    private readonly performanceManager;
    constructor();
    private createPerformanceManager;
    content: _angular_core.WritableSignal<string>;
    disabled: _angular_core.WritableSignal<boolean>;
    placeholder: _angular_core.WritableSignal<string>;
    height: _angular_core.WritableSignal<string>;
    maxHeight: _angular_core.WritableSignal<string>;
    showToolbar: _angular_core.WritableSignal<boolean>;
    private configSignal;
    toolbarConfig: _angular_core.Signal<ToolbarConfig>;
    toolbarIcons: _angular_core.Signal<ToolbarIcons>;
    editorState: _angular_core.WritableSignal<EditorState>;
    config: _angular_core.InputSignal<EditorConfig | null>;
    value: _angular_core.InputSignal<string>;
    valueChange: _angular_core.OutputEmitterRef<string>;
    focusEvent: _angular_core.OutputEmitterRef<void>;
    blurEvent: _angular_core.OutputEmitterRef<void>;
    stateChange: _angular_core.OutputEmitterRef<EditorState>;
    wordCountChange: _angular_core.OutputEmitterRef<WordCountStats>;
    spellCheckResults: _angular_core.OutputEmitterRef<SpellCheckSuggestion[]>;
    fullScreenChange: _angular_core.OutputEmitterRef<boolean>;
    themeChange: _angular_core.OutputEmitterRef<string>;
    tableInsert: _angular_core.OutputEmitterRef<TableData>;
    tableModify: _angular_core.OutputEmitterRef<TableData>;
    wordCountStats: _angular_core.WritableSignal<WordCountStats>;
    isFullScreen: _angular_core.WritableSignal<boolean>;
    isDistractionFree: _angular_core.WritableSignal<boolean>;
    currentTheme: _angular_core.WritableSignal<"light" | "dark" | "auto">;
    isHtmlEditMode: _angular_core.WritableSignal<boolean>;
    showShortcutsModal: _angular_core.WritableSignal<boolean>;
    private htmlContent;
    shouldShowStats: _angular_core.Signal<boolean | undefined>;
    private isUpdatingContent;
    private isDestroyed;
    private debounceTimeouts;
    selectedTable: _angular_core.WritableSignal<HTMLTableElement | null>;
    tableConfig: _angular_core.WritableSignal<TableConfig>;
    spellCheckSuggestions: _angular_core.WritableSignal<SpellCheckSuggestion[]>;
    validationConfig: _angular_core.WritableSignal<ValidationConfig>;
    private validationConfigEffect;
    private updateStateEffect;
    private configEffect;
    private valueEffect;
    ngOnInit(): void;
    ngOnDestroy(): void;
    private safeTimeout;
    private safeInterval;
    private safeAddEventListener;
    private debounce;
    private debouncedUpdateEditorState;
    private debouncedUpdateWordCount;
    private debouncedRunSpellCheck;
    private resizeObserver?;
    execCommand(command: string, value?: string): void;
    setFontFamily(event: Event): void;
    setFontSize(event: Event): void;
    setTextColor(event: Event): void;
    setHeading(event: Event): void;
    setAlignment(command: string): void;
    toggleList(command: string): void;
    clearFormatting(): void;
    insertPageBreak(): void;
    insertSectionDivider(): void;
    insertImage(): void;
    insertVideo(): void;
    insertAudio(): void;
    setHeadingByTag(tag: string): void;
    changeFontSize(delta: number): void;
    insertLink(): void;
    editLink(): void;
    removeLink(): void;
    embedYouTube(): void;
    embedTwitter(): void;
    embedInstagram(): void;
    embedVimeo(): void;
    embedCustomMedia(): void;
    private insertHtml;
    private extractYouTubeId;
    private extractVimeoId;
    generateLinkPreview(url: string): void;
    onContentChange(): void;
    updateWordCount(): void;
    private calculateWordCount;
    runSpellCheck(): void;
    private performSpellCheck;
    isContentValid(): boolean;
    getValidationErrors(): string[];
    toggleSpellCheck(): void;
    acceptSpellingSuggestion(originalWord: string, suggestion: string): void;
    ignoreSpellingSuggestion(word: string): void;
    onKeyDown(event: KeyboardEvent): void;
    private isFeatureEnabled;
    updateEditorState(): void;
    private getCurrentAlignment;
    private getCurrentHeading;
    private getCurrentListType;
    onFocus(): void;
    onBlur(): void;
    getContent(): string;
    setContent(content: string): void;
    getTextContent(): string;
    isEmpty(): boolean;
    focus(): void;
    refreshWordCount(): void;
    getPerformanceMetrics(): {
        activeResources: number;
        debounceTimeouts: number;
        isOptimized: boolean;
        memoryUsage?: number;
    };
    checkForMemoryLeaks(): void;
    private initializePerformanceOptimizations;
    private setupIntersectionObserver;
    private setupResizeObserver;
    private setupMutationObserver;
    private isOperationsPaused;
    private pausePerformanceIntensiveOperations;
    private resumePerformanceIntensiveOperations;
    private handleEditorResize;
    private createDocumentFragment;
    private batchDOMUpdates;
    private readonly MAX_CONTENT_SIZE;
    private readonly CHUNK_SIZE;
    private processLargeContent;
    private lazyLoadFeature;
    private cleanupDOMReferences;
    blur(): void;
    toggleFullScreen(): void;
    enterFullScreen(): void;
    exitFullScreen(): void;
    private escapeKeyHandler;
    private addFullScreenListeners;
    private removeFullScreenListeners;
    private handleEscapeKey;
    toggleTheme(): void;
    setTheme(theme: 'light' | 'dark' | 'auto'): void;
    private handleAutoTheme;
    toggleDistractionFree(): void;
    private applyThemeConfig;
    private applyCustomTheme;
    insertTable(rows?: number, columns?: number): void;
    insertRowAbove(): void;
    insertRowBelow(): void;
    insertColumnLeft(): void;
    insertColumnRight(): void;
    deleteRow(): void;
    deleteColumn(): void;
    private extractTableData;
    private updateTableData;
    private copyTableCellStyles;
    private validateCellsForMerging;
    splitCells(): void;
    private addTableEventListeners;
    private refreshCellEventListeners;
    private startCellSelection;
    resizeTableSmaller(): void;
    resizeTableLarger(): void;
    resetTableSize(): void;
    deleteTable(): void;
    private applyDefaultCellStyles;
    private addTableResizeHandles;
    private removeTableResizeHandles;
    private addHandleDragEvents;
    private initializeAllTables;
    toggleHtmlEdit(): void;
    getHtmlContent(): string;
    updateHtmlContent(event: Event): void;
    applyHtmlChanges(): void;
    showKeyboardShortcuts(): void;
    hideKeyboardShortcuts(): void;
    private handleAccessibilityKeyDown;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<RmNgEditor, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<RmNgEditor, "app-rm-ng-editor", never, { "config": { "alias": "config"; "required": false; "isSignal": true; }; "value": { "alias": "value"; "required": false; "isSignal": true; }; }, { "valueChange": "valueChange"; "focusEvent": "focusEvent"; "blurEvent": "blurEvent"; "stateChange": "stateChange"; "wordCountChange": "wordCountChange"; "spellCheckResults": "spellCheckResults"; "fullScreenChange": "fullScreenChange"; "themeChange": "themeChange"; "tableInsert": "tableInsert"; "tableModify": "tableModify"; }, never, never, true, never>;
}

/**
 * Keyboard shortcut configuration interface
 */
interface KeyboardShortcutConfig {
    key: string;
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
    action: string;
    enabled?: boolean;
    conflictsWith?: string[];
}
/**
 * Platform-specific keyboard configuration
 */
interface PlatformKeyboardConfig {
    mac: KeyboardShortcutConfig[];
    windows: KeyboardShortcutConfig[];
    linux: KeyboardShortcutConfig[];
    global: KeyboardShortcutConfig[];
}
/**
 * Keyboard Shortcut Manager - handles all keyboard shortcuts
 * Prevents conflicts with browser shortcuts and supports configuration
 */
declare class KeyboardShortcutManager {
    private static shortcuts;
    private static disabledShortcuts;
    private static customShortcuts;
    private static shortcutConflicts;
    private static readonly BROWSER_SHORTCUTS;
    /**
     * Initialize default shortcuts
     */
    static initializeDefaults(): void;
    /**
     * Register a keyboard shortcut
     */
    static registerShortcut(config: KeyboardShortcutConfig): void;
    /**
     * Register custom shortcut
     */
    static registerCustomShortcut(config: KeyboardShortcutConfig): boolean;
    /**
     * Get shortcut configuration by action
     */
    static getShortcut(action: string): KeyboardShortcutConfig | undefined;
    /**
     * Handle keyboard event and return matching shortcut action
     */
    static handleKeyboardEvent(event: KeyboardEvent): string | null;
    /**
     * Disable a shortcut
     */
    static disableShortcut(action: string): void;
    /**
     * Enable a shortcut
     */
    static enableShortcut(action: string): void;
    /**
     * Check if shortcut is enabled
     */
    static isShortcutEnabled(action: string): boolean;
    /**
     * Find a shortcut by action, regardless of its enabled/disabled state
     */
    private static findShortcutByAction;
    /**
     * Get all shortcuts
     */
    static getAllShortcuts(): KeyboardShortcutConfig[];
    /**
     * Reset to default shortcuts
     */
    static resetToDefaults(): void;
    /**
     * Build a unique key for a shortcut configuration
     */
    private static buildShortcutKey;
    /**
     * Check if keyboard event matches configuration
     */
    private static matchesEvent;
    /**
     * Check if shortcut has browser conflict
     */
    private static hasBrowserConflict;
    /**
     * Get all shortcuts with conflicts
     */
    static getConflictingShortcuts(): Map<string, string[]>;
    /**
     * Clear all shortcuts
     */
    static clearAllShortcuts(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<KeyboardShortcutManager, never>;
    static ɵprov: _angular_core.ɵɵInjectableDeclaration<KeyboardShortcutManager>;
}
/**
 * Platform-Aware Shortcut Handler
 * Handles platform-specific keyboard shortcuts (Mac Cmd vs Windows Ctrl)
 */
declare class PlatformAwareShortcutHandler {
    private static currentPlatform;
    private static platformShortcuts;
    /**
     * Detect and set current platform
     */
    static detectPlatform(): 'mac' | 'windows' | 'linux';
    /**
     * Get current platform
     */
    static getPlatform(): 'mac' | 'windows' | 'linux';
    /**
     * Set platform explicitly
     */
    static setPlatform(platform: 'mac' | 'windows' | 'linux'): void;
    /**
     * Check if platform is Mac
     */
    static isMac(): boolean;
    /**
     * Check if platform is Windows
     */
    static isWindows(): boolean;
    /**
     * Check if platform is Linux
     */
    static isLinux(): boolean;
    /**
     * Normalize shortcut for current platform
     * Converts Ctrl+X to Cmd+X on Mac, etc.
     */
    static normalizePlatformShortcut(event: KeyboardEvent): KeyboardEvent;
    /**
     * Check if modifier key is pressed (Ctrl on Windows, Cmd on Mac)
     */
    static isPrimaryModifierPressed(event: KeyboardEvent): boolean;
    /**
     * Check if secondary modifier key is pressed
     */
    static isSecondaryModifierPressed(event: KeyboardEvent): boolean;
    /**
     * Get platform-specific shortcut string for display
     */
    static getDisplayShortcut(action: string): string;
}
/**
 * Keyboard Layout Handler
 * Handles non-QWERTY keyboard layouts
 */
declare class KeyboardLayoutHandler {
    private static detectedLayout;
    private static layoutKeyMap;
    private static isLayoutDetected;
    /**
     * Detect keyboard layout
     */
    static detectLayout(): string;
    /**
     * Get current keyboard layout
     */
    static getLayout(): string;
    /**
     * Set keyboard layout explicitly
     */
    static setLayout(layout: string): void;
    /**
     * Check if layout is QWERTY
     */
    static isQWERTY(): boolean;
    /**
     * Check if layout is AZERTY
     */
    static isAZERTY(): boolean;
    /**
     * Check if layout is QWERTZ
     */
    static isQWERTZ(): boolean;
    /**
     * Check if layout is Dvorak
     */
    static isDvorak(): boolean;
    /**
     * Map key event to character for current layout
     */
    static mapKeyToCharacter(event: KeyboardEvent): string;
    /**
     * Setup layout-specific key mapping
     */
    private static setupLayoutMap;
    /**
     * Check if keyboard layout change was detected
     */
    static hasLayoutDetectionSupport(): boolean;
    /**
     * Get all supported layouts
     */
    static getSupportedLayouts(): string[];
    /**
     * Map character back to physical key (for display purposes)
     */
    static getPhysicalKeyName(event: KeyboardEvent): string;
}
/**
 * Service for managing editor utilities and helper functions
 */
declare class RmNgEditorService {
    private readonly MAX_CONTENT_SIZE;
    /**
     * Converts HTML content to plain text
     * Handles null/undefined inputs safely
     */
    htmlToText(html: string | null | undefined): string;
    /**
     * Enhanced sanitization with XSS protection
     * Handles null/undefined inputs and large content
     */
    sanitizeHtml(html: string | null | undefined): string;
    /**
     * Remove dangerous SVG event handlers
     */
    private sanitizeSvgElements;
    /**
     * Remove dangerous attributes from element
     */
    private removeDangerousAttributes;
    /**
     * Sanitize inline styles to prevent CSS-based attacks
     */
    private sanitizeStyleAttribute;
    /**
     * Sanitize data URIs in attributes
     */
    private sanitizeDataUris;
    /**
     * Enhanced word counting with Unicode support
     * Handles emoji, CJK characters, and special cases
     */
    getWordCount(html: string | null | undefined): number;
    /**
     * Internal word counting logic with advanced Unicode support
     * Properly handles:
     * - Zero-width characters (removed)
     * - Emoji (counted as single character)
     * - CJK characters (each character = 1 word)
     * - Latin text (space-separated = 1 word)
     * - Diacritics and combining marks (preserved)
     */
    private countWords;
    /**
     * Counts characters in HTML content
     * Handles null/undefined inputs
     */
    getCharacterCount(html: string | null | undefined): number;
    /**
     * Extracts headings from HTML content
     * Handles null/undefined inputs
     */
    extractHeadings(html: string | null | undefined): {
        level: number;
        text: string;
        id?: string;
    }[];
    /**
     * Enhanced validation with comprehensive whitespace detection
     * Handles null/undefined inputs and various whitespace scenarios
     */
    validateContent(html: string | null | undefined): {
        isValid: boolean;
        errors: string[];
    };
    /**
     * Normalize whitespace by removing various whitespace types
     * Handles: regular spaces, tabs, newlines, non-breaking spaces, etc.
     */
    private normalizeWhitespace;
    /**
     * Converts content to different formats
     */
    convertToFormat(html: string, format: 'text' | 'markdown'): string;
    /**
     * Basic HTML to Markdown conversion
     */
    private htmlToMarkdown;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<RmNgEditorService, never>;
    static ɵprov: _angular_core.ɵɵInjectableDeclaration<RmNgEditorService>;
}
/**
 * Optimized spell check manager with debouncing and performance controls
 * Prevents spell check from running on every content change
 * Supports custom dictionaries and ignored words
 */
declare class SpellCheckManager {
    private static lastCheckTime;
    private static debounceDelay;
    private static ignoredWords;
    private static customDictionary;
    private static isRunning;
    private static minContentLength;
    /**
     * Configure the spell checker
     */
    static configure(config: {
        debounceDelay?: number;
        ignoredWords?: string[];
        customDictionary?: string[];
        minContentLength?: number;
    }): void;
    /**
     * Check if spell check should run based on debounce and content length
     */
    static shouldRunCheck(contentLength: number): boolean;
    /**
     * Mark check as started
     */
    static markCheckStart(): void;
    /**
     * Mark check as completed
     */
    static markCheckEnd(): void;
    /**
     * Perform spell check on text content
     * Returns array of misspelled words with positions
     */
    static checkSpelling(text: string): {
        word: string;
        position: number;
        suggestions: string[];
    }[];
    /**
     * Get suggestions for a misspelled word
     * This is a placeholder - integrate with real spell checker
     */
    private static getSuggestions;
    /**
     * Add word to custom dictionary
     */
    static addToCustomDictionary(word: string): void;
    /**
     * Remove word from custom dictionary
     */
    static removeFromCustomDictionary(word: string): void;
    /**
     * Add word to ignored words (won't be checked)
     */
    static addToIgnoredWords(word: string): void;
    /**
     * Reset all configurations
     */
    static reset(): void;
}
/**
 * Enhanced table selection manager to prevent conflicts
 * Ensures only one table is selected at a time and properly cleans up
 */
declare class TableSelectionManager {
    private static activeTable;
    private static activeEditor;
    /**
     * Select a table and ensure all others are deselected
     */
    static selectTable(table: HTMLTableElement, editorElement: HTMLElement): void;
    /**
     * Clear all table selections across the editor
     */
    static clearAllSelections(): void;
    /**
     * Get the currently selected table
     */
    static getSelectedTable(): HTMLTableElement | null;
    /**
     * Check if a table is currently selected
     */
    static isTableSelected(table: HTMLTableElement): boolean;
    /**
     * Clear all state (useful for cleanup)
     */
    static reset(): void;
}
/**
 * Advanced cell merge validator
 * Prevents table structure corruption from invalid merge operations
 */
declare class CellMergeValidator {
    /**
     * Validate if cells can be safely merged
     */
    static canMergeCells(cells: HTMLTableCellElement[]): {
        valid: boolean;
        reason?: string;
    };
    /**
     * Validate if a merged cell can be safely split
     */
    static canSplitCell(cell: HTMLTableCellElement): {
        valid: boolean;
        reason?: string;
    };
    /**
     * Check for nested tables and prevent operations
     */
    static hasNestedTables(table: HTMLTableElement): boolean;
}
/**
 * Nested table detector and sanitizer
 * Prevents nested tables from breaking editor functionality
 */
declare class NestedTableSanitizer {
    /**
     * Detect if content contains nested tables
     */
    static hasNestedTables(html: string): boolean;
    /**
     * Remove nested tables from HTML content
     */
    static removeNestedTables(html: string): string;
    /**
     * Flatten nested tables - convert inner tables to div structures
     */
    static flattenNestedTables(html: string): string;
    /**
     * Prevent insertion of nested tables
     */
    static preventNestedTableInsertion(targetElement: HTMLElement, htmlToInsert: string): boolean;
    /**
     * Check if target element is inside a table
     */
    static isInsideTable(element: HTMLElement): boolean;
}

export { CellMergeValidator, DEFAULT_FULLSCREEN_CONFIG, DEFAULT_TABLE_CONFIG, DEFAULT_THEME_CONFIG, DEFAULT_TOOLBAR_CONFIG, DEFAULT_TOOLBAR_ICONS, DEFAULT_VALIDATION_CONFIG, EDITOR_DEFAULT_CONFIG, EDITOR_DEFAULT_ICONS, EDITOR_PERFORMANCE_CONFIG, KeyboardLayoutHandler, KeyboardShortcutManager, NestedTableSanitizer, PlatformAwareShortcutHandler, RmNgEditor, RmNgEditorService, SpellCheckManager, TableSelectionManager };
export type { CellStyle, EditorConfig, EditorState, FullScreenConfig, KeyboardShortcutConfig, LinkData, LinkPreview, MediaEmbedData, PlatformKeyboardConfig, SpellCheckSuggestion, TableCell, TableConfig, TableData, TableStyle, ThemeConfig, ToolbarConfig, ToolbarIcons, ValidationConfig, WordCountStats };

import * as i0 from '@angular/core';
import { Injectable, InjectionToken, inject, DestroyRef, Injector, PLATFORM_ID, RendererFactory2, viewChild, signal, computed, input, output, effect, ChangeDetectionStrategy, Component } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const DEFAULT_TOOLBAR_CONFIG = {
    // Text Formatting Group
    showTextFormatting: true,
    showBold: true,
    showItalic: true,
    showUnderline: true,
    showStrikethrough: true,
    // Script Formatting Group
    showScriptFormatting: true,
    showSubscript: true,
    showSuperscript: true,
    // Font Controls Group
    showFontControls: true,
    showFontFamily: true,
    showFontSize: true,
    // Color Controls Group
    showColorControls: true,
    showTextColor: true,
    // Headings Group
    showHeadings: true,
    // Block Formatting Group
    showBlockFormatting: true,
    // Alignment Group
    showAlignment: true,
    showAlignLeft: true,
    showAlignCenter: true,
    showAlignRight: true,
    showAlignJustify: true,
    // Lists Group
    showLists: true,
    showUnorderedList: true,
    showOrderedList: true,
    // Indent Group
    showIndent: true,
    showOutdent: true,
    showIndentIncrease: true,
    // Undo/Redo Group
    showUndoRedo: true,
    showUndo: true,
    showRedo: true,
    // Clear Formatting Group
    showClearFormatting: true,
    showPageBreak: true,
    showSectionDivider: true,
    // Link & Media Group
    showLinkMedia: true,
    showInsertLink: true,
    showEditLink: true,
    showRemoveLink: true,
    showLinkTarget: true,
    showInsertImage: true,
    showInsertVideo: true,
    showInsertAudio: true,
    showMediaEmbed: true,
    showYouTubeEmbed: true,
    showTwitterEmbed: true,
    showInstagramEmbed: true,
    showVimeoEmbed: true,
    showCustomEmbed: true,
    showLinkPreview: true,
    // Validation & Stats Group
    showValidation: true,
    showWordCount: true,
    showCharacterCount: true,
    showReadingTime: true,
    showSpellCheck: true,
    // View & Mode Group
    showViewMode: true,
    showFullScreen: true,
    showThemeToggle: true,
    showDistractionFree: false,
    // Table Group
    showTable: true,
    showInsertTable: true,
    showTableProperties: true,
    showInsertRow: true,
    showInsertColumn: true,
    showDeleteRow: true,
    showDeleteColumn: true,
    showMergeCells: true,
    showSplitCells: true,
    showTableResize: true,
    showDeleteTable: true,
    // Accessibility & HTML Editing Group
    showAccessibility: true,
    showHtmlEdit: true,
    showKeyboardShortcuts: true,
};
const DEFAULT_TOOLBAR_ICONS = {
    // Text Formatting Icons
    bold: '𝐁',
    italic: '𝐼',
    underline: '𝐔',
    strikethrough: '𝐒',
    // Script Formatting Icons
    subscript: 'X₂',
    superscript: 'X²',
    pageBreak: '📄',
    sectionDivider: '━━━',
    // Alignment Icons
    alignLeft: '⌐',
    alignCenter: '≡',
    alignRight: '¬',
    alignJustify: '≣',
    // List Icons
    unorderedList: '•',
    orderedList: '1.',
    // Indent Icons
    outdent: '⇤',
    indent: '⇥',
    // Undo/Redo Icons
    undo: '↶',
    redo: '↷',
    // Clear Formatting Icon
    clearFormatting: '✘',
    // Link & Media Icons
    insertLink: '🔗',
    editLink: '✏️',
    removeLink: '🚫',
    mediaEmbed: '📺',
    insertImage: '🖼️',
    insertVideo: '🎥',
    insertAudio: '🎵',
    youtubeEmbed: '📹',
    twitterEmbed: '🐦',
    instagramEmbed: '📷',
    vimeoEmbed: '🎬',
    customEmbed: '🎞️',
    linkPreview: '👁️',
    // Validation & Stats Icons
    wordCount: '📊',
    characterCount: '🔤',
    readingTime: '⏱️',
    spellCheck: '📝',
    spellCheckError: '🔴',
    // View & Mode Icons
    fullScreen: '⛶',
    exitFullScreen: '⊟',
    darkTheme: '🌙',
    lightTheme: '☀️',
    distractionFree: '📄',
    // Table Icons - Structure
    insertTable: '📋',
    tableProperties: '⚙️',
    // Table Icons - Rows
    insertRowAbove: '⬆️',
    insertRowBelow: '⬇️',
    deleteRow: '➖',
    // Table Icons - Columns
    insertColumnLeft: '⬅️',
    insertColumnRight: '➡️',
    deleteColumn: '✂️',
    // Table Icons - Cells
    mergeCells: '⬚',
    splitCells: '⬜',
    // Table Icons - Resize & Delete
    tableResizeSmaller: '🔽',
    tableResizeLarger: '🔼',
    tableReset: '🔃',
    deleteTable: '🗑️',
    // Accessibility & HTML Editing Icons
    htmlEdit: '🔧',
    accessibility: '♿',
    keyboardShortcuts: '⌨️',
};
// Default theme configuration
const DEFAULT_THEME_CONFIG = {
    mode: 'light',
};
// Default full-screen configuration
const DEFAULT_FULLSCREEN_CONFIG = {
    enabled: true,
    hideToolbarInFullScreen: false,
    exitOnEscape: true,
    distractionFree: false,
};
// Default validation configuration
const DEFAULT_VALIDATION_CONFIG = {
    showWordCount: true,
    showCharacterCount: true,
    showReadingTime: true,
    spellCheck: {
        enabled: false,
        language: 'en-US',
        highlightErrors: true,
        showSuggestions: true,
    },
};
// Default table configuration
const DEFAULT_TABLE_CONFIG = {
    enabled: true,
    defaultRows: 3,
    defaultColumns: 3,
    maxRows: 50,
    maxColumns: 20,
    resizable: true,
    sortable: false,
    allowAddDelete: true,
    cellPadding: '8px',
    borderWidth: '1px',
    borderColor: '#ddd',
    showBorders: true,
    showGridLines: true,
    cellMinWidth: '50px',
    cellMinHeight: '25px',
    allowMerge: true,
    allowSplit: true,
};

/**
 * Keyboard Shortcut Manager - handles all keyboard shortcuts
 * Prevents conflicts with browser shortcuts and supports configuration
 */
class KeyboardShortcutManager {
    static shortcuts = new Map();
    static disabledShortcuts = new Set();
    static customShortcuts = new Map();
    static shortcutConflicts = new Map();
    // Browser shortcuts that should be avoided/preserved
    static BROWSER_SHORTCUTS = new Set([
        'ctrl+s', // Save
        'ctrl+p', // Print
        'ctrl+q', // Quit browser
        'ctrl+w', // Close tab
        'ctrl+n', // New window
        'ctrl+t', // New tab
        'cmd+s', // Save (Mac)
        'cmd+p', // Print (Mac)
        'cmd+q', // Quit (Mac)
        'cmd+w', // Close tab (Mac)
        'cmd+n', // New window (Mac)
        'cmd+t', // New tab (Mac)
        'alt+f4', // Close window
        'alt+tab', // Switch window
        'cmd+tab', // Switch app (Mac)
    ]);
    /**
     * Initialize default shortcuts
     */
    static initializeDefaults() {
        const defaults = [
            // Text formatting
            { key: 'b', ctrlKey: true, metaKey: true, action: 'bold', enabled: true },
            {
                key: 'i',
                ctrlKey: true,
                metaKey: true,
                action: 'italic',
                enabled: true,
            },
            {
                key: 'u',
                ctrlKey: true,
                metaKey: true,
                action: 'underline',
                enabled: true,
            },
            {
                key: 's',
                ctrlKey: true,
                shiftKey: true,
                metaKey: true,
                action: 'strikethrough',
                enabled: true,
                conflictsWith: ['ctrl+s', 'cmd+s'],
            },
            // Subscript/Superscript
            {
                key: '=',
                ctrlKey: true,
                metaKey: true,
                action: 'subscript',
                enabled: true,
            },
            {
                key: '=',
                ctrlKey: true,
                shiftKey: true,
                metaKey: true,
                action: 'superscript',
                enabled: true,
            },
            // Alignment
            {
                key: 'l',
                ctrlKey: true,
                shiftKey: true,
                metaKey: true,
                action: 'alignLeft',
                enabled: true,
            },
            {
                key: 'e',
                ctrlKey: true,
                shiftKey: true,
                metaKey: true,
                action: 'alignCenter',
                enabled: true,
            },
            {
                key: 'r',
                ctrlKey: true,
                shiftKey: true,
                metaKey: true,
                action: 'alignRight',
                enabled: true,
            },
            {
                key: 'j',
                ctrlKey: true,
                shiftKey: true,
                metaKey: true,
                action: 'alignJustify',
                enabled: true,
            },
            // Lists
            {
                key: '7',
                ctrlKey: true,
                shiftKey: true,
                metaKey: true,
                action: 'orderedList',
                enabled: true,
            },
            {
                key: '8',
                ctrlKey: true,
                shiftKey: true,
                metaKey: true,
                action: 'unorderedList',
                enabled: true,
            },
            // Link
            {
                key: 'k',
                ctrlKey: true,
                metaKey: true,
                action: 'insertLink',
                enabled: true,
            },
            // Indent
            {
                key: '[',
                ctrlKey: true,
                metaKey: true,
                action: 'outdent',
                enabled: true,
            },
            {
                key: ']',
                ctrlKey: true,
                metaKey: true,
                action: 'indent',
                enabled: true,
            },
            // Table
            {
                key: 't',
                ctrlKey: true,
                shiftKey: true,
                metaKey: true,
                action: 'insertTable',
                enabled: true,
            },
            // Undo/Redo
            { key: 'z', ctrlKey: true, metaKey: true, action: 'undo', enabled: true },
            {
                key: 'z',
                ctrlKey: true,
                shiftKey: true,
                metaKey: true,
                action: 'redo',
                enabled: true,
            },
            {
                key: 'y',
                ctrlKey: true,
                metaKey: true,
                action: 'redo',
                enabled: true,
                conflictsWith: ['ctrl+y'],
            },
        ];
        defaults.forEach(config => {
            this.registerShortcut(config);
        });
    }
    /**
     * Register a keyboard shortcut
     */
    static registerShortcut(config) {
        const key = this.buildShortcutKey(config);
        // Check for conflicts with browser shortcuts
        if (this.hasBrowserConflict(config)) {
            console.warn(`Shortcut ${key} conflicts with browser shortcut. Use with caution.`);
            this.shortcutConflicts.set(key, config.conflictsWith || []);
        }
        this.shortcuts.set(key, config);
    }
    /**
     * Register custom shortcut
     */
    static registerCustomShortcut(config) {
        const key = this.buildShortcutKey(config);
        // Check for conflicts with browser shortcuts
        if (this.hasBrowserConflict(config)) {
            console.error(`Cannot register custom shortcut ${key} - conflicts with browser shortcut`);
            return false;
        }
        // Check for conflicts with existing shortcuts
        if (this.shortcuts.has(key)) {
            console.warn(`Shortcut ${key} already registered. Overwriting.`);
        }
        this.customShortcuts.set(key, config);
        this.shortcuts.set(key, config);
        return true;
    }
    /**
     * Get shortcut configuration by action
     */
    static getShortcut(action) {
        for (const [, config] of this.shortcuts) {
            if (config.action === action && config.enabled !== false) {
                return config;
            }
        }
        return undefined;
    }
    /**
     * Handle keyboard event and return matching shortcut action
     */
    static handleKeyboardEvent(event) {
        // Find matching shortcut configuration
        for (const [, config] of this.shortcuts) {
            if (this.matchesEvent(config, event) && config.enabled !== false) {
                // Check if shortcut is disabled
                if (this.disabledShortcuts.has(this.buildShortcutKey(config))) {
                    return null;
                }
                return config.action;
            }
        }
        return null;
    }
    /**
     * Disable a shortcut
     */
    static disableShortcut(action) {
        const config = this.findShortcutByAction(action);
        if (config) {
            const key = this.buildShortcutKey(config);
            this.disabledShortcuts.add(key);
        }
    }
    /**
     * Enable a shortcut
     */
    static enableShortcut(action) {
        const config = this.findShortcutByAction(action);
        if (config) {
            const key = this.buildShortcutKey(config);
            this.disabledShortcuts.delete(key);
        }
    }
    /**
     * Check if shortcut is enabled
     */
    static isShortcutEnabled(action) {
        const config = this.findShortcutByAction(action);
        if (!config || config.enabled === false) {
            return false;
        }
        return !this.disabledShortcuts.has(this.buildShortcutKey(config));
    }
    /**
     * Find a shortcut by action, regardless of its enabled/disabled state
     */
    static findShortcutByAction(action) {
        for (const [, config] of this.shortcuts) {
            if (config.action === action) {
                return config;
            }
        }
        return undefined;
    }
    /**
     * Get all shortcuts
     */
    static getAllShortcuts() {
        return Array.from(this.shortcuts.values());
    }
    /**
     * Reset to default shortcuts
     */
    static resetToDefaults() {
        this.shortcuts.clear();
        this.customShortcuts.clear();
        this.disabledShortcuts.clear();
        this.shortcutConflicts.clear();
        this.initializeDefaults();
    }
    /**
     * Build a unique key for a shortcut configuration
     */
    static buildShortcutKey(config) {
        const parts = [];
        if (config.ctrlKey)
            parts.push('ctrl');
        if (config.shiftKey)
            parts.push('shift');
        if (config.altKey)
            parts.push('alt');
        // `meta` is the macOS primary modifier and is tracked as `cmd` so it can be
        // compared against the OS level shortcut names in BROWSER_SHORTCUTS.
        if (config.metaKey)
            parts.push('cmd');
        parts.push(config.key);
        return parts.join('+').toLowerCase();
    }
    /**
     * Check if keyboard event matches configuration
     */
    static matchesEvent(config, event) {
        const keyMatches = event.key.toLowerCase() === config.key.toLowerCase();
        // Ctrl (Windows/Linux) and Cmd (macOS) are both the "primary" modifier.
        const configUsesPrimaryModifier = config.ctrlKey === true || config.metaKey === true;
        const eventUsesPrimaryModifier = event.ctrlKey || event.metaKey;
        const primaryModifierMatches = configUsesPrimaryModifier === eventUsesPrimaryModifier;
        const shiftMatches = (config.shiftKey === true) === event.shiftKey;
        const altMatches = (config.altKey === true) === event.altKey;
        return keyMatches && primaryModifierMatches && shiftMatches && altMatches;
    }
    /**
     * Check if shortcut has browser conflict
     */
    static hasBrowserConflict(config) {
        const key = this.buildShortcutKey(config);
        return this.BROWSER_SHORTCUTS.has(key);
    }
    /**
     * Get all shortcuts with conflicts
     */
    static getConflictingShortcuts() {
        return this.shortcutConflicts;
    }
    /**
     * Clear all shortcuts
     */
    static clearAllShortcuts() {
        this.shortcuts.clear();
        this.customShortcuts.clear();
        this.disabledShortcuts.clear();
        this.shortcutConflicts.clear();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: KeyboardShortcutManager, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: KeyboardShortcutManager, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: KeyboardShortcutManager, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });
/**
 * Platform-Aware Shortcut Handler
 * Handles platform-specific keyboard shortcuts (Mac Cmd vs Windows Ctrl)
 */
class PlatformAwareShortcutHandler {
    static currentPlatform = 'windows';
    static platformShortcuts = new Map();
    /**
     * Detect and set current platform
     */
    static detectPlatform() {
        const ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf('mac') > -1) {
            this.currentPlatform = 'mac';
        }
        else if (ua.indexOf('linux') > -1) {
            this.currentPlatform = 'linux';
        }
        else {
            this.currentPlatform = 'windows';
        }
        return this.currentPlatform;
    }
    /**
     * Get current platform
     */
    static getPlatform() {
        return this.currentPlatform;
    }
    /**
     * Set platform explicitly
     */
    static setPlatform(platform) {
        this.currentPlatform = platform;
    }
    /**
     * Check if platform is Mac
     */
    static isMac() {
        return this.currentPlatform === 'mac';
    }
    /**
     * Check if platform is Windows
     */
    static isWindows() {
        return this.currentPlatform === 'windows';
    }
    /**
     * Check if platform is Linux
     */
    static isLinux() {
        return this.currentPlatform === 'linux';
    }
    /**
     * Normalize shortcut for current platform
     * Converts Ctrl+X to Cmd+X on Mac, etc.
     */
    static normalizePlatformShortcut(event) {
        const isMacModifier = event.ctrlKey && !event.metaKey;
        if (this.isMac() && isMacModifier) {
            // On Mac, if Ctrl is pressed without Meta, convert to Meta
            // This helps with cross-platform shortcut compatibility
            Object.defineProperty(event, 'metaKey', { value: true });
            Object.defineProperty(event, 'ctrlKey', { value: false });
        }
        return event;
    }
    /**
     * Check if modifier key is pressed (Ctrl on Windows, Cmd on Mac)
     */
    static isPrimaryModifierPressed(event) {
        return this.isMac() ? event.metaKey : event.ctrlKey;
    }
    /**
     * Check if secondary modifier key is pressed
     */
    static isSecondaryModifierPressed(event) {
        return event.shiftKey;
    }
    /**
     * Get platform-specific shortcut string for display
     */
    static getDisplayShortcut(action) {
        const config = KeyboardShortcutManager.getShortcut(action);
        if (!config)
            return '';
        const parts = [];
        if (this.isMac()) {
            if (config.metaKey || config.ctrlKey)
                parts.push('⌘');
            if (config.altKey)
                parts.push('⌥');
            if (config.shiftKey)
                parts.push('⇧');
        }
        else {
            if (config.ctrlKey || config.metaKey)
                parts.push('Ctrl');
            if (config.altKey)
                parts.push('Alt');
            if (config.shiftKey)
                parts.push('Shift');
        }
        parts.push(config.key.toUpperCase());
        return parts.join('+');
    }
}
/**
 * Keyboard Layout Handler
 * Handles non-QWERTY keyboard layouts
 */
class KeyboardLayoutHandler {
    static detectedLayout = 'en-US';
    static layoutKeyMap = new Map();
    static isLayoutDetected = false;
    /**
     * Detect keyboard layout
     */
    static detectLayout() {
        // Try to detect from keyboard events
        // This is limited by browser security, but we can try several approaches
        // 1. Check navigator.keyboard if available (Keyboard API)
        if (navigator.keyboard &&
            navigator.keyboard.getLayoutMap) {
            navigator.keyboard.getLayoutMap().then((layoutMap) => {
                this.detectedLayout = layoutMap.get('KeyA') ? 'detected' : 'en-US';
                this.isLayoutDetected = true;
            });
        }
        // 2. Fallback to language settings
        const lang = navigator.language || 'en-US';
        if (lang) {
            this.detectedLayout = lang;
        }
        return this.detectedLayout;
    }
    /**
     * Get current keyboard layout
     */
    static getLayout() {
        return this.detectedLayout;
    }
    /**
     * Set keyboard layout explicitly
     */
    static setLayout(layout) {
        this.detectedLayout = layout;
        this.setupLayoutMap(layout);
    }
    /**
     * Check if layout is QWERTY
     */
    static isQWERTY() {
        return (this.detectedLayout.includes('en') ||
            this.detectedLayout === 'en-US' ||
            this.detectedLayout === 'en-GB');
    }
    /**
     * Check if layout is AZERTY
     */
    static isAZERTY() {
        return this.detectedLayout.includes('fr');
    }
    /**
     * Check if layout is QWERTZ
     */
    static isQWERTZ() {
        return (this.detectedLayout.includes('de') || this.detectedLayout.includes('cz'));
    }
    /**
     * Check if layout is Dvorak
     */
    static isDvorak() {
        return this.detectedLayout.includes('dvorak');
    }
    /**
     * Map key event to character for current layout
     */
    static mapKeyToCharacter(event) {
        // For modern browsers, event.key already handles layout correctly
        return event.key;
    }
    /**
     * Setup layout-specific key mapping
     */
    static setupLayoutMap(layout) {
        this.layoutKeyMap.clear();
        switch (layout.toLowerCase()) {
            case 'fr':
            case 'fr-fr':
                // AZERTY layout
                this.layoutKeyMap.set('a', 'q');
                this.layoutKeyMap.set('z', 'w');
                this.layoutKeyMap.set('q', 'a');
                this.layoutKeyMap.set('m', ';');
                break;
            case 'de':
            case 'de-de':
                // QWERTZ layout
                this.layoutKeyMap.set('z', 'y');
                this.layoutKeyMap.set('y', 'z');
                break;
            case 'dvorak':
                // Dvorak layout - significant remap
                this.layoutKeyMap.set('a', 'a');
                this.layoutKeyMap.set('o', 's');
                this.layoutKeyMap.set('e', 'd');
                break;
            default:
                // QWERTY - no mapping needed
                break;
        }
    }
    /**
     * Check if keyboard layout change was detected
     */
    static hasLayoutDetectionSupport() {
        return Boolean(navigator.keyboard?.getLayoutMap !== undefined);
    }
    /**
     * Get all supported layouts
     */
    static getSupportedLayouts() {
        return ['en-US', 'en-GB', 'fr-FR', 'de-DE', 'dvorak', 'colemak'];
    }
    /**
     * Map character back to physical key (for display purposes)
     */
    static getPhysicalKeyName(event) {
        // Use event.code which represents physical key position
        // event.key represents the character
        return event.code || event.key;
    }
}
/**
 * Service for managing editor utilities and helper functions
 */
class RmNgEditorService {
    // Maximum content size (1MB)
    MAX_CONTENT_SIZE = 1024 * 1024;
    /**
     * Converts HTML content to plain text
     * Handles null/undefined inputs safely
     */
    htmlToText(html) {
        // Handle null/undefined/empty inputs
        if (!html || typeof html !== 'string') {
            return '';
        }
        try {
            const div = document.createElement('div');
            div.innerHTML = html;
            return div.textContent || div.innerText || '';
        }
        catch (error) {
            console.error('Error converting HTML to text:', error);
            return '';
        }
    }
    /**
     * Enhanced sanitization with XSS protection
     * Handles null/undefined inputs and large content
     */
    sanitizeHtml(html) {
        // Handle null/undefined/empty inputs
        if (!html || typeof html !== 'string') {
            return '';
        }
        // Check content size to prevent overflow
        if (html.length > this.MAX_CONTENT_SIZE) {
            console.warn(`Content size exceeds maximum (${this.MAX_CONTENT_SIZE} bytes). Truncating...`);
            html = html.substring(0, this.MAX_CONTENT_SIZE);
        }
        try {
            const div = document.createElement('div');
            div.innerHTML = html;
            // Remove potentially dangerous elements
            const dangerousElements = div.querySelectorAll('script, object, embed, iframe, form, input, textarea, button, select, option, frame, frameset, applet, meta, link[rel="import"]');
            dangerousElements.forEach(el => el.remove());
            // Remove all SVG elements with event handlers
            this.sanitizeSvgElements(div);
            // Remove dangerous attributes from all elements
            const allElements = div.querySelectorAll('*');
            allElements.forEach(el => {
                this.removeDangerousAttributes(el);
                this.sanitizeStyleAttribute(el);
                this.sanitizeDataUris(el);
            });
            // Guarantee the sanitized result never exceeds the configured limit even
            // when serialization adds markup back to a truncated document.
            return div.innerHTML.length > this.MAX_CONTENT_SIZE
                ? div.innerHTML.substring(0, this.MAX_CONTENT_SIZE)
                : div.innerHTML;
        }
        catch (error) {
            console.error('Error sanitizing HTML:', error);
            return '';
        }
    }
    /**
     * Remove dangerous SVG event handlers
     */
    sanitizeSvgElements(container) {
        const svgElements = container.querySelectorAll('svg, use, image, animate, set, animateMotion, animateTransform');
        svgElements.forEach(el => {
            // Remove all event handler attributes from SVG elements
            const attributesToRemove = [];
            for (const attr of el.attributes) {
                if (attr.name.startsWith('on')) {
                    attributesToRemove.push(attr.name);
                }
            }
            attributesToRemove.forEach(attrName => el.removeAttribute(attrName));
            // Check for xlink:href with javascript:
            const xlinkHref = el.getAttribute('xlink:href');
            if (xlinkHref && xlinkHref.toLowerCase().includes('javascript:')) {
                el.removeAttribute('xlink:href');
            }
            // Check for href with javascript:
            const href = el.getAttribute('href');
            if (href && href.toLowerCase().includes('javascript:')) {
                el.removeAttribute('href');
            }
        });
    }
    /**
     * Remove dangerous attributes from element
     */
    removeDangerousAttributes(el) {
        const attributesToRemove = [];
        for (const attr of el.attributes) {
            const attrName = attr.name.toLowerCase();
            const attrValue = attr.value.toLowerCase();
            // Remove event handlers
            if (attrName.startsWith('on')) {
                attributesToRemove.push(attr.name);
            }
            // Remove javascript: protocol
            if (attrValue.includes('javascript:')) {
                attributesToRemove.push(attr.name);
            }
            // Remove vbscript: protocol
            if (attrValue.includes('vbscript:')) {
                attributesToRemove.push(attr.name);
            }
            // Remove data: protocol in dangerous contexts
            if (attrName === 'src' && attrValue.startsWith('data:')) {
                // Allow only safe data URIs (images)
                if (!attrValue.startsWith('data:image/')) {
                    attributesToRemove.push(attr.name);
                }
            }
            // Remove formaction attribute
            if (attrName === 'formaction') {
                attributesToRemove.push(attr.name);
            }
        }
        attributesToRemove.forEach(attrName => el.removeAttribute(attrName));
    }
    /**
     * Sanitize inline styles to prevent CSS-based attacks
     */
    sanitizeStyleAttribute(el) {
        const style = el.getAttribute('style');
        if (style) {
            // Remove dangerous CSS patterns
            const cleanStyle = style
                // Remove expression() calls (IE-specific)
                .replace(/expression\s*\([^)]*\)/gi, '')
                // Remove import statements
                .replace(/@import/gi, '')
                // Remove behavior property (IE-specific)
                .replace(/behavior\s*:/gi, '')
                // Remove -moz-binding (Firefox-specific)
                .replace(/-moz-binding\s*:/gi, '')
                // Remove url() with javascript:
                .replace(/url\s*\(\s*['"]*javascript:/gi, '')
                // Remove url() with data: (except images)
                .replace(/url\s*\(\s*['"]*data:(?!image\/)/gi, '');
            if (cleanStyle !== style) {
                el.setAttribute('style', cleanStyle);
            }
        }
    }
    /**
     * Sanitize data URIs in attributes
     */
    sanitizeDataUris(el) {
        const dangerousDataUriAttrs = [
            'src',
            'href',
            'xlink:href',
            'data',
            'poster',
        ];
        dangerousDataUriAttrs.forEach(attrName => {
            const attrValue = el.getAttribute(attrName);
            if (attrValue && attrValue.toLowerCase().startsWith('data:')) {
                // Only allow image data URIs
                if (!attrValue.toLowerCase().startsWith('data:image/')) {
                    el.removeAttribute(attrName);
                }
            }
        });
    }
    /**
     * Enhanced word counting with Unicode support
     * Handles emoji, CJK characters, and special cases
     */
    getWordCount(html) {
        const text = this.htmlToText(html);
        if (!text || text.trim() === '') {
            return 0;
        }
        return this.countWords(text);
    }
    /**
     * Internal word counting logic with advanced Unicode support
     * Properly handles:
     * - Zero-width characters (removed)
     * - Emoji (counted as single character)
     * - CJK characters (each character = 1 word)
     * - Latin text (space-separated = 1 word)
     * - Diacritics and combining marks (preserved)
     */
    countWords(text) {
        // Remove zero-width characters and other invisible formatting
        const cleanText = text
            .replace(/[\u200B-\u200D\uFEFF]/g, '') // Zero-width characters
            .replace(/\u00AD/g, '') // Soft hyphens join words instead of splitting them
            // Null characters are stripped so they do not create phantom words
            .replace(new RegExp(String.fromCharCode(0), 'g'), '');
        // CJK pattern: Chinese, Japanese (Hiragana/Katakana), Korean, etc.
        const cjkRegex = /[\u3040-\u309F\u30A0-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uAC00-\uD7AF\uF900-\uFAFF]/g;
        const cjkMatches = cleanText.match(cjkRegex);
        const cjkCount = cjkMatches ? cjkMatches.length : 0;
        // Remove CJK characters and emoji for Latin word counting
        // Emoji pattern: astral emoji, symbols, variation selectors and regional indicators
        const emojiRegex = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}]|\u{FE0F}/gu;
        const nonCjkText = cleanText
            .replace(cjkRegex, ' ') // Replace CJK with space
            .replace(emojiRegex, ' '); // Replace emoji with space
        // Count Latin/non-CJK words (space-separated)
        const latinWords = nonCjkText
            .trim()
            .split(/\s+/) // Split by whitespace
            .filter(word => word.length > 0 && !/^[\p{P}\p{S}]*$/u.test(word)); // Filter empty and pure punctuation
        return latinWords.length + cjkCount;
    }
    /**
     * Counts characters in HTML content
     * Handles null/undefined inputs
     */
    getCharacterCount(html) {
        const text = this.htmlToText(html);
        if (!text) {
            return 0;
        }
        // Use spread operator to handle emoji and Unicode properly
        return [...text].length;
    }
    /**
     * Extracts headings from HTML content
     * Handles null/undefined inputs
     */
    extractHeadings(html) {
        if (!html || typeof html !== 'string') {
            return [];
        }
        try {
            const div = document.createElement('div');
            div.innerHTML = html;
            const headings = div.querySelectorAll('h1, h2, h3, h4, h5, h6');
            return Array.from(headings).map(heading => ({
                level: parseInt(heading.tagName.charAt(1), 10),
                text: heading.textContent || '',
                id: heading.id || undefined,
            }));
        }
        catch (error) {
            console.error('Error extracting headings:', error);
            return [];
        }
    }
    /**
     * Enhanced validation with comprehensive whitespace detection
     * Handles null/undefined inputs and various whitespace scenarios
     */
    validateContent(html) {
        const errors = [];
        // Handle null/undefined inputs
        if (html === null || html === undefined) {
            errors.push('Content is null or undefined');
            return { isValid: false, errors };
        }
        if (typeof html !== 'string') {
            errors.push('Content must be a string');
            return { isValid: false, errors };
        }
        // Check for empty content (whitespace only)
        const textContent = this.htmlToText(html);
        // Normalize whitespace for more accurate checking
        const normalizedText = this.normalizeWhitespace(textContent);
        if (!normalizedText || normalizedText.trim() === '') {
            errors.push('Content is empty or contains only whitespace');
            return { isValid: false, errors };
        }
        // Check content size
        if (html.length > this.MAX_CONTENT_SIZE) {
            errors.push(`Content exceeds maximum size of ${this.MAX_CONTENT_SIZE} bytes`);
            return { isValid: false, errors };
        }
        try {
            const div = document.createElement('div');
            div.innerHTML = html;
            // Check for unclosed tags (basic validation)
            const openTags = html.match(/<[^/][^>]*>/g) || [];
            const closeTags = html.match(/<\/[^>]*>/g) || [];
            if (openTags.length !== closeTags.length) {
                errors.push('Mismatched HTML tags detected');
            }
            // Check for dangerous elements
            const dangerousElements = div.querySelectorAll('script, object, embed, iframe');
            if (dangerousElements.length > 0) {
                errors.push('Content contains potentially dangerous elements');
            }
            return {
                isValid: errors.length === 0,
                errors,
            };
        }
        catch (error) {
            return {
                isValid: false,
                errors: ['Invalid HTML structure: ' + error.message],
            };
        }
    }
    /**
     * Normalize whitespace by removing various whitespace types
     * Handles: regular spaces, tabs, newlines, non-breaking spaces, etc.
     */
    normalizeWhitespace(text) {
        return text
            .replace(/[\s\u00A0\u1680\u2000-\u200B\u202F\u205F\u3000]/g, ' ') // Replace various whitespace
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .trim();
    }
    /**
     * Converts content to different formats
     */
    convertToFormat(html, format) {
        switch (format) {
            case 'text':
                return this.htmlToText(html);
            case 'markdown':
                return this.htmlToMarkdown(html);
            default:
                return html;
        }
    }
    /**
     * Basic HTML to Markdown conversion
     */
    htmlToMarkdown(html) {
        let markdown = html;
        // Headers
        markdown = markdown.replace(/<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi, (match, level, content) => {
            const hashes = '#'.repeat(parseInt(level, 10));
            return `${hashes} ${content}\n\n`;
        });
        // Bold and italic
        markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
        markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
        markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
        markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
        // Lists
        markdown = markdown.replace(/<ul[^>]*>(.*?)<\/ul>/gis, '$1\n');
        markdown = markdown.replace(/<ol[^>]*>(.*?)<\/ol>/gis, '$1\n');
        markdown = markdown.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
        // Paragraphs
        markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
        // Code
        markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
        // Clean up extra whitespace
        markdown = markdown.replace(/\n{3,}/g, '\n\n');
        return markdown.trim();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: RmNgEditorService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: RmNgEditorService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: RmNgEditorService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });
/**
 * Optimized spell check manager with debouncing and performance controls
 * Prevents spell check from running on every content change
 * Supports custom dictionaries and ignored words
 */
class SpellCheckManager {
    static lastCheckTime = 0;
    static debounceDelay = 500; // ms
    static ignoredWords = new Set();
    static customDictionary = new Set();
    static isRunning = false;
    static minContentLength = 10; // Don't check if content is too short
    /**
     * Configure the spell checker
     */
    static configure(config) {
        if (config.debounceDelay !== undefined) {
            this.debounceDelay = config.debounceDelay;
        }
        if (config.ignoredWords) {
            this.ignoredWords = new Set(config.ignoredWords.map(w => w.toLowerCase()));
        }
        if (config.customDictionary) {
            this.customDictionary = new Set(config.customDictionary.map(w => w.toLowerCase()));
        }
        if (config.minContentLength !== undefined) {
            this.minContentLength = config.minContentLength;
        }
    }
    /**
     * Check if spell check should run based on debounce and content length
     */
    static shouldRunCheck(contentLength) {
        const now = Date.now();
        if (this.isRunning) {
            // Treat a run that has not completed within the debounce window as
            // abandoned so the editor can recover instead of blocking forever.
            if (now - this.lastCheckTime < this.debounceDelay) {
                return false; // Already running
            }
            this.isRunning = false;
        }
        if (contentLength < this.minContentLength) {
            return false; // Content too short
        }
        if (now - this.lastCheckTime < this.debounceDelay) {
            return false; // Too soon since last check
        }
        return true;
    }
    /**
     * Mark check as started
     */
    static markCheckStart() {
        this.isRunning = true;
        this.lastCheckTime = Date.now();
    }
    /**
     * Mark check as completed
     */
    static markCheckEnd() {
        this.isRunning = false;
    }
    /**
     * Perform spell check on text content
     * Returns array of misspelled words with positions
     */
    static checkSpelling(text) {
        if (!text || text.trim().length === 0) {
            return [];
        }
        const results = [];
        // Split text into words while preserving position information
        const wordRegex = /\b[\w'-]+\b/gi;
        let match;
        while ((match = wordRegex.exec(text)) !== null) {
            const word = match[0];
            const position = match.index;
            // Skip if word is in ignored or custom dictionary
            if (this.ignoredWords.has(word.toLowerCase()) ||
                this.customDictionary.has(word.toLowerCase())) {
                continue;
            }
            // Skip single character words
            if (word.length === 1) {
                continue;
            }
            // Skip words with numbers
            if (/\d/.test(word)) {
                continue;
            }
            // Note: In a real implementation, this would call an external spell check service
            // For now, we return the structure for integration
            results.push({
                word,
                position,
                suggestions: this.getSuggestions(word),
            });
        }
        return results;
    }
    /**
     * Get suggestions for a misspelled word
     * This is a placeholder - integrate with real spell checker
     */
    static getSuggestions(_word) {
        // Placeholder for spell check suggestions
        // In production, integrate with Hunspell, LanguageTool, or similar
        return [];
    }
    /**
     * Add word to custom dictionary
     */
    static addToCustomDictionary(word) {
        this.customDictionary.add(word.toLowerCase());
    }
    /**
     * Remove word from custom dictionary
     */
    static removeFromCustomDictionary(word) {
        this.customDictionary.delete(word.toLowerCase());
    }
    /**
     * Add word to ignored words (won't be checked)
     */
    static addToIgnoredWords(word) {
        this.ignoredWords.add(word.toLowerCase());
    }
    /**
     * Reset all configurations
     */
    static reset() {
        this.lastCheckTime = 0;
        this.debounceDelay = 500;
        this.ignoredWords.clear();
        this.customDictionary.clear();
        this.isRunning = false;
        this.minContentLength = 10;
    }
}
/**
 * Enhanced table selection manager to prevent conflicts
 * Ensures only one table is selected at a time and properly cleans up
 */
class TableSelectionManager {
    static activeTable = null;
    static activeEditor = null;
    /**
     * Select a table and ensure all others are deselected
     */
    static selectTable(table, editorElement) {
        // First, clear all selections in all editors
        this.clearAllSelections();
        // Set the new active table
        this.activeTable = table;
        this.activeEditor = editorElement;
        // Mark this table as selected
        table.classList.add('selected-table');
        table.setAttribute('data-table-selected', 'true');
    }
    /**
     * Clear all table selections across the editor
     */
    static clearAllSelections() {
        // Remove selection from active table if exists
        if (this.activeTable) {
            this.activeTable.classList.remove('selected-table');
            this.activeTable.removeAttribute('data-table-selected');
            this.activeTable = null;
        }
        // Clean up any stray selections in the editor
        if (this.activeEditor) {
            const selectedTables = this.activeEditor.querySelectorAll('.selected-table');
            selectedTables.forEach(table => {
                table.classList.remove('selected-table');
                table.removeAttribute('data-table-selected');
            });
            const selectedCells = this.activeEditor.querySelectorAll('.selected-cell');
            selectedCells.forEach(cell => {
                cell.classList.remove('selected-cell');
                cell.removeAttribute('data-cell-selected');
            });
        }
    }
    /**
     * Get the currently selected table
     */
    static getSelectedTable() {
        return this.activeTable;
    }
    /**
     * Check if a table is currently selected
     */
    static isTableSelected(table) {
        return this.activeTable === table;
    }
    /**
     * Clear all state (useful for cleanup)
     */
    static reset() {
        this.clearAllSelections();
        this.activeTable = null;
        this.activeEditor = null;
    }
}
/**
 * Advanced cell merge validator
 * Prevents table structure corruption from invalid merge operations
 */
class CellMergeValidator {
    /**
     * Validate if cells can be safely merged
     */
    static canMergeCells(cells) {
        if (cells.length < 2) {
            return { valid: false, reason: 'At least 2 cells required for merging' };
        }
        const table = cells[0].closest('table');
        if (!table) {
            return { valid: false, reason: 'Cells must be in a table' };
        }
        // Check if all cells are from the same table
        const allInSameTable = cells.every(cell => cell.closest('table') === table);
        if (!allInSameTable) {
            return { valid: false, reason: 'All cells must be in the same table' };
        }
        // Check if any cell is already merged
        const hasAlreadyMergedCells = cells.some(cell => cell.rowSpan > 1 || cell.colSpan > 1);
        if (hasAlreadyMergedCells) {
            return {
                valid: false,
                reason: 'Cannot merge cells that are already merged. Please split them first.',
            };
        }
        // Get cell positions
        const positions = cells.map(cell => {
            const row = cell.parentElement;
            const rowIndex = Array.from(table.rows).indexOf(row);
            const colIndex = Array.from(row.children).indexOf(cell);
            return { rowIndex, colIndex, cell };
        });
        // Calculate bounds
        const minRow = Math.min(...positions.map(p => p.rowIndex));
        const maxRow = Math.max(...positions.map(p => p.rowIndex));
        const minCol = Math.min(...positions.map(p => p.colIndex));
        const maxCol = Math.max(...positions.map(p => p.colIndex));
        // Verify rectangular selection
        const expectedCount = (maxRow - minRow + 1) * (maxCol - minCol + 1);
        if (cells.length !== expectedCount) {
            return {
                valid: false,
                reason: 'Selection must form a rectangle',
            };
        }
        // Verify all cells in rectangle are selected
        for (let r = minRow; r <= maxRow; r++) {
            const row = table.rows[r];
            if (!row) {
                return { valid: false, reason: 'Invalid row in selection' };
            }
            for (let c = minCol; c <= maxCol; c++) {
                const cell = row.children[c];
                if (!cell) {
                    return { valid: false, reason: 'Missing cell in selection' };
                }
                if (!cells.includes(cell)) {
                    return {
                        valid: false,
                        reason: 'Selection has gaps - must be continuous',
                    };
                }
            }
        }
        return { valid: true };
    }
    /**
     * Validate if a merged cell can be safely split
     */
    static canSplitCell(cell) {
        if (!cell) {
            return { valid: false, reason: 'No cell provided' };
        }
        const rowSpan = cell.rowSpan || 1;
        const colSpan = cell.colSpan || 1;
        if (rowSpan <= 1 && colSpan <= 1) {
            return {
                valid: false,
                reason: 'Cell is not merged (rowspan=1, colspan=1)',
            };
        }
        const table = cell.closest('table');
        if (!table) {
            return { valid: false, reason: 'Cell must be in a table' };
        }
        return { valid: true };
    }
    /**
     * Check for nested tables and prevent operations
     */
    static hasNestedTables(table) {
        const nestedTables = table.querySelectorAll('table table');
        return nestedTables.length > 0;
    }
}
/**
 * Nested table detector and sanitizer
 * Prevents nested tables from breaking editor functionality
 */
class NestedTableSanitizer {
    /**
     * Detect if content contains nested tables
     */
    static hasNestedTables(html) {
        // Create a temporary DOM element to parse HTML
        const temp = document.createElement('div');
        temp.innerHTML = html;
        const tables = temp.querySelectorAll('table');
        for (const table of Array.from(tables)) {
            // Check if this table contains other tables
            const innerTables = table.querySelectorAll('table');
            if (innerTables.length > 0) {
                return true;
            }
        }
        return false;
    }
    /**
     * Remove nested tables from HTML content
     */
    static removeNestedTables(html) {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        const tables = temp.querySelectorAll('table');
        for (const table of Array.from(tables)) {
            // Find nested tables within this table
            const nestedTables = table.querySelectorAll('table');
            for (const nestedTable of Array.from(nestedTables)) {
                // Extract text content from nested table
                const textContent = nestedTable.textContent || '';
                // Replace nested table with its text content
                const textNode = document.createTextNode(textContent);
                nestedTable.parentNode?.replaceChild(textNode, nestedTable);
            }
        }
        return temp.innerHTML;
    }
    /**
     * Flatten nested tables - convert inner tables to div structures
     */
    static flattenNestedTables(html) {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        const tables = temp.querySelectorAll('table');
        for (const table of Array.from(tables)) {
            const nestedTables = table.querySelectorAll('table');
            for (const nestedTable of Array.from(nestedTables)) {
                // Create a replacement div
                const div = document.createElement('div');
                div.className = 'flattened-table';
                div.style.cssText = `
          border: 1px solid #ddd;
          padding: 8px;
          margin: 4px 0;
          background-color: #f9f9f9;
        `;
                // Move all content from nested table to div
                while (nestedTable.firstChild) {
                    div.appendChild(nestedTable.firstChild);
                }
                // Replace nested table with div
                nestedTable.parentNode?.replaceChild(div, nestedTable);
            }
        }
        return temp.innerHTML;
    }
    /**
     * Prevent insertion of nested tables
     */
    static preventNestedTableInsertion(targetElement, htmlToInsert) {
        // Check if target is inside a table
        const isInTable = this.isInsideTable(targetElement);
        const insertsTable = /<table[\s>]/i.test(htmlToInsert) || this.hasNestedTables(htmlToInsert);
        if (isInTable && insertsTable) {
            return false; // Prevent insertion
        }
        return true; // Allow insertion
    }
    /**
     * Check if target element is inside a table
     */
    static isInsideTable(element) {
        const table = element.closest('table');
        // The table element itself is not "inside" a table, only its descendants are.
        return table !== null && table !== element;
    }
}

// Lightweight injection tokens to avoid global singletons
const EDITOR_DEFAULT_CONFIG = new InjectionToken('Default editor configuration', { providedIn: 'root', factory: () => ({ ...DEFAULT_TOOLBAR_CONFIG }) });
const EDITOR_DEFAULT_ICONS = new InjectionToken('Default editor icons', { providedIn: 'root', factory: () => ({ ...DEFAULT_TOOLBAR_ICONS }) });
const EDITOR_PERFORMANCE_CONFIG = new InjectionToken('Editor performance configuration', {
    providedIn: 'root',
    factory: () => ({
        debounceDelay: 100,
        chunkSize: 1000,
        maxContentSize: 100000,
    }),
});
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
class RmNgEditor {
    // Lightweight dependency injection
    destroyRef = inject(DestroyRef);
    injector = inject(Injector);
    platformId = inject(PLATFORM_ID);
    rendererFactory = inject(RendererFactory2);
    defaultConfig = inject(EDITOR_DEFAULT_CONFIG);
    defaultIcons = inject(EDITOR_DEFAULT_ICONS);
    perfConfig = inject(EDITOR_PERFORMANCE_CONFIG);
    // View children with proper typing
    editorElement = viewChild.required('editor');
    toolbarElement = viewChild('toolbar', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "toolbarElement" }] : /* istanbul ignore next */ []));
    // Performance and Memory Management - avoid singletons
    resourceCleanup = new Set();
    observerCleanup = new Set();
    renderer;
    performanceManager;
    constructor() {
        // Initialize renderer without global access
        this.renderer = this.rendererFactory.createRenderer(null, null);
        // Initialize performance manager with injected config
        this.performanceManager = this.createPerformanceManager();
        // Initialize debounced methods after performance manager is ready
        this.debouncedUpdateEditorState = this.performanceManager.debounce('updateEditorState', () => this.updateEditorState(), this.perfConfig.debounceDelay);
        this.debouncedUpdateWordCount = this.performanceManager.debounce('updateWordCount', () => this.updateWordCount(), this.perfConfig.debounceDelay);
        this.debouncedRunSpellCheck = this.performanceManager.debounce('runSpellCheck', () => this.runSpellCheck(), this.perfConfig.debounceDelay * 3);
        // Setup automatic cleanup on destroy
        this.destroyRef.onDestroy(() => {
            this.performanceManager.cleanup();
            this.resourceCleanup.forEach(cleanup => cleanup());
            this.observerCleanup.forEach(cleanup => cleanup());
            this.resourceCleanup.clear();
            this.observerCleanup.clear();
        });
    }
    // Factory method for performance manager to avoid circular dependencies
    createPerformanceManager() {
        const debounceTimeouts = new Map();
        const trackedResources = new Set();
        return {
            debounce: (key, func, delay) => {
                return (...args) => {
                    const existingTimeout = debounceTimeouts.get(key);
                    if (existingTimeout) {
                        clearTimeout(existingTimeout);
                    }
                    const timeoutId = window.setTimeout(() => {
                        func.apply(this, args);
                        debounceTimeouts.delete(key);
                    }, delay);
                    debounceTimeouts.set(key, timeoutId);
                };
            },
            cleanup: () => {
                // Clear all debounce timeouts
                debounceTimeouts.forEach(id => clearTimeout(id));
                debounceTimeouts.clear();
                // Cleanup tracked resources
                trackedResources.forEach(resource => {
                    try {
                        resource.cleanup();
                    }
                    catch {
                        // Silent cleanup error handling
                    }
                });
                trackedResources.clear();
            },
            track: (resource) => {
                trackedResources.add(resource);
            },
            getActiveResourceCount: () => {
                return trackedResources.size + debounceTimeouts.size;
            },
        };
    }
    // Signals for reactive state management
    content = signal('', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "content" }] : /* istanbul ignore next */ []));
    disabled = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    placeholder = signal('Start typing...', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "placeholder" }] : /* istanbul ignore next */ []));
    height = signal('300px', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "height" }] : /* istanbul ignore next */ []));
    maxHeight = signal('600px', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "maxHeight" }] : /* istanbul ignore next */ []));
    showToolbar = signal(true, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "showToolbar" }] : /* istanbul ignore next */ []));
    // Configuration signals
    configSignal = signal({}, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "configSignal" }] : /* istanbul ignore next */ []));
    // Computed signals using injected dependencies (no global singletons)
    toolbarConfig = computed(() => {
        const config = this.configSignal();
        return {
            ...this.defaultConfig,
            ...config.toolbarConfig,
        };
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "toolbarConfig" }] : /* istanbul ignore next */ []));
    toolbarIcons = computed(() => {
        const config = this.configSignal();
        return {
            ...this.defaultIcons,
            ...config?.toolbarIcons,
        };
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "toolbarIcons" }] : /* istanbul ignore next */ []));
    // Editor state signal
    editorState = signal({
        bold: false,
        italic: false,
        underline: false,
        strikethrough: false,
        subscript: false,
        superscript: false,
        fontSize: '3',
        fontFamily: 'Arial',
        textColor: '#000000',
        alignment: 'left',
        heading: '',
        listType: '',
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "editorState" }] : /* istanbul ignore next */ []));
    config = input(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "config" }] : /* istanbul ignore next */ []));
    value = input('', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "value" }] : /* istanbul ignore next */ []));
    valueChange = output();
    focusEvent = output();
    blurEvent = output();
    stateChange = output();
    // New validation and stats outputs
    wordCountChange = output();
    spellCheckResults = output();
    // New view mode outputs
    fullScreenChange = output();
    themeChange = output();
    // Table outputs
    tableInsert = output();
    tableModify = output();
    // Validation and stats signals
    wordCountStats = signal({
        words: 0,
        characters: 0,
        charactersNoSpaces: 0,
        paragraphs: 0,
        sentences: 0,
        readingTime: 0,
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "wordCountStats" }] : /* istanbul ignore next */ []));
    // View mode signals
    isFullScreen = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "isFullScreen" }] : /* istanbul ignore next */ []));
    isDistractionFree = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "isDistractionFree" }] : /* istanbul ignore next */ []));
    currentTheme = signal('light', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "currentTheme" }] : /* istanbul ignore next */ []));
    // Accessibility & HTML editing signals
    isHtmlEditMode = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "isHtmlEditMode" }] : /* istanbul ignore next */ []));
    showShortcutsModal = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "showShortcutsModal" }] : /* istanbul ignore next */ []));
    htmlContent = signal('', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "htmlContent" }] : /* istanbul ignore next */ []));
    // Computed property to check if stats should be shown
    shouldShowStats = computed(() => {
        const config = this.validationConfig();
        return (config.showWordCount ||
            config.showCharacterCount ||
            config.showReadingTime);
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "shouldShowStats" }] : /* istanbul ignore next */ []));
    // Private flag to prevent circular updates
    isUpdatingContent = false;
    isDestroyed = false;
    // Performance optimization: Debounced methods
    debounceTimeouts = new Map();
    // Table-related signals
    selectedTable = signal(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "selectedTable" }] : /* istanbul ignore next */ []));
    tableConfig = signal({
        defaultRows: 3,
        defaultColumns: 3,
        allowResize: true,
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "tableConfig" }] : /* istanbul ignore next */ []));
    spellCheckSuggestions = signal([], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "spellCheckSuggestions" }] : /* istanbul ignore next */ []));
    validationConfig = signal({
        showWordCount: true,
        showCharacterCount: true,
        showReadingTime: true,
        spellCheck: {
            enabled: false,
            language: 'en-US',
            highlightErrors: true,
            showSuggestions: true,
        },
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "validationConfig" }] : /* istanbul ignore next */ []));
    validationConfigEffect = effect(() => {
        // Update validation config when editor config changes
        const config = this.configSignal();
        if (config.validation) {
            this.validationConfig.set({
                ...{
                    showWordCount: true,
                    showCharacterCount: true,
                    showReadingTime: true,
                    spellCheck: {
                        enabled: false,
                        language: 'en-US',
                        highlightErrors: true,
                        showSuggestions: true,
                    },
                },
                ...config.validation,
            });
        }
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "validationConfigEffect" }] : /* istanbul ignore next */ []));
    updateStateEffect = effect(() => {
        // Update DOM when content changes
        const editor = this.editorElement().nativeElement;
        if (editor && editor.innerHTML !== this.content()) {
            const selection = document.getSelection();
            const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
            const startContainer = range?.startContainer;
            const startOffset = range?.startOffset;
            editor.innerHTML = this.content();
            // Restore selection if possible
            if (startContainer && selection && range && startOffset !== undefined) {
                try {
                    range.setStart(startContainer, startOffset);
                    range.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
                catch {
                    // Selection restoration failed, ignore
                }
            }
        }
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "updateStateEffect" }] : /* istanbul ignore next */ []));
    configEffect = effect(() => {
        // Handle config input changes
        const configValue = this.config();
        if (configValue) {
            this.configSignal.set(configValue);
            if (configValue.placeholder !== undefined)
                this.placeholder.set(configValue.placeholder);
            if (configValue.disabled !== undefined)
                this.disabled.set(configValue.disabled);
            if (configValue.height !== undefined)
                this.height.set(configValue.height);
            if (configValue.maxHeight !== undefined)
                this.maxHeight.set(configValue.maxHeight);
            if (configValue.showToolbar !== undefined)
                this.showToolbar.set(configValue.showToolbar);
            // Handle theme configuration with defaults
            if (configValue.theme !== undefined) {
                this.applyThemeConfig(configValue.theme);
            }
            // Handle table configuration with defaults
            if (configValue.table !== undefined) {
                const tableWithDefaults = {
                    defaultRows: 3,
                    defaultColumns: 3,
                    allowResize: true,
                    allowMerge: false,
                    ...configValue.table,
                };
                this.tableConfig.set(tableWithDefaults);
            }
        }
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "configEffect" }] : /* istanbul ignore next */ []));
    valueEffect = effect(() => {
        // Handle value input changes
        const valueContent = this.value();
        const editor = this.editorElement()?.nativeElement;
        if (valueContent !== undefined && editor && !this.isUpdatingContent) {
            // Only update DOM if the content is different to avoid cursor reset
            if (editor.innerHTML !== valueContent) {
                this.isUpdatingContent = true;
                // Save cursor position before updating content
                const selection = window.getSelection();
                const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
                editor.innerHTML = valueContent || '';
                // Restore cursor position if possible
                if (range &&
                    selection &&
                    editor.contains(range.commonAncestorContainer)) {
                    try {
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                    catch {
                        // If restoration fails, place cursor at the end
                        const newRange = document.createRange();
                        newRange.selectNodeContents(editor);
                        newRange.collapse(false);
                        selection.removeAllRanges();
                        selection.addRange(newRange);
                    }
                }
                this.isUpdatingContent = false;
            }
            this.content.set(valueContent || '');
            // Update word count when content is set
            setTimeout(() => {
                this.updateWordCount();
            }, 0);
        }
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "valueEffect" }] : /* istanbul ignore next */ []));
    ngOnInit() {
        // Enable design mode for rich text editing
        if (typeof document !== 'undefined') {
            document.execCommand('defaultParagraphSeparator', false, 'p');
            // Set default font family to Arial
            document.execCommand('fontName', false, 'Arial');
        }
        // Initialize performance optimizations
        this.initializePerformanceOptimizations();
        // Initialize word count after component is ready
        this.safeTimeout(() => {
            this.updateWordCount();
            this.initializeAllTables();
            // Also update after DOM is fully rendered
            this.safeTimeout(() => {
                this.updateWordCount();
                this.initializeAllTables();
            }, 100);
        }, 0);
    }
    ngOnDestroy() {
        this.isDestroyed = true;
        // Performance manager handles all cleanup via destroyRef.onDestroy
        // This method is kept for any additional cleanup that might be needed
        // Clear table selection manager
        TableSelectionManager.reset();
        // Clear DOM references and cleanup complex structures
        this.selectedTable.set(null);
        this.spellCheckSuggestions.set([]);
        // Enhanced DOM cleanup
        const editorElement = this.editorElement()?.nativeElement;
        if (editorElement) {
            this.cleanupDOMReferences(editorElement);
        }
        // Clear any cached data
        this.htmlContent.set('');
        this.wordCountStats.set({
            words: 0,
            characters: 0,
            charactersNoSpaces: 0,
            paragraphs: 0,
            sentences: 0,
            readingTime: 0,
        });
    }
    // Safe timeout wrapper using performance manager
    safeTimeout(callback, delay = 0) {
        if (this.isDestroyed)
            return -1;
        const id = window.setTimeout(() => {
            if (!this.isDestroyed) {
                callback();
            }
        }, delay);
        // Track for cleanup
        this.performanceManager.track({
            cleanup: () => clearTimeout(id),
        });
        return id;
    } // Safe interval wrapper using performance manager
    safeInterval(callback, delay) {
        if (this.isDestroyed)
            return;
        const resource = {
            cleanup: () => {
                // Will be set below
            },
        };
        const id = window.setInterval(() => {
            if (this.isDestroyed) {
                clearInterval(id);
                return;
            }
            callback();
        }, delay);
        resource.cleanup = () => clearInterval(id);
        this.performanceManager.track(resource);
    } // Safe event listener wrapper using performance manager
    safeAddEventListener(target, event, listener, options) {
        if (this.isDestroyed)
            return;
        target.addEventListener(event, listener, options);
        const resource = {
            cleanup: () => target.removeEventListener(event, listener),
        };
        this.performanceManager.track(resource);
    } // Debounced method wrapper for performance optimization
    debounce(key, func, delay) {
        return (...args) => {
            if (this.isDestroyed)
                return;
            const existingTimeout = this.debounceTimeouts.get(key);
            if (existingTimeout) {
                clearTimeout(existingTimeout);
            }
            const timeoutId = this.safeTimeout(() => {
                func.apply(this, args);
                this.debounceTimeouts.delete(key);
            }, delay);
            this.debounceTimeouts.set(key, timeoutId);
        };
    }
    // Performance optimized debounced methods - initialized after constructor
    debouncedUpdateEditorState;
    debouncedUpdateWordCount;
    debouncedRunSpellCheck;
    // Observer instances
    resizeObserver;
    execCommand(command, value) {
        if (this.disabled())
            return;
        // Check if the feature is enabled in configuration
        const featureMap = {
            bold: 'bold',
            italic: 'italic',
            underline: 'underline',
            strikeThrough: 'strikethrough',
            subscript: 'subscript',
            superscript: 'superscript',
            justifyLeft: 'alignLeft',
            justifyCenter: 'alignCenter',
            justifyRight: 'alignRight',
            justifyFull: 'alignJustify',
            insertUnorderedList: 'unorderedList',
            insertOrderedList: 'orderedList',
            indent: 'indent',
            outdent: 'outdent',
            undo: 'undo',
            redo: 'redo',
            removeFormat: 'clearFormatting',
        };
        const featureName = featureMap[command];
        if (featureName && !this.isFeatureEnabled(featureName)) {
            console.warn(`Feature '${featureName}' is disabled in editor configuration`);
            return;
        }
        document.execCommand(command, false, value);
        this.updateEditorState();
        this.onContentChange();
    }
    setFontFamily(event) {
        const target = event.target;
        this.execCommand('fontName', target.value);
    }
    setFontSize(event) {
        const target = event.target;
        this.execCommand('fontSize', target.value);
    }
    setTextColor(event) {
        const target = event.target;
        this.execCommand('foreColor', target.value);
    }
    setHeading(event) {
        const target = event.target;
        const value = target.value;
        if (value) {
            this.execCommand('formatBlock', `<${value.toLowerCase()}>`);
        }
        else {
            this.execCommand('formatBlock', '<p>');
        }
    }
    setAlignment(command) {
        this.execCommand(command);
    }
    toggleList(command) {
        this.execCommand(command);
    }
    clearFormatting() {
        this.execCommand('removeFormat');
        this.execCommand('unlink');
    }
    insertPageBreak() {
        if (this.disabled())
            return;
        // Create a page break element using CSS page-break-after
        const pageBreakHtml = `
      <div class="page-break" style="page-break-after: always; border-bottom: 2px dashed #ccc; margin: 20px 0; padding-bottom: 20px; position: relative;">
        <span style="position: absolute; right: 0; bottom: -15px; font-size: 12px; color: #999; background: white; padding: 0 10px;">Page Break</span>
      </div>
      <div><br></div>
    `;
        this.insertHtml(pageBreakHtml);
        this.onContentChange();
    }
    insertSectionDivider() {
        if (this.disabled())
            return;
        // Create a section divider element
        const dividerHtml = `
      <div class="section-divider" style="border-top: 3px solid #e0e0e0; margin: 30px 0; text-align: center; position: relative;">
        <span style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: white; padding: 0 20px; color: #999; font-size: 14px;">• • •</span>
      </div>
      <div><br></div>
    `;
        this.insertHtml(dividerHtml);
        this.onContentChange();
    }
    insertImage() {
        if (this.disabled())
            return;
        const imageUrl = prompt('Enter image URL:', 'https://');
        if (!imageUrl)
            return;
        const altText = prompt('Enter alt text (optional):', '') || 'Image';
        const imageHtml = `<img src="${imageUrl}" alt="${altText}" style="max-width: 100%; height: auto; margin: 10px 0;" />`;
        this.insertHtml(imageHtml);
        this.onContentChange();
    }
    insertVideo() {
        if (this.disabled())
            return;
        const videoUrl = prompt('Enter video URL:', 'https://');
        if (!videoUrl)
            return;
        const videoHtml = `
      <video controls style="max-width: 100%; height: auto; margin: 10px 0;">
        <source src="${videoUrl}" type="video/mp4">
        <p>Your browser does not support the video tag. <a href="${videoUrl}" target="_blank">Download the video</a></p>
      </video>
    `;
        this.insertHtml(videoHtml);
        this.onContentChange();
    }
    insertAudio() {
        if (this.disabled())
            return;
        const audioUrl = prompt('Enter audio URL:', 'https://');
        if (!audioUrl)
            return;
        const audioHtml = `
      <audio controls style="width: 100%; margin: 10px 0;">
        <source src="${audioUrl}" type="audio/mpeg">
        <source src="${audioUrl}" type="audio/wav">
        <source src="${audioUrl}" type="audio/ogg">
        <p>Your browser does not support the audio element. <a href="${audioUrl}" target="_blank">Download the audio</a></p>
      </audio>
    `;
        this.insertHtml(audioHtml);
        this.onContentChange();
    }
    // Keyboard shortcut helper methods
    setHeadingByTag(tag) {
        if (tag === 'p') {
            this.execCommand('formatBlock', '<p>');
        }
        else {
            this.execCommand('formatBlock', `<${tag.toLowerCase()}>`);
        }
    }
    changeFontSize(delta) {
        const currentSize = parseInt(document.queryCommandValue('fontSize'), 10);
        const newSize = Math.max(1, Math.min(7, currentSize + delta));
        this.execCommand('fontSize', newSize.toString());
    }
    // Link & Media Management Methods
    insertLink() {
        if (this.disabled())
            return;
        const selection = document.getSelection();
        const selectedText = selection?.toString() || '';
        const url = prompt('Enter URL:', 'https://');
        if (!url)
            return;
        const text = selectedText || prompt('Enter link text:', url) || url;
        const target = confirm('Open in new tab?') ? '_blank' : '_self';
        if (selectedText) {
            // If text is selected, wrap it in a link
            this.execCommand('createLink', url);
            const links = this.editorElement().nativeElement.querySelectorAll('a[href="' + url + '"]');
            const lastLink = links[links.length - 1];
            if (lastLink) {
                lastLink.target = target;
                lastLink.title = text;
            }
        }
        else {
            // Insert new link
            const linkHtml = `<a href="${url}" target="${target}" title="${text}">${text}</a>`;
            this.insertHtml(linkHtml);
        }
        this.onContentChange();
    }
    editLink() {
        if (this.disabled())
            return;
        const selection = document.getSelection();
        if (!selection || selection.rangeCount === 0)
            return;
        let element = selection.getRangeAt(0).commonAncestorContainer;
        if (element.nodeType === Node.TEXT_NODE) {
            element = element.parentElement;
        }
        // Find the closest link element
        let linkElement = null;
        let current = element;
        while (current && current !== this.editorElement().nativeElement) {
            if (current.tagName === 'A') {
                linkElement = current;
                break;
            }
            current = current.parentElement;
        }
        if (!linkElement) {
            alert('Please place cursor on a link to edit it.');
            return;
        }
        const newUrl = prompt('Enter new URL:', linkElement.href);
        if (newUrl === null)
            return;
        const newText = prompt('Enter new link text:', linkElement.textContent || '');
        if (newText === null)
            return;
        const newTarget = confirm('Open in new tab?') ? '_blank' : '_self';
        linkElement.href = newUrl;
        linkElement.textContent = newText;
        linkElement.target = newTarget;
        this.onContentChange();
    }
    removeLink() {
        if (this.disabled())
            return;
        this.execCommand('unlink');
        this.onContentChange();
    }
    // Media Embedding Methods
    embedYouTube() {
        if (this.disabled())
            return;
        const url = prompt('Enter YouTube URL:');
        if (!url)
            return;
        const videoId = this.extractYouTubeId(url);
        if (!videoId) {
            alert('Invalid YouTube URL');
            return;
        }
        const width = prompt('Enter width (default: 560):', '560') || '560';
        const height = prompt('Enter height (default: 315):', '315') || '315';
        const embedHtml = `
      <div class="youtube-embed" style="margin: 10px 0;">
        <iframe
          width="${width}"
          height="${height}"
          src="https://www.youtube.com/embed/${videoId}"
          frameborder="0"
          allowfullscreen>
        </iframe>
      </div>
    `;
        this.insertHtml(embedHtml);
        this.onContentChange();
    }
    embedTwitter() {
        if (this.disabled())
            return;
        const url = prompt('Enter Twitter URL:');
        if (!url)
            return;
        // For Twitter, we'll create a link with preview functionality
        const embedHtml = `
      <div class="twitter-embed" style="margin: 10px 0; padding: 10px; border: 1px solid #e1e8ed; border-radius: 8px;">
        <a href="${url}" target="_blank" style="color: #1da1f2; text-decoration: none;">
          🐦 View Tweet
        </a>
        <p style="margin: 5px 0 0 0; font-size: 12px; color: #657786;">
          Click to view on Twitter
        </p>
      </div>
    `;
        this.insertHtml(embedHtml);
        this.onContentChange();
    }
    embedInstagram() {
        if (this.disabled())
            return;
        const url = prompt('Enter Instagram URL:');
        if (!url)
            return;
        const embedHtml = `
      <div class="instagram-embed" style="margin: 10px 0; padding: 10px; border: 1px solid #dbdbdb; border-radius: 8px;">
        <a href="${url}" target="_blank" style="color: #e4405f; text-decoration: none;">
          📷 View on Instagram
        </a>
        <p style="margin: 5px 0 0 0; font-size: 12px; color: #8e8e8e;">
          Click to view on Instagram
        </p>
      </div>
    `;
        this.insertHtml(embedHtml);
        this.onContentChange();
    }
    embedVimeo() {
        if (this.disabled())
            return;
        const url = prompt('Enter Vimeo URL:');
        if (!url)
            return;
        const videoId = this.extractVimeoId(url);
        if (!videoId) {
            alert('Invalid Vimeo URL');
            return;
        }
        const width = prompt('Enter width (default: 640):', '640') || '640';
        const height = prompt('Enter height (default: 360):', '360') || '360';
        const embedHtml = `
      <div class="vimeo-embed" style="margin: 10px 0;">
        <iframe
          width="${width}"
          height="${height}"
          src="https://player.vimeo.com/video/${videoId}"
          frameborder="0"
          allowfullscreen>
        </iframe>
      </div>
    `;
        this.insertHtml(embedHtml);
        this.onContentChange();
    }
    embedCustomMedia() {
        if (this.disabled())
            return;
        const embedCode = prompt('Enter custom embed code (iframe, etc.):');
        if (!embedCode)
            return;
        const embedHtml = `
      <div class="custom-embed" style="margin: 10px 0;">
        ${embedCode}
      </div>
    `;
        this.insertHtml(embedHtml);
        this.onContentChange();
    }
    // Helper Methods
    insertHtml(html) {
        let selection = document.getSelection();
        if (!selection || selection.rangeCount === 0) {
            // If no selection, insert at the end
            const editor = this.editorElement().nativeElement;
            editor.focus();
            const range = document.createRange();
            range.selectNodeContents(editor);
            range.collapse(false);
            selection = document.getSelection();
            if (selection) {
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
        try {
            // Try using insertHTML command first
            document.execCommand('insertHTML', false, html);
        }
        catch {
            // Fallback method
            selection = document.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const fragment = document.createRange().createContextualFragment(html);
                range.insertNode(fragment);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }
    extractYouTubeId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    }
    extractVimeoId(url) {
        const regExp = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
        const match = url.match(regExp);
        return match ? match[1] : null;
    }
    // Link Preview Method (Basic implementation)
    generateLinkPreview(url) {
        // In a real implementation, this would fetch Open Graph data
        // For now, we'll create a simple preview structure
        const previewHtml = `
      <div class="link-preview" style="margin: 10px 0; padding: 10px; border: 1px solid #e1e5e9; border-radius: 6px; background: #f8f9fa;">
        <a href="${url}" target="_blank" style="color: #007bff; text-decoration: none; font-weight: 500;">
          🔗 ${url}
        </a>
        <p style="margin: 5px 0 0 0; font-size: 12px; color: #6c757d;">
          Click to visit link
        </p>
      </div>
    `;
        this.insertHtml(previewHtml);
        this.onContentChange();
    }
    onContentChange() {
        if (this.isUpdatingContent || this.isDestroyed) {
            return; // Prevent circular updates and operations on destroyed component
        }
        const editor = this.editorElement().nativeElement;
        const newContent = editor.innerHTML;
        this.content.set(newContent);
        this.valueChange.emit(newContent);
        // Initialize table event listeners for any new/existing tables
        this.safeTimeout(() => {
            this.initializeAllTables();
        }, 10);
        // Use debounced methods for performance optimization
        this.debouncedUpdateWordCount();
        // Run spell check if enabled (debounced for better performance)
        if (this.validationConfig().spellCheck?.enabled) {
            this.debouncedRunSpellCheck();
        }
    }
    // Word Count & Validation Methods
    updateWordCount() {
        if (this.isDestroyed || this.isOperationsPaused)
            return;
        const textContent = this.getTextContent();
        const stats = this.calculateWordCount(textContent);
        this.wordCountStats.set(stats);
        this.wordCountChange.emit(stats);
    }
    calculateWordCount(text) {
        const trimmedText = text.trim();
        // Word count - split by whitespace and filter out empty strings
        const words = trimmedText
            ? trimmedText.split(/\s+/).filter(word => word.length > 0).length
            : 0;
        // Character count
        const characters = text.length;
        const charactersNoSpaces = text.replace(/\s/g, '').length;
        // Paragraph count - split by double line breaks or <p> tags
        const paragraphs = trimmedText
            ? Math.max(1, trimmedText
                .split(/\n\s*\n|\r\n\s*\r\n/)
                .filter(p => p.trim().length > 0).length)
            : 0;
        // Sentence count - approximate by counting sentence-ending punctuation
        const sentences = trimmedText
            ? Math.max(1, (trimmedText.match(/[.!?]+/g) || []).length)
            : 0;
        // Reading time - average 200 words per minute, minimum 1 minute
        const readingTime = words > 0 ? Math.max(1, Math.ceil(words / 200)) : 0;
        return {
            words,
            characters,
            charactersNoSpaces,
            paragraphs,
            sentences,
            readingTime,
        };
    }
    runSpellCheck() {
        if (this.isDestroyed || this.isOperationsPaused)
            return;
        const text = this.getTextContent();
        const suggestions = this.performSpellCheck(text);
        this.spellCheckSuggestions.set(suggestions);
        this.spellCheckResults.emit(suggestions);
    }
    performSpellCheck(text) {
        // Basic spell check implementation
        // In a real-world scenario, you would integrate with a spell check library
        // or API service like Grammarly, LanguageTool, etc.
        const suggestions = [];
        const config = this.validationConfig().spellCheck;
        if (!config?.enabled)
            return suggestions;
        // Simple dictionary of commonly misspelled words for demonstration
        const commonMisspellings = {
            teh: ['the'],
            recieve: ['receive'],
            occured: ['occurred'],
            seperate: ['separate'],
            definately: ['definitely'],
            neccessary: ['necessary'],
            accomodate: ['accommodate'],
            acheive: ['achieve'],
            beleive: ['believe'],
            calender: ['calendar'],
        };
        // Split text into words and check each one
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        let currentOffset = 0;
        words.forEach(word => {
            const wordStart = text.toLowerCase().indexOf(word, currentOffset);
            const wordEnd = wordStart + word.length;
            currentOffset = wordEnd;
            // Check against ignored words
            if (config.ignoredWords?.includes(word)) {
                return;
            }
            // Check against common misspellings
            if (commonMisspellings[word]) {
                suggestions.push({
                    word,
                    suggestions: commonMisspellings[word],
                    position: { start: wordStart, end: wordEnd },
                    startOffset: wordStart,
                    endOffset: wordEnd,
                    type: 'spelling',
                    description: `"${word}" may be misspelled`,
                });
            }
        });
        return suggestions;
    }
    // Validation Methods
    isContentValid() {
        const stats = this.wordCountStats();
        const config = this.validationConfig();
        // Check word count limits
        if (config.maxWords && stats.words > config.maxWords)
            return false;
        if (config.minWords && stats.words < config.minWords)
            return false;
        // Check character count limits
        if (config.maxCharacters && stats.characters > config.maxCharacters)
            return false;
        if (config.minCharacters && stats.characters < config.minCharacters)
            return false;
        return true;
    }
    getValidationErrors() {
        const errors = [];
        const stats = this.wordCountStats();
        const config = this.validationConfig();
        if (config.maxWords && stats.words > config.maxWords) {
            errors.push(`Content exceeds maximum word limit of ${config.maxWords} (current: ${stats.words})`);
        }
        if (config.minWords && stats.words < config.minWords) {
            errors.push(`Content below minimum word requirement of ${config.minWords} (current: ${stats.words})`);
        }
        if (config.maxCharacters && stats.characters > config.maxCharacters) {
            errors.push(`Content exceeds maximum character limit of ${config.maxCharacters} (current: ${stats.characters})`);
        }
        if (config.minCharacters && stats.characters < config.minCharacters) {
            errors.push(`Content below minimum character requirement of ${config.minCharacters} (current: ${stats.characters})`);
        }
        return errors;
    }
    // Spell Check Control Methods
    toggleSpellCheck() {
        const config = this.validationConfig();
        const spellCheckConfig = config.spellCheck || {
            enabled: false,
            language: 'en',
            highlightErrors: true,
            showSuggestions: true,
        };
        this.validationConfig.set({
            ...config,
            spellCheck: {
                ...spellCheckConfig,
                enabled: !spellCheckConfig.enabled,
            },
        });
        if (spellCheckConfig.enabled) {
            this.runSpellCheck();
        }
        else {
            this.spellCheckSuggestions.set([]);
        }
    }
    acceptSpellingSuggestion(originalWord, suggestion) {
        const editor = this.editorElement().nativeElement;
        const content = editor.innerHTML;
        // Replace the misspelled word with the suggestion
        const regex = new RegExp(`\\b${originalWord}\\b`, 'gi');
        const newContent = content.replace(regex, suggestion);
        editor.innerHTML = newContent;
        this.onContentChange();
    }
    ignoreSpellingSuggestion(word) {
        const config = this.validationConfig();
        const spellCheckConfig = config.spellCheck || {
            enabled: true,
            language: 'en',
            highlightErrors: true,
            showSuggestions: true,
        };
        const ignoredWords = spellCheckConfig.ignoredWords || [];
        ignoredWords.push(word.toLowerCase());
        this.validationConfig.set({
            ...config,
            spellCheck: {
                ...spellCheckConfig,
                ignoredWords,
            },
        });
        // Re-run spell check to remove this word from suggestions
        this.runSpellCheck();
    }
    onKeyDown(event) {
        if (this.disabled()) {
            event.preventDefault();
            return;
        }
        // Handle accessibility-specific shortcuts first
        this.handleAccessibilityKeyDown(event);
        // If the event was handled by accessibility features, return early
        if (event.defaultPrevented) {
            return;
        }
        // Handle keyboard shortcuts
        if (event.ctrlKey || event.metaKey) {
            switch (event.key.toLowerCase()) {
                // Text formatting shortcuts
                case 'b':
                    if (this.isFeatureEnabled('bold')) {
                        event.preventDefault();
                        this.execCommand('bold');
                    }
                    break;
                case 'i':
                    if (this.isFeatureEnabled('italic')) {
                        event.preventDefault();
                        this.execCommand('italic');
                    }
                    break;
                case 'u':
                    if (this.isFeatureEnabled('underline')) {
                        event.preventDefault();
                        this.execCommand('underline');
                    }
                    break;
                case 's':
                    if (event.shiftKey && this.isFeatureEnabled('strikethrough')) {
                        // Ctrl+Shift+S for strikethrough
                        event.preventDefault();
                        this.execCommand('strikeThrough');
                    }
                    break;
                // Subscript/Superscript shortcuts
                case '=':
                    if (event.shiftKey && this.isFeatureEnabled('superscript')) {
                        // Ctrl+Shift+= for superscript
                        event.preventDefault();
                        this.execCommand('superscript');
                    }
                    else if (this.isFeatureEnabled('subscript')) {
                        // Ctrl+= for subscript
                        event.preventDefault();
                        this.execCommand('subscript');
                    }
                    break;
                // Alignment shortcuts
                case 'l':
                    if (event.shiftKey && this.isFeatureEnabled('alignLeft')) {
                        // Ctrl+Shift+L for left align
                        event.preventDefault();
                        this.execCommand('justifyLeft');
                    }
                    break;
                case 'e':
                    if (event.shiftKey && this.isFeatureEnabled('alignCenter')) {
                        // Ctrl+Shift+E for center align
                        event.preventDefault();
                        this.execCommand('justifyCenter');
                    }
                    break;
                case 'r':
                    if (event.shiftKey && this.isFeatureEnabled('alignRight')) {
                        // Ctrl+Shift+R for right align
                        event.preventDefault();
                        this.execCommand('justifyRight');
                    }
                    break;
                case 'j':
                    if (event.shiftKey && this.isFeatureEnabled('alignJustify')) {
                        // Ctrl+Shift+J for justify
                        event.preventDefault();
                        this.execCommand('justifyFull');
                    }
                    break;
                // List shortcuts
                case '8':
                    if (event.shiftKey && this.isFeatureEnabled('unorderedList')) {
                        // Ctrl+Shift+8 for bullet list
                        event.preventDefault();
                        this.toggleList('insertUnorderedList');
                    }
                    break;
                case '7':
                    if (event.shiftKey && this.isFeatureEnabled('orderedList')) {
                        // Ctrl+Shift+7 for numbered list
                        event.preventDefault();
                        this.toggleList('insertOrderedList');
                    }
                    break;
                // Link shortcuts
                case 'k':
                    if (this.isFeatureEnabled('insertLink')) {
                        // Ctrl+K for insert/edit link
                        event.preventDefault();
                        this.insertLink();
                    }
                    break;
                // Indent shortcuts
                case ']':
                    if (this.isFeatureEnabled('indent')) {
                        // Ctrl+] for indent
                        event.preventDefault();
                        this.execCommand('indent');
                    }
                    break;
                case '[':
                    if (this.isFeatureEnabled('outdent')) {
                        // Ctrl+[ for outdent
                        event.preventDefault();
                        this.execCommand('outdent');
                    }
                    break;
                // Table shortcuts
                case 't':
                    if (event.shiftKey && this.isFeatureEnabled('insertTable')) {
                        // Ctrl+Shift+T for insert table
                        event.preventDefault();
                        this.insertTable();
                    }
                    break;
                // Undo/Redo shortcuts
                case 'z':
                    if (event.shiftKey && this.isFeatureEnabled('redo')) {
                        event.preventDefault();
                        this.execCommand('redo');
                    }
                    else if (this.isFeatureEnabled('undo')) {
                        event.preventDefault();
                        this.execCommand('undo');
                    }
                    break;
                case 'y':
                    if (this.isFeatureEnabled('redo')) {
                        // Ctrl+Y for redo (alternative)
                        event.preventDefault();
                        this.execCommand('redo');
                    }
                    break;
                // Clear formatting
                case '\\':
                    if (this.isFeatureEnabled('clearFormatting')) {
                        // Ctrl+\ for remove formatting
                        event.preventDefault();
                        this.clearFormatting();
                    }
                    break;
                // Font size shortcuts
                case '.':
                    if (event.shiftKey) {
                        // Ctrl+Shift+. for increase font size
                        event.preventDefault();
                        this.changeFontSize(1);
                    }
                    break;
                case ',':
                    if (event.shiftKey) {
                        // Ctrl+Shift+, for decrease font size
                        event.preventDefault();
                        this.changeFontSize(-1);
                    }
                    break;
                case 'enter':
                    // Ctrl+Enter for page break
                    event.preventDefault();
                    this.insertPageBreak();
                    break;
                case 'h':
                    if (event.shiftKey && this.isFeatureEnabled('htmlEdit')) {
                        // Ctrl+Shift+H for HTML edit mode
                        event.preventDefault();
                        this.toggleHtmlEdit();
                    }
                    break;
            }
        }
        // Handle heading shortcuts with Alt key
        if (event.altKey && !event.ctrlKey && !event.metaKey) {
            switch (event.key) {
                case '1':
                    event.preventDefault();
                    this.setHeadingByTag('h1');
                    break;
                case '2':
                    event.preventDefault();
                    this.setHeadingByTag('h2');
                    break;
                case '3':
                    event.preventDefault();
                    this.setHeadingByTag('h3');
                    break;
                case '4':
                    event.preventDefault();
                    this.setHeadingByTag('h4');
                    break;
                case '5':
                    event.preventDefault();
                    this.setHeadingByTag('h5');
                    break;
                case '6':
                    event.preventDefault();
                    this.setHeadingByTag('h6');
                    break;
                case '0':
                    event.preventDefault();
                    this.setHeadingByTag('p');
                    break;
            }
        }
        // Update state after key events (debounced for performance)
        this.debouncedUpdateEditorState();
    }
    // Helper method to check if a feature is enabled in configuration
    isFeatureEnabled(feature) {
        const config = this.toolbarConfig();
        switch (feature) {
            // Text formatting features
            case 'bold':
                return config.showBold ?? true;
            case 'italic':
                return config.showItalic ?? true;
            case 'underline':
                return config.showUnderline ?? true;
            case 'strikethrough':
                return config.showStrikethrough ?? true;
            case 'subscript':
                return config.showSubscript ?? true;
            case 'superscript':
                return config.showSuperscript ?? true;
            // Alignment features
            case 'alignLeft':
                return config.showAlignLeft ?? true;
            case 'alignCenter':
                return config.showAlignCenter ?? true;
            case 'alignRight':
                return config.showAlignRight ?? true;
            case 'alignJustify':
                return config.showAlignJustify ?? true;
            // List features
            case 'unorderedList':
                return config.showUnorderedList ?? true;
            case 'orderedList':
                return config.showOrderedList ?? true;
            // Indent features
            case 'indent':
                return config.showIndentIncrease ?? true;
            case 'outdent':
                return config.showOutdent ?? true;
            // Undo/redo features
            case 'undo':
                return config.showUndo ?? true;
            case 'redo':
                return config.showRedo ?? true;
            // Link features
            case 'insertLink':
                return config.showInsertLink ?? true;
            // Table features
            case 'insertTable':
                return config.showInsertTable ?? true;
            // Clear formatting
            case 'clearFormatting':
                return config.showClearFormatting ?? true;
            // HTML editing
            case 'htmlEdit':
                return config.showHtmlEdit ?? true;
            // Font features
            case 'fontFamily':
                return config.showFontFamily ?? true;
            case 'fontSize':
                return config.showFontSize ?? true;
            // Default: allow unknown features
            default:
                return true;
        }
    }
    updateEditorState() {
        if (typeof document === 'undefined')
            return;
        const state = {
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            underline: document.queryCommandState('underline'),
            strikethrough: document.queryCommandState('strikeThrough'),
            subscript: document.queryCommandState('subscript'),
            superscript: document.queryCommandState('superscript'),
            fontSize: document.queryCommandValue('fontSize') || '3',
            fontFamily: document.queryCommandValue('fontName') || 'Arial',
            textColor: document.queryCommandValue('foreColor') || '#000000',
            alignment: this.getCurrentAlignment(),
            heading: this.getCurrentHeading(),
            listType: this.getCurrentListType(),
        };
        this.editorState.set(state);
        this.stateChange.emit(state);
        // Also update word count when editor state changes
        this.updateWordCount();
    }
    getCurrentAlignment() {
        if (document.queryCommandState('justifyLeft'))
            return 'left';
        if (document.queryCommandState('justifyCenter'))
            return 'center';
        if (document.queryCommandState('justifyRight'))
            return 'right';
        if (document.queryCommandState('justifyFull'))
            return 'justify';
        return 'left';
    }
    getCurrentHeading() {
        const selection = document.getSelection();
        if (selection && selection.rangeCount > 0) {
            let element = selection.getRangeAt(0).commonAncestorContainer;
            if (element.nodeType === Node.TEXT_NODE) {
                element = element.parentElement;
            }
            while (element && element !== this.editorElement().nativeElement) {
                const tagName = element.tagName;
                if (tagName && /^H[1-6]$/.test(tagName)) {
                    return tagName;
                }
                element = element.parentElement;
            }
        }
        return '';
    }
    getCurrentListType() {
        const selection = document.getSelection();
        if (selection && selection.rangeCount > 0) {
            let element = selection.getRangeAt(0).commonAncestorContainer;
            if (element.nodeType === Node.TEXT_NODE) {
                element = element.parentElement;
            }
            while (element && element !== this.editorElement().nativeElement) {
                const tagName = element.tagName;
                if (tagName === 'UL')
                    return 'unordered';
                if (tagName === 'OL')
                    return 'ordered';
                element = element.parentElement;
            }
        }
        return '';
    }
    onFocus() {
        this.focusEvent.emit();
        this.updateEditorState();
        // Update word count on focus to ensure stats are current
        this.updateWordCount();
    }
    onBlur() {
        this.blurEvent.emit();
    }
    // Public API methods
    getContent() {
        return this.content();
    }
    setContent(content) {
        this.content.set(content);
    }
    getTextContent() {
        return this.editorElement().nativeElement.textContent || '';
    }
    isEmpty() {
        const textContent = this.getTextContent().trim();
        return textContent.length === 0;
    }
    focus() {
        this.editorElement().nativeElement.focus();
    }
    // Force update word count (useful for debugging or manual refresh)
    refreshWordCount() {
        this.updateWordCount();
    }
    // Performance monitoring utilities
    getPerformanceMetrics() {
        return {
            activeResources: this.performanceManager.getActiveResourceCount?.() || 0,
            debounceTimeouts: this.debounceTimeouts.size,
            isOptimized: !this.isOperationsPaused,
            memoryUsage: performance.memory?.usedJSHeapSize || undefined,
        };
    }
    // Debug method to check for potential memory leaks
    checkForMemoryLeaks() {
        const metrics = this.getPerformanceMetrics();
        // Warn about potential issues
        if (metrics.activeResources > 20) {
            console.warn('High number of active resources detected. Check for memory leaks.');
        }
        if (metrics.debounceTimeouts > 10) {
            console.warn('High number of debounce timeouts detected. Check for proper cleanup.');
        }
    }
    // Performance Optimization Methods
    initializePerformanceOptimizations() {
        this.setupIntersectionObserver();
        this.setupResizeObserver();
        this.setupMutationObserver();
    }
    setupIntersectionObserver() {
        if (!isPlatformBrowser(this.platformId) ||
            !('IntersectionObserver' in window))
            return;
        const intersectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Editor is visible, enable full functionality
                    this.resumePerformanceIntensiveOperations();
                }
                else {
                    // Editor is hidden, reduce operations
                    this.pausePerformanceIntensiveOperations();
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px',
        });
        // Observe the editor wrapper
        const editorWrapper = this.editorElement().nativeElement.closest('.ng-rm-editor-wrapper');
        if (editorWrapper) {
            intersectionObserver.observe(editorWrapper);
        }
        // Track for cleanup
        this.performanceManager.track({
            cleanup: () => intersectionObserver.disconnect(),
        });
    }
    setupResizeObserver() {
        if (!('ResizeObserver' in window))
            return;
        this.resizeObserver = new ResizeObserver(entries => {
            // Debounce resize handling for performance
            this.debounce('resize', () => {
                entries.forEach(() => {
                    this.handleEditorResize();
                });
            }, 100)();
        });
        const editorElement = this.editorElement().nativeElement;
        this.resizeObserver.observe(editorElement);
    }
    setupMutationObserver() {
        if (!isPlatformBrowser(this.platformId) || !('MutationObserver' in window))
            return;
        const mutationObserver = new MutationObserver(mutations => {
            // Batch DOM mutations for performance
            const hasMeaningfulChanges = mutations.some(mutation => mutation.type === 'childList' ||
                (mutation.type === 'characterData' && mutation.target.textContent));
            if (hasMeaningfulChanges && !this.isUpdatingContent) {
                this.debouncedUpdateWordCount();
            }
        });
        const editorElement = this.editorElement().nativeElement;
        mutationObserver.observe(editorElement, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: false, // Skip attribute changes for performance
        });
        // Track for cleanup
        this.performanceManager.track({
            cleanup: () => mutationObserver.disconnect(),
        });
    }
    isOperationsPaused = false;
    pausePerformanceIntensiveOperations() {
        this.isOperationsPaused = true;
        // Clear any pending debounced operations
        this.debounceTimeouts.forEach((timeoutId, key) => {
            if (key.includes('wordCount') || key.includes('spellCheck')) {
                clearTimeout(timeoutId);
                this.debounceTimeouts.delete(key);
            }
        });
    }
    resumePerformanceIntensiveOperations() {
        if (this.isOperationsPaused) {
            this.isOperationsPaused = false;
            // Resume operations
            this.safeTimeout(() => {
                this.updateWordCount();
                if (this.validationConfig().spellCheck?.enabled) {
                    this.runSpellCheck();
                }
            }, 100);
        }
    }
    handleEditorResize() {
        if (this.isDestroyed || this.isOperationsPaused)
            return;
        // Handle any resize-specific logic here
        // For example, adjusting table sizes, recalculating layouts, etc.
    }
    // Optimized DOM manipulation methods
    createDocumentFragment() {
        return document.createDocumentFragment();
    }
    batchDOMUpdates(updates) {
        // Use requestAnimationFrame for smooth DOM updates
        if ('requestAnimationFrame' in window) {
            requestAnimationFrame(() => {
                if (!this.isDestroyed) {
                    updates();
                }
            });
        }
        else {
            this.safeTimeout(updates, 16); // ~60fps fallback
        }
    }
    // Memory optimization for large content
    MAX_CONTENT_SIZE = 100000; // 100KB
    CHUNK_SIZE = 1000; // Process in chunks
    processLargeContent(content, processor) {
        if (content.length <= this.MAX_CONTENT_SIZE) {
            processor(content);
            return;
        }
        // Process in chunks to prevent UI blocking
        let index = 0;
        const processChunk = () => {
            if (this.isDestroyed)
                return;
            const chunk = content.slice(index, index + this.CHUNK_SIZE);
            if (chunk) {
                processor(chunk);
                index += this.CHUNK_SIZE;
                if (index < content.length) {
                    // Schedule next chunk
                    this.safeTimeout(processChunk, 0);
                }
            }
        };
        processChunk();
    }
    // Lazy loading for heavy operations
    lazyLoadFeature(loader) {
        if (this.isDestroyed) {
            return Promise.reject(new Error('Component destroyed'));
        }
        return loader().catch(error => {
            throw error;
        });
    }
    // Enhanced cleanup for complex DOM structures
    cleanupDOMReferences(element) {
        // Remove event listeners from child elements
        const elementsWithListeners = element.querySelectorAll('[data-has-listener]');
        elementsWithListeners.forEach(el => {
            el.removeAttribute('data-has-listener');
        });
        // Clear any cached references
        element.style.cssText = '';
        // Remove custom properties that might hold references
        const customProps = Object.getOwnPropertyNames(element).filter(prop => prop.startsWith('_') || prop.includes('cache') || prop.includes('ref'));
        customProps.forEach(prop => {
            try {
                delete element[prop];
            }
            catch {
                // Ignore errors for non-configurable properties
            }
        });
    }
    blur() {
        this.editorElement().nativeElement.blur();
    }
    // Full-screen and theme methods
    toggleFullScreen() {
        const isCurrentlyFullScreen = this.isFullScreen();
        if (isCurrentlyFullScreen) {
            this.exitFullScreen();
        }
        else {
            this.enterFullScreen();
        }
    }
    enterFullScreen() {
        const editorWrapper = this.editorElement().nativeElement.closest('.ng-rm-editor-wrapper');
        if (editorWrapper && !this.isFullScreen()) {
            editorWrapper.classList.add('full-screen');
            document.body.classList.add('editor-full-screen');
            this.isFullScreen.set(true);
            this.fullScreenChange.emit(true);
            // Hide toolbar in distraction-free mode
            const config = this.configSignal();
            if (config.fullScreen?.distractionFree) {
                this.isDistractionFree.set(true);
            }
            // Add escape key listener
            this.addFullScreenListeners();
        }
    }
    exitFullScreen() {
        const editorWrapper = this.editorElement().nativeElement.closest('.ng-rm-editor-wrapper');
        if (editorWrapper && this.isFullScreen()) {
            editorWrapper.classList.remove('full-screen');
            document.body.classList.remove('editor-full-screen');
            this.isFullScreen.set(false);
            this.isDistractionFree.set(false);
            this.fullScreenChange.emit(false);
            this.removeFullScreenListeners();
        }
    }
    escapeKeyHandler = (event) => this.handleEscapeKey(event);
    addFullScreenListeners() {
        const config = this.configSignal();
        if (config.fullScreen?.exitOnEscape !== false) {
            this.safeAddEventListener(document, 'keydown', this.escapeKeyHandler);
        }
    }
    removeFullScreenListeners() {
        // Event listeners will be automatically removed in ngOnDestroy
        // This method kept for explicit cleanup if needed
    }
    handleEscapeKey(event) {
        if (event.key === 'Escape' && this.isFullScreen()) {
            this.exitFullScreen();
        }
    }
    toggleTheme() {
        const currentTheme = this.currentTheme();
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
    setTheme(theme) {
        const editorWrapper = this.editorElement().nativeElement.closest('.ng-rm-editor-wrapper');
        if (editorWrapper) {
            editorWrapper.classList.remove('theme-light', 'theme-dark', 'theme-auto');
            editorWrapper.classList.add(`theme-${theme}`);
            this.currentTheme.set(theme);
            this.themeChange.emit(theme);
            // Handle auto theme detection
            if (theme === 'auto') {
                this.handleAutoTheme(editorWrapper);
            }
        }
    }
    handleAutoTheme(editorWrapper) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        const applyAutoTheme = () => {
            if (this.isDestroyed)
                return;
            editorWrapper.classList.remove('theme-auto-light', 'theme-auto-dark');
            editorWrapper.classList.add(prefersDark.matches ? 'theme-auto-dark' : 'theme-auto-light');
        };
        applyAutoTheme();
        this.safeAddEventListener(prefersDark, 'change', applyAutoTheme);
    }
    toggleDistractionFree() {
        if (this.isFullScreen()) {
            this.isDistractionFree.set(!this.isDistractionFree());
        }
        else {
            // Enter full-screen in distraction-free mode
            this.enterFullScreen();
            this.isDistractionFree.set(true);
        }
    }
    // Apply theme configuration with defaults
    applyThemeConfig(themeConfig) {
        const themeWithDefaults = {
            mode: 'light',
            customTheme: undefined,
            ...themeConfig,
        };
        // Apply the theme mode
        this.setTheme(themeWithDefaults.mode);
        // Apply custom theme if provided
        if (themeWithDefaults.customTheme) {
            this.applyCustomTheme(themeWithDefaults.customTheme);
        }
    }
    // Apply custom theme CSS variables
    applyCustomTheme(customTheme) {
        const editorWrapper = this.editorElement()?.nativeElement?.closest('.ng-rm-editor-wrapper');
        if (editorWrapper && customTheme) {
            // Apply custom CSS variables to editor wrapper
            if (customTheme['primary'])
                editorWrapper.style.setProperty('--editor-primary', customTheme['primary']);
            if (customTheme['background'])
                editorWrapper.style.setProperty('--editor-background', customTheme['background']);
            if (customTheme['surface'])
                editorWrapper.style.setProperty('--editor-surface', customTheme['surface']);
            if (customTheme['text'])
                editorWrapper.style.setProperty('--editor-text', customTheme['text']);
            if (customTheme['textSecondary'])
                editorWrapper.style.setProperty('--editor-text-secondary', customTheme['textSecondary']);
            if (customTheme['border'])
                editorWrapper.style.setProperty('--editor-border', customTheme['border']);
            if (customTheme['toolbarBackground'])
                editorWrapper.style.setProperty('--editor-toolbar-bg', customTheme['toolbarBackground']);
            if (customTheme['buttonHover'])
                editorWrapper.style.setProperty('--editor-button-hover', customTheme['buttonHover']);
        }
    }
    // Table Methods
    insertTable(rows = 3, columns = 3) {
        // Check if we're trying to insert inside an existing table
        const selection = document.getSelection();
        if (selection && selection.rangeCount > 0) {
            const targetElement = selection.focusNode?.parentElement;
            if (targetElement && NestedTableSanitizer.isInsideTable(targetElement)) {
                alert('Cannot insert tables inside tables. Please place cursor outside the table.');
                return;
            }
        }
        const config = this.tableConfig();
        const tableRows = rows || config.defaultRows || 3;
        const tableCols = columns || config.defaultColumns || 3;
        let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%; cursor: pointer;">';
        for (let i = 0; i < tableRows; i++) {
            tableHTML += '<tr>';
            for (let j = 0; j < tableCols; j++) {
                tableHTML +=
                    '<td contenteditable="true" style="padding: 8px; border: 1px solid #ddd; min-width: 50px; min-height: 25px;">Cell</td>';
            }
            tableHTML += '</tr>';
        }
        tableHTML += '</table><p>&nbsp;</p>';
        this.execCommand('insertHTML', tableHTML);
        // Use setTimeout to ensure DOM is updated before selecting table
        this.safeTimeout(() => {
            const editor = this.editorElement().nativeElement;
            const tables = editor.querySelectorAll('table:not([data-table-initialized])');
            const newTable = tables[tables.length - 1];
            if (newTable) {
                // Initialize the new table immediately
                this.selectedTable.set(newTable);
                newTable.setAttribute('data-table-initialized', 'true');
                // Use TableSelectionManager for proper selection
                TableSelectionManager.selectTable(newTable, editor);
                this.addTableEventListeners(newTable);
                const tableData = {
                    rows: tableRows,
                    columns: tableCols,
                    cells: this.extractTableData(newTable),
                    style: {},
                };
                this.tableInsert.emit(tableData);
            }
        }, 50);
    }
    insertRowAbove() {
        const table = this.selectedTable();
        if (!table)
            return;
        const selection = document.getSelection();
        if (!selection || selection.rangeCount === 0)
            return;
        const cell = selection.focusNode?.parentElement?.closest('td, th');
        if (!cell)
            return;
        const row = cell.parentElement;
        const rowIndex = Array.from(table.rows).indexOf(row);
        const newRow = table.insertRow(rowIndex);
        const columnCount = row.cells.length;
        for (let i = 0; i < columnCount; i++) {
            const newCell = newRow.insertCell();
            newCell.innerHTML = '&nbsp;';
            // Copy styles from the corresponding cell in the reference row
            this.copyTableCellStyles(row.cells[i], newCell);
        }
        this.updateTableData(table);
    }
    insertRowBelow() {
        const table = this.selectedTable();
        if (!table)
            return;
        const selection = document.getSelection();
        if (!selection || selection.rangeCount === 0)
            return;
        const cell = selection.focusNode?.parentElement?.closest('td, th');
        if (!cell)
            return;
        const row = cell.parentElement;
        const rowIndex = Array.from(table.rows).indexOf(row);
        const newRow = table.insertRow(rowIndex + 1);
        const columnCount = row.cells.length;
        for (let i = 0; i < columnCount; i++) {
            const newCell = newRow.insertCell();
            newCell.innerHTML = '&nbsp;';
            // Copy styles from the corresponding cell in the reference row
            this.copyTableCellStyles(row.cells[i], newCell);
        }
        this.updateTableData(table);
    }
    insertColumnLeft() {
        const table = this.selectedTable();
        if (!table)
            return;
        const selection = document.getSelection();
        if (!selection || selection.rangeCount === 0)
            return;
        const cell = selection.focusNode?.parentElement?.closest('td, th');
        if (!cell)
            return;
        const cellIndex = Array.from(cell.parentElement.children).indexOf(cell);
        Array.from(table.rows).forEach(row => {
            const newCell = row.insertCell(cellIndex);
            newCell.innerHTML = '&nbsp;';
            // Copy styles from adjacent cell or a reference cell in the same row
            const referenceCell = cellIndex > 0
                ? row.cells[cellIndex]
                : row.cells.length > 1
                    ? row.cells[1]
                    : null;
            if (referenceCell) {
                this.copyTableCellStyles(referenceCell, newCell);
            }
            else {
                // Fallback to default styles if no reference available
                this.applyDefaultCellStyles(newCell);
            }
        });
        // Refresh event listeners for new cells
        this.refreshCellEventListeners(table);
        this.updateTableData(table);
    }
    insertColumnRight() {
        const table = this.selectedTable();
        if (!table)
            return;
        const selection = document.getSelection();
        if (!selection || selection.rangeCount === 0)
            return;
        const cell = selection.focusNode?.parentElement?.closest('td, th');
        if (!cell)
            return;
        const cellIndex = Array.from(cell.parentElement.children).indexOf(cell);
        Array.from(table.rows).forEach(row => {
            const newCell = row.insertCell(cellIndex + 1);
            newCell.innerHTML = '&nbsp;';
            // Copy styles from the reference cell (the one we're inserting after)
            const referenceCell = row.cells[cellIndex];
            if (referenceCell) {
                this.copyTableCellStyles(referenceCell, newCell);
            }
            else {
                // Fallback to default styles if no reference available
                this.applyDefaultCellStyles(newCell);
            }
        });
        // Refresh event listeners for new cells
        this.refreshCellEventListeners(table);
        this.updateTableData(table);
    }
    deleteRow() {
        const table = this.selectedTable();
        if (!table || table.rows.length <= 1)
            return;
        const selection = document.getSelection();
        if (!selection || selection.rangeCount === 0)
            return;
        const cell = selection.focusNode?.parentElement?.closest('td, th');
        if (!cell)
            return;
        const row = cell.parentElement;
        const rowIndex = Array.from(table.rows).indexOf(row);
        table.deleteRow(rowIndex);
        this.updateTableData(table);
    }
    deleteColumn() {
        const table = this.selectedTable();
        if (!table)
            return;
        // Check if table has more than one column
        if (table.rows.length > 0 && table.rows[0].cells.length <= 1)
            return;
        const selection = document.getSelection();
        if (!selection || selection.rangeCount === 0)
            return;
        const cell = selection.focusNode?.parentElement?.closest('td, th');
        if (!cell)
            return;
        const cellIndex = Array.from(cell.parentElement.children).indexOf(cell);
        Array.from(table.rows).forEach(row => {
            if (row.cells[cellIndex]) {
                row.deleteCell(cellIndex);
            }
        });
        this.updateTableData(table);
    }
    extractTableData(table) {
        return Array.from(table.rows).map(row => {
            return Array.from(row.cells).map(cell => {
                return {
                    content: cell.innerHTML,
                    rowspan: cell.rowSpan > 1 ? cell.rowSpan : undefined,
                    colspan: cell.colSpan > 1 ? cell.colSpan : undefined,
                    style: {
                        textAlign: cell.style.textAlign || undefined,
                        verticalAlign: cell.style.verticalAlign || undefined,
                        padding: cell.style.padding || undefined,
                    },
                };
            });
        });
    }
    updateTableData(table) {
        const tableData = {
            rows: table.rows.length,
            columns: table.rows.length > 0 ? table.rows[0].cells.length : 0,
            cells: this.extractTableData(table),
            style: {
                width: table.style.width || undefined,
                height: table.style.height || undefined,
            },
        };
        this.tableModify.emit(tableData);
    }
    copyTableCellStyles(sourceCell, targetCell) {
        if (!sourceCell || !targetCell)
            return;
        // Copy computed styles that are commonly used in tables
        const computedStyle = window.getComputedStyle(sourceCell);
        // Copy border styles
        targetCell.style.border = sourceCell.style.border || computedStyle.border;
        targetCell.style.borderTop =
            sourceCell.style.borderTop || computedStyle.borderTop;
        targetCell.style.borderRight =
            sourceCell.style.borderRight || computedStyle.borderRight;
        targetCell.style.borderBottom =
            sourceCell.style.borderBottom || computedStyle.borderBottom;
        targetCell.style.borderLeft =
            sourceCell.style.borderLeft || computedStyle.borderLeft;
        // Copy spacing and sizing
        targetCell.style.padding =
            sourceCell.style.padding || computedStyle.padding;
        targetCell.style.width = sourceCell.style.width;
        targetCell.style.height = sourceCell.style.height;
        // Copy text alignment
        targetCell.style.textAlign =
            sourceCell.style.textAlign || computedStyle.textAlign;
        targetCell.style.verticalAlign =
            sourceCell.style.verticalAlign || computedStyle.verticalAlign;
        // Copy font styles
        targetCell.style.fontFamily =
            sourceCell.style.fontFamily || computedStyle.fontFamily;
        targetCell.style.fontSize =
            sourceCell.style.fontSize || computedStyle.fontSize;
        targetCell.style.fontWeight =
            sourceCell.style.fontWeight || computedStyle.fontWeight;
        targetCell.style.fontStyle =
            sourceCell.style.fontStyle || computedStyle.fontStyle;
        // Copy any class names that might affect styling
        if (sourceCell.className) {
            targetCell.className = sourceCell.className;
        }
    }
    validateCellsForMerging(cells) {
        if (cells.length < 2)
            return false;
        const table = this.selectedTable();
        if (!table)
            return false;
        // Get the positions of all selected cells
        const cellPositions = cells.map(cell => {
            const row = cell.parentElement;
            const rowIndex = Array.from(table.rows).indexOf(row);
            const colIndex = Array.from(row.children).indexOf(cell);
            return { rowIndex, colIndex, cell };
        });
        // Find the bounds of the selected area
        const minRow = Math.min(...cellPositions.map(p => p.rowIndex));
        const maxRow = Math.max(...cellPositions.map(p => p.rowIndex));
        const minCol = Math.min(...cellPositions.map(p => p.colIndex));
        const maxCol = Math.max(...cellPositions.map(p => p.colIndex));
        // Check if we have all cells in the rectangular area
        const expectedCells = (maxRow - minRow + 1) * (maxCol - minCol + 1);
        // Also verify each cell in the rectangle is selected
        for (let r = minRow; r <= maxRow; r++) {
            const row = table.rows[r];
            if (!row)
                return false;
            for (let c = minCol; c <= maxCol; c++) {
                const cell = row.children[c];
                if (!cell || !cells.includes(cell))
                    return false;
            }
        }
        return cellPositions.length === expectedCells;
    }
    splitCells() {
        const selection = document.getSelection();
        if (!selection || selection.rangeCount === 0) {
            console.log('No selection found');
            alert('Please select a cell to split');
            return;
        }
        const cell = selection.focusNode?.parentElement?.closest('td, th');
        // Use new validation from CellMergeValidator
        const validation = CellMergeValidator.canSplitCell(cell);
        if (!validation.valid) {
            console.warn('Cannot split cell:', validation.reason);
            alert(`Cannot split cell: ${validation.reason}`);
            return;
        }
        const table = this.selectedTable();
        if (!table)
            return;
        // Check for nested tables
        if (CellMergeValidator.hasNestedTables(table)) {
            alert('Cannot split cells in tables containing nested tables');
            return;
        }
        const row = cell.parentElement;
        const rowIndex = Array.from(table.rows).indexOf(row);
        const cellIndex = Array.from(row.children).indexOf(cell);
        const originalRowspan = cell.rowSpan || 1;
        const originalColspan = cell.colSpan || 1;
        // Reset the cell to single cell
        cell.rowSpan = 1;
        cell.colSpan = 1;
        // Add new cells to fill the space that was previously merged
        for (let r = 0; r < originalRowspan; r++) {
            const targetRow = table.rows[rowIndex + r];
            if (!targetRow)
                continue;
            const startCol = r === 0 ? 1 : 0; // Skip first cell in first row (it's the original cell)
            for (let c = startCol; c < originalColspan; c++) {
                // Calculate the correct insertion index
                let insertIndex = cellIndex + c;
                if (r > 0) {
                    insertIndex = cellIndex;
                }
                // Create new cell
                const newCell = targetRow.insertCell(Math.min(insertIndex, targetRow.cells.length));
                newCell.innerHTML = '&nbsp;';
                // Copy styles from the original merged cell
                this.copyTableCellStyles(cell, newCell);
            }
        }
        // Refresh event listeners for new cells
        this.refreshCellEventListeners(table);
        this.updateTableData(table);
    }
    addTableEventListeners(table) {
        // Remove any existing listeners to avoid duplicates
        const existingCells = table.querySelectorAll('td[data-has-listener], th[data-has-listener]');
        existingCells.forEach(cell => {
            cell.removeAttribute('data-has-listener');
        });
        const tableClickHandler = (e) => {
            if (this.isDestroyed)
                return;
            // Use centralized TableSelectionManager
            const editor = this.editorElement().nativeElement;
            TableSelectionManager.clearAllSelections();
            TableSelectionManager.selectTable(table, editor);
            // Update component signal
            this.selectedTable.set(table);
            // Remove resize handles from all tables first
            editor.querySelectorAll('table').forEach(t => {
                this.removeTableResizeHandles(t);
            });
            // Clear any selected cells
            editor.querySelectorAll('.selected-cell').forEach(c => {
                c.classList.remove('selected-cell');
            });
            // Add resize handles for drag functionality
            this.addTableResizeHandles(table);
            e.stopPropagation();
        };
        this.safeAddEventListener(table, 'click', tableClickHandler);
        // Add cell selection functionality to all cells
        this.refreshCellEventListeners(table);
    }
    refreshCellEventListeners(table) {
        const cells = table.querySelectorAll('td, th');
        cells.forEach(cell => {
            // Ensure cell is contenteditable
            if (!cell.hasAttribute('contenteditable')) {
                cell.setAttribute('contenteditable', 'true');
            }
            // Only add listener if not already added
            if (!cell.hasAttribute('data-has-listener')) {
                const cellClickHandler = (e) => {
                    if (this.isDestroyed)
                        return;
                    e.stopPropagation(); // Prevent bubbling to table handler
                    this.startCellSelection(e);
                };
                this.safeAddEventListener(cell, 'click', cellClickHandler);
                cell.setAttribute('data-has-listener', 'true');
            }
        });
    }
    startCellSelection(e) {
        const cell = e.target;
        if (!cell || !cell.closest('table'))
            return;
        // Set table as selected
        const table = cell.closest('table');
        this.selectedTable.set(table);
        // Clear previous selection from all tables
        const editor = this.editorElement().nativeElement;
        editor.querySelectorAll('.selected-cell').forEach(c => {
            c.classList.remove('selected-cell');
        });
        editor.querySelectorAll('table.selected-table').forEach(t => {
            t.classList.remove('selected-table');
            this.removeTableResizeHandles(t);
        });
        // Select the table and cell
        table.classList.add('selected-table');
        cell.classList.add('selected-cell');
        // Add resize handles to the selected table
        this.addTableResizeHandles(table);
        // Make sure cell is editable and position cursor properly
        if (!cell.hasAttribute('contenteditable')) {
            cell.setAttribute('contenteditable', 'true');
        }
        // Place cursor at the end of cell content
        this.safeTimeout(() => {
            const selection = window.getSelection();
            const range = document.createRange();
            // If cell has text content, place cursor at the end
            if (cell.childNodes.length > 0) {
                const lastNode = cell.childNodes[cell.childNodes.length - 1];
                if (lastNode.nodeType === Node.TEXT_NODE) {
                    range.setStart(lastNode, lastNode.textContent?.length || 0);
                }
                else {
                    range.setStartAfter(lastNode);
                }
            }
            else {
                // Empty cell, place cursor at start
                range.setStart(cell, 0);
            }
            range.collapse(true);
            selection?.removeAllRanges();
            selection?.addRange(range);
        }, 10);
    }
    // Table Resize Methods
    resizeTableSmaller() {
        const table = this.selectedTable();
        if (!table)
            return;
        const currentWidth = table.offsetWidth;
        const newWidth = Math.max(200, currentWidth - 50); // Minimum width of 200px
        table.style.width = `${newWidth}px`;
    }
    resizeTableLarger() {
        const table = this.selectedTable();
        if (!table)
            return;
        const currentWidth = table.offsetWidth;
        const maxWidth = this.editorElement().nativeElement.clientWidth - 40; // Leave some margin
        const newWidth = Math.min(maxWidth, currentWidth + 50);
        table.style.width = `${newWidth}px`;
    }
    resetTableSize() {
        const table = this.selectedTable();
        if (!table)
            return;
        // Reset to default width (100% of container)
        table.style.width = '100%';
        table.style.height = 'auto';
    }
    deleteTable() {
        const table = this.selectedTable();
        if (!table) {
            return;
        }
        // Remove resize handles first
        this.removeTableResizeHandles(table);
        // Clear the selected table signal
        this.selectedTable.set(null);
        // Remove the table from DOM
        table.remove();
    }
    applyDefaultCellStyles(cell) {
        cell.style.padding = '8px';
        cell.style.border = '1px solid #ddd';
        cell.style.textAlign = 'left';
        cell.style.verticalAlign = 'top';
        cell.setAttribute('contenteditable', 'true');
    }
    // Table Resize Functionality
    addTableResizeHandles(table) {
        // Remove existing handles first
        this.removeTableResizeHandles(table);
        // Create wrapper div for positioning handles
        const wrapper = document.createElement('div');
        wrapper.className = 'table-resize-wrapper';
        wrapper.style.cssText = `
      position: relative;
      display: inline-block;
      border: 2px solid #007bff;
      border-radius: 4px;
    `;
        // Wrap the table
        table.parentNode?.insertBefore(wrapper, table);
        wrapper.appendChild(table);
        // Create resize handles
        const handles = [
            {
                class: 'resize-handle-right',
                cursor: 'col-resize',
                position: 'right: -6px; top: 50%; transform: translateY(-50%); width: 12px; height: 30px;',
            },
            {
                class: 'resize-handle-bottom',
                cursor: 'row-resize',
                position: 'bottom: -6px; left: 50%; transform: translateX(-50%); width: 30px; height: 12px;',
            },
            {
                class: 'resize-handle-corner',
                cursor: 'nw-resize',
                position: 'bottom: -6px; right: -6px; width: 12px; height: 12px;',
            },
        ];
        handles.forEach(({ class: className, cursor, position }) => {
            const handle = document.createElement('div');
            handle.className = className;
            handle.style.cssText = `
        position: absolute;
        background: #007bff;
        border: 1px solid #fff;
        border-radius: 2px;
        cursor: ${cursor};
        z-index: 1000;
        ${position}
      `;
            // Add drag functionality
            this.addHandleDragEvents(handle, table, className);
            wrapper.appendChild(handle);
        });
        // Mark wrapper for cleanup
        wrapper.setAttribute('data-table-wrapper', 'true');
    }
    removeTableResizeHandles(table) {
        const wrapper = table.closest('.table-resize-wrapper');
        if (wrapper && wrapper.hasAttribute('data-table-wrapper')) {
            // Move table back to original position
            wrapper.parentNode?.insertBefore(table, wrapper);
            wrapper.remove();
        }
    }
    addHandleDragEvents(handle, table, handleType) {
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let startWidth = 0;
        let startHeight = 0;
        const onMouseDown = (e) => {
            if (this.isDestroyed)
                return;
            const mouseEvent = e;
            isDragging = true;
            startX = mouseEvent.clientX;
            startY = mouseEvent.clientY;
            const computedStyle = window.getComputedStyle(table);
            startWidth = parseInt(computedStyle.width, 10);
            startHeight = parseInt(computedStyle.height, 10);
            // Prevent text selection during drag
            mouseEvent.preventDefault();
            document.body.style.userSelect = 'none';
        };
        const onMouseMove = (e) => {
            if (!isDragging || this.isDestroyed)
                return;
            const mouseEvent = e;
            const deltaX = mouseEvent.clientX - startX;
            const deltaY = mouseEvent.clientY - startY;
            if (handleType === 'resize-handle-right') {
                const newWidth = Math.max(100, startWidth + deltaX);
                table.style.width = `${newWidth}px`;
            }
            else if (handleType === 'resize-handle-bottom') {
                const newHeight = Math.max(60, startHeight + deltaY);
                table.style.height = `${newHeight}px`;
            }
            else if (handleType === 'resize-handle-corner') {
                const newWidth = Math.max(100, startWidth + deltaX);
                const newHeight = Math.max(60, startHeight + deltaY);
                table.style.width = `${newWidth}px`;
                table.style.height = `${newHeight}px`;
            }
            // Emit table modification event
            this.updateTableData(table);
        };
        const onMouseUp = () => {
            if (!isDragging)
                return;
            isDragging = false;
            document.body.style.userSelect = '';
            console.log('Finished dragging table resize:', {
                width: table.style.width,
                height: table.style.height,
            });
        };
        // Add event listeners
        this.safeAddEventListener(handle, 'mousedown', onMouseDown);
        this.safeAddEventListener(document, 'mousemove', onMouseMove);
        this.safeAddEventListener(document, 'mouseup', onMouseUp);
    }
    // Initialize all tables in the editor with event listeners
    initializeAllTables() {
        if (this.isDestroyed)
            return;
        const editor = this.editorElement()?.nativeElement;
        if (!editor)
            return;
        // Clean up any orphaned resize handles first
        const orphanedWrappers = editor.querySelectorAll('.table-resize-wrapper:not(:has(table))');
        orphanedWrappers.forEach(wrapper => wrapper.remove());
        // Find all tables that don't have event listeners yet
        const tables = editor.querySelectorAll('table:not([data-table-initialized])');
        tables.forEach(table => {
            const htmlTable = table;
            // Mark as initialized to prevent duplicate processing
            htmlTable.setAttribute('data-table-initialized', 'true');
            // DON'T set contenteditable on cells - it conflicts with parent contenteditable
            // The cells will be editable through the parent editor
            // Add event listeners for table selection and resize
            this.addTableEventListeners(htmlTable);
        });
    }
    // Accessibility & HTML Editing Methods
    toggleHtmlEdit() {
        if (!this.isHtmlEditMode()) {
            // Store current HTML content when entering HTML edit mode
            this.htmlContent.set(this.editorElement().nativeElement.innerHTML);
        }
        this.isHtmlEditMode.set(!this.isHtmlEditMode());
    }
    getHtmlContent() {
        return this.htmlContent() || this.editorElement().nativeElement.innerHTML;
    }
    updateHtmlContent(event) {
        const target = event.target;
        this.htmlContent.set(target.value);
    }
    applyHtmlChanges() {
        const editor = this.editorElement().nativeElement;
        const newHtml = this.htmlContent();
        try {
            // Validate HTML by creating a temporary element
            const temp = document.createElement('div');
            temp.innerHTML = newHtml;
            // Apply the HTML content
            editor.innerHTML = newHtml;
            this.content.set(newHtml);
            this.valueChange.emit(newHtml);
            // Update editor state
            this.updateEditorState();
            // Close HTML edit mode
            this.isHtmlEditMode.set(false);
            console.log('HTML changes applied successfully');
        }
        catch (error) {
            console.error('Invalid HTML content:', error);
            alert('Invalid HTML content. Please check your syntax and try again.');
        }
    }
    showKeyboardShortcuts() {
        this.showShortcutsModal.set(true);
    }
    hideKeyboardShortcuts() {
        this.showShortcutsModal.set(false);
    }
    // Enhanced keyboard navigation with accessibility
    handleAccessibilityKeyDown(e) {
        // F1 - Show keyboard shortcuts
        if (e.key === 'F1') {
            e.preventDefault();
            this.showKeyboardShortcuts();
            return;
        }
        // Ctrl+Shift+H - Toggle HTML edit mode
        if (e.ctrlKey && e.shiftKey && e.key === 'H') {
            e.preventDefault();
            this.toggleHtmlEdit();
            return;
        }
        // Escape - Close modals or focus editor
        if (e.key === 'Escape') {
            e.preventDefault();
            if (this.showShortcutsModal()) {
                this.hideKeyboardShortcuts();
            }
            else if (this.isHtmlEditMode()) {
                this.toggleHtmlEdit();
            }
            else {
                // Focus the editor content
                this.editorElement().nativeElement.focus();
            }
            return;
        }
        // Tab navigation within editor
        if (e.key === 'Tab' && !e.ctrlKey && !e.altKey) {
            // Allow default tab behavior for accessibility
            return;
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: RmNgEditor, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: RmNgEditor, isStandalone: true, selector: "app-rm-ng-editor", inputs: { config: { classPropertyName: "config", publicName: "config", isSignal: true, isRequired: false, transformFunction: null }, value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { valueChange: "valueChange", focusEvent: "focusEvent", blurEvent: "blurEvent", stateChange: "stateChange", wordCountChange: "wordCountChange", spellCheckResults: "spellCheckResults", fullScreenChange: "fullScreenChange", themeChange: "themeChange", tableInsert: "tableInsert", tableModify: "tableModify" }, viewQueries: [{ propertyName: "editorElement", first: true, predicate: ["editor"], descendants: true, isSignal: true }, { propertyName: "toolbarElement", first: true, predicate: ["toolbar"], descendants: true, isSignal: true }], ngImport: i0, template: "<div\n  class=\"ng-rm-editor-wrapper\"\n  [class.disabled]=\"disabled()\"\n  [class.full-screen]=\"isFullScreen()\"\n  [class.distraction-free]=\"isDistractionFree()\"\n  [attr.data-theme]=\"currentTheme()\"\n>\n  @if (showToolbar()) {\n    <div\n      class=\"toolbar\"\n      #toolbar\n      role=\"toolbar\"\n      [attr.aria-label]=\"'Rich text editor toolbar'\"\n      [attr.aria-controls]=\"'editor'\"\n      id=\"editor-toolbar\"\n    >\n      <!-- Text Formatting Group -->\n      @if (toolbarConfig().showTextFormatting) {\n        <div class=\"toolbar-group toolbar-group--text-formatting\">\n          @if (toolbarConfig().showBold) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [class.active]=\"editorState().bold\"\n              (click)=\"execCommand('bold')\"\n              title=\"Bold (Ctrl+B)\"\n            >\n              {{ toolbarIcons().bold }}\n            </button>\n          }\n          @if (toolbarConfig().showItalic) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [class.active]=\"editorState().italic\"\n              (click)=\"execCommand('italic')\"\n              title=\"Italic (Ctrl+I)\"\n            >\n              <em>{{ toolbarIcons().italic }}</em>\n            </button>\n          }\n          @if (toolbarConfig().showUnderline) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [class.active]=\"editorState().underline\"\n              (click)=\"execCommand('underline')\"\n              title=\"Underline (Ctrl+U)\"\n            >\n              <u>{{ toolbarIcons().underline }}</u>\n            </button>\n          }\n          @if (toolbarConfig().showStrikethrough) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [class.active]=\"editorState().strikethrough\"\n              (click)=\"execCommand('strikeThrough')\"\n              title=\"Strikethrough (Ctrl+Shift+S)\"\n            >\n              <s>{{ toolbarIcons().strikethrough }}</s>\n            </button>\n          }\n        </div>\n      }\n\n      <!-- Script Formatting Group -->\n      @if (toolbarConfig().showScriptFormatting) {\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showSubscript) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [class.active]=\"editorState().subscript\"\n              (click)=\"execCommand('subscript')\"\n              title=\"Subscript (Ctrl+=)\"\n            >\n              {{ toolbarIcons().subscript }}\n            </button>\n          }\n          @if (toolbarConfig().showSuperscript) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [class.active]=\"editorState().superscript\"\n              (click)=\"execCommand('superscript')\"\n              title=\"Superscript (Ctrl+Shift+=)\"\n            >\n              {{ toolbarIcons().superscript }}\n            </button>\n          }\n        </div>\n      }\n\n      <!-- Font Controls Group -->\n      @if (toolbarConfig().showFontControls) {\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showFontFamily) {\n            <select\n              class=\"toolbar-select\"\n              [value]=\"editorState().fontFamily\"\n              (change)=\"setFontFamily($event)\"\n              title=\"Font Family\"\n            >\n              <option value=\"Arial\">Arial</option>\n              <option value=\"Helvetica\">Helvetica</option>\n              <option value=\"Georgia\">Georgia</option>\n              <option value=\"Times New Roman\">Times New Roman</option>\n              <option value=\"Courier New\">Courier New</option>\n              <option value=\"Verdana\">Verdana</option>\n            </select>\n          }\n\n          @if (toolbarConfig().showFontSize) {\n            <select\n              class=\"toolbar-select\"\n              [value]=\"editorState().fontSize\"\n              (change)=\"setFontSize($event)\"\n              title=\"Font Size\"\n            >\n              <option value=\"1\">8pt</option>\n              <option value=\"2\">10pt</option>\n              <option value=\"3\">12pt</option>\n              <option value=\"4\">14pt</option>\n              <option value=\"5\">18pt</option>\n              <option value=\"6\">24pt</option>\n              <option value=\"7\">36pt</option>\n            </select>\n          }\n        </div>\n      }\n\n      <!-- Color Controls Group -->\n      @if (toolbarConfig().showColorControls) {\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showTextColor) {\n            <input\n              type=\"color\"\n              class=\"color-picker\"\n              [value]=\"editorState().textColor\"\n              (change)=\"setTextColor($event)\"\n              title=\"Text Color\"\n            />\n          }\n        </div>\n      }\n\n      <!-- Headings Group -->\n      @if (toolbarConfig().showHeadings) {\n        <div class=\"toolbar-group\">\n          <select\n            class=\"toolbar-select\"\n            [value]=\"editorState().heading\"\n            (change)=\"setHeading($event)\"\n            title=\"Heading\"\n          >\n            <option value=\"\">Normal</option>\n            <option value=\"H1\">Heading 1</option>\n            <option value=\"H2\">Heading 2</option>\n            <option value=\"H3\">Heading 3</option>\n            <option value=\"H4\">Heading 4</option>\n            <option value=\"H5\">Heading 5</option>\n            <option value=\"H6\">Heading 6</option>\n          </select>\n        </div>\n      }\n\n      <!-- Block Formatting Group -->\n      @if (toolbarConfig().showBlockFormatting) {\n        <div class=\"toolbar-group\"></div>\n      }\n\n      <!-- Alignment Group -->\n      @if (toolbarConfig().showAlignment) {\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showAlignLeft) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [class.active]=\"editorState().alignment === 'left'\"\n              (click)=\"setAlignment('justifyLeft')\"\n              title=\"Align Left (Ctrl+Shift+L)\"\n            >\n              {{ toolbarIcons().alignLeft }}\n            </button>\n          }\n          @if (toolbarConfig().showAlignCenter) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [class.active]=\"editorState().alignment === 'center'\"\n              (click)=\"setAlignment('justifyCenter')\"\n              title=\"Align Center\"\n            >\n              {{ toolbarIcons().alignCenter }}\n            </button>\n          }\n          @if (toolbarConfig().showAlignRight) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [class.active]=\"editorState().alignment === 'right'\"\n              (click)=\"setAlignment('justifyRight')\"\n              title=\"Align Right\"\n            >\n              {{ toolbarIcons().alignRight }}\n            </button>\n          }\n          @if (toolbarConfig().showAlignJustify) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [class.active]=\"editorState().alignment === 'justify'\"\n              (click)=\"setAlignment('justifyFull')\"\n              title=\"Justify (Ctrl+Shift+J)\"\n            >\n              {{ toolbarIcons().alignJustify }}\n            </button>\n          }\n        </div>\n      }\n\n      <!-- Lists Group -->\n      @if (toolbarConfig().showLists) {\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showUnorderedList) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [class.active]=\"editorState().listType === 'unordered'\"\n              (click)=\"toggleList('insertUnorderedList')\"\n              title=\"Bullet List (Ctrl+Shift+8)\"\n            >\n              {{ toolbarIcons().unorderedList }}\n            </button>\n          }\n          @if (toolbarConfig().showOrderedList) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [class.active]=\"editorState().listType === 'ordered'\"\n              (click)=\"toggleList('insertOrderedList')\"\n              title=\"Numbered List (Ctrl+Shift+7)\"\n            >\n              {{ toolbarIcons().orderedList }}\n            </button>\n          }\n        </div>\n      }\n\n      <!-- Indent Group -->\n      @if (toolbarConfig().showIndent) {\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showOutdent) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"execCommand('outdent')\"\n              title=\"Decrease Indent\"\n            >\n              {{ toolbarIcons().outdent }}\n            </button>\n          }\n          @if (toolbarConfig().showIndentIncrease) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"execCommand('indent')\"\n              title=\"Increase Indent\"\n            >\n              {{ toolbarIcons().indent }}\n            </button>\n          }\n        </div>\n      }\n\n      <!-- Undo/Redo Group -->\n      @if (toolbarConfig().showUndoRedo) {\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showUndo) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"execCommand('undo')\"\n              title=\"Undo (Ctrl+Z)\"\n            >\n              {{ toolbarIcons().undo }}\n            </button>\n          }\n          @if (toolbarConfig().showRedo) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"execCommand('redo')\"\n              title=\"Redo (Ctrl+Shift+Z)\"\n            >\n              {{ toolbarIcons().redo }}\n            </button>\n          }\n        </div>\n      }\n\n      <!-- Link & Media Group -->\n      @if (toolbarConfig().showLinkMedia) {\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showInsertLink) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"insertLink()\"\n              title=\"Insert Link (Ctrl+K)\"\n            >\n              {{ toolbarIcons().insertLink }}\n            </button>\n          }\n          @if (toolbarConfig().showEditLink) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"editLink()\"\n              title=\"Edit Link\"\n            >\n              {{ toolbarIcons().editLink }}\n            </button>\n          }\n          @if (toolbarConfig().showRemoveLink) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"removeLink()\"\n              title=\"Remove Link\"\n            >\n              {{ toolbarIcons().removeLink }}\n            </button>\n          }\n        </div>\n      }\n\n      <!-- Media Embed Group -->\n      @if (toolbarConfig().showMediaEmbed) {\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showYouTubeEmbed) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"embedYouTube()\"\n              title=\"Embed YouTube Video\"\n            >\n              {{ toolbarIcons().youtubeEmbed }}\n            </button>\n          }\n          @if (toolbarConfig().showTwitterEmbed) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"embedTwitter()\"\n              title=\"Embed Twitter\"\n            >\n              {{ toolbarIcons().twitterEmbed }}\n            </button>\n          }\n          @if (toolbarConfig().showInstagramEmbed) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"embedInstagram()\"\n              title=\"Embed Instagram\"\n            >\n              {{ toolbarIcons().instagramEmbed }}\n            </button>\n          }\n          @if (toolbarConfig().showVimeoEmbed) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"embedVimeo()\"\n              title=\"Embed Vimeo Video\"\n            >\n              {{ toolbarIcons().vimeoEmbed }}\n            </button>\n          }\n          @if (toolbarConfig().showCustomEmbed) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"embedCustomMedia()\"\n              title=\"Custom Embed\"\n            >\n              {{ toolbarIcons().customEmbed }}\n            </button>\n          }\n        </div>\n      }\n\n      <!-- Validation & Stats Group -->\n      @if (toolbarConfig().showValidation) {\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showSpellCheck) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [class.active]=\"validationConfig().spellCheck?.enabled\"\n              (click)=\"toggleSpellCheck()\"\n              title=\"Toggle Spell Check\"\n            >\n              {{ toolbarIcons().spellCheck }}\n            </button>\n          }\n        </div>\n      }\n\n      <!-- View & Mode Group -->\n      @if (toolbarConfig().showViewMode) {\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showThemeToggle) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [class.active]=\"currentTheme() === 'dark'\"\n              (click)=\"toggleTheme()\"\n              [title]=\"\n                currentTheme() === 'dark'\n                  ? 'Switch to Light Theme'\n                  : 'Switch to Dark Theme'\n              \"\n            >\n              {{\n                currentTheme() === 'dark'\n                  ? toolbarIcons().lightTheme\n                  : toolbarIcons().darkTheme\n              }}\n            </button>\n          }\n          @if (toolbarConfig().showFullScreen) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [class.active]=\"isFullScreen()\"\n              (click)=\"toggleFullScreen()\"\n              [title]=\"\n                isFullScreen() ? 'Exit Full Screen' : 'Enter Full Screen'\n              \"\n            >\n              {{\n                isFullScreen()\n                  ? toolbarIcons().exitFullScreen\n                  : toolbarIcons().fullScreen\n              }}\n            </button>\n          }\n          @if (toolbarConfig().showDistractionFree) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [class.active]=\"isDistractionFree()\"\n              (click)=\"toggleDistractionFree()\"\n              title=\"Toggle Distraction Free Mode\"\n            >\n              {{ toolbarIcons().distractionFree }}\n            </button>\n          }\n        </div>\n      }\n\n      <!-- Table Group -->\n      @if (toolbarConfig().showTable) {\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showInsertTable) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"insertTable()\"\n              title=\"Insert Table (Ctrl+Shift+T)\"\n            >\n              {{ toolbarIcons().insertTable }}\n            </button>\n          }\n        </div>\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showInsertRow) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [disabled]=\"!selectedTable()\"\n              (click)=\"insertRowAbove()\"\n              title=\"Insert Row Above (select table first)\"\n            >\n              {{ toolbarIcons().insertRowAbove }}\n            </button>\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [disabled]=\"!selectedTable()\"\n              (click)=\"insertRowBelow()\"\n              title=\"Insert Row Below (select table first)\"\n            >\n              {{ toolbarIcons().insertRowBelow }}\n            </button>\n          }\n          @if (toolbarConfig().showInsertColumn) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [disabled]=\"!selectedTable()\"\n              (click)=\"insertColumnLeft()\"\n              title=\"Insert Column Left (select table first)\"\n            >\n              {{ toolbarIcons().insertColumnLeft }}\n            </button>\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [disabled]=\"!selectedTable()\"\n              (click)=\"insertColumnRight()\"\n              title=\"Insert Column Right (select table first)\"\n            >\n              {{ toolbarIcons().insertColumnRight }}\n            </button>\n          }\n        </div>\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showDeleteRow) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [disabled]=\"!selectedTable()\"\n              (click)=\"deleteRow()\"\n              title=\"Delete Row (select table first)\"\n            >\n              {{ toolbarIcons().deleteRow }}\n            </button>\n          }\n          @if (toolbarConfig().showDeleteColumn) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [disabled]=\"!selectedTable()\"\n              (click)=\"deleteColumn()\"\n              title=\"Delete Column (select table first)\"\n            >\n              {{ toolbarIcons().deleteColumn }}\n            </button>\n          }\n        </div>\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showTableResize) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [disabled]=\"!selectedTable()\"\n              (click)=\"resizeTableSmaller()\"\n              title=\"Make Table Smaller\"\n            >\n              {{ toolbarIcons().tableResizeSmaller }}\n            </button>\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [disabled]=\"!selectedTable()\"\n              (click)=\"resizeTableLarger()\"\n              title=\"Make Table Larger\"\n            >\n              {{ toolbarIcons().tableResizeLarger }}\n            </button>\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [disabled]=\"!selectedTable()\"\n              (click)=\"resetTableSize()\"\n              title=\"Reset Table Size\"\n            >\n              {{ toolbarIcons().tableReset }}\n            </button>\n          }\n        </div>\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showDeleteTable) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn danger-btn\"\n              [disabled]=\"!selectedTable()\"\n              (click)=\"deleteTable()\"\n              title=\"Delete Table\"\n            >\n              {{ toolbarIcons().deleteTable }}\n            </button>\n          }\n        </div>\n      }\n\n      <!-- Clear Formatting Group -->\n      @if (toolbarConfig().showClearFormatting) {\n        <div class=\"toolbar-group\">\n          <button\n            type=\"button\"\n            class=\"toolbar-btn\"\n            (click)=\"clearFormatting()\"\n            title=\"Clear Formatting (Ctrl+\\\\)\"\n          >\n            {{ toolbarIcons().clearFormatting }}\n          </button>\n        </div>\n      }\n\n      <!-- Page Break Group -->\n      @if (toolbarConfig().showPageBreak) {\n        <div class=\"toolbar-group\">\n          <button\n            type=\"button\"\n            class=\"toolbar-btn\"\n            (click)=\"insertPageBreak()\"\n            title=\"Insert Page Break (Ctrl+Enter)\"\n          >\n            {{ toolbarIcons().pageBreak }}\n          </button>\n        </div>\n      }\n\n      <!-- Section Divider Group -->\n      @if (toolbarConfig().showSectionDivider) {\n        <div class=\"toolbar-group\">\n          <button\n            type=\"button\"\n            class=\"toolbar-btn\"\n            (click)=\"insertSectionDivider()\"\n            title=\"Insert Section Divider\"\n          >\n            {{ toolbarIcons().sectionDivider }}\n          </button>\n        </div>\n      }\n\n      <!-- Media Insert Group -->\n      @if (\n        toolbarConfig().showInsertImage ||\n        toolbarConfig().showInsertVideo ||\n        toolbarConfig().showInsertAudio\n      ) {\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showInsertImage) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"insertImage()\"\n              title=\"Insert Image (via URL)\"\n            >\n              {{ toolbarIcons().insertImage }}\n            </button>\n          }\n          @if (toolbarConfig().showInsertVideo) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"insertVideo()\"\n              title=\"Insert Video (via URL)\"\n            >\n              {{ toolbarIcons().insertVideo }}\n            </button>\n          }\n          @if (toolbarConfig().showInsertAudio) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"insertAudio()\"\n              title=\"Insert Audio (via URL)\"\n            >\n              {{ toolbarIcons().insertAudio }}\n            </button>\n          }\n        </div>\n      }\n\n      <!-- Accessibility & HTML Editing Group -->\n      @if (toolbarConfig().showAccessibility) {\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showHtmlEdit) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"toggleHtmlEdit()\"\n              [class.active]=\"isHtmlEditMode()\"\n              title=\"Edit HTML Source (Ctrl+Shift+H)\"\n              [attr.aria-label]=\"'Edit HTML source code directly'\"\n            >\n              {{ toolbarIcons().htmlEdit }}\n            </button>\n          }\n          @if (toolbarConfig().showKeyboardShortcuts) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"showKeyboardShortcuts()\"\n              title=\"Show Keyboard Shortcuts (F1)\"\n              [attr.aria-label]=\"'Show available keyboard shortcuts'\"\n            >\n              {{ toolbarIcons().keyboardShortcuts }}\n            </button>\n          }\n        </div>\n      }\n    </div>\n  }\n\n  <div\n    #editor\n    class=\"editor-content\"\n    contenteditable=\"true\"\n    [attr.data-placeholder]=\"placeholder()\"\n    [style.height]=\"height()\"\n    [style.max-height]=\"maxHeight()\"\n    [attr.aria-label]=\"'Rich text editor content'\"\n    [attr.aria-multiline]=\"'true'\"\n    [attr.role]=\"'textbox'\"\n    [attr.tabindex]=\"disabled() ? -1 : 0\"\n    (input)=\"onContentChange()\"\n    (keydown)=\"onKeyDown($event)\"\n    (mouseup)=\"updateEditorState()\"\n    (keyup)=\"updateEditorState()\"\n    (focus)=\"onFocus()\"\n    (blur)=\"onBlur()\"\n  ></div>\n\n  <!-- Validation Stats Display -->\n  @if (shouldShowStats()) {\n    <div class=\"validation-stats\">\n      @if (validationConfig().showWordCount) {\n        <span class=\"stat-item\">\n          {{ toolbarIcons().wordCount }} Words: {{ wordCountStats().words }}\n          @if (validationConfig().maxWords) {\n            <span class=\"stat-limit\">/{{ validationConfig().maxWords }}</span>\n          }\n        </span>\n      }\n\n      @if (validationConfig().showCharacterCount) {\n        <span class=\"stat-item\">\n          {{ toolbarIcons().characterCount }} Characters:\n          {{ wordCountStats().characters }}\n          @if (validationConfig().maxCharacters) {\n            <span class=\"stat-limit\"\n              >/{{ validationConfig().maxCharacters }}</span\n            >\n          }\n        </span>\n      }\n\n      @if (validationConfig().showReadingTime) {\n        <span class=\"stat-item\">\n          {{ toolbarIcons().readingTime }} Reading Time:\n          {{ wordCountStats().readingTime }}min\n        </span>\n      }\n    </div>\n  }\n\n  <!-- Spell Check Suggestions -->\n  @if (\n    validationConfig().spellCheck?.enabled && spellCheckSuggestions().length > 0\n  ) {\n    <div class=\"spell-check-suggestions\">\n      <div class=\"suggestions-header\">\n        {{ toolbarIcons().spellCheckError }} Spelling Suggestions\n      </div>\n\n      @for (\n        suggestion of spellCheckSuggestions();\n        track suggestion.startOffset\n      ) {\n        <div class=\"suggestion-item\">\n          <span class=\"misspelled-word\">\"{{ suggestion.word }}\"</span>\n          <span class=\"suggestion-description\">{{\n            suggestion.description\n          }}</span>\n\n          <div class=\"suggestion-actions\">\n            @for (\n              suggestionWord of suggestion.suggestions;\n              track suggestionWord\n            ) {\n              <button\n                type=\"button\"\n                class=\"suggestion-btn\"\n                (click)=\"\n                  acceptSpellingSuggestion(suggestion.word, suggestionWord)\n                \"\n                title=\"Replace with '{{ suggestionWord }}'\"\n              >\n                {{ suggestionWord }}\n              </button>\n            }\n\n            <button\n              type=\"button\"\n              class=\"ignore-btn\"\n              (click)=\"ignoreSpellingSuggestion(suggestion.word)\"\n              title=\"Ignore this word\"\n            >\n              Ignore\n            </button>\n          </div>\n        </div>\n      }\n    </div>\n  }\n\n  <!-- Validation Errors -->\n  @if (!isContentValid()) {\n    <div class=\"validation-errors\">\n      @for (error of getValidationErrors(); track error) {\n        <div class=\"error-item\">\n          {{ toolbarIcons().spellCheckError }} {{ error }}\n        </div>\n      }\n    </div>\n  }\n\n  <!-- HTML Edit Modal -->\n  @if (isHtmlEditMode()) {\n    <div\n      class=\"html-edit-modal\"\n      role=\"dialog\"\n      aria-labelledby=\"html-edit-title\"\n      aria-modal=\"true\"\n    >\n      <div class=\"modal-content\">\n        <div class=\"modal-header\">\n          <h3 id=\"html-edit-title\">Edit HTML Source</h3>\n          <button\n            type=\"button\"\n            class=\"close-btn\"\n            (click)=\"toggleHtmlEdit()\"\n            aria-label=\"Close HTML editor\"\n          >\n            \u2715\n          </button>\n        </div>\n        <div class=\"modal-body\">\n          <textarea\n            #htmlTextarea\n            class=\"html-textarea\"\n            [value]=\"getHtmlContent()\"\n            (input)=\"updateHtmlContent($event)\"\n            aria-label=\"HTML source code\"\n            placeholder=\"Enter HTML code here...\"\n          ></textarea>\n        </div>\n        <div class=\"modal-footer\">\n          <button\n            type=\"button\"\n            class=\"btn btn-primary\"\n            (click)=\"applyHtmlChanges()\"\n            aria-label=\"Apply HTML changes to editor\"\n          >\n            Apply Changes\n          </button>\n          <button\n            type=\"button\"\n            class=\"btn btn-secondary\"\n            (click)=\"toggleHtmlEdit()\"\n            aria-label=\"Cancel HTML editing\"\n          >\n            Cancel\n          </button>\n        </div>\n      </div>\n    </div>\n  }\n\n  <!-- Keyboard Shortcuts Modal -->\n  @if (showShortcutsModal()) {\n    <div\n      class=\"shortcuts-modal\"\n      role=\"dialog\"\n      aria-labelledby=\"shortcuts-title\"\n      aria-modal=\"true\"\n    >\n      <div class=\"modal-content\">\n        <div class=\"modal-header\">\n          <h3 id=\"shortcuts-title\">Keyboard Shortcuts</h3>\n          <button\n            type=\"button\"\n            class=\"close-btn\"\n            (click)=\"hideKeyboardShortcuts()\"\n            aria-label=\"Close shortcuts dialog\"\n          >\n            \u2715\n          </button>\n        </div>\n        <div class=\"modal-body\">\n          <div class=\"shortcuts-grid\">\n            <div class=\"shortcuts-section\">\n              <h4>Text Formatting</h4>\n              <ul>\n                <li><kbd>Ctrl+B</kbd> Bold</li>\n                <li><kbd>Ctrl+I</kbd> Italic</li>\n                <li><kbd>Ctrl+U</kbd> Underline</li>\n                <li><kbd>Ctrl+Shift+S</kbd> Strikethrough</li>\n                <li><kbd>Ctrl+=</kbd> Subscript</li>\n                <li><kbd>Ctrl+Shift+=</kbd> Superscript</li>\n              </ul>\n            </div>\n            <div class=\"shortcuts-section\">\n              <h4>Alignment</h4>\n              <ul>\n                <li><kbd>Ctrl+Shift+L</kbd> Align Left</li>\n                <li><kbd>Ctrl+Shift+E</kbd> Align Center</li>\n                <li><kbd>Ctrl+Shift+R</kbd> Align Right</li>\n                <li><kbd>Ctrl+Shift+J</kbd> Justify</li>\n              </ul>\n            </div>\n            <div class=\"shortcuts-section\">\n              <h4>Lists & Structure</h4>\n              <ul>\n                <li><kbd>Ctrl+Shift+8</kbd> Bullet List</li>\n                <li><kbd>Ctrl+Shift+7</kbd> Numbered List</li>\n                <li><kbd>Ctrl+Enter</kbd> Page Break</li>\n                <li><kbd>Ctrl+Shift+T</kbd> Insert Table</li>\n              </ul>\n            </div>\n            <div class=\"shortcuts-section\">\n              <h4>Actions</h4>\n              <ul>\n                <li><kbd>Ctrl+K</kbd> Insert Link</li>\n                <li><kbd>Ctrl+Z</kbd> Undo</li>\n                <li><kbd>Ctrl+Y</kbd> Redo</li>\n                <li><kbd>Ctrl+\\</kbd> Clear Formatting</li>\n                <li><kbd>Ctrl+Shift+H</kbd> HTML Edit</li>\n              </ul>\n            </div>\n          </div>\n        </div>\n        <div class=\"modal-footer\">\n          <button\n            type=\"button\"\n            class=\"btn btn-primary\"\n            (click)=\"hideKeyboardShortcuts()\"\n            aria-label=\"Close shortcuts dialog\"\n          >\n            Close\n          </button>\n        </div>\n      </div>\n    </div>\n  }\n</div>\n", styles: ["@charset \"UTF-8\";.ng-rm-editor-wrapper{border:1px solid #e0e0e0;border-radius:8px;background:#fff;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif}.ng-rm-editor-wrapper.disabled{opacity:.6;pointer-events:none}.toolbar{display:flex;flex-wrap:wrap;gap:0;padding:0;background:#f8f9fa;border-bottom:1px solid #e0e0e0;align-items:stretch}.toolbar-group{display:flex;gap:0;align-items:stretch}.toolbar-group:not(:last-child):not(:empty):after{content:\"\";width:1px;height:20px;background:#e0e0e0;margin:0 1px}.toolbar-btn{display:flex;align-items:center;justify-content:center;width:24px;height:24px;border:none;background:transparent;border-radius:1px;cursor:pointer;font-size:11px;color:#333;transition:all .2s ease;padding:0;margin:0;flex-shrink:0;line-height:1}.toolbar-btn:hover{background:#e9ecef}.toolbar-btn.active{background:#007bff;color:#fff}.toolbar-btn:disabled{opacity:.5;cursor:not-allowed}.toolbar-btn.danger-btn{color:#dc3545}.toolbar-btn.danger-btn:hover:not(:disabled){background:#f8d7da;color:#721c24}.toolbar-btn.table-resize-larger-btn{background:#007bff;color:#fff}.toolbar-btn.table-resize-larger-btn:hover:not(:disabled){background:#0056b3;color:#fff}.toolbar-select{height:24px;padding:1px 4px;border:1px solid #e0e0e0;border-radius:1px;font-size:10px;background:#fff;cursor:pointer;min-width:45px;max-width:80px;margin:0;flex-shrink:0;line-height:1.2}.toolbar-select:focus{outline:2px solid #007bff;outline-offset:-2px}.toolbar-select:disabled{opacity:.5;cursor:not-allowed}.color-picker{width:24px;height:24px;border:none;border-radius:1px;cursor:pointer;padding:0;background:transparent;margin:0;flex-shrink:0}.color-picker::-webkit-color-swatch-wrapper{padding:0;border:none;border-radius:4px}.color-picker::-webkit-color-swatch{border:none;border-radius:4px;border:1px solid #e0e0e0}.color-picker:disabled{opacity:.5;cursor:not-allowed}.editor-content{min-height:200px;padding:16px;outline:none;line-height:1.6;font-size:14px;overflow-y:auto;word-wrap:break-word}.editor-content:empty:before{content:attr(data-placeholder);color:#aaa;pointer-events:none}.editor-content:focus{background-color:#fafafa}.editor-content h1{font-size:2em;margin:.67em 0;font-weight:700}.editor-content h2{font-size:1.5em;margin:.75em 0;font-weight:700}.editor-content h3{font-size:1.17em;margin:.83em 0;font-weight:700}.editor-content h4{font-size:1em;margin:1.12em 0;font-weight:700}.editor-content h5{font-size:.83em;margin:1.5em 0;font-weight:700}.editor-content h6{font-size:.75em;margin:1.67em 0;font-weight:700}.editor-content pre{background:#f8f9fa;border:1px solid #e0e0e0;border-radius:4px;padding:12px;margin:16px 0;overflow-x:auto;font-family:Courier New,monospace;font-size:13px;line-height:1.4}.editor-content ul,.editor-content ol{margin:16px 0;padding-left:24px}.editor-content ul{list-style-type:disc}.editor-content ol{list-style-type:decimal}.editor-content li{margin:4px 0}.editor-content p{margin:8px 0}.editor-content p:first-child{margin-top:0}.editor-content p:last-child{margin-bottom:0}.editor-content strong,.editor-content b{font-weight:700}.editor-content em,.editor-content i{font-style:italic}.editor-content u{text-decoration:underline}.editor-content s,.editor-content strike{text-decoration:line-through}.editor-content sub{vertical-align:sub;font-size:smaller}.editor-content sup{vertical-align:super;font-size:smaller}.editor-content::-webkit-scrollbar{width:8px}.editor-content::-webkit-scrollbar-track{background:#f1f1f1;border-radius:4px}.editor-content::-webkit-scrollbar-thumb{background:#c1c1c1;border-radius:4px}.editor-content::-webkit-scrollbar-thumb:hover{background:#a8a8a8}.toolbar-group select.toolbar-select{font-size:9px;padding:1px 3px;min-width:38px;height:22px}.toolbar-group select[title=\"Font Family\"]{min-width:35px;max-width:65px}.toolbar-group select[title=\"Font Size\"]{min-width:30px;max-width:60px}.toolbar-group select[title=Heading]{min-width:40px;max-width:70px}@media(max-width:768px){.toolbar{padding:0;gap:0}.toolbar-group:not(:last-child):not(:empty):after{margin:0 1px}.toolbar-btn{width:20px;height:20px;font-size:9px;margin:0}.toolbar-select{height:20px;font-size:9px;min-width:50px;padding:0 2px;margin:0}.color-picker{width:20px;height:20px;margin:0}.editor-content{padding:12px;font-size:13px}}.youtube-embed,.vimeo-embed,.custom-embed{margin:10px 0}.youtube-embed iframe,.vimeo-embed iframe,.custom-embed iframe{max-width:100%;border-radius:6px;box-shadow:0 2px 8px #0000001a}.twitter-embed,.instagram-embed{margin:10px 0;padding:12px;border:1px solid #e1e8ed;border-radius:8px;background:#f8f9fa;transition:all .2s ease}.twitter-embed:hover,.instagram-embed:hover{box-shadow:0 2px 8px #0000001a;transform:translateY(-1px)}.twitter-embed a,.instagram-embed a{color:#1da1f2;text-decoration:none;font-weight:500;display:flex;align-items:center;gap:8px}.twitter-embed a:hover,.instagram-embed a:hover{text-decoration:underline}.twitter-embed p,.instagram-embed p{margin:8px 0 0;font-size:12px;color:#657786}.instagram-embed{border-color:#dbdbdb}.instagram-embed a{color:#e4405f}.instagram-embed p{color:#8e8e8e}.link-preview{margin:10px 0;padding:12px;border:1px solid #e1e5e9;border-radius:6px;background:#f8f9fa;transition:all .2s ease}.link-preview:hover{box-shadow:0 2px 6px #0000001a;border-color:#007bff}.link-preview a{color:#007bff;text-decoration:none;font-weight:500;display:flex;align-items:center;gap:8px}.link-preview a:hover{text-decoration:underline}.link-preview p{margin:8px 0 0;font-size:12px;color:#6c757d}@media(max-width:768px){.youtube-embed iframe,.vimeo-embed iframe{width:100%!important;height:auto!important;aspect-ratio:16/9}.twitter-embed,.instagram-embed,.link-preview{margin:8px 0;padding:10px}}@media(prefers-contrast:high){.ng-rm-editor-wrapper{border-color:#000}.toolbar{background:#fff;border-bottom-color:#000}.toolbar-btn{border:1px solid transparent}.toolbar-btn:hover{border-color:#000;background:#f0f0f0}.toolbar-btn.active{background:#000;color:#fff}}.validation-stats{display:flex;flex-wrap:wrap;gap:16px;padding:8px 12px;background:#f8f9fa;border-top:1px solid #e0e0e0;font-size:12px;color:#666}.validation-stats .stat-item{display:flex;align-items:center;gap:4px;font-weight:500}.validation-stats .stat-item .stat-limit{color:#999}.spell-check-suggestions{background:#fff3cd;border-top:1px solid #ffeaa7;padding:12px;font-size:13px}.spell-check-suggestions .suggestions-header{font-weight:600;color:#856404;margin-bottom:8px;display:flex;align-items:center;gap:6px}.spell-check-suggestions .suggestion-item{margin-bottom:8px;padding:8px;background:#fff;border:1px solid #ffeaa7;border-radius:4px}.spell-check-suggestions .suggestion-item .misspelled-word{font-weight:600;color:#e74c3c}.spell-check-suggestions .suggestion-item .suggestion-description{color:#666;margin-left:8px;font-style:italic}.spell-check-suggestions .suggestion-item .suggestion-actions{margin-top:6px;display:flex;flex-wrap:wrap;gap:4px}.spell-check-suggestions .suggestion-item .suggestion-btn,.spell-check-suggestions .suggestion-item .ignore-btn{padding:4px 8px;border:1px solid #ddd;border-radius:3px;background:#fff;cursor:pointer;font-size:11px;transition:all .2s ease}.spell-check-suggestions .suggestion-item .suggestion-btn:hover,.spell-check-suggestions .suggestion-item .ignore-btn:hover{background:#f0f0f0;border-color:#bbb}.spell-check-suggestions .suggestion-item .suggestion-btn{color:#27ae60;border-color:#27ae60}.spell-check-suggestions .suggestion-item .suggestion-btn:hover{background:#27ae60;color:#fff}.spell-check-suggestions .suggestion-item .ignore-btn{color:#7f8c8d}.spell-check-suggestions .suggestion-item .ignore-btn:hover{background:#7f8c8d;color:#fff}.validation-errors{background:#f8d7da;border-top:1px solid #f5c6cb;padding:8px 12px}.validation-errors .error-item{color:#721c24;font-size:13px;display:flex;align-items:center;gap:6px;margin-bottom:4px}.validation-errors .error-item:last-child{margin-bottom:0}@media(max-width:768px){.validation-stats{flex-direction:column;gap:8px}.spell-check-suggestions .suggestion-actions{flex-direction:column}.spell-check-suggestions .suggestion-actions .suggestion-btn,.spell-check-suggestions .suggestion-actions .ignore-btn{width:100%;text-align:center}}.editor-content .spelling-error{background-color:#ffebee;border-bottom:2px wavy #e74c3c;padding:1px 2px;border-radius:2px;cursor:help}.editor-content .grammar-error{background-color:#e3f2fd;border-bottom:2px wavy #2196f3;padding:1px 2px;border-radius:2px;cursor:help}.ng-rm-editor-wrapper.full-screen{position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9999;border:none;border-radius:0}.ng-rm-editor-wrapper.full-screen .editor-content{min-height:calc(100vh - 60px);height:calc(100vh - 60px);max-height:none;padding:24px;font-size:16px;line-height:1.6}.ng-rm-editor-wrapper.full-screen.distraction-free .toolbar{display:none}.ng-rm-editor-wrapper.full-screen.distraction-free .editor-content{min-height:100vh;height:100vh;padding:48px}.ng-rm-editor-wrapper.full-screen.distraction-free .validation-stats{display:none}:global(body.editor-full-screen){overflow:hidden}.ng-rm-editor-wrapper[data-theme=dark],.ng-rm-editor-wrapper.theme-dark,.ng-rm-editor-wrapper.theme-auto-dark{background:#1e1e1e;border-color:#404040;color:#e0e0e0}.ng-rm-editor-wrapper[data-theme=dark] .toolbar,.ng-rm-editor-wrapper.theme-dark .toolbar,.ng-rm-editor-wrapper.theme-auto-dark .toolbar{background:#2d2d30;border-bottom-color:#404040}.ng-rm-editor-wrapper[data-theme=dark] .toolbar-btn,.ng-rm-editor-wrapper.theme-dark .toolbar-btn,.ng-rm-editor-wrapper.theme-auto-dark .toolbar-btn{color:#e0e0e0}.ng-rm-editor-wrapper[data-theme=dark] .toolbar-btn:hover,.ng-rm-editor-wrapper.theme-dark .toolbar-btn:hover,.ng-rm-editor-wrapper.theme-auto-dark .toolbar-btn:hover{background:#404040}.ng-rm-editor-wrapper[data-theme=dark] .toolbar-btn.active,.ng-rm-editor-wrapper.theme-dark .toolbar-btn.active,.ng-rm-editor-wrapper.theme-auto-dark .toolbar-btn.active{background:#0e639c;color:#fff}.ng-rm-editor-wrapper[data-theme=dark] .toolbar-group:not(:last-child):not(:empty):after,.ng-rm-editor-wrapper.theme-dark .toolbar-group:not(:last-child):not(:empty):after,.ng-rm-editor-wrapper.theme-auto-dark .toolbar-group:not(:last-child):not(:empty):after{background:#404040}.ng-rm-editor-wrapper[data-theme=dark] .editor-content,.ng-rm-editor-wrapper.theme-dark .editor-content,.ng-rm-editor-wrapper.theme-auto-dark .editor-content{background:#1e1e1e;color:#e0e0e0}.ng-rm-editor-wrapper[data-theme=dark] .editor-content:focus,.ng-rm-editor-wrapper.theme-dark .editor-content:focus,.ng-rm-editor-wrapper.theme-auto-dark .editor-content:focus{box-shadow:0 0 0 2px #0e639c}.ng-rm-editor-wrapper[data-theme=dark] .editor-content:empty:before,.ng-rm-editor-wrapper.theme-dark .editor-content:empty:before,.ng-rm-editor-wrapper.theme-auto-dark .editor-content:empty:before{color:#888}.ng-rm-editor-wrapper[data-theme=dark] .validation-stats,.ng-rm-editor-wrapper.theme-dark .validation-stats,.ng-rm-editor-wrapper.theme-auto-dark .validation-stats{background:#2d2d30;border-top-color:#404040;color:#e0e0e0}.ng-rm-editor-wrapper[data-theme=dark] .validation-stats.warning,.ng-rm-editor-wrapper.theme-dark .validation-stats.warning,.ng-rm-editor-wrapper.theme-auto-dark .validation-stats.warning{background:#3c3c00;color:#ffeb3b}.ng-rm-editor-wrapper[data-theme=dark] .validation-stats.error,.ng-rm-editor-wrapper.theme-dark .validation-stats.error,.ng-rm-editor-wrapper.theme-auto-dark .validation-stats.error{background:#3c1e1e;color:#f44336}.ng-rm-editor-wrapper[data-theme=dark] .spell-check-suggestions,.ng-rm-editor-wrapper.theme-dark .spell-check-suggestions,.ng-rm-editor-wrapper.theme-auto-dark .spell-check-suggestions{background:#2d2d30;border-color:#404040;color:#e0e0e0}.ng-rm-editor-wrapper[data-theme=dark] .suggestion-btn,.ng-rm-editor-wrapper.theme-dark .suggestion-btn,.ng-rm-editor-wrapper.theme-auto-dark .suggestion-btn{color:#e0e0e0}.ng-rm-editor-wrapper[data-theme=dark] .suggestion-btn:hover,.ng-rm-editor-wrapper.theme-dark .suggestion-btn:hover,.ng-rm-editor-wrapper.theme-auto-dark .suggestion-btn:hover{background:#404040}.ng-rm-editor-wrapper[data-theme=dark] .ignore-btn,.ng-rm-editor-wrapper.theme-dark .ignore-btn,.ng-rm-editor-wrapper.theme-auto-dark .ignore-btn{background:#404040;color:#e0e0e0}.ng-rm-editor-wrapper[data-theme=dark] .ignore-btn:hover,.ng-rm-editor-wrapper.theme-dark .ignore-btn:hover,.ng-rm-editor-wrapper.theme-auto-dark .ignore-btn:hover{background:#505050}.ng-rm-editor-wrapper[data-theme=dark] .spelling-error,.ng-rm-editor-wrapper.theme-dark .spelling-error,.ng-rm-editor-wrapper.theme-auto-dark .spelling-error{background-color:#f4433633;border-bottom-color:#f44336}.ng-rm-editor-wrapper[data-theme=dark] .grammar-error,.ng-rm-editor-wrapper.theme-dark .grammar-error,.ng-rm-editor-wrapper.theme-auto-dark .grammar-error{background-color:#2196f333;border-bottom-color:#2196f3}@media(prefers-color-scheme:dark){.ng-rm-editor-wrapper[data-theme=auto],.ng-rm-editor-wrapper.theme-auto{background:#1e1e1e;border-color:#404040;color:#e0e0e0}.ng-rm-editor-wrapper[data-theme=auto] .toolbar,.ng-rm-editor-wrapper.theme-auto .toolbar{background:#2d2d30;border-bottom-color:#404040}.ng-rm-editor-wrapper[data-theme=auto] .toolbar-btn,.ng-rm-editor-wrapper.theme-auto .toolbar-btn{color:#e0e0e0}.ng-rm-editor-wrapper[data-theme=auto] .toolbar-btn:hover,.ng-rm-editor-wrapper.theme-auto .toolbar-btn:hover{background:#404040}.ng-rm-editor-wrapper[data-theme=auto] .toolbar-btn.active,.ng-rm-editor-wrapper.theme-auto .toolbar-btn.active{background:#0e639c;color:#fff}.ng-rm-editor-wrapper[data-theme=auto] .editor-content,.ng-rm-editor-wrapper.theme-auto .editor-content{background:#1e1e1e;color:#e0e0e0}.ng-rm-editor-wrapper[data-theme=auto] .editor-content:focus,.ng-rm-editor-wrapper.theme-auto .editor-content:focus{box-shadow:0 0 0 2px #0e639c}.ng-rm-editor-wrapper[data-theme=auto] .validation-stats,.ng-rm-editor-wrapper.theme-auto .validation-stats{background:#2d2d30;border-top-color:#404040;color:#e0e0e0}}@media(prefers-contrast:high){.ng-rm-editor-wrapper{border:2px solid}.ng-rm-editor-wrapper .toolbar-btn{border:1px solid}.ng-rm-editor-wrapper .toolbar-btn:focus{outline:2px solid;outline-offset:2px}}@media(prefers-reduced-motion:reduce){.toolbar-btn,.suggestion-btn,.ignore-btn{transition:none}.ng-rm-editor-wrapper.full-screen{animation:none}}.ng-rm-editor-wrapper .editor-content table{border-collapse:collapse;margin:10px 0;min-width:200px}.ng-rm-editor-wrapper .editor-content table td,.ng-rm-editor-wrapper .editor-content table th{border:1px solid #ddd;padding:8px;min-width:50px;min-height:25px;position:relative}.ng-rm-editor-wrapper .editor-content table td:hover,.ng-rm-editor-wrapper .editor-content table th:hover{background-color:#007bff1a}.ng-rm-editor-wrapper .editor-content table td.selected-cell,.ng-rm-editor-wrapper .editor-content table th.selected-cell{background-color:#007bff33!important;outline:2px solid #007bff;outline-offset:-1px}.ng-rm-editor-wrapper .editor-content table td:empty:before,.ng-rm-editor-wrapper .editor-content table th:empty:before{content:\"\\a0\";color:transparent}.ng-rm-editor-wrapper .editor-content table th{background-color:#f8f9fa;font-weight:600;text-align:center}.ng-rm-editor-wrapper .editor-content table:hover{outline:2px dashed #007bff;outline-offset:2px}.ng-rm-editor-wrapper .editor-content table.selected-table{outline:2px solid #007bff;outline-offset:2px}.ng-rm-editor-wrapper .toolbar-group .toolbar-btn[title*=Table]:hover,.ng-rm-editor-wrapper .toolbar-group .toolbar-btn[title*=Row]:hover,.ng-rm-editor-wrapper .toolbar-group .toolbar-btn[title*=Column]:hover,.ng-rm-editor-wrapper .toolbar-group .toolbar-btn[title*=Cell]:hover,.ng-rm-editor-wrapper .toolbar-group .toolbar-btn[title*=Merge]:hover,.ng-rm-editor-wrapper .toolbar-group .toolbar-btn[title*=Split]:hover{background-color:#007bff1a}.ng-rm-editor-wrapper .toolbar-group .toolbar-btn[title*=Table]:disabled,.ng-rm-editor-wrapper .toolbar-group .toolbar-btn[title*=Row]:disabled,.ng-rm-editor-wrapper .toolbar-group .toolbar-btn[title*=Column]:disabled,.ng-rm-editor-wrapper .toolbar-group .toolbar-btn[title*=Cell]:disabled,.ng-rm-editor-wrapper .toolbar-group .toolbar-btn[title*=Merge]:disabled,.ng-rm-editor-wrapper .toolbar-group .toolbar-btn[title*=Split]:disabled{opacity:.5;cursor:not-allowed}.ng-rm-editor-wrapper[data-theme=dark] .editor-content table td,.ng-rm-editor-wrapper[data-theme=dark] .editor-content table th,.ng-rm-editor-wrapper.theme-dark .editor-content table td,.ng-rm-editor-wrapper.theme-dark .editor-content table th,.ng-rm-editor-wrapper.theme-auto-dark .editor-content table td,.ng-rm-editor-wrapper.theme-auto-dark .editor-content table th{border-color:#404040}.ng-rm-editor-wrapper[data-theme=dark] .editor-content table td:hover,.ng-rm-editor-wrapper[data-theme=dark] .editor-content table th:hover,.ng-rm-editor-wrapper.theme-dark .editor-content table td:hover,.ng-rm-editor-wrapper.theme-dark .editor-content table th:hover,.ng-rm-editor-wrapper.theme-auto-dark .editor-content table td:hover,.ng-rm-editor-wrapper.theme-auto-dark .editor-content table th:hover{background-color:#0e639c33}.ng-rm-editor-wrapper[data-theme=dark] .editor-content table td.selected-cell,.ng-rm-editor-wrapper[data-theme=dark] .editor-content table th.selected-cell,.ng-rm-editor-wrapper.theme-dark .editor-content table td.selected-cell,.ng-rm-editor-wrapper.theme-dark .editor-content table th.selected-cell,.ng-rm-editor-wrapper.theme-auto-dark .editor-content table td.selected-cell,.ng-rm-editor-wrapper.theme-auto-dark .editor-content table th.selected-cell{background-color:#0e639c4d!important;outline-color:#0e639c}.ng-rm-editor-wrapper[data-theme=dark] .editor-content table th,.ng-rm-editor-wrapper.theme-dark .editor-content table th,.ng-rm-editor-wrapper.theme-auto-dark .editor-content table th{background-color:#2d2d30;color:#e0e0e0}.ng-rm-editor-wrapper[data-theme=dark] .editor-content table:hover,.ng-rm-editor-wrapper.theme-dark .editor-content table:hover,.ng-rm-editor-wrapper.theme-auto-dark .editor-content table:hover,.ng-rm-editor-wrapper[data-theme=dark] .editor-content table.selected-table,.ng-rm-editor-wrapper.theme-dark .editor-content table.selected-table,.ng-rm-editor-wrapper.theme-auto-dark .editor-content table.selected-table{outline-color:#0e639c}@media(prefers-color-scheme:dark){.ng-rm-editor-wrapper[data-theme=auto] .editor-content table td,.ng-rm-editor-wrapper[data-theme=auto] .editor-content table th,.ng-rm-editor-wrapper.theme-auto .editor-content table td,.ng-rm-editor-wrapper.theme-auto .editor-content table th{border-color:#404040}.ng-rm-editor-wrapper[data-theme=auto] .editor-content table td:hover,.ng-rm-editor-wrapper[data-theme=auto] .editor-content table th:hover,.ng-rm-editor-wrapper.theme-auto .editor-content table td:hover,.ng-rm-editor-wrapper.theme-auto .editor-content table th:hover{background-color:#0e639c33}.ng-rm-editor-wrapper[data-theme=auto] .editor-content table td.selected-cell,.ng-rm-editor-wrapper[data-theme=auto] .editor-content table th.selected-cell,.ng-rm-editor-wrapper.theme-auto .editor-content table td.selected-cell,.ng-rm-editor-wrapper.theme-auto .editor-content table th.selected-cell{background-color:#0e639c4d!important;outline-color:#0e639c}.ng-rm-editor-wrapper[data-theme=auto] .editor-content table th,.ng-rm-editor-wrapper.theme-auto .editor-content table th{background-color:#2d2d30;color:#e0e0e0}}@media(max-width:768px){.ng-rm-editor-wrapper .editor-content table{font-size:14px}.ng-rm-editor-wrapper .editor-content table td,.ng-rm-editor-wrapper .editor-content table th{padding:6px;min-width:40px}}.ng-rm-editor-wrapper .editor-content .page-break{page-break-after:always;border-bottom:2px dashed #ccc;margin:20px 0;padding-bottom:20px;position:relative;min-height:20px}.ng-rm-editor-wrapper .editor-content .page-break:after{content:\"Page Break\";position:absolute;right:0;bottom:-15px;font-size:12px;color:#999;background:#fff;padding:0 10px;border-radius:12px;border:1px solid #e0e0e0}@media print{.ng-rm-editor-wrapper .editor-content .page-break{border:none;margin:0;padding:0}.ng-rm-editor-wrapper .editor-content .page-break:after{display:none}}[data-theme=dark] .ng-rm-editor-wrapper .editor-content .page-break{border-bottom-color:#555}[data-theme=dark] .ng-rm-editor-wrapper .editor-content .page-break:after{color:#aaa;background:#2d2d30;border-color:#555}.ng-rm-editor-wrapper .editor-content .section-divider{border-top:3px solid #e0e0e0;margin:30px 0;text-align:center;position:relative}.ng-rm-editor-wrapper .editor-content .section-divider span{position:absolute;top:-12px;left:50%;transform:translate(-50%);background:#fff;padding:0 20px;color:#999;font-size:14px;font-weight:400}[data-theme=dark] .ng-rm-editor-wrapper .editor-content .section-divider{border-top-color:#555}[data-theme=dark] .ng-rm-editor-wrapper .editor-content .section-divider span{background:#2d2d30;color:#aaa}.ng-rm-editor-wrapper .editor-content img,.ng-rm-editor-wrapper .editor-content video,.ng-rm-editor-wrapper .editor-content audio{max-width:100%;height:auto;margin:10px 0;border-radius:4px;box-shadow:0 2px 8px #0000001a}.ng-rm-editor-wrapper .editor-content img:hover,.ng-rm-editor-wrapper .editor-content video:hover,.ng-rm-editor-wrapper .editor-content audio:hover{box-shadow:0 4px 12px #00000026;transition:box-shadow .2s ease}.ng-rm-editor-wrapper .editor-content video,.ng-rm-editor-wrapper .editor-content audio{background:#f8f9fa}[data-theme=dark] .ng-rm-editor-wrapper .editor-content video,[data-theme=dark] .ng-rm-editor-wrapper .editor-content audio{background:#2d2d30}@media(max-width:768px){.ng-rm-editor-wrapper .editor-content img,.ng-rm-editor-wrapper .editor-content video{margin:15px 0}.ng-rm-editor-wrapper .editor-content audio{width:100%;margin:15px 0}}.html-edit-modal,.shortcuts-modal{position:fixed;top:0;left:0;width:100%;height:100%;background:#00000080;display:flex;align-items:center;justify-content:center;z-index:1000}.html-edit-modal .modal-content,.shortcuts-modal .modal-content{background:#fff;border-radius:8px;width:90%;max-width:600px;max-height:90%;overflow:hidden;box-shadow:0 10px 30px #0000004d}[data-theme=dark] .html-edit-modal .modal-content,[data-theme=dark] .shortcuts-modal .modal-content{background:#2d2d30;color:#e0e0e0}.html-edit-modal .modal-header,.shortcuts-modal .modal-header{display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid #e0e0e0}.html-edit-modal .modal-header h3,.shortcuts-modal .modal-header h3{margin:0;font-size:18px;font-weight:600}.html-edit-modal .modal-header .close-btn,.shortcuts-modal .modal-header .close-btn{background:none;border:none;font-size:20px;cursor:pointer;color:#666;padding:4px;border-radius:4px;transition:background-color .2s}.html-edit-modal .modal-header .close-btn:hover,.shortcuts-modal .modal-header .close-btn:hover{background:#f0f0f0;color:#333}[data-theme=dark] .html-edit-modal .modal-header,[data-theme=dark] .shortcuts-modal .modal-header{border-bottom-color:#555}[data-theme=dark] .html-edit-modal .modal-header .close-btn,[data-theme=dark] .shortcuts-modal .modal-header .close-btn{color:#aaa}[data-theme=dark] .html-edit-modal .modal-header .close-btn:hover,[data-theme=dark] .shortcuts-modal .modal-header .close-btn:hover{background:#404040;color:#e0e0e0}.html-edit-modal .modal-body,.shortcuts-modal .modal-body{padding:20px;overflow-y:auto;max-height:400px}.html-edit-modal .modal-footer,.shortcuts-modal .modal-footer{display:flex;justify-content:flex-end;gap:12px;padding:16px 20px;border-top:1px solid #e0e0e0}.html-edit-modal .modal-footer .btn,.shortcuts-modal .modal-footer .btn{padding:8px 16px;border:none;border-radius:4px;cursor:pointer;font-size:14px;font-weight:500;transition:all .2s}.html-edit-modal .modal-footer .btn.btn-primary,.shortcuts-modal .modal-footer .btn.btn-primary{background:#007bff;color:#fff}.html-edit-modal .modal-footer .btn.btn-primary:hover,.shortcuts-modal .modal-footer .btn.btn-primary:hover{background:#0056b3}.html-edit-modal .modal-footer .btn.btn-secondary,.shortcuts-modal .modal-footer .btn.btn-secondary{background:#6c757d;color:#fff}.html-edit-modal .modal-footer .btn.btn-secondary:hover,.shortcuts-modal .modal-footer .btn.btn-secondary:hover{background:#545b62}[data-theme=dark] .html-edit-modal .modal-footer,[data-theme=dark] .shortcuts-modal .modal-footer{border-top-color:#555}.html-textarea{width:100%;height:300px;padding:12px;border:1px solid #e0e0e0;border-radius:4px;font-family:Monaco,Menlo,Ubuntu Mono,monospace;font-size:13px;line-height:1.5;resize:vertical;background:#fafafa}.html-textarea:focus{outline:none;border-color:#007bff;box-shadow:0 0 0 2px #007bff40}[data-theme=dark] .html-textarea{background:#1e1e1e;border-color:#555;color:#e0e0e0}[data-theme=dark] .html-textarea:focus{border-color:#007bff}.shortcuts-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px}.shortcuts-grid .shortcuts-section h4{margin:0 0 12px;font-size:16px;font-weight:600;color:#333;border-bottom:2px solid #007bff;padding-bottom:4px}.shortcuts-grid .shortcuts-section ul{list-style:none;padding:0;margin:0}.shortcuts-grid .shortcuts-section ul li{display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #f0f0f0}.shortcuts-grid .shortcuts-section ul li:last-child{border-bottom:none}.shortcuts-grid .shortcuts-section ul li kbd{background:#e9ecef;border:1px solid #ced4da;border-radius:3px;padding:3px 6px;font-size:11px;font-family:monospace;color:#495057;white-space:nowrap}[data-theme=dark] .shortcuts-grid .shortcuts-section h4{color:#e0e0e0;border-bottom-color:#007bff}[data-theme=dark] .shortcuts-grid .shortcuts-section ul li{border-bottom-color:#404040}[data-theme=dark] .shortcuts-grid .shortcuts-section ul li kbd{background:#404040;border-color:#555;color:#e0e0e0}@media(max-width:768px){.html-edit-modal .modal-content,.shortcuts-modal .modal-content{width:95%;margin:20px}.html-edit-modal .modal-body,.shortcuts-modal .modal-body{padding:16px;max-height:60vh}.html-edit-modal .shortcuts-grid,.shortcuts-modal .shortcuts-grid{grid-template-columns:1fr;gap:16px}.html-edit-modal .html-textarea,.shortcuts-modal .html-textarea{height:250px}}.toolbar-btn:focus-visible,.btn:focus-visible{outline:2px solid #007bff;outline-offset:2px}.table-resize-wrapper{position:relative;display:inline-block;border:2px solid #007bff;border-radius:4px}.table-resize-wrapper .resize-handle-right,.table-resize-wrapper .resize-handle-bottom,.table-resize-wrapper .resize-handle-corner{position:absolute;background:#007bff;border:1px solid #fff;border-radius:2px;z-index:1000;transition:all .2s ease}.table-resize-wrapper .resize-handle-right:hover,.table-resize-wrapper .resize-handle-bottom:hover,.table-resize-wrapper .resize-handle-corner:hover{background:#0056b3;transform:scale(1.1)}.table-resize-wrapper .resize-handle-right{cursor:col-resize;right:-6px;top:50%;transform:translateY(-50%);width:12px;height:30px}.table-resize-wrapper .resize-handle-right:hover{transform:translateY(-50%) scale(1.1)}.table-resize-wrapper .resize-handle-bottom{cursor:row-resize;bottom:-6px;left:50%;transform:translate(-50%);width:30px;height:12px}.table-resize-wrapper .resize-handle-bottom:hover{transform:translate(-50%) scale(1.1)}.table-resize-wrapper .resize-handle-corner{cursor:nw-resize;bottom:-6px;right:-6px;width:12px;height:12px}.table-resize-wrapper .resize-handle-corner:hover{transform:scale(1.2)}table.resizing{transition:none;-webkit-user-select:none;user-select:none}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: RmNgEditor, decorators: [{
            type: Component,
            args: [{ selector: 'app-rm-ng-editor', standalone: true, imports: [], changeDetection: ChangeDetectionStrategy.OnPush, template: "<div\n  class=\"ng-rm-editor-wrapper\"\n  [class.disabled]=\"disabled()\"\n  [class.full-screen]=\"isFullScreen()\"\n  [class.distraction-free]=\"isDistractionFree()\"\n  [attr.data-theme]=\"currentTheme()\"\n>\n  @if (showToolbar()) {\n    <div\n      class=\"toolbar\"\n      #toolbar\n      role=\"toolbar\"\n      [attr.aria-label]=\"'Rich text editor toolbar'\"\n      [attr.aria-controls]=\"'editor'\"\n      id=\"editor-toolbar\"\n    >\n      <!-- Text Formatting Group -->\n      @if (toolbarConfig().showTextFormatting) {\n        <div class=\"toolbar-group toolbar-group--text-formatting\">\n          @if (toolbarConfig().showBold) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [class.active]=\"editorState().bold\"\n              (click)=\"execCommand('bold')\"\n              title=\"Bold (Ctrl+B)\"\n            >\n              {{ toolbarIcons().bold }}\n            </button>\n          }\n          @if (toolbarConfig().showItalic) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [class.active]=\"editorState().italic\"\n              (click)=\"execCommand('italic')\"\n              title=\"Italic (Ctrl+I)\"\n            >\n              <em>{{ toolbarIcons().italic }}</em>\n            </button>\n          }\n          @if (toolbarConfig().showUnderline) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [class.active]=\"editorState().underline\"\n              (click)=\"execCommand('underline')\"\n              title=\"Underline (Ctrl+U)\"\n            >\n              <u>{{ toolbarIcons().underline }}</u>\n            </button>\n          }\n          @if (toolbarConfig().showStrikethrough) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [class.active]=\"editorState().strikethrough\"\n              (click)=\"execCommand('strikeThrough')\"\n              title=\"Strikethrough (Ctrl+Shift+S)\"\n            >\n              <s>{{ toolbarIcons().strikethrough }}</s>\n            </button>\n          }\n        </div>\n      }\n\n      <!-- Script Formatting Group -->\n      @if (toolbarConfig().showScriptFormatting) {\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showSubscript) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [class.active]=\"editorState().subscript\"\n              (click)=\"execCommand('subscript')\"\n              title=\"Subscript (Ctrl+=)\"\n            >\n              {{ toolbarIcons().subscript }}\n            </button>\n          }\n          @if (toolbarConfig().showSuperscript) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [class.active]=\"editorState().superscript\"\n              (click)=\"execCommand('superscript')\"\n              title=\"Superscript (Ctrl+Shift+=)\"\n            >\n              {{ toolbarIcons().superscript }}\n            </button>\n          }\n        </div>\n      }\n\n      <!-- Font Controls Group -->\n      @if (toolbarConfig().showFontControls) {\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showFontFamily) {\n            <select\n              class=\"toolbar-select\"\n              [value]=\"editorState().fontFamily\"\n              (change)=\"setFontFamily($event)\"\n              title=\"Font Family\"\n            >\n              <option value=\"Arial\">Arial</option>\n              <option value=\"Helvetica\">Helvetica</option>\n              <option value=\"Georgia\">Georgia</option>\n              <option value=\"Times New Roman\">Times New Roman</option>\n              <option value=\"Courier New\">Courier New</option>\n              <option value=\"Verdana\">Verdana</option>\n            </select>\n          }\n\n          @if (toolbarConfig().showFontSize) {\n            <select\n              class=\"toolbar-select\"\n              [value]=\"editorState().fontSize\"\n              (change)=\"setFontSize($event)\"\n              title=\"Font Size\"\n            >\n              <option value=\"1\">8pt</option>\n              <option value=\"2\">10pt</option>\n              <option value=\"3\">12pt</option>\n              <option value=\"4\">14pt</option>\n              <option value=\"5\">18pt</option>\n              <option value=\"6\">24pt</option>\n              <option value=\"7\">36pt</option>\n            </select>\n          }\n        </div>\n      }\n\n      <!-- Color Controls Group -->\n      @if (toolbarConfig().showColorControls) {\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showTextColor) {\n            <input\n              type=\"color\"\n              class=\"color-picker\"\n              [value]=\"editorState().textColor\"\n              (change)=\"setTextColor($event)\"\n              title=\"Text Color\"\n            />\n          }\n        </div>\n      }\n\n      <!-- Headings Group -->\n      @if (toolbarConfig().showHeadings) {\n        <div class=\"toolbar-group\">\n          <select\n            class=\"toolbar-select\"\n            [value]=\"editorState().heading\"\n            (change)=\"setHeading($event)\"\n            title=\"Heading\"\n          >\n            <option value=\"\">Normal</option>\n            <option value=\"H1\">Heading 1</option>\n            <option value=\"H2\">Heading 2</option>\n            <option value=\"H3\">Heading 3</option>\n            <option value=\"H4\">Heading 4</option>\n            <option value=\"H5\">Heading 5</option>\n            <option value=\"H6\">Heading 6</option>\n          </select>\n        </div>\n      }\n\n      <!-- Block Formatting Group -->\n      @if (toolbarConfig().showBlockFormatting) {\n        <div class=\"toolbar-group\"></div>\n      }\n\n      <!-- Alignment Group -->\n      @if (toolbarConfig().showAlignment) {\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showAlignLeft) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [class.active]=\"editorState().alignment === 'left'\"\n              (click)=\"setAlignment('justifyLeft')\"\n              title=\"Align Left (Ctrl+Shift+L)\"\n            >\n              {{ toolbarIcons().alignLeft }}\n            </button>\n          }\n          @if (toolbarConfig().showAlignCenter) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [class.active]=\"editorState().alignment === 'center'\"\n              (click)=\"setAlignment('justifyCenter')\"\n              title=\"Align Center\"\n            >\n              {{ toolbarIcons().alignCenter }}\n            </button>\n          }\n          @if (toolbarConfig().showAlignRight) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [class.active]=\"editorState().alignment === 'right'\"\n              (click)=\"setAlignment('justifyRight')\"\n              title=\"Align Right\"\n            >\n              {{ toolbarIcons().alignRight }}\n            </button>\n          }\n          @if (toolbarConfig().showAlignJustify) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [class.active]=\"editorState().alignment === 'justify'\"\n              (click)=\"setAlignment('justifyFull')\"\n              title=\"Justify (Ctrl+Shift+J)\"\n            >\n              {{ toolbarIcons().alignJustify }}\n            </button>\n          }\n        </div>\n      }\n\n      <!-- Lists Group -->\n      @if (toolbarConfig().showLists) {\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showUnorderedList) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [class.active]=\"editorState().listType === 'unordered'\"\n              (click)=\"toggleList('insertUnorderedList')\"\n              title=\"Bullet List (Ctrl+Shift+8)\"\n            >\n              {{ toolbarIcons().unorderedList }}\n            </button>\n          }\n          @if (toolbarConfig().showOrderedList) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [class.active]=\"editorState().listType === 'ordered'\"\n              (click)=\"toggleList('insertOrderedList')\"\n              title=\"Numbered List (Ctrl+Shift+7)\"\n            >\n              {{ toolbarIcons().orderedList }}\n            </button>\n          }\n        </div>\n      }\n\n      <!-- Indent Group -->\n      @if (toolbarConfig().showIndent) {\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showOutdent) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"execCommand('outdent')\"\n              title=\"Decrease Indent\"\n            >\n              {{ toolbarIcons().outdent }}\n            </button>\n          }\n          @if (toolbarConfig().showIndentIncrease) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"execCommand('indent')\"\n              title=\"Increase Indent\"\n            >\n              {{ toolbarIcons().indent }}\n            </button>\n          }\n        </div>\n      }\n\n      <!-- Undo/Redo Group -->\n      @if (toolbarConfig().showUndoRedo) {\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showUndo) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"execCommand('undo')\"\n              title=\"Undo (Ctrl+Z)\"\n            >\n              {{ toolbarIcons().undo }}\n            </button>\n          }\n          @if (toolbarConfig().showRedo) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"execCommand('redo')\"\n              title=\"Redo (Ctrl+Shift+Z)\"\n            >\n              {{ toolbarIcons().redo }}\n            </button>\n          }\n        </div>\n      }\n\n      <!-- Link & Media Group -->\n      @if (toolbarConfig().showLinkMedia) {\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showInsertLink) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"insertLink()\"\n              title=\"Insert Link (Ctrl+K)\"\n            >\n              {{ toolbarIcons().insertLink }}\n            </button>\n          }\n          @if (toolbarConfig().showEditLink) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"editLink()\"\n              title=\"Edit Link\"\n            >\n              {{ toolbarIcons().editLink }}\n            </button>\n          }\n          @if (toolbarConfig().showRemoveLink) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"removeLink()\"\n              title=\"Remove Link\"\n            >\n              {{ toolbarIcons().removeLink }}\n            </button>\n          }\n        </div>\n      }\n\n      <!-- Media Embed Group -->\n      @if (toolbarConfig().showMediaEmbed) {\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showYouTubeEmbed) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"embedYouTube()\"\n              title=\"Embed YouTube Video\"\n            >\n              {{ toolbarIcons().youtubeEmbed }}\n            </button>\n          }\n          @if (toolbarConfig().showTwitterEmbed) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"embedTwitter()\"\n              title=\"Embed Twitter\"\n            >\n              {{ toolbarIcons().twitterEmbed }}\n            </button>\n          }\n          @if (toolbarConfig().showInstagramEmbed) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"embedInstagram()\"\n              title=\"Embed Instagram\"\n            >\n              {{ toolbarIcons().instagramEmbed }}\n            </button>\n          }\n          @if (toolbarConfig().showVimeoEmbed) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"embedVimeo()\"\n              title=\"Embed Vimeo Video\"\n            >\n              {{ toolbarIcons().vimeoEmbed }}\n            </button>\n          }\n          @if (toolbarConfig().showCustomEmbed) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"embedCustomMedia()\"\n              title=\"Custom Embed\"\n            >\n              {{ toolbarIcons().customEmbed }}\n            </button>\n          }\n        </div>\n      }\n\n      <!-- Validation & Stats Group -->\n      @if (toolbarConfig().showValidation) {\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showSpellCheck) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [class.active]=\"validationConfig().spellCheck?.enabled\"\n              (click)=\"toggleSpellCheck()\"\n              title=\"Toggle Spell Check\"\n            >\n              {{ toolbarIcons().spellCheck }}\n            </button>\n          }\n        </div>\n      }\n\n      <!-- View & Mode Group -->\n      @if (toolbarConfig().showViewMode) {\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showThemeToggle) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [class.active]=\"currentTheme() === 'dark'\"\n              (click)=\"toggleTheme()\"\n              [title]=\"\n                currentTheme() === 'dark'\n                  ? 'Switch to Light Theme'\n                  : 'Switch to Dark Theme'\n              \"\n            >\n              {{\n                currentTheme() === 'dark'\n                  ? toolbarIcons().lightTheme\n                  : toolbarIcons().darkTheme\n              }}\n            </button>\n          }\n          @if (toolbarConfig().showFullScreen) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [class.active]=\"isFullScreen()\"\n              (click)=\"toggleFullScreen()\"\n              [title]=\"\n                isFullScreen() ? 'Exit Full Screen' : 'Enter Full Screen'\n              \"\n            >\n              {{\n                isFullScreen()\n                  ? toolbarIcons().exitFullScreen\n                  : toolbarIcons().fullScreen\n              }}\n            </button>\n          }\n          @if (toolbarConfig().showDistractionFree) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [class.active]=\"isDistractionFree()\"\n              (click)=\"toggleDistractionFree()\"\n              title=\"Toggle Distraction Free Mode\"\n            >\n              {{ toolbarIcons().distractionFree }}\n            </button>\n          }\n        </div>\n      }\n\n      <!-- Table Group -->\n      @if (toolbarConfig().showTable) {\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showInsertTable) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"insertTable()\"\n              title=\"Insert Table (Ctrl+Shift+T)\"\n            >\n              {{ toolbarIcons().insertTable }}\n            </button>\n          }\n        </div>\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showInsertRow) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [disabled]=\"!selectedTable()\"\n              (click)=\"insertRowAbove()\"\n              title=\"Insert Row Above (select table first)\"\n            >\n              {{ toolbarIcons().insertRowAbove }}\n            </button>\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [disabled]=\"!selectedTable()\"\n              (click)=\"insertRowBelow()\"\n              title=\"Insert Row Below (select table first)\"\n            >\n              {{ toolbarIcons().insertRowBelow }}\n            </button>\n          }\n          @if (toolbarConfig().showInsertColumn) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [disabled]=\"!selectedTable()\"\n              (click)=\"insertColumnLeft()\"\n              title=\"Insert Column Left (select table first)\"\n            >\n              {{ toolbarIcons().insertColumnLeft }}\n            </button>\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [disabled]=\"!selectedTable()\"\n              (click)=\"insertColumnRight()\"\n              title=\"Insert Column Right (select table first)\"\n            >\n              {{ toolbarIcons().insertColumnRight }}\n            </button>\n          }\n        </div>\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showDeleteRow) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [disabled]=\"!selectedTable()\"\n              (click)=\"deleteRow()\"\n              title=\"Delete Row (select table first)\"\n            >\n              {{ toolbarIcons().deleteRow }}\n            </button>\n          }\n          @if (toolbarConfig().showDeleteColumn) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [disabled]=\"!selectedTable()\"\n              (click)=\"deleteColumn()\"\n              title=\"Delete Column (select table first)\"\n            >\n              {{ toolbarIcons().deleteColumn }}\n            </button>\n          }\n        </div>\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showTableResize) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [disabled]=\"!selectedTable()\"\n              (click)=\"resizeTableSmaller()\"\n              title=\"Make Table Smaller\"\n            >\n              {{ toolbarIcons().tableResizeSmaller }}\n            </button>\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [disabled]=\"!selectedTable()\"\n              (click)=\"resizeTableLarger()\"\n              title=\"Make Table Larger\"\n            >\n              {{ toolbarIcons().tableResizeLarger }}\n            </button>\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              [disabled]=\"!selectedTable()\"\n              (click)=\"resetTableSize()\"\n              title=\"Reset Table Size\"\n            >\n              {{ toolbarIcons().tableReset }}\n            </button>\n          }\n        </div>\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showDeleteTable) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn danger-btn\"\n              [disabled]=\"!selectedTable()\"\n              (click)=\"deleteTable()\"\n              title=\"Delete Table\"\n            >\n              {{ toolbarIcons().deleteTable }}\n            </button>\n          }\n        </div>\n      }\n\n      <!-- Clear Formatting Group -->\n      @if (toolbarConfig().showClearFormatting) {\n        <div class=\"toolbar-group\">\n          <button\n            type=\"button\"\n            class=\"toolbar-btn\"\n            (click)=\"clearFormatting()\"\n            title=\"Clear Formatting (Ctrl+\\\\)\"\n          >\n            {{ toolbarIcons().clearFormatting }}\n          </button>\n        </div>\n      }\n\n      <!-- Page Break Group -->\n      @if (toolbarConfig().showPageBreak) {\n        <div class=\"toolbar-group\">\n          <button\n            type=\"button\"\n            class=\"toolbar-btn\"\n            (click)=\"insertPageBreak()\"\n            title=\"Insert Page Break (Ctrl+Enter)\"\n          >\n            {{ toolbarIcons().pageBreak }}\n          </button>\n        </div>\n      }\n\n      <!-- Section Divider Group -->\n      @if (toolbarConfig().showSectionDivider) {\n        <div class=\"toolbar-group\">\n          <button\n            type=\"button\"\n            class=\"toolbar-btn\"\n            (click)=\"insertSectionDivider()\"\n            title=\"Insert Section Divider\"\n          >\n            {{ toolbarIcons().sectionDivider }}\n          </button>\n        </div>\n      }\n\n      <!-- Media Insert Group -->\n      @if (\n        toolbarConfig().showInsertImage ||\n        toolbarConfig().showInsertVideo ||\n        toolbarConfig().showInsertAudio\n      ) {\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showInsertImage) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"insertImage()\"\n              title=\"Insert Image (via URL)\"\n            >\n              {{ toolbarIcons().insertImage }}\n            </button>\n          }\n          @if (toolbarConfig().showInsertVideo) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"insertVideo()\"\n              title=\"Insert Video (via URL)\"\n            >\n              {{ toolbarIcons().insertVideo }}\n            </button>\n          }\n          @if (toolbarConfig().showInsertAudio) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"insertAudio()\"\n              title=\"Insert Audio (via URL)\"\n            >\n              {{ toolbarIcons().insertAudio }}\n            </button>\n          }\n        </div>\n      }\n\n      <!-- Accessibility & HTML Editing Group -->\n      @if (toolbarConfig().showAccessibility) {\n        <div class=\"toolbar-group\">\n          @if (toolbarConfig().showHtmlEdit) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"toggleHtmlEdit()\"\n              [class.active]=\"isHtmlEditMode()\"\n              title=\"Edit HTML Source (Ctrl+Shift+H)\"\n              [attr.aria-label]=\"'Edit HTML source code directly'\"\n            >\n              {{ toolbarIcons().htmlEdit }}\n            </button>\n          }\n          @if (toolbarConfig().showKeyboardShortcuts) {\n            <button\n              type=\"button\"\n              class=\"toolbar-btn\"\n              (click)=\"showKeyboardShortcuts()\"\n              title=\"Show Keyboard Shortcuts (F1)\"\n              [attr.aria-label]=\"'Show available keyboard shortcuts'\"\n            >\n              {{ toolbarIcons().keyboardShortcuts }}\n            </button>\n          }\n        </div>\n      }\n    </div>\n  }\n\n  <div\n    #editor\n    class=\"editor-content\"\n    contenteditable=\"true\"\n    [attr.data-placeholder]=\"placeholder()\"\n    [style.height]=\"height()\"\n    [style.max-height]=\"maxHeight()\"\n    [attr.aria-label]=\"'Rich text editor content'\"\n    [attr.aria-multiline]=\"'true'\"\n    [attr.role]=\"'textbox'\"\n    [attr.tabindex]=\"disabled() ? -1 : 0\"\n    (input)=\"onContentChange()\"\n    (keydown)=\"onKeyDown($event)\"\n    (mouseup)=\"updateEditorState()\"\n    (keyup)=\"updateEditorState()\"\n    (focus)=\"onFocus()\"\n    (blur)=\"onBlur()\"\n  ></div>\n\n  <!-- Validation Stats Display -->\n  @if (shouldShowStats()) {\n    <div class=\"validation-stats\">\n      @if (validationConfig().showWordCount) {\n        <span class=\"stat-item\">\n          {{ toolbarIcons().wordCount }} Words: {{ wordCountStats().words }}\n          @if (validationConfig().maxWords) {\n            <span class=\"stat-limit\">/{{ validationConfig().maxWords }}</span>\n          }\n        </span>\n      }\n\n      @if (validationConfig().showCharacterCount) {\n        <span class=\"stat-item\">\n          {{ toolbarIcons().characterCount }} Characters:\n          {{ wordCountStats().characters }}\n          @if (validationConfig().maxCharacters) {\n            <span class=\"stat-limit\"\n              >/{{ validationConfig().maxCharacters }}</span\n            >\n          }\n        </span>\n      }\n\n      @if (validationConfig().showReadingTime) {\n        <span class=\"stat-item\">\n          {{ toolbarIcons().readingTime }} Reading Time:\n          {{ wordCountStats().readingTime }}min\n        </span>\n      }\n    </div>\n  }\n\n  <!-- Spell Check Suggestions -->\n  @if (\n    validationConfig().spellCheck?.enabled && spellCheckSuggestions().length > 0\n  ) {\n    <div class=\"spell-check-suggestions\">\n      <div class=\"suggestions-header\">\n        {{ toolbarIcons().spellCheckError }} Spelling Suggestions\n      </div>\n\n      @for (\n        suggestion of spellCheckSuggestions();\n        track suggestion.startOffset\n      ) {\n        <div class=\"suggestion-item\">\n          <span class=\"misspelled-word\">\"{{ suggestion.word }}\"</span>\n          <span class=\"suggestion-description\">{{\n            suggestion.description\n          }}</span>\n\n          <div class=\"suggestion-actions\">\n            @for (\n              suggestionWord of suggestion.suggestions;\n              track suggestionWord\n            ) {\n              <button\n                type=\"button\"\n                class=\"suggestion-btn\"\n                (click)=\"\n                  acceptSpellingSuggestion(suggestion.word, suggestionWord)\n                \"\n                title=\"Replace with '{{ suggestionWord }}'\"\n              >\n                {{ suggestionWord }}\n              </button>\n            }\n\n            <button\n              type=\"button\"\n              class=\"ignore-btn\"\n              (click)=\"ignoreSpellingSuggestion(suggestion.word)\"\n              title=\"Ignore this word\"\n            >\n              Ignore\n            </button>\n          </div>\n        </div>\n      }\n    </div>\n  }\n\n  <!-- Validation Errors -->\n  @if (!isContentValid()) {\n    <div class=\"validation-errors\">\n      @for (error of getValidationErrors(); track error) {\n        <div class=\"error-item\">\n          {{ toolbarIcons().spellCheckError }} {{ error }}\n        </div>\n      }\n    </div>\n  }\n\n  <!-- HTML Edit Modal -->\n  @if (isHtmlEditMode()) {\n    <div\n      class=\"html-edit-modal\"\n      role=\"dialog\"\n      aria-labelledby=\"html-edit-title\"\n      aria-modal=\"true\"\n    >\n      <div class=\"modal-content\">\n        <div class=\"modal-header\">\n          <h3 id=\"html-edit-title\">Edit HTML Source</h3>\n          <button\n            type=\"button\"\n            class=\"close-btn\"\n            (click)=\"toggleHtmlEdit()\"\n            aria-label=\"Close HTML editor\"\n          >\n            \u2715\n          </button>\n        </div>\n        <div class=\"modal-body\">\n          <textarea\n            #htmlTextarea\n            class=\"html-textarea\"\n            [value]=\"getHtmlContent()\"\n            (input)=\"updateHtmlContent($event)\"\n            aria-label=\"HTML source code\"\n            placeholder=\"Enter HTML code here...\"\n          ></textarea>\n        </div>\n        <div class=\"modal-footer\">\n          <button\n            type=\"button\"\n            class=\"btn btn-primary\"\n            (click)=\"applyHtmlChanges()\"\n            aria-label=\"Apply HTML changes to editor\"\n          >\n            Apply Changes\n          </button>\n          <button\n            type=\"button\"\n            class=\"btn btn-secondary\"\n            (click)=\"toggleHtmlEdit()\"\n            aria-label=\"Cancel HTML editing\"\n          >\n            Cancel\n          </button>\n        </div>\n      </div>\n    </div>\n  }\n\n  <!-- Keyboard Shortcuts Modal -->\n  @if (showShortcutsModal()) {\n    <div\n      class=\"shortcuts-modal\"\n      role=\"dialog\"\n      aria-labelledby=\"shortcuts-title\"\n      aria-modal=\"true\"\n    >\n      <div class=\"modal-content\">\n        <div class=\"modal-header\">\n          <h3 id=\"shortcuts-title\">Keyboard Shortcuts</h3>\n          <button\n            type=\"button\"\n            class=\"close-btn\"\n            (click)=\"hideKeyboardShortcuts()\"\n            aria-label=\"Close shortcuts dialog\"\n          >\n            \u2715\n          </button>\n        </div>\n        <div class=\"modal-body\">\n          <div class=\"shortcuts-grid\">\n            <div class=\"shortcuts-section\">\n              <h4>Text Formatting</h4>\n              <ul>\n                <li><kbd>Ctrl+B</kbd> Bold</li>\n                <li><kbd>Ctrl+I</kbd> Italic</li>\n                <li><kbd>Ctrl+U</kbd> Underline</li>\n                <li><kbd>Ctrl+Shift+S</kbd> Strikethrough</li>\n                <li><kbd>Ctrl+=</kbd> Subscript</li>\n                <li><kbd>Ctrl+Shift+=</kbd> Superscript</li>\n              </ul>\n            </div>\n            <div class=\"shortcuts-section\">\n              <h4>Alignment</h4>\n              <ul>\n                <li><kbd>Ctrl+Shift+L</kbd> Align Left</li>\n                <li><kbd>Ctrl+Shift+E</kbd> Align Center</li>\n                <li><kbd>Ctrl+Shift+R</kbd> Align Right</li>\n                <li><kbd>Ctrl+Shift+J</kbd> Justify</li>\n              </ul>\n            </div>\n            <div class=\"shortcuts-section\">\n              <h4>Lists & Structure</h4>\n              <ul>\n                <li><kbd>Ctrl+Shift+8</kbd> Bullet List</li>\n                <li><kbd>Ctrl+Shift+7</kbd> Numbered List</li>\n                <li><kbd>Ctrl+Enter</kbd> Page Break</li>\n                <li><kbd>Ctrl+Shift+T</kbd> Insert Table</li>\n              </ul>\n            </div>\n            <div class=\"shortcuts-section\">\n              <h4>Actions</h4>\n              <ul>\n                <li><kbd>Ctrl+K</kbd> Insert Link</li>\n                <li><kbd>Ctrl+Z</kbd> Undo</li>\n                <li><kbd>Ctrl+Y</kbd> Redo</li>\n                <li><kbd>Ctrl+\\</kbd> Clear Formatting</li>\n                <li><kbd>Ctrl+Shift+H</kbd> HTML Edit</li>\n              </ul>\n            </div>\n          </div>\n        </div>\n        <div class=\"modal-footer\">\n          <button\n            type=\"button\"\n            class=\"btn btn-primary\"\n            (click)=\"hideKeyboardShortcuts()\"\n            aria-label=\"Close shortcuts dialog\"\n          >\n            Close\n          </button>\n        </div>\n      </div>\n    </div>\n  }\n</div>\n", styles: ["@charset \"UTF-8\";.ng-rm-editor-wrapper{border:1px solid #e0e0e0;border-radius:8px;background:#fff;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif}.ng-rm-editor-wrapper.disabled{opacity:.6;pointer-events:none}.toolbar{display:flex;flex-wrap:wrap;gap:0;padding:0;background:#f8f9fa;border-bottom:1px solid #e0e0e0;align-items:stretch}.toolbar-group{display:flex;gap:0;align-items:stretch}.toolbar-group:not(:last-child):not(:empty):after{content:\"\";width:1px;height:20px;background:#e0e0e0;margin:0 1px}.toolbar-btn{display:flex;align-items:center;justify-content:center;width:24px;height:24px;border:none;background:transparent;border-radius:1px;cursor:pointer;font-size:11px;color:#333;transition:all .2s ease;padding:0;margin:0;flex-shrink:0;line-height:1}.toolbar-btn:hover{background:#e9ecef}.toolbar-btn.active{background:#007bff;color:#fff}.toolbar-btn:disabled{opacity:.5;cursor:not-allowed}.toolbar-btn.danger-btn{color:#dc3545}.toolbar-btn.danger-btn:hover:not(:disabled){background:#f8d7da;color:#721c24}.toolbar-btn.table-resize-larger-btn{background:#007bff;color:#fff}.toolbar-btn.table-resize-larger-btn:hover:not(:disabled){background:#0056b3;color:#fff}.toolbar-select{height:24px;padding:1px 4px;border:1px solid #e0e0e0;border-radius:1px;font-size:10px;background:#fff;cursor:pointer;min-width:45px;max-width:80px;margin:0;flex-shrink:0;line-height:1.2}.toolbar-select:focus{outline:2px solid #007bff;outline-offset:-2px}.toolbar-select:disabled{opacity:.5;cursor:not-allowed}.color-picker{width:24px;height:24px;border:none;border-radius:1px;cursor:pointer;padding:0;background:transparent;margin:0;flex-shrink:0}.color-picker::-webkit-color-swatch-wrapper{padding:0;border:none;border-radius:4px}.color-picker::-webkit-color-swatch{border:none;border-radius:4px;border:1px solid #e0e0e0}.color-picker:disabled{opacity:.5;cursor:not-allowed}.editor-content{min-height:200px;padding:16px;outline:none;line-height:1.6;font-size:14px;overflow-y:auto;word-wrap:break-word}.editor-content:empty:before{content:attr(data-placeholder);color:#aaa;pointer-events:none}.editor-content:focus{background-color:#fafafa}.editor-content h1{font-size:2em;margin:.67em 0;font-weight:700}.editor-content h2{font-size:1.5em;margin:.75em 0;font-weight:700}.editor-content h3{font-size:1.17em;margin:.83em 0;font-weight:700}.editor-content h4{font-size:1em;margin:1.12em 0;font-weight:700}.editor-content h5{font-size:.83em;margin:1.5em 0;font-weight:700}.editor-content h6{font-size:.75em;margin:1.67em 0;font-weight:700}.editor-content pre{background:#f8f9fa;border:1px solid #e0e0e0;border-radius:4px;padding:12px;margin:16px 0;overflow-x:auto;font-family:Courier New,monospace;font-size:13px;line-height:1.4}.editor-content ul,.editor-content ol{margin:16px 0;padding-left:24px}.editor-content ul{list-style-type:disc}.editor-content ol{list-style-type:decimal}.editor-content li{margin:4px 0}.editor-content p{margin:8px 0}.editor-content p:first-child{margin-top:0}.editor-content p:last-child{margin-bottom:0}.editor-content strong,.editor-content b{font-weight:700}.editor-content em,.editor-content i{font-style:italic}.editor-content u{text-decoration:underline}.editor-content s,.editor-content strike{text-decoration:line-through}.editor-content sub{vertical-align:sub;font-size:smaller}.editor-content sup{vertical-align:super;font-size:smaller}.editor-content::-webkit-scrollbar{width:8px}.editor-content::-webkit-scrollbar-track{background:#f1f1f1;border-radius:4px}.editor-content::-webkit-scrollbar-thumb{background:#c1c1c1;border-radius:4px}.editor-content::-webkit-scrollbar-thumb:hover{background:#a8a8a8}.toolbar-group select.toolbar-select{font-size:9px;padding:1px 3px;min-width:38px;height:22px}.toolbar-group select[title=\"Font Family\"]{min-width:35px;max-width:65px}.toolbar-group select[title=\"Font Size\"]{min-width:30px;max-width:60px}.toolbar-group select[title=Heading]{min-width:40px;max-width:70px}@media(max-width:768px){.toolbar{padding:0;gap:0}.toolbar-group:not(:last-child):not(:empty):after{margin:0 1px}.toolbar-btn{width:20px;height:20px;font-size:9px;margin:0}.toolbar-select{height:20px;font-size:9px;min-width:50px;padding:0 2px;margin:0}.color-picker{width:20px;height:20px;margin:0}.editor-content{padding:12px;font-size:13px}}.youtube-embed,.vimeo-embed,.custom-embed{margin:10px 0}.youtube-embed iframe,.vimeo-embed iframe,.custom-embed iframe{max-width:100%;border-radius:6px;box-shadow:0 2px 8px #0000001a}.twitter-embed,.instagram-embed{margin:10px 0;padding:12px;border:1px solid #e1e8ed;border-radius:8px;background:#f8f9fa;transition:all .2s ease}.twitter-embed:hover,.instagram-embed:hover{box-shadow:0 2px 8px #0000001a;transform:translateY(-1px)}.twitter-embed a,.instagram-embed a{color:#1da1f2;text-decoration:none;font-weight:500;display:flex;align-items:center;gap:8px}.twitter-embed a:hover,.instagram-embed a:hover{text-decoration:underline}.twitter-embed p,.instagram-embed p{margin:8px 0 0;font-size:12px;color:#657786}.instagram-embed{border-color:#dbdbdb}.instagram-embed a{color:#e4405f}.instagram-embed p{color:#8e8e8e}.link-preview{margin:10px 0;padding:12px;border:1px solid #e1e5e9;border-radius:6px;background:#f8f9fa;transition:all .2s ease}.link-preview:hover{box-shadow:0 2px 6px #0000001a;border-color:#007bff}.link-preview a{color:#007bff;text-decoration:none;font-weight:500;display:flex;align-items:center;gap:8px}.link-preview a:hover{text-decoration:underline}.link-preview p{margin:8px 0 0;font-size:12px;color:#6c757d}@media(max-width:768px){.youtube-embed iframe,.vimeo-embed iframe{width:100%!important;height:auto!important;aspect-ratio:16/9}.twitter-embed,.instagram-embed,.link-preview{margin:8px 0;padding:10px}}@media(prefers-contrast:high){.ng-rm-editor-wrapper{border-color:#000}.toolbar{background:#fff;border-bottom-color:#000}.toolbar-btn{border:1px solid transparent}.toolbar-btn:hover{border-color:#000;background:#f0f0f0}.toolbar-btn.active{background:#000;color:#fff}}.validation-stats{display:flex;flex-wrap:wrap;gap:16px;padding:8px 12px;background:#f8f9fa;border-top:1px solid #e0e0e0;font-size:12px;color:#666}.validation-stats .stat-item{display:flex;align-items:center;gap:4px;font-weight:500}.validation-stats .stat-item .stat-limit{color:#999}.spell-check-suggestions{background:#fff3cd;border-top:1px solid #ffeaa7;padding:12px;font-size:13px}.spell-check-suggestions .suggestions-header{font-weight:600;color:#856404;margin-bottom:8px;display:flex;align-items:center;gap:6px}.spell-check-suggestions .suggestion-item{margin-bottom:8px;padding:8px;background:#fff;border:1px solid #ffeaa7;border-radius:4px}.spell-check-suggestions .suggestion-item .misspelled-word{font-weight:600;color:#e74c3c}.spell-check-suggestions .suggestion-item .suggestion-description{color:#666;margin-left:8px;font-style:italic}.spell-check-suggestions .suggestion-item .suggestion-actions{margin-top:6px;display:flex;flex-wrap:wrap;gap:4px}.spell-check-suggestions .suggestion-item .suggestion-btn,.spell-check-suggestions .suggestion-item .ignore-btn{padding:4px 8px;border:1px solid #ddd;border-radius:3px;background:#fff;cursor:pointer;font-size:11px;transition:all .2s ease}.spell-check-suggestions .suggestion-item .suggestion-btn:hover,.spell-check-suggestions .suggestion-item .ignore-btn:hover{background:#f0f0f0;border-color:#bbb}.spell-check-suggestions .suggestion-item .suggestion-btn{color:#27ae60;border-color:#27ae60}.spell-check-suggestions .suggestion-item .suggestion-btn:hover{background:#27ae60;color:#fff}.spell-check-suggestions .suggestion-item .ignore-btn{color:#7f8c8d}.spell-check-suggestions .suggestion-item .ignore-btn:hover{background:#7f8c8d;color:#fff}.validation-errors{background:#f8d7da;border-top:1px solid #f5c6cb;padding:8px 12px}.validation-errors .error-item{color:#721c24;font-size:13px;display:flex;align-items:center;gap:6px;margin-bottom:4px}.validation-errors .error-item:last-child{margin-bottom:0}@media(max-width:768px){.validation-stats{flex-direction:column;gap:8px}.spell-check-suggestions .suggestion-actions{flex-direction:column}.spell-check-suggestions .suggestion-actions .suggestion-btn,.spell-check-suggestions .suggestion-actions .ignore-btn{width:100%;text-align:center}}.editor-content .spelling-error{background-color:#ffebee;border-bottom:2px wavy #e74c3c;padding:1px 2px;border-radius:2px;cursor:help}.editor-content .grammar-error{background-color:#e3f2fd;border-bottom:2px wavy #2196f3;padding:1px 2px;border-radius:2px;cursor:help}.ng-rm-editor-wrapper.full-screen{position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9999;border:none;border-radius:0}.ng-rm-editor-wrapper.full-screen .editor-content{min-height:calc(100vh - 60px);height:calc(100vh - 60px);max-height:none;padding:24px;font-size:16px;line-height:1.6}.ng-rm-editor-wrapper.full-screen.distraction-free .toolbar{display:none}.ng-rm-editor-wrapper.full-screen.distraction-free .editor-content{min-height:100vh;height:100vh;padding:48px}.ng-rm-editor-wrapper.full-screen.distraction-free .validation-stats{display:none}:global(body.editor-full-screen){overflow:hidden}.ng-rm-editor-wrapper[data-theme=dark],.ng-rm-editor-wrapper.theme-dark,.ng-rm-editor-wrapper.theme-auto-dark{background:#1e1e1e;border-color:#404040;color:#e0e0e0}.ng-rm-editor-wrapper[data-theme=dark] .toolbar,.ng-rm-editor-wrapper.theme-dark .toolbar,.ng-rm-editor-wrapper.theme-auto-dark .toolbar{background:#2d2d30;border-bottom-color:#404040}.ng-rm-editor-wrapper[data-theme=dark] .toolbar-btn,.ng-rm-editor-wrapper.theme-dark .toolbar-btn,.ng-rm-editor-wrapper.theme-auto-dark .toolbar-btn{color:#e0e0e0}.ng-rm-editor-wrapper[data-theme=dark] .toolbar-btn:hover,.ng-rm-editor-wrapper.theme-dark .toolbar-btn:hover,.ng-rm-editor-wrapper.theme-auto-dark .toolbar-btn:hover{background:#404040}.ng-rm-editor-wrapper[data-theme=dark] .toolbar-btn.active,.ng-rm-editor-wrapper.theme-dark .toolbar-btn.active,.ng-rm-editor-wrapper.theme-auto-dark .toolbar-btn.active{background:#0e639c;color:#fff}.ng-rm-editor-wrapper[data-theme=dark] .toolbar-group:not(:last-child):not(:empty):after,.ng-rm-editor-wrapper.theme-dark .toolbar-group:not(:last-child):not(:empty):after,.ng-rm-editor-wrapper.theme-auto-dark .toolbar-group:not(:last-child):not(:empty):after{background:#404040}.ng-rm-editor-wrapper[data-theme=dark] .editor-content,.ng-rm-editor-wrapper.theme-dark .editor-content,.ng-rm-editor-wrapper.theme-auto-dark .editor-content{background:#1e1e1e;color:#e0e0e0}.ng-rm-editor-wrapper[data-theme=dark] .editor-content:focus,.ng-rm-editor-wrapper.theme-dark .editor-content:focus,.ng-rm-editor-wrapper.theme-auto-dark .editor-content:focus{box-shadow:0 0 0 2px #0e639c}.ng-rm-editor-wrapper[data-theme=dark] .editor-content:empty:before,.ng-rm-editor-wrapper.theme-dark .editor-content:empty:before,.ng-rm-editor-wrapper.theme-auto-dark .editor-content:empty:before{color:#888}.ng-rm-editor-wrapper[data-theme=dark] .validation-stats,.ng-rm-editor-wrapper.theme-dark .validation-stats,.ng-rm-editor-wrapper.theme-auto-dark .validation-stats{background:#2d2d30;border-top-color:#404040;color:#e0e0e0}.ng-rm-editor-wrapper[data-theme=dark] .validation-stats.warning,.ng-rm-editor-wrapper.theme-dark .validation-stats.warning,.ng-rm-editor-wrapper.theme-auto-dark .validation-stats.warning{background:#3c3c00;color:#ffeb3b}.ng-rm-editor-wrapper[data-theme=dark] .validation-stats.error,.ng-rm-editor-wrapper.theme-dark .validation-stats.error,.ng-rm-editor-wrapper.theme-auto-dark .validation-stats.error{background:#3c1e1e;color:#f44336}.ng-rm-editor-wrapper[data-theme=dark] .spell-check-suggestions,.ng-rm-editor-wrapper.theme-dark .spell-check-suggestions,.ng-rm-editor-wrapper.theme-auto-dark .spell-check-suggestions{background:#2d2d30;border-color:#404040;color:#e0e0e0}.ng-rm-editor-wrapper[data-theme=dark] .suggestion-btn,.ng-rm-editor-wrapper.theme-dark .suggestion-btn,.ng-rm-editor-wrapper.theme-auto-dark .suggestion-btn{color:#e0e0e0}.ng-rm-editor-wrapper[data-theme=dark] .suggestion-btn:hover,.ng-rm-editor-wrapper.theme-dark .suggestion-btn:hover,.ng-rm-editor-wrapper.theme-auto-dark .suggestion-btn:hover{background:#404040}.ng-rm-editor-wrapper[data-theme=dark] .ignore-btn,.ng-rm-editor-wrapper.theme-dark .ignore-btn,.ng-rm-editor-wrapper.theme-auto-dark .ignore-btn{background:#404040;color:#e0e0e0}.ng-rm-editor-wrapper[data-theme=dark] .ignore-btn:hover,.ng-rm-editor-wrapper.theme-dark .ignore-btn:hover,.ng-rm-editor-wrapper.theme-auto-dark .ignore-btn:hover{background:#505050}.ng-rm-editor-wrapper[data-theme=dark] .spelling-error,.ng-rm-editor-wrapper.theme-dark .spelling-error,.ng-rm-editor-wrapper.theme-auto-dark .spelling-error{background-color:#f4433633;border-bottom-color:#f44336}.ng-rm-editor-wrapper[data-theme=dark] .grammar-error,.ng-rm-editor-wrapper.theme-dark .grammar-error,.ng-rm-editor-wrapper.theme-auto-dark .grammar-error{background-color:#2196f333;border-bottom-color:#2196f3}@media(prefers-color-scheme:dark){.ng-rm-editor-wrapper[data-theme=auto],.ng-rm-editor-wrapper.theme-auto{background:#1e1e1e;border-color:#404040;color:#e0e0e0}.ng-rm-editor-wrapper[data-theme=auto] .toolbar,.ng-rm-editor-wrapper.theme-auto .toolbar{background:#2d2d30;border-bottom-color:#404040}.ng-rm-editor-wrapper[data-theme=auto] .toolbar-btn,.ng-rm-editor-wrapper.theme-auto .toolbar-btn{color:#e0e0e0}.ng-rm-editor-wrapper[data-theme=auto] .toolbar-btn:hover,.ng-rm-editor-wrapper.theme-auto .toolbar-btn:hover{background:#404040}.ng-rm-editor-wrapper[data-theme=auto] .toolbar-btn.active,.ng-rm-editor-wrapper.theme-auto .toolbar-btn.active{background:#0e639c;color:#fff}.ng-rm-editor-wrapper[data-theme=auto] .editor-content,.ng-rm-editor-wrapper.theme-auto .editor-content{background:#1e1e1e;color:#e0e0e0}.ng-rm-editor-wrapper[data-theme=auto] .editor-content:focus,.ng-rm-editor-wrapper.theme-auto .editor-content:focus{box-shadow:0 0 0 2px #0e639c}.ng-rm-editor-wrapper[data-theme=auto] .validation-stats,.ng-rm-editor-wrapper.theme-auto .validation-stats{background:#2d2d30;border-top-color:#404040;color:#e0e0e0}}@media(prefers-contrast:high){.ng-rm-editor-wrapper{border:2px solid}.ng-rm-editor-wrapper .toolbar-btn{border:1px solid}.ng-rm-editor-wrapper .toolbar-btn:focus{outline:2px solid;outline-offset:2px}}@media(prefers-reduced-motion:reduce){.toolbar-btn,.suggestion-btn,.ignore-btn{transition:none}.ng-rm-editor-wrapper.full-screen{animation:none}}.ng-rm-editor-wrapper .editor-content table{border-collapse:collapse;margin:10px 0;min-width:200px}.ng-rm-editor-wrapper .editor-content table td,.ng-rm-editor-wrapper .editor-content table th{border:1px solid #ddd;padding:8px;min-width:50px;min-height:25px;position:relative}.ng-rm-editor-wrapper .editor-content table td:hover,.ng-rm-editor-wrapper .editor-content table th:hover{background-color:#007bff1a}.ng-rm-editor-wrapper .editor-content table td.selected-cell,.ng-rm-editor-wrapper .editor-content table th.selected-cell{background-color:#007bff33!important;outline:2px solid #007bff;outline-offset:-1px}.ng-rm-editor-wrapper .editor-content table td:empty:before,.ng-rm-editor-wrapper .editor-content table th:empty:before{content:\"\\a0\";color:transparent}.ng-rm-editor-wrapper .editor-content table th{background-color:#f8f9fa;font-weight:600;text-align:center}.ng-rm-editor-wrapper .editor-content table:hover{outline:2px dashed #007bff;outline-offset:2px}.ng-rm-editor-wrapper .editor-content table.selected-table{outline:2px solid #007bff;outline-offset:2px}.ng-rm-editor-wrapper .toolbar-group .toolbar-btn[title*=Table]:hover,.ng-rm-editor-wrapper .toolbar-group .toolbar-btn[title*=Row]:hover,.ng-rm-editor-wrapper .toolbar-group .toolbar-btn[title*=Column]:hover,.ng-rm-editor-wrapper .toolbar-group .toolbar-btn[title*=Cell]:hover,.ng-rm-editor-wrapper .toolbar-group .toolbar-btn[title*=Merge]:hover,.ng-rm-editor-wrapper .toolbar-group .toolbar-btn[title*=Split]:hover{background-color:#007bff1a}.ng-rm-editor-wrapper .toolbar-group .toolbar-btn[title*=Table]:disabled,.ng-rm-editor-wrapper .toolbar-group .toolbar-btn[title*=Row]:disabled,.ng-rm-editor-wrapper .toolbar-group .toolbar-btn[title*=Column]:disabled,.ng-rm-editor-wrapper .toolbar-group .toolbar-btn[title*=Cell]:disabled,.ng-rm-editor-wrapper .toolbar-group .toolbar-btn[title*=Merge]:disabled,.ng-rm-editor-wrapper .toolbar-group .toolbar-btn[title*=Split]:disabled{opacity:.5;cursor:not-allowed}.ng-rm-editor-wrapper[data-theme=dark] .editor-content table td,.ng-rm-editor-wrapper[data-theme=dark] .editor-content table th,.ng-rm-editor-wrapper.theme-dark .editor-content table td,.ng-rm-editor-wrapper.theme-dark .editor-content table th,.ng-rm-editor-wrapper.theme-auto-dark .editor-content table td,.ng-rm-editor-wrapper.theme-auto-dark .editor-content table th{border-color:#404040}.ng-rm-editor-wrapper[data-theme=dark] .editor-content table td:hover,.ng-rm-editor-wrapper[data-theme=dark] .editor-content table th:hover,.ng-rm-editor-wrapper.theme-dark .editor-content table td:hover,.ng-rm-editor-wrapper.theme-dark .editor-content table th:hover,.ng-rm-editor-wrapper.theme-auto-dark .editor-content table td:hover,.ng-rm-editor-wrapper.theme-auto-dark .editor-content table th:hover{background-color:#0e639c33}.ng-rm-editor-wrapper[data-theme=dark] .editor-content table td.selected-cell,.ng-rm-editor-wrapper[data-theme=dark] .editor-content table th.selected-cell,.ng-rm-editor-wrapper.theme-dark .editor-content table td.selected-cell,.ng-rm-editor-wrapper.theme-dark .editor-content table th.selected-cell,.ng-rm-editor-wrapper.theme-auto-dark .editor-content table td.selected-cell,.ng-rm-editor-wrapper.theme-auto-dark .editor-content table th.selected-cell{background-color:#0e639c4d!important;outline-color:#0e639c}.ng-rm-editor-wrapper[data-theme=dark] .editor-content table th,.ng-rm-editor-wrapper.theme-dark .editor-content table th,.ng-rm-editor-wrapper.theme-auto-dark .editor-content table th{background-color:#2d2d30;color:#e0e0e0}.ng-rm-editor-wrapper[data-theme=dark] .editor-content table:hover,.ng-rm-editor-wrapper.theme-dark .editor-content table:hover,.ng-rm-editor-wrapper.theme-auto-dark .editor-content table:hover,.ng-rm-editor-wrapper[data-theme=dark] .editor-content table.selected-table,.ng-rm-editor-wrapper.theme-dark .editor-content table.selected-table,.ng-rm-editor-wrapper.theme-auto-dark .editor-content table.selected-table{outline-color:#0e639c}@media(prefers-color-scheme:dark){.ng-rm-editor-wrapper[data-theme=auto] .editor-content table td,.ng-rm-editor-wrapper[data-theme=auto] .editor-content table th,.ng-rm-editor-wrapper.theme-auto .editor-content table td,.ng-rm-editor-wrapper.theme-auto .editor-content table th{border-color:#404040}.ng-rm-editor-wrapper[data-theme=auto] .editor-content table td:hover,.ng-rm-editor-wrapper[data-theme=auto] .editor-content table th:hover,.ng-rm-editor-wrapper.theme-auto .editor-content table td:hover,.ng-rm-editor-wrapper.theme-auto .editor-content table th:hover{background-color:#0e639c33}.ng-rm-editor-wrapper[data-theme=auto] .editor-content table td.selected-cell,.ng-rm-editor-wrapper[data-theme=auto] .editor-content table th.selected-cell,.ng-rm-editor-wrapper.theme-auto .editor-content table td.selected-cell,.ng-rm-editor-wrapper.theme-auto .editor-content table th.selected-cell{background-color:#0e639c4d!important;outline-color:#0e639c}.ng-rm-editor-wrapper[data-theme=auto] .editor-content table th,.ng-rm-editor-wrapper.theme-auto .editor-content table th{background-color:#2d2d30;color:#e0e0e0}}@media(max-width:768px){.ng-rm-editor-wrapper .editor-content table{font-size:14px}.ng-rm-editor-wrapper .editor-content table td,.ng-rm-editor-wrapper .editor-content table th{padding:6px;min-width:40px}}.ng-rm-editor-wrapper .editor-content .page-break{page-break-after:always;border-bottom:2px dashed #ccc;margin:20px 0;padding-bottom:20px;position:relative;min-height:20px}.ng-rm-editor-wrapper .editor-content .page-break:after{content:\"Page Break\";position:absolute;right:0;bottom:-15px;font-size:12px;color:#999;background:#fff;padding:0 10px;border-radius:12px;border:1px solid #e0e0e0}@media print{.ng-rm-editor-wrapper .editor-content .page-break{border:none;margin:0;padding:0}.ng-rm-editor-wrapper .editor-content .page-break:after{display:none}}[data-theme=dark] .ng-rm-editor-wrapper .editor-content .page-break{border-bottom-color:#555}[data-theme=dark] .ng-rm-editor-wrapper .editor-content .page-break:after{color:#aaa;background:#2d2d30;border-color:#555}.ng-rm-editor-wrapper .editor-content .section-divider{border-top:3px solid #e0e0e0;margin:30px 0;text-align:center;position:relative}.ng-rm-editor-wrapper .editor-content .section-divider span{position:absolute;top:-12px;left:50%;transform:translate(-50%);background:#fff;padding:0 20px;color:#999;font-size:14px;font-weight:400}[data-theme=dark] .ng-rm-editor-wrapper .editor-content .section-divider{border-top-color:#555}[data-theme=dark] .ng-rm-editor-wrapper .editor-content .section-divider span{background:#2d2d30;color:#aaa}.ng-rm-editor-wrapper .editor-content img,.ng-rm-editor-wrapper .editor-content video,.ng-rm-editor-wrapper .editor-content audio{max-width:100%;height:auto;margin:10px 0;border-radius:4px;box-shadow:0 2px 8px #0000001a}.ng-rm-editor-wrapper .editor-content img:hover,.ng-rm-editor-wrapper .editor-content video:hover,.ng-rm-editor-wrapper .editor-content audio:hover{box-shadow:0 4px 12px #00000026;transition:box-shadow .2s ease}.ng-rm-editor-wrapper .editor-content video,.ng-rm-editor-wrapper .editor-content audio{background:#f8f9fa}[data-theme=dark] .ng-rm-editor-wrapper .editor-content video,[data-theme=dark] .ng-rm-editor-wrapper .editor-content audio{background:#2d2d30}@media(max-width:768px){.ng-rm-editor-wrapper .editor-content img,.ng-rm-editor-wrapper .editor-content video{margin:15px 0}.ng-rm-editor-wrapper .editor-content audio{width:100%;margin:15px 0}}.html-edit-modal,.shortcuts-modal{position:fixed;top:0;left:0;width:100%;height:100%;background:#00000080;display:flex;align-items:center;justify-content:center;z-index:1000}.html-edit-modal .modal-content,.shortcuts-modal .modal-content{background:#fff;border-radius:8px;width:90%;max-width:600px;max-height:90%;overflow:hidden;box-shadow:0 10px 30px #0000004d}[data-theme=dark] .html-edit-modal .modal-content,[data-theme=dark] .shortcuts-modal .modal-content{background:#2d2d30;color:#e0e0e0}.html-edit-modal .modal-header,.shortcuts-modal .modal-header{display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid #e0e0e0}.html-edit-modal .modal-header h3,.shortcuts-modal .modal-header h3{margin:0;font-size:18px;font-weight:600}.html-edit-modal .modal-header .close-btn,.shortcuts-modal .modal-header .close-btn{background:none;border:none;font-size:20px;cursor:pointer;color:#666;padding:4px;border-radius:4px;transition:background-color .2s}.html-edit-modal .modal-header .close-btn:hover,.shortcuts-modal .modal-header .close-btn:hover{background:#f0f0f0;color:#333}[data-theme=dark] .html-edit-modal .modal-header,[data-theme=dark] .shortcuts-modal .modal-header{border-bottom-color:#555}[data-theme=dark] .html-edit-modal .modal-header .close-btn,[data-theme=dark] .shortcuts-modal .modal-header .close-btn{color:#aaa}[data-theme=dark] .html-edit-modal .modal-header .close-btn:hover,[data-theme=dark] .shortcuts-modal .modal-header .close-btn:hover{background:#404040;color:#e0e0e0}.html-edit-modal .modal-body,.shortcuts-modal .modal-body{padding:20px;overflow-y:auto;max-height:400px}.html-edit-modal .modal-footer,.shortcuts-modal .modal-footer{display:flex;justify-content:flex-end;gap:12px;padding:16px 20px;border-top:1px solid #e0e0e0}.html-edit-modal .modal-footer .btn,.shortcuts-modal .modal-footer .btn{padding:8px 16px;border:none;border-radius:4px;cursor:pointer;font-size:14px;font-weight:500;transition:all .2s}.html-edit-modal .modal-footer .btn.btn-primary,.shortcuts-modal .modal-footer .btn.btn-primary{background:#007bff;color:#fff}.html-edit-modal .modal-footer .btn.btn-primary:hover,.shortcuts-modal .modal-footer .btn.btn-primary:hover{background:#0056b3}.html-edit-modal .modal-footer .btn.btn-secondary,.shortcuts-modal .modal-footer .btn.btn-secondary{background:#6c757d;color:#fff}.html-edit-modal .modal-footer .btn.btn-secondary:hover,.shortcuts-modal .modal-footer .btn.btn-secondary:hover{background:#545b62}[data-theme=dark] .html-edit-modal .modal-footer,[data-theme=dark] .shortcuts-modal .modal-footer{border-top-color:#555}.html-textarea{width:100%;height:300px;padding:12px;border:1px solid #e0e0e0;border-radius:4px;font-family:Monaco,Menlo,Ubuntu Mono,monospace;font-size:13px;line-height:1.5;resize:vertical;background:#fafafa}.html-textarea:focus{outline:none;border-color:#007bff;box-shadow:0 0 0 2px #007bff40}[data-theme=dark] .html-textarea{background:#1e1e1e;border-color:#555;color:#e0e0e0}[data-theme=dark] .html-textarea:focus{border-color:#007bff}.shortcuts-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px}.shortcuts-grid .shortcuts-section h4{margin:0 0 12px;font-size:16px;font-weight:600;color:#333;border-bottom:2px solid #007bff;padding-bottom:4px}.shortcuts-grid .shortcuts-section ul{list-style:none;padding:0;margin:0}.shortcuts-grid .shortcuts-section ul li{display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #f0f0f0}.shortcuts-grid .shortcuts-section ul li:last-child{border-bottom:none}.shortcuts-grid .shortcuts-section ul li kbd{background:#e9ecef;border:1px solid #ced4da;border-radius:3px;padding:3px 6px;font-size:11px;font-family:monospace;color:#495057;white-space:nowrap}[data-theme=dark] .shortcuts-grid .shortcuts-section h4{color:#e0e0e0;border-bottom-color:#007bff}[data-theme=dark] .shortcuts-grid .shortcuts-section ul li{border-bottom-color:#404040}[data-theme=dark] .shortcuts-grid .shortcuts-section ul li kbd{background:#404040;border-color:#555;color:#e0e0e0}@media(max-width:768px){.html-edit-modal .modal-content,.shortcuts-modal .modal-content{width:95%;margin:20px}.html-edit-modal .modal-body,.shortcuts-modal .modal-body{padding:16px;max-height:60vh}.html-edit-modal .shortcuts-grid,.shortcuts-modal .shortcuts-grid{grid-template-columns:1fr;gap:16px}.html-edit-modal .html-textarea,.shortcuts-modal .html-textarea{height:250px}}.toolbar-btn:focus-visible,.btn:focus-visible{outline:2px solid #007bff;outline-offset:2px}.table-resize-wrapper{position:relative;display:inline-block;border:2px solid #007bff;border-radius:4px}.table-resize-wrapper .resize-handle-right,.table-resize-wrapper .resize-handle-bottom,.table-resize-wrapper .resize-handle-corner{position:absolute;background:#007bff;border:1px solid #fff;border-radius:2px;z-index:1000;transition:all .2s ease}.table-resize-wrapper .resize-handle-right:hover,.table-resize-wrapper .resize-handle-bottom:hover,.table-resize-wrapper .resize-handle-corner:hover{background:#0056b3;transform:scale(1.1)}.table-resize-wrapper .resize-handle-right{cursor:col-resize;right:-6px;top:50%;transform:translateY(-50%);width:12px;height:30px}.table-resize-wrapper .resize-handle-right:hover{transform:translateY(-50%) scale(1.1)}.table-resize-wrapper .resize-handle-bottom{cursor:row-resize;bottom:-6px;left:50%;transform:translate(-50%);width:30px;height:12px}.table-resize-wrapper .resize-handle-bottom:hover{transform:translate(-50%) scale(1.1)}.table-resize-wrapper .resize-handle-corner{cursor:nw-resize;bottom:-6px;right:-6px;width:12px;height:12px}.table-resize-wrapper .resize-handle-corner:hover{transform:scale(1.2)}table.resizing{transition:none;-webkit-user-select:none;user-select:none}\n"] }]
        }], ctorParameters: () => [], propDecorators: { editorElement: [{ type: i0.ViewChild, args: ['editor', { isSignal: true }] }], toolbarElement: [{ type: i0.ViewChild, args: ['toolbar', { isSignal: true }] }], config: [{ type: i0.Input, args: [{ isSignal: true, alias: "config", required: false }] }], value: [{ type: i0.Input, args: [{ isSignal: true, alias: "value", required: false }] }], valueChange: [{ type: i0.Output, args: ["valueChange"] }], focusEvent: [{ type: i0.Output, args: ["focusEvent"] }], blurEvent: [{ type: i0.Output, args: ["blurEvent"] }], stateChange: [{ type: i0.Output, args: ["stateChange"] }], wordCountChange: [{ type: i0.Output, args: ["wordCountChange"] }], spellCheckResults: [{ type: i0.Output, args: ["spellCheckResults"] }], fullScreenChange: [{ type: i0.Output, args: ["fullScreenChange"] }], themeChange: [{ type: i0.Output, args: ["themeChange"] }], tableInsert: [{ type: i0.Output, args: ["tableInsert"] }], tableModify: [{ type: i0.Output, args: ["tableModify"] }] } });

/*
 * Public API Surface of rm-ng-editor
 */

/**
 * Generated bundle index. Do not edit.
 */

export { CellMergeValidator, DEFAULT_FULLSCREEN_CONFIG, DEFAULT_TABLE_CONFIG, DEFAULT_THEME_CONFIG, DEFAULT_TOOLBAR_CONFIG, DEFAULT_TOOLBAR_ICONS, DEFAULT_VALIDATION_CONFIG, EDITOR_DEFAULT_CONFIG, EDITOR_DEFAULT_ICONS, EDITOR_PERFORMANCE_CONFIG, KeyboardLayoutHandler, KeyboardShortcutManager, NestedTableSanitizer, PlatformAwareShortcutHandler, RmNgEditor, RmNgEditorService, SpellCheckManager, TableSelectionManager };
//# sourceMappingURL=codewithrajat-rm-ng-editor.mjs.map

import { CupertinoPane } from '../cupertino-pane';
/**
 * Resize, Keyboard show, Keyboard hide
 */
export declare class KeyboardEvents {
    private instance;
    inputBluredbyMove: boolean;
    private keyboardVisibleResize;
    private inputBottomOffset;
    private previousInputBottomOffset;
    private prevNewHeight;
    private prevFocusedElement;
    private device;
    private breakpoints;
    constructor(instance: CupertinoPane);
    /**
     * Open Cordova Keyboard event
     * @param e
     */
    onKeyboardShowCb: (e: any) => Promise<void>;
    private onKeyboardShow;
    /**
     * Close Cordova Keyboard event
     * @param e
     */
    onKeyboardWillHideCb: (e: any) => void;
    private onKeyboardWillHide;
    /**
     * Window resize event
     * We handle here keyboard event as well
     * @param e
     */
    onWindowResizeCb: (e: any) => Promise<void>;
    private onWindowResize;
    /**
     * Private class methods
     */
    private isPaneDescendant;
    private isFormElement;
    private isOnViewport;
    /**
     * Deal with Ionic Framework.
     * ion-input, ion-textarea changes in Client rects after window resize.
     * get rects by parent, not shadowDom el
     */
    private getActiveInputClientBottomRect;
    /**
     * Using only to fix follower elemennts jumps out by OSK
     * Fix OSK
     * https://developer.chrome.com/blog/viewport-resize-behavior/
     * Chrome 108+ will adjust with overlays-content
     * When everyones updates, can be replaced with adding content-overlays to meta
     */
    fixBodyKeyboardResize(showKeyboard: any): void;
}

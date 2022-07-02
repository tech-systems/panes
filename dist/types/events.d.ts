import { CupertinoPane } from './cupertino-pane';
import { CupertinoSettings } from './models';
import { Device } from './device';
import { Breakpoints } from './breakpoints';
import { Transitions } from './transitions';
/**
 * Touch start, Touch move, Touch end,
 * Click, Keyboard show, Keyboard hide
 */
export declare class Events {
    private instance;
    private settings;
    private device;
    private breakpoints;
    private transitions;
    touchEvents: {
        start: string;
        move: string;
        end: string;
        cancel: string;
    };
    private allowClick;
    private disableDragAngle;
    private mouseDown;
    contentScrollTop: number;
    private startY;
    private startX;
    private steps;
    isScrolling: boolean;
    startPointOverTop: number;
    swipeNextSensivity: number;
    private keyboardVisible;
    private inputBluredbyMove;
    private inputBottomOffset;
    private previousInputBottomOffset;
    private prevNewHeight;
    private prevFocusedElement;
    constructor(instance: CupertinoPane, settings: CupertinoSettings, device: Device, breakpoints: Breakpoints, transitions: Transitions);
    private getTouchEvents;
    attachAllEvents(): void;
    detachAllEvents(): void;
    resetEvents(): void;
    /**
     * Core DOM elements event listeners
     * @param type
     * @param el
     */
    private eventListeners;
    /**
     * Touch Start Event
     * @param t
     */
    touchStartCb: (t: any) => void;
    private touchStart;
    /**
     * Touch Move Event
     * @param t
     */
    touchMoveCb: (t: any) => void;
    private touchMove;
    /**
     * Touch End Event
     * @param t
     */
    touchEndCb: (t: any) => void;
    private touchEnd;
    /**
     * Click Event
     * @param t
     */
    onScrollCb: (t: any) => Promise<void>;
    private onScroll;
    /**
     * Click Event
     * @param t
     */
    onClickCb: (t: any) => void;
    private onClick;
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
     * @param e
     */
    onWindowResizeCb: (e: any) => Promise<void>;
    private onWindowResize;
    fastSwipeNext(axis: 'Y' | 'X'): boolean;
    /**
     * Private class methods
     */
    /**
     * Determinate if event is keyboard not resize
     * If form element active - recognize here as KeyboardWillShow
     */
    private isKeyboardEvent;
    /**
     * Topper Than Top
     * Lower Than Bottom
     * Otherwise don't changes
     */
    private handleTopperLowerPositions;
    private getEventClientYX;
    scrollPreventDrag(t: any): boolean;
    willScrolled(): boolean;
    private isPaneDescendant;
    private isFormElement;
    isElementScrollable(el: any): boolean;
    private isOnViewport;
}

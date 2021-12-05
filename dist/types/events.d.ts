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
    private allowClick;
    private disableDragAngle;
    private pointerDown;
    private contentScrollTop;
    private startY;
    private startX;
    private steps;
    private inputBluredbyMove;
    private keyboardVisible;
    private isScrolling;
    private startPointOverTop;
    constructor(instance: CupertinoPane, settings: CupertinoSettings, device: Device, breakpoints: Breakpoints, transitions: Transitions);
    attachAllEvents(): void;
    detachAllEvents(): void;
    resetEvents(): void;
    private touchEvents;
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
    touchMoveBackdropCb: (t: any) => void;
    private touchMoveBackdrop;
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
    onKeyboardShowCb: (e: any) => void;
    private onKeyboardShow;
    /**
     * Close Cordova Keyboard event
     * @param e
     */
    onKeyboardWillHideCb: (e: any) => void;
    private onKeyboardWillHide;
    /**
     * Window resize event
     * TODO: Prevent android unlock events
     * @param e
     */
    onWindowResizeCb: (e: any) => Promise<void>;
    private onWindowResize;
    /**
     * Private class methods
     */
    /**
     * Topper Than Top
     * Lower Than Bottom
     * Otherwise don't changes
     * TODO: Merge same entry functions
     */
    private handleTopperLowerPositions;
    private getEvetClientYX;
    /**
     * Fix android keyboard issue with transition
     * (resize window frame height on hide/show)
     */
    private fixAndroidResize;
    private willScrolled;
    private isPaneDescendant;
    private isFormElement;
    private isElementScrollable;
    private isOnViewport;
}

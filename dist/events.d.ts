import { CupertinoPane, CupertinoSettings } from 'cupertino-pane';
import { Device } from './device';
import { Breakpoints } from './breakpoints';
/**
 * Touch start, Touch move, Touch end,
 * Click, Keyboard show, Keyboard hide
 */
export declare class Events {
    private instance;
    private settings;
    private device;
    private breakpoints;
    private allowClick;
    private disableDragAngle;
    private pointerDown;
    private contentScrollTop;
    private startY;
    private startX;
    private steps;
    private inputBluredbyMove;
    private movedByKeyboard;
    constructor(instance: CupertinoPane, settings: CupertinoSettings, device: Device, breakpoints: Breakpoints);
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
    onKeyboardHideCb: (e: any) => void;
    private onKeyboardHide;
    /**
     * Window resize event
     * @param e
     */
    onWindowResizeCb: (e: any) => Promise<void>;
    private onWindowResize;
    /**
     * Private class methods
     */
    private getEvetClientYX;
    /**
     * Fix android keyboard issue with transition
     * (resize window frame height on hide/show)
     */
    private fixAndroidResize;
    /**
     * Check if drag event fired by scrollable element
     */
    private isDragScrollabe;
    private willScrolled;
    private isPaneDescendant;
    private isFormElement;
    private isElementScrollable;
    private isOnViewport;
}

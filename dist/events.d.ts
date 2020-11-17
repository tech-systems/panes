import { CupertinoPane, CupertinoSettings } from 'cupertino-pane';
import { Device } from './device';
/**
 * Touch start, Touch move, Touch end,
 * Click, Keyboard show, Keyboard hide
 */
export declare class Events {
    private instance;
    private settings;
    private device;
    private allowClick;
    private disableDragAngle;
    private pointerDown;
    private contentScrollTop;
    private startY;
    private startX;
    private steps;
    private inputBlured;
    private formElements;
    constructor(instance: CupertinoPane, settings: CupertinoSettings, device: Device);
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
     * Private class methods
     */
    /**
     * Check if drag event fired by scrollable element
     */
    private isDragScrollabe;
    private willScrolled;
}

import { Settings } from './models';
export declare type CupertinoSettings = Partial<Settings>;
export declare class CupertinoPane {
    private selector;
    settings: Settings;
    private defaultBreaksConf;
    private screen_height;
    private steps;
    private startP;
    private pointerDown;
    private topper;
    private bottomer;
    private currentBreakpoint;
    private contentScrollTop;
    private disableDragEvents;
    private rendered;
    private allowClick;
    private breaks;
    private brs;
    private el;
    private parentEl;
    private wrapperEl;
    private paneEl;
    private draggableEl;
    private moveEl;
    private contentEl;
    private backdropEl;
    private closeEl;
    private overflowEl;
    private followerEl;
    private device;
    constructor(selector: (string | HTMLElement), conf?: CupertinoSettings);
    private drawElements;
    present(conf?: {
        animate: boolean;
    }): void;
    /**
     * Private Utils methods
     */
    private scrollElementInit;
    private getTimingFunction;
    private checkOpacityAttr;
    private checkOverflowAttr;
    private isPanePresented;
    /**
     * Check if drag event fired by scrollable element
     */
    private isDragScrollabe;
    /**
     * Touch Start Event
     * @param t
     */
    private touchStartCb;
    private touchStart;
    /**
     * Touch Move Event
     * @param t
     */
    private touchMoveCb;
    private touchMove;
    /**
     * Touch End Event
     * @param t
     */
    private touchEndCb;
    private touchEnd;
    /**
     * Click Event
     * @param t
     */
    private onClickCb;
    private onClick;
    private swipeNextPoint;
    private isBackdropPresented;
    private renderBackdrop;
    /**
     * Backdrop
     */
    backdrop(conf?: {
        show: boolean;
    }): any;
    /************************************
     * Events
     */
    private touchEvents;
    private attachEvents;
    private detachEvents;
    private getPanelTransformY;
    /************************************
     * Public user methods
     */
    /**
     * Disable pane drag events
     */
    disableDrag(): void;
    /**
     * Enable pane drag events
     */
    enableDrag(): void;
    moveToBreak(val: any): any;
    hide(): any;
    isHidden(): (boolean | null);
    currentBreak(): (string | null);
    private destroyResets;
    destroy(conf?: {
        animate: boolean;
    }): any;
    /***********************************
     * Transitions handler
     */
    private doTransition;
}

export declare class CupertinoPane {
    private selector;
    settings: any;
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
    private device;
    constructor(selector: string, conf?: any);
    private drawElements;
    present(conf?: {
        animate: boolean;
    }): void;
    private checkOpacityAttr;
    private checkOverflowAttr;
    private isPanePresented;
    /**
     * Touch Start Event
     * @param t
     */
    private touchStart;
    /**
     * Touch Move Event
     * @param t
     */
    private touchMove;
    /**
     * Touch End Event
     * @param t
     */
    private touchEnd;
    private swipeNextPoint;
    /************************************
     * Events
     */
    private touchEvents;
    attachEvents(): void;
    detachEvents(): void;
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
    destroy(conf?: {
        animate: boolean;
    }): any;
}

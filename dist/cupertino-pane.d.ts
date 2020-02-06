export declare class CupertinoPane {
    private el;
    settings: any;
    private screen_height;
    private steps;
    private startP;
    private pointerDown;
    private topper;
    private bottomer;
    private currentBreak;
    private contentScrollTop;
    private breaks;
    private brs;
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
    constructor(el: any, conf?: any);
    private drawElements;
    present(conf?: {
        animate: boolean;
    }): void;
    moveToBreak(val: any): void;
    hide(): void;
    isHidden(): (boolean | null);
    private checkOpacityAttr;
    private checkOverflowAttr;
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
    destroy(conf?: {
        animate: boolean;
    }): void;
    private swipeNextPoint;
    /************************************
     * Events
     */
    private touchEvents;
    attachEvents(): void;
    detachEvents(): void;
}

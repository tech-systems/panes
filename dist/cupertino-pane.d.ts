export declare class CupertinoPane {
    private el;
    private settings;
    private screen_height;
    private steps;
    private startP;
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
    constructor(el: any, conf?: any);
    private drawElements;
    present(): void;
    moveToBreak(val: any): void;
    hide(): void;
    isHidden(): boolean;
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
    private closePane;
    private swipeNextPoint;
}

import { PaneSettings, PaneBreaks } from './models';
export declare type CupertinoSettings = Partial<PaneSettings>;
export declare class CupertinoPane {
    private selector;
    private defaultBreaksConf;
    topper: number;
    bottomer: number;
    disableDragEvents: boolean;
    currentBreakpoint: number;
    prevBreakpoint: string;
    breaks: {};
    screen_height: number;
    private screenHeightOffset;
    private rendered;
    private preventDismissEvent;
    private iconCloseColor;
    private brs;
    wrapperEl: HTMLDivElement;
    paneEl: HTMLDivElement;
    overflowEl: HTMLElement;
    private el;
    private parentEl;
    private draggableEl;
    private moveEl;
    private contentEl;
    private backdropEl;
    private closeEl;
    private followerEl;
    private pushElement;
    private settings;
    private events;
    private device;
    constructor(selector: (string | HTMLElement), conf?: CupertinoSettings);
    private drawBaseElements;
    present(conf?: {
        animate: boolean;
    }): void;
    /**
     * Private Utils methods
     */
    private getPaneHeight;
    private attachAllEvents;
    private detachAllEvents;
    private resetEvents;
    getClosestBreakY(): number;
    private scrollElementInit;
    setOverflowHeight(offset?: number): void;
    private getTimingFunction;
    checkOpacityAttr(val: any): void;
    checkOverflowAttr(val: any): void;
    private isPanePresented;
    swipeNextPoint: (diff: any, maxDiff: any, closest: any) => any;
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
    getPanelTransformY(): number;
    /************************************
     * Public user methods
     */
    /**
     * Prevent dismiss event
     */
    preventDismiss(): void;
    /**
     * Disable pane drag events
     */
    disableDrag(): void;
    /**
     * Enable pane drag events
     */
    enableDrag(): void;
    setDarkMode(conf?: {
        enable: boolean;
    }): void;
    /**
     * Function builder for breakpoints and heights
     * @param conf breakpoints
     */
    setBreakpoints(conf?: PaneBreaks): void;
    moveToBreak(val: string): any;
    moveToHeight(val: number): any;
    hide(): any;
    isHidden(): (boolean | null);
    currentBreak(): (string | null);
    private destroyResets;
    destroy(conf?: {
        animate: boolean;
    }): any;
    private pushTransition;
    /***********************************
     * Transitions handler
     */
    doTransition(params?: any): void;
}

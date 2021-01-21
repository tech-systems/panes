import { PaneSettings, PaneBreaks } from './models';
export declare type CupertinoSettings = Partial<PaneSettings>;
export declare class CupertinoPane {
    private selector;
    disableDragEvents: boolean;
    screen_height: number;
    screenHeightOffset: number;
    preventDismissEvent: boolean;
    preventedDismiss: boolean;
    private iconCloseColor;
    rendered: boolean;
    wrapperEl: HTMLDivElement;
    paneEl: HTMLDivElement;
    overflowEl: HTMLElement;
    el: HTMLElement;
    contentEl: HTMLElement;
    private parentEl;
    private draggableEl;
    private moveEl;
    private backdropEl;
    private destroyButtonEl;
    private followerEl;
    private pushElement;
    private settings;
    private device;
    private events;
    private breakpoints;
    constructor(selector: (string | HTMLElement), conf?: CupertinoSettings);
    private drawBaseElements;
    present(conf?: {
        animate: boolean;
    }): Promise<void>;
    getPaneHeight(): number;
    /**
     * Private Utils methods
     */
    private attachAllEvents;
    private detachAllEvents;
    private resetEvents;
    scrollElementInit(): void;
    setOverflowHeight(offset?: number): void;
    private getTimingFunction;
    checkOpacityAttr(val: any): void;
    checkOverflowAttr(val: any): void;
    isPanePresented(): boolean;
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
    preventDismiss(val?: boolean): void;
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
     * Public user method to reset breakpoints
     * @param conf
     */
    setBreakpoints(conf?: PaneBreaks): Promise<void>;
    calcFitHeight(): Promise<void>;
    moveToBreak(val: string): any;
    moveToHeight(val: number): any;
    hide(): any;
    isHidden(): (boolean | null);
    currentBreak(): (string | null);
    private destroyResets;
    destroy(conf?: {
        animate: boolean;
        destroyButton?: boolean;
    }): any;
    private pushTransition;
    /***********************************
     * Transitions handler
     */
    doTransition(params?: any): void;
}

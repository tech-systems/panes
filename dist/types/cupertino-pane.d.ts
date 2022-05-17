import { CupertinoSettings, PaneBreaks, ZStackSettings } from './models';
export declare class CupertinoPane {
    private selector;
    disableDragEvents: boolean;
    screen_height: number;
    screenHeightOffset: number;
    preventDismissEvent: boolean;
    preventedDismiss: boolean;
    rendered: boolean;
    wrapperEl: HTMLDivElement;
    paneEl: HTMLDivElement;
    overflowEl: HTMLElement;
    el: HTMLElement;
    contentEl: HTMLElement;
    parentEl: HTMLElement;
    backdropEl: HTMLDivElement;
    followerEl: HTMLElement;
    private draggableEl;
    private moveEl;
    private destroyButtonEl;
    private settings;
    private device;
    private events;
    private breakpoints;
    private transitions;
    private zStack;
    eventsListeners: {};
    on: Function;
    emit: Function;
    constructor(selector: (string | HTMLElement), conf?: CupertinoSettings);
    private drawBaseElements;
    present(conf?: {
        animate: boolean;
    }): Promise<CupertinoPane>;
    getPaneHeight(): number;
    updateScreenHeights(): void;
    scrollElementInit(): void;
    setOverflowHeight(offset?: number): void;
    checkOpacityAttr(val: any): void;
    checkOverflowAttr(val: any): void;
    isPanePresented(): boolean;
    swipeNextPoint: (diff: any, maxDiff: any, closest: any) => any;
    private isBackdropPresented;
    private renderBackdrop;
    /**
     * Utility function to add minified internal CSS to head.
     * @param {string} styleString
     */
    private addStyle;
    /**
     * Backdrop
     */
    backdrop(conf?: {
        show: boolean;
    }): any;
    getPanelTransformY(): number;
    /************************************
     * Public user methods
     */
    setZstackConfig(zStack: ZStackSettings): void;
    /**
     * Prevent dismiss event
     */
    preventDismiss(val?: boolean): void;
    /**
     * GrabCursor for desktop
     */
    setGrabCursor(enable: boolean, moving?: boolean): void;
    /**
     * Disable pane drag events
     */
    disableDrag(): void;
    /**
     * Enable pane drag events
     */
    enableDrag(): void;
    /**
     * Public user method to reset breakpoints
     * @param conf
     */
    setBreakpoints(conf?: PaneBreaks, bottomOffset?: number): Promise<void>;
    calcFitHeight(animated?: boolean): Promise<any>;
    moveToBreak(val: string, type?: string): Promise<true>;
    moveToHeight(val: number): Promise<any>;
    hide(): Promise<any>;
    isHidden(): (boolean | null);
    currentBreak(): (string | null);
    destroy(conf?: {
        animate: boolean;
        destroyButton?: boolean;
    }): Promise<true>;
    destroyResets(): void;
}

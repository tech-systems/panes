import { Events } from './events';
import { CupertinoSettings, PaneBreaks } from './models';
import { Breakpoints } from './breakpoints';
import { Transitions } from './transitions';
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
    private styleEl;
    private draggableEl;
    private moveEl;
    private destroyButtonEl;
    settings: CupertinoSettings;
    private device;
    events: Events;
    breakpoints: Breakpoints;
    transitions: Transitions;
    modules: {};
    eventsListeners: {};
    on: Function;
    emit: Function;
    calcFitHeight: (animated?: any) => Promise<any>;
    backdrop: (conf: {
        show: true;
    }) => void;
    setZstackConfig: (zStack: any) => void;
    constructor(selector: (string | HTMLElement), conf?: CupertinoSettings);
    private drawBaseElements;
    present(conf?: {
        animate: boolean;
        transition?: {
            duration?: number;
            from?: {};
            to?: {};
        };
    }): Promise<CupertinoPane>;
    getPaneHeight(): number;
    updateScreenHeights(): void;
    scrollElementInit(): void;
    setOverflowHeight(offset?: number): void;
    checkOpacityAttr(val: any): void;
    checkOverflowAttr(val: any): void;
    isPanePresented(): boolean;
    private prepareBreaksSwipeNextPoint;
    swipeNextPoint: (diff: any, maxDiff: any, closest: any) => any;
    /**
     * Utility function to add minified internal CSS to head.
     * @param {string} styleString
     */
    addStyle(styleString: any): void;
    private getModuleRef;
    /************************************
     * Public user methods
     */
    getPanelTransformY(): number;
    getPanelTransformX(): number;
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
    moveToBreak(val: string, type?: string): Promise<true>;
    moveToHeight(val: number): Promise<any>;
    hide(): Promise<any>;
    isHidden(): (boolean | null);
    currentBreak(): (string | null);
    destroy(conf?: {
        animate: boolean;
        destroyButton?: boolean;
        transition?: {
            duration?: number;
            from?: {};
            to?: {};
        };
    }): Promise<true>;
    destroyResets(): void;
}

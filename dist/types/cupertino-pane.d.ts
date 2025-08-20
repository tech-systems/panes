import { Device } from './device';
import { Events, KeyboardEvents, ResizeEvents } from './events';
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
    ionContent: HTMLElement;
    ionApp: HTMLElement;
    draggableEl: HTMLDivElement;
    moveEl: HTMLDivElement;
    currentTranslateY: number;
    currentTranslateX: number;
    private styleEl;
    private destroyButtonEl;
    private lastHideOnBottom?;
    private lastOverflowAuto?;
    settings: CupertinoSettings;
    device: Device;
    keyboardEvents: KeyboardEvents;
    resizeEvents: ResizeEvents;
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
    /**
     * Utility function to build transform3d string for better performance
     * @param {number} x - X translation in pixels
     * @param {number} y - Y translation in pixels
     * @param {number} z - Z translation in pixels (defaults to 0)
     */
    buildTransform3d(x?: number, y?: number, z?: number): string;
    /**
     * Utility function to build transform3d with scale for better performance
     * @param {number} x - X translation in pixels
     * @param {number} y - Y translation in pixels
     * @param {number} z - Z translation in pixels (defaults to 0)
     * @param {number} scale - Scale factor (defaults to 1)
     */
    buildTransform3dWithScale(x?: number, y?: number, z?: number, scale?: number): string;
    /**
     * Modern utility to parse transform3d values from computed style
     * Replaces WebKitCSSMatrix for better performance
     * @param {HTMLElement} element - Element to get transform from
     * @returns {object} Object with x, y, z translation values
     */
    parseTransform3d(element: HTMLElement): {
        x: number;
        y: number;
        z: number;
    };
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

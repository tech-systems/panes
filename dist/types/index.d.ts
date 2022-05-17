interface PaneBreak {
    enabled: boolean;
    height?: number;
    bounce?: boolean;
}
interface PaneBreaks {
    top?: PaneBreak;
    middle?: PaneBreak;
    bottom?: PaneBreak;
}
interface ZStackSettings {
    pushElements: string[];
    minPushHeight?: number;
    cardYOffset?: number;
    cardZScale?: number;
    cardContrast?: number;
    stackZAngle?: number;
}
interface TransitionStartEvent {
    translateY: {
        new: number;
    };
}
interface CupertinoEvents {
    onDidDismiss?: (event?: CustomEvent) => void;
    onWillDismiss?: (event?: CustomEvent) => void;
    onDidPresent?: (event?: CustomEvent) => void;
    onWillPresent?: (event?: CustomEvent) => void;
    onDragStart?: (event?: CustomEvent) => void;
    onDrag?: (event?: any) => void;
    onDragEnd?: (event?: CustomEvent) => void;
    onBackdropTap?: (event?: CustomEvent) => void;
    onTransitionStart?: (event?: TransitionStartEvent) => void;
    onTransitionEnd?: (event?: any) => void;
}
interface PaneSettings {
    initialBreak: ('top' | 'middle' | 'bottom');
    inverse: boolean;
    parentElement: any;
    followerElement: string;
    cssClass: string;
    fitHeight: boolean;
    maxFitHeight: number;
    fitScreenHeight: boolean;
    backdrop: boolean;
    backdropOpacity: number;
    animationType: string;
    animationDuration: number;
    bottomOffset: number;
    bottomClose: boolean;
    fastSwipeClose: boolean;
    fastSwipeSensivity: number;
    freeMode: boolean;
    buttonDestroy: boolean;
    buttonClose: boolean;
    topperOverflow: boolean;
    topperOverflowOffset: number;
    lowerThanBottom: boolean;
    upperThanTop: boolean;
    showDraggable: boolean;
    draggableOver: boolean;
    clickBottomOpen: boolean;
    dragBy: string[];
    preventClicks: boolean;
    handleKeyboard: boolean;
    simulateTouch: boolean;
    passiveListeners: boolean;
    touchMoveStopPropagation: boolean;
    touchAngle: number;
    breaks: PaneBreaks;
    zStack: ZStackSettings;
    events: CupertinoEvents;
}
declare type CupertinoSettings = Partial<PaneSettings>;

declare class CupertinoPane {
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

export { CupertinoPane, CupertinoSettings };

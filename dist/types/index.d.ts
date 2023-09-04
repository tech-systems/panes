declare class Device {
    ios: boolean;
    android: boolean;
    androidChrome: boolean;
    desktop: boolean;
    iphone: boolean;
    ipod: boolean;
    ipad: boolean;
    edge: boolean;
    ie: boolean;
    firefox: boolean;
    macos: boolean;
    windows: boolean;
    cordova: boolean;
    phonegap: boolean;
    electron: boolean;
    os: string;
    osVersion: string;
    webView: any;
    webview: any;
    standalone: any;
    pixelRatio: any;
    ionic: boolean;
    constructor();
}

/**
 * Touch start, Touch move, Touch end
 * Click, Scroll
 */
declare class Events {
    private instance;
    touchEvents: {
        start: string;
        move: string;
        end: string;
        cancel: string;
    };
    private allowClick;
    private disableDragAngle;
    private mouseDown;
    contentScrollTop: number;
    private startY;
    private startX;
    private steps;
    isScrolling: boolean;
    startPointOverTop: number;
    swipeNextSensivity: number;
    private settings;
    private device;
    private breakpoints;
    private transitions;
    private keyboardEvents;
    constructor(instance: CupertinoPane);
    private getTouchEvents;
    attachAllEvents(): void;
    detachAllEvents(): void;
    resetEvents(): void;
    /**
     * Core DOM elements event listeners
     * @param type
     * @param el
     */
    private eventListeners;
    /**
     * Touch Start Event
     * @param t
     */
    touchStartCb: (t: any) => void;
    private touchStart;
    /**
     * Touch Move Event
     * @param t
     */
    touchMoveCb: (t: any) => void;
    private touchMove;
    /**
     * Touch End Event
     * @param t
     */
    touchEndCb: (t: any) => void;
    private touchEnd;
    /**
     * Click Event
     * @param t
     */
    onScrollCb: (t: any) => Promise<void>;
    private onScroll;
    /**
     * Click Event
     * @param t
     */
    onClickCb: (t: any) => void;
    private onClick;
    fastSwipeNext(axis: 'Y' | 'X'): boolean;
    /**
     * Private class methods
     */
    /**
     * Superposition handler.
     * Superposition is the ability of a quantum system to be in multiple states at the same time until it is measured.
     * Topper Than Top
     * Lower Than Bottom
     * Lefter Than Left
     * Righter Than Right
     */
    private handleSuperposition;
    private getEventClientYX;
    scrollPreventDrag(t: any): boolean;
    willScrolled(): boolean;
    private isDraggableElement;
    private isFormElement;
    isElementScrollable(el: any): boolean;
}

/**
 * Resize, Keyboard show, Keyboard hide
 */
declare class KeyboardEvents {
    private instance;
    inputBluredbyMove: boolean;
    private keyboardVisibleResize;
    private inputBottomOffset;
    private previousInputBottomOffset;
    private prevNewHeight;
    private prevFocusedElement;
    private device;
    private breakpoints;
    constructor(instance: CupertinoPane);
    /**
     * Open Cordova Keyboard event
     * @param e
     */
    onKeyboardShowCb: (e: any) => Promise<void>;
    private onKeyboardShow;
    /**
     * Close Cordova Keyboard event
     * @param e
     */
    onKeyboardWillHideCb: (e: any) => void;
    private onKeyboardWillHide;
    /**
     * Window resize event
     * We handle here keyboard event as well
     * @param e
     */
    onWindowResizeCb: (e: any) => Promise<void>;
    private onWindowResize;
    /**
     * Private class methods
     */
    private isPaneDescendant;
    private isFormElement;
    private isOnViewport;
    /**
     * Deal with Ionic Framework.
     * ion-input, ion-textarea changes in Client rects after window resize.
     * get rects by parent, not shadowDom el
     */
    private getActiveInputClientBottomRect;
    /**
     * Using only to fix follower elemennts jumps out by OSK
     * Fix OSK
     * https://developer.chrome.com/blog/viewport-resize-behavior/
     * Chrome 108+ will adjust with overlays-content
     * When everyones updates, can be replaced with adding content-overlays to meta
     */
    fixBodyKeyboardResize(showKeyboard: any): void;
}

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
    cardBorderRadius: number;
    cardYOffset?: number;
    cardZScale?: number;
    cardContrast?: number;
    stackZAngle?: number;
}
interface ModalSettings {
    transition?: 'fade' | 'zoom';
    flying?: boolean;
    dismissOnIntense?: boolean;
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
    horizontal: boolean;
    horizontalOffset: number;
    inverse: boolean;
    parentElement: string | HTMLElement;
    followerElement: string;
    cssClass: string;
    fitHeight: boolean;
    maxFitHeight: number;
    fitScreenHeight: boolean;
    ionContentScroll: boolean;
    backdrop: boolean;
    backdropBlur: boolean;
    backdropOpacity: number;
    animationType: string;
    animationDuration: number;
    bottomOffset: number;
    bottomClose: boolean;
    fastSwipeClose: boolean;
    fastSwipeSensivity: number;
    freeMode: boolean;
    buttonDestroy: boolean;
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
    modal: ModalSettings | boolean;
    zStack: ZStackSettings;
    events: CupertinoEvents;
    modules: any[];
}
type CupertinoSettings = Partial<PaneSettings>;

/**
 * Breakpoints builder
 */
declare class Breakpoints {
    private instance;
    topper: number;
    bottomer: number;
    breaks: {};
    lockedBreakpoints: any;
    currentBreakpoint: number;
    prevBreakpoint: string;
    brs: number[];
    beforeBuildBreakpoints: () => any;
    conf: PaneBreaks;
    private defaultBreaksConf;
    private settings;
    constructor(instance: CupertinoPane);
    /**
     * Function builder for breakpoints and heights
     * @param conf breakpoints
     */
    buildBreakpoints(conf?: PaneBreaks, bottomOffset?: number, animated?: boolean): Promise<void>;
    getCurrentBreakName(): (string | null);
    getClosestBreakY(): number;
}

declare class Transitions {
    private instance;
    isPaneHidden: boolean;
    private settings;
    private breakpoints;
    constructor(instance: CupertinoPane);
    /***********************************
    * Transitions handler
    */
    doTransition(params?: any): Promise<true>;
    private setPaneElTransform;
    buildTransitionValue(bounce: boolean, duration?: number): string;
    /**
     * Private class methods
     */
    private doesPanesExists;
}

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
    ionContent: HTMLElement;
    ionApp: HTMLElement;
    draggableEl: HTMLDivElement;
    moveEl: HTMLDivElement;
    private styleEl;
    private destroyButtonEl;
    settings: CupertinoSettings;
    device: Device;
    keyboardEvents: KeyboardEvents;
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

export { CupertinoPane, CupertinoSettings };

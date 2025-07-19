import { CupertinoPane } from '../cupertino-pane';
/**
 * Touch start, Touch move, Touch end
 * Click, Scroll
 */
export declare class Events {
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
    private rafId;
    private pendingMoveData;
    private settings;
    private device;
    private breakpoints;
    private transitions;
    private keyboardEvents;
    private resizeEvents;
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
     * Apply the pending move update in animation frame for smoother performance
     */
    private applyMoveUpdate;
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

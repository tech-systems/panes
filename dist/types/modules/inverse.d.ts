import { CupertinoPane } from '../cupertino-pane';
/**
 * Inverse module
 */
export declare class InverseModule {
    private instance;
    private breakpoints;
    private settings;
    private events;
    constructor(instance: CupertinoPane);
    getPaneHeight(): number;
    updateScreenHeights(): void;
    setOverflowHeight(): void;
    checkOverflowAttr(val: any): void;
    private prepareBreaksSwipeNextPoint;
    /**
     * Topper Than Top
     * Lower Than Bottom
     * Otherwise don't changes
     */
    private handleSuperposition;
    scrollPreventDrag(t: any): boolean;
    private isOverflowEl;
    private onScroll;
    /**
     * Override setPaneElTransform to block X movement in inverse mode
     * Inverse panes should only move vertically (Y-axis)
     */
    setPaneElTransform(params: any): void;
    /**
     * Override fastSwipeNext for inverse mode
     * Need to detect fast swipe but pass inverted diff to swipeNextPoint
     */
    fastSwipeNext(axis: 'Y' | 'X'): boolean;
    /**
     * Override swipeNextPoint for inverse coordinate system
     * In inverse mode, we need to handle the direction properly
     */
    swipeNextPoint(diff: number, maxDiff: number, closest: number): number;
    private beforeBuildBreakpoints;
}

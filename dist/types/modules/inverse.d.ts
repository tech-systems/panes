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
    private handleTopperLowerPositions;
    scrollPreventDrag(t: any): boolean;
    private isOverflowEl;
    private onScroll;
}

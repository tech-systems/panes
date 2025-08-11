import { CupertinoPane } from '../cupertino-pane';
/**
 * Horizontal module
 */
export declare class HorizontalModule {
    private instance;
    private static readonly forceSettings;
    static CollectSettings(settings: any): any;
    private defaultRect;
    private horizontalBreaks;
    private currentBreakpoint;
    private fastSwipeNext;
    private initialBreakX;
    private initialBreakY;
    private settings;
    private transitions;
    private events;
    constructor(instance: CupertinoPane);
    private parseInitialBreak;
    private calcHorizontalBreaks;
    private overrideInitialPositioning;
    setPaneElTransform(params: any): void;
    private getClosestBreakX;
    moveToHorizontalBreak(breakX: 'left' | 'right'): void;
    getCurrentHorizontalBreak(): 'left' | 'right';
    moveToWidth(translateX: number, translateY: number): Promise<any>;
}

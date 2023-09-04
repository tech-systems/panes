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
    private settings;
    private transitions;
    private events;
    constructor(instance: CupertinoPane);
    private calcHorizontalBreaks;
    setPaneElTransform(params: any): void;
    private getClosestBreakX;
}

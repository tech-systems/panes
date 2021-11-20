import { CupertinoPane } from './cupertino-pane';
import { PaneBreaks, CupertinoSettings } from './models';
/**
 * Breakpoints builder
 */
export declare class Breakpoints {
    private instance;
    private settings;
    topper: number;
    bottomer: number;
    breaks: {};
    lockedBreakpoints: any;
    currentBreakpoint: number;
    prevBreakpoint: string;
    calcHeightInProcess: boolean;
    brs: number[];
    private defaultBreaksConf;
    constructor(instance: CupertinoPane, settings: CupertinoSettings);
    /**
     * Function builder for breakpoints and heights
     * @param conf breakpoints
     */
    buildBreakpoints(conf?: PaneBreaks, bottomOffset?: number): Promise<void>;
    getCurrentBreakName(): (string | null);
    /**
     * Private class methods
     */
    private getPaneFitHeight;
    getClosestBreakY(): number;
}

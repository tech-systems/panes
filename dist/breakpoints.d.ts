import { CupertinoPane, CupertinoSettings } from 'cupertino-pane';
import { PaneBreaks } from './models';
/**
 * Breakpoints builde
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
    brs: number[];
    private defaultBreaksConf;
    constructor(instance: CupertinoPane, settings: CupertinoSettings);
    /**
     * Function builder for breakpoints and heights
     * @param conf breakpoints
     */
    buildBreakpoints(conf?: PaneBreaks, lock?: boolean): Promise<void>;
    getCurrentBreakName(): (string | null);
    /**
     * Private class methods
     */
    private getPaneFitHeight;
    getClosestBreakY(): number;
}

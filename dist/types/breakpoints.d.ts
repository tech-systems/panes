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
    brs: number[];
    beforeBuildBreakpoints: () => any;
    conf: PaneBreaks;
    private defaultBreaksConf;
    constructor(instance: CupertinoPane, settings: CupertinoSettings);
    /**
     * Function builder for breakpoints and heights
     * @param conf breakpoints
     */
    buildBreakpoints(conf?: PaneBreaks, bottomOffset?: number, animated?: boolean): Promise<void>;
    getCurrentBreakName(): (string | null);
    getClosestBreakY(): number;
}

import { CupertinoPane } from './cupertino-pane';
import { PaneBreaks } from './models';
/**
 * Breakpoints builder
 */
export declare class Breakpoints {
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

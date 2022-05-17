import { CupertinoPane } from './cupertino-pane';
import { CupertinoSettings } from './models';
import { Breakpoints } from './breakpoints';
/**
 * Transitions class
 * Z-Push transitions class
 */
export declare enum CupertinoTransition {
    Present = "present",
    Destroy = "destroy",
    Move = "move",
    Breakpoint = "breakpoint",
    Hide = "hide",
    TouchEnd = "end"
}
export declare class Transitions {
    private instance;
    private settings;
    private breakpoints;
    isPaneHidden: boolean;
    constructor(instance: CupertinoPane, settings: CupertinoSettings, breakpoints: Breakpoints);
    /***********************************
    * Transitions handler
    */
    doTransition(params?: any): Promise<true>;
    buildTransitionValue(bounce: boolean): string;
}

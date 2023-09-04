import { CupertinoPane } from './cupertino-pane';
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
    isPaneHidden: boolean;
    private settings;
    private breakpoints;
    constructor(instance: CupertinoPane);
    /***********************************
    * Transitions handler
    */
    doTransition(params?: any): Promise<true>;
    private setPaneElTransform;
    buildTransitionValue(bounce: boolean, duration?: number): string;
    /**
     * Private class methods
     */
    private doesPanesExists;
}

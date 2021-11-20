import { CupertinoPane } from './cupertino-pane';
import { CupertinoSettings } from './models';
import { Breakpoints } from './breakpoints';
import { ZStack } from './z-stack';
/**
 * Transitions class
 * Z-Push transitions class
 */
export declare class Transitions {
    private instance;
    private settings;
    private breakpoints;
    private zStack;
    constructor(instance: CupertinoPane, settings: CupertinoSettings, breakpoints: Breakpoints, zStack: ZStack);
    /***********************************
    * Transitions handler
    */
    doTransition(params?: any): Promise<true>;
    buildTransitionValue(bounce: boolean): string;
}

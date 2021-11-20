import { CupertinoPane } from './cupertino-pane';
import { CupertinoSettings, ZStackSettings } from './models';
import { Breakpoints } from './breakpoints';
/**
 * Z-Stack functions and transitions
 */
export declare class ZStack {
    private instance;
    private settings;
    private breakpoints;
    zStackDefaults: ZStackSettings;
    constructor(instance: CupertinoPane, settings: CupertinoSettings, breakpoints: Breakpoints);
    /**
     * Z-Stack push transitions
     * @param pushElement - element be pushed
     * @param newPaneY - translateY of new pane
     * @param transition - transition style
     * @returns
     */
    pushTransition(pushElement: HTMLElement, newPaneY: number, transition: string): void;
    setPushMultiplicators(): void;
    setZstackConfig(zStack: ZStackSettings): void;
    /**
     * Private class methods
     */
    private getPushMulitplicator;
    private clearPushMultiplicators;
}

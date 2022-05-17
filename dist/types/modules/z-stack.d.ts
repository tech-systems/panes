import { CupertinoPane } from '../cupertino-pane';
import { ZStackSettings } from '../models';
/**
 * Z-Stack Module
 */
export declare class ZStackModule {
    private instance;
    zStackDefaults: ZStackSettings;
    private settings;
    private breakpoints;
    constructor(instance: CupertinoPane);
    /**
     * Change z-stack configuration on the way
     */
    setZstackConfig(zStack: ZStackSettings): void;
    /**
     * Z-Stack push transitions
     * @param pushElement - element be pushed
     * @param newPaneY - translateY of new pane
     * @param transition - transition style
     * @returns
     */
    pushTransition(pushElement: HTMLElement, newPaneY: number, transition: string): void;
    setPushMultiplicators(): void;
    /**
     * Private class methods
     */
    private getPushMulitplicator;
    private clearPushMultiplicators;
}

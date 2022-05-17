import { CupertinoPane } from '../cupertino-pane';
/**
 * Backdrop module
 */
export declare class BackdropModule {
    private instance;
    backdropEl: HTMLDivElement;
    private settings;
    private events;
    constructor(instance: CupertinoPane);
    /**
     * Show/Hide backdrop primary function
     */
    private backdrop;
    /**
     * Private class methods
     */
    private renderBackdrop;
    private isBackdropPresented;
    /**
     * Touch Move Event
     * @param t
     */
    touchMoveBackdropCb: (t: any) => void;
    private touchMoveBackdrop;
}

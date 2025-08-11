import { CupertinoPane } from '../cupertino-pane';
/**
 * Window resize, Orientation change
 */
export declare class ResizeEvents {
    private instance;
    private device;
    private breakpoints;
    private rafId;
    constructor(instance: CupertinoPane);
    /**
     * Window resize event handler
     * Handles orientation changes and window resize
     * @param e
     */
    onWindowResizeCb: (e: any) => Promise<void>;
    private onWindowResize;
    /**
     * Check if element is a form element
     * Shared utility method for form element detection
     */
    isFormElement(el: any): boolean;
}

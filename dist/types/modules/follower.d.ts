import { CupertinoPane } from '../cupertino-pane';
/**
 * Follower Element module
 */
export declare class FollowerModule {
    private instance;
    private followerEl;
    private settings;
    private breakpoints;
    private transitions;
    constructor(instance: CupertinoPane);
    /**
     * Using only to fix follower elemennts jumps out by OSK
     * Fix OSK
     * https://developer.chrome.com/blog/viewport-resize-behavior/
     * Chrome 108+ will adjust with overlays-content
     * When everyones updates, can be replaced with adding content-overlays to meta
     */
    fixBodyKeyboardResize(showKeyboard: any): void;
}

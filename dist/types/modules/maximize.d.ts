import { CupertinoPane } from '../cupertino-pane';
/**
 * Maximize module
 * Provides maximize/minimize functionality for desktop and mobile
 */
export declare class MaximizeModule {
    private instance;
    private static readonly forceSettings;
    static CollectSettings(settings: any): any;
    private isDesktopMaximized;
    private isMobileMaximized;
    private isAnimating;
    private originalMobileDimensions;
    private settings;
    constructor(instance: CupertinoPane);
    private addMaximizeStyles;
    private isMobile;
    private shouldEnableHorizontal;
    maximize(enable: boolean): void;
    toggleMaximize(): void;
    private toggleMobileMaximize;
    private toggleDesktopMaximize;
    private handleWindowResize;
    getMaximizedState(): {
        maximized: boolean;
        mobile: boolean;
    };
}

import { CupertinoPane } from '../cupertino-pane';
/**
 * FitHeight module
 * fitHeight / fitScreenHeight / maxFitHeight
 */
export declare class FitHeightModule {
    private instance;
    calcHeightInProcess: boolean;
    private breakpoints;
    private settings;
    private contentElHeight;
    constructor(instance: CupertinoPane);
    /**
     * fitHeight overflow-content el is with height:unset;
     * fitHeight we base on pane height as static for smooth transition on calcFitHeight()
     * and we should set height for overflow element, or it give a wrong calculations
     */
    setOverflowHeight(): void;
    private beforeBuildBreakpoints;
    calcFitHeight(animated?: boolean): Promise<any>;
    private getPaneFitHeight;
}

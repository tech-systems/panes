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
    constructor(instance: CupertinoPane);
    private beforeBuildBreakpoints;
    private calcFitHeight;
    private getPaneFitHeight;
}

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
    private paneElHeight;
    constructor(instance: CupertinoPane);
    private beforeBuildBreakpoints;
    calcFitHeight(animated?: boolean): Promise<any>;
    private getPaneFitHeight;
}

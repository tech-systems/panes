import { CupertinoPane } from '../cupertino-pane';
import { ModalSettings } from '../models';
/**
 * Modal module
 */
export declare class ModalModule {
    private instance;
    private static readonly BuildInTransition;
    private static readonly ForceSettings;
    static CollectSettings(settings: any): any;
    modalDefaults: ModalSettings;
    private settings;
    private events;
    private breakpoints;
    private transitions;
    constructor(instance: CupertinoPane);
    setPaneElTransform(params: any): void;
    /**
     * Private class methods
     */
    private present;
    private destroy;
    private handleSuperposition;
}

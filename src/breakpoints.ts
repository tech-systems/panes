import { CupertinoPane } from './cupertino-pane';
import { PaneBreaks, CupertinoSettings } from './models';

/**
 * Breakpoints builder
 */

export class Breakpoints {

  public topper: number;
  public bottomer: number;
  public breaks: {} = {}
  public lockedBreakpoints: any;
  public currentBreakpoint: number;
  public prevBreakpoint: string;
  public brs: number[] = [];
  public beforeBuildBreakpoints:() => any = () => {};
  public conf: PaneBreaks;
  private defaultBreaksConf: PaneBreaks = {
    top: { enabled: true, height: window.innerHeight - (135 * 0.35) },
    middle: { enabled: true, height: 300 },
    bottom: { enabled: true, height: 100 },
  };

  private settings: CupertinoSettings;
  constructor(private instance: CupertinoPane) {
    this.settings = this.instance.settings;
  }

  /**
   * Function builder for breakpoints and heights
   * @param conf breakpoints
   */  
  public async buildBreakpoints(conf?: PaneBreaks, bottomOffset: number = 0, animated: boolean = true) {
    this.breaks = {};
    this.conf = conf;
    this.settings.bottomOffset = bottomOffset || this.settings.bottomOffset;

    // Async hook for modules injections
    await this.beforeBuildBreakpoints();

    ['top', 'middle', 'bottom'].forEach((val) => {
      // Set default if no exist
      if (!this.settings.breaks[val]) {
        this.settings.breaks[val] = this.defaultBreaksConf[val];
      }

      // Override from user conf on updating
      if (this.conf && this.conf[val]) {
        this.settings.breaks[val] = this.conf[val];
      }

      // System event
      this.instance.emit('beforeBreakHeightApplied', {break: val});

      // Apply initial breaks
      if (this.settings.breaks[val]?.enabled) {
        this.breaks[val] = this.breaks[val] || this.instance.screenHeightOffset;
        this.breaks[val] -= this.settings.bottomOffset;
        this.breaks[val] -= this.settings.breaks[val].height;
      }
    });

    // initial lock on present
    if (!this.lockedBreakpoints) {
      this.lockedBreakpoints = JSON.stringify(this.settings.breaks);
    }
    
    // Warnings
    if (!this.instance.isPanePresented()) {
      if (!this.settings.breaks[this.settings.initialBreak].enabled) {
        console.warn('Cupertino Pane: Please set initialBreak for enabled breakpoint');
      }
    }
    if (this.settings.breaks['middle'].height >= this.settings.breaks['top'].height) {
      console.warn('Cupertino Pane: Please set middle height lower than top height');
    }
    if (this.settings.breaks['middle'].height <= this.settings.breaks['bottom'].height) {
      console.warn('Cupertino Pane: Please set bottom height lower than middle height');
    }

    // Prepare breakpoint numbers array
    // TODO: this.brs to this.breaks.map()
    this.brs = [];
    ['top', 'middle', 'bottom'].forEach((val) => {
      if (this.settings.breaks[val].enabled) {
        this.brs.push(this.breaks[val]);
      }
    });

    // Determinate topper point
    this.topper = this.brs.reduce((prev, curr) => {
      return (curr < prev ? curr : prev);
    });
    // Determinate bottomer point
    this.bottomer = this.brs.reduce((prev, curr) => {
      return (Math.abs(curr) > Math.abs(prev) ? curr : prev);
    });

    if (!this.instance.isPanePresented()) {
      this.currentBreakpoint = this.breaks[this.settings.initialBreak];
    }

    if (this.instance.isPanePresented()) {
      // Move to current if updated
      if (this.settings.breaks[this.prevBreakpoint]?.enabled) {
        if (!this.instance.isHidden()) {
          // Move to any if removed
          this.instance.moveToBreak(
            this.prevBreakpoint,
            animated ? 'breakpoint' : 'move'
          );
        }
      }

      if (!this.settings.breaks[this.prevBreakpoint]?.enabled) {
        if (!this.instance.isHidden()) {
          let nextY = this.instance.swipeNextPoint(1, 1, this.getClosestBreakY());
          const nextBreak = Object.entries(this.breaks).find(val => val[1] === nextY);
          this.instance.moveToBreak(nextBreak[0]);
        }
      }
    }

    // Re-calc heights and scrolls
    this.instance.scrollElementInit();

    // Checks
    this.instance.checkOpacityAttr(this.currentBreakpoint);
    this.instance.checkOverflowAttr(this.currentBreakpoint);

    // System event
    this.instance.emit('buildBreakpointsCompleted');
  }

  // TODO: Replace currentBreakpoint with prevBreakpoint if possible
  public getCurrentBreakName(): (string|null) {
    if (this.breaks['top'] === this.currentBreakpoint) return 'top';
    if (this.breaks['middle'] === this.currentBreakpoint) return 'middle';
    if (this.breaks['bottom'] === this.currentBreakpoint) return 'bottom';
    return null;
  }

  public getClosestBreakY(): number {
    return this.brs.reduce((prev, curr) => {
      return (Math.abs(curr - this.instance.getPanelTransformY()) < Math.abs(prev - this.instance.getPanelTransformY()) ? curr : prev);
    });
  }
}

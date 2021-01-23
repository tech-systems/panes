import { CupertinoPane, CupertinoSettings } from './cupertino-pane';
import { PaneBreaks } from './models';

/**
 * Breakpoints builde
 */

export class Breakpoints {

  public topper: number;
  public bottomer: number;
  public breaks: {} = {}
  public lockedBreakpoints: any;
  public currentBreakpoint: number;
  public prevBreakpoint: string;
  public calcHeightInProcess: boolean = false;
  public brs: number[] = [];
  private defaultBreaksConf: PaneBreaks = {
    top: { enabled: true, height: window.innerHeight - (135 * 0.35) },
    middle: { enabled: true, height: 300 },
    bottom: { enabled: true, height: 100 },
  };

  constructor(private instance: CupertinoPane, 
              private settings: CupertinoSettings) {
  }

  /**
   * Function builder for breakpoints and heights
   * @param conf breakpoints
   */  
  public async buildBreakpoints(conf?: PaneBreaks, lock: boolean = true) {
    this.breaks = {
      top: this.instance.screenHeightOffset,
      middle: this.instance.screenHeightOffset,
      bottom: this.instance.screenHeightOffset
    };

    // Fit Height & Bulletin cases
    if (this.settings.fitHeight) {
      this.settings.fitScreenHeight = false;
      this.settings.initialBreak = 'top';
      this.settings.topperOverflow = false;
      let height = await this.getPaneFitHeight();
      
      // maxFitHeight
      if (this.settings.maxFitHeight 
        && height > this.settings.maxFitHeight) {
          height = this.settings.maxFitHeight;
          this.settings.topperOverflow = true;
      }

      conf = {
        top: { enabled: true, height },
        middle: { enabled: false},
        bottom: { enabled: false}
      };
    }

    ['top', 'middle', 'bottom'].forEach((val) => {
      // bottom offset for bulletins
      this.breaks[val] -= this.settings.bottomOffset;

      // Set default if no exist
      if (!this.settings.breaks[val]) {
        this.settings.breaks[val] = this.defaultBreaksConf[val];
      }

      // Override from user conf on updating
      if (conf && conf[val]) {
        this.settings.breaks[val] = conf[val];
      }

      // fitScreenHeight (breaks styles fit screen)
      if (this.settings.fitScreenHeight) {
        if (this.settings.breaks[val]?.height > this.instance.screen_height) { 
          this.settings.breaks[val].height = this.instance.screen_height - this.settings.bottomOffset;
        }
        if (this.settings.breaks['top']?.height === this.settings.breaks['middle']?.height) {
          this.settings.breaks['middle'].enabled = false;
          this.settings.initialBreak = 'top';
        }
      }

      // fitHeight (bullet-in styles fir screen)
      if (this.settings.fitHeight && val === 'top') {
        if (this.settings.breaks[val].height > this.instance.screen_height) {
          this.settings.breaks[val].height = this.instance.screen_height - (this.settings.bottomOffset * 2);
          this.settings.topperOverflow = true;
        } else {
          if (this.instance.overflowEl && !this.settings.maxFitHeight) {
            this.settings.topperOverflow = false;
            this.instance.overflowEl.style.overflowY = 'hidden';
          }
        }
      }

      // Assign heights
      if (this.settings.breaks[val]
          && this.settings.breaks[val].enabled
          && this.settings.breaks[val].height) {
            if (!this.settings.inverse) {
              this.breaks[val] -= this.settings.breaks[val].height;
            } else {
              this.breaks[val] = this.settings.breaks[val].height;
            }
      }
    });

    // Save breakpoints (not for resize event)
    // TODO: solve immutable issue: 1.Weak set 2. Use In events.ts
    if (lock) {
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
        this.instance.moveToBreak(this.prevBreakpoint);
      }

      // Move to any if removed
      if (!this.settings.breaks[this.prevBreakpoint]?.enabled) {
        let nextY = this.instance.swipeNextPoint(1, 1, this.getClosestBreakY());
        const nextBreak = Object.entries(this.breaks).find(val => val[1] === nextY);
        this.instance.moveToBreak(nextBreak[0]);
      }

      // Re-calc height and top
      this.instance.paneEl.style.top = this.settings.inverse ? `-${this.bottomer}px` : `unset`;
      this.instance.paneEl.style.height = `${this.instance.getPaneHeight()}px`;
      
      this.instance.scrollElementInit();
      this.instance.checkOpacityAttr(this.currentBreakpoint);
      this.instance.checkOverflowAttr(this.currentBreakpoint);
    }
  }

  public getCurrentBreakName(): (string|null) {
    if (this.breaks['top'] === this.currentBreakpoint) return 'top';
    if (this.breaks['middle'] === this.currentBreakpoint) return 'middle';
    if (this.breaks['bottom'] === this.currentBreakpoint) return 'bottom';
    return null;
  }

  /**
   * Private class methods
   */
  private async getPaneFitHeight(): Promise<number> {
    this.calcHeightInProcess = true;
    let images: NodeListOf<HTMLImageElement> = this.instance.el.querySelectorAll('img'); 
    let height: number;

    // Make element visible to calculate height
    this.instance.el.style.height = 'unset';
    
    if (!this.instance.rendered) {
      this.instance.el.style.visibility = 'hidden';
      this.instance.el.style.pointerEvents = 'none';
      this.instance.el.style.display = 'block';
      this.instance.wrapperEl.style.visibility = 'hidden';
      this.instance.wrapperEl.style.pointerEvents = 'none';
      this.instance.wrapperEl.style.display = 'block';
    }

    let promises = [];

    if (images.length) {
      // Bulletins with image height we get after image render
      promises = Array.from(images).map(
        (image) => new Promise((resolve) => {
          // Already rendered
          if (image.complete && image.naturalHeight) {
            resolve(true)
          } else {
            image.onload = () => resolve(true)
          }
        })
      );
    } 

    // resized timeouts - 0, render - 150
    promises.push(
      new Promise((resolve) => 
        setTimeout(() => resolve(true), this.instance.rendered ? 0 : 150)
      )
    );
    await Promise.all(promises);

    // height include margins
    let elmHeight = parseInt(document.defaultView.getComputedStyle(this.instance.el, '').getPropertyValue('height'));
    let elmMargin = parseInt(document.defaultView.getComputedStyle(this.instance.el, '').getPropertyValue('margin-top')) + parseInt(document.defaultView.getComputedStyle(this.instance.el, '').getPropertyValue('margin-bottom'));
    height = elmHeight + elmMargin
    height += this.instance.el.offsetTop;

    // Hide elements back
    if (!this.instance.rendered) {
      this.instance.el.style.visibility = 'unset';
      this.instance.el.style.pointerEvents = 'unset';
      this.instance.el.style.display = 'none';
      this.instance.wrapperEl.style.visibility = 'unset';
      this.instance.wrapperEl.style.pointerEvents = 'unset';
      this.instance.wrapperEl.style.display = 'none';
    }

    this.calcHeightInProcess = false;
    return height;
  }

  public getClosestBreakY(): number {
    return this.brs.reduce((prev, curr) => {
      return (Math.abs(curr - this.instance.getPanelTransformY()) < Math.abs(prev - this.instance.getPanelTransformY()) ? curr : prev);
    });
  }
}

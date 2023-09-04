import { CupertinoPane } from '../cupertino-pane';
import { Breakpoints } from '../breakpoints';
import { CupertinoSettings } from '../models';

/**
 * FitHeight module
 * fitHeight / fitScreenHeight / maxFitHeight
 */

export class FitHeightModule {
  
  public calcHeightInProcess: boolean = false;
  private breakpoints: Breakpoints;
  private settings: CupertinoSettings;
  private paneElHeight: number;

  constructor(private instance: CupertinoPane) {
    this.breakpoints = this.instance.breakpoints;
    this.settings = this.instance.settings;

    if (!this.settings.fitHeight) {
      return;
    }

    // bind to primary instance
    // TODO: change binding strategy according to TypeScript
    // E.G. Using public module methods from modules
    this.instance['calcFitHeight'] = async(animated) => this.calcFitHeight(animated);
    this.instance['setOverflowHeight'] = () => {};

    // Class to wrapper
    this.instance.on('DOMElementsReady', () => {
      this.instance.wrapperEl.classList.add('fit-height');
    });

    this.instance.on('onDidPresent', () => {
      this.instance.paneEl.style.height = `unset`;
    });

    this.instance.on('onTransitionEnd', () => {
      this.instance.paneEl.style.height = `unset`;
    });

    // Pass our code into function buildBreakpoints()
    this.instance.on('onWillPresent', () => {
      this.breakpoints.beforeBuildBreakpoints = () => this.beforeBuildBreakpoints();
    });

    // buildBreakpoints() function hook
    this.instance.on('beforeBreakHeightApplied', (ev) => {
      // fitScreenHeight (breaks styles fit screen)
      if (this.settings.fitScreenHeight) {
        if (this.settings.breaks[ev.break]?.height > this.instance.screen_height) { 
          this.settings.breaks[ev.break].height = this.instance.screen_height - this.settings.bottomOffset;
        }

        // Merge breakpoints if not much difference
        if (this.settings.breaks['top'] && this.settings.breaks['middle']) {
          if (this.settings.breaks['top'].height - 50 <= this.settings.breaks['middle'].height) {
            this.settings.breaks['middle'].enabled = false;
            this.settings.initialBreak = 'top';
          }
        }
      }

      // fitHeight (bullet-in styles for screen)
      if (ev.break === 'top') {
        if (this.settings.breaks['top'].height > this.instance.screen_height) {
          this.settings.breaks['top'].height = this.instance.screen_height - (this.settings.bottomOffset * 2);
          this.settings.topperOverflow = true;
          this.settings.upperThanTop = false;
        } else {
          if (this.instance.overflowEl && !this.settings.maxFitHeight) {
            this.settings.topperOverflow = false;
            this.instance.overflowEl.style.overflowY = 'hidden';
          }
        }
      }
    }, true);
  }

  private async beforeBuildBreakpoints(): Promise<void> {
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

    this.breakpoints.conf = {
      top: { enabled: true, height },
      middle: { enabled: false }
    };
    this.breakpoints.conf.top.bounce = this.settings.breaks?.top?.bounce;
    this.breakpoints.conf.bottom = this.settings.breaks?.bottom || { enabled: true, height: 0 };
  }

  public async calcFitHeight(animated: boolean = true) {
    // Allow user to call method asap, dont check with this.isPanePresented()
    if (!this.instance.wrapperEl || !this.instance.el) {
      return null;
    }
    
    if (this.calcHeightInProcess) {
      console.warn(`Cupertino Pane: calcFitHeight() already in process`);
      return null;
    }

    await this.breakpoints.buildBreakpoints(this.breakpoints.lockedBreakpoints, null, animated);
  }

  private async getPaneFitHeight(): Promise<number> {
    this.calcHeightInProcess = true;
    let images: NodeListOf<HTMLImageElement> = this.instance.el.querySelectorAll('img'); 

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

    // Bulletins with image height we get after images render
    let promises = [];
    if (images.length) {
      promises = Array.from(images).map(
        (image) => new Promise((resolve) => {
          // Already rendered or passed height attr
          if (image.height 
              || (image.complete && image.naturalHeight)) {
            return resolve(true);
          }

          image.onload = () => resolve(true);
          image.onerror = () => resolve(true);
        })
      );
    }
    await Promise.all(promises);
    await new Promise(resolve => requestAnimationFrame(resolve));

    let newPaneElHeight = Math.floor(this.instance.paneEl.getBoundingClientRect().height);

    /**
     * To prevent raggy transition on pane icrease/decrease, 
     * we set height before animation transition,
     * and afrer transition we release height to be 'unset'
     * for proper calculations in further. 
     * 
     * Only for changes in pane height, 
     * to release `height` on 'onTransitionEnd'. 
     */

    if (this.paneElHeight !== newPaneElHeight) {
      this.instance.paneEl.style.height = `${(newPaneElHeight <= this.paneElHeight) ? this.paneElHeight : newPaneElHeight}px`; 
    }

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
    
    this.paneElHeight = newPaneElHeight;
    return this.paneElHeight;
  }
}

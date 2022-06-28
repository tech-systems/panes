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

  constructor(private instance: CupertinoPane) {
    this.breakpoints = this.instance.breakpoints;
    this.settings = this.instance.settings;

    if (!this.settings.fitHeight) {
      return;
    }

    // bind to primary instance
    this.instance['calcFitHeight'] = async(animated) => this.calcFitHeight(animated);

    // Class to wrapper
    this.instance.on('DOMElementsReady', () => {
      this.instance.wrapperEl.classList.add('fit-height');
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
      if (this.settings.fitHeight && ev.break === 'top') {
        if (this.settings.breaks['top'].height > this.instance.screen_height) {
          this.settings.breaks['top'].height = this.instance.screen_height - (this.settings.bottomOffset * 2);
          this.settings.topperOverflow = true;
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

  private async calcFitHeight(animated: boolean = true) {
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
          image.onload = () => resolve(true);
          image.onerror = () => resolve(true);
          // Already rendered
          if (image.complete && image.naturalHeight) {
            resolve(true);
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
    let panePaddingBottom = parseInt(document.defaultView.getComputedStyle(this.instance.el.parentElement, '').getPropertyValue('padding-bottom'));
    height = elmHeight + elmMargin
    height += this.instance.el.offsetTop; // From top to element
    height += panePaddingBottom; // From element to bottom

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
}

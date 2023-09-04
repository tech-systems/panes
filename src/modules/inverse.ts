import { CupertinoPane } from '../cupertino-pane';
import { Breakpoints } from '../breakpoints';
import { CupertinoSettings } from '../models';
import { Events } from '../events/events';

/**
 * Inverse module
 */

export class InverseModule {


  private breakpoints: Breakpoints;
  private settings: CupertinoSettings;
  private events: Events;
  constructor(private instance: CupertinoPane) {
    this.breakpoints = this.instance.breakpoints;
    this.settings = this.instance.settings;
    this.events = this.instance.events;

    if (!this.settings.inverse) {
      return;
    }

    // Forcely remove
    this.settings.buttonDestroy = false;

    // re-bind functions
    this.instance['getPaneHeight'] = () => this.getPaneHeight();
    this.instance['updateScreenHeights'] = () => this.updateScreenHeights();
    this.instance['setOverflowHeight'] = () => this.settings.fitHeight ? {} : this.setOverflowHeight();
    this.instance['checkOpacityAttr'] = () => {};
    this.instance['checkOverflowAttr'] = (val) => this.checkOverflowAttr(val);
    this.instance['prepareBreaksSwipeNextPoint'] = () => this.prepareBreaksSwipeNextPoint();
    // re-bind events functions
    this.events['handleSuperposition'] = (coords) => this.handleSuperposition(coords);
    this.events['scrollPreventDrag'] = (t) => this.scrollPreventDrag(t);
    this.events['onScroll'] = () => this.onScroll();

    // Class to wrapper
    this.instance.on('DOMElementsReady', () => {
      this.instance.wrapperEl.classList.add('inverse');
    });

    // Styles to elements
    this.instance.on('rendered', () => {
      this.instance.addStyle(`
        .cupertino-pane-wrapper.inverse .pane {
          border-radius: 0 0 20px 20px;
          border-radius: 0 0
                        var(--cupertino-pane-border-radius, 20px) 
                        var(--cupertino-pane-border-radius, 20px);
        }
        .cupertino-pane-wrapper.inverse:not(.fit-height) .pane {
          padding-bottom: 15px; 
        }
        .cupertino-pane-wrapper.inverse .draggable {
          bottom: 0;
          top: initial;
        }
        .cupertino-pane-wrapper.inverse .draggable.over {
          bottom: -30px;
          top: initial;
        }
        .cupertino-pane-wrapper.inverse .move {
          margin-top: 15px;
        }
        .cupertino-pane-wrapper.inverse .draggable.over .move {
          margin-top: -5px;
        }
      `);
    });

    this.instance.on('beforeBreakHeightApplied', (ev) => {
      if (this.settings.breaks[ev.break]?.enabled) {
        this.breakpoints.breaks[ev.break] = 2 * (this.settings.breaks[ev.break].height + this.settings.bottomOffset);
      }
    }, false);

    this.instance.on('buildBreakpointsCompleted', () => {
      this.breakpoints.topper = this.breakpoints.bottomer;

      // Re-calc top after setBreakpoints();
      this.instance.paneEl.style.top = `-${this.breakpoints.bottomer - this.settings.bottomOffset}px`;
    });
  }

  public getPaneHeight(): number {
    return this.breakpoints.bottomer - this.settings.bottomOffset;
  }

  public updateScreenHeights():void {
    this.instance.screen_height = window.innerHeight;
    this.instance.screenHeightOffset = 0;
  }

  public setOverflowHeight() {
    this.instance.overflowEl.style.height = `${this.getPaneHeight()
      - 30
      - this.settings.topperOverflowOffset
      - this.instance.overflowEl.offsetTop}px`;
  }

  public checkOverflowAttr(val) {
    if (!this.settings.topperOverflow 
        || !this.instance.overflowEl) {
      return;
    }
 
    this.instance.overflowEl.style.overflowY = (val >= this.breakpoints.bottomer) ? 'auto' : 'hidden';
  }

  private prepareBreaksSwipeNextPoint(): {brs: {}, settingsBreaks: {}} {
    let brs = {};
    let settingsBreaks = {};

    brs['top'] = this.breakpoints.breaks['bottom'];
    brs['middle'] = this.breakpoints.breaks['middle'];
    brs['bottom'] = this.breakpoints.breaks['top'];
    settingsBreaks['top'] = {...this.settings.breaks['bottom']};
    settingsBreaks['middle'] = {...this.settings.breaks['middle']};
    settingsBreaks['bottom'] = {...this.settings.breaks['top']};

    return { brs, settingsBreaks };
  }

  /**
   * Topper Than Top
   * Lower Than Bottom
   * Otherwise don't changes
   */
  private handleSuperposition(coords: {
    clientX: number, clientY: number, newVal: number, 
    newValX: number, diffY: number, diffX: number
  }): {x?: number, y?: number} {
    // Inverse gestures
    // Allow drag topper than top point
    if (this.settings.upperThanTop
        && ((coords.newVal >= this.breakpoints.topper) 
        || this.events.startPointOverTop)) {
      // check that finger reach same position before enable normal swipe mode
      if (!this.events.startPointOverTop) {
        this.events.startPointOverTop = coords.clientY;
      }
      if (this.events.startPointOverTop > coords.clientY) {
        delete this.events.startPointOverTop;
      }
      const screenDelta = this.instance.screen_height - this.instance.screenHeightOffset;
      const differKoef = (screenDelta - this.instance.getPanelTransformY()) / (screenDelta - this.breakpoints.topper) / 8;
      return { y: this.instance.getPanelTransformY() + (coords.diffY * differKoef) };
    }
    
    // Disallow drag topper than top point
    if (!this.settings.upperThanTop 
        && (coords.newVal >= this.breakpoints.topper)) {
      return { y: this.breakpoints.topper };
    }
  }

  public scrollPreventDrag(t): boolean {
    let prevention: boolean = false;
    if (this.events.willScrolled() 
      && this.isOverflowEl(t.target)) {
      prevention = true;
    }
    return prevention;
  }

  private isOverflowEl(el): boolean {
    if (!el) {
      return false;
    }
    let node = el.parentNode;
    while (node != null) {
        if (node == this.instance.overflowEl) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
  }

  private async onScroll() {
    this.events.isScrolling = true;
  }
}

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
    // Override swipe logic for inverse coordinates
    this.instance['swipeNextPoint'] = (diff, maxDiff, closest) => this.swipeNextPoint(diff, maxDiff, closest);
    // Override fastSwipeNext to invert direction detection for inverse mode
    this.events['fastSwipeNext'] = (axis) => this.fastSwipeNext(axis);
    // re-bind events functions
    this.events['handleSuperposition'] = (coords) => this.handleSuperposition(coords);
    this.events['scrollPreventDrag'] = (t) => this.scrollPreventDrag(t);
    this.events['onScroll'] = () => this.onScroll();
    
    // Override transitions to block X movement in inverse mode
    this.instance.transitions['setPaneElTransform'] = (params) => this.setPaneElTransform(params);

    // Ensure X coordinate is always 0 in inverse mode
    this.instance.currentTranslateX = 0;

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

    this.instance.on('buildBreakpointsCompleted', () => {
      // Fix inverse coordinate calculation
      // In inverse mode, panel starts from top, so we need to recalculate positions
      const originalBreaks = { ...this.breakpoints.breaks };
      const screenHeight = this.instance.screen_height;
      

      
      ['top', 'middle', 'bottom'].forEach((breakName) => {
        if (originalBreaks[breakName] !== undefined && this.settings.breaks[breakName]?.enabled) {
          // In inverse mode, calculate position from top of screen
          // height = how much content is visible
          // position = screen_height - height (how far down from top)
          const contentHeight = this.settings.breaks[breakName].height;
          const positionFromTop = screenHeight - contentHeight - this.settings.bottomOffset;
          

          
          this.breakpoints.breaks[breakName] = positionFromTop;
        }
      });
      
      // Get all converted breakpoint values  
      const breakValues = Object.values(this.breakpoints.breaks).filter(v => typeof v === 'number') as number[];
      
      // In inverse mode:
      // - Smallest Y value (top of screen) = topper = most content visible
      // - Largest Y value (bottom of screen) = bottomer = least content visible  
      const smallestY = Math.min(...breakValues); // Topper (top of screen, most content)
      const largestY = Math.max(...breakValues);  // Bottomer (bottom of screen, least content)
      
      this.breakpoints.topper = smallestY;
      this.breakpoints.bottomer = largestY;
      
      // CRITICAL: Update the brs array with converted values for getClosestBreakY()
      this.breakpoints.brs = breakValues;

      // Re-calc top after setBreakpoints();
      this.instance.paneEl.style.top = `-${Math.abs(this.breakpoints.bottomer) - this.settings.bottomOffset}px`;
      

    });

    this.instance.on('onWillPresent', () => {
      this.breakpoints.beforeBuildBreakpoints = () => this.beforeBuildBreakpoints();
    });

    // Initial positioning will be handled by the corrected breakpoint calculations
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
    // Since we override swipeNextPoint completely, no need to swap here
    // Just return the normal breakpoints structure
    return {
      brs: {...this.breakpoints.breaks}, 
      settingsBreaks: {...this.settings.breaks}
    };
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


    // Inverse gestures - coordinate system starts from top of screen
    // topper = smallest Y (top of screen, most content visible, e.g., 100)
    // bottomer = largest Y (bottom of screen, least content visible, e.g., 900)
    
    // ALWAYS enforce boundaries in inverse mode for proper UI behavior
    // Working with positive coordinate system where smaller Y = more content (top of screen)
    
    // FIRST: Check topper boundary (dragging too far up/small Y = too much content)
    if (coords.newVal <= this.breakpoints.topper) {
      return { y: this.breakpoints.topper };
    }
    
    // SECOND: Check bottomer boundary (dragging too far down/large Y = too little content)
    if (coords.newVal >= this.breakpoints.bottomer) {
      return { y: this.breakpoints.bottomer };
    }
    
    // THIRD: Check upperThanTop setting for resistance beyond topper
    if (coords.newVal <= this.breakpoints.topper) {
      if (this.settings.upperThanTop) {
        // Allow drag beyond topper with resistance
        if (!this.events.startPointOverTop) {
          this.events.startPointOverTop = coords.clientY;
        }
        if (this.events.startPointOverTop > coords.clientY) {
          delete this.events.startPointOverTop;
        }
        const screenDelta = this.instance.screen_height - this.instance.screenHeightOffset;
        const differKoef = (screenDelta - Math.abs(this.instance.getPanelTransformY())) / (screenDelta - Math.abs(this.breakpoints.topper)) / 8;
        const resultY = this.instance.getPanelTransformY() + (coords.diffY * differKoef);
        

        
        return { y: resultY };
      } else {
        // In inverse mode, ALWAYS respect top boundary  
        return { y: this.breakpoints.topper };
      }
    }

    return undefined; // Allow normal movement
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

  /**
   * Override setPaneElTransform to block X movement in inverse mode
   * Inverse panes should only move vertically (Y-axis)
   */
  public setPaneElTransform(params) {
    // Update Y coordinate as normal (breakpoints are already calculated correctly)
    this.instance.currentTranslateY = params.translateY;
    
    // NEVER update X coordinate in inverse mode - keep it at 0
    this.instance.currentTranslateX = 0;
    
    // Apply transform with Y movement only, X always stays at 0
    const transform = this.instance.buildTransform3d(0, this.instance.currentTranslateY, 0);
    
    this.instance.paneEl.style.transform = transform;
  }

  /**
   * Override fastSwipeNext for inverse mode
   * Need to detect fast swipe but pass inverted diff to swipeNextPoint
   */
  public fastSwipeNext(axis: 'Y' | 'X'): boolean {
    // Only consider fast swipe when an actual drag occurred
    if (this.events['allowClick']) return false;
    if (this.events['steps'].length < 2) return false;

    const last = this.events['steps'][this.events['steps'].length - 1];
    const prev = this.events['steps'][this.events['steps'].length - 2];
    const diff = (last?.['pos' + axis] ?? 0) - (prev?.['pos' + axis] ?? 0);
    if (!Number.isFinite(diff)) return false;



    return (Math.abs(diff) >= this.events.swipeNextSensivity);
  }

  /**
   * Override swipeNextPoint for inverse coordinate system
   * In inverse mode, we need to handle the direction properly
   */
  public swipeNextPoint(diff: number, maxDiff: number, closest: number): number {
    const brs: any = this.breakpoints.breaks;
    const settingsBreaks: any = this.settings.breaks;

    const curr = this.instance.breakpoints.currentBreakpoint;
    const topY = brs['top'];     // Smallest Y (most content, top of screen)
    const midY = brs['middle'];  // Middle Y
    const botY = brs['bottom'];  // Largest Y (least content, bottom of screen)



    // In inverse mode:
    // diff > 0 (finger down) = show LESS content = move to larger Y (towards bottom breakpoint)
    // diff < 0 (finger up) = show MORE content = move to smaller Y (towards top breakpoint)

    // From top position (most content visible, smallest Y)
    if (curr === topY) {
      if (diff > maxDiff) { // Finger down → show less content
        if (settingsBreaks['middle']?.enabled) {
          return midY;
        }
        if (settingsBreaks['bottom']?.enabled) {
          return botY;
        }
      }
      return topY;
    }

    // From middle position
    if (curr === midY) {
      if (diff < -maxDiff && settingsBreaks['top']?.enabled) { // Finger up → show more content
        return topY;
      }
      if (diff > maxDiff && settingsBreaks['bottom']?.enabled) { // Finger down → show less content
        return botY;
      }
      return midY;
    }

    // From bottom position (least content visible, largest Y)
    if (curr === botY) {
      if (diff < -maxDiff) { // Finger up → show more content
        if (settingsBreaks['middle']?.enabled) {
          return midY;
        }
        if (settingsBreaks['top']?.enabled) {
          return topY;
        }
      }
      return botY;
    }

    return closest;
  }



  private beforeBuildBreakpoints() {
    // Don't override breaks here - let normal calculation happen first
    // We'll convert to inverse coordinates in buildBreakpointsCompleted
  }
}

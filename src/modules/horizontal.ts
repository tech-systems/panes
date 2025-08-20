import { CupertinoPane } from '../cupertino-pane';
import { Breakpoints } from '../breakpoints';
import { CupertinoSettings } from '../models';
import { Events } from '../events/events';
import { Transitions } from '../transitions';

/**
 * Horizontal module
 */

export class HorizontalModule {

  private static readonly forceSettings = {
    touchAngle: null
  }

  // Force to use settings by module
  public static CollectSettings(settings) {
    return settings.horizontal 
      ? { ...settings, ...HorizontalModule.forceSettings} 
      : settings;
  }

  private defaultRect;
  private horizontalBreaks;
  private currentBreakpoint: string;
  private fastSwipeNext: boolean;
  private initialBreakX: string = 'left'; // Default horizontal position
  private initialBreakY: string = 'middle'; // Default vertical position
  private recalcScheduled: boolean = false;

  private settings: CupertinoSettings;
  private transitions: Transitions;
  private events: Events;
  
  constructor(private instance: CupertinoPane) {
    this.settings = this.instance.settings;
    this.transitions = this.instance.transitions;
    this.events = this.instance.events;

    if (!this.settings.horizontal) {
      return null;
    }

    // Parse combined initialBreak pattern
    this.parseInitialBreak();

    // Override transitions setPaneElTransform
    this.transitions['setPaneElTransform'] = (params) => this.setPaneElTransform(params);
    
    // Override events applyMoveUpdate to include X-axis data when moving
    this.events['applyMoveUpdate'] = () => this.applyMoveUpdate();

    this.instance.on('beforeBreakHeightApplied', (ev) => {
        this.scheduleCalcHorizontalBreaks();
    });

    // Override initial positioning
    this.instance.on('beforePresentTransition', () => {
      this.calcHorizontalBreaks();
      this.overrideInitialPositioning();
    });

    // Calculate horizontal breakpoints when needed
    this.instance.on('onTransitionEnd', (ev) => {
      if ((ev.type === 'breakpoint' || ev.type === 'present')
        && !this.instance.getPanelTransformX()) {
          this.calcHorizontalBreaks();
      }
    });

    // In case of present({animate: false})
    this.instance.on('onDidPresent', (ev) => {
      if (!ev.animate) this.calcHorizontalBreaks();
    });

    this.instance.on('onDragEnd', (ev) => {
      this.fastSwipeNext = this.events.fastSwipeNext('X');
    });
  }

  private parseInitialBreak() {
    const breakParts = this.settings.initialBreak.split(' ');
    
    if (breakParts.length === 1) {
      // Single break like 'middle' - use for Y, default X to left
      this.initialBreakY = breakParts[0];
      this.initialBreakX = 'left';
    } else if (breakParts.length === 2) {
      // Combined break like 'middle right'
      this.initialBreakY = breakParts[0]; // top/middle/bottom
      this.initialBreakX = breakParts[1]; // left/right
    }

    // Validate Y break
    if (!['top', 'middle', 'bottom'].includes(this.initialBreakY)) {
      console.warn(`Cupertino Pane: Invalid Y breakpoint "${this.initialBreakY}", using "middle"`);
      this.initialBreakY = 'middle';
    }

    // Validate X break
    if (!['left', 'right'].includes(this.initialBreakX)) {
      console.warn(`Cupertino Pane: Invalid X breakpoint "${this.initialBreakX}", using "left"`);
      this.initialBreakX = 'left';
    }
  }

  private async calcHorizontalBreaks() {
    const rect = this.instance.paneEl.getBoundingClientRect();
    const paneWidth = rect.width;
    
    // Calculate the original centered position (not the transformed position)
    // The pane is centered using CSS: margin-left: auto; margin-right: auto
    const originalCenteredLeft = (window.innerWidth - paneWidth) / 2;
    
    this.defaultRect = {
      width: paneWidth,
      left: originalCenteredLeft,
      right: originalCenteredLeft + paneWidth
    };
    
    const offset = this.settings.horizontalOffset ?? 0;
    this.horizontalBreaks = {
      left: Math.round(-this.defaultRect.left + offset),
      right: Math.round(window.innerWidth - this.defaultRect.left - this.defaultRect.width - offset)
    };
  }

  private scheduleCalcHorizontalBreaks() {
    if (this.recalcScheduled) return;
    this.recalcScheduled = true;
    requestAnimationFrame(() => {
      this.recalcScheduled = false;
      this.calcHorizontalBreaks();
    });
  }

  private overrideInitialPositioning() {
    // Get Y position from breakpoints
    const yPosition = this.instance.breakpoints.breaks[this.initialBreakY];
    
    // Get X position from horizontal breaks  
    const xPosition = this.horizontalBreaks[this.initialBreakX];
    
    // Check if we're in an animated presentation
    // If so, we should start from the screen height offset for the animation
    const currentTransform = this.instance.paneEl.style.transform;
    const isAnimatedPresent = currentTransform.includes(`${this.instance.screenHeightOffset}px`);
    
    if (isAnimatedPresent) {
      // For animated presentations, only set X position, keep Y at screen height offset
      this.instance.currentTranslateX = xPosition;
      this.instance.currentTranslateY = this.instance.screenHeightOffset;
      this.instance.paneEl.style.transform = `translateY(${this.instance.currentTranslateY}px) translateX(${this.instance.currentTranslateX}px) translateZ(0px)`;
    } else {
      // For non-animated presentations, set both X and Y to final positions
      this.instance.currentTranslateX = xPosition;
      this.instance.currentTranslateY = yPosition;
      this.instance.paneEl.style.transform = `translateY(${this.instance.currentTranslateY}px) translateX(${this.instance.currentTranslateX}px) translateZ(0px)`;
    }
    
    // Update currentBreakpoint to reflect actual position
    this.currentBreakpoint = this.initialBreakX;
    this.instance.breakpoints.currentBreakpoint = yPosition;
  }

  public setPaneElTransform(params) {
    if (!this.horizontalBreaks) this.calcHorizontalBreaks();
    let closestY = params.translateY;
    let closestX = params.translateX || this.instance.getPanelTransformX();

    // resize event for x-axis
    if (params.type === 'breakpoint' && !params.translateX) {
      closestX = this.horizontalBreaks[this.currentBreakpoint];
    }
    
    if (params.type === 'end') {
      // Get closest Y breakpoint (existing logic)
      closestY = this.instance.breakpoints.getClosestBreakY();
      
      // Get closest X breakpoint
      closestX = this.getClosestBreakX();

      // Handle fast swipe in X direction
      if (this.fastSwipeNext) {
        if (this.currentBreakpoint === 'left' 
          && this.instance.getPanelTransformX() > this.horizontalBreaks.left) {
            closestX = this.horizontalBreaks.right;
        }
        if (this.currentBreakpoint === 'right' 
          && this.instance.getPanelTransformX() < this.horizontalBreaks.right) {
            closestX = this.horizontalBreaks.left;
        }
      }

      // Update current breakpoint
      this.currentBreakpoint = closestX === this.horizontalBreaks.left ? 'left' : 'right';
      this.instance.breakpoints.currentBreakpoint = closestY;
    }

    // Apply combined transform and sync cache
    this.instance.currentTranslateX = closestX || 0;
    this.instance.currentTranslateY = closestY || 0;
    this.instance.paneEl.style.transform = `translateY(${this.instance.currentTranslateY}px) translateX(${this.instance.currentTranslateX}px) translateZ(0px)`;
  }

  private getClosestBreakX(): number {
    if (!this.horizontalBreaks) this.calcHorizontalBreaks();
    const currentX = this.instance.getPanelTransformX();
    return Math.abs(this.horizontalBreaks.left - currentX) < Math.abs(this.horizontalBreaks.right - currentX)
      ? this.horizontalBreaks.left
      : this.horizontalBreaks.right;
  }

  // Public method to move to specific horizontal break
  public moveToHorizontalBreak(breakX: 'left' | 'right') {
    if (!this.horizontalBreaks) {
      this.calcHorizontalBreaks();
    }

    const currentY = this.instance.getPanelTransformY();
    const targetX = this.horizontalBreaks[breakX];
    
    this.instance.currentTranslateX = targetX;
    this.instance.currentTranslateY = currentY;
    this.instance.paneEl.style.transform = `translateY(${this.instance.currentTranslateY}px) translateX(${this.instance.currentTranslateX}px) translateZ(0px)`;
    this.currentBreakpoint = breakX;
  }

  // Get current horizontal breakpoint
  public getCurrentHorizontalBreak(): 'left' | 'right' {
    return this.currentBreakpoint as 'left' | 'right';
  }

  // Override applyMoveUpdate to include X-axis data for horizontal dragging
  private applyMoveUpdate() {
    const pendingMoveData = this.events['pendingMoveData'];
    if (!pendingMoveData) {
      this.events['rafId'] = null;
      return;
    }

    const { newVal, newValX } = pendingMoveData;

    // Apply the opacity and overflow attributes
    this.instance.checkOpacityAttr(newVal);
    this.instance.checkOverflowAttr(newVal);
    
    // Apply the transition with both X and Y axis for horizontal module
    this.transitions.doTransition({type: 'move', translateY: newVal, translateX: newValX});

    // Clear the pending data and animation frame ID
    this.events['pendingMoveData'] = null;
    this.events['rafId'] = null;
  }

  // Public method to move to specified X,Y coordinates with smooth transition
  public async moveToWidth(translateX: number, translateY: number): Promise<any> {
    if (!this.instance.isPanePresented()) {
      console.warn(`Cupertino Pane: Present pane before call moveToWidth()`);
      return null;
    }

    // Use the library's transition system for smooth positioning
    await this.instance.transitions.doTransition({
      type: 'breakpoint', 
      translateX: translateX,
      translateY: translateY
    });
    
    return Promise.resolve(true);
  }
}

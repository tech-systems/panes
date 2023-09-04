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

    // re-bind functions
    this.transitions['setPaneElTransform'] = (params) => this.setPaneElTransform(params);

    // Calculate horizontal breakpoints on left-right edges
    // On present or window resized when transformX = 0
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

  private calcHorizontalBreaks() {
    this.defaultRect = {
      width: this.instance.paneEl.getBoundingClientRect().width,
      left: this.instance.paneEl.getBoundingClientRect().left,
      right: this.instance.paneEl.getBoundingClientRect().right
    };
    this.horizontalBreaks = [ 
      -this.defaultRect.left + this.settings.horizontalOffset, 
      window.innerWidth - this.defaultRect.left - this.defaultRect.width - this.settings.horizontalOffset
    ];
  }

  public setPaneElTransform(params) {
    let closest = params.translateX;
    if (params.type === 'end') {
      closest = this.getClosestBreakX();

      if (this.fastSwipeNext) {
        if (this.currentBreakpoint === 'left' 
          && this.instance.getPanelTransformX() > this.horizontalBreaks[0]) {
            closest = this.horizontalBreaks[1];
        }
        if (this.currentBreakpoint === 'right' 
          && this.instance.getPanelTransformX() < this.horizontalBreaks[1]) {
            closest = this.horizontalBreaks[0];
        }
      }

      this.currentBreakpoint = closest === this.horizontalBreaks[0] ? 'left' : 'right';
    }

    this.instance.paneEl.style.transform = `translateX(${closest || 0}px) translateY(${params.translateY}px) translateZ(0px)`;
  }

  private getClosestBreakX(): number {
    return this.horizontalBreaks.reduce((prev, curr) => {
      return (Math.abs(curr - this.instance.getPanelTransformX()) < Math.abs(prev - this.instance.getPanelTransformX()) ? curr : prev);
    });
  }
}

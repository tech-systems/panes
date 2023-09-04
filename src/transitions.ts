import { CupertinoPane } from './cupertino-pane';
import { CupertinoSettings } from './models';
import { Breakpoints } from './breakpoints';

/**
 * Transitions class
 * Z-Push transitions class
 */

// TODO: review MoveEnd can be replaced with breakpoint
export enum CupertinoTransition {
  Present = 'present',
  Destroy = 'destroy',
  Move = 'move',
  Breakpoint = 'breakpoint',
  Hide = 'hide',
  TouchEnd = 'end'
}

export class Transitions {

  public isPaneHidden: boolean = false;

  private settings: CupertinoSettings;
  private breakpoints: Breakpoints;
  constructor(private instance: CupertinoPane) {
    this.settings = this.instance.settings;
    this.breakpoints = this.instance.breakpoints;
  }

  /***********************************
  * Transitions handler
  */
  public doTransition(params:any = {}): Promise<true> {
    return new Promise(async (resolve) => {
      // touchmove simple event
      if (params.type === CupertinoTransition.Move) {
        // System event
        this.instance.emit('onMoveTransitionStart', {translateY: params.translateY});
        this.instance.paneEl.style.transition = 'all 0ms linear 0ms';
        this.setPaneElTransform(params);
        return resolve(true);
      }

      // Transition end
      const transitionEnd = () => {
        if (params.type === CupertinoTransition.Destroy) {
          this.instance.destroyResets();
        }
        this.instance.paneEl.style.transition = `initial`;

        // isHidden
        if (params.type === CupertinoTransition.Hide) {
          this.isPaneHidden = true;
        }
        if (params.type === CupertinoTransition.Breakpoint
            || params.type === CupertinoTransition.Present
            || params.type === CupertinoTransition.TouchEnd) {
          this.isPaneHidden = false;
        }

        // toggle ion-content scroll-y
        if ((params.type === CupertinoTransition.Hide
            || params.type === CupertinoTransition.Destroy)
            && this.instance.ionContent
            && !this.settings.ionContentScroll
            && !this.doesPanesExists()) {
          this.instance.ionContent.setAttribute('scroll-y', 'true');
        }

        // Emit event
        this.instance.emit('onTransitionEnd', {
          type: params.type,
          target: document.body.contains(this.instance.paneEl) ? this.instance.paneEl : null
        });

        // Remove listener
        this.instance.paneEl.removeEventListener('transitionend', transitionEnd);
        return resolve(true);
      };

      // MoveToBreak, Touchend, Present, Hide, Destroy events
      if (params.type === CupertinoTransition.Breakpoint
          || params.type === CupertinoTransition.TouchEnd
          || params.type === CupertinoTransition.Present
          || params.type === CupertinoTransition.Hide
          || params.type === CupertinoTransition.Destroy) {
        
        // Allow custom transitions for present/destroy
        // + Fix arguments mutations from re-call present
        let subTransition = params.conf?.transition 
          ? JSON.parse(JSON.stringify(params.conf.transition)) : {};

        // freemode
        if (params.type === CupertinoTransition.TouchEnd && this.settings.freeMode) return resolve(true); 

        // Get timing function && push for next 
        const nextBreak = Object.entries(this.breakpoints.breaks).find(
          val => val[1] === params.translateY
        );
        let bounce = nextBreak && this.settings.breaks[nextBreak[0]]?.bounce;

        // transition style
        let buildedTransition = this.buildTransitionValue(bounce, subTransition.duration);
        this.instance.paneEl.style.setProperty('transition', buildedTransition);

        // Main transitions
        // Emit event
        this.instance.emit('onTransitionStart', {
          type: params.type,
          translateY: {new: params.translateY}, 
          transition: this.instance.paneEl.style.transition
        });

        // Move pane
        this.setPaneElTransform(params);
        
        /**
         * Custom transitions for present/destroy functions
         */
        if (subTransition.to) {
          if (!subTransition.to.transform) {
            subTransition.to.transform = `translateY(${this.breakpoints.breaks[this.settings.initialBreak]}px) translateZ(0px)`;
          }
          Object.assign(this.instance.paneEl.style, subTransition.to);
        }

        // set prev breakpoint for service needs
        let getNextBreakpoint = Object.entries(this.breakpoints.breaks).find(val => val[1] === params.translateY);
        if (getNextBreakpoint) {
          this.breakpoints.prevBreakpoint = getNextBreakpoint[0];
        }

        this.instance.paneEl.addEventListener('transitionend', transitionEnd);
      }
    });
  }

  private setPaneElTransform(params) {
    this.instance.paneEl.style.transform = `translateY(${params.translateY}px) translateZ(0px)`;
  }

  public buildTransitionValue(bounce: boolean, duration?: number): string {
    if (bounce) {
      return `all 300ms cubic-bezier(.155,1.105,.295,1.12)`;
    }

    return `all ${duration || this.settings.animationDuration}ms ${this.settings.animationType}`;
  }


  /**
   * Private class methods
   */

  private doesPanesExists() {
    return !!document.querySelector('.cupertino-pane-wrapper');
  }
}

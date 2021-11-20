import { CupertinoPane } from './cupertino-pane';
import { CupertinoSettings } from './models';
import { Breakpoints } from './breakpoints';
import { ZStack } from './z-stack';

/**
 * Transitions class
 * Z-Push transitions class
 */

export class Transitions {


  constructor(private instance: CupertinoPane,
              private settings: CupertinoSettings,
              private breakpoints: Breakpoints,
              private zStack: ZStack) {
  }

  /***********************************
  * Transitions handler
  */
  public doTransition(params:any = {}): Promise<true> {
    return new Promise(async (resolve) => {
      // touchmove simple event
      if (params.type === 'move') {
        this.instance.paneEl.style.transition = 'all 0ms linear 0ms';
        this.instance.paneEl.style.transform = `translateY(${params.translateY}px) translateZ(0px)`;
        // Bind for follower same transitions
        if (this.instance.followerEl) {
          this.instance.followerEl.style.transition = 'all 0ms linear 0ms';
          this.instance.followerEl.style.transform = `translateY(${params.translateY - this.breakpoints.breaks[this.settings.initialBreak]}px) translateZ(0px)`;
        }

        // Push transition for each element
        if (this.settings.zStack) {
          this.settings.zStack.pushElements.forEach(item => 
            this.zStack.pushTransition(
              document.querySelector(item), 
              this.instance.getPanelTransformY(), 'all 0ms linear 0ms'
            )
          );
        }
        
        return resolve(true);
      }

      // Transition end
      const transitionEnd = () => {
        if (params.type === 'destroy') {
          this.instance.destroyResets();
        }
        this.instance.paneEl.style.transition = `initial`;
        // Bind for follower same transitions
        if (this.instance.followerEl) {
          this.instance.followerEl.style.transition = `initial`;
        }

        // Backdrop 
        if (this.settings.backdrop) {
          if (params.type === 'destroy' || params.type === 'hide') {
            this.instance.backdropEl.style.transition = `initial`;
            this.instance.backdropEl.style.display = `none`;
          }
        }

        // Emit event
        if (params.type === 'present') {
          this.settings.onDidPresent();  
        }
        if (params.type === 'destroy') {
          this.settings.onDidDismiss({destroyButton: params.destroyButton} as any);
        }
        this.settings.onTransitionEnd({target: document.body.contains(this.instance.paneEl) ? this.instance.paneEl : null});

        // Remove listener
        this.instance.paneEl.removeEventListener('transitionend', transitionEnd);
        return resolve(true);
      };

      // MoveToBreak, Touchend, Present, Hide, Destroy events
      if (params.type === 'breakpoint' 
          || params.type === 'end' 
          || params.type === 'present'
          || params.type === 'hide'
          || params.type === 'destroy') {

        // backdrop 
        if (this.settings.backdrop) {
          if (this.instance.isHidden()
              || params.type === 'hide'
              || params.type === 'destroy'
              || params.type === 'present') {
            this.instance.backdropEl.style.backgroundColor = 'rgba(0,0,0,.0)';
            this.instance.backdropEl.style.transition = `all ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
            
            if (params.type !== 'hide' && params.type !== 'destroy') {
              this.instance.backdropEl.style.display = 'block';
              setTimeout(() => {
                this.instance.backdropEl.style.backgroundColor = `rgba(0,0,0, ${this.settings.backdropOpacity})`;
              }, 50);
            }
          } 
        }
        
        // freemode
        if (params.type === 'end' && this.settings.freeMode) return resolve(true); 

        // Get timing function && push for next 
        const nextBreak = Object.entries(this.breakpoints.breaks).find(
          val => val[1] === params.translateY
        );
        let bounce = nextBreak && this.settings.breaks[nextBreak[0]]?.bounce;

        // style
        this.instance.paneEl.style.transition = this.buildTransitionValue(bounce);
        // Bind for follower same transitions
        if (this.instance.followerEl) {
          this.instance.followerEl.style.transition = this.buildTransitionValue(bounce);
        }
        
        // Push transition
        if (this.settings.zStack) {
          // Reason of timeout is to hide empty space when present pane and push element
          // we should start push after pushMinHeight but for present 
          // transition we can't calculate where pane Y is.
          // TODO: already can. change timeout to current pane position on transition
          setTimeout(() => {
            this.settings.zStack.pushElements.forEach(item => 
              this.zStack.pushTransition(
                document.querySelector(item), 
                params.translateY, 
                `all ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`
              )
            );
          }, (this.settings.zStack.cardYOffset && params.type === 'present') ? 100 : 0);
        }

        // Main transitions
        // Emit event
        this.settings.onTransitionStart({translateY: {new: params.translateY}});
        this.instance.paneEl.style.transform = `translateY(${params.translateY}px) translateZ(0px)`;
        // Bind for follower same transitions
        if (this.instance.followerEl) {
          this.instance.followerEl.style.transform = `translateY(${params.translateY - this.breakpoints.breaks[this.settings.initialBreak]}px) translateZ(0px)`;
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

  public buildTransitionValue(bounce: boolean): string {
    if (bounce) {
      return `all 300ms cubic-bezier(.155,1.105,.295,1.12)`;
    }

    return `all ${this.settings.animationDuration}ms ${this.settings.animationType}`;
  }


  /**
   * Private class methods
   */

  

}
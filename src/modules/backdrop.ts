import { CupertinoPane } from '../cupertino-pane';
import { CupertinoSettings } from '../models';
import { Events } from '../events/events';
import { CupertinoTransition } from '../transitions';
import { Support } from '../support';

/**
 * Backdrop module
 */

export class BackdropModule {

  public backdropEl: HTMLDivElement;

  private settings: CupertinoSettings;
  private events: Events;
  constructor(private instance: CupertinoPane) {
    this.settings = this.instance.settings;
    this.events = this.instance.events;
    
    if (!this.settings.backdrop) {
      return;
    }

    // bind to primary instance
    this.instance['backdrop'] = (conf) => this.backdrop(conf);

    this.instance.on('rendered', () => {
      this.instance.addStyle( `
        .cupertino-pane-wrapper .backdrop {
          overflow: hidden;
          position: fixed;
          width: 100%;
          bottom: 0;
          right: 0;
          left: 0;
          top: 0;
          display: none;
          z-index: 10;
          ${Support.backdropFilter && this.settings.backdropBlur ? `
            backdrop-filter: saturate(180%) blur(10px);
            -webkit-backdrop-filter: saturate(180%) blur(10px);
          ` : ``}
        }
      `);

      if (this.settings.backdrop) {
        this.renderBackdrop();
      }
    });

    this.instance.on('beforePresentTransition', (ev) => {
      if (!ev.animate) {
        this.backdropEl.style.display = `block`;
      }
    });

    this.instance.on('onTransitionStart', (ev) => {
      if (!this.settings.backdrop) {
        return;
      }

      if (this.instance.isHidden()
          || ev.type === CupertinoTransition.Hide
          || ev.type === CupertinoTransition.Destroy
          || ev.type === CupertinoTransition.Present) {
        this.backdropEl.style.backgroundColor = 'rgba(0,0,0,.0)';
        this.backdropEl.style.transition = `all ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
        
        if (ev.type !== CupertinoTransition.Hide 
            && ev.type !== CupertinoTransition.Destroy) {
          this.backdropEl.style.display = 'block';
          setTimeout(() => {
            this.backdropEl.style.backgroundColor = `rgba(0,0,0, ${this.settings.backdropOpacity})`;
          }, 50);
        }
      } 
    });

    this.instance.on('onTransitionEnd', (ev) => {
      if (!this.backdropEl) {
        return;
      }

      if (ev.type === CupertinoTransition.Destroy 
          || ev.type === CupertinoTransition.Hide) {
        this.backdropEl.style.transition = `initial`;
        this.backdropEl.style.display = `none`;
      }
    });

    // Stop propagation for touchmove events
    if (Support.touch) {
      // Attach events
      this.instance.on('onDidPresent', () => {
        this.backdropEl?.addEventListener(
          this.events.touchEvents.move, 
          this.touchMoveBackdropCb, 
          Support.passiveListener ? { passive: false, capture: false } : false);
      });

      // Detach events
      this.instance.on('onDidDismiss', (ev) => {
        this.backdropEl?.removeEventListener(this.events.touchEvents.move, this.touchMoveBackdropCb);
      });
    }
  }

  /**
   * Show/Hide backdrop primary function
   */
  private backdrop(conf = { show: true }): void {
    if (!this.instance.isPanePresented()) {
      console.warn(`Cupertino Pane: Present pane before call backdrop()`);
      return null;
    }

    if (!this.isBackdropPresented()) {
      this.renderBackdrop();

      // Reset events to attach backdrop stop propagation
      if (Support.touch) {
        this.backdropEl?.removeEventListener(this.events.touchEvents.move, this.touchMoveBackdropCb);
        this.backdropEl?.addEventListener(
          this.events.touchEvents.move, 
          this.touchMoveBackdropCb, 
          Support.passiveListener ? { passive: false, capture: false } : false);
        }
    }

    const transitionEnd = () => {
      this.backdropEl.style.transition = `initial`;
      this.backdropEl.style.display = `none`;
      this.backdropEl.removeEventListener('transitionend', transitionEnd); 
    }
    
    this.backdropEl.style.transition = `all ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
    this.backdropEl.style.backgroundColor = 'rgba(0,0,0,.0)';

    if (!conf.show) {
      // Destroy
      if (this.backdropEl.style.display === 'none') return;
      this.backdropEl.addEventListener('transitionend', transitionEnd);   
    } else {
      // Present
      this.backdropEl.style.display = 'block';
      setTimeout(() => {
        this.backdropEl.style.backgroundColor = `rgba(0,0,0, ${this.settings.backdropOpacity})`;
      }, 50);
    }
  }

  /**
   * Private class methods
   */
  private renderBackdrop() {
    this.backdropEl = document.createElement('div');
    this.backdropEl.classList.add('backdrop');
    this.backdropEl.style.transition = `all ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
    this.backdropEl.style.backgroundColor = `rgba(0,0,0, ${this.settings.backdropOpacity})`;
    this.instance.wrapperEl.appendChild(this.backdropEl);
    this.backdropEl.addEventListener('click', (event) => this.instance.emit('onBackdropTap', event));
  }

  private isBackdropPresented() {
    return document.querySelector(`.cupertino-pane-wrapper .backdrop`) 
    ? true : false;
  }
  
  /** 
   * Touch Move Event
   * @param t 
   */
  public touchMoveBackdropCb = (t) => this.touchMoveBackdrop(t);
  private touchMoveBackdrop(t) {
    if (this.settings.touchMoveStopPropagation) {
      t.stopPropagation();
    }
  }

}

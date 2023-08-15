import { CupertinoPane } from '../cupertino-pane';
import { CupertinoSettings } from '../models';
import { Breakpoints } from '../breakpoints';
import { Transitions } from '../transitions';

/**
 * Follower Element module
 */

export class FollowerModule {

  private followerEl: HTMLElement;
  private settings: CupertinoSettings;
  private breakpoints: Breakpoints;
  private transitions: Transitions;
  
  constructor(private instance: CupertinoPane) {
    this.breakpoints = this.instance.breakpoints;
    this.transitions = this.instance.transitions;
    this.settings = this.instance.settings;

    if (!this.settings.followerElement) {
      return;
    }

    // Set follower initial transitions
    this.instance.on('rendered', () => {
      if (!<HTMLElement>document.querySelector(this.settings.followerElement)) {
        console.warn('Cupertino Pane: wrong follower element selector specified', this.settings.followerElement);
        return;
      }

      this.followerEl = <HTMLElement>document.querySelector(
        this.settings.followerElement
      );
      this.followerEl.style.willChange = 'transform, border-radius';
      this.followerEl.style.transform = `translateY(0px) translateZ(0px)`;
      this.followerEl.style.transition = this.transitions.buildTransitionValue(this.settings.breaks[this.instance.currentBreak()]?.bounce);
    });

    // Move transition same for follower element (minus pane height)
    this.instance.on('onMoveTransitionStart', (ev) => {
      this.followerEl.style.transition = 'all 0ms linear 0ms';
      this.followerEl.style.transform = `translateY(${ev.translateY - this.breakpoints.breaks[this.settings.initialBreak]}px) translateZ(0px)`;
    });

    // Reset transition same as for pane element
    this.instance.on('onMoveTransitionStart', (ev) => {
      this.followerEl.style.transition = `initial`;
    });

    this.instance.on('onTransitionStart', (ev) => {
      this.followerEl.style.transition = ev.transition;
      this.followerEl.style.transform = `translateY(${ev.translateY.new - this.breakpoints.breaks[this.settings.initialBreak]}px) translateZ(0px)`;
    });

    this.instance.on('onKeyboardWillHide', () => {
      this.fixBodyKeyboardResize(false);
    });

    this.instance.on('onWindowResizeForKeyboard', () => {
      this.fixBodyKeyboardResize(true);
    });
  }

  /**
   * Using only to fix follower elemennts jumps out by OSK
   * Fix OSK
   * https://developer.chrome.com/blog/viewport-resize-behavior/
   * Chrome 108+ will adjust with overlays-content
   * When everyones updates, can be replaced with adding content-overlays to meta
   */
  public fixBodyKeyboardResize(showKeyboard) {
    if (!this.instance.paneEl) return;
    const metaViewport = document.querySelector('meta[name=viewport]');
    
    window.requestAnimationFrame(() => {
      if (showKeyboard) {
        document.documentElement.style.setProperty('overflow', 'hidden');
        document.body.style.setProperty('min-height', `${this.instance.screen_height}px`);
        metaViewport.setAttribute('content', 'height=' + this.instance.screen_height + ', width=device-width, initial-scale=1.0')
      } else {
        document.documentElement.style.removeProperty('overflow');
        document.body.style.removeProperty('min-height');
        metaViewport.setAttribute('content', 'viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
    });
  }
  
}

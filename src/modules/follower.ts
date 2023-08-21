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
  }  
}

import { CupertinoPane } from '../cupertino-pane';
import { Device } from '../device';
import { Breakpoints } from '../breakpoints';

/**
 * Resize, Keyboard show, Keyboard hide
 */

export class KeyboardEvents {

  // Keyboard help vars
  public inputBluredbyMove: boolean = false;
  
  private keyboardVisibleResize: boolean = false;
  private inputBottomOffset: number = 0;
  private previousInputBottomOffset: number = 0;
  private prevNewHeight: number = 0;
  private prevFocusedElement: Element;
  private device: Device;
  private breakpoints: Breakpoints;
  constructor(private instance: CupertinoPane) {
    this.device = this.instance.device;
    this.breakpoints = this.instance.breakpoints;
  }

  /**
   * Open Cordova Keyboard event
   * @param e
   */
  public onKeyboardShowCb = (e) => this.onKeyboardShow(e);
  private async onKeyboardShow(e) {    
    // focus element not inside pane
    if (!this.isPaneDescendant(document.activeElement)) {
      return;
    }

    // pane not visible on viewport
    if (!this.isOnViewport()) {
      return;
    }

    this.keyboardVisibleResize = true;
    this.fixBodyKeyboardResize(true);

    // calculate distances based on transformY
    let currentHeight = (this.instance.getPanelTransformY() - this.instance.screen_height) * -1;
    const inputEl = document.activeElement;
    const inputElBottomBound: number = this.getActiveInputClientBottomRect();
    const inputSpaceBelow = this.instance.screen_height - inputElBottomBound - this.inputBottomOffset;
    
    let offset = this.device.cordova && this.device.android ? 130 : 100;
    let spaceBelowOffset = 0;
    let newHeight = currentHeight + (e.keyboardHeight - inputSpaceBelow);

    // Multiple event fired with opened keyboard
    if (this.prevNewHeight) {
      spaceBelowOffset = this.previousInputBottomOffset - inputElBottomBound;
      newHeight = this.prevNewHeight;
    }

    // Re-focus input dublicate events
    if (inputEl.isEqualNode(this.prevFocusedElement)) {
      return;
    }

    // Keyboard will overlaps input
    if (e.keyboardHeight > inputSpaceBelow) {

      this.prevNewHeight = newHeight - spaceBelowOffset;
      this.prevFocusedElement = document.activeElement;

      let nextHeight = newHeight - spaceBelowOffset + offset;

      // Not push more than pane height
      if (nextHeight > this.instance.getPaneHeight() + e.keyboardHeight) {
        nextHeight = this.instance.getPaneHeight() + e.keyboardHeight;
      }

      /**
       * TODO: textarea issues
       */
      await this.instance.moveToHeight(nextHeight);

      // Determinate device offset for presented keyboard
      const newInputBottomOffset: number = this.getActiveInputClientBottomRect();
      this.previousInputBottomOffset = newInputBottomOffset;
      if (!this.inputBottomOffset) {
        this.inputBottomOffset = inputElBottomBound - newInputBottomOffset;
      }
    }
  }

  /**
   * Close Cordova Keyboard event
   * @param e
   */
  public onKeyboardWillHideCb = (e) => this.onKeyboardWillHide(e);
  private onKeyboardWillHide(e) {
    // pane not visible on viewport
    if (!this.isOnViewport()) {
      return;
    }
    
    this.fixBodyKeyboardResize(false);
    
    // Clear
    this.inputBottomOffset = 0;
    this.previousInputBottomOffset = 0;
    this.prevNewHeight = 0;
    delete this.prevFocusedElement;

    if (this.inputBluredbyMove) {
      this.inputBluredbyMove = false;
      return;
    }

    if (this.instance.isHidden()) {
      return;
    }

    // Position doesn't changed
    if (this.instance.getPanelTransformY() === this.breakpoints.breaks[this.breakpoints.prevBreakpoint]) {
      return;
    }

    this.instance.moveToBreak(this.breakpoints.prevBreakpoint);
  }

  /**
   * Window resize event
   * We handle here keyboard event as well
   * @param e
   */
  public onWindowResizeCb = (e) => this.onWindowResize(e);
  private async onWindowResize(e) {

      /**
       * Keyboard event detection
       * We should separate keyboard and resize events
       */
      if (this.isFormElement(document.activeElement)) {
        // Only for non-cordova
        if (!this.device.cordova) {
          this.onKeyboardShow({keyboardHeight: this.instance.screen_height - window.innerHeight});
        }
        return;
      }

      if (this.keyboardVisibleResize) {
        this.keyboardVisibleResize = false;

        // Only for non-cordova
        if (!this.device.cordova) {
          this.onKeyboardWillHide({});
        }
        return;
      }

    await new Promise((resolve) => setTimeout(() => resolve(true), 150));
    this.instance.updateScreenHeights();
    this.breakpoints.buildBreakpoints(JSON.parse(this.breakpoints.lockedBreakpoints));
  }

 
  /**
   * Private class methods
   */



  // TODO: switch to contains
  private isPaneDescendant(el): boolean {
    if (!el) {
      return false;
    }
    let node = el.parentNode;
    while (node != null) {
        if (node == this.instance.paneEl) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
  }

  private isFormElement(el):boolean {
    const formElements: string[] = [
      'input', 'select', 'option', 
      'textarea', 'button', 'label'
    ];

    if (el && el.tagName 
        && formElements.includes(el.tagName.toLowerCase())) {
      return true;
    }
    return false;
  }

  private isOnViewport(): boolean {
    if (this.instance.paneEl 
        && this.instance.paneEl.offsetWidth === 0 
        && this.instance.paneEl.offsetHeight === 0 ) {
      return false;
    }

    return true;
  }

  /**
   * Deal with Ionic Framework.
   * ion-input, ion-textarea changes in Client rects after window resize.
   * get rects by parent, not shadowDom el
   */
  private getActiveInputClientBottomRect(): number {
    if (document.activeElement.classList.contains('native-textarea') 
        || document.activeElement.classList.contains('native-input')) {
        // Go top until ionic element
        let ionElement = document.activeElement.parentElement?.parentElement?.parentElement;
        return ionElement.getBoundingClientRect().bottom;
    }

    return document.activeElement.getBoundingClientRect().bottom;
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

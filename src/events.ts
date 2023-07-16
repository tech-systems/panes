import { CupertinoPane } from './cupertino-pane';
import { CupertinoSettings } from './models';
import { Device } from './device';
import { Support } from './support';
import { Breakpoints } from './breakpoints';
import { Transitions } from './transitions';

/**
 * Touch start, Touch move, Touch end,
 * Click, Keyboard show, Keyboard hide
 */

export class Events {

  public touchEvents: {
    start: string, move: string, 
    end: string, cancel: string
  };

  private allowClick: boolean = true;
  private disableDragAngle: boolean = false;
  private mouseDown: boolean = false;
  public contentScrollTop: number = 0;
  private startY: number;
  private startX: number;
  private steps: {
    posY: number, 
    posX?: number, 
    time: number
  }[] = [];  
  public isScrolling: boolean = false;
  public startPointOverTop: number;
  public swipeNextSensivity: number;

  // Keyboard help vars
  private keyboardVisible: boolean = false;
  private inputBluredbyMove: boolean = false;
  private inputBottomOffset: number = 0;
  private previousInputBottomOffset: number = 0;
  private prevNewHeight: number = 0;
  private prevFocusedElement: Element;
  
  constructor(private instance: CupertinoPane, 
              private settings: CupertinoSettings,
              private device: Device,
              private breakpoints: Breakpoints,
              private transitions: Transitions) {
    this.touchEvents = this.getTouchEvents();

    // Set sensivity lower for web
    this.swipeNextSensivity = window.hasOwnProperty('cordova') 
      ? (this.settings.fastSwipeSensivity + 2) : this.settings.fastSwipeSensivity;
  }
  
  private getTouchEvents(): {
    start: string, move: string, 
    end: string, cancel: string
  } {
    const touch = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
    let desktop = ['mousedown', 'mousemove', 'mouseup', 'mouseleave'];
    const touchEventsTouch = {
      start: touch[0], move: touch[1],
      end: touch[2], cancel: touch[3]
    };
    const touchEventsDesktop = {
      start: desktop[0], move: desktop[1],
      end: desktop[2], cancel: desktop[3],
    };
    return Support.touch || !this.settings.simulateTouch ? touchEventsTouch : touchEventsDesktop;
  }

  public attachAllEvents() {
    if (!this.settings.dragBy) {
      this.eventListeners('addEventListener', this.instance.paneEl);
    } else {
      this.settings.dragBy.forEach((selector) => {
        const el = document.querySelector(selector);
        if (el) this.eventListeners('addEventListener', el);
      });
    }

    // scroll events for overflowEl
    if (this.settings.topperOverflow) {
      this.instance.overflowEl.addEventListener('scroll', this.onScrollCb);
    }

    // Handle keyboard events for cordova
    if (this.settings.handleKeyboard && this.device.cordova) {
      window.addEventListener('keyboardWillShow', this.onKeyboardShowCb);
      window.addEventListener('keyboardWillHide', this.onKeyboardWillHideCb);
    }

    // Fix Ionic-Android issue with ion-page scroll on keyboard
    if (this.device.ionic && this.device.android) {
      let ionPages = document.querySelectorAll('.ion-page');
      ionPages.forEach((el: any) => {
        el.addEventListener('scroll', (e) => {
          if (el.scrollTop) {
            el.scrollTo({top: 0});
          }
        });
      });
    }

    // Orientation change + window resize
    window.addEventListener('resize', this.onWindowResizeCb);
  }

  public detachAllEvents() {
    if (!this.settings.dragBy) {
      this.eventListeners('removeEventListener', this.instance.paneEl);
    } else {
      this.settings.dragBy.forEach((selector) => {
        const el = document.querySelector(selector);
        if (el) this.eventListeners('removeEventListener', el);
      });
    }

    // scroll events for overflowEl
    if (this.settings.topperOverflow) {
      this.instance.overflowEl.removeEventListener('scroll', this.onScrollCb);
    }

    // Handle keyboard events for cordova
    if (this.settings.handleKeyboard && this.device.cordova) {
      window.removeEventListener('keyboardWillShow', this.onKeyboardShowCb);
      window.removeEventListener('keyboardWillHide', this.onKeyboardWillHideCb);
    }

    // Orientation change + window resize
    window.removeEventListener('resize', this.onWindowResizeCb);
  }

  public resetEvents() {
    this.detachAllEvents();
    this.attachAllEvents();
  }

  /**
   * Core DOM elements event listeners
   * @param type 
   * @param el 
   */
  private eventListeners(type: 'addEventListener' | 'removeEventListener', el: Element) {
    if (Support.touch) {
      const passiveListener = this.touchEvents.start === 'touchstart' && Support.passiveListener && this.settings.passiveListeners ? { passive: true, capture: false } : false;
      el[type](this.touchEvents.start, this.touchStartCb, passiveListener);
      el[type](this.touchEvents.move, this.touchMoveCb, Support.passiveListener ? { passive: false, capture: false } : false);
      el[type](this.touchEvents.end, this.touchEndCb, passiveListener);
      el[type](this.touchEvents.cancel, this.touchEndCb, passiveListener);        
    } else {
      el[type](this.touchEvents.start, this.touchStartCb, false);
      el[type](this.touchEvents.move, this.touchMoveCb, false);
      el[type](this.touchEvents.end, this.touchEndCb, false);
      el[type](this.touchEvents.cancel, this.touchEndCb, false);
    }

    // Prevent accidental unwanted clicks events during swiping
    if (this.settings.preventClicks) {
      el[type]('click', this.onClickCb, true);
    }
  }
  
  /**
   * Touch Start Event
   * @param t 
   */
  public touchStartCb = (t) => this.touchStart(t);
  private touchStart(t) {
    // Event emitter
    this.instance.emit('onDragStart', (t as CustomEvent));

    // Allow clicks by default -> disallow on move (allow click with disabled drag)
    this.allowClick = true;

    if (this.instance.disableDragEvents) return;

    // Allow touch angle by default, disallow no move with condition
    this.disableDragAngle = false;

    // Not scrolling event by default -> on scroll will true
    this.isScrolling = false;

    // Allow pereventDismiss by default
    this.instance.preventedDismiss = false;

    const { clientY, clientX } = this.getEventClientYX(t, 'touchstart');
    this.startY = clientY;
    this.startX = clientX;

    if (t.type === 'mousedown') this.mouseDown = true;

    // if overflow content was scrolled
    // and drag not by draggable
    // increase to scrolled value
    if (this.contentScrollTop 
        && this.willScrolled() 
        && !this.isDraggableElement(t)) {
      this.startY += this.contentScrollTop;
    }
    
    this.steps.push({posY: this.startY, posX: this.startX, time: Date.now()});
  }

  /** 
   * Touch Move Event
   * @param t 
   */
  public touchMoveCb = (t) => this.touchMove(t);
  private touchMove(t) {
    const { clientY, clientX, velocityY } = this.getEventClientYX(t, 'touchmove');

    // Deskop: check that touchStart() was initiated
    if(t.type === 'mousemove' && !this.mouseDown) return;

    // sometimes touchstart is not called 
    // when touchmove is began before initialization
    if (!this.steps.length) {
      this.steps.push({posY: clientY, posX: clientX, time: Date.now()});
    }

    // Event emitter
    t.delta = this.steps[0]?.posY - clientY;

    // Disallow accidentaly clicks while slide gestures
    this.allowClick = false;
    
    // textarea scrollbar
    if (this.isFormElement(t.target) 
        && this.isElementScrollable(t.target)) {
      return;
    }
 
    if (this.instance.disableDragEvents) {
      this.steps = [];
      return;
    }
    if (this.disableDragAngle) return;
    if (this.instance.preventedDismiss) return;

    if (this.settings.touchMoveStopPropagation) {
      t.stopPropagation();
    }

    // Delta
    const diffY = clientY - this.steps[this.steps.length - 1].posY;
    const diffX = clientX - this.steps[this.steps.length - 1].posX;

    // No Y/X changes
    if (!Math.abs(diffY) 
        && !Math.abs(diffX)) {
      return;
    }

    // Emit event
    this.instance.emit('onDrag', t);

    // Has changes in position 
    this.instance.setGrabCursor(true, true);
    let newVal = this.instance.getPanelTransformY() + diffY;
    let newValX = this.instance.getPanelTransformX() + diffX;
    
    // First event after touchmove only
    if (this.steps.length < 2) {
      // Patch for 'touchmove' first event 
      // when start slowly events with small velocity
      if (velocityY < 1) {
        newVal = this.instance.getPanelTransformY() + (diffY * velocityY);
      }

      // Move while transition patch next transitions
      let computedTranslateY = new WebKitCSSMatrix(
        window.getComputedStyle(this.instance.paneEl).transform
      ).m42;
      let transitionYDiff = computedTranslateY - this.instance.getPanelTransformY();
      if (Math.abs(transitionYDiff)) {
        newVal += transitionYDiff;
      }
    }

    // Detect if input was blured
    // TODO: Check that blured from pane child instance
    if (this.steps.length > 2) {
      if (this.isFormElement(document.activeElement)
      && !(this.isFormElement(t.target))) {
        (<any>document.activeElement).blur();
        this.inputBluredbyMove = true;
      }
    }

    // Touch angle
    // Only for initial gesture with 1 touchstart step
    // Only not for scrolling events (scrolling already checked for angle)
    if (this.settings.touchAngle 
        && !this.isScrolling) {
      let touchAngle;
      const diffX = clientX - this.startX;
      const diffY = clientY - this.startY;
      touchAngle = (Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180) / Math.PI;
      if (diffX * diffX + diffY * diffY >= 25 
          && (90 - touchAngle > this.settings.touchAngle)
          && this.steps.length === 1) {
        this.disableDragAngle = true;
        return;
      }
    }

    // Not allow move panel with positive overflow scroll
    // Scroll handler
    if (this.instance.overflowEl.style.overflowY === 'auto' 
      && this.scrollPreventDrag(t)
      && !this.isDraggableElement(t)) {
      return;
    }

    // Topper-top/Lower-bottom recognizers
    let forceNewVal = this.handleTopperLowerPositions({
        clientX, clientY, 
        newVal, diffY
    });

    if (!isNaN(forceNewVal)) {
      newVal = forceNewVal;
    }

    // No changes Y/X
    if (this.instance.getPanelTransformY() === newVal 
        && this.instance.getPanelTransformX() === newValX ) {
      return;
    }

    // Prevent Dismiss gesture
    if (!this.instance.preventedDismiss
          && this.instance.preventDismissEvent && this.settings.bottomClose) {
      let differKoef = ((-this.breakpoints.topper + this.breakpoints.topper - this.instance.getPanelTransformY()) / this.breakpoints.topper) / -8;
      newVal = this.instance.getPanelTransformY() + (diffY * (0.5 - differKoef));
      
      let mousePointY = (clientY - 220 - this.instance.screen_height) * -1;
      if (mousePointY <= this.instance.screen_height - this.breakpoints.bottomer) {
        this.instance.preventedDismiss = true; 
        // Emit event with prevent dismiss
        this.instance.emit('onWillDismiss', {prevented: true} as any);
        this.instance.moveToBreak(this.breakpoints.prevBreakpoint);
        return;
      }
    }

    this.instance.checkOpacityAttr(newVal);
    this.instance.checkOverflowAttr(newVal);
    this.transitions.doTransition({type: 'move', translateY: newVal, translateX: newValX});
    this.steps.push({posY: clientY, posX: clientX, time: Date.now()});
  }

  /**
   * Touch End Event
   * @param t 
   */
  public touchEndCb = (t) => this.touchEnd(t);
  private touchEnd(t) {
    if (this.instance.disableDragEvents) return;

    // Desktop fixes
    if (t.type === 'mouseleave' && !this.mouseDown) return;
    if (t.type === 'mouseup' || t.type === 'mouseleave') this.mouseDown = false;

    // Determinate nearest point
    let closest = this.breakpoints.getClosestBreakY();

    // Swipe - next (if differ > 10)
    let fastSwipeClose;
    if (this.fastSwipeNext('Y')) {
      closest = this.instance.swipeNextPoint(
        this.steps[this.steps.length - 1]?.posY - this.steps[this.steps.length - 2]?.posY, //diff
        this.swipeNextSensivity, 
        closest
      );
      fastSwipeClose = this.settings.fastSwipeClose
        && this.breakpoints.currentBreakpoint < closest;
    }

    // blur tap event
    let blurTapEvent = false;
    if ((this.isFormElement(document.activeElement))
          && !(this.isFormElement(t.target))
          && this.steps.length === 2) {
        blurTapEvent = true;
    }

    // Event emitter
    this.instance.emit('onDragEnd', (t as CustomEvent));

    // Clear
    this.steps = [];
    delete this.startPointOverTop;

    // touchend with allowClick === tapped event (no move triggered)
    // skip next functions
    if (this.allowClick || blurTapEvent) {
      return;
    }

    // Fast swipe toward bottom - close
    if (fastSwipeClose) {
      this.instance.destroy({animate:true});
      return;
    }

    this.instance.checkOpacityAttr(closest);
    this.instance.checkOverflowAttr(closest);
    this.instance.setGrabCursor(true, false);

    // Bottom closable
    if (this.settings.bottomClose 
        && closest === this.breakpoints.breaks['bottom']) {
      this.instance.destroy({animate:true});
      return;
    }
    
    // Simulationiusly emit event when touchend exact with next position (top)
    if (this.instance.getPanelTransformY() === closest) {
      this.instance.emit('onTransitionEnd', {target: this.instance.paneEl});
    }

    this.breakpoints.currentBreakpoint = closest;
    this.transitions.doTransition({type: 'end', translateY: closest});
  }

  /**
   * Click Event
   * @param t 
   */
  public onScrollCb = (t) => this.onScroll(t);
  private async onScroll(t) {
    this.isScrolling = true;
    this.contentScrollTop = t.target.scrollTop;
  }

  /**
   * Click Event
   * @param t 
   */
  public onClickCb = (t) => this.onClick(t);
  private onClick(t) {
    // Prevent accidental unwanted clicks events during swiping
    if (!this.allowClick) {
      if (this.settings.preventClicks) {
        t.preventDefault();
        t.stopPropagation();  
        t.stopImmediatePropagation();
      }
      return;
    }

    // Android Multiple Re-focus on PWA
    // with resize keyboard handler
    if (!this.device.cordova
        && this.device.android
        && this.isFormElement(t.target)) {
      this.onKeyboardShow({
        keyboardHeight: this.instance.screen_height - window.innerHeight
      });
      return;
    }
    
    // Click to bottom - open middle
    if (this.settings.clickBottomOpen) {
      if (this.isFormElement(document.activeElement)) {
        return;
      }
      
      if (this.breakpoints.breaks['bottom'] === this.instance.getPanelTransformY()) {
          let closest;
          if (this.settings.breaks['top'].enabled) {
            closest = 'top';
          }
          if (this.settings.breaks['middle'].enabled) {
            closest = 'middle';
          } 
          this.instance.moveToBreak(closest);
      }
    }
  }

  /**
   * Open Cordova Keyboard event
   * @param e
   */
  public onKeyboardShowCb = (e) => this.onKeyboardShow(e);
  private async onKeyboardShow(e) {

    // focud element not inside pane
    if (!this.isPaneDescendant(document.activeElement)) {
      return;
    }

    // pane not visible on viewport
    if (!this.isOnViewport()) {
      return;
    }

    this.keyboardVisible = true;

    // calculate distances based on transformY
    let currentHeight = (this.instance.getPanelTransformY() - this.instance.screen_height) * -1;
    const inputEl = document.activeElement;
    const inputElBottomBound = inputEl.getBoundingClientRect().bottom;
    const inputSpaceBelow = this.instance.screen_height - inputElBottomBound - this.inputBottomOffset;
    const offset = this.device.cordova && this.device.android ? 150 : 100;
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
      await this.instance.moveToHeight(newHeight - spaceBelowOffset + offset);

      // Determinate device offset for presented keyboard
      const newInputBottomOffset = inputEl.getBoundingClientRect().bottom;
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

    this.keyboardVisible = false;
    
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
   * @param e
   */
  public onWindowResizeCb = (e) => this.onWindowResize(e);
  private async onWindowResize(e) {
    // We should separate keyboard and resize events
    if (this.isKeyboardEvent()) {

      // Android resize fixes
      this.fixBodyKeyboardResize(true);

      // Cordova & PWA iOS
      if (this.device.cordova 
          || this.device.ios) {
        return;
      }
      
      // PWA Android: we still handle keyboard with resize if input is active
      if (this.isFormElement(document.activeElement)) {
        this.onKeyboardShow({
          keyboardHeight: this.instance.screen_height - window.innerHeight
        });
      } else {
        this.onKeyboardWillHide({});
      }

      return;
    }

    await new Promise((resolve) => setTimeout(() => resolve(true), 150));
    this.instance.updateScreenHeights();
    this.breakpoints.buildBreakpoints(JSON.parse(this.breakpoints.lockedBreakpoints));
  }

  public fastSwipeNext(axis: 'Y' | 'X'): boolean {
    const diff = this.steps[this.steps.length - 1]?.['pos' + axis] - this.steps[this.steps.length - 2]?.['pos' + axis];
    return (Math.abs(diff) >= this.swipeNextSensivity);
  }

  /**
   * Private class methods
   */

  /**
   * Determinate if event is keyboard not resize
   * If form element active - recognize here as KeyboardWillShow
   */
  private isKeyboardEvent() {
    if (this.isFormElement(document.activeElement)) {
      return true;
    }

    if (!this.isFormElement(document.activeElement) 
        && this.keyboardVisible) {
      this.keyboardVisible = false;
      return true;
    }

    return false;
  }

  /**
   * Topper Than Top
   * Lower Than Bottom
   * Otherwise don't changes
   */
   private handleTopperLowerPositions(coords: {
     clientX: number, clientY: number, 
     newVal:number, diffY: number, 
  }):number {
    // Disallow drag upper than top point
    // And drag bottom when upper than top point (for zStack allowed)
    if (!this.settings.upperThanTop 
        && (coords.newVal <= this.breakpoints.topper 
            || (coords.clientY <= this.breakpoints.topper && !this.settings.zStack))) {
      this.steps = [];
      return this.breakpoints.topper;
    }

    /**
     * Allow drag topper than top point
     */
    if (this.settings.upperThanTop 
        && ((coords.newVal <= this.breakpoints.topper) 
        || this.startPointOverTop)) {
      // check that finger reach same position before enable normal swipe mode
      if (!this.startPointOverTop) {
        this.startPointOverTop = coords.clientY;
      }
      if (this.startPointOverTop < coords.clientY) {
        delete this.startPointOverTop;
      }
      const screenDelta = this.instance.screen_height - this.instance.screenHeightOffset;
      const differKoef = (screenDelta - this.instance.getPanelTransformY()) / (screenDelta - this.breakpoints.topper) / 8;  
      return this.instance.getPanelTransformY() + (coords.diffY * differKoef);
    }

    // Disallow drag lower then bottom
    if (!this.settings.lowerThanBottom
        && coords.newVal >= this.breakpoints.bottomer) {
      return this.breakpoints.bottomer;
    }
  }

  private getEventClientYX(ev, name) {
    const targetTouch = ev.type === name && ev.targetTouches && (ev.targetTouches[0] || ev.changedTouches[0]);
    const clientY: number = ev.type === name ? targetTouch.clientY : ev.clientY;
    const clientX: number = ev.type === name ? targetTouch.clientX : ev.clientX;
    const timeDiff: number = (Date.now()) - (this.steps[this.steps.length - 1]?.time || 0);
    const distanceY: number = Math.abs(clientY - (this.steps[this.steps.length - 1]?.posY || 0));
    const velocityY: number = distanceY / timeDiff;
    return {clientY, clientX, velocityY};
  }

  public scrollPreventDrag(t): boolean {
    let prevention: boolean = false;
    if (this.contentScrollTop > 0) {
      prevention = true;
    }
    return prevention;
  }

  /**
   * TODO: Check also document.body resizing for iOS/Chrome
   * Fix OSK
   * https://developer.chrome.com/blog/viewport-resize-behavior/
   * Chrome 108+ will adjust with content-overlays
   * When everyones updates, can be replaced with adding content-overlays to meta
   */
  private fixBodyKeyboardResize(showKeyboard) {
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

  public willScrolled(): boolean {
    if (!(this.isElementScrollable(this.instance.overflowEl)
        && this.instance.overflowEl.style.overflow !== 'hidden')) {
      return false;
    }
    return true;
  }

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

  private isDraggableElement(t) {
    return t.target === this.instance.draggableEl 
      || t.target === this.instance.moveEl;
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

  public isElementScrollable(el):boolean {
    return el.scrollHeight > el.clientHeight ? true : false;
  }

  private isOnViewport(): boolean {
    if (this.instance.paneEl 
        && this.instance.paneEl.offsetWidth === 0 
        && this.instance.paneEl.offsetHeight === 0 ) {
      return false;
    }

    return true;
  }
}

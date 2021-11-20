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

  private allowClick: boolean = true;
  private disableDragAngle: boolean = false;
  private pointerDown: boolean = false;
  private contentScrollTop: number = 0;
  private startY: number;
  private startX: number;
  private steps: {posY: number, time: number}[] = [];  
  private inputBluredbyMove: boolean = false;
  private keyboardVisible: boolean = false;
  private isScrolling: boolean = false;
  
  
  constructor(private instance: CupertinoPane, 
              private settings: CupertinoSettings,
              private device: Device,
              private breakpoints: Breakpoints,
              private transitions: Transitions) {
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

    // Fix Android issue with resize if not handle
    if (!this.settings.handleKeyboard 
        && this.device.cordova
        && this.device.android) {
      window.addEventListener('keyboardWillHide', () => {
        this.instance.parentEl.scrollTop = 0;
        if (this.instance.parentEl.parentElement) {
          this.instance.parentEl.parentElement.scrollTop = 0;
          if (this.instance.parentEl.parentElement.parentElement) {
            this.instance.parentEl.parentElement.parentElement.scrollTop = 0;
          }
        }
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

  private touchEvents = (() => {
    const touch = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
    let desktop = ['mousedown', 'mousemove', 'mouseup'];
    if (Support.pointerEvents) {
      desktop = ['pointerdown', 'pointermove', 'pointerup'];
    }
    const touchEventsTouch = {
      start: touch[0],
      move: touch[1],
      end: touch[2],
      cancel: touch[3],
    };
    const touchEventsDesktop = {
      start: desktop[0],
      move: desktop[1],
      end: desktop[2],
    };
    return Support.touch || !this.settings.simulateTouch ? touchEventsTouch : touchEventsDesktop;
  })();

  private eventListeners(type: 'addEventListener' | 'removeEventListener', el: Element) {
    // Touch Events
    if (!Support.touch && Support.pointerEvents) {
      el[type](this.touchEvents.start, this.touchStartCb, false);
      el[type](this.touchEvents.move, this.touchMoveCb, false);
      el[type](this.touchEvents.end, this.touchEndCb, false);
      
      // Backdrop propagation fix
      this.instance.backdropEl?.[type](this.touchEvents.move, this.touchMoveBackdropCb, false);
    } else {

      if (Support.touch) {
        const passiveListener = this.touchEvents.start === 'touchstart' && Support.passiveListener && this.settings.passiveListeners ? { passive: true, capture: false } : false;
        el[type](this.touchEvents.start, this.touchStartCb, passiveListener);
        el[type](this.touchEvents.move, this.touchMoveCb, Support.passiveListener ? { passive: false, capture: false } : false);
        el[type](this.touchEvents.end, this.touchEndCb, passiveListener);
        
        // Backdrop propagation fix
        this.instance.backdropEl?.[type](this.touchEvents.move, this.touchMoveBackdropCb, Support.passiveListener ? { passive: false, capture: false } : false);
        if (this.touchEvents['cancel']) {
          el[type](this.touchEvents['cancel'], this.touchEndCb, passiveListener);
        }
      }

      if ((this.settings.simulateTouch && !this.device.ios && !this.device.android) || (this.settings.simulateTouch && !Support.touch && this.device.ios)) {
        el[type]('mousedown', this.touchStartCb, false);
        el[type]('mousemove', this.touchMoveCb, false);
        el[type]('mouseup', this.touchEndCb, false);
        
        // Backdrop propagation fix
        this.instance.backdropEl?.[type]('mousemove', this.touchMoveBackdropCb, false);
      }
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
    this.settings.onDragStart(t as CustomEvent);

    // Allow clicks by default -> disallow on move (allow click with disabled drag)
    this.allowClick = true;

    if (this.instance.disableDragEvents) return;

    // Allow touch angle by default, disallow no move with condition
    this.disableDragAngle = false;

    // Not scrolling event by default -> on scroll will true
    this.isScrolling = false;

    // Allow pereventDismiss by default
    this.instance.preventedDismiss = false;

    const { clientY, clientX } = this.getEvetClientYX(t, 'touchstart');
    this.startY = clientY;
    this.startX = clientX;

    if (t.type === 'mousedown') this.pointerDown = true;

    // if overflow content was scrolled
    // increase to scrolled value
    if (this.contentScrollTop && this.willScrolled(t)) {
      this.startY += this.contentScrollTop;  
    }
    
    this.steps.push({posY: this.startY, time: Date.now()});
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

  /** 
   * Touch Move Event
   * @param t 
   */
  public touchMoveCb = (t) => this.touchMove(t);
  private touchMove(t) {
    const { clientY, clientX, velocityY } = this.getEvetClientYX(t, 'touchmove');

    // Event emitter
    t.delta = this.steps[0]?.posY - clientY;
    this.settings.onDrag(t);

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

    // Handle desktop/mobile events
    if(t.type === 'mousemove' && !this.pointerDown) return;

    // Delta
    const diffY = clientY - this.steps[this.steps.length - 1].posY;
    // No Y changes
    if (!Math.abs(diffY)) {
      return;
    }
    
    let newVal = this.instance.getPanelTransformY() + diffY;
    
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
    if (this.instance.overflowEl.style.overflowY === 'auto') {
      if (this.settings.inverse && this.willScrolled(t)) {
        this.contentScrollTop = 0;
        return;
      }

      // Scrolled -> Disable drag
      if (!this.settings.inverse && this.contentScrollTop > 0) {
        return;
      }
    }

    // topper/lower
    let forceNewVal = this.handleTopperLowerPositions(newVal, diffY);
    if (forceNewVal) {
      newVal = forceNewVal;
    }

    // No changes Y
    if (this.instance.getPanelTransformY() === newVal) {
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
        this.settings.onWillDismiss({prevented: true} as any);
        this.instance.moveToBreak(this.breakpoints.prevBreakpoint);
        return;
      }
    }

    this.instance.checkOpacityAttr(newVal);
    this.instance.checkOverflowAttr(newVal);
    this.transitions.doTransition({type: 'move', translateY: newVal});
    this.steps.push({posY: clientY, time: Date.now()});
  }

  /**
   * Touch End Event
   * @param t 
   */
  public touchEndCb = (t) => this.touchEnd(t);
  private touchEnd(t) {
    if (this.instance.disableDragEvents) return;

    if (t.type === 'mouseup') this.pointerDown = false;

    // Determinate nearest point
    let closest = this.breakpoints.getClosestBreakY();
    // Swipe - next (if differ > 10)
    const diff = this.steps[this.steps.length - 1]?.posY - this.steps[this.steps.length - 2]?.posY;
    // Set sensivity lower for web
    const swipeNextSensivity = window.hasOwnProperty('cordova') 
      ? (this.settings.fastSwipeSensivity + 2) : this.settings.fastSwipeSensivity; 
    const fastSwipeNext = (Math.abs(diff) >= swipeNextSensivity);
    if (fastSwipeNext) {
      closest = this.instance.swipeNextPoint(diff, swipeNextSensivity, closest);
      
      // Fast swipe toward bottom - close
      if (this.settings.fastSwipeClose 
          && this.breakpoints.currentBreakpoint < closest) {      
        this.instance.destroy({animate:true});
        return;
      }
    }

    // blur tap event
    let blurTapEvent = false;
    if ((this.isFormElement(document.activeElement))
      && !(this.isFormElement(t.target))
      && this.steps.length === 2
      ) {
        blurTapEvent = true;
    }

    this.steps = [];
    this.breakpoints.currentBreakpoint = closest;

    // Event emitter
    this.settings.onDragEnd(t as CustomEvent);

    // touchend with allowClick === tapped event (no move triggered)
    // skip next functions
    if (this.allowClick || blurTapEvent) {
      return;
    }

    this.instance.checkOpacityAttr(this.breakpoints.currentBreakpoint);
    this.instance.checkOverflowAttr(this.breakpoints.currentBreakpoint);

    // Bottom closable
    if (this.settings.bottomClose && closest === this.breakpoints.breaks['bottom']) {
      this.instance.destroy({animate:true});
      return;
    }
    
    // Simulationiusly emit event when touchend exact with next position (top)
    if (this.instance.getPanelTransformY() === closest) {
      this.settings.onTransitionEnd({target: this.instance.paneEl});
    }

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

    // Click to bottom - open middle
    if (this.settings.clickBottomOpen) {
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
  private onKeyboardShow(e) {
    this.keyboardVisible = true;

    // focud element not inside pane
    if (!this.isPaneDescendant(document.activeElement)) {
      return;
    }

    // pane not visible on viewport
    if (!this.isOnViewport()) {
      return;
    }

    if (this.device.android) {
      setTimeout(() => this.fixAndroidResize(), 20);
    }

    this.breakpoints.prevBreakpoint = Object.entries(this.breakpoints.breaks).find(val => val[1] === this.instance.getPanelTransformY())[0];
    let newHeight = this.settings.breaks[this.instance.currentBreak()].height + e.keyboardHeight;
    
    // Landscape case
    let isLandscape = window.matchMedia('(orientation: landscape)').matches;
    if (isLandscape) {
      newHeight = this.instance.screen_height;
    }

    // higher than screen + offsets
    if (newHeight > this.instance.screen_height - 80) {
      newHeight = this.instance.screen_height - 80;
    }

    // Move pane up if new position more than 50px
    if (newHeight - 50 >= this.settings.breaks[this.instance.currentBreak()].height) {
      this.instance.moveToHeight(newHeight);
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

    if (this.device.android) {
      this.fixAndroidResize();
    }    

    if (this.inputBluredbyMove) {
      this.inputBluredbyMove = false;
      return;
    } 

    if (!this.instance.isHidden()) {
      this.instance.moveToBreak(this.breakpoints.prevBreakpoint);
    }
  }

  /**
   * Window resize event
   * TODO: Prevent android unlock events
   * @param e
   */
  public onWindowResizeCb = (e) => this.onWindowResize(e);
  private async onWindowResize(e) {
    // We should separate keyboard and resize events
    // If form element active - recognize here as KeyboardWillShow
    if (this.isFormElement(document.activeElement)) {
      return;
    }
    if (!this.isFormElement(document.activeElement) 
        && this.keyboardVisible) {
      this.keyboardVisible = false;
      return;
    }

    await new Promise((resolve) => setTimeout(() => resolve(true), 150));
    this.instance.updateScreenHeights();
    this.breakpoints.buildBreakpoints(JSON.parse(this.breakpoints.lockedBreakpoints));
  }

  /**
   * Private class methods
   */

  /**
   * Topper Than Top
   * Lower Than Bottom
   * Otherwise don't changes
   */
   private handleTopperLowerPositions(newVal:number, diffY: number):number {
    // Non-inverse (normal) gestures
    if (!this.settings.inverse) {
      // Disallow drag topper than top point
      if (!this.settings.upperThanTop 
          && (newVal <= this.breakpoints.topper)) {
        return this.breakpoints.topper;
      }

      // Allow drag topper than top point
      if (newVal <= this.breakpoints.topper 
          && this.settings.upperThanTop) {
        const screenDelta = this.instance.screen_height - this.instance.screenHeightOffset;
        const differKoef = (screenDelta - this.instance.getPanelTransformY()) / (screenDelta - this.breakpoints.topper) / 8;
        return this.instance.getPanelTransformY() + (diffY * differKoef);
      }

      // Disallow drag lower then bottom 
      if (!this.settings.lowerThanBottom
          && newVal >= this.breakpoints.bottomer) {
        return this.breakpoints.bottomer;
      }
    } 
    
    if (this.settings.inverse) {
      // Inverse gestures
      // Allow drag topper than top point
      if (newVal >= this.breakpoints.topper 
          && this.settings.upperThanTop) {
        const screenDelta = this.instance.screen_height - this.instance.screenHeightOffset;
        const differKoef = (screenDelta - this.instance.getPanelTransformY()) / (screenDelta - this.breakpoints.topper) / 8;
        return this.instance.getPanelTransformY() + (diffY * differKoef);
      }
      
      // Disallow drag topper than top point
      if (!this.settings.upperThanTop 
          && (newVal >= this.breakpoints.topper)) {
        return this.breakpoints.topper;
      }
    }
  }

  private getEvetClientYX(ev, name) {
    const targetTouch = ev.type === name && ev.targetTouches && (ev.targetTouches[0] || ev.changedTouches[0]);
    const clientY: number = ev.type === name ? targetTouch.clientY : ev.clientY;
    const clientX: number = ev.type === name ? targetTouch.clientX : ev.clientX;
    const timeDiff: number = (Date.now()) - (this.steps[this.steps.length - 1]?.time || 0);
    const distanceY: number = Math.abs(clientY - (this.steps[this.steps.length - 1]?.posY || 0));
    const velocityY: number = distanceY / timeDiff;
    return {clientY, clientX, velocityY};
  }

  /**
   * Fix android keyboard issue with transition 
   * (resize window frame height on hide/show)
   */
  private fixAndroidResize() {
    if (!this.instance.paneEl) return;
    const ionApp:any = document.querySelector('ion-app');

    window.requestAnimationFrame(() => {
      this.instance.wrapperEl.style.width = '100%';
      this.instance.paneEl.style.position = 'absolute';
      window.requestAnimationFrame(() => {
        this.instance.wrapperEl.style.width = 'unset';
        this.instance.paneEl.style.position = 'fixed';
      });
    });
  }

  private willScrolled(t): boolean {
    if (!(this.isElementScrollable(this.instance.overflowEl)
        && this.instance.overflowEl.style.overflow !== 'hidden')) {
      return false;
    }
    return true;
  }

  private isPaneDescendant(el): boolean {
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

  private isElementScrollable(el):boolean {
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

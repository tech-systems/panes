import { CupertinoPane, CupertinoSettings } from 'cupertino-pane';
import { Device } from './device';

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
  private steps: any[] = [];  
  private inputBlured: boolean = false;
  
  constructor(private instance: CupertinoPane, 
              private settings: CupertinoSettings, 
              private device: Device) {
  }

  /**
   * Touch Start Event
   * @param t 
   */
  public touchStartCb = (t) => this.touchStart(t);
  private touchStart(t) {
    // Event emitter
    this.settings.onDragStart(t as CustomEvent);

    if (this.instance.disableDragEvents) return;

    // Allow clicks by default, disallow on move
    this.allowClick = true;

    // Allow touch angle by default, disallow no move with condition
    this.disableDragAngle = false;

    const targetTouch = t.type === 'touchstart' && t.targetTouches && (t.targetTouches[0] || t.changedTouches[0]);
    const screenY = t.type === 'touchstart' ? targetTouch.clientY : t.clientY;
    const screenX = t.type === 'touchstart' ? targetTouch.clientX : t.clientX;
    if (t.type === 'mousedown') this.pointerDown = true;

    this.startY = screenY;
    this.startX = screenX;

    // if overflow content was scrolled
    // increase to scrolled value
    if (this.isDragScrollabe(t.path || t.composedPath())) {
      this.startY += this.contentScrollTop;  
    }
    this.steps.push(this.startY);
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
    // Event emitter
    this.settings.onDrag(t as CustomEvent);

    if (this.instance.disableDragEvents) return;
    if (this.disableDragAngle) return;

    if (this.settings.touchMoveStopPropagation) {
      t.stopPropagation();
    }

    // Handle desktop/mobile events
    const targetTouch = t.type === 'touchmove' && t.targetTouches && (t.targetTouches[0] || t.changedTouches[0]);
    const screenY = t.type === 'touchmove' ? targetTouch.clientY : t.clientY;
    const screenX = t.type === 'touchmove' ? targetTouch.clientX : t.clientX;
    if(t.type === 'mousemove' && !this.pointerDown) return;
    
    // Delta
    let n = screenY;
    let v = screenX;
    const diffY = n - this.steps[this.steps.length - 1];
    let newVal = this.instance.getPanelTransformY() + diffY;

    // textarea scrollbar
    if (this.isFormElement(t.target) 
      && this.isElementScrollable(t.target)) {
      return;
    }
        
    // Detect if input was blured
    if (this.steps.length > 2) {
      if (this.isFormElement(document.activeElement)
      && !(this.isFormElement(t.target))) {
        (<any>document.activeElement).blur();
        this.inputBlured = true;
      }
    }

    // Touch angle
    if (this.settings.touchAngle) {
      let touchAngle;
      const diffX = v - this.startX;
      const diffY = n - this.startY;
      touchAngle = (Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180) / Math.PI;
      if (diffX * diffX + diffY * diffY >= 25 
          && (90 - touchAngle > this.settings.touchAngle)) {
        this.disableDragAngle = true;
        return;
      }
    }

    // Not allow move panel with positive overflow scroll
    if (this.isDragScrollabe(t.path || t.composedPath()) 
          && this.instance.overflowEl.style.overflowY === 'auto') {
      this.instance.overflowEl.addEventListener('scroll', (s: any) => {
        this.contentScrollTop = s.target.scrollTop;
      });

      if (this.settings.inverse && this.willScrolled(t)) {
        this.contentScrollTop = 0;
        return;
      }

      // Scrolled -> Disable drag
      if ((newVal > this.instance.topper && this.contentScrollTop > 0) 
          || (newVal <= this.instance.topper)) { 
        return;
      }
    }

    // Disallow drag topper than top point
    if (!this.settings.inverse 
        && !this.settings.upperThanTop && (newVal <= this.instance.topper)) {
      this.instance.paneEl.style.transform = `translateY(${this.instance.topper}px) translateZ(0px)`;
      return;
    }

    // Allow drag topper than top point
    if (newVal <= this.instance.topper && this.settings.upperThanTop) {
      const differKoef = ((-this.instance.topper + this.instance.topper - this.instance.getPanelTransformY()) / this.instance.topper) / -8;
      newVal = this.instance.getPanelTransformY() + (diffY * differKoef);
    }

    // Disallow drag lower then bottom 
    if ((!this.settings.lowerThanBottom || this.settings.inverse) 
        && (newVal >= this.instance.bottomer)) {
      this.instance.paneEl.style.transform = `translateY(${this.instance.bottomer}px) translateZ(0px)`;
      this.instance.checkOpacityAttr(newVal);
      return;
    }

    // Disallow accidentaly clicks while slide gestures
    this.allowClick = false;

    this.instance.checkOpacityAttr(newVal);
    this.instance.checkOverflowAttr(newVal);
    this.instance.doTransition({type: 'move', translateY: newVal});
    this.steps.push(n);
  }

  /**
   * Touch End Event
   * @param t 
   */
  public touchEndCb = (t) => this.touchEnd(t);
  private touchEnd(t) {

    if (this.instance.disableDragEvents) return;

    const targetTouch = t.type === 'touchmove' && t.targetTouches && (t.targetTouches[0] || t.changedTouches[0]);
    const screenY = t.type === 'touchmove' ? targetTouch.clientY : t.clientY;
    if (t.type === 'mouseup') this.pointerDown = false;

    // Determinate nearest point
    let closest = this.instance.getClosestBreakY();
    // Swipe - next (if differ > 10)
    const diff =  this.steps[this.steps.length - 1] - this.steps[this.steps.length - 2];
    // Set sensivity lower for web
    const swipeNextSensivity = window.hasOwnProperty('cordova') 
      ? (this.settings.fastSwipeSensivity + 1) : this.settings.fastSwipeSensivity; 
    const fastSwipeNext = (Math.abs(diff) >= swipeNextSensivity);
    if (fastSwipeNext) {
      closest = this.instance.swipeNextPoint(diff, swipeNextSensivity, closest);

      // Fast swipe toward bottom - close
      if (this.settings.fastSwipeClose 
          && this.instance.currentBreakpoint < closest) {        
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
    this.instance.currentBreakpoint = closest;

    // Event emitter
    this.settings.onDragEnd(t as CustomEvent);

    // tap event
    if (isNaN(diff) || blurTapEvent) {
      return;
    }

    this.instance.checkOpacityAttr(this.instance.currentBreakpoint);
    this.instance.checkOverflowAttr(this.instance.currentBreakpoint);

    // Bottom closable
    if (this.settings.bottomClose && closest === this.instance.breaks['bottom']) {
      this.instance.destroy({animate:true});
      return;
    }
    
    // Simulationiusly emit event when touchend exact with next position (top)
    if (this.instance.getPanelTransformY() === closest) {
      this.settings.onTransitionEnd({target: this.instance.paneEl});
    }

    this.instance.doTransition({type: 'end', translateY: closest});
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
      if (this.instance.breaks['bottom'] === this.instance.getPanelTransformY()) {
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
    if (this.device.android) {
      setTimeout(() => this.fixAndroidResize(), 20);
    }

    this.instance.prevBreakpoint = Object.entries(this.instance.breaks).find(val => val[1] === this.instance.getPanelTransformY())[0];
    let newHeight = this.settings.breaks[this.instance.currentBreak()].height + e.keyboardHeight;

    if (this.instance.screen_height < newHeight) {
      let diff = newHeight - this.instance.screen_height + (135 * 0.35);
      newHeight = this.instance.screen_height - (135 * 0.35);
      this.instance.setOverflowHeight(e.keyboardHeight);
      this.instance.moveToBreak(this.settings.breaks.top.enabled ? 'top' : 'middle');
    } else {
      this.instance.setOverflowHeight(e.keyboardHeight);
      this.instance.moveToHeight(newHeight);
      setTimeout(() => this.instance.overflowEl.scrollTop = (<any>document.activeElement).offsetTop);
    }
  }

  /**
   * Close Cordova Keyboard event
   * @param e
   */
  public onKeyboardHideCb = (e) => this.onKeyboardHide(e);
  private onKeyboardHide(e) {
    if (this.device.android) {
      this.fixAndroidResize();
    }    

    if (this.inputBlured) {
      this.inputBlured = false;
    } else {
      this.instance.moveToBreak(this.instance.prevBreakpoint);
    }

    setTimeout(() => this.instance.setOverflowHeight());
  }

  /**
   * Private class methods
   */

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

  /** 
   * Check if drag event fired by scrollable element
   */
  private isDragScrollabe(path):boolean {
    return !!path.find(item => item === this.instance.overflowEl);
  }

  private willScrolled(t): boolean {
    if (!(this.isElementScrollable(this.instance.overflowEl)
        && this.instance.overflowEl.style.overflow !== 'hidden'
        && this.isDragScrollabe(t.path || t.composedPath()))) {
      return false;
    }
    return true;
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
}
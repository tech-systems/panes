import { Support } from './support';
import { Device } from './device';
import { Events } from './events';
import { CupertinoSettings, PaneBreaks, ZStackSettings } from './models';
import { Settings } from './settings';
import { Breakpoints } from './breakpoints';
import { Transitions } from './transitions';
import { ZStack } from './z-stack';

export class CupertinoPane {  
  public disableDragEvents: boolean = false;
  public screen_height: number;
  public screenHeightOffset: number;
  public preventDismissEvent: boolean = false;
  public preventedDismiss: boolean = false;
  public rendered: boolean = false;
  
  public wrapperEl: HTMLDivElement;
  public paneEl: HTMLDivElement;
  public overflowEl: HTMLElement;
  public el: HTMLElement;
  public contentEl: HTMLElement;
  public parentEl: HTMLElement;
  public backdropEl: HTMLDivElement;
  public followerEl: HTMLElement;
  private draggableEl: HTMLDivElement;
  private moveEl: HTMLDivElement;
  private destroyButtonEl: HTMLDivElement;

  private settings: CupertinoSettings = (new Settings()).instance;
  private device: Device = new Device();
  private events: Events;
  private breakpoints: Breakpoints;
  private transitions: Transitions;
  private zStack: ZStack;

  constructor(private selector: (string | HTMLElement), 
              conf: CupertinoSettings = {}) {
    // Element or selector
    if (selector instanceof HTMLElement) {
      this.selector = selector;
    } else {
      this.selector = <HTMLElement>document.querySelector(selector);
    }

    // Unable attach selector or DOM element
    if (!this.selector) {
      console.warn('Cupertino Pane: wrong selector or DOM element specified', this.selector);
      return;
    }
    
    // Pane class created
    if (this.isPanePresented()) {
      console.error('Cupertino Pane: specified selector or DOM element already in use', this.selector);
      return;
    }

    this.el = this.selector;
    this.el.style.display = 'none';
    this.settings = {...this.settings, ...conf};
    
    if (this.settings.parentElement) {
      this.settings.parentElement = <HTMLElement>document.querySelector(
        this.settings.parentElement
      );
    } else {
      this.settings.parentElement = this.el.parentElement;
    }

    this.breakpoints = new Breakpoints(this, this.settings);
    this.zStack = new ZStack(this, this.settings, this.breakpoints);
    this.transitions = new Transitions(this, this.settings, this.breakpoints, this.zStack);
    this.events = new Events(this, this.settings, this.device, this.breakpoints, this.transitions);
  }

  private drawBaseElements() {
    // Parent 
    this.parentEl = this.settings.parentElement;
    
    // Wrapper
    this.wrapperEl = document.createElement('div');
    this.wrapperEl.classList.add('cupertino-pane-wrapper');
    if (this.settings.inverse) {
      this.wrapperEl.classList.add('inverse');
    }
    if (this.settings.cssClass) {
      this.wrapperEl.className += ` ${this.settings.cssClass}`;
    };
    let internalStyles: string = '';
    internalStyles += `
      .cupertino-pane-wrapper {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
      }
    `;

    // Panel (appying transform ASAP, avoid timeouts for animate:true)
    this.paneEl = document.createElement('div');
    this.paneEl.style.transform = `translateY(${this.screenHeightOffset}px) translateZ(0px)`;
    this.paneEl.classList.add('pane');
    internalStyles += `
      .cupertino-pane-wrapper .pane {
        position: fixed;
        z-index: 11;
        width: 100%;
        max-width: 500px;
        left: 0px;
        right: 0px;
        margin-left: auto;
        margin-right: auto;
        background: var(--cupertino-pane-background, #ffffff);
        color: var(--cupertino-pane-color, #333333);
        box-shadow: var(--cupertino-pane-shadow, 0 4px 16px rgba(0,0,0,.12));
        will-change: transform;
        padding-top: 15px; 
        border-radius: var(--cupertino-pane-border-radius, 20px) 
                       var(--cupertino-pane-border-radius, 20px) 
                       0 0;
      }
      .cupertino-pane-wrapper.inverse .pane {
        padding-bottom: 15px; 
        border-radius: 0 0 20px 20px;
        border-radius: 0 0
                       var(--cupertino-pane-border-radius, 20px) 
                       var(--cupertino-pane-border-radius, 20px);
      }
    `;

    // Draggable
    this.draggableEl = document.createElement('div');
    this.draggableEl.classList.add('draggable');
    if (this.settings.draggableOver) {
      this.draggableEl.classList.add('over');
    }
    internalStyles += `
      .cupertino-pane-wrapper .draggable {
        padding: 5px;
        position: absolute;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        height: 30px;
        z-index: -1;
        top: 0;
        bottom: initial;
      }
      .cupertino-pane-wrapper .draggable.over {
        top: -30px;
        padding: 15px;
      }
      .cupertino-pane-wrapper.inverse .draggable {
        bottom: 0;
        top: initial;
      }
      .cupertino-pane-wrapper.inverse .draggable.over {
        bottom: -30px;
        top: initial;
      }
    `;

    // Move
    this.moveEl = document.createElement('div');
    this.moveEl.classList.add('move');
    internalStyles += `
      .cupertino-pane-wrapper .move {
        margin: 0 auto;
        height: 5px;
        background: var(--cupertino-pane-move-background, #c0c0c0);
        width: 36px;
        border-radius: 4px;
      }
      .cupertino-pane-wrapper .draggable.over .move {
        width: 70px; 
        background: var(--cupertino-pane-move-background, rgba(225, 225, 225, 0.6));
        ${Support.backdropFilter ? `
          backdrop-filter: saturate(180%) blur(20px);
          -webkit-backdrop-filter: saturate(180%) blur(20px);
        ` : ``}
      }
      .cupertino-pane-wrapper.inverse .move {
        margin-top: 15px;
      }
      .cupertino-pane-wrapper.inverse .draggable.over .move {
        margin-top: -5px;
      }
    `;
    
    // Destroy button
    this.destroyButtonEl = document.createElement('div');
    this.destroyButtonEl.classList.add('destroy-button');
    internalStyles += `
      .cupertino-pane-wrapper .destroy-button {
        width: 26px;
        height: 26px;
        position: absolute;
        background: var(--cupertino-pane-destroy-button-background, #ebebeb);
        fill: var(--cupertino-pane-icon-close-color, #7a7a7e);
        right: 20px;
        z-index: 14;
        border-radius: 100%;
        top: 16px;
      }
    `;

    // Content user element
    this.contentEl = this.el;
    this.contentEl.style.transition = `opacity ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
    this.contentEl.style.overflowX = 'hidden';

    // Backdrop
    internalStyles += `
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
      }
    `;
    
    // Inject internal CSS
    this.addStyle(internalStyles);
    
    // inject DOM
    this.parentEl.appendChild(this.wrapperEl);
    this.wrapperEl.appendChild(this.paneEl);
    this.paneEl.appendChild(this.contentEl);
    if (this.settings.showDraggable) {
      this.paneEl.appendChild(this.draggableEl);
      this.draggableEl.appendChild(this.moveEl);
    }
  }

  async present(conf: {animate: boolean} = {animate: false}): Promise<CupertinoPane> {
      if (!this.el) return;

      // Pane already exist and was rendered
      if (this.isPanePresented() && this.rendered) {
        this.moveToBreak(this.settings.initialBreak);
        return;
      }
      
      // Pane already exist but not rendered in this class
      if (this.isPanePresented() && !this.rendered) {
        console.warn('Cupertino Pane: specified selector or DOM element already in use', this.selector);
        return;
      }

      // Emit event
      this.settings.onWillPresent();
      
      this.updateScreenHeights();
      this.drawBaseElements();
      await this.setBreakpoints();

      // Necessary Inlines with breakpoints
      this.paneEl.style.height = `${this.getPaneHeight()}px`;
      if (this.settings.inverse) {
        this.paneEl.style.top = `-${this.breakpoints.bottomer - this.settings.bottomOffset}px`;
      }

      // Show elements
      // For some reason need timeout after show wrapper to make 
      // initial transition works
      // TODO: timeout -> intersectionObserver + fix zStack
      this.wrapperEl.style.display = 'block';
      await new Promise(resolve => setTimeout(resolve, 100));
      this.contentEl.style.display = 'block';
      this.wrapperEl.classList.add('rendered');
      this.rendered = true;
      
      if (this.settings.followerElement) {
        if (!<HTMLElement>document.querySelector(this.settings.followerElement)) {
          console.warn('Cupertino Pane: wrong follower element selector specified', this.settings.followerElement);
          return;
        }

        this.followerEl = <HTMLElement>document.querySelector(
          this.settings.followerElement
        );
        this.followerEl.style.willChange = 'transform, border-radius';
        this.followerEl.style.transform = `translateY(0px) translateZ(0px)`;
        this.followerEl.style.transition = this.transitions.buildTransitionValue(this.settings.breaks[this.currentBreak()]?.bounce);
      }

      // Assign multiplicators for push elements
      if (this.settings.zStack) {
        this.setZstackConfig(this.settings.zStack);
        this.zStack.setPushMultiplicators();
      }

      if ((this.settings.buttonClose && this.settings.buttonDestroy) && !this.settings.inverse) {
        this.paneEl.appendChild(this.destroyButtonEl);
        this.destroyButtonEl.addEventListener('click', (t) => this.destroy({animate:true, destroyButton: true}));
        this.destroyButtonEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M278.6 256l68.2-68.2c6.2-6.2 6.2-16.4 0-22.6-6.2-6.2-16.4-6.2-22.6 0L256 233.4l-68.2-68.2c-6.2-6.2-16.4-6.2-22.6 0-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3l68.2 68.2-68.2 68.2c-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3 6.2 6.2 16.4 6.2 22.6 0l68.2-68.2 68.2 68.2c6.2 6.2 16.4 6.2 22.6 0 6.2-6.2 6.2-16.4 0-22.6L278.6 256z"/>
        </svg>`;
      }

      if (this.settings.bottomClose) {
        this.settings.breaks.bottom.enabled = true;
      }

      if (this.settings.freeMode) {
        this.settings.lowerThanBottom = false;
      }

      if (this.settings.backdrop) {
        this.renderBackdrop();
      }
      this.checkOpacityAttr(this.breakpoints.currentBreakpoint);
      
      /****** Fix android issues *******/
      if (this.device.android) {
        // Body patch prevent android pull-to-refresh
        document.body.style['overscrollBehaviorY'] = 'none';  
      }      

      /****** Animation & Transition ******/
      if (conf.animate) {
        await this.transitions.doTransition({type: 'present', translateY: this.breakpoints.breaks[this.settings.initialBreak]});
      } else {
        // No initial transitions
        this.breakpoints.prevBreakpoint = this.settings.initialBreak;
        this.paneEl.style.transform = `translateY(${this.breakpoints.breaks[this.settings.initialBreak]}px) translateZ(0px)`;
        if (this.settings.backdrop) {
          this.backdropEl.style.display = `block`;
        }
        if (this.settings.zStack) {
          this.settings.zStack.pushElements.forEach(item => 
            this.zStack.pushTransition(
              document.querySelector(item), 
              this.breakpoints.breaks[this.settings.initialBreak], 'unset'
            )
          );
        }
        // Emit event
        this.settings.onDidPresent();
      }

      // Some timeout to get offsetTop
      await new Promise((resolve) => setTimeout(() => resolve(true), 150));
      this.scrollElementInit();
      this.checkOverflowAttr(this.breakpoints.currentBreakpoint);

      /****** Attach Events *******/
      this.events.attachAllEvents();

      return this;
  }

  public getPaneHeight(): number {
    if (!this.settings.inverse) {
      return this.screen_height - this.breakpoints.topper - this.settings.bottomOffset;
    } 

    return this.breakpoints.bottomer - this.settings.bottomOffset;
  }

  public updateScreenHeights():void {
    if (this.settings.inverse) {
      this.screen_height = window.innerHeight;
      this.screenHeightOffset = 0;
    } else {
      this.screen_height = window.innerHeight;
      this.screenHeightOffset = window.innerHeight;
    }
  }

  public scrollElementInit() {
    let attrElements = this.el.querySelectorAll('[overflow-y]');
    if (!attrElements.length || attrElements.length > 1) {
      this.overflowEl = this.contentEl;
    } else {
      this.overflowEl = <HTMLElement>attrElements[0];
      this.overflowEl.style.overflowX = 'hidden';
    }
    
    if (this.settings.topperOverflow) {   
      if (this.settings.upperThanTop) {
        console.warn('Cupertino Pane: "upperThanTop" allowed for disabled "topperOverflow"');
      }

      this.setOverflowHeight();
    }
  }

  public setOverflowHeight(offset = 0) {
    if (!this.settings.inverse) {
      this.overflowEl.style.height = `${this.getPaneHeight()
        - this.settings.topperOverflowOffset
        - this.overflowEl.offsetTop
        - offset}px`;
    } else {
      this.overflowEl.style.height = `${this.getPaneHeight()
        - 30
        - this.settings.topperOverflowOffset
        - this.overflowEl.offsetTop}px`;
    }
  }

  public checkOpacityAttr(val) {
    let attrElements = this.el.querySelectorAll('[hide-on-bottom]');
    if (!attrElements.length) return;
    if (this.settings.inverse) return;
    attrElements.forEach((item) => {
      (<HTMLElement>item).style.transition = `opacity ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
      (<HTMLElement>item).style.opacity = (val >= this.breakpoints.breaks['bottom']) ? '0' : '1';
    });
  }

  public checkOverflowAttr(val) {
    if (!this.settings.topperOverflow 
        || !this.overflowEl) {
      return;
    }

    if (!this.settings.inverse) {
      this.overflowEl.style.overflowY = (val <= this.breakpoints.topper) ? 'auto' : 'hidden';
    } else {
      this.overflowEl.style.overflowY = (val >= this.breakpoints.bottomer) ? 'auto' : 'hidden';
    }
  }

  public isPanePresented():boolean {
    // Check through all presented panes
    let wrappers = Array.from(document.querySelectorAll(`.cupertino-pane-wrapper.rendered`));
    if (!wrappers.length) return false;
    return wrappers.find((item) => item.contains(<HTMLElement>this.selector)) ? true: false;
  }

  public swipeNextPoint = (diff, maxDiff, closest) => {
    let brs = {};
    let settingsBreaks = {};

    if (this.settings.inverse) {
      brs['top'] = this.breakpoints.breaks['bottom'];
      brs['middle'] = this.breakpoints.breaks['middle'];
      brs['bottom'] = this.breakpoints.breaks['top'];
      settingsBreaks['top'] = {...this.settings.breaks['bottom']};
      settingsBreaks['middle'] = {...this.settings.breaks['middle']};
      settingsBreaks['bottom'] = {...this.settings.breaks['top']};
    } else {
      brs = {...this.breakpoints.breaks}
      settingsBreaks = {...this.settings.breaks};
    }

    if (this.breakpoints.currentBreakpoint === brs['top']) {
        if (diff > maxDiff) {
          if (settingsBreaks['middle'].enabled) { return brs['middle']; }
          if (settingsBreaks['bottom'].enabled) { 
            if (brs['middle'] < closest) {
              return closest;
            }
            return brs['bottom']; 
          }
        }
        return brs['top'];
    }

    if (this.breakpoints.currentBreakpoint === brs['middle']) {
        if (diff < -maxDiff) {
          if (settingsBreaks['top'].enabled) { return brs['top']; }
        }
        if (diff > maxDiff) {
          if (settingsBreaks['bottom'].enabled) { return brs['bottom']; }
        }
        return brs['middle'];
    }

    if (this.breakpoints.currentBreakpoint === brs['bottom']) {
        if (diff < -maxDiff) {
          if (settingsBreaks['middle'].enabled) { 
            if (brs['middle'] > closest) {
              return closest;
            }
            return brs['middle']; 
          }
          if (settingsBreaks['top'].enabled) { return brs['top']; }
        }
        return brs['bottom'];
    }

    return closest;
  }

  private isBackdropPresented() {
    return document.querySelector(`.cupertino-pane-wrapper .backdrop`) 
    ? true : false;
  }

  private renderBackdrop() {
    this.backdropEl = document.createElement('div');
    this.backdropEl.classList.add('backdrop');
    this.backdropEl.style.transition = `all ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
    this.backdropEl.style.backgroundColor = `rgba(0,0,0, ${this.settings.backdropOpacity})`;
    this.wrapperEl.appendChild(this.backdropEl);
    this.backdropEl.addEventListener('click', (t) => this.settings.onBackdropTap());
  }

  /**
   * Utility function to add minified internal CSS to head.
   * @param {string} styleString
   */
  private addStyle(styleString): void {
    if (document.querySelector('#cupertino-panes-internal')) return;
    const style = document.createElement('style');
    style.id = 'cupertino-panes-internal';
    styleString = styleString.replace(/\s\s+/g, ' ');
    style.textContent = styleString;
    document.head.prepend(style);
  };
  
  /**
   * Backdrop
   */
  public backdrop(conf = { show: true }) {
    if (!this.isPanePresented()) {
      console.warn(`Cupertino Pane: Present pane before call backdrop()`);
      return null;
    }

    if (!this.isBackdropPresented()) {
      this.renderBackdrop();
      // Reset events to attach backdrop stop propagation
      this.events.resetEvents();
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

  // TODO: static method
  public getPanelTransformY():number {
    const translateYRegex = /\.*translateY\((.*)px\)/i;
    return parseFloat(translateYRegex.exec(this.paneEl.style.transform)[1]);
  }

  /************************************
   * Public user methods
   */

  public setZstackConfig(zStack: ZStackSettings): void {
    // Allow user to reset config
    this.settings.zStack = zStack ? {...this.zStack.zStackDefaults, ...zStack} : null;
  }

  /**
   * Prevent dismiss event
   */
  public preventDismiss(val: boolean = false): void {
    this.preventDismissEvent = val;
  }

  /**
   * Disable pane drag events
   */
  public disableDrag(): void {
    this.disableDragEvents = true;
  }

  /**
   * Enable pane drag events
   */  
  public enableDrag(): void {
    this.disableDragEvents = false;
  }

  /**
   * Public user method to reset breakpoints
   * @param conf 
   */
  public async setBreakpoints(conf?: PaneBreaks, bottomOffset?: number) {
    if (this.isPanePresented() && !conf) {
      console.warn(`Cupertino Pane: Provide any breaks configuration`);
      return;
    }
    await this.breakpoints.buildBreakpoints(conf, bottomOffset);
  }

  public async calcFitHeight() {
    // Allow user to call method asap, dont check with this.isPanePresented()
    if (!this.wrapperEl || !this.el) {
      return null;
    }
    
    if (this.breakpoints.calcHeightInProcess) {
      console.warn(`Cupertino Pane: calcFitHeight() already in process`);
      return null;
    }

    await this.breakpoints.buildBreakpoints(this.breakpoints.lockedBreakpoints);
  }

  public async moveToBreak(val: string, type: string = 'breakpoint'): Promise<true> {
    if (!this.isPanePresented()) {
      console.warn(`Cupertino Pane: Present pane before call moveToBreak()`);
      return null;
    }

    if (!this.settings.breaks[val].enabled) {
      console.warn('Cupertino Pane: %s breakpoint disabled', val);
      return;
    }

    this.checkOpacityAttr(this.breakpoints.breaks[val]);
    this.checkOverflowAttr(this.breakpoints.breaks[val]);
    await this.transitions.doTransition({type, translateY: this.breakpoints.breaks[val]});
    this.breakpoints.currentBreakpoint = this.breakpoints.breaks[val];
    return Promise.resolve(true);
  }

  public moveToHeight(val: number) {
    if (!this.isPanePresented()) {
      console.warn(`Cupertino Pane: Present pane before call moveToHeight()`);
      return null;
    }

    let translateY = this.screenHeightOffset ? this.screen_height - val : val; 
    this.checkOpacityAttr(translateY);
    this.transitions.doTransition({type: 'breakpoint', translateY });    
  }

  public hide() {
    if (!this.isPanePresented()) {
      console.warn(`Cupertino Pane: Present pane before call hide()`);
      return null;
    }

    if (this.isHidden()) {
      console.warn(`Cupertino Pane: Pane already hidden`);
      return null;
    }

    this.transitions.doTransition({type: 'hide', translateY: this.screenHeightOffset});
  }

  public isHidden(): (boolean|null) {
    if (!this.isPanePresented()) {
      console.warn(`Cupertino Pane: Present pane before call isHidden()`);
      return null;
    }
    
    return this.paneEl.style.transform === `translateY(${this.screenHeightOffset}px) translateZ(0px)`;
  }

  public currentBreak(): (string|null) {
    if (!this.isPanePresented()) {
      console.warn(`Cupertino Pane: Present pane before call currentBreak()`);
      return null;
    }

    return this.breakpoints.getCurrentBreakName();
  };

  public async destroy(conf: {
      animate: boolean, 
      destroyButton?: boolean
    } = {
      animate: false, 
      destroyButton: false
    }): Promise<true> {

    if (!this.isPanePresented()) {
      console.warn(`Cupertino Pane: Present pane before call destroy()`);
      return null;
    }

    // Prevent dismiss
    if (this.preventDismissEvent) {
      // Emit event with prevent dismiss if not already sent from drag event
      if (!this.preventedDismiss) {
        this.settings.onWillDismiss({prevented: true} as any);
        this.moveToBreak(this.breakpoints.prevBreakpoint);
      }
      return;
    }

    // Emit event
    this.settings.onWillDismiss();

    /****** Animation & Transition ******/
    if (conf.animate) {
      await this.transitions.doTransition({type: 'destroy', translateY: this.screenHeightOffset, destroyButton: conf.destroyButton}); 
    } else {
      this.destroyResets();
      // Emit event
      this.settings.onDidDismiss({destroyButton: conf.destroyButton} as any);
    }
  }

  public destroyResets(): void {
    this.parentEl.appendChild(this.contentEl);
    this.wrapperEl.remove();
    
    /****** Detach Events *******/
    this.events.detachAllEvents();

    // Clear pushed elements
    if (this.settings.zStack) {
      // this.clearPushMultiplicators();
    }

    // Reset vars
    delete this.rendered;
    delete this.breakpoints.prevBreakpoint;

    // Reset styles
    this.contentEl.style.display = 'none';
  }

}

import { Support } from './support';
import { Device } from './device';
import { Events } from './events';
import { CupertinoSettings, PaneBreaks } from './models';
import { Settings } from './settings';
import { Breakpoints } from './breakpoints';
import { Transitions } from './transitions';
import { on, emit } from './events-emitter';
import * as Modules from './modules';

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
  private styleEl: HTMLStyleElement;
  private draggableEl: HTMLDivElement;
  private moveEl: HTMLDivElement;
  private destroyButtonEl: HTMLDivElement;

  public settings: CupertinoSettings = (new Settings()).instance;
  private device: Device = new Device();
  public events: Events;
  public breakpoints: Breakpoints;
  public transitions: Transitions;
  public modules: {} = {};

  // Events emitter
  public eventsListeners: {} = {};
  public on: Function = on;
  public emit: Function = emit;

  // Temporary: modules public functions
  // should be moved under modules
  public calcFitHeight: (animated?: any) => Promise<any>;
  public backdrop: (conf: { show: true }) => void;
  public setZstackConfig: (zStack: any) => void;

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


    // Parent el as string or HTMLelement or get default element method
    let parentElement = this.el.parentElement;
    if (this.settings.parentElement) {
        parentElement = this.settings.parentElement instanceof HTMLElement
          ? this.settings.parentElement 
          : <HTMLElement>document.querySelector(this.settings.parentElement);
    }
    this.settings.parentElement = parentElement;


    // Events listeners
    if (this.settings.events) {
      Object.keys(this.settings.events).forEach(
        name => this.on(name, this.settings.events[name])
      );
    }

    // Core classes
    this.breakpoints = new Breakpoints(this, this.settings);
    this.transitions = new Transitions(this, this.settings, this.breakpoints);
    this.events = new Events(this, this.settings, this.device, this.breakpoints, this.transitions);

    // Install modules
    let allModules = Object.keys(Modules).map((key) => Modules[key]);
    let modules = this.settings.modules || allModules;
    modules.forEach((module) => this.modules[this.getModuleRef(module.name)] = new module(this));
  }

  private drawBaseElements() {
    // Style element on head
    this.styleEl = document.createElement('style');
    this.styleEl.id = `cupertino-pane-${(Math.random() + 1).toString(36).substring(7)}`;

    // Parent
    this.parentEl = <HTMLElement>this.settings.parentElement;
    
    // Wrapper
    this.wrapperEl = document.createElement('div');
    this.wrapperEl.classList.add('cupertino-pane-wrapper');
    if (this.settings.cssClass) {
      this.settings.cssClass.split(' ')
        .filter(item => !!item)
        .forEach(item => this.wrapperEl.classList.add(item));
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
        -webkit-user-select: none;
      }
      .cupertino-pane-wrapper .pane img {
        -webkit-user-drag: none;
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
    
    // Inject internal CSS
    this.styleEl.textContent = internalStyles.replace(/\s\s+/g, ' ');
    document.head.prepend(this.styleEl);
    
    // inject DOM
    this.parentEl.appendChild(this.wrapperEl);
    this.wrapperEl.appendChild(this.paneEl);
    this.paneEl.appendChild(this.contentEl);
    if (this.settings.showDraggable) {
      this.paneEl.appendChild(this.draggableEl);
      this.draggableEl.appendChild(this.moveEl);
    }

    // System event
    this.emit('DOMElementsReady');
  }

  async present(conf: {
      animate: boolean, 
      transition?: { duration?: number, from?: {}, to?: {}} 
    } = { animate: false }
  ): Promise<CupertinoPane> {
      if (!this.el || !document.body.contains(this.el)) {
        console.warn('Cupertino Pane: specified DOM element must be attached to the DOM');
        return;
      }

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
      this.emit('onWillPresent');
      
      this.updateScreenHeights();
      this.drawBaseElements();
      await this.setBreakpoints();

      // Necessary Inlines with breakpoints
      this.paneEl.style.height = `${this.getPaneHeight()}px`;

      // Custom transitions for present/destroy: set styles
      Object.assign(this.paneEl.style, conf?.transition?.from);

      // Show elements
      // For some reason need timeout after show wrapper to make 
      // initial transition works
      // TODO: resolve 100ms timeout with some render callbacks
      this.wrapperEl.style.display = 'block';
      await new Promise(resolve => setTimeout(resolve, 100));
      this.contentEl.style.display = 'block';
      this.wrapperEl.classList.add('rendered');
      this.rendered = true;
      
      // set overflow element
      this.scrollElementInit();
      this.checkOverflowAttr(this.breakpoints.currentBreakpoint);

      // System event
      this.emit('rendered');

      // Button destroy
      // TODO: Merge to one config
      if (this.settings.buttonDestroy) {
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

      this.setGrabCursor(true);
      this.checkOpacityAttr(this.breakpoints.currentBreakpoint);
      
      /****** Fix android issues *******/
      if (this.device.android) {
        // Body patch prevent android pull-to-refresh
        document.body.style['overscrollBehaviorY'] = 'none';  
      }      

      // System event
      this.emit('beforePresentTransition', {animate: conf.animate});
      
      if (conf.animate) {
        await this.transitions.doTransition({
          type: 'present', conf,
          translateY: this.breakpoints.breaks[this.settings.initialBreak]
        });
      } else {
        this.breakpoints.prevBreakpoint = this.settings.initialBreak;
        this.paneEl.style.transform = `translateY(${this.breakpoints.breaks[this.settings.initialBreak]}px) translateZ(0px)`;
      }

      /****** Attach Events *******/
      this.events.attachAllEvents();

      // Emit event
      this.emit('onDidPresent');

      return this;
  }

  public getPaneHeight(): number {
    return this.screen_height - this.breakpoints.topper - this.settings.bottomOffset;
  }

  public updateScreenHeights():void {
    this.screen_height = window.innerHeight;
    this.screenHeightOffset = window.innerHeight;
  }

  public scrollElementInit() {
    let attrElements = this.el.querySelectorAll('[overflow-y]');
    if (!attrElements.length || attrElements.length > 1) {
      this.overflowEl = this.contentEl;
    } else {
      this.overflowEl = <HTMLElement>attrElements[0];
      this.overflowEl.style.overflowX = 'hidden';
    }
    this.overflowEl.style.overscrollBehavior = 'none';
    
    if (this.settings.topperOverflow) {   
      if (this.settings.upperThanTop) {
        console.warn('Cupertino Pane: "upperThanTop" allowed for disabled "topperOverflow"');
      }

      this.setOverflowHeight();
    }
  }

  public setOverflowHeight(offset = 0) {
    this.overflowEl.style.height = `${this.getPaneHeight()
      - this.settings.topperOverflowOffset
      - this.overflowEl.offsetTop
      - offset}px`;
  }

  public checkOpacityAttr(val) {
    let attrElements = this.el.querySelectorAll('[hide-on-bottom]');
    if (!attrElements.length) return;
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

    this.overflowEl.style.overflowY = (val <= this.breakpoints.topper) ? 'auto' : 'hidden';
  }

  // TODO: replace with body.contains()
  public isPanePresented():boolean {
    // Check through all presented panes
    let wrappers = Array.from(document.querySelectorAll(`.cupertino-pane-wrapper.rendered`));
    if (!wrappers.length) return false;
    return wrappers.find((item) => item.contains(<HTMLElement>this.selector)) ? true: false;
  }

  private prepareBreaksSwipeNextPoint(): {brs: {}, settingsBreaks: {}} {
    return {
      brs: {...this.breakpoints.breaks}, 
      settingsBreaks: {...this.settings.breaks}
    };
  }

  public swipeNextPoint = (diff, maxDiff, closest) => {
    let { brs, settingsBreaks }  = this.prepareBreaksSwipeNextPoint();

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

  /**
   * Utility function to add minified internal CSS to head.
   * @param {string} styleString
   */
  public addStyle(styleString): void {
    this.styleEl.textContent += styleString.replace(/\s\s+/g, ' ');
  };

  private getModuleRef(className): string {
    return (className.charAt(0).toLowerCase() + className.slice(1)).replace('Module','');
  }

  /************************************
   * Public user methods
   */


  public getPanelTransformY():number {
    const translateYRegex = /\.*translateY\((.*)px\)/i;
    return parseFloat(translateYRegex.exec(this.paneEl.style.transform)[1]);
  }

  // TODO: merge to 1 function above
  public getPanelTransformX():number {
    const translateYRegex = /\.*translateX\((.*)px\)/i;
    let translateExec = translateYRegex.exec(this.paneEl.style.transform);
    return translateExec ? parseFloat(translateExec[1]) : 0;
  }


  /**
   * Prevent dismiss event
   */
  public preventDismiss(val: boolean = false): void {
    this.preventDismissEvent = val;
  }

  /**
   * GrabCursor for desktop
   */
  public setGrabCursor(enable: boolean, moving?: boolean) {
    if (!this.device.desktop) {
      return;
    }
    this.paneEl.style.cursor = enable ? (moving ? 'grabbing' : 'grab'): '';
  }

  /**
   * Disable pane drag events
   */
  public disableDrag(): void {
    this.disableDragEvents = true;
    this.setGrabCursor(false);
  }

  /**
   * Enable pane drag events
   */  
  public enableDrag(): void {
    this.disableDragEvents = false;
    this.setGrabCursor(true);
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

  public async moveToHeight(val: number): Promise<any> {
    if (!this.isPanePresented()) {
      console.warn(`Cupertino Pane: Present pane before call moveToHeight()`);
      return null;
    }

    let translateY = this.screenHeightOffset ? this.screen_height - val : val; 
    this.checkOpacityAttr(translateY);
    await this.transitions.doTransition({type: 'breakpoint', translateY });    
  }

  public async hide() {
    if (!this.isPanePresented()) {
      console.warn(`Cupertino Pane: Present pane before call hide()`);
      return null;
    }

    if (this.isHidden()) {
      console.warn(`Cupertino Pane: Pane already hidden`);
      return null;
    }

    await this.transitions.doTransition({type: 'hide', translateY: this.screenHeightOffset});
  }

  public isHidden(): (boolean|null) {
    if (!this.isPanePresented()) {
      console.warn(`Cupertino Pane: Present pane before call isHidden()`);
      return null;
    }
    
    return this.transitions.isPaneHidden;
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
      destroyButton?: boolean,
      transition?: { duration?: number, from?: {}, to?: {}}
    } = {
      animate: false, 
      destroyButton: false
    }): Promise<true> {

    // Experimentally allow to destroy, even if not currently in DOM,
    // instead of this.isPanePresented() check with rendered (#163 issue)
    if (!this.rendered) {
      console.warn(`Cupertino Pane: Present pane before call destroy()`);
      return null;
    }

    // Prevent dismiss
    if (this.preventDismissEvent) {
      // Emit event with prevent dismiss if not already sent from drag event
      if (!this.preventedDismiss) {
        this.emit('onWillDismiss', {prevented: true} as any);
        this.moveToBreak(this.breakpoints.prevBreakpoint);
      }
      return;
    }

    // Emit event
    this.emit('onWillDismiss');

    /****** Animation & Transition ******/
    if (conf.animate) {
      await this.transitions.doTransition({
        type: 'destroy', conf,
        translateY: this.screenHeightOffset, 
        destroyButton: conf.destroyButton
      }); 
    } else {
      this.destroyResets();
    }

    // Emit event
    this.emit('onDidDismiss', {destroyButton: conf.destroyButton} as any);
  }

  public destroyResets(): void {
    this.parentEl.appendChild(this.contentEl);
    this.wrapperEl.remove();
    this.styleEl.remove();
    
    /****** Detach Events *******/
    this.events.detachAllEvents();

    // Reset vars
    delete this.rendered;
    delete this.breakpoints.prevBreakpoint;

    // Reset styles
    this.contentEl.style.display = 'none';
  }

}

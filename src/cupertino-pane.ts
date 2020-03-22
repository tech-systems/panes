import { Support } from './support';
import { Device } from './device';

export class CupertinoPane {

  public settings: any = {
    initialBreak: 'middle',
    parentElement: null,
    backdrop: false,
    backdropTransparent: false, 
    animationType: 'ease',
    animationDuration: 300,
    darkMode: false,
    bottomClose: false,
    freeMode: false,
    buttonClose: true,
    topperOverflow: true,
    topperOverflowOffset: 0,
    showDraggable: true,
    clickBottomOpen: true,
    simulateTouch: true,
    passiveListeners: true,
    breaks: {},
    onDidDismiss: () => {},
    onWillDismiss: () => {},
    onDidPresent: () => {},
    onWillPresent: () => {},
    onDragStart: () => {},
    onDrag: () => {},
    onBackdropTap: () => {}
  };

  private defaultBreaksConf = {
    top: { enabled: true, offset: window.screen.height - (135 * 0.35)},
    middle: { enabled: true, offset: 300},
    bottom: { enabled: true, offset: 100},
  };
  private screen_height: number = window.screen.height;
  private steps: any[] = [];
  private startP: any;
  private pointerDown: boolean = false;
  private topper: number;
  private bottomer: number;
  private currentBreakpoint: number;
  private contentScrollTop: number;

  private breaks: {} = {}
  private brs: number[] = [];

  private parentEl: HTMLElement;
  private wrapperEl: HTMLDivElement;
  private paneEl: HTMLDivElement;
  private draggableEl: HTMLDivElement;
  private moveEl: HTMLDivElement;
  private contentEl: HTMLHeadingElement;
  private backdropEl: HTMLDivElement;
  private closeEl: HTMLDivElement;
  private overflowEl: HTMLElement;

  private device = new Device();

  constructor(private el, conf: any = {}) {
    this.settings = {...this.settings, ...conf};
    this.el = <HTMLDivElement>document.querySelector(this.el);
    this.el.style.display = 'none';
    
    if (this.settings.parentElement) {
      this.settings.parentElement = <HTMLElement>document.querySelector(
        this.settings.parentElement
      );
    } else {
      this.settings.parentElement = this.el.parentElement;
    }
  }

  private drawElements() {
      this.parentEl = this.settings.parentElement;

      // Wrapper
      this.wrapperEl = document.createElement('div');
      this.wrapperEl.className = `cupertino-pane-wrapper ${this.el.className}`;
      this.wrapperEl.style.position = 'absolute';
      this.wrapperEl.style.top = '0';
      this.wrapperEl.style.left = '0';

      // Panel
      this.paneEl = document.createElement('div');
      this.paneEl.className = 'pane';
      this.paneEl.style.position = 'fixed';
      this.paneEl.style.zIndex = '11';
      this.paneEl.style.width = '100%';
      this.paneEl.style.height = '100%';
      this.paneEl.style.background = '#ffffff';
      this.paneEl.style.borderTopLeftRadius = '20px';
      this.paneEl.style.borderTopRightRadius = '20px';
      this.paneEl.style.boxShadow = '0 4px 16px rgba(0,0,0,.12)';
      this.paneEl.style.overflow = 'hidden';
      this.paneEl.style.transform = `translateY(${this.breaks[this.settings.initialBreak]}px)`;

      // Draggable
      this.draggableEl = document.createElement('div');
      this.draggableEl.className = 'draggable';
      this.draggableEl.style.padding = '5px';

      // Move
      this.moveEl = document.createElement('div');
      this.moveEl.className = 'move';
      this.moveEl.style.margin = '0 auto';
      this.moveEl.style.height = '5px';
      this.moveEl.style.background = '#c0c0c0';
      this.moveEl.style.width = '36px';
      this.moveEl.style.borderRadius = '4px';

      // Content
      this.contentEl = this.el;
      this.contentEl.style.display = '';
      this.contentEl.style.transition = `opacity ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
      this.contentEl.style.overflowX = 'hidden';

      // Backdrop
      this.backdropEl = document.createElement('div');
      this.backdropEl.className = 'backdrop';
      this.backdropEl.style.overflow = 'hidden';
      this.backdropEl.style.position = 'fixed';
      this.backdropEl.style.width = '100%';
      this.backdropEl.style.bottom = '0';
      this.backdropEl.style.right = '0';
      this.backdropEl.style.left = '0';
      this.backdropEl.style.top = '0';
      this.backdropEl.style.backgroundColor = 'rgba(0,0,0,.4)';
      this.backdropEl.style.zIndex = '10';
      this.backdropEl.style.opacity = this.settings.backdropTransparent ? '0' : '1';

      // Close button
      this.closeEl = document.createElement('div');
      this.closeEl.className = 'close-button';
      this.closeEl.style.width = '26px';
      this.closeEl.style.height = '26px';
      this.closeEl.style.position = 'absolute';
      this.closeEl.style.background = '#ebebeb';
      this.closeEl.style.top = '16px';
      this.closeEl.style.right = '20px';
      this.closeEl.style.borderRadius = '100%';
  }

  present(conf: {animate: boolean} = {animate: false}) {

      if (document.querySelector(
        `.cupertino-pane-wrapper.${this.el.className.split(' ').join('.')}`)
      ) {
        this.moveToBreak(this.settings.initialBreak);
        return;
      }

      // Emit event
      this.settings.onWillPresent();

      this.breaks = {
        top: this.screen_height,
        middle: this.screen_height,
        bottom: this.screen_height
      };
      
      ['top', 'middle', 'bottom'].forEach((val) => {
        // Set default if no exist
        if (!this.settings.breaks[val]) {
          this.settings.breaks[val] = this.defaultBreaksConf[val];
        }
  
        // Add offsets
        if (this.settings.breaks[val]
            && this.settings.breaks[val].enabled
            && this.settings.breaks[val].offset) {
          this.breaks[val] -= this.settings.breaks[val].offset;
        }
      });

      // Warnings 
      if (!this.settings.breaks[this.settings.initialBreak].enabled) {
        console.warn('Cupertino Pane: Please set initialBreak for enabled breakpoint');
      }
      if (this.settings.breaks['middle'].offset >= this.settings.breaks['top'].offset) {
        console.warn('Cupertino Pane: Please set middle offset lower than top offset');
      }
      if (this.settings.breaks['middle'].offset <= this.settings.breaks['bottom'].offset) {
        console.warn('Cupertino Pane: Please set bottom offset lower than middle offset');
      }

      this.currentBreakpoint = this.breaks[this.settings.initialBreak];

      this.drawElements();
      this.parentEl.appendChild(this.wrapperEl);
      this.wrapperEl.appendChild(this.paneEl);
      this.paneEl.appendChild(this.draggableEl);
      this.paneEl.appendChild(this.contentEl);
      this.draggableEl.appendChild(this.moveEl);
  
      if (conf.animate) {
        this.paneEl.style.transform = `translateY(${this.screen_height}px)`; 
        this.paneEl.style.transition = `transform ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
        setTimeout(() => {
          this.paneEl.style.transform = `translateY(${this.breaks[this.settings.initialBreak]}px)`;
        }, 50);

        let initTransitionEv = this.paneEl.addEventListener('transitionend', (t) => {
          this.paneEl.style.transition = `initial`;
          initTransitionEv = undefined;
          // Emit event
          this.settings.onDidPresent();
        });
      } else {
        // Emit event
        this.settings.onDidPresent();
      }

      if (this.settings.backdrop) {
        this.wrapperEl.appendChild(this.backdropEl);
        
        if (this.settings.backdrop) {
          this.backdropEl.addEventListener('click', (t) => this.settings.onBackdropTap());
        }
      }

      if (!this.settings.showDraggable) {
        this.draggableEl.style.opacity = '0';
      }

      if (this.settings.darkMode) {
        this.paneEl.style.background = '#1c1c1d';
        this.paneEl.style.color = '#ffffff';
        this.moveEl.style.background = '#5a5a5e';
      }

      if (this.settings.buttonClose) {
        this.paneEl.appendChild(this.closeEl);
        this.closeEl.addEventListener('click', (t) => this.destroy({animate:true}));
        let iconColor = '#7a7a7e';
        if (this.settings.darkMode) {
          this.closeEl.style.background = '#424246';
          iconColor = '#a8a7ae';
        }
        this.closeEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path fill="${iconColor}" d="M278.6 256l68.2-68.2c6.2-6.2 6.2-16.4 0-22.6-6.2-6.2-16.4-6.2-22.6 0L256 233.4l-68.2-68.2c-6.2-6.2-16.4-6.2-22.6 0-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3l68.2 68.2-68.2 68.2c-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3 6.2 6.2 16.4 6.2 22.6 0l68.2-68.2 68.2 68.2c6.2 6.2 16.4 6.2 22.6 0 6.2-6.2 6.2-16.4 0-22.6L278.6 256z"/>
        </svg>`;
      }

      if (this.settings.bottomClose) {
        this.settings.breaks.bottom.enabled = true;
      }

      this.brs = [];
      ['top', 'middle', 'bottom'].forEach((val) => {
        if (this.settings.breaks[val].enabled) {
          this.brs.push(this.breaks[val]);
        }
      });

      // Determinate topper point
      this.topper = this.brs.reduce((prev, curr) => {
        return (Math.abs(curr) < Math.abs(prev) ? curr : prev);
      });
      // Determinate bottomer point
      this.bottomer = this.brs.reduce((prev, curr) => {
        return (Math.abs(curr) > Math.abs(prev) ? curr : prev);
      });

      // Get overflow element
      let attrElements = document.querySelectorAll(`.${this.el.className.split(' ')[0]} [overflow-y]`);
      if (!attrElements.length || attrElements.length > 1) {
        this.overflowEl = this.contentEl;
      } else {
        this.overflowEl = <HTMLElement>attrElements[0];
      }
      this.overflowEl.style.height = `${this.screen_height
        - this.breaks['top'] - 51
        - this.settings.topperOverflowOffset}px`;

      this.checkOpacityAttr(this.currentBreakpoint);
      this.checkOverflowAttr(this.currentBreakpoint);

      /****** Attach Events *******/
      this.attachEvents();
  }

  public moveToBreak(val) {
    this.checkOpacityAttr(this.breaks[val]);
    this.checkOverflowAttr(this.breaks[val]);

    this.paneEl.style.transition = `transform ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
    this.paneEl.style.transform = `translateY(${this.breaks[val]}px)`;
    let initTransitionEv = this.paneEl.addEventListener('transitionend', (t) => {
      this.paneEl.style.transition = `initial`;
      initTransitionEv = undefined;
    });
  }

  public hide() {
    this.paneEl.style.transition = `transform ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
    this.paneEl.style.transform = `translateY(${this.screen_height}px)`;
    let initTransitionEv = this.paneEl.addEventListener('transitionend', (t) => {
      this.paneEl.style.transition = `initial`;
      initTransitionEv = undefined;
    });
  }

  public isHidden(): (boolean|null) {
    if (!document.querySelector(
      `.cupertino-pane-wrapper.${this.el.className.split(' ').join('.')}`)
    ) {
      return null;
    }
    
    return this.paneEl.style.transform === `translateY(${this.screen_height}px)`;
  }

  public currentBreak(): (string|null) {
    if (this.breaks['top'] === this.currentBreakpoint) return 'top';
    if (this.breaks['middle'] === this.currentBreakpoint) return 'middle';
    if (this.breaks['bottom'] === this.currentBreakpoint) return 'bottom';
    return null;
  };

  private checkOpacityAttr(val) {
    let attrElements = document.querySelectorAll(`.${this.el.className.split(' ')[0]} [hide-on-bottom]`);
    if (!attrElements.length) return;
    attrElements.forEach((item) => {
      (<HTMLElement>item).style.transition = `opacity ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
      (<HTMLElement>item).style.opacity = (val >= this.breaks['bottom']) ? '0' : '1';
    });
  }

  private checkOverflowAttr(val) {
    if (!this.settings.topperOverflow) return;
    this.overflowEl.style.overflowY = (val <= this.topper) ? 'auto' : 'hidden';
  }

  /**
   * Touch Start Event
   * @param t 
   */
  private touchStart(t) {
    const targetTouch = t.type === 'touchstart' && t.targetTouches && (t.targetTouches[0] || t.changedTouches[0]);
    const screenY = t.type === 'touchstart' ? targetTouch.screenY : t.screenY;
    if (t.type === 'pointerdown') this.pointerDown = true;

    // Event emitter
    this.settings.onDragStart();
    this.startP = screenY;
    this.steps.push(this.startP);
  }

  /**
   * Touch Move Event
   * @param t 
   */
  private touchMove(t) {
    // Handle desktop/mobile events
    const targetTouch = t.type === 'touchmove' && t.targetTouches && (t.targetTouches[0] || t.changedTouches[0]);
    const screenY = t.type === 'touchmove' ? targetTouch.screenY : t.screenY;
    if(t.type === 'pointermove' && !this.pointerDown) return;

    // Event emitter
    this.settings.onDrag();

    const translateYRegex = /\.*translateY\((.*)px\)/i;
    const p = parseFloat(translateYRegex.exec(this.paneEl.style.transform)[1]);
    // Delta
    const n = screenY;
    const diff = n - this.steps[this.steps.length - 1];
    const newVal = p + diff;

    // Not allow move panel with positive overflow scroll
    if (this.overflowEl.style.overflowY === 'auto') {
      this.overflowEl.addEventListener('scroll', (s: any) => {
        this.contentScrollTop = s.target.scrollTop;
      });
      if ((newVal > this.topper && this.contentScrollTop > 0) 
          || (newVal <= this.topper)) { 
        return;
      }
    }

    // Not allow drag upper than topper point
    // Not allow drag lower than bottom if free mode
    if ((newVal <= this.topper)
        || (this.settings.freeMode && !this.settings.bottomClose && (newVal >= this.bottomer))) {
      return;
    }

    this.checkOpacityAttr(newVal);
    this.checkOverflowAttr(newVal);
    
    this.paneEl.style.transition = 'initial';
    this.paneEl.style.transform = `translateY(${newVal}px)`;
    this.steps.push(n);
  }

  /**
   * Touch End Event
   * @param t 
   */
  private touchEnd(t) {
    const targetTouch = t.type === 'touchmove' && t.targetTouches && (t.targetTouches[0] || t.changedTouches[0]);
    const screenY = t.type === 'touchmove' ? targetTouch.screenY : t.screenY;
    if (t.type === 'pointerup') this.pointerDown = false;

    const translateYRegex = /\.*translateY\((.*)px\)/i;
    const p = parseFloat(translateYRegex.exec(this.paneEl.style.transform)[1]);

    // Determinate nearest point
    let closest = this.brs.reduce((prev, curr) => {
      return (Math.abs(curr - p) < Math.abs(prev - p) ? curr : prev);
    });

    // Swipe - next (if differ > 10)
    const diff =  this.steps[this.steps.length - 1] - this.steps[this.steps.length - 2];
    // Set sensivity lower for web
    const swipeNextSensivity = window.hasOwnProperty('cordova') ? 4 : 3; 
    if (Math.abs(diff) >= swipeNextSensivity) {
      closest = this.swipeNextPoint(diff, swipeNextSensivity, closest);
    }

    // Click to bottom - open middle
    if (this.settings.clickBottomOpen) {
      if (this.currentBreakpoint === this.breaks['bottom'] && isNaN(diff)) {
        closest = this.settings.breaks['middle'].enabled
        ? this.breaks['middle'] : this.settings.breaks['top'].enabled
        ? this.breaks['top'] : this.breaks['bottom'];
      }
    }

    this.steps = [];
    this.currentBreakpoint = closest;

    this.checkOpacityAttr(this.currentBreakpoint);
    this.checkOverflowAttr(this.currentBreakpoint);

    // Bottom closable
    if (this.settings.bottomClose && closest === this.breaks['bottom']) {
      this.destroy({animate:true});
      return;
    }

    if (!this.settings.freeMode) {
      this.paneEl.style.transition = `transform ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
      this.paneEl.style.transform = `translateY(${closest}px)`;
      let initTransitionEv = this.paneEl.addEventListener('transitionend', () => {
        this.paneEl.style.transition = `initial`;
        initTransitionEv = undefined;
      });
    }
  }

  public destroy(conf: {animate: boolean} = {animate: false}) {
      // Emit event
      this.settings.onWillDismiss();

      const resets = () => {
        this.parentEl.appendChild(this.contentEl);
        this.parentEl.removeChild(this.wrapperEl);
        
        /****** Detach Events *******/
        this.detachEvents();
        
        // Reset vars
        this.currentBreakpoint = this.breaks[this.settings.initialBreak];

        // Reset styles
        this.contentEl.style.display = 'none';
        this.paneEl.style.transform = 'initial';

        // Emit event
        this.settings.onDidDismiss();
      };

      if (conf.animate) {
        this.paneEl.style.transition = `transform ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
        this.paneEl.style.transform = `translateY(${this.screen_height}px)`;

        this.backdropEl.style.transition = `transform ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
        this.backdropEl.style.backgroundColor = 'rgba(0,0,0,.0)';

        this.paneEl.addEventListener('transitionend', () => resets());
        return;
      } 

      resets();
  }

  private swipeNextPoint = (diff, maxDiff, closest) => {
      if (this.currentBreakpoint === this.breaks['top']) {
        if (diff > maxDiff) {
          if (this.settings.breaks['middle'].enabled) { return this.breaks['middle']; }
          if (this.settings.breaks['bottom'].enabled) { return this.breaks['bottom']; }
        }
        return this.breaks['top'];
      }

      if (this.currentBreakpoint === this.breaks['middle']) {
        if (diff < -maxDiff) {
          if (this.settings.breaks['top'].enabled) { return this.breaks['top']; }
        }
        if (diff > maxDiff) {
          if (this.settings.breaks['bottom'].enabled) { return this.breaks['bottom']; }
        }
        return this.breaks['middle'];
      }

      if (this.currentBreakpoint === this.breaks['bottom']) {
        if (diff < -maxDiff) {
          if (this.settings.breaks['middle'].enabled) { return this.breaks['middle']; }
          if (this.settings.breaks['top'].enabled) { return this.breaks['top']; }
        }
        return this.breaks['bottom'];
      }

      return closest;
  }

 
  /************************************
   * Events
   */
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

  attachEvents() {
    // Touch Events
    if (!Support.touch && Support.pointerEvents) {
      this.paneEl.addEventListener(this.touchEvents.start, (t) => this.touchStart(t), false);
      this.paneEl.addEventListener(this.touchEvents.move, (t) => this.touchMove(t), false);
      this.paneEl.addEventListener(this.touchEvents.end, (t) => this.touchEnd(t), false);
    } else {

      if (Support.touch) {
        const passiveListener = this.touchEvents.start === 'touchstart' && Support.passiveListener && this.settings.passiveListeners ? { passive: true, capture: false } : false;
        this.paneEl.addEventListener(this.touchEvents.start, (t) => this.touchStart(t), passiveListener);
        this.paneEl.addEventListener(this.touchEvents.move, (t) => this.touchMove(t), Support.passiveListener ? { passive: false, capture: false } : false);
        this.paneEl.addEventListener(this.touchEvents.end, (t) => this.touchEnd(t), passiveListener);
        if (this.touchEvents['cancel']) {
          this.paneEl.addEventListener(this.touchEvents['cancel'], (t) => this.touchEnd(t), passiveListener);
        }
      }

      if ((this.settings.simulateTouch && !this.device.ios && !this.device.android) || (this.settings.simulateTouch && !Support.touch && this.device.ios)) {
        this.paneEl.addEventListener('mousedown', (t) => this.touchStart(t), false);
        this.paneEl.addEventListener('mousemove', (t) => this.touchMove(t), false);
        this.paneEl.addEventListener('mouseup', (t) => this.touchEnd(t), false);
      }
    }


  }

  detachEvents() {
    // Touch Events
    if (!Support.touch && Support.pointerEvents) {
      this.paneEl.removeEventListener(this.touchEvents.start, (t) => this.touchStart(t), false);
      this.paneEl.removeEventListener(this.touchEvents.move, (t) => this.touchMove(t), false);
      this.paneEl.removeEventListener(this.touchEvents.end, (t) => this.touchEnd(t), false);
    } else {
      if (Support.touch) {
        const passiveListener = this.touchEvents.start === 'onTouchStart' && Support.passiveListener && this.settings.passiveListeners ? { passive: true, capture: false } : false;
        this.paneEl.removeEventListener(this.touchEvents.start, (t) => this.touchStart(t), passiveListener);
        this.paneEl.removeEventListener(this.touchEvents.move, (t) => this.touchMove(t), false);
        this.paneEl.removeEventListener(this.touchEvents.end, (t) => this.touchEnd(t), passiveListener);
        if (this.touchEvents['cancel']) {
          this.paneEl.removeEventListener(this.touchEvents['cancel'], (t) => this.touchEnd(t), passiveListener);
        }
      }
      if ((this.settings.simulateTouch && !this.device.ios && !this.device.android) || (this.settings.simulateTouch && !Support.touch && this.device.ios)) {
        this.paneEl.removeEventListener('mousedown', (t) => this.touchStart(t), false);
        this.paneEl.removeEventListener('mousemove', (t) => this.touchMove(t), false);
        this.paneEl.removeEventListener('mouseup', (t) => this.touchEnd(t), false);
      }
    }
  }

}

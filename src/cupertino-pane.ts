export class CupertinoPane {

  private settings: any = {
    initialShow: false,
    initialBreak: 'middle',
    backdrop: false,
    backdropClose: false,
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
    breaks: {
      top: { enabled: true, offset: 0},
      middle: { enabled: true, offset: 0},
      bottom: { enabled: true, offset: 0},
    },
    onDidDismiss: () => {},
    onWillDismiss: () => {},
    onDidPresent: () => {},
    onWillPresent: () => {},
    onDragStart: () => {},
    onDrag: () => {}
  };

  private screen_height: number = window.screen.height;
  private steps: any[] = [];
  private startP: any;
  private topper: number;
  private bottomer: number;
  private currentBreak: number;

  private breaks: {} = {
    top: 50,
    middle: Math.round(this.screen_height - (this.screen_height * 0.35)),
    bottom: this.screen_height - 80
  };
  private brs: number[] = [];

  private parentEl: HTMLElement;
  private wrapperEl: HTMLDivElement;
  private paneEl: HTMLDivElement;
  private draggableEl: HTMLDivElement;
  private moveEl: HTMLDivElement;
  private headerEl: HTMLHeadingElement;
  private contentEl: HTMLHeadingElement;
  private backdropEl: HTMLDivElement;
  private closeEl: HTMLDivElement;

  constructor(private el, conf: any = {}) {
    this.settings = {...this.settings, ...conf};
    this.el = <HTMLDivElement>document.querySelector(this.el);

    if (this.settings.parentElement) {
      this.settings.parentElement = <HTMLElement>document.querySelector(
        this.settings.parentElement
      );
    } else {
      this.settings.parentElement = this.el.parentElement;
    }

    ['top', 'middle', 'bottom'].forEach((val) => {
      // If initial break disabled - set first enabled
      if (!this.settings.breaks[this.settings.initialBreak].enabled) {
        if (this.settings.breaks[val].enabled) {
          this.settings.initialBreak = val;
        }
      }

      // Add offsets
      if (this.settings.breaks[val]
          && this.settings.breaks[val].enabled
          && this.settings.breaks[val].offset) {
        this.breaks[val] -= this.settings.breaks[val].offset;
      }
    });
    this.currentBreak = this.breaks[this.settings.initialBreak];

    if (this.settings.initialShow) {
      this.present();
    }
  }

  private drawElements() {
      this.el.style.display = 'none';
      this.parentEl = this.settings.parentElement;

      // Wrapper
      this.wrapperEl = document.createElement('div');
      this.wrapperEl.className = `cupertino-pane-wrapper ${this.el.className}`;
      this.wrapperEl.style.position = 'absolute';
      this.wrapperEl.style.top = '0';

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
      this.paneEl.style.transform = `translateY(${
        this.settings.initialShow ?
        this.breaks[this.settings.initialBreak] : this.screen_height}px)`;

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

      // Header
      this.headerEl = this.el.childNodes[0];

      // Content
      this.contentEl = this.el.childNodes[1];
      this.contentEl.style.transition = `opacity ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
      this.contentEl.style.overflowX = 'hidden';
      this.contentEl.style.height = `${this.screen_height
        - this.breaks['top'] - 51
        - this.settings.topperOverflowOffset}px`;

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

  present() {

      if (document.querySelector(
        `.cupertino-pane-wrapper.${this.el.className.split(' ').join('.')}`)
      ) {
        this.moveToBreak(this.settings.initialBreak);
        return;
      }

      // Emit event
      this.settings.onWillPresent();

      this.drawElements();
      this.parentEl.appendChild(this.wrapperEl);
      this.wrapperEl.appendChild(this.paneEl);
      this.paneEl.appendChild(this.draggableEl);
      this.paneEl.appendChild(this.headerEl);
      this.paneEl.appendChild(this.contentEl);
      this.draggableEl.appendChild(this.moveEl);

      if (!this.settings.initialShow) {
        this.paneEl.style.transition = `transform ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
        setTimeout(() => {
          this.paneEl.style.transform = `translateY(${this.breaks[this.settings.initialBreak]}px)`;
        }, 50);

        let initTransitionEv = this.paneEl.addEventListener('transitionend', (t) => {
          this.paneEl.style.transition = `initial`;
          initTransitionEv = undefined;
        });
      }

      // Emit event
      this.settings.onDidPresent();

      if (this.settings.backdrop) {
        this.wrapperEl.appendChild(this.backdropEl);
        if (this.settings.backdropClose) {
          this.backdropEl.addEventListener('click', (t) => this.closePane(this.backdropEl));
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
        this.closeEl.addEventListener('click', (t) => this.closePane(this.backdropEl));
        let iconColor = '#7a7a7e';
        if (this.settings.darkMode) {
          this.closeEl.style.background = '#424246';
          iconColor = '#a8a7ae';
        }
        this.closeEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path fill="${iconColor}" d="M278.6 256l68.2-68.2c6.2-6.2 6.2-16.4 0-22.6-6.2-6.2-16.4-6.2-22.6 0L256 233.4l-68.2-68.2c-6.2-6.2-16.4-6.2-22.6 0-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3l68.2 68.2-68.2 68.2c-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3 6.2 6.2 16.4 6.2 22.6 0l68.2-68.2 68.2 68.2c6.2 6.2 16.4 6.2 22.6 0 6.2-6.2 6.2-16.4 0-22.6L278.6 256z"/>
        </svg>`;
      }

      if (this.currentBreak === this.breaks['bottom']) {
        this.contentEl.style.opacity = '0';
      } else {
        this.contentEl.style.opacity = '1';
      }

      if (this.settings.bottomClose) {
        this.settings.breaks.bottom.enabled = true;
      }

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

      if (this.currentBreak === this.topper
          && this.settings.topperOverflow) {
            this.contentEl.style.overflowY = 'auto';
        // headerEl.style.borderBottom = '1px solid #ebebeb';
      }

      /****** Events *******/
      this.paneEl.addEventListener('touchstart', (t) => this.touchStart(t));
      this.paneEl.addEventListener('touchmove', (t) => this.touchMove(t));
      this.paneEl.addEventListener('touchend', (t) => this.touchEnd(t));
  }

  touchStart(t) {
    // Event emitter
    this.settings.onDragStart();
    this.startP = (<any>t).touches[0].screenY;
    this.steps.push(this.startP);
  }

  touchMove(t) {
    this.settings.onDrag();

    const translateYRegex = /\.*translateY\((.*)px\)/i;
    const p = parseFloat(translateYRegex.exec(this.paneEl.style.transform)[1]);
    // Delta
    const n = (<any>t).touches[0].screenY;
    const diff = n - this.steps[this.steps.length - 1];
    const newVal = p + diff;

    // Not allow move panel with overflow scroll
    let noScroll = false;
    if (this.contentEl.style.overflowY === 'auto') {
      t.composedPath().forEach((item) => {
        if (item['className'] && item['className'].includes('cupertino-content')) {
          noScroll = true;
        }
      });
      if (noScroll && this.contentEl.scrollTop > 20) { return; }
      if ((p + diff) <= this.topper && noScroll) { return; }
    }

    // Not allow drag upper than topper point
    // Not allow drag lower than bottom if free mode
    if (((p + diff) <= this.topper - 20)
        || (this.settings.freeMode && !this.settings.bottomClose && ((p + diff) >= this.bottomer + 20))) {
      return;
    }

    this.paneEl.style.transform = `translateY(${newVal}px)`;
    this.steps.push(n);    

    if (newVal > this.breaks['bottom']) {
      this.contentEl.style.opacity = '0';
    } else {
      this.contentEl.style.opacity = '1';
    }
  }

  touchEnd(t) {
    const translateYRegex = /\.*translateY\((.*)px\)/i;
    const p = parseFloat(translateYRegex.exec(this.paneEl.style.transform)[1]);

    // Determinate nearest point
    let closest = this.brs.reduce((prev, curr) => {
      return (Math.abs(curr - p) < Math.abs(prev - p) ? curr : prev);
    });

    // Swipe - next (if differ > 10)
    const diff =  this.steps[this.steps.length - 1] - this.steps[this.steps.length - 2];
    const maxDiff = 4;
    if (Math.abs(diff) >= maxDiff) {
      closest = this.swipeNextPoint(diff, maxDiff, closest);
    }

    // Click to bottom - open middle
    if (this.settings.clickBottomOpen) {
      if (this.currentBreak === this.breaks['bottom'] && isNaN(diff)) {
        closest = this.settings.breaks['middle'].enabled
        ? this.breaks['middle'] : this.settings.breaks['top'].enabled
        ? this.breaks['top'] : this.breaks['bottom'];
      }
    }

    this.steps = [];
    this.currentBreak = closest;

    if (this.currentBreak === this.breaks['bottom']) {
      this.contentEl.style.opacity = '0';
    } else {
      this.contentEl.style.opacity = '1';
    }

    if (this.currentBreak === this.topper
        && this.settings.topperOverflow) {
      this.contentEl.style.overflowY = 'auto';
    } else {
      this.contentEl.style.overflowY = 'hidden';
    }

    // Bottom closable
    if (this.settings.bottomClose && closest === this.breaks['bottom']) {
      this.closePane(this.backdropEl);
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

  moveToBreak(val) {
    if (this.breaks[val] === this.breaks['bottom']) {
      this.contentEl.style.opacity = '0';
    } else {
      this.contentEl.style.opacity = '1';
    }

    if (this.breaks[val] === this.topper
        && this.settings.topperOverflow) {
      this.contentEl.style.overflowY = 'auto';
    } else {
      this.contentEl.style.overflowY = 'hidden';
    }

    this.paneEl.style.transition = `transform ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
    this.paneEl.style.transform = `translateY(${this.breaks[val]}px)`;
    let initTransitionEv = this.paneEl.addEventListener('transitionend', (t) => {
      this.paneEl.style.transition = `initial`;
      initTransitionEv = undefined;
    });
  }

  hide() {
    this.paneEl.style.transition = `transform ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
    this.paneEl.style.transform = `translateY(${this.screen_height}px)`;
    let initTransitionEv = this.paneEl.addEventListener('transitionend', (t) => {
      this.paneEl.style.transition = `initial`;
      initTransitionEv = undefined;
    });
  }

  get isHidden() {
    return this.paneEl.style.transform === `translateY(${this.screen_height}px)`;;
  }

  private closePane(backdropEl) {
      // Emit event
      this.settings.onWillDismiss();

      this.paneEl.style.transition = `transform ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
      this.paneEl.style.transform = `translateY(${this.screen_height}px)`;

      backdropEl.style.transition = `transform ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
      backdropEl.style.backgroundColor = 'rgba(0,0,0,.0)';

      // Return dynamic content
      this.el.appendChild(this.headerEl);
      this.el.appendChild(this.contentEl);
      
      // Reset vars
      this.currentBreak = this.breaks[this.settings.initialBreak];

      this.paneEl.addEventListener('transitionend', (t) => {
        this.parentEl.removeChild(this.wrapperEl);

        // Emit event
        this.settings.onDidDismiss();
      });
  }

  private swipeNextPoint = (diff, maxDiff, closest) => {
      if (this.currentBreak === this.breaks['top']) {
        if (diff > maxDiff) {
          if (this.settings.breaks['middle'].enabled) { return this.breaks['middle']; }
          if (this.settings.breaks['bottom'].enabled) { return this.breaks['bottom']; }
        }
        return this.breaks['top'];
      }

      if (this.currentBreak === this.breaks['middle']) {
        if (diff < -maxDiff) {
          if (this.settings.breaks['top'].enabled) { return this.breaks['top']; }
        }
        if (diff > maxDiff) {
          if (this.settings.breaks['bottom'].enabled) { return this.breaks['bottom']; }
        }
        return this.breaks['middle'];
      }

      if (this.currentBreak === this.breaks['bottom']) {
        if (diff < -maxDiff) {
          if (this.settings.breaks['middle'].enabled) { return this.breaks['middle']; }
          if (this.settings.breaks['top'].enabled) { return this.breaks['top']; }
        }
        return this.breaks['bottom'];
      }

      return closest;
  }

}
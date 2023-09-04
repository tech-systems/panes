import { CupertinoPane } from '../cupertino-pane';
import { CupertinoSettings, ModalSettings } from '../models';
import { Events } from '../events/events';
import { Breakpoints } from 'src/breakpoints';
import { Transitions } from 'src/transitions';

/**
 * Modal module
 */

export class ModalModule {

  private static readonly BuildInTransition = {
    fade: {
      duration: 300,
      from: {
        opacity: 0
      },
      to: {
        opacity: 1
      },
    },
    zoom: {
      duration: 300,
      from: {
        opacity: 0,
        scale: 0.5
      },
      to: {
        opacity: 1,
        scale: 1
      },
    }
  }

  private static readonly ForceSettings = {
    fitHeight: true,
    touchAngle: null,
    showDraggable: false
  }

  // Force to use settings by module
  public static CollectSettings(settings) {
    return settings.modal 
      ? { ...settings, ...ModalModule.ForceSettings} 
      : settings;
  }

  public modalDefaults: ModalSettings = {
    transition: 'fade',
    flying: false,
    dismissOnIntense: false
  };

  private settings: CupertinoSettings;
  private events: Events;
  private breakpoints: Breakpoints;
  private transitions: Transitions;
  constructor(private instance: CupertinoPane) {
    this.settings = this.instance.settings;
    this.events = this.instance.events;
    this.breakpoints = this.instance.breakpoints;
    this.transitions = this.instance.transitions;
    
    if (!this.settings.modal) {
      return;
    }

    // set defaults
    this.settings.modal = (typeof this.settings.modal === "object")
      ? {...this.modalDefaults, ...this.settings.modal} 
      : this.modalDefaults;

    // ehance + re-bind functions (+ get rid of recursion)
    this.instance['customPresent'] = this.instance['present'];
    this.instance['present'] = (conf) => this.present(conf);
    this.instance['customDestroy'] = this.instance['destroy'];
    this.instance['destroy'] = (conf) => this.destroy(conf);

    // re-bind functions
    this.events['handleSuperposition'] = (coords) => this.handleSuperposition(coords);
    this.transitions['setPaneElTransform'] = (params) => this.setPaneElTransform(params);

    // Hooks
    this.instance.on('beforeBreakHeightApplied', (ev) => {
      if (ev.break === 'top') {
        this.settings.breaks['top'].height -= this.settings.bottomOffset * 2;
        this.settings.breaks['top'].height += (this.instance.screen_height - this.settings.breaks['top'].height) / 2;
      }
      if (ev.break === 'bottom') {
        this.settings.breaks['bottom'] = { enabled: false };
      }

      this.instance.addStyle(`
        .cupertino-pane-wrapper .pane {
          transform-origin: center ${this.breakpoints.breaks[this.settings.initialBreak]}px
        }
      `);
    });

    this.instance.on('rendered', () => {
      this.instance.addStyle(`
        .cupertino-pane-wrapper .pane {
          border-radius: var(--cupertino-pane-border-radius, 20px) 
                         var(--cupertino-pane-border-radius, 20px)
                         var(--cupertino-pane-border-radius, 20px)
                         var(--cupertino-pane-border-radius, 20px);
          width: calc(100% - 16px) !important;
          margin: auto;
        }
        .cupertino-pane-wrapper .pane.modal-flying {
          animation: modalFlyingX 2000ms ease-in-out infinite alternate,
                     modalFlyingY 3000ms ease-in-out infinite alternate;
        }
        @keyframes modalFlyingX {
          0% { left: -10px; }
          100% { left: 10px; }
        }
        @keyframes modalFlyingY {
          0% { top: -10px; }
          100% { top: 0px; }
        }
      `);

      if (this.settings.modal['flying']) {
        this.instance.paneEl.classList.add('modal-flying');
      }

      if (this.settings.modal['dismissOnIntense']) {
        this.instance.enableDrag();
      }
    });
  }

  public setPaneElTransform(params) {
    let closest = params.type === 'end' ? 0 : params.translateX;
    this.instance.paneEl.style.transform = `translateX(${closest || 0}px) translateY(${params.translateY}px) translateZ(0px)`;
  }

  /**
   * Private class methods
   */

  // Enhance with animation
  private present(conf) {
    let { transition } = conf;
    if (!transition) {
      transition = ModalModule.BuildInTransition[this.settings.modal['transition']];
    }

    return this.instance['customPresent']({...conf, transition });
  }

  // Enhance with animation
  private destroy(conf) {
    let { transition } = conf;
    
    if (!transition) {
      transition = JSON.parse(JSON.stringify({
        duration: ModalModule.BuildInTransition[this.settings.modal['transition']].duration,
        from: ModalModule.BuildInTransition[this.settings.modal['transition']].to,
        to: ModalModule.BuildInTransition[this.settings.modal['transition']].from
      }));
    }

    if (conf.fromCurrentPosition) {
      let computedTranslate = new WebKitCSSMatrix(window.getComputedStyle(this.instance.paneEl).transform);
      transition.to.transform = `translateY(${computedTranslate.m42}px) translateX(${computedTranslate.m41}px) translateZ(0px)`;
    }

    return this.instance['customDestroy']({...conf, transition });
  }

  private handleSuperposition(coords: {
    clientX: number, clientY: number, newVal: number, 
    newValX: number, diffY: number, diffX: number
  }): {x?: number, y?: number} | false {
    // dismissOnIntense 
    let intenseKoeff = 40;
    let differY = Math.abs(this.instance.getPanelTransformY() - this.breakpoints.topper);
    let differX = Math.abs(this.instance.getPanelTransformX());
    if (this.settings.modal['dismissOnIntense'] 
      && (differY > intenseKoeff || differX > intenseKoeff - 10)) {
        this.instance.disableDrag();
        this.destroy({animate: true, fromCurrentPosition: true});
        return false;
    }

    // calc new-pos
    let hardness = 8;
    const differKoefY = this.instance.getPanelTransformY() / this.breakpoints.topper / hardness;
    const differKoefX = this.instance.getPanelTransformX() / this.breakpoints.topper / hardness;
    return { 
      y: this.instance.getPanelTransformY() + (coords.diffY * (differKoefY + differKoefX)),
      x: this.instance.getPanelTransformX() + (coords.diffX * (differKoefY + differKoefX))
    };
  }

}

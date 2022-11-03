import { CupertinoPane } from '../cupertino-pane';
import { CupertinoSettings, ZStackSettings } from '../models';
import { Breakpoints } from '../breakpoints';

/**
 * Z-Stack Module
 */

export class ZStackModule {

  public zStackDefaults: ZStackSettings = {
    pushElements: null,
    minPushHeight: null,
    cardBorderRadius: null,
    cardYOffset: 0,
    cardZScale: 0.93,
    cardContrast: 0.85,
    stackZAngle: 160,
  };

  private settings: CupertinoSettings;
  private breakpoints: Breakpoints;
  constructor(private instance: CupertinoPane) {
    this.breakpoints = this.instance.breakpoints;
    this.settings = this.instance.settings;

    if (!this.settings.zStack) {
      return;
    }

    // bind to primary instance
    // TODO: change binding strategy according to TypeScript
    // E.G. Using public module methods from modules
    this.instance['setZstackConfig'] = async(zStack: ZStackSettings) => this.setZstackConfig(zStack);

    // Assign multiplicators for push elements
    this.instance.on('rendered', () => {
      this.setZstackConfig(this.settings.zStack);
      this.setPushMultiplicators();
    });

    // Set initial position without animation on present
    this.instance.on('beforePresentTransition', (ev) => {
      if (!ev.animate) {
        this.settings.zStack.pushElements.forEach(item => 
          this.pushTransition(
            document.querySelector(item), 
            this.breakpoints.breaks[this.settings.initialBreak], 'unset'
          )
        );
      }
    });
    
    // Move/Drag push transition for each element
    this.instance.on('onMoveTransitionStart', () => {
      this.settings.zStack.pushElements.forEach(item => 
        this.pushTransition(
          document.querySelector(item), 
          this.instance.getPanelTransformY(), 'all 0ms linear 0ms'
        )
      );
    });

    // Main transition for pushed elements
    this.instance.on('onTransitionStart', (ev) => {
      this.settings.zStack.pushElements.forEach(item => 
        this.pushTransition(
          document.querySelector(item), 
          ev.translateY.new, 
          `all ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`
        )
      );
    });

  }

  /**
   * Change z-stack configuration on the way
   */
  public setZstackConfig(zStack: ZStackSettings): void {
    // Allow user to reset config
    this.settings.zStack = zStack ? {...this.zStackDefaults, ...zStack} : null;
  }

  /**
   * Z-Stack push transitions
   * @param pushElement - element be pushed
   * @param newPaneY - translateY of new pane
   * @param transition - transition style
   * @returns 
   */
   public pushTransition(pushElement: HTMLElement, newPaneY: number, transition: string) {
    let zStack = this.settings.zStack.pushElements;
    pushElement.style.transition = transition;
    pushElement.style.overflow = this.settings.zStack.cardBorderRadius && 'hidden';
    newPaneY = this.instance.screenHeightOffset - newPaneY;
    const topHeight = this.settings.zStack.minPushHeight 
      ? this.settings.zStack.minPushHeight : this.instance.screenHeightOffset - this.breakpoints.bottomer;
    const minHeight = this.instance.screenHeightOffset - this.breakpoints.topper;

    // Math calculations
    let multiplicator = this.getPushMulitplicator(pushElement);
    let scaleNew =  Math.pow(this.settings.zStack.cardZScale, multiplicator);
    let scaleNormal = Math.pow(this.settings.zStack.cardZScale, multiplicator - 1);
    let pushY = 6 + this.settings.zStack.cardYOffset; // 6 is iOS style offset for z-stacks
    let yNew = -1 * (pushY * multiplicator); 
    let yNormal = (yNew + pushY);
    let contrastNew = Math.pow(this.settings.zStack.cardContrast, multiplicator);
    let contrastNormal = Math.pow(this.settings.zStack.cardContrast, multiplicator - 1);

    // Accumulated styles from each pusher to pushed
    const setStyles = (scale, y, contrast, border) => {
        let exponentAngle = Math.pow(scale, this.settings.zStack.stackZAngle / 100);
        pushElement.style.transform = `translateY(${y * (exponentAngle/scale)}px) scale(${scale})`;
        pushElement.style.borderRadius = `${border}px`;
        pushElement.style.filter = `contrast(${contrast})`;

        // When destroy transition and last item moved we reduce multiplicators
        let lastPushed = document.querySelector(zStack[zStack.length - 1]);
        if (!newPaneY && pushElement.className === lastPushed.className) {
          this.clearPushMultiplicators();
        }
    };

    // Pusher cleared or pane destroyed
    if (newPaneY <= topHeight) {
      // defaults
      setStyles(
        scaleNormal, // scale
        yNormal, // transformY
        contrastNormal, // contrast
        0 // border
      );
      return;
    }
    
    // Pusher drag/move
    const getXbyY = (min, max) => {
      let val = (minHeight * max - topHeight * min) * -1;
          val -= (min - max) * newPaneY;
          val /= (topHeight - minHeight);
      if (val > max) val = max;
      if (val < min) val = min;
     return val;
    };

    setStyles(
      getXbyY(scaleNew, scaleNormal),
      getXbyY(yNew, yNormal),
      getXbyY(contrastNew, contrastNormal), 
      getXbyY(this.settings.zStack.cardBorderRadius * -1, 0) * -1,
    );
  }

  // Z-Stack: Pushed elements multiplicators
  public setPushMultiplicators(): void {
    this.settings.zStack.pushElements.forEach((item) => {
      let pushElement: HTMLElement = document.querySelector(item);
      let multiplicator = this.getPushMulitplicator(pushElement);
          multiplicator = multiplicator ? multiplicator + 1 : 1;
      pushElement.style.setProperty('--push-multiplicator', `${multiplicator}`);
    });
  }

  /**
   * Private class methods
   */

  private getPushMulitplicator(el: HTMLElement): number {
    let multiplicator: (string | number) = el.style.getPropertyValue('--push-multiplicator');
    return parseInt(multiplicator);
  }

  private clearPushMultiplicators(): void {
    for (let i = 0; i < this.settings.zStack.pushElements.length; i++) {
      let pushElement: HTMLElement = document.querySelector(
        this.settings.zStack.pushElements[i]
      );
      let multiplicator = this.getPushMulitplicator(pushElement);
          multiplicator -= 1;
      if (multiplicator) {
        pushElement.style.setProperty('--push-multiplicator', `${multiplicator}`);
      } else {
        pushElement.style.removeProperty('--push-multiplicator');
      }
    }
  }
  

}

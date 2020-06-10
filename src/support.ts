export class Support {
  public static get touch() {
    return (window['Modernizr'] && window['Modernizr'].touch === true) || (function checkTouch() {
        return !!((window.navigator.maxTouchPoints > 0) || ('ontouchstart' in window) || (window['DocumentTouch'] && document instanceof window['DocumentTouch']));
      }());
  }

  public static get observer() {
    return ('MutationObserver' in window || 'WebkitMutationObserver' in window);
  }

  public static get backdropFilter() {
    return CSS.supports("backdrop-filter", "blur(0px)") 
      || CSS.supports("-webkit-backdrop-filter", "blur(0px)");
  }

  public static get passiveListener() {
    let supportsPassive = false;
    try {
        const opts = Object.defineProperty({}, 'passive', {
          // eslint-disable-next-line
          get() {
            supportsPassive = true;
          },
        });
        window.addEventListener('testPassiveListener', null, opts);
    } catch (e) {
      // No support
    }
    return supportsPassive;
  }

  public static get gestures() {
    return 'ongesturestart' in window;
  }

  public static get pointerEvents() {
    return !!window['PointerEvent'] && ('maxTouchPoints' in window.navigator) && window.navigator.maxTouchPoints > 0
  }
}
## [1.2.8](https://github.com/roman-rr/cupertino-pane/compare/1.1.57...1.2.8) (2021-12-06)


### Bug Fixes

* **draggable:** reduced zIndex to prevent overlapping ([#169](https://github.com/roman-rr/cupertino-pane/issues/169)) ([6196a4e](https://github.com/roman-rr/cupertino-pane/commit/6196a4e03edf76dd05bfe66eca9e12541510f304))
* **events:** android fast drag was interpreted as tap event ([#154](https://github.com/roman-rr/cupertino-pane/issues/154)) ([ac7093e](https://github.com/roman-rr/cupertino-pane/commit/ac7093e18d3b9e207efb9ac3e1493e5a998560ff))
* **events:** fixed unexpected jumps on fast drag ([1b0d082](https://github.com/roman-rr/cupertino-pane/commit/1b0d0829f19cd29f1c0be6e620a93aaf148c15d0))
* **events:** prevent hidden pane to be visible on keyboard ([#112](https://github.com/roman-rr/cupertino-pane/issues/112)) ([bf34a24](https://github.com/roman-rr/cupertino-pane/commit/bf34a24980bf890d13c37e176b3c294f6da80c30))
* **events:** touchmove position while transition ([7c367a3](https://github.com/roman-rr/cupertino-pane/commit/7c367a38f12e682aa974c32e67ad624dcccf54eb))
* **inverse:** `calcFitHeight` for inverse pane cause animation swing ([91359a0](https://github.com/roman-rr/cupertino-pane/commit/91359a0837867b97c29ad47639e3ba65fb780a60))
* **keyboard:** detach resize from keyboard events ([#112](https://github.com/roman-rr/cupertino-pane/issues/112)) ([5d574d7](https://github.com/roman-rr/cupertino-pane/commit/5d574d728f8cdfabdfd87a7c0180937e8e24f7f2))
* **events:** unlock mode show hidden pane on Android [#159](https://github.com/roman-rr/cupertino-pane/issues/159)
* **keyboard:** fixed keyboard for fitHeight panes - [#155](https://github.com/roman-rr/cupertino-pane/issues/155)

### Refactor

* **core:** add classes for transitions and z-stack

### Enhancements

* **gestures:** `topperThanTop` gesture smooth on backward
* **gestures:** scroll events remastered for smooth entry scrolls
* **core:** implemented proper UMD and EMS bundle system
* **ci:** async build and face typings with public-api
* **events:** default `touchAngle` is 45

### Features

* **destroy:** allow to destroy without DOM element ([#163](https://github.com/roman-rr/cupertino-pane/issues/163)) ([44a0d18](https://github.com/roman-rr/cupertino-pane/commit/44a0d18f487c229fb0d53a515d53c65af3a736c3))
* **docs:** commits standards and changelogs


## [1.2.7] - 2021-05-08

### Extra 
- [Rich notifications live](https://jsbin.com/neqoxef)

### Features
- Functions `.present()` and `.destroy()` enhanced to using Promise like functins. [#144](https://github.com/roman-rr/cupertino-pane/issues/144)
```js
    await myPane.present({animate: true});
    myPane.destroy({animate: true}).then(...);
```

### Bug Fixes 
- Fixed slow drag gesture with velocity when first `touchmove` not firing

## [1.2.6] - 2021-03-18

### BREAKING CHANGES
- All Z-Stack and 3D Push properties was merged into `zStack` object. [Readme](https://github.com/roman-rr/cupertino-pane/blob/master/README.md#z-stack)

```js
let settings = {
  ...
  zStack: {
    pushElements: string[];
    minPushHeight?: number;
    cardYOffset?: number;
    cardZScale?: number;
    cardContrast?: number;
    stackZAngle?: number;
  }
}
```

### Extra 
- [Advanced Z-stack available](https://output.jsbin.com/benidub)

### Features
- 3D Push transitions and gestures now available as cumulative options with `pushElements` property. Define array of elements which will be pushed when main element execute transitions. All styles from all elements will be accumulated together.
```js
let settings = {
  ...
  zStack: {
    pushElements: ['.card-1', '.card-2', '.card-3']
  }
}
```

### Bug Fixes
- Click to elements fixed with `.disableDrag()` method [#140](https://github.com/roman-rr/cupertino-pane/issues/140)
- Fixed css variable `--cupertino-pane-icon-close-color` [#139](https://github.com/roman-rr/cupertino-pane/issues/139)
- Fixed pane jump on drag with positive scroll from lower breakpoints [#135](https://github.com/roman-rr/cupertino-pane/issues/135)

## [1.2.5] - 2021-02-20

### BREAKING CHANGES
- Added `cssClass` property to settings. Pass custom class for `.cupertino-pane-wrapper` here to style later, instead of picking custom class from your element. 
- Removed `darkmode` property and `setDarkmode()` method. Proper way you can style darkmode with variables: 
```css
body.dark {
  --cupertino-pane-icon-close-color: #a8a7ae;
  --cupertino-pane-background: #1c1c1d;
  --cupertino-pane-color: #ffffff;
  --cupertino-pane-shadow: 0 4px 16px rgb(0 0 0 / 12%);
  --cupertino-pane-border-radius: 20px;
  --cupertino-pane-move-background: #424246;
  --cupertino-pane-destroy-button-background: #424246;
}
```

### Extra
- 3 Panes live environment [demo available](https://jsbin.com/xavifaf)

### Features
- CSS variables available [Readme](https://github.com/roman-rr/cupertino-pane/blob/master/README.md#css-variables)

### Bug Fixes
- Fixed styles for few panes in single DOM [#133](https://github.com/roman-rr/cupertino-pane/issues/133)
- Fixed with internal styles injector in DOM. Minified styles now injected once inside `<head>` tag. 
- Fixed backdrop with `{ animate:false }`

## [1.2.4] - 2021-01-28

### Enhancements
- Keyboard will move pane up, only if focused element is child of Pane
- `window.resize` events are now automatically managed [#127](https://github.com/roman-rr/cupertino-pane/issues/127)

### Bug Fixes
- Fixed `currentBreak()` method
- Fixed and improved keyboard events [#125](https://github.com/roman-rr/cupertino-pane/issues/125)

## [1.2.3] - 2021-01-22

### Features
- Added `.calcFitHeight()` method to re-calculate automatically height `fitHeight: true`, if this value was not proper calculated due DOM issues [#123](https://github.com/roman-rr/cupertino-pane/issues/123)
- Added `maxFitHeight` property to settings to define maximum possible automatically calculated height [#122](https://github.com/roman-rr/cupertino-pane/issues/122)

### Bug Fixes
- Switched `resize` callback to `orientationchange` callback for device orientation changes. Fixed issues regarding resize and keyboards. [#125](https://github.com/roman-rr/cupertino-pane/issues/125)

## [1.2.2] - 2021-01-20

### Features 
- Added `fitHeight` property for usage pane without breakpoints. On `fitHeight: true`, pane height will automatically calculated before present. Then height will be applied as top breakpoint height, bottom and middle breakpoint will be disabled. See [Bulletin demo](https://output.jsbin.com/maqigod) on example. [#113](https://github.com/roman-rr/cupertino-pane/issues/113)
- Added `fitScreenHeight` property. On `fitScreenHeight: true`, pane height will not be more than screen height. 

### Enhancements
- Button close renamed to button destroy to avoid confuses. Option renamed `buttonClose` -> `buttonDestroy` [#116](https://github.com/roman-rr/cupertino-pane/issues/112)
- `window.resize` events and orientation changing now automatically reset breakpoints and pane to proper position. May be good using in pair with `fitScreenHeight: true` [#119](https://github.com/roman-rr/cupertino-pane/issues/119)

### Bug Fixes
- Cordova keyboard hide if pane is hidden [#112](https://github.com/roman-rr/cupertino-pane/issues/112)

## [1.2.0] - 2020-12-15

### BREAKING CHANGES
- Improved `.preventDismiss()` method and gesture [#87](https://github.com/roman-rr/cupertino-pane/issues/87)
```javascript
const settings = {
  ...
  onWillDismiss: (e) => {
    if (e) {
      console.log(e.prevented);
    }
  }
}

const myPane = new CupertinoPane('.cupertino-pane', settings);
myPane.present({animate: true});
myPane.preventDismiss(true);
``` 

### Bug Fixes
- Fixed `setBreakpoints()` method for inversed pane [#92](https://github.com/roman-rr/cupertino-pane/issues/92)
- Fixed `textarea` overflow scroll. Pane disallowed from drag if scroll available and target element is textarea [#88](https://github.com/roman-rr/cupertino-pane/issues/88)
- Fixed horizontal scroll inside pane [#102](https://github.com/roman-rr/cupertino-pane/issues/102)
- Fixed keyboard issues on Android devices with cordova webview
- Fixed drag event and stops laggy on drag pane with touchAngle option [#102](https://github.com/roman-rr/cupertino-pane/issues/102)
- Fixed `onTransitionEnd` callback with top position [#105](https://github.com/roman-rr/cupertino-pane/issues/105) 
- Fixed `currentBreak()` detection for `onDragEnd` callbac [#106](https://github.com/roman-rr/cupertino-pane/pull/106)
- Fixed height calculation for overflow element [#104](https://github.com/roman-rr/cupertino-pane/issues/104) 

## [1.1.94] - 2020-11-15

### BREAKING CHANGES
- Implemented auto-keyboard handler for cordova applications. Keyboard now will push pane for exact keyboard height. If you would like handle this part by yourself, set option `handleKeyboard: false`.

### Extra 
- Prevent dismiss [demo available](https://output.jsbin.com/keravam)

### Features 
- Added `preventDismiss()` method. Using in pair with `onWillDismiss()` callback to prevent pane from destroy on custom conditions [#82](https://github.com/roman-rr/cupertino-pane/issues/82)
```javascript
const settings = {
  ...
  onWillDismiss: () => {
    if (disallowDismiss) {
      drawer.preventDismiss();
    }
  }
}
```

## [1.1.93] - 2020-10-29

### Extra
- Z-Deminsion Stack [demo available](https://output.jsbin.com/wedegox)

### Features 
- Added `fastSwipeClose` for close pane with fast drag to bottom direction [#78](https://github.com/roman-rr/cupertino-pane/issues/78)
- Added `fastSwipeSensivity` property to regulate how long should a swipe event being for automaticaly swipe into next point [#78](https://github.com/roman-rr/cupertino-pane/issues/78)
- Added `pushYOffset` property to realize Z-Deminsion Stack

## 1.1.92 - 2020-10-17

### Features
- Added `moveToHeight(val: **number**)` method. Allow to move pane into exact height position. [#73](https://github.com/roman-rr/cupertino-pane/issues/73)

### Bug Fixes
- Removed excesive padding from inversed `top-to-bottom` overscrolls. [#75](https://github.com/roman-rr/cupertino-pane/issues/75)

## 1.1.9 - 2020-10-10

### Features
- Added `inverse` property which allows to use `top-to-bottom` direction. [#58](https://github.com/roman-rr/cupertino-pane/issues/58)
```javascript
let settings: CupertinoSettings = { 
  inverse: true
};
```
- Added `.setDarkMode({enable: true})` method, to helps maintain color scheme after pane initialization [#68](https://github.com/roman-rr/cupertino-pane/issues/68)
- Added `.setBreakpoints(breakpoints: PaneBreaks)` method. Method updates breakpoints configuration for rendered Pane. [#69](https://github.com/roman-rr/cupertino-pane/issues/69)
- Improved `lowerThanBottom` configuration and become accessable in default mode

### Bug Fixes
- Fixed Commonjs bundle. No more line required on import:
```html
<script>var exports = {"__esModule": true};</script>
```

## 1.1.8 - 2020-08-29

### BREAKING CHANGES
- Property `offset` for breaks are not more under support. Renamed with `height`
```javascript
breaks: {
    ...
    middle: {
      enabled: true,
      height: 400
    }
}
```

### Features
- Added `upperThanTop` settings property
- Added `touchMoveStopPropagation` settings property. Set `true` to prevent all move events behind pane and backdrop [#55](https://github.com/roman-rr/cupertino-pane/issues/55)
- Added `bounce` property for breakpoints (transition in apple stocks style)
```javascript
breaks: {
    ...
    middle: {
      enabled: true,
      height: 400,
      bounce: true
    }
}
```
- Added `touchAngle` settings property which allow user set possible pane move angle. Helps to handle horizontal slider elements inside pane such as `ion-item-sliding` [#23](https://github.com/roman-rr/cupertino-pane/issues/23)
- Added **3d push effect** within `pushElement` and `pushMinHeight` properties
```javascript
 const settings = {
  ...
  parentElement: 'ion-tabs',
  pushElement: 'app-home',
  pushMinHeight: 350
}
```

### Bug Fixes
- Improved drag top gesture
- Auto-preventing accidental unwanted clicks events during pane move gestures by `preventClicks` parameter
- Close button touch area fixed

## 1.1.7 - 2020-07-22
 
### Features
- Changelog created to keep user informed [#47](https://github.com/roman-rr/cupertino-pane/issues/47)
- Better issues templates [#48](https://github.com/roman-rr/cupertino-pane/pull/48)
- Show/Hide backdrop method [#43](https://github.com/roman-rr/cupertino-pane/pull/43)
```javascript
myPane.backdrop({show: true}); // show
myPane.backdrop({show: false}); // hide
```
- Element or selector on class creation [#40](https://github.com/roman-rr/cupertino-pane/pull/40)
```javascript
// String selector
new CupertinoPane('.cupertino-pane');

// HTML element
let element = document.querySelector('.cupertino-pane');
new CupertinoPane(element); // HTMLElement
```

### Bug Fixes
- Mobile chrome pull-to-refresh function disabled with `overscroll-behavior-y` [#46](https://github.com/roman-rr/cupertino-pane/issues/46)
- Resize frame after hide keyboard on Android device with Ionic apps [#49](https://github.com/roman-rr/cupertino-pane/issues/49)

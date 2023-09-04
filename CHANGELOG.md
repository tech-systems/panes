# [1.4.0](https://github.com/tech-systems/panes/compare/1.3.0...1.4.0) (2023-09-04)

### Extra

- [Super Simple Modals 🔥](https://panejs.com/demo/modal.html)
- [Synthwave scene](https://panejs.com/demo/synthwave.html)

### Features

* **modal:** Super Simple Modals 🔥 ([9f7a910](https://github.com/tech-systems/panes/commit/9f7a910ff971a7838f8f7a1bad3f0aa883741e2a))
* **core:** custom transitions for present/destroy ([ed7e4c2](https://github.com/tech-systems/panes/commit/ed7e4c2312047d72f8d764ff5a3cf3715d3c444a))
* **settings:** ion-content auto-disable scroll on present ([#202](https://github.com/tech-systems/panes/issues/202))
* **settings:** parent instance as HTMLElement or string ([#193](https://github.com/tech-systems/panes/issues/193)) ([56049ae](https://github.com/tech-systems/panes/commit/56049ae3027b5437e402e1406146c4afc66679ac))
* **zStack:** custom border radius for pushElement ([#195](https://github.com/tech-systems/panes/issues/195)) ([1eb1f4c](https://github.com/tech-systems/panes/commit/1eb1f4ccf967cec713e1b5fba6f829c5a5bf5cda))
* **fitHeight:** calcFitHeight function fallback ([#218](https://github.com/tech-systems/panes/issues/218)) ([bb89ff7](https://github.com/tech-systems/panes/commit/bb89ff7a80fb8b8e66fc03285a20ef507728f36c))

### Enhancements

* **core:** fast initialization ([#186](https://github.com/tech-systems/panes/issues/186)) ([b36600b](https://github.com/tech-systems/panes/commit/b36600bd1070de4694d242f0dc6f2e6eed39e6f8))
* **fitHeight:** remastered algorithm ([#192](https://github.com/tech-systems/panes/issues/192)) & test ([e641a1b](https://github.com/tech-systems/panes/commit/e641a1b2796b9e4e8287d558259d66b70a3228a5)) ([12b9f9a](https://github.com/tech-systems/panes/commit/12b9f9a5d9f2859b536b792383451f7c1d4edf82)) ([7340ff6](https://github.com/tech-systems/panes/commit/7340ff63cc9b08f644b79b79c8d42fa9b4421766)) ([42bccfa](https://github.com/tech-systems/panes/commit/42bccfafde6e06c083a9f6eeeeab42197d0030f8)) ([a62a2bd](https://github.com/tech-systems/panes/commit/a62a2bdf46aeccf6a5ee63b58ccba2b0c0aadc4e)) ([a4af25c](https://github.com/tech-systems/panes/commit/a4af25c4386ff9295bc264182c5f807a82811b59))
* **core:** improved internal styles mechanics ([#189](https://github.com/tech-systems/panes/issues/189)) ([23af735](https://github.com/tech-systems/panes/commit/23af7352814882323fb17ddc03111daead1fc9fc))
* **fitHeight:** improved pane height calculations ([#186](https://github.com/tech-systems/panes/issues/186)) ([cb8eb05](https://github.com/tech-systems/panes/commit/cb8eb05638ae6aa48fe08a59feef9b61a18c65c6))
* **keyboard:** keyboard hero v3, v4 (([#215](https://github.com/tech-systems/panes/issues/215)) ([#208](https://github.com/tech-systems/panes/issues/208)) ([#203](https://github.com/tech-systems/panes/issues/203)) ([#188](https://github.com/tech-systems/panes/issues/188)) ([#187](https://github.com/tech-systems/panes/issues/187)))
* **keyboard:** Keyboard improvements for non-cordova android with OSK ([#200](https://github.com/tech-systems/panes/issues/200)) ([#188](https://github.com/tech-systems/panes/issues/188)) ([#187](https://github.com/tech-systems/panes/issues/187)) ([8549050](https://github.com/tech-systems/panes/commit/85490503ae9787aa26fd756aa4e2c073b6459dc3))
* **keyboard:** Keyboard improvements for lower chrome versions ([#200](https://github.com/tech-systems/panes/issues/200)) ([f23568b](https://github.com/tech-systems/panes/commit/f23568b518d957e7be6df67c9f9a03f64575dc98))
* **types:** zStack public methods ([4c0f7d0](https://github.com/tech-systems/panes/commit/4c0f7d0ed25e08b1908168f8586f1972858208c4))
* **backdrop:** pass MouseEvent to onBackdropTap callback ([bc8d5ca](https://github.com/tech-systems/panes/commit/bc8d5ca70e9a710134585fc9aa16c83b7740e4dd))
* **gestures:** upper-than-top gestures unable to move pane by Y for disabled options ([2f3280](https://github.com/tech-systems/panes/commit/2f32800b0ac7c184582ba8ce1b6accefe5c21651))


### Bug Fixes

* **draggable:** able to move scrolled pane by draggable element ([#184](https://github.com/tech-systems/panes/issues/184)) ([9e3eaaa](https://github.com/tech-systems/panes/commit/9e3eaaa3f6566372a59f59fdd42ade43c27d963a))
* **events:** getEventClientYX can be undefined [#214](https://github.com/tech-systems/panes/issues/214), [#209](https://github.com/tech-systems/panes/issues/209) ([1f283a3](https://github.com/tech-systems/panes/commit/1f283a33bd818f022d4ce3628944cea6fbc2b9ea))
* **events:** ios OSK resizes body ([#200](https://github.com/tech-systems/panes/issues/200)) ([0fc6fac](https://github.com/tech-systems/panes/commit/0fc6fac577bc59fe824dd205ae392b0872fed381))
* **events:** keyboard push based on transformY ([#200](https://github.com/tech-systems/panes/issues/200)) ([e2108e5](https://github.com/tech-systems/panes/commit/e2108e51b35b7d77e0cc792ca21cd7a1e22a7d0d))
* **fitHeight:** deal with Ionic framework ([029d625](https://github.com/tech-systems/panes/commit/029d625ed884df6fa7a6937179fe6d0e2c9f3d3b))
* **fitHeight:** calcFitHeight with fitScreenHeight ([#192](https://github.com/tech-systems/panes/issues/192)) ([016c4d3](https://github.com/tech-systems/panes/commit/016c4d3067688db810bc725607740e9029086333))
* **inverse:** calcFitHeight for inverse pane cause animation swing ([91359a0](https://github.com/tech-systems/panes/commit/91359a0837867b97c29ad47639e3ba65fb780a60))
* **modules:** modules public methods typings, calcFitHeight fix ([deb7de8](https://github.com/tech-systems/panes/commit/deb7de882b4ffda481713a4d5ed5e3111e29b980))
* **present:** ionic cancel transitions on initialization ([#216](https://github.com/tech-systems/panes/issues/216)) ([a944d32](https://github.com/tech-systems/panes/commit/a944d32a0f0c597cce80491750c9d67dec55ba88))


# [1.3.0](https://github.com/roman-rr/cupertino-pane/compare/1.1.57...1.3.0) (2022-07-04)

### Extra 
- [Picture-In-Picture live](https://output.jsbin.com/dubixep)

### BREAKING CHANGES

* **core:** Events emitter and callbacks assignments ([64788d0](https://github.com/roman-rr/cupertino-pane/commit/64788d06db5dd50b5808ea098efff72156a3d50c))

Callback enhanced and required simple updates.
All callbacks has been moved under `events` key in settings dictionary.
Callbacks now can be assigned with `on()` method.

### Features

* **core:** fully modularized ([#174](https://github.com/roman-rr/cupertino-pane/issues/174)) ([63b0cbb](https://github.com/roman-rr/cupertino-pane/commit/63b0cbbbfb209d5745026d3d9e5038bd15d09bdc))
* **core:** modularized ([#174](https://github.com/roman-rr/cupertino-pane/issues/174)) ([07f9d74](https://github.com/roman-rr/cupertino-pane/commit/07f9d74cac5f71fd1bee10fa49a9b2b8280054f1))
* **modules:** Horizontal module ([#164](https://github.com/roman-rr/cupertino-pane/issues/164)) ([176e327](https://github.com/roman-rr/cupertino-pane/commit/176e3277a568e7b2e9055b5802720151c160877a))
* **modules:** Inverse module ([2436337](https://github.com/roman-rr/cupertino-pane/commit/2436337a7517c372e849909474335bd198f0b251))
* **api:** calcFitHeight method with animated in params ([2327f3b](https://github.com/roman-rr/cupertino-pane/commit/2327f3be03ab740f09f907a7e7fdbbae83fcbf77))

### Enhancements

* **core:** remastered `isHidden()` and `hide()` methods
* **events:** keyboard hero ([#175](https://github.com/roman-rr/cupertino-pane/issues/175))
* **events:** keyboard hero v2 ([#175](https://github.com/roman-rr/cupertino-pane/issues/175))([#176](https://github.com/roman-rr/cupertino-pane/issues/176))
* **desktop:** text no-selectable, img no-draggable, grab cursor
* **gesture:** topperThanTop reducer cleared

### Bug Fixes

* **break:** buildBreakpoint() clear on begin ([#181](https://github.com/roman-rr/cupertino-pane/issues/181)) ([e245bca](https://github.com/roman-rr/cupertino-pane/commit/e245bca29ea3fdbae7b1e2eb6d2b6b53611e47fc))
* **core:** events attached before didPresent callback ([#170](https://github.com/roman-rr/cupertino-pane/issues/170)) ([5b49dc3](https://github.com/roman-rr/cupertino-pane/commit/5b49dc37dbc33a67093d473053872975dc816ba6))
* **desktop:** handle mouseleave events ([8c6c81f](https://github.com/roman-rr/cupertino-pane/commit/8c6c81f16814f4b1b954e0cf56c646c375c4a17a))
* **events:**  disable drag upperThanTop for full height top breakpoint ([#171](https://github.com/roman-rr/cupertino-pane/issues/171)) ([d048dbd](https://github.com/roman-rr/cupertino-pane/commit/d048dbd13c780ceda19abde6292e7dd466e6d0ad))
* **events:** clear steps after fastSwipeClose ([#180](https://github.com/roman-rr/cupertino-pane/issues/180)) ([3558cf2](https://github.com/roman-rr/cupertino-pane/commit/3558cf2fe717945fe57a01ea44cbdcebfbc1a79d))
* **events:** drag events emitted with position changes ([#179](https://github.com/roman-rr/cupertino-pane/issues/179)) ([c1aa175](https://github.com/roman-rr/cupertino-pane/commit/c1aa175d82e4721abafe426384b357e5b10b5fbf))
* **events:** hide-on-bottom attribute by recent position on touchend ([4804af8](https://github.com/roman-rr/cupertino-pane/commit/4804af8b6fa1ce46278f124f7977c3d170ceb5b6))
* **events:** overscroll-behavior fix safari scroll bounce ([c9c6a69](https://github.com/roman-rr/cupertino-pane/commit/c9c6a695f9487eabdff8a829f0ba6726def8d86b))
* **events:** skipped touchstart event ([#177](https://github.com/roman-rr/cupertino-pane/issues/177)) ([4a878f0](https://github.com/roman-rr/cupertino-pane/commit/4a878f0199136d4ae7bbb9ecfce4bf786c547ea2))


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

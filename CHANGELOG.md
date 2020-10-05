
# Change Log
All notable changes to this project will be documented in this file.

## [Unreleased]

### Features
- Added `.setDarkMode({enable: true})` method, to helps maintain color scheme after pane initialization [#68](https://github.com/roman-rr/cupertino-pane/issues/68)
- Added `.setBreakpoints(breakpoints: PaneBreaks)` method. Method updates breakpoints configuration for rendered Pane. [#69](https://github.com/roman-rr/cupertino-pane/issues/69)

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

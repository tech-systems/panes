
# Change Log
All notable changes to this project will be documented in this file.

## [Unreleased]

### Features
- Added `upperThanTop` settings property

### Bug Fixes
- Improved drag top gesture

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

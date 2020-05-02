<!-- https://github.com/ai/nanoid - cover -->

# Cupertino Pane

[![CircleCI](https://circleci.com/gh/roman-rr/cupertino-pane.svg?style=svg)](https://circleci.com/gh/roman-rr/cupertino-pane)
![npm](https://img.shields.io/npm/v/cupertino-pane)
![npm](https://img.shields.io/npm/dm/cupertino-pane?color=%23007DC5)
![NPM](https://img.shields.io/npm/l/cupertino-pane?color=%23007DC5)
[![Code Style](https://badgen.net/badge/icon/typescript?icon=typescript&label)](https://www.typescriptlang.org/)
[![Code Style](https://badgen.net/badge/code%20style/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)

<!-- <img src="https://user-images.githubusercontent.com/10646478/79794348-4846bc00-837c-11ea-8b74-7c71fac120aa.png" 
     align="right" alt="Cupertino Pane logo Roman Antonov" width="260px" height="421px"> -->
     
Cupertino Pane is great modern slide-over pane with touch technologies. <br>

* **Small.** 5kb (minified and gzipped). No dependencies.
* **Accelerated.** Hardware accelerated transitions and amazing native behavior.
* **Progressive.** Useful for mobile/web/hybrid applications.

> Right like in Apple Maps, Apple Stocks, Apple Music and other modern apps.

* [Breaking changes](#breaking-changes)
* [Demonstration](#demonstration)
* [Supporting platforms](#supporting-platforms)
* [Getting Started](#getting-started)
* [Settings](#settings)
* [Public Methods](#public-methods)
* [Attributes](#attributes)
* [Future Goals](#future-goals)
* [Contributing](#contributing)
* [License](#license)

## Breaking Changes
### v.1.1.2
- Offsets and pane position normalized across all devices and screen heights. Please re-configure offsets if needs. 
- Offsets value now calculating from screen bottom position
- Do not necessary now to specify all breaks in settings configuration. Can be changed one or few:

```javascript
let settings = {
    breaks: {
        top: { 
          enabled: true, 
          offset: window.screen.height - (135 * 0.35)
        },
        middle: {
          enabled: true,
          offset: 410 // 410 pixels from screen bottom until pane top vertex
        }
      }
    }
};
```

## Demonstration
[Live Demo Old Version](https://ionicsvelte.firebaseapp.com/ionic/Pane/)
<div style="display:flex;flex-wrap:wrap;">
  <img src="https://github.com/roman-rr/cupertino-pane/blob/master/docs/images/1.gif?raw=true" alt="Cupertino Pane - Roman Antonov" width="220px">
  <img src="https://github.com/roman-rr/cupertino-pane/blob/master/docs/images/2.gif?raw=true" alt="Cupertino Pane - Roman Antonov" width="220px">
  <img src="https://github.com/roman-rr/cupertino-pane/blob/master/docs/images/3.gif?raw=true" alt="Cupertino Pane - Roman Antonov" width="220px">
</div>

## Supporting platforms
We officially support the last two versions of every major browser. Specifically, we test on the following browsers:
- **Chrome** on Android, Windows, macOS, and Linux
- **Firefox** on Windows, macOS, and Linux
- **Safari** on iOS
- **iOS WkWebView** on iOS
- **Android WebView** on Android

## Getting Started
### Install via NPM
```sh
npm install cupertino-pane
```
### Use from CDN
If you don't want to include Cupertino Pane files in your project, you may use it from CDN. The following files are available:
```html
<script src="https://unpkg.com/cupertino-pane/dist/cupertino-pane.js"></script>
<script src="https://unpkg.com/cupertino-pane/dist/cupertino-pane.min.js"></script>
```
### Include Files To App/Website
```html
<!DOCTYPE html>
<html lang="en">
<body>
    ...
    <script src="path/to/cupertino-pane.min.js"></script>
</body>
</html>
```
### Add HTML Layout
```html
<div class="cupertino-pane">
    <h1>Header</h1>
    <div class="content">Content</div>    
</div>
```
### Additional CSS Styles
```css
.cupertino-pane {
    margin: 20px;
}
```
### Initialize Cupertino Pane
```html
<body>
  ...
  <script>
  window.onload = function () {
    var myPane = new CupertinoPane(
      '.cupertino-pane', // Pane container selector
      { 
        parentElement: 'body', // Parent container
        breaks: {
            middle: { enabled: true, offset: 300 },
            bottom: { enabled: true, offset: 80 },
        },
        onDrag: () => console.log('Drag event')
      }
    );
    myPane.present({animate: true});
  };
  </script>
</body>
```
### jQuery example
```javascript
$(document).ready(function () {
  //initialize pane when document ready
  var myPane = new CupertinoPane('.cupertino-pane', { /* ... */ });
  myPane.present();
});
```
### As an ES module
Cupertino Pane package comes with ES module version which can be used where supported or with bundlers like Webpack or Rollup:
```javascript
import { CupertinoPane } from 'cupertino-pane';

var myPane = new CupertinoPane('.cupertino-pane', { /* ... */ });
    myPane.present();
```

## Settings
### Common configuration
- `parentElement` | **string** | Element selector where pane will appended (by default using parent element where html layout placed)
- `initialBreak` | **(top|middle|bottom): 'middle'** | Initial pane position
- `darkMode` | **boolean: false** | Initial pane styles
- `backdrop` | **boolean: false** | Dimmed overlay will rendered with pane if `true`
- `backdropTransparent` | **boolean: false** | Dimmed overlay will rendered with zero opacity
- `animationType` | **(ease | ease-in | ease-out | ease-in-out | cubic-bezier): 'ease'** | Transition property animation type
- `animationDuration` | **number: 300** | Transition property duration
- `bottomClose` | **boolean: false** | Close pane with drag to bottom breakpoint
- `freeMode` | **boolean: false** | On `true` will remove automatical magnetic effects to near breakpoint.
- `buttonClose` | **boolean: true** | Determinate whetever close button will render or not
- `topperOverflow` | **boolean: true** | Ability to scroll content inside pane if topper point reached
- `topperOverflowOffset` | **number: 0** | Offset from screen bottom to the end of overflow content
- `showDraggable` | **boolean: true** | Render rectangular shape on the top of pane
- `clickBottomOpen` | **boolean: true** | If bottom position reached, simple click to pane will open pane to the next upper point
- `dragByCursor` | **boolean: false** | Drag pane only with draggabale top cursor
- `simulateTouch` | **boolean: true** | Simulate touch events for Desktop
- `passiveListeners` | **boolean: true** | (Indicates that the function specified by listener will never call preventDefault())
### Breakpoints
- `breaks` | **{}** | Using to override default pane breakpoints.
    - `top` | **{}** | Topper point that pane can reach
        - `enabled` | **boolean: true** | Enable or disable breakpoint
        -  `offset` | **number: window.screen.height - (135 * 0.35)** | Additional bottom margin if needs
    - `middle` | **{}** | Middle point that pane can reach
        - `enabled` | **boolean: true** | Enable or disable breakpoint
        -  `offset` | **number: 300** | Additional bottom margin if needs
    - `bottom` | **{}** | Bottom point that pane can reach
        - `enabled` | **boolean: true** | Enable or disable breakpoint
        -  `offset` | **number: 100** | Additional bottom margin if needs
### Callbacks
The function that executes when the event fires.
- `onDidDismiss` | **void: () => {}** | Call after pane will dissapeared
- `onWillDismiss` | **void: () => {}** | Call before pane will dissapeared
- `onDidPresent` | **void: () => {}** | Call after pane will present
- `onWillPresent` | **void: () => {}** | Call before panel will present
- `onDragStart` | **void: () => {}** | Call when detect user drag event on pane
- `onDrag` | **void: () => {}** | Call executes on each new pane position
- `onBackdropTap` | **void: () => {}** | Call when user tap backdrop overlay

## Public Methods
### present({animate: **boolean = false**})
Will render pane DOM and show pane with setted params.
```javascript
myPane.present();
```
### moveToBreak('top' | 'middle' | 'bottom')
Will change pane position with animation to selected breakpoint.
```javascript
myPane.moveToBreak('top');
```
### hide()
Dissappear pane from screen, still keep pane in DOM.
```javascript
myPane.hide();
```
### destroy({animate: **boolean = false**})
Remove pane from DOM and clear styles
```javascript
myPane.destroy();
```
### isHidden()
Determinate if pane position was moved out of screen, but pane still exist in DOM.
true - in DOM but not visible, false - in DOM and visible, null - not rendered
```javascript
if (myPane.isHidden()) {
    myPane.moveToBreak('top');
}
```
### currentBreak()
Method return current break position in text format ('top' | 'middle' | 'bottom)
```javascript
if (myPane.currentBreak() === 'top') {
    myPane.moveToBreak('bottom');
}
```
### disableDrag()
Method disable any drag actions for pane
```javascript
myPane.disableDrag();
```
### enableDrag()
Method enable any drag actions for pane
```javascript
myPane.enableDrag();
```

## Attributes
### hide-on-bottom
Set for element to automaticaly hide on reach bottom breakpoint.
```html
<div class="cupertino-pane">
    <h1>Header</h1>
    <div class="content" hide-on-bottom>Content</div>    
</div>
```
### overflow-y
Set for element with overflow ability. 
By default using for full pane area, but in some cases good useful with header.
```html
<div class="cupertino-pane">
    <h1>Header</h1>
    <div class="content" overflow-y>Content</div>    
</div>
```

## Future Goals
- Playground (livereload, build cordova app from html)
- Precision delta counts
- 3D effect (ion-modal example)
- Drawer effect
- 3D button toggle effect
- Realistic easy-in-out transitions
- Readme (livedemos/tables/nanoid cons)

## Contributing
We welcome contributions of all kinds from anyone.
### 1. Where do I go from here?
If you've noticed a bug or have a question, [make an issue](https://github.com/roman-rr/cupertino-pane/issues/new),
we'll try to answer it as fast as possible.
### 2. Fork & Create a branch
If this is something you think you can fix, then
[fork Cupertino Pane](https://help.github.com/articles/fork-a-repo)
and create a branch.
```sh
# Create new branch
git checkout -b my_issue

# Then we install the dependencies
npm install
```
### 3. Changes & Build
```sh
# Make bundles 
gulp build
```
This will output the files into the dist directory.
### 4. Push changes
Push your changes to a topic branch in your fork of the repository.
Submit a pull request to the repository.
It can take several days before we can review the code you've submitted. 

## License
Licensed under the MIT License. [View license](/LICENSE).

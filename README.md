<p align="center">
     <!-- <img alt="Cupertino Panes is multi-functional panes & boards with touch technologies" src="docs/logo/logo-1-mini.jpg" width="600" /> -->
     <img alt="Cupertino Panes is multi-functional panes & boards with touch technologies" src="docs/logo/logo-2-mini.png" width="600" />
</p>

# Cupertino Panes

[![CircleCI](https://circleci.com/gh/roman-rr/cupertino-pane.svg?style=svg)](https://circleci.com/gh/roman-rr/cupertino-pane)
![npm](https://img.shields.io/npm/v/cupertino-pane)
![npm](https://img.shields.io/npm/dm/cupertino-pane?color=%23007DC5)
![NPM](https://img.shields.io/npm/l/cupertino-pane?color=%23007DC5)
[![Code Style](https://badgen.net/badge/icon/typescript?icon=typescript&label)](https://www.typescriptlang.org/)
[![Code Style](https://badgen.net/badge/code%20style/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![Financial Contributors on Open Collective](https://opencollective.com/cupertino-pane/all/badge.svg?label=financial+contributors)](https://opencollective.com/cupertino-pane)


<!-- <img src="https://user-images.githubusercontent.com/10646478/79794348-4846bc00-837c-11ea-8b74-7c71fac120aa.png" 
     align="right" alt="Cupertino Pane logo Roman Antonov" width="260px" height="421px"> -->
     
Cupertino Panes is multi-functional panes & boards with touch technologies. <br>

* **Small.** 12kb (minified and gzipped bundle with all modules). No dependencies.
* **Modularized.** Add extra features to your panes and create own modules.
* **Accelerated.** Hardware accelerated transitions and amazing native behavior.
* **Progressive.** Useful for mobile/web/hybrid applications.

> Right like in Apple Maps, Apple Stocks, Apple Music and other modern apps.

⭐ We appreciate your star, it helps!

* [Demonstration](#demonstration)
* [Financial Contributors](#financial-contributors)
* [Supporting platforms](#supporting-platforms)
* [Getting Started](#getting-started)
* [Modules](#modules)
* [Settings](#settings)
* [Breakpoints](#breakpoints)
* [Z-Stack](#z-stack)
* [Events](#events)
* [Public Methods](#public-methods)
* [Attributes](#attributes)
* [CSS Variables](#css-variables)
* [Keyboard issues](#keyboard-issues)
* [Future Goals](#future-goals)
* [Contributors](#contributors)
* [Changelog](https://github.com/roman-rr/cupertino-pane/blob/master/CHANGELOG.md)
* [License](#license)

## Financial Contributors

Become a financial contributor and help us sustain our community. [[Contribute](https://opencollective.com/cupertino-pane/contribute)]

#### Individuals

<a href="https://opencollective.com/cupertino-pane"><img src="https://opencollective.com/cupertino-pane/individuals.svg?width=890"></a>

#### Organizations

Support this project with your organization. Your logo will show up here with a link to your website. [[Contribute](https://opencollective.com/cupertino-pane/contribute)]

<a href="https://opencollective.com/cupertino-pane"><img src="https://opencollective.com/cupertino-pane/organizations.svg?width=890"></a>

## Demonstration
- [Synthwave live](https://output.jsbin.com/garijar)
- [Picture-in-Picture live](https://output.jsbin.com/dubixep)
- [Rich notifications live](https://jsbin.com/neqoxef)
- [Base live](https://output.jsbin.com/fuhisey)
- [Overflow top live](https://output.jsbin.com/baguroy)
- [Z-stack full live](https://output.jsbin.com/benidub)
- [Z-Stack simple live](https://output.jsbin.com/daqihir)
- [3D Push live](https://output.jsbin.com/vidaqa)
- [Overflow top-middle live](https://output.jsbin.com/piwecad)
- [Draggable over live](https://jsbin.com/hamedec)
- [Prevent dismiss live](https://output.jsbin.com/keravam)
- [Top-to-bottom live](https://output.jsbin.com/muhabuf)
- [Follower live](https://output.jsbin.com/xogavec)
- [Apple Clips live](https://output.jsbin.com/luqaxud)
- [Bulletin live](https://output.jsbin.com/maqigod)
- [Starbucks live](https://output.jsbin.com/jayicip)
- [Backdrop drag-opacity live](https://output.jsbin.com/riwahab)

<div style="display:flex;flex-wrap:wrap;">
  <img style="width: 200px;" width="200" height="433.59" src="docs/images/custom-transitions.gif?raw=true" alt="Cupertino Pane - Roman Antonov" >
  <img style="width: 200px;" width="200" src="docs/images/picture-in-picture.gif?raw=true" alt="Cupertino Pane - Roman Antonov" >
  <img style="width: 200px;" width="200" src="docs/images/notifications.gif?raw=true" alt="Cupertino Pane - Roman Antonov" >
  <img style="width: 200px;" width="200" src="docs/images/z-stack.gif?raw=true" alt="Cupertino Pane - Roman Antonov" >
  <img style="width: 200px;" width="200" src="docs/images/overflow.gif?raw=true" alt="Cupertino Pane - Roman Antonov" >
  <img style="width: 200px;" width="200" src="docs/images/bulletin.gif?raw=true" alt="Cupertino Pane - Roman Antonov" >

</div>

## Supporting platforms
We officially support the last two versions of every major browser. Specifically, we test on the following browsers
| Browser | Operating system |
| - | - |
| **Chrome** | Android, Windows, macOS, and Linux |
| **Firefox** | Windows, macOS, and Linux |
| **Safari** | iOS |
| **WkWebView** | iOS |
| **Android WebView** | Android |

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
            middle: { enabled: true, height: 300, bounce: true },
            bottom: { enabled: true, height: 80 },
        },
        events: {
          onDrag: () => console.log('Drag event')
        }
      }
    );
    myPane.present({animate: true}).then(res => {...});
  };
  </script>
</body>
```
### jQuery example
```javascript
$(document).ready(function () {
  //initialize pane when document ready
  var myPane = new CupertinoPane('.cupertino-pane', { /* ... */ });
  myPane.present({animate: true}).then(...);
});
```
### As an ES module
Cupertino Pane package comes with ES module version which can be used where supported or with bundlers like Webpack or Rollup:
```javascript
import { CupertinoPane, CupertinoSettings } from 'cupertino-pane';

let settings: CupertinoSettings = { /* ... */ };
let myPane = new CupertinoPane('.cupertino-pane', settings);
    await myPane.present({animate: true});
```

### Class creation
You can pass html element or string selector to class constructor
```javascript
// String selector
new CupertinoPane('.cupertino-pane');

// HTML element
let element = document.querySelector('.cupertino-pane');
new CupertinoPane(element); // HTMLElement
```

## Modules

> Available modules:   ZStackModule, FollowerModule, BackdropModule, FitHeightModule, InverseModule, HorizontalModule

Modular architecture of the project helps us to keep small size of bundles, also huge scalability features are possible. 

We are welcome to creators — feel free to make your own modules!

**Examples** of modules can be found [here](https://github.com/roman-rr/cupertino-pane/tree/master/src/modules)

### Install es bundle with all modules
By default you will import `esm` with all modules in bundle:
```js
import { CupertinoPane } from 'cupertino-pane';
```
Size of this bundle might be more than you need, if you don't use all features and modules. 
### Install es bundle with specific modules
Pick modules that you need to decrease bundle size:
```js
import { CupertinoPane } from 'cupertino-pane/dist/core';
import { BackdropModule, FitHeightModule } from 'cupertino-pane/dist/modules';

let myPane = new CupertinoPane('.cupertino-pane', {
  modules: [BackdropModule, FitHeightModule],
  fitHeight: true,
  backdrop: true
});
```
Be sure that you're import only `core` version here with `modules` you need. 
You can check installed modules:
```js
console.log(myPane.modules);
```
### Build your own umd bundles with specific modules
Clone repository and run commands:
```js
npm run build // will include all modules
npm run build -- --modules="" // will not include any modules
npm run build -- --modules="ZStackModule, BackdropModule" // Cherry-pick your modules 
```
As output you will have your `umd` and `esm` builds in `dist` folder.

## Settings
### Common configuration
| Property | Type | Default | Description |
| - | - | - | - |
| **horizontal** | `boolean` | false | Drag by horizontal axis will be possible on `true` and left right screen edge will automatically recognized as horizontal breakpoints |
| **horizontalOffset** | `number` | 'null' | Margin left and right for screen edges used with horizontal gestures |
| **inverse** | `boolean` | false | On `true` will change pane direction from `bottom-to-top` to `top-to-bottom` |
| **parentElement** | `string` | Parent element selector | Element selector where pane will rendered |
| **followerElement** | `string` | Follower element selector | Element with selector will following pane transitions |
| **cssClass** | `string` | null | Additional classes to apply for wrapper to stylize different panes |
| **fitHeight** | `boolean` | 'false' | Automatically calc and define content height as top breakpoint. Middle and bottom breakpoint will be disabled |
| **maxFitHeight** | `number` | 'null' | Define a maximum possible automatically calculated height with `fitHeight` property |
| **fitScreenHeight** | `boolean` | 'true' | On `true` will automatically adjust pane maximum height to screen height |
| **initialBreak** | `'top' \| 'middle' \| 'bottom'` | 'middle' | Initial pane position |
| **backdrop** | `boolean` | false | Dimmed overlay will rendered with pane if `true` |
| **backdropOpacity** | `number` | 0.4 | Dimmed overlay opacity value |
| **animationType** | `string` | 'ease' | Base transition timing function |
| **animationDuration** | `number` | 300 | Transition property duration |
| **bottomClose** | `boolean` | false | Close pane with drag to bottom breakpoint |
| **fastSwipeClose** | `boolean` | false | Close pane with fast drag to bottom direction |
| **fastSwipeSensivity** | `number` | 3 | Increase value and fast swipes become heavier |
| **freeMode** | `boolean` | false | On `true` will remove automatical magnetic effects to near breakpoint |
| **lowerThanBottom** | `boolean` | true | By default allow user to drag pane lower than bottom position. On `false` will automatically place pane to bottom position on lower than bottom attemption |
| **upperThanTop** | `boolean` | false | Allow user to drag pane upper than maximum top position. Useful with bulletin style without overflow-y |
| **touchAngle** | `number` | 45 | Allowable angle (in degrees) to trigger drag gestures |
| **buttonDestroy** | `boolean` | true | Determinate whetever close button will render or not |
| **bottomOffset** | `number` | 0 | Margin bottom for pane from screen bottom point |
| **topperOverflow** | `boolean` | true | Ability to scroll content inside pane if topper point reached |
| **topperOverflowOffset** | `number` | 0 | Offset from screen bottom to the end of overflow content |
| **showDraggable** | `boolean` | true | Render rectangular shape on the top of pane
| **draggableOver** | `boolean` | true | Render rectangular shape over a pane
| **clickBottomOpen** | `boolean` | true | If bottom position reached, simple click to pane will open pane to the next upper point |
| **dragBy** | `string[]` | null | Array of selectors for whom elements drag events will be attached. By default drag events attached to pane element. If you are about to drag only with draggable component set option to ['.pane .draggable'] |
| **preventClicks** | `boolean` | true | Prevent accidental unwanted clicks events during move gestures |
| **handleKeyboard** | `boolean` | true | Pane will be pushed up on open keyboard (only for cordova/capacitor/phonegap applications) |
| **touchMoveStopPropagation** | `boolean` | false | If enabled, then propagation of "touchmove" will be stopped |
| **simulateTouch** | `boolean` | true | Simulate touch events for Desktop |
| **passiveListeners** | `boolean` | true | (Indicates that the function specified by listener will never call preventDefault()) |

### Breakpoints
Package now supports 3 base breakpoints
```javascript
const pane = new CupertinoPane('.cupertino-pane', { 
  breaks: {
    top: { // Topper point that pane can reach
      enabled: true, // Enable or disable breakpoint
      height: 700, // Pane breakpoint height
      bounce: true // Bounce pane on transition
    },
    middle: { ... },
    bottom: { ... }
  }
});
```
Bottom and middle heights normalized accross devices by default 

Default top height: `window.screen.height - (135 * 0.35)`

Add property `bounce` to break and enjoy transitions in apple stocks style with `cubic-bezier(0.175, 0.885, 0.370, 1.120)`

### Z-Stack
Configuration for 3D push effects and z-stack
```js
let settings = {
  ...
  zStack: {
    pushElements: ['.card-1', '.main-content'],
    pushYOffset: 10
  }
}
```
| Property | Type | Default | Description |
| - | - | - | - |
| **pushElements** | `string[]` | null | DOM Element will be pushed and scaled |
| **minPushHeight** | `number` | null | Height from which 3d push effect will be started |
| **cardYOffset** | `number` | null | Margin value to place pushed elements upper |
| **cardZScale** | `number` | 0.93 | Scale value for each pushed element |
| **cardContrast** | `number` | 0.85 | Contrast value for each pushed element |
| **stackZAngle** | `number` | 160 | Value from 0 to 3000 that define angle of z-stack in common. 0 - 150 positive expontial angle. 150 - 170 = 45 degree angle. 200 - 3000 negative exponential angle |

### Events
The function that executes when the event fires. Events can be assigned in two ways: 
1. Using `events` parameter on initialization:
```js
let settings = {
  ...
  events: {
    onWillPresent: (ev) => {
      console.log('Will present callback', ev);
    }
  }
}
```
2. Using on method after initialization.
```js
const pane = new CupertinoPane('.cupertino-pane', { /* ... */ });
pane.on('onBackdropTap', (ev) => {
  console.log('Backdrop tapped', ev);
});
```
| Name | Type | Description |
| ---- | ---- | ----------- |
| **onDidDismiss** | `void: () => {}` | Call after pane will dissapeared |
| **onWillDismiss** | `void: () => {}` | Call before pane will dissapeared |
| **onDidPresent** | `void: () => {}` | Call after pane will present |
| **onWillPresent** | `void: () => {}` | Call before panel will present |
| **onDragStart** | `void: () => {}` | Call when detect user drag event on pane |
| **onDrag** | `void: () => {}` | Call executes on each new position of pane |
| **onDragEnd** | `void: () => {}` | Executes when drag event complete |
| **onBackdropTap** | `void: () => {}` | Call when user tap backdrop overlay |
| **onTransitionStart** | `void: () => {}` | Executes before auto transition and animation start |
| **onTransitionEnd** | `void: () => {}` | Executes when transition and animation complete |

## Public Methods
### present({animate: **boolean = false**, transition: **{}**}): Promise<CupertinoPane>
Will render pane DOM and show pane with setted params. 
```javascript
myPane.present();
```
Possible to pass custom transitions:
```javascript
myPane.present({
  animate: true,
  transition: {
    duration: 600,
    from: {
      opacity: 0.7,
      transform: `translateY(280px) perspective(250px) rotateX(65deg) scale(0.3)`
    },
    to: {
      opacity: 1
    }
  }
});
```
### destroy({animate: **boolean = false**, transition: **{}**}}}): Promise<CupertinoPane>
Remove pane from DOM and clear styles
```javascript
myPane.destroy({animate: true});
```
Possible to pass custom transitions (look above present method for example)
### on({events: **string**, handler: **Function**}): Promise<CupertinoPane>
Will assign a function to be executed when the event will be fired.
```javascript
myPane.on('onDidPresent', () => console.log('Presented!'));
```
### moveToBreak('top' | 'middle' | 'bottom')
Will change pane position with animation to selected breakpoint.
```javascript
myPane.moveToBreak('top');
```
### moveToHeight(val: **number**)
Will move pane to exact height with animation. Breakpoints will saved. 
```javascript
myPane.moveToHeight(575);
```
### hide()
Dissappear pane from screen, still keep pane in DOM.
```javascript
myPane.hide();
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
### backdrop({show: **boolean = true**})
Show/Hide backdrop method 
```javascript
myPane.backdrop({show: true}); // show
myPane.backdrop({show: false}); // hide
```
### setBreakpoints(breakpoints: **PaneBreaks**)
Method updates breakpoints configuration for rendered Pane
```javascript
myPane.setBreakpoints({
  top: {
      enabled: true,
      height: 700,
      bounce: true
  },
  middle: { ... },
  bottom: { ... }
});
```
### preventDismiss(**boolean = false**)
Use this method to prevent dismiss events. Use `onWillDismiss()` callback to listen if dismiss event prevented. 
```javascript
const settings = {
  ...
  events: {
    onWillDismiss: (e) => {
      if (e) {
        console.log(e.prevented);
      }
    }
  }
}

const myPane = new CupertinoPane('.cupertino-pane', settings);
myPane.present({animate: true});
myPane.preventDismiss(true);
```
### calcFitHeight()
Force re-calculate height for `fitHeight: true` in cases when height was calculated not properly.
```javascript
myPane.calcFitHeight();
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

## CSS Variables
| Variable | Default |
| - | - |
| **--cupertino-pane-background** | `#ffffff` |
| **--cupertino-pane-color** | `#333333` |
| **--cupertino-pane-shadow** | `#0 4px 16px rgba(0,0,0,.12)` |
| **--cupertino-pane-border-radius** | `#20px` |
| **--cupertino-pane-move-background** | `#c0c0c0` |
| **--cupertino-pane-destroy-button-background** | `#ebebeb` |
| **--cupertino-pane-icon-close-color** | `#7a7a7e` |

## Keyboard issues
By default, we are now handle keyboard in all type of applications. 
If you would like handle this part by yourself, set option `handleKeyboard: false`.

- Safari WebKit (browser) will handle inputs and keyboard automatically. 
- Chrome WebView (browser) are handled in our end with resize events. 
- Cordova WkWebView/WebView are handled in our end with keyboard events.

## Future Goals
Project under regularly maintanance and bug fixes. 
All **new features** and **new investigations** moved to open collective [Goals](https://opencollective.com/cupertino-pane/conversations/all-goals-and-featured-packages-o60ddaqg)

## Contributors
We are welcome contributions of all kinds from anyone. 
Please review the [contributing](https://github.com/roman-rr/cupertino-pane/blob/master/CONTRIBUTING.md) guideline.

Commit Message Format [angular commit format](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-format)

## License
Licensed under the MIT License. [View license](/LICENSE).

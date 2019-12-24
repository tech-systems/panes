# Cupertino Pane


![CircleCI](https://img.shields.io/circleci/build/github/roman-rr/cupertino-pane?color=%23239922&label=circle-ci)
![npm](https://img.shields.io/npm/v/cupertino-pane)
![npm](https://img.shields.io/npm/dm/cupertino-pane?color=%23007DC5)
![NPM](https://img.shields.io/npm/l/cupertino-pane?color=%23007DC5)
[![Code Style](https://badgen.net/badge/icon/typescript?icon=typescript&label)](https://www.typescriptlang.org/)
[![Code Style](https://badgen.net/badge/code%20style/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)

Cupertino Pane is ... lightweight, multiplatform slide-over pane (like google maps, stocks, with JavaScript)

* [Supporting platforms](#supporting-platforms)
* [Settings](#settings)
    * [Common configuration](#common-configuration)
    * [Breakpoints](#breakpoints)
    * [Callbacks](#callbacks)
* [Future Goals](#future-goals)
* [Contributing](#contributing)
* [License](#license)

## Demonstration
<div style="display:flex;flex-wrap:wrap;">
    <img src="https://github.com/roman-rr/cupertino-pane/blob/master/docs/images/1.gif?raw=true" width="250">
    <img src="https://github.com/roman-rr/cupertino-pane/blob/master/docs/images/3.gif?raw=true" width="250">
    <img src="https://github.com/roman-rr/cupertino-pane/blob/master/docs/images/2.gif?raw=true" width="250">
</div>


## Supporting platforms
We officially support the last two versions of every major browser. Specifically, we test on the following browsers:
- **Chrome** on Android, Windows, macOS, and Linux
- **Firefox** on Windows, macOS, and Linux
- **Safari** on iOS
- **iOS WkWebView** on iOS
- **Android WebView** on Android

## Features

## Getting Started
### Install using CDN
### Install using npm

## Examples
### Angular
### React
### jQuery


















## Settings
### Common configuration
- `initialShow` | **boolean: false** | Determinate if pane will rendered with animation or immediately
- `initialBreak` | **(top|middle|bottom): 'middle'** | Initial pane position
- `darkMode` | **boolean: false** | Initial pane styles
- `backdrop` | **boolean: false** | Dimmed overlay will rendered with pane if `true`
- `backdropClose` | **boolean: false** | Close pane with click to backdrop element
- `animationType` | **(ease | ease-in | ease-out | ease-in-out | cubic-bezier): 'ease'** | Transition property animation type
- `animationDuration` | **number: 300** | Transition property duration
- `bottomClose` | **boolean: false** | Close pane with drag to bottom breakpoint
- `freeMode` | **boolean: false** | On `true` will remove automatical magnetic effects to near breakpoint.
- `buttonClose` | **boolean: true** | Determinate whetever close button will render or not
- `topperOverflow` | **boolean: true** | Ability to scroll content inside pane if topper point reached
- `topperOverflowOffset` | **number: 0** | Offset from screen bottom to the end of overflow content
- `showDraggable` | **boolean: true** | Render rectangular shape on the top of pane
- `clickBottomOpen` | **boolean: true** | If bottom position reached, simple click to pane will open pane to the next upper point
### Breakpoints
- `breaks` | **{}** | Using to override default pane breakpoints. Note that **necessary** to define all three breakpoints when override, with new `enabled` and `offset` if needs.
    - `top` | **{}** | Topper point that pane can reach
        - `enabled` | **boolean: true** | Enable or disable breakpoint
        -  `offset` | **number: 0** | Additional bottom margin if needs
    - `middle` | **{}** | Middle point that pane can reach
        - `enabled` | **boolean: true** | Enable or disable breakpoint
        -  `offset` | **number: 0** | Additional bottom margin if needs
    - `bottom` | **{}** | Bottom point that pane can reach
        - `enabled` | **boolean: true** | Enable or disable breakpoint
        -  `offset` | **number: 0** | Additional bottom margin if needs
### Callbacks
The function that executes when the event fires.
- `onDidDismiss` | **void: () => {}** | Call after pane will dissapeared
- `onWillDismiss` | **void: () => {}** | Call before pane will dissapeared
- `onDidPresent` | **void: () => {}** | Call after pane will present
- `onWillPresent` | **void: () => {}** | Call before panel will present
- `onDragStart` | **void: () => {}** | Call when detect user drag event on pane
- `onDrag` | **void: () => {}** | Call executes on each new pane position
## Future Goals
- Hardware accelerated drag&drop actions
- Realistic easy-in-out transitions
- Work out the state with overflow-x
- Using in all popular mobile frameworks
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
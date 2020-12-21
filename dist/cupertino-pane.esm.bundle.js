/**
 * Cupertino Pane 1.2.1
 * Multiplatform slide-over pane
 * https://github.com/roman-rr/cupertino-pane/
 *
 * Copyright 2019-2020 Roman Antonov (roman-rr)
 *
 * Released under the MIT License
 *
 * Released on: December 21, 2020
 */

class Support {
    static get touch() {
        return (window['Modernizr'] && window['Modernizr'].touch === true) || (function checkTouch() {
            return !!((window.navigator.maxTouchPoints > 0) || ('ontouchstart' in window) || (window['DocumentTouch'] && document instanceof window['DocumentTouch']));
        }());
    }
    static get observer() {
        return ('MutationObserver' in window || 'WebkitMutationObserver' in window);
    }
    static get backdropFilter() {
        return CSS.supports("backdrop-filter", "blur(0px)")
            || CSS.supports("-webkit-backdrop-filter", "blur(0px)");
    }
    static get passiveListener() {
        let supportsPassive = false;
        try {
            const opts = Object.defineProperty({}, 'passive', {
                // eslint-disable-next-line
                get() {
                    supportsPassive = true;
                },
            });
            window.addEventListener('testPassiveListener', null, opts);
        }
        catch (e) {
            // No support
        }
        return supportsPassive;
    }
    static get gestures() {
        return 'ongesturestart' in window;
    }
    static get pointerEvents() {
        return !!window['PointerEvent'] && ('maxTouchPoints' in window.navigator) && window.navigator.maxTouchPoints > 0;
    }
}

class Device {
    constructor() {
        this.ios = false;
        this.android = false;
        this.androidChrome = false;
        this.desktop = false;
        this.iphone = false;
        this.ipod = false;
        this.ipad = false;
        this.edge = false;
        this.ie = false;
        this.firefox = false;
        this.macos = false;
        this.windows = false;
        this.cordova = !!(window['cordova'] || window['phonegap']);
        this.phonegap = !!(window['cordova'] || window['phonegap']);
        this.electron = false;
        this.ionic = !!document.querySelector('ion-app');
        const platform = window.navigator.platform;
        const ua = window.navigator.userAgent;
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        let android = ua.match(/(Android);?[\s\/]+([\d.]+)?/); // eslint-disable-line
        let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
        let ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
        let iphone = !this.ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
        let ie = ua.indexOf('MSIE ') >= 0 || ua.indexOf('Trident/') >= 0;
        let edge = ua.indexOf('Edge/') >= 0;
        let firefox = ua.indexOf('Gecko/') >= 0 && ua.indexOf('Firefox/') >= 0;
        let windows = platform === 'Win32';
        let electron = ua.toLowerCase().indexOf('electron') >= 0;
        let macos = platform === 'MacIntel';
        // iPadOs 13 fix
        if (!ipad
            && macos
            && Support.touch
            && ((screenWidth === 1024 && screenHeight === 1366) // Pro 12.9
                || (screenWidth === 834 && screenHeight === 1194) // Pro 11
                || (screenWidth === 834 && screenHeight === 1112) // Pro 10.5
                || (screenWidth === 768 && screenHeight === 1024) // other
            )) {
            ipad = ua.match(/(Version)\/([\d.]+)/);
            macos = false;
        }
        this.ie = ie;
        this.edge = edge;
        this.firefox = firefox;
        // Android
        if (android && !windows) {
            this.os = 'android';
            this.osVersion = android[2];
            this.android = true;
            this.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0;
        }
        if (ipad || iphone || ipod) {
            this.os = 'ios';
            this.ios = true;
        }
        // iOS
        if (iphone && !ipod) {
            this.osVersion = iphone[2].replace(/_/g, '.');
            this.iphone = true;
        }
        if (ipad) {
            this.osVersion = ipad[2].replace(/_/g, '.');
            this.ipad = true;
        }
        if (ipod) {
            this.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
            this.ipod = true;
        }
        // iOS 8+ changed UA
        if (this.ios && this.osVersion && ua.indexOf('Version/') >= 0) {
            if (this.osVersion.split('.')[0] === '10') {
                this.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
            }
        }
        // Webview
        this.webView = !!((iphone || ipad || ipod) && (ua.match(/.*AppleWebKit(?!.*Safari)/i) || window.navigator['standalone']))
            || (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
        this.webview = this.webView;
        this.standalone = this.webView;
        // Desktop
        this.desktop = !(this.ios || this.android) || electron;
        if (this.desktop) {
            this.electron = electron;
            this.macos = macos;
            this.windows = windows;
            if (this.macos) {
                this.os = 'macos';
            }
            if (this.windows) {
                this.os = 'windows';
            }
        }
        // Pixel Ratio
        this.pixelRatio = window.devicePixelRatio || 1;
    }
}

/**
 * Touch start, Touch move, Touch end,
 * Click, Keyboard show, Keyboard hide
 */
class Events {
    constructor(instance, settings, device) {
        this.instance = instance;
        this.settings = settings;
        this.device = device;
        this.allowClick = true;
        this.disableDragAngle = false;
        this.pointerDown = false;
        this.contentScrollTop = 0;
        this.steps = [];
        this.inputBlured = false;
        /**
         * Touch Start Event
         * @param t
         */
        this.touchStartCb = (t) => this.touchStart(t);
        /**
         * Touch Move Event
         * @param t
         */
        this.touchMoveBackdropCb = (t) => this.touchMoveBackdrop(t);
        /**
         * Touch Move Event
         * @param t
         */
        this.touchMoveCb = (t) => this.touchMove(t);
        /**
         * Touch End Event
         * @param t
         */
        this.touchEndCb = (t) => this.touchEnd(t);
        /**
         * Click Event
         * @param t
         */
        this.onClickCb = (t) => this.onClick(t);
        /**
         * Open Cordova Keyboard event
         * @param e
         */
        this.onKeyboardShowCb = (e) => this.onKeyboardShow(e);
        /**
         * Close Cordova Keyboard event
         * @param e
         */
        this.onKeyboardHideCb = (e) => this.onKeyboardHide(e);
    }
    touchStart(t) {
        // Event emitter
        this.settings.onDragStart(t);
        if (this.instance.disableDragEvents)
            return;
        // Allow clicks by default, disallow on move
        this.allowClick = true;
        // Allow touch angle by default, disallow no move with condition
        this.disableDragAngle = false;
        // Allow pereventDismiss by default
        this.instance.preventedDismiss = false;
        const targetTouch = t.type === 'touchstart' && t.targetTouches && (t.targetTouches[0] || t.changedTouches[0]);
        const screenY = t.type === 'touchstart' ? targetTouch.clientY : t.clientY;
        const screenX = t.type === 'touchstart' ? targetTouch.clientX : t.clientX;
        if (t.type === 'mousedown')
            this.pointerDown = true;
        this.startY = screenY;
        this.startX = screenX;
        // if overflow content was scrolled
        // increase to scrolled value
        if (this.isDragScrollabe(t.path || t.composedPath())) {
            this.startY += this.contentScrollTop;
        }
        this.steps.push(this.startY);
    }
    touchMoveBackdrop(t) {
        if (this.settings.touchMoveStopPropagation) {
            t.stopPropagation();
        }
    }
    touchMove(t) {
        // Event emitter
        this.settings.onDrag(t);
        if (this.instance.disableDragEvents)
            return;
        if (this.disableDragAngle)
            return;
        if (this.instance.preventedDismiss)
            return;
        if (this.settings.touchMoveStopPropagation) {
            t.stopPropagation();
        }
        // Handle desktop/mobile events
        const targetTouch = t.type === 'touchmove' && t.targetTouches && (t.targetTouches[0] || t.changedTouches[0]);
        const screenY = t.type === 'touchmove' ? targetTouch.clientY : t.clientY;
        const screenX = t.type === 'touchmove' ? targetTouch.clientX : t.clientX;
        if (t.type === 'mousemove' && !this.pointerDown)
            return;
        // Delta
        let n = screenY;
        let v = screenX;
        const diffY = n - this.steps[this.steps.length - 1];
        let newVal = this.instance.getPanelTransformY() + diffY;
        // textarea scrollbar
        if (this.isFormElement(t.target)
            && this.isElementScrollable(t.target)) {
            return;
        }
        // Detect if input was blured
        if (this.steps.length > 2) {
            if (this.isFormElement(document.activeElement)
                && !(this.isFormElement(t.target))) {
                document.activeElement.blur();
                this.inputBlured = true;
            }
        }
        // Touch angle
        // Only for initial gesture
        if (this.settings.touchAngle) {
            let touchAngle;
            const diffX = v - this.startX;
            const diffY = n - this.startY;
            touchAngle = (Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180) / Math.PI;
            if (diffX * diffX + diffY * diffY >= 25
                && (90 - touchAngle > this.settings.touchAngle)
                && this.steps.length === 1) {
                this.disableDragAngle = true;
                return;
            }
        }
        // Not allow move panel with positive overflow scroll
        if (this.isDragScrollabe(t.path || t.composedPath())
            && this.instance.overflowEl.style.overflowY === 'auto') {
            this.instance.overflowEl.addEventListener('scroll', (s) => {
                this.contentScrollTop = s.target.scrollTop;
            });
            if (this.settings.inverse && this.willScrolled(t)) {
                this.contentScrollTop = 0;
                return;
            }
            // Scrolled -> Disable drag
            if ((newVal > this.instance.topper && this.contentScrollTop > 0)
                || (newVal <= this.instance.topper)) {
                return;
            }
        }
        // Disallow drag topper than top point
        if (!this.settings.inverse
            && !this.settings.upperThanTop && (newVal <= this.instance.topper)) {
            this.instance.paneEl.style.transform = `translateY(${this.instance.topper}px) translateZ(0px)`;
            return;
        }
        // Allow drag topper than top point
        if (newVal <= this.instance.topper && this.settings.upperThanTop) {
            const differKoef = ((-this.instance.topper + this.instance.topper - this.instance.getPanelTransformY()) / this.instance.topper) / -8;
            newVal = this.instance.getPanelTransformY() + (diffY * differKoef);
        }
        // Disallow drag lower then bottom 
        if ((!this.settings.lowerThanBottom || this.settings.inverse)
            && (newVal >= this.instance.bottomer)) {
            this.instance.paneEl.style.transform = `translateY(${this.instance.bottomer}px) translateZ(0px)`;
            this.instance.checkOpacityAttr(newVal);
            return;
        }
        // Prevent Dismiss gesture
        if (!this.instance.preventedDismiss
            && this.instance.preventDismissEvent && this.settings.bottomClose) {
            let differKoef = ((-this.instance.topper + this.instance.topper - this.instance.getPanelTransformY()) / this.instance.topper) / -8;
            newVal = this.instance.getPanelTransformY() + (diffY * (0.5 - differKoef));
            let mousePointY = (t.touches[0].screenY - 220 - this.instance.screen_height) * -1;
            if (mousePointY <= this.instance.screen_height - this.instance.bottomer) {
                this.instance.preventedDismiss = true;
                // Emit event with prevent dismiss
                this.settings.onWillDismiss({ prevented: true });
                this.instance.moveToBreak(this.instance.prevBreakpoint);
                return;
            }
        }
        // Disallow accidentaly clicks while slide gestures
        this.allowClick = false;
        this.instance.checkOpacityAttr(newVal);
        this.instance.checkOverflowAttr(newVal);
        this.instance.doTransition({ type: 'move', translateY: newVal });
        this.steps.push(n);
    }
    touchEnd(t) {
        if (this.instance.disableDragEvents)
            return;
        const targetTouch = t.type === 'touchmove' && t.targetTouches && (t.targetTouches[0] || t.changedTouches[0]);
        const screenY = t.type === 'touchmove' ? targetTouch.clientY : t.clientY;
        if (t.type === 'mouseup')
            this.pointerDown = false;
        // Determinate nearest point
        let closest = this.instance.getClosestBreakY();
        // Swipe - next (if differ > 10)
        const diff = this.steps[this.steps.length - 1] - this.steps[this.steps.length - 2];
        // Set sensivity lower for web
        const swipeNextSensivity = window.hasOwnProperty('cordova')
            ? (this.settings.fastSwipeSensivity + 1) : this.settings.fastSwipeSensivity;
        const fastSwipeNext = (Math.abs(diff) >= swipeNextSensivity);
        if (fastSwipeNext) {
            closest = this.instance.swipeNextPoint(diff, swipeNextSensivity, closest);
            // Fast swipe toward bottom - close
            if (this.settings.fastSwipeClose
                && this.instance.currentBreakpoint < closest) {
                this.instance.destroy({ animate: true });
                return;
            }
        }
        // blur tap event
        let blurTapEvent = false;
        if ((this.isFormElement(document.activeElement))
            && !(this.isFormElement(t.target))
            && this.steps.length === 2) {
            blurTapEvent = true;
        }
        this.steps = [];
        this.instance.currentBreakpoint = closest;
        // Event emitter
        this.settings.onDragEnd(t);
        // tap event
        if (isNaN(diff) || blurTapEvent) {
            return;
        }
        this.instance.checkOpacityAttr(this.instance.currentBreakpoint);
        this.instance.checkOverflowAttr(this.instance.currentBreakpoint);
        // Bottom closable
        if (this.settings.bottomClose && closest === this.instance.breaks['bottom']) {
            this.instance.destroy({ animate: true });
            return;
        }
        // Simulationiusly emit event when touchend exact with next position (top)
        if (this.instance.getPanelTransformY() === closest) {
            this.settings.onTransitionEnd({ target: this.instance.paneEl });
        }
        this.instance.doTransition({ type: 'end', translateY: closest });
    }
    onClick(t) {
        // Prevent accidental unwanted clicks events during swiping
        if (!this.allowClick) {
            if (this.settings.preventClicks) {
                t.preventDefault();
                t.stopPropagation();
                t.stopImmediatePropagation();
            }
            return;
        }
        // Click to bottom - open middle
        if (this.settings.clickBottomOpen) {
            if (this.instance.breaks['bottom'] === this.instance.getPanelTransformY()) {
                let closest;
                if (this.settings.breaks['top'].enabled) {
                    closest = 'top';
                }
                if (this.settings.breaks['middle'].enabled) {
                    closest = 'middle';
                }
                this.instance.moveToBreak(closest);
            }
        }
    }
    onKeyboardShow(e) {
        if (this.instance.paneEl
            && this.instance.paneEl.offsetWidth === 0
            && this.instance.paneEl.offsetHeight === 0) {
            return;
        }
        if (this.device.android) {
            setTimeout(() => this.fixAndroidResize(), 20);
        }
        this.instance.prevBreakpoint = Object.entries(this.instance.breaks).find(val => val[1] === this.instance.getPanelTransformY())[0];
        let newHeight = this.settings.breaks[this.instance.currentBreak()].height + e.keyboardHeight;
        if (this.instance.screen_height < newHeight) {
            let diff = newHeight - this.instance.screen_height + (135 * 0.35);
            newHeight = this.instance.screen_height - (135 * 0.35);
            this.instance.setOverflowHeight(e.keyboardHeight);
            this.instance.moveToBreak(this.settings.breaks.top.enabled ? 'top' : 'middle');
        }
        else {
            this.instance.setOverflowHeight(e.keyboardHeight);
            this.instance.moveToHeight(newHeight);
            setTimeout(() => this.instance.overflowEl.scrollTop = document.activeElement.offsetTop);
        }
    }
    onKeyboardHide(e) {
        if (this.instance.paneEl
            && this.instance.paneEl.offsetWidth === 0
            && this.instance.paneEl.offsetHeight === 0) {
            return;
        }
        if (this.device.android) {
            this.fixAndroidResize();
        }
        if (this.inputBlured) {
            this.inputBlured = false;
        }
        else {
            this.instance.moveToBreak(this.instance.prevBreakpoint);
        }
        setTimeout(() => this.instance.setOverflowHeight());
    }
    /**
     * Private class methods
     */
    /**
     * Fix android keyboard issue with transition
     * (resize window frame height on hide/show)
     */
    fixAndroidResize() {
        if (!this.instance.paneEl)
            return;
        const ionApp = document.querySelector('ion-app');
        window.requestAnimationFrame(() => {
            this.instance.wrapperEl.style.width = '100%';
            this.instance.paneEl.style.position = 'absolute';
            window.requestAnimationFrame(() => {
                this.instance.wrapperEl.style.width = 'unset';
                this.instance.paneEl.style.position = 'fixed';
            });
        });
    }
    /**
     * Check if drag event fired by scrollable element
     */
    isDragScrollabe(path) {
        return !!path.find(item => item === this.instance.overflowEl);
    }
    willScrolled(t) {
        if (!(this.isElementScrollable(this.instance.overflowEl)
            && this.instance.overflowEl.style.overflow !== 'hidden'
            && this.isDragScrollabe(t.path || t.composedPath()))) {
            return false;
        }
        return true;
    }
    isFormElement(el) {
        const formElements = [
            'input', 'select', 'option',
            'textarea', 'button', 'label'
        ];
        if (el && el.tagName
            && formElements.includes(el.tagName.toLowerCase())) {
            return true;
        }
        return false;
    }
    isElementScrollable(el) {
        return el.scrollHeight > el.clientHeight ? true : false;
    }
}

class Settings {
    constructor() {
        this.instance = {
            initialBreak: 'middle',
            inverse: false,
            parentElement: null,
            followerElement: null,
            pushElement: null,
            pushMinHeight: null,
            pushYOffset: 0,
            backdrop: false,
            backdropOpacity: 0.4,
            animationType: 'ease',
            animationDuration: 300,
            dragBy: null,
            bottomOffset: 0,
            darkMode: false,
            bottomClose: false,
            fastSwipeClose: false,
            fastSwipeSensivity: 3,
            freeMode: false,
            buttonClose: true,
            topperOverflow: true,
            topperOverflowOffset: 0,
            lowerThanBottom: true,
            upperThanTop: false,
            showDraggable: true,
            draggableOver: false,
            clickBottomOpen: true,
            preventClicks: true,
            handleKeyboard: true,
            simulateTouch: true,
            passiveListeners: true,
            touchMoveStopPropagation: false,
            touchAngle: null,
            breaks: {},
            onDidDismiss: () => { },
            onWillDismiss: () => { },
            onDidPresent: () => { },
            onWillPresent: () => { },
            onDragStart: () => { },
            onDrag: () => { },
            onDragEnd: () => { },
            onBackdropTap: () => { },
            onTransitionStart: () => { },
            onTransitionEnd: () => { }
        };
    }
}

class CupertinoPane {
    constructor(selector, conf = {}) {
        this.selector = selector;
        this.defaultBreaksConf = {
            top: { enabled: true, height: window.innerHeight - (135 * 0.35) },
            middle: { enabled: true, height: 300 },
            bottom: { enabled: true, height: 100 },
        };
        this.disableDragEvents = false;
        this.breaks = {};
        this.screen_height = window.innerHeight;
        this.screenHeightOffset = this.screen_height;
        this.rendered = false;
        this.preventDismissEvent = false;
        this.preventedDismiss = false;
        this.iconCloseColor = '#7a7a7e';
        this.brs = [];
        this.settings = (new Settings()).instance;
        this.device = new Device();
        this.swipeNextPoint = (diff, maxDiff, closest) => {
            let brs = {};
            let settingsBreaks = {};
            if (this.settings.inverse) {
                brs['top'] = this.breaks['bottom'];
                brs['middle'] = this.breaks['middle'];
                brs['bottom'] = this.breaks['top'];
                settingsBreaks['top'] = Object.assign({}, this.settings.breaks['bottom']);
                settingsBreaks['middle'] = Object.assign({}, this.settings.breaks['middle']);
                settingsBreaks['bottom'] = Object.assign({}, this.settings.breaks['top']);
            }
            else {
                brs = Object.assign({}, this.breaks);
                settingsBreaks = Object.assign({}, this.settings.breaks);
            }
            if (this.currentBreakpoint === brs['top']) {
                if (diff > maxDiff) {
                    if (settingsBreaks['middle'].enabled) {
                        return brs['middle'];
                    }
                    if (settingsBreaks['bottom'].enabled) {
                        if (brs['middle'] < closest) {
                            return closest;
                        }
                        return brs['bottom'];
                    }
                }
                return brs['top'];
            }
            if (this.currentBreakpoint === brs['middle']) {
                if (diff < -maxDiff) {
                    if (settingsBreaks['top'].enabled) {
                        return brs['top'];
                    }
                }
                if (diff > maxDiff) {
                    if (settingsBreaks['bottom'].enabled) {
                        return brs['bottom'];
                    }
                }
                return brs['middle'];
            }
            if (this.currentBreakpoint === brs['bottom']) {
                if (diff < -maxDiff) {
                    if (settingsBreaks['middle'].enabled) {
                        if (brs['middle'] > closest) {
                            return closest;
                        }
                        return brs['middle'];
                    }
                    if (settingsBreaks['top'].enabled) {
                        return brs['top'];
                    }
                }
                return brs['bottom'];
            }
            return closest;
        };
        /************************************
         * Events
         */
        this.touchEvents = (() => {
            const touch = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
            let desktop = ['mousedown', 'mousemove', 'mouseup'];
            if (Support.pointerEvents) {
                desktop = ['pointerdown', 'pointermove', 'pointerup'];
            }
            const touchEventsTouch = {
                start: touch[0],
                move: touch[1],
                end: touch[2],
                cancel: touch[3],
            };
            const touchEventsDesktop = {
                start: desktop[0],
                move: desktop[1],
                end: desktop[2],
            };
            return Support.touch || !this.settings.simulateTouch ? touchEventsTouch : touchEventsDesktop;
        })();
        // Element or selector
        if (selector instanceof HTMLElement) {
            this.selector = selector;
        }
        else {
            this.selector = document.querySelector(selector);
        }
        // Unable attach selector or DOM element
        if (!this.selector) {
            console.warn('Cupertino Pane: wrong selector or DOM element specified', this.selector);
            return;
        }
        // Pane class created
        if (this.isPanePresented()) {
            console.warn('Cupertino Pane: specified selector or DOM element already in use', this.selector);
            return;
        }
        this.el = this.selector;
        this.el.style.display = 'none';
        this.settings = Object.assign(Object.assign({}, this.settings), conf);
        if (this.settings.parentElement) {
            this.settings.parentElement = document.querySelector(this.settings.parentElement);
        }
        else {
            this.settings.parentElement = this.el.parentElement;
        }
        this.events = new Events(this, this.settings, this.device);
    }
    drawBaseElements() {
        this.parentEl = this.settings.parentElement;
        // Wrapper
        this.wrapperEl = document.createElement('div');
        this.wrapperEl.className = `cupertino-pane-wrapper ${this.el.className}`;
        this.wrapperEl.style.position = 'absolute';
        this.wrapperEl.style.top = '0';
        this.wrapperEl.style.left = '0';
        // Panel
        this.paneEl = document.createElement('div');
        this.paneEl.className = 'pane';
        this.paneEl.style.position = 'fixed';
        this.paneEl.style.zIndex = '11';
        this.paneEl.style.width = '100%';
        this.paneEl.style.maxWidth = '500px';
        this.paneEl.style.left = '0px';
        this.paneEl.style.right = '0px';
        this.paneEl.style.marginLeft = 'auto';
        this.paneEl.style.marginRight = 'auto';
        this.paneEl.style.height = `${this.getPaneHeight()}px`;
        this.paneEl.style.background = '#ffffff';
        this.paneEl.style.boxShadow = '0 4px 16px rgba(0,0,0,.12)';
        this.paneEl.style.overflow = 'hidden';
        this.paneEl.style.willChange = 'transform';
        this.paneEl.style.transform = `translateY(${this.breaks[this.settings.initialBreak]}px) translateZ(0px)`;
        if (!this.settings.inverse) {
            this.paneEl.style.borderTopLeftRadius = '20px';
            this.paneEl.style.borderTopRightRadius = '20px';
            this.paneEl.style.paddingTop = '15px';
        }
        else {
            this.paneEl.style.borderBottomLeftRadius = '20px';
            this.paneEl.style.borderBottomRightRadius = '20px';
            this.paneEl.style.paddingBottom = '15px';
            this.paneEl.style.top = `-${this.bottomer}px`;
        }
        // Draggable
        this.draggableEl = document.createElement('div');
        this.draggableEl.className = 'draggable';
        this.draggableEl.style.padding = '5px';
        this.draggableEl.style.position = 'absolute';
        this.draggableEl.style.left = '0';
        this.draggableEl.style.right = '0';
        this.draggableEl.style.marginLeft = 'auto';
        this.draggableEl.style.marginRight = 'auto';
        this.draggableEl.style.height = '30px';
        this.draggableEl.style.zIndex = '12';
        if (!this.settings.inverse) {
            this.draggableEl.style.top = '0';
        }
        else {
            this.draggableEl.style.bottom = '0';
        }
        // Move
        this.moveEl = document.createElement('div');
        this.moveEl.className = 'move';
        this.moveEl.style.margin = '0 auto';
        this.moveEl.style.height = '5px';
        this.moveEl.style.background = '#c0c0c0';
        this.moveEl.style.width = '36px';
        this.moveEl.style.borderRadius = '4px';
        if (this.settings.inverse) {
            this.moveEl.style.marginTop = '15px';
        }
        // Content
        this.contentEl = this.el;
        this.contentEl.style.display = 'block';
        this.contentEl.style.transition = `opacity ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
        this.contentEl.style.overflowX = 'hidden';
        // Close button
        this.closeEl = document.createElement('div');
        if (!this.settings.inverse) {
            this.closeEl.className = 'close-button';
            this.closeEl.style.width = '26px';
            this.closeEl.style.height = '26px';
            this.closeEl.style.position = 'absolute';
            this.closeEl.style.background = '#ebebeb';
            this.closeEl.style.right = '20px';
            this.closeEl.style.zIndex = '14';
            this.closeEl.style.borderRadius = '100%';
            this.closeEl.style.top = '16px';
        }
        // inject DOM
        this.parentEl.appendChild(this.wrapperEl);
        this.wrapperEl.appendChild(this.paneEl);
        this.paneEl.appendChild(this.draggableEl);
        this.paneEl.appendChild(this.contentEl);
        this.draggableEl.appendChild(this.moveEl);
    }
    present(conf = { animate: false }) {
        if (!this.el)
            return;
        // Pane already exist and was rendered
        if (this.isPanePresented() && this.rendered) {
            this.moveToBreak(this.settings.initialBreak);
            return;
        }
        // Pane already exist but not rendered in this class
        if (this.isPanePresented() && !this.rendered) {
            console.warn('Cupertino Pane: specified selector or DOM element already in use', this.selector);
            return;
        }
        // Emit event
        this.settings.onWillPresent();
        if (this.settings.inverse) {
            this.screenHeightOffset = 0;
        }
        this.setBreakpoints();
        this.drawBaseElements();
        this.scrollElementInit();
        this.checkOpacityAttr(this.currentBreakpoint);
        this.checkOverflowAttr(this.currentBreakpoint);
        this.rendered = true;
        if (this.settings.followerElement) {
            if (!document.querySelector(this.settings.followerElement)) {
                console.warn('Cupertino Pane: wrong follower element selector specified', this.settings.followerElement);
                return;
            }
            this.followerEl = document.querySelector(this.settings.followerElement);
            this.followerEl.style.willChange = 'transform, border-radius';
            this.followerEl.style.transform = `translateY(0px) translateZ(0px)`;
            this.followerEl.style.transition = `all ${this.settings.animationDuration}ms ${this.getTimingFunction(this.settings.breaks[this.currentBreak()].bounce)} 0s`;
        }
        if (this.settings.pushElement) {
            this.pushElement = document.querySelector(this.settings.pushElement);
        }
        if (!this.settings.showDraggable) {
            this.draggableEl.style.opacity = '0';
        }
        // Draggable over pane position
        if (this.settings.draggableOver) {
            this.paneEl.style.background = 'transparent';
            this.paneEl.style.boxShadow = 'none';
            this.paneEl.style.paddingTop = '30px';
            this.contentEl.style.background = '#ffffff';
            this.contentEl.style.display = 'block';
            this.contentEl.style.borderTopLeftRadius = '20px';
            this.contentEl.style.borderTopRightRadius = '20px';
            this.contentEl.style.boxShadow = '0 4px 16px rgba(0,0,0,.12)';
            this.closeEl.style.top = '45px';
            this.draggableEl.style.padding = '15px';
            this.moveEl.style.width = '45px';
            this.moveEl.style.background = 'rgba(225, 225, 225, 0.6)';
            if (Support.backdropFilter) {
                this.moveEl.style['backdropFilter'] = 'saturate(180%) blur(20px)';
                this.moveEl.style['webkitBackdropFilter'] = 'saturate(180%) blur(20px)';
            }
        }
        if (this.settings.darkMode) {
            this.setDarkMode({ enable: true });
        }
        if (this.settings.buttonClose && !this.settings.inverse) {
            this.paneEl.appendChild(this.closeEl);
            this.closeEl.addEventListener('click', (t) => this.destroy({ animate: true }));
            this.closeEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path fill="${this.iconCloseColor}" d="M278.6 256l68.2-68.2c6.2-6.2 6.2-16.4 0-22.6-6.2-6.2-16.4-6.2-22.6 0L256 233.4l-68.2-68.2c-6.2-6.2-16.4-6.2-22.6 0-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3l68.2 68.2-68.2 68.2c-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3 6.2 6.2 16.4 6.2 22.6 0l68.2-68.2 68.2 68.2c6.2 6.2 16.4 6.2 22.6 0 6.2-6.2 6.2-16.4 0-22.6L278.6 256z"/>
        </svg>`;
        }
        if (this.settings.bottomClose) {
            this.settings.breaks.bottom.enabled = true;
        }
        if (this.settings.freeMode) {
            this.settings.lowerThanBottom = false;
        }
        if (this.settings.backdrop) {
            this.renderBackdrop();
        }
        /****** Fix android issues *******/
        if (this.device.android) {
            // Body patch prevent android pull-to-refresh
            document.body.style['overscrollBehaviorY'] = 'none';
        }
        /****** Attach Events *******/
        this.attachAllEvents();
        /****** Animation & Transition ******/
        if (conf.animate) {
            this.doTransition({ type: 'present', translateY: this.breaks[this.settings.initialBreak] });
        }
        else {
            // Emit event
            if (this.settings.pushElement) {
                this.pushTransition(this.breaks[this.settings.initialBreak], 'unset');
            }
            this.settings.onDidPresent();
        }
    }
    /**
     * Private Utils methods
     */
    getPaneHeight() {
        if (!this.settings.inverse) {
            return this.screen_height - this.topper - this.settings.bottomOffset;
        }
        return this.bottomer + this.settings.bottomOffset;
    }
    attachAllEvents() {
        if (!this.settings.dragBy) {
            this.attachEvents(this.paneEl);
        }
        else {
            this.settings.dragBy.forEach((selector) => {
                const el = document.querySelector(selector);
                if (el)
                    this.attachEvents(el);
            });
        }
        // Handle keyboard events for cordova
        if (this.settings.handleKeyboard && this.device.cordova) {
            window.addEventListener('keyboardWillShow', this.events.onKeyboardShowCb);
            window.addEventListener('keyboardWillHide', this.events.onKeyboardHideCb);
        }
        // Fix Android issue with resize if not handle
        if (!this.settings.handleKeyboard
            && this.device.cordova
            && this.device.android) {
            window.addEventListener('keyboardWillHide', () => {
                this.parentEl.scrollTop = 0;
                this.parentEl.parentElement.scrollTop = 0;
                this.parentEl.parentElement.parentElement.scrollTop = 0;
            });
        }
    }
    detachAllEvents() {
        if (!this.settings.dragBy) {
            this.detachEvents(this.paneEl);
        }
        else {
            this.settings.dragBy.forEach((selector) => {
                const el = document.querySelector(selector);
                if (el)
                    this.detachEvents(el);
            });
        }
        // Handle keyboard events for cordova
        if (this.settings.handleKeyboard && this.device.cordova) {
            window.removeEventListener('keyboardWillShow', this.events.onKeyboardShowCb);
            window.removeEventListener('keyboardWillHide', this.events.onKeyboardHideCb);
        }
    }
    resetEvents() {
        this.detachAllEvents();
        this.attachAllEvents();
    }
    getClosestBreakY() {
        return this.brs.reduce((prev, curr) => {
            return (Math.abs(curr - this.getPanelTransformY()) < Math.abs(prev - this.getPanelTransformY()) ? curr : prev);
        });
    }
    scrollElementInit() {
        let attrElements = this.el.querySelectorAll('[overflow-y]');
        if (!attrElements.length || attrElements.length > 1) {
            this.overflowEl = this.contentEl;
        }
        else {
            this.overflowEl = attrElements[0];
            this.overflowEl.style.overflowX = 'hidden';
        }
        if (this.settings.topperOverflow) {
            if (this.settings.upperThanTop) {
                console.warn('Cupertino Pane: "upperThanTop" allowed for disabled "topperOverflow"');
            }
            // Good to get rid of timeout
            // but render dom take a time
            if (!this.rendered) {
                // Timeout, this.overflowEl.offsetTop get time to render
                setTimeout(() => this.setOverflowHeight(), 150);
            }
            else {
                this.setOverflowHeight();
            }
        }
    }
    setOverflowHeight(offset = 0) {
        // overflowEl is not visible - ignoring execution
        if (this.overflowEl.offsetHeight === 0
            && this.overflowEl.offsetWidth === 0) {
            return;
        }
        if (!this.settings.inverse) {
            this.overflowEl.style.height = `${this.getPaneHeight()
                - this.settings.topperOverflowOffset
                - this.overflowEl.offsetTop
                - offset}px`;
        }
        else {
            this.overflowEl.style.height = `${this.getPaneHeight()
                - 30
                - this.settings.topperOverflowOffset
                - this.overflowEl.offsetTop}px`;
        }
    }
    getTimingFunction(bounce) {
        return bounce ? 'cubic-bezier(0.175, 0.885, 0.370, 1.120)' : this.settings.animationType;
    }
    checkOpacityAttr(val) {
        let attrElements = this.el.querySelectorAll('[hide-on-bottom]');
        if (!attrElements.length)
            return;
        if (this.settings.inverse)
            return;
        attrElements.forEach((item) => {
            item.style.transition = `opacity ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
            item.style.opacity = (val >= this.breaks['bottom']) ? '0' : '1';
        });
    }
    checkOverflowAttr(val) {
        if (!this.settings.topperOverflow)
            return;
        if (!this.settings.inverse) {
            this.overflowEl.style.overflowY = (val <= this.topper) ? 'auto' : 'hidden';
        }
        else {
            this.overflowEl.style.overflowY = (val >= this.bottomer) ? 'auto' : 'hidden';
        }
    }
    isPanePresented() {
        // Check through all presented panes
        let wrappers = Array.from(document.querySelectorAll('.cupertino-pane-wrapper'));
        if (!wrappers.length)
            return false;
        return wrappers.find((item) => item.contains(this.selector)) ? true : false;
    }
    isBackdropPresented() {
        return document.querySelector(`.cupertino-pane-wrapper .backdrop`)
            ? true : false;
    }
    renderBackdrop() {
        this.backdropEl = document.createElement('div');
        this.backdropEl.className = 'backdrop';
        this.backdropEl.style.overflow = 'hidden';
        this.backdropEl.style.position = 'fixed';
        this.backdropEl.style.width = '100%';
        this.backdropEl.style.bottom = '0';
        this.backdropEl.style.right = '0';
        this.backdropEl.style.left = '0';
        this.backdropEl.style.top = '0';
        this.backdropEl.style.transition = `all ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
        this.backdropEl.style.backgroundColor = `rgba(0,0,0, ${this.settings.backdropOpacity})`;
        this.backdropEl.style.display = 'none';
        this.backdropEl.style.zIndex = '10';
        this.wrapperEl.appendChild(this.backdropEl);
        this.backdropEl.style.display = 'block';
        this.backdropEl.addEventListener('click', (t) => this.settings.onBackdropTap());
        // Reset events to attach backdrop stop propagation
        this.resetEvents();
    }
    /**
     * Backdrop
     */
    backdrop(conf = { show: true }) {
        if (!this.isPanePresented()) {
            console.warn(`Cupertino Pane: Present pane before call backdrop()`);
            return null;
        }
        if (!this.isBackdropPresented()) {
            this.renderBackdrop();
        }
        const transitionEnd = () => {
            this.backdropEl.style.transition = `initial`;
            this.backdropEl.style.display = `none`;
            this.backdropEl.removeEventListener('transitionend', transitionEnd);
        };
        this.backdropEl.style.transition = `all ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
        this.backdropEl.style.backgroundColor = 'rgba(0,0,0,.0)';
        if (!conf.show) {
            // Destroy
            if (this.backdropEl.style.display === 'none')
                return;
            this.backdropEl.addEventListener('transitionend', transitionEnd);
        }
        else {
            // Present
            this.backdropEl.style.display = 'block';
            setTimeout(() => {
                this.backdropEl.style.backgroundColor = `rgba(0,0,0, ${this.settings.backdropOpacity})`;
            }, 50);
        }
    }
    attachEvents(el) {
        var _a, _b, _c;
        // Touch Events
        if (!Support.touch && Support.pointerEvents) {
            el.addEventListener(this.touchEvents.start, this.events.touchStartCb, false);
            el.addEventListener(this.touchEvents.move, this.events.touchMoveCb, false);
            el.addEventListener(this.touchEvents.end, this.events.touchEndCb, false);
            // Backdrop propagation fix
            (_a = this.backdropEl) === null || _a === void 0 ? void 0 : _a.addEventListener(this.touchEvents.move, this.events.touchMoveBackdropCb, false);
        }
        else {
            if (Support.touch) {
                const passiveListener = this.touchEvents.start === 'touchstart' && Support.passiveListener && this.settings.passiveListeners ? { passive: true, capture: false } : false;
                el.addEventListener(this.touchEvents.start, this.events.touchStartCb, passiveListener);
                el.addEventListener(this.touchEvents.move, this.events.touchMoveCb, Support.passiveListener ? { passive: false, capture: false } : false);
                el.addEventListener(this.touchEvents.end, this.events.touchEndCb, passiveListener);
                // Backdrop propagation fix
                (_b = this.backdropEl) === null || _b === void 0 ? void 0 : _b.addEventListener(this.touchEvents.move, this.events.touchMoveBackdropCb, Support.passiveListener ? { passive: false, capture: false } : false);
                if (this.touchEvents['cancel']) {
                    el.addEventListener(this.touchEvents['cancel'], this.events.touchEndCb, passiveListener);
                }
            }
            if ((this.settings.simulateTouch && !this.device.ios && !this.device.android) || (this.settings.simulateTouch && !Support.touch && this.device.ios)) {
                el.addEventListener('mousedown', this.events.touchStartCb, false);
                el.addEventListener('mousemove', this.events.touchMoveCb, false);
                el.addEventListener('mouseup', this.events.touchEndCb, false);
                // Backdrop propagation fix
                (_c = this.backdropEl) === null || _c === void 0 ? void 0 : _c.addEventListener('mousemove', this.events.touchMoveBackdropCb, false);
            }
        }
        // Prevent accidental unwanted clicks events during swiping
        if (this.settings.preventClicks) {
            el.addEventListener('click', this.events.onClickCb, true);
        }
    }
    detachEvents(el) {
        var _a, _b, _c;
        // Touch Events
        if (!Support.touch && Support.pointerEvents) {
            el.removeEventListener(this.touchEvents.start, this.events.touchStartCb, false);
            el.removeEventListener(this.touchEvents.move, this.events.touchMoveCb, false);
            el.removeEventListener(this.touchEvents.end, this.events.touchEndCb, false);
            // Backdrop propagation fix
            (_a = this.backdropEl) === null || _a === void 0 ? void 0 : _a.removeEventListener(this.touchEvents.move, this.events.touchMoveBackdropCb, false);
        }
        else {
            if (Support.touch) {
                const passiveListener = this.touchEvents.start === 'onTouchStart' && Support.passiveListener && this.settings.passiveListeners ? { passive: true, capture: false } : false;
                el.removeEventListener(this.touchEvents.start, this.events.touchStartCb, passiveListener);
                el.removeEventListener(this.touchEvents.move, this.events.touchMoveCb, false);
                el.removeEventListener(this.touchEvents.end, this.events.touchEndCb, passiveListener);
                // Backdrop propagation fix
                (_b = this.backdropEl) === null || _b === void 0 ? void 0 : _b.removeEventListener(this.touchEvents.move, this.events.touchMoveBackdropCb, false);
                if (this.touchEvents['cancel']) {
                    el.removeEventListener(this.touchEvents['cancel'], this.events.touchEndCb, passiveListener);
                }
            }
            if ((this.settings.simulateTouch && !this.device.ios && !this.device.android) || (this.settings.simulateTouch && !Support.touch && this.device.ios)) {
                el.removeEventListener('mousedown', this.events.touchStartCb, false);
                el.removeEventListener('mousemove', this.events.touchMoveCb, false);
                el.removeEventListener('mouseup', this.events.touchEndCb, false);
                // Backdrop propagation fix
                (_c = this.backdropEl) === null || _c === void 0 ? void 0 : _c.removeEventListener('mousemove', this.events.touchMoveBackdropCb, false);
            }
        }
        // Prevent accidental unwanted clicks events during swiping
        if (this.settings.preventClicks) {
            el.removeEventListener('click', this.events.onClickCb, true);
        }
    }
    // TODO: static method
    getPanelTransformY() {
        const translateYRegex = /\.*translateY\((.*)px\)/i;
        return parseFloat(translateYRegex.exec(this.paneEl.style.transform)[1]);
    }
    /************************************
     * Public user methods
     */
    /**
     * Prevent dismiss event
     */
    preventDismiss(val = false) {
        this.preventDismissEvent = val;
    }
    /**
     * Disable pane drag events
     */
    disableDrag() {
        this.disableDragEvents = true;
    }
    /**
     * Enable pane drag events
     */
    enableDrag() {
        this.disableDragEvents = false;
    }
    setDarkMode(conf = { enable: true }) {
        if (conf.enable) {
            this.paneEl.style.background = '#1c1c1d';
            this.paneEl.style.color = '#ffffff';
            this.moveEl.style.background = '#5a5a5e';
            if (this.settings.buttonClose) {
                this.closeEl.style.background = '#424246';
                this.iconCloseColor = '#a8a7ae';
            }
        }
        else {
            this.paneEl.style.background = '#ffffff';
            this.paneEl.style.color = 'unset';
            this.moveEl.style.background = '#c0c0c0';
            if (this.settings.buttonClose) {
                this.closeEl.style.background = '#ebebeb';
                this.iconCloseColor = '#7a7a7e';
            }
        }
    }
    /**
     * Function builder for breakpoints and heights
     * @param conf breakpoints
     */
    setBreakpoints(conf) {
        if (this.isPanePresented() && !conf) {
            console.warn(`Cupertino Pane: Provide any breaks configuration`);
            return;
        }
        this.breaks = {
            top: this.screenHeightOffset,
            middle: this.screenHeightOffset,
            bottom: this.screenHeightOffset
        };
        ['top', 'middle', 'bottom'].forEach((val) => {
            // bottom offset for bulletins
            this.breaks[val] -= this.settings.bottomOffset;
            // Set default if no exist
            if (!this.settings.breaks[val]) {
                this.settings.breaks[val] = this.defaultBreaksConf[val];
            }
            // Override from user conf on updating
            if (conf && conf[val]) {
                this.settings.breaks[val] = conf[val];
            }
            // Assign heights
            if (this.settings.breaks[val]
                && this.settings.breaks[val].enabled
                && this.settings.breaks[val].height) {
                if (!this.settings.inverse) {
                    this.breaks[val] -= this.settings.breaks[val].height;
                }
                else {
                    this.breaks[val] = this.settings.breaks[val].height;
                }
            }
        });
        // Warnings 
        if (!this.isPanePresented()) {
            if (!this.settings.breaks[this.settings.initialBreak].enabled) {
                console.warn('Cupertino Pane: Please set initialBreak for enabled breakpoint');
            }
        }
        if (this.settings.breaks['middle'].height >= this.settings.breaks['top'].height) {
            console.warn('Cupertino Pane: Please set middle height lower than top height');
        }
        if (this.settings.breaks['middle'].height <= this.settings.breaks['bottom'].height) {
            console.warn('Cupertino Pane: Please set bottom height lower than middle height');
        }
        // Prepare breakpoint numbers array
        this.brs = [];
        ['top', 'middle', 'bottom'].forEach((val) => {
            if (this.settings.breaks[val].enabled) {
                this.brs.push(this.breaks[val]);
            }
        });
        // Determinate topper point
        this.topper = this.brs.reduce((prev, curr) => {
            return (Math.abs(curr) < Math.abs(prev) ? curr : prev);
        });
        // Determinate bottomer point
        this.bottomer = this.brs.reduce((prev, curr) => {
            return (Math.abs(curr) > Math.abs(prev) ? curr : prev);
        });
        if (!this.isPanePresented()) {
            this.currentBreakpoint = this.breaks[this.settings.initialBreak];
        }
        if (this.isPanePresented()) {
            // Move to current if updated
            if (this.settings.breaks[this.prevBreakpoint].enabled) {
                this.moveToBreak(this.prevBreakpoint);
            }
            // Move to any if removed
            if (!this.settings.breaks[this.prevBreakpoint].enabled) {
                let nextY = this.swipeNextPoint(1, 1, this.getClosestBreakY());
                const nextBreak = Object.entries(this.breaks).find(val => val[1] === nextY);
                this.moveToBreak(nextBreak[0]);
            }
            // Re-calc height and top
            this.paneEl.style.top = this.settings.inverse ? `-${this.bottomer}px` : `unset`;
            this.paneEl.style.height = `${this.getPaneHeight()}px`;
            this.scrollElementInit();
            this.checkOpacityAttr(this.currentBreakpoint);
            this.checkOverflowAttr(this.currentBreakpoint);
        }
    }
    moveToBreak(val) {
        if (!this.isPanePresented()) {
            console.warn(`Cupertino Pane: Present pane before call moveToBreak()`);
            return null;
        }
        if (!this.settings.breaks[val].enabled) {
            console.warn('Cupertino Pane: %s breakpoint disabled', val);
            return;
        }
        this.checkOpacityAttr(this.breaks[val]);
        this.checkOverflowAttr(this.breaks[val]);
        this.doTransition({ type: 'breakpoint', translateY: this.breaks[val] });
        this.currentBreakpoint = this.breaks[val];
    }
    moveToHeight(val) {
        if (!this.isPanePresented()) {
            console.warn(`Cupertino Pane: Present pane before call moveToBreak()`);
            return null;
        }
        let translateY = this.screenHeightOffset ? this.screen_height - val : val;
        this.checkOpacityAttr(translateY);
        this.doTransition({ type: 'breakpoint', translateY });
    }
    hide() {
        if (!this.isPanePresented()) {
            console.warn(`Cupertino Pane: Present pane before call hide()`);
            return null;
        }
        if (this.isHidden()) {
            console.warn(`Cupertino Pane: Pane already hidden`);
            return null;
        }
        this.doTransition({ type: 'hide', translateY: this.screenHeightOffset });
    }
    isHidden() {
        if (!this.isPanePresented()) {
            console.warn(`Cupertino Pane: Present pane before call isHidden()`);
            return null;
        }
        return this.paneEl.style.transform === `translateY(${this.screenHeightOffset}px) translateZ(0px)`;
    }
    currentBreak() {
        if (!this.isPanePresented()) {
            console.warn(`Cupertino Pane: Present pane before call currentBreak()`);
            return null;
        }
        if (this.breaks['top'] === this.currentBreakpoint)
            return 'top';
        if (this.breaks['middle'] === this.currentBreakpoint)
            return 'middle';
        if (this.breaks['bottom'] === this.currentBreakpoint)
            return 'bottom';
        return null;
    }
    ;
    destroyResets() {
        this.parentEl.appendChild(this.contentEl);
        this.wrapperEl.remove();
        /****** Detach Events *******/
        this.detachAllEvents();
        // Reset vars
        delete this.rendered;
        delete this.prevBreakpoint;
        // Reset styles
        this.contentEl.style.display = 'none';
    }
    destroy(conf = { animate: false }) {
        if (!this.isPanePresented()) {
            console.warn(`Cupertino Pane: Present pane before call destroy()`);
            return null;
        }
        // Prevent dismiss
        if (this.preventDismissEvent) {
            // Emit event with prevent dismiss if not already sent from drag event
            if (!this.preventedDismiss) {
                this.settings.onWillDismiss({ prevented: true });
                this.moveToBreak(this.prevBreakpoint);
            }
            return;
        }
        // Emit event
        this.settings.onWillDismiss();
        /****** Animation & Transition ******/
        if (conf.animate) {
            this.doTransition({ type: 'destroy', translateY: this.screenHeightOffset });
        }
        else {
            this.destroyResets();
            // Emit event
            this.settings.onDidDismiss();
        }
    }
    pushTransition(newPaneY, transition) {
        newPaneY = this.screenHeightOffset - newPaneY;
        const topHeight = this.settings.pushMinHeight ? this.settings.pushMinHeight : this.screenHeightOffset - this.bottomer;
        const minHeight = this.screenHeightOffset - this.topper;
        this.pushElement.style.transition = transition;
        const setStyles = (scale, y, border, contrast) => {
            this.pushElement.style.transform = `translateY(${y}px) scale(${scale})`;
            this.pushElement.style.borderRadius = `${border}px`;
            this.pushElement.style.filter = `contrast(${contrast})`;
        };
        if (newPaneY <= topHeight) {
            setStyles(1, 0, 0, 1);
            return;
        }
        const getXbyY = (min, max) => {
            let val = (minHeight * max - topHeight * min) * -1;
            val -= (min - max) * newPaneY;
            val /= (topHeight - minHeight);
            if (val > max)
                val = max;
            if (val < min)
                val = min;
            return val;
        };
        setStyles(getXbyY(0.93, 1), getXbyY(-6 - this.settings.pushYOffset, 0), // *-1 for reverse animation
        getXbyY(-10, 0) * -1, getXbyY(0.85, 1));
    }
    /***********************************
     * Transitions handler
     */
    doTransition(params = {}) {
        // touchmove simple event
        if (params.type === 'move') {
            this.paneEl.style.transition = 'all 0ms linear 0ms';
            this.paneEl.style.transform = `translateY(${params.translateY}px) translateZ(0px)`;
            // Bind for follower same transitions
            if (this.followerEl) {
                this.followerEl.style.transition = 'all 0ms linear 0ms';
                this.followerEl.style.transform = `translateY(${params.translateY - this.breaks[this.settings.initialBreak]}px) translateZ(0px)`;
            }
            // Push transition
            if (this.settings.pushElement) {
                this.pushTransition(this.getPanelTransformY(), 'all 0ms linear 0ms');
            }
            return;
        }
        // Transition end
        const transitionEnd = () => {
            if (params.type === 'destroy') {
                this.destroyResets();
            }
            this.paneEl.style.transition = `initial`;
            // Bind for follower same transitions
            if (this.followerEl) {
                this.followerEl.style.transition = `initial`;
            }
            // Backdrop 
            if (this.settings.backdrop) {
                if (params.type === 'destroy' || params.type === 'hide') {
                    this.backdropEl.style.transition = `initial`;
                    this.backdropEl.style.display = `none`;
                }
            }
            // Emit event
            if (params.type === 'present') {
                this.settings.onDidPresent();
            }
            if (params.type === 'destroy') {
                this.settings.onDidDismiss();
            }
            this.settings.onTransitionEnd({ target: document.body.contains(this.paneEl) ? this.paneEl : null });
            // Remove listener
            this.paneEl.removeEventListener('transitionend', transitionEnd);
        };
        // MoveToBreak, Touchend, Present, Hide, Destroy events
        if (params.type === 'breakpoint'
            || params.type === 'end'
            || params.type === 'present'
            || params.type === 'hide'
            || params.type === 'destroy') {
            // backdrop 
            if (this.settings.backdrop) {
                if (this.isHidden()
                    || params.type === 'hide'
                    || params.type === 'destroy'
                    || params.type === 'present') {
                    this.backdropEl.style.backgroundColor = 'rgba(0,0,0,.0)';
                    this.backdropEl.style.transition = `all ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
                    if (params.type !== 'hide' && params.type !== 'destroy') {
                        this.backdropEl.style.display = 'block';
                        setTimeout(() => {
                            this.backdropEl.style.backgroundColor = `rgba(0,0,0, ${this.settings.backdropOpacity})`;
                        }, 50);
                    }
                }
            }
            // freemode
            if (params.type === 'end' && this.settings.freeMode)
                return;
            // Get timing function && push for next 
            // TODO: getBreakByHeight or by translateY()
            const nextBreak = Object.entries(this.settings.breaks).find(val => val[1].height === (this.screenHeightOffset - params.translateY));
            const timingForNext = this.getTimingFunction(nextBreak && nextBreak[1].bounce ? true : false);
            // style
            this.paneEl.style.transition = `transform ${this.settings.animationDuration}ms ${timingForNext} 0s`;
            // Bind for follower same transitions
            if (this.followerEl) {
                this.followerEl.style.transition = `transform ${this.settings.animationDuration}ms ${timingForNext} 0s`;
            }
            // Push transition
            if (this.settings.pushElement) {
                // Reason of timeout is to hide empty space when present pane and push element
                // we should start push after pushMinHeight but for present 
                // transition we can't calculate where pane Y is.
                setTimeout(() => {
                    this.pushTransition(params.translateY, `all ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`);
                }, this.settings.pushYOffset ? 50 : 0);
            }
            // Main transitions
            if (params.type === 'present') {
                this.paneEl.style.transform = `translateY(${this.screenHeightOffset}px) translateZ(0px)`;
                setTimeout(() => {
                    // Emit event
                    this.settings.onTransitionStart({ translateY: { new: params.translateY } });
                    this.paneEl.style.transform = `translateY(${params.translateY}px) translateZ(0px)`;
                    // Bind for follower same transitions
                    if (this.followerEl) {
                        this.followerEl.style.transform = `translateY(0px) translateZ(0px)`;
                    }
                }, 50);
            }
            else {
                // Emit event
                this.settings.onTransitionStart({ translateY: { new: params.translateY } });
                this.paneEl.style.transform = `translateY(${params.translateY}px) translateZ(0px)`;
                // Bind for follower same transitions
                if (this.followerEl) {
                    this.followerEl.style.transform = `translateY(${params.translateY - this.breaks[this.settings.initialBreak]}px) translateZ(0px)`;
                }
            }
            let getNextBreakpoint = Object.entries(this.breaks).find(val => val[1] === params.translateY);
            if (getNextBreakpoint) {
                this.prevBreakpoint = getNextBreakpoint[0];
            }
            this.paneEl.addEventListener('transitionend', transitionEnd);
            return;
        }
    }
}

export { CupertinoPane };
//# sourceMappingURL=cupertino-pane.esm.bundle.js.map

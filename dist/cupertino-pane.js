/**
 * Cupertino Pane 1.2.7
 * Multi-functional panes and boards for next generation progressive applications
 * https://github.com/roman-rr/cupertino-pane/
 *
 * Copyright 2019-2021 Roman Antonov (roman-rr)
 *
 * Released under the MIT License
 *
 * Released on: November 12, 2021
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.CupertinoPane = factory());
})(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

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
        constructor(instance, settings, device, breakpoints) {
            this.instance = instance;
            this.settings = settings;
            this.device = device;
            this.breakpoints = breakpoints;
            this.allowClick = true;
            this.disableDragAngle = false;
            this.pointerDown = false;
            this.contentScrollTop = 0;
            this.steps = [];
            this.inputBluredbyMove = false;
            this.keyboardVisible = false;
            this.isScrolling = false;
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
            this.onScrollCb = (t) => this.onScroll(t);
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
            this.onKeyboardWillHideCb = (e) => this.onKeyboardWillHide(e);
            /**
             * Window resize event
             * TODO: Prevent android unlock events
             * @param e
             */
            this.onWindowResizeCb = (e) => this.onWindowResize(e);
        }
        attachAllEvents() {
            if (!this.settings.dragBy) {
                this.eventListeners('addEventListener', this.instance.paneEl);
            }
            else {
                this.settings.dragBy.forEach((selector) => {
                    const el = document.querySelector(selector);
                    if (el)
                        this.eventListeners('addEventListener', el);
                });
            }
            // scroll events for overflowEl
            if (this.settings.topperOverflow) {
                this.instance.overflowEl.addEventListener('scroll', this.onScrollCb);
            }
            // Handle keyboard events for cordova
            if (this.settings.handleKeyboard && this.device.cordova) {
                window.addEventListener('keyboardWillShow', this.onKeyboardShowCb);
                window.addEventListener('keyboardWillHide', this.onKeyboardWillHideCb);
            }
            // Fix Android issue with resize if not handle
            if (!this.settings.handleKeyboard
                && this.device.cordova
                && this.device.android) {
                window.addEventListener('keyboardWillHide', () => {
                    this.instance.parentEl.scrollTop = 0;
                    if (this.instance.parentEl.parentElement) {
                        this.instance.parentEl.parentElement.scrollTop = 0;
                        if (this.instance.parentEl.parentElement.parentElement) {
                            this.instance.parentEl.parentElement.parentElement.scrollTop = 0;
                        }
                    }
                });
            }
            // Orientation change + window resize
            window.addEventListener('resize', this.onWindowResizeCb);
        }
        detachAllEvents() {
            if (!this.settings.dragBy) {
                this.eventListeners('removeEventListener', this.instance.paneEl);
            }
            else {
                this.settings.dragBy.forEach((selector) => {
                    const el = document.querySelector(selector);
                    if (el)
                        this.eventListeners('removeEventListener', el);
                });
            }
            // scroll events for overflowEl
            if (this.settings.topperOverflow) {
                this.instance.overflowEl.removeEventListener('scroll', this.onScrollCb);
            }
            // Handle keyboard events for cordova
            if (this.settings.handleKeyboard && this.device.cordova) {
                window.removeEventListener('keyboardWillShow', this.onKeyboardShowCb);
                window.removeEventListener('keyboardWillHide', this.onKeyboardWillHideCb);
            }
            // Orientation change + window resize
            window.removeEventListener('resize', this.onWindowResizeCb);
        }
        resetEvents() {
            this.detachAllEvents();
            this.attachAllEvents();
        }
        eventListeners(type, el) {
            var _a, _b, _c;
            // Touch Events
            if (!Support.touch && Support.pointerEvents) {
                el[type](this.touchEvents.start, this.touchStartCb, false);
                el[type](this.touchEvents.move, this.touchMoveCb, false);
                el[type](this.touchEvents.end, this.touchEndCb, false);
                // Backdrop propagation fix
                (_a = this.instance.backdropEl) === null || _a === void 0 ? void 0 : _a[type](this.touchEvents.move, this.touchMoveBackdropCb, false);
            }
            else {
                if (Support.touch) {
                    const passiveListener = this.touchEvents.start === 'touchstart' && Support.passiveListener && this.settings.passiveListeners ? { passive: true, capture: false } : false;
                    el[type](this.touchEvents.start, this.touchStartCb, passiveListener);
                    el[type](this.touchEvents.move, this.touchMoveCb, Support.passiveListener ? { passive: false, capture: false } : false);
                    el[type](this.touchEvents.end, this.touchEndCb, passiveListener);
                    // Backdrop propagation fix
                    (_b = this.instance.backdropEl) === null || _b === void 0 ? void 0 : _b[type](this.touchEvents.move, this.touchMoveBackdropCb, Support.passiveListener ? { passive: false, capture: false } : false);
                    if (this.touchEvents['cancel']) {
                        el[type](this.touchEvents['cancel'], this.touchEndCb, passiveListener);
                    }
                }
                if ((this.settings.simulateTouch && !this.device.ios && !this.device.android) || (this.settings.simulateTouch && !Support.touch && this.device.ios)) {
                    el[type]('mousedown', this.touchStartCb, false);
                    el[type]('mousemove', this.touchMoveCb, false);
                    el[type]('mouseup', this.touchEndCb, false);
                    // Backdrop propagation fix
                    (_c = this.instance.backdropEl) === null || _c === void 0 ? void 0 : _c[type]('mousemove', this.touchMoveBackdropCb, false);
                }
            }
            // Prevent accidental unwanted clicks events during swiping
            if (this.settings.preventClicks) {
                el[type]('click', this.onClickCb, true);
            }
        }
        touchStart(t) {
            // Event emitter
            this.settings.onDragStart(t);
            // Allow clicks by default -> disallow on move (allow click with disabled drag)
            this.allowClick = true;
            if (this.instance.disableDragEvents)
                return;
            // Allow touch angle by default, disallow no move with condition
            this.disableDragAngle = false;
            // Not scrolling event by default -> on scroll will true
            this.isScrolling = false;
            // Allow pereventDismiss by default
            this.instance.preventedDismiss = false;
            const { clientY, clientX } = this.getEvetClientYX(t, 'touchstart');
            this.startY = clientY;
            this.startX = clientX;
            if (t.type === 'mousedown')
                this.pointerDown = true;
            // if overflow content was scrolled
            // increase to scrolled value
            if (this.contentScrollTop && this.willScrolled(t)) {
                this.startY += this.contentScrollTop;
            }
            this.steps.push({ posY: this.startY, time: Date.now() });
        }
        touchMoveBackdrop(t) {
            if (this.settings.touchMoveStopPropagation) {
                t.stopPropagation();
            }
        }
        touchMove(t) {
            var _a;
            const { clientY, clientX, velocityY } = this.getEvetClientYX(t, 'touchmove');
            // Event emitter
            t.delta = ((_a = this.steps[0]) === null || _a === void 0 ? void 0 : _a.posY) - clientY;
            this.settings.onDrag(t);
            // Disallow accidentaly clicks while slide gestures
            this.allowClick = false;
            // textarea scrollbar
            if (this.isFormElement(t.target)
                && this.isElementScrollable(t.target)) {
                return;
            }
            if (this.instance.disableDragEvents) {
                this.steps = [];
                return;
            }
            if (this.disableDragAngle)
                return;
            if (this.instance.preventedDismiss)
                return;
            if (this.settings.touchMoveStopPropagation) {
                t.stopPropagation();
            }
            // Handle desktop/mobile events
            if (t.type === 'mousemove' && !this.pointerDown)
                return;
            // Delta
            const diffY = clientY - this.steps[this.steps.length - 1].posY;
            // No Y changes
            if (!Math.abs(diffY)) {
                return;
            }
            let newVal = this.instance.getPanelTransformY() + diffY;
            // First event after touchmove only
            if (this.steps.length < 2) {
                // Patch for 'touchmove' first event 
                // when start slowly events with small velocity
                if (velocityY < 1) {
                    newVal = this.instance.getPanelTransformY() + (diffY * velocityY);
                }
                // Move while transition patch next transitions
                let computedTranslateY = new WebKitCSSMatrix(window.getComputedStyle(this.instance.paneEl).transform).m42;
                let transitionYDiff = computedTranslateY - this.instance.getPanelTransformY();
                if (Math.abs(transitionYDiff)) {
                    newVal += transitionYDiff;
                }
            }
            // Detect if input was blured
            // TODO: Check that blured from pane child instance
            if (this.steps.length > 2) {
                if (this.isFormElement(document.activeElement)
                    && !(this.isFormElement(t.target))) {
                    document.activeElement.blur();
                    this.inputBluredbyMove = true;
                }
            }
            // Touch angle
            // Only for initial gesture with 1 touchstart step
            // Only not for scrolling events (scrolling already checked for angle)
            if (this.settings.touchAngle
                && !this.isScrolling) {
                let touchAngle;
                const diffX = clientX - this.startX;
                const diffY = clientY - this.startY;
                touchAngle = (Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180) / Math.PI;
                if (diffX * diffX + diffY * diffY >= 25
                    && (90 - touchAngle > this.settings.touchAngle)
                    && this.steps.length === 1) {
                    this.disableDragAngle = true;
                    return;
                }
            }
            // Not allow move panel with positive overflow scroll
            if (this.instance.overflowEl.style.overflowY === 'auto') {
                if (this.settings.inverse && this.willScrolled(t)) {
                    this.contentScrollTop = 0;
                    return;
                }
                // Scrolled -> Disable drag
                if (!this.settings.inverse && this.contentScrollTop > 0) {
                    return;
                }
            }
            // topper/lower
            let forceNewVal = this.handleTopperLowerPositions(newVal, diffY);
            if (forceNewVal) {
                newVal = forceNewVal;
            }
            // No changes Y
            if (this.instance.getPanelTransformY() === newVal) {
                return;
            }
            // Prevent Dismiss gesture
            if (!this.instance.preventedDismiss
                && this.instance.preventDismissEvent && this.settings.bottomClose) {
                let differKoef = ((-this.breakpoints.topper + this.breakpoints.topper - this.instance.getPanelTransformY()) / this.breakpoints.topper) / -8;
                newVal = this.instance.getPanelTransformY() + (diffY * (0.5 - differKoef));
                let mousePointY = (clientY - 220 - this.instance.screen_height) * -1;
                if (mousePointY <= this.instance.screen_height - this.breakpoints.bottomer) {
                    this.instance.preventedDismiss = true;
                    // Emit event with prevent dismiss
                    this.settings.onWillDismiss({ prevented: true });
                    this.instance.moveToBreak(this.breakpoints.prevBreakpoint);
                    return;
                }
            }
            this.instance.checkOpacityAttr(newVal);
            this.instance.checkOverflowAttr(newVal);
            this.instance.doTransition({ type: 'move', translateY: newVal });
            this.steps.push({ posY: clientY, time: Date.now() });
        }
        touchEnd(t) {
            var _a, _b;
            if (this.instance.disableDragEvents)
                return;
            if (t.type === 'mouseup')
                this.pointerDown = false;
            // Determinate nearest point
            let closest = this.breakpoints.getClosestBreakY();
            // Swipe - next (if differ > 10)
            const diff = ((_a = this.steps[this.steps.length - 1]) === null || _a === void 0 ? void 0 : _a.posY) - ((_b = this.steps[this.steps.length - 2]) === null || _b === void 0 ? void 0 : _b.posY);
            // Set sensivity lower for web
            const swipeNextSensivity = window.hasOwnProperty('cordova')
                ? (this.settings.fastSwipeSensivity + 2) : this.settings.fastSwipeSensivity;
            const fastSwipeNext = (Math.abs(diff) >= swipeNextSensivity);
            if (fastSwipeNext) {
                closest = this.instance.swipeNextPoint(diff, swipeNextSensivity, closest);
                // Fast swipe toward bottom - close
                if (this.settings.fastSwipeClose
                    && this.breakpoints.currentBreakpoint < closest) {
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
            this.breakpoints.currentBreakpoint = closest;
            // Event emitter
            this.settings.onDragEnd(t);
            // touchend with allowClick === tapped event (no move triggered)
            // skip next functions
            if (this.allowClick || blurTapEvent) {
                return;
            }
            this.instance.checkOpacityAttr(this.breakpoints.currentBreakpoint);
            this.instance.checkOverflowAttr(this.breakpoints.currentBreakpoint);
            // Bottom closable
            if (this.settings.bottomClose && closest === this.breakpoints.breaks['bottom']) {
                this.instance.destroy({ animate: true });
                return;
            }
            // Simulationiusly emit event when touchend exact with next position (top)
            if (this.instance.getPanelTransformY() === closest) {
                this.settings.onTransitionEnd({ target: this.instance.paneEl });
            }
            this.instance.doTransition({ type: 'end', translateY: closest });
        }
        onScroll(t) {
            return __awaiter(this, void 0, void 0, function* () {
                this.isScrolling = true;
                this.contentScrollTop = t.target.scrollTop;
            });
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
                if (this.breakpoints.breaks['bottom'] === this.instance.getPanelTransformY()) {
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
            // focud element not inside pane
            if (!this.isPaneDescendant(document.activeElement)) {
                return;
            }
            // pane not visible on viewport
            if (!this.isOnViewport()) {
                return;
            }
            if (this.device.android) {
                setTimeout(() => this.fixAndroidResize(), 20);
            }
            this.breakpoints.prevBreakpoint = Object.entries(this.breakpoints.breaks).find(val => val[1] === this.instance.getPanelTransformY())[0];
            let newHeight = this.settings.breaks[this.instance.currentBreak()].height + e.keyboardHeight;
            // Landscape case
            let isLandscape = window.matchMedia('(orientation: landscape)').matches;
            if (isLandscape) {
                newHeight = this.instance.screen_height;
            }
            // higher than screen + offsets
            if (newHeight > this.instance.screen_height - 80) {
                newHeight = this.instance.screen_height - 80;
            }
            // Move pane up if new position more than 50px
            if (newHeight - 50 >= this.settings.breaks[this.instance.currentBreak()].height) {
                this.instance.moveToHeight(newHeight);
            }
        }
        onKeyboardWillHide(e) {
            // pane not visible on viewport
            if (!this.isOnViewport()) {
                return;
            }
            if (this.device.android) {
                this.fixAndroidResize();
            }
            if (this.inputBluredbyMove) {
                this.inputBluredbyMove = false;
                return;
            }
            if (!this.instance.isHidden()) {
                this.instance.moveToBreak(this.breakpoints.prevBreakpoint);
            }
        }
        onWindowResize(e) {
            return __awaiter(this, void 0, void 0, function* () {
                // If form element active - recognize here as Keyboard event
                // TODO: if window screen not changed condition also (desktop input focus + resize)
                if (this.isFormElement(document.activeElement)) {
                    return;
                }
                yield new Promise((resolve) => setTimeout(() => resolve(true), 150));
                this.instance.updateScreenHeights();
                this.breakpoints.buildBreakpoints(JSON.parse(this.breakpoints.lockedBreakpoints));
            });
        }
        /**
         * Private class methods
         */
        /**
         * Topper Than Top
         * Lower Than Bottom
         * Otherwise don't changes
         */
        handleTopperLowerPositions(newVal, diffY) {
            // Non-inverse (normal) gestures
            if (!this.settings.inverse) {
                // Disallow drag topper than top point
                if (!this.settings.upperThanTop
                    && (newVal <= this.breakpoints.topper)) {
                    return this.breakpoints.topper;
                }
                // Allow drag topper than top point
                if (newVal <= this.breakpoints.topper
                    && this.settings.upperThanTop) {
                    const screenDelta = this.instance.screen_height - this.instance.screenHeightOffset;
                    const differKoef = (screenDelta - this.instance.getPanelTransformY()) / (screenDelta - this.breakpoints.topper) / 8;
                    return this.instance.getPanelTransformY() + (diffY * differKoef);
                }
                // Disallow drag lower then bottom 
                if (!this.settings.lowerThanBottom
                    && newVal >= this.breakpoints.bottomer) {
                    return this.breakpoints.bottomer;
                }
            }
            if (this.settings.inverse) {
                // Inverse gestures
                // Allow drag topper than top point
                if (newVal >= this.breakpoints.topper
                    && this.settings.upperThanTop) {
                    const screenDelta = this.instance.screen_height - this.instance.screenHeightOffset;
                    const differKoef = (screenDelta - this.instance.getPanelTransformY()) / (screenDelta - this.breakpoints.topper) / 8;
                    return this.instance.getPanelTransformY() + (diffY * differKoef);
                }
                // Disallow drag topper than top point
                if (!this.settings.upperThanTop
                    && (newVal >= this.breakpoints.topper)) {
                    return this.breakpoints.topper;
                }
            }
        }
        getEvetClientYX(ev, name) {
            var _a, _b;
            const targetTouch = ev.type === name && ev.targetTouches && (ev.targetTouches[0] || ev.changedTouches[0]);
            const clientY = ev.type === name ? targetTouch.clientY : ev.clientY;
            const clientX = ev.type === name ? targetTouch.clientX : ev.clientX;
            const timeDiff = (Date.now()) - (((_a = this.steps[this.steps.length - 1]) === null || _a === void 0 ? void 0 : _a.time) || 0);
            const distanceY = Math.abs(clientY - (((_b = this.steps[this.steps.length - 1]) === null || _b === void 0 ? void 0 : _b.posY) || 0));
            const velocityY = distanceY / timeDiff;
            return { clientY, clientX, velocityY };
        }
        /**
         * Fix android keyboard issue with transition
         * (resize window frame height on hide/show)
         */
        fixAndroidResize() {
            if (!this.instance.paneEl)
                return;
            document.querySelector('ion-app');
            window.requestAnimationFrame(() => {
                this.instance.wrapperEl.style.width = '100%';
                this.instance.paneEl.style.position = 'absolute';
                window.requestAnimationFrame(() => {
                    this.instance.wrapperEl.style.width = 'unset';
                    this.instance.paneEl.style.position = 'fixed';
                });
            });
        }
        willScrolled(t) {
            if (!(this.isElementScrollable(this.instance.overflowEl)
                && this.instance.overflowEl.style.overflow !== 'hidden')) {
                return false;
            }
            return true;
        }
        isPaneDescendant(el) {
            let node = el.parentNode;
            while (node != null) {
                if (node == this.instance.paneEl) {
                    return true;
                }
                node = node.parentNode;
            }
            return false;
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
        isOnViewport() {
            if (this.instance.paneEl
                && this.instance.paneEl.offsetWidth === 0
                && this.instance.paneEl.offsetHeight === 0) {
                return false;
            }
            return true;
        }
    }

    class Settings {
        constructor() {
            this.instance = {
                initialBreak: 'middle',
                inverse: false,
                parentElement: null,
                followerElement: null,
                cssClass: null,
                fitHeight: false,
                maxFitHeight: null,
                fitScreenHeight: true,
                backdrop: false,
                backdropOpacity: 0.4,
                animationType: 'ease',
                animationDuration: 300,
                dragBy: null,
                bottomOffset: 0,
                bottomClose: false,
                fastSwipeClose: false,
                fastSwipeSensivity: 3,
                freeMode: false,
                buttonDestroy: true,
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
                touchAngle: 45,
                breaks: {},
                zStack: null,
                onDidDismiss: () => { },
                onWillDismiss: () => { },
                onDidPresent: () => { },
                onWillPresent: () => { },
                onDragStart: () => { },
                onDrag: () => { },
                onDragEnd: () => { },
                onBackdropTap: () => { },
                onTransitionStart: () => { },
                onTransitionEnd: () => { },
            };
        }
    }

    /**
     * Breakpoints builde
     */
    class Breakpoints {
        constructor(instance, settings) {
            this.instance = instance;
            this.settings = settings;
            this.breaks = {};
            this.calcHeightInProcess = false;
            this.brs = [];
            this.defaultBreaksConf = {
                top: { enabled: true, height: window.innerHeight - (135 * 0.35) },
                middle: { enabled: true, height: 300 },
                bottom: { enabled: true, height: 100 },
            };
        }
        /**
         * Function builder for breakpoints and heights
         * @param conf breakpoints
         */
        buildBreakpoints(conf, bottomOffset = 0) {
            var _a, _b, _c, _d, _e;
            return __awaiter(this, void 0, void 0, function* () {
                this.settings.bottomOffset = bottomOffset || this.settings.bottomOffset;
                this.breaks = {
                    top: this.instance.screenHeightOffset,
                    middle: this.instance.screenHeightOffset,
                    bottom: this.instance.screenHeightOffset
                };
                // Fit Height & Bulletin cases
                if (this.settings.fitHeight) {
                    this.settings.fitScreenHeight = false;
                    this.settings.initialBreak = 'top';
                    this.settings.topperOverflow = false;
                    let height = yield this.getPaneFitHeight();
                    // maxFitHeight
                    if (this.settings.maxFitHeight
                        && height > this.settings.maxFitHeight) {
                        height = this.settings.maxFitHeight;
                        this.settings.topperOverflow = true;
                    }
                    conf = {
                        top: { enabled: true, height },
                        middle: { enabled: false }
                    };
                    conf.top.bounce = (_b = (_a = this.settings.breaks) === null || _a === void 0 ? void 0 : _a.top) === null || _b === void 0 ? void 0 : _b.bounce;
                    conf.bottom = ((_c = this.settings.breaks) === null || _c === void 0 ? void 0 : _c.bottom) || { enabled: true, height: 0 };
                }
                ['top', 'middle', 'bottom'].forEach((val) => {
                    // bottom offset for bulletins
                    var _a;
                    this.breaks[val] -= this.settings.bottomOffset;
                    // Set default if no exist
                    if (!this.settings.breaks[val]) {
                        this.settings.breaks[val] = this.defaultBreaksConf[val];
                    }
                    // Override from user conf on updating
                    if (conf && conf[val]) {
                        this.settings.breaks[val] = conf[val];
                    }
                    // fitScreenHeight (breaks styles fit screen)
                    if (this.settings.fitScreenHeight) {
                        if (((_a = this.settings.breaks[val]) === null || _a === void 0 ? void 0 : _a.height) > this.instance.screen_height) {
                            this.settings.breaks[val].height = this.instance.screen_height - this.settings.bottomOffset;
                        }
                        if (this.settings.breaks['top'] && this.settings.breaks['middle']) {
                            if (this.settings.breaks['top'].height - 50 <= this.settings.breaks['middle'].height) {
                                this.settings.breaks['middle'].enabled = false;
                                this.settings.initialBreak = 'top';
                            }
                        }
                    }
                    // fitHeight (bullet-in styles for screen)
                    if (this.settings.fitHeight && val === 'top') {
                        if (this.settings.breaks[val].height > this.instance.screen_height) {
                            this.settings.breaks[val].height = this.instance.screen_height - (this.settings.bottomOffset * 2);
                            this.settings.topperOverflow = true;
                        }
                        else {
                            if (this.instance.overflowEl && !this.settings.maxFitHeight) {
                                this.settings.topperOverflow = false;
                                this.instance.overflowEl.style.overflowY = 'hidden';
                            }
                        }
                    }
                    // Assign heights
                    if (this.settings.breaks[val]
                        && this.settings.breaks[val].enabled
                        && this.settings.breaks[val].height) {
                        if (!this.settings.inverse) {
                            this.breaks[val] -= this.settings.breaks[val].height;
                        }
                        else {
                            this.breaks[val] = this.settings.breaks[val].height + this.settings.bottomOffset;
                        }
                    }
                });
                // initial lock on present
                if (!this.lockedBreakpoints) {
                    this.lockedBreakpoints = JSON.stringify(this.settings.breaks);
                }
                // Warnings
                if (!this.instance.isPanePresented()) {
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
                    return (curr < prev ? curr : prev);
                });
                // Determinate bottomer point
                this.bottomer = this.brs.reduce((prev, curr) => {
                    return (Math.abs(curr) > Math.abs(prev) ? curr : prev);
                });
                if (this.settings.inverse) {
                    this.topper = this.bottomer;
                }
                if (!this.instance.isPanePresented()) {
                    this.currentBreakpoint = this.breaks[this.settings.initialBreak];
                    // Disable overflow for top bulletin
                    if (this.settings.inverse
                        && !this.settings.breaks.bottom.enabled
                        && !this.settings.breaks.middle.enabled) {
                        this.settings.topperOverflow = false;
                    }
                }
                if (this.instance.isPanePresented()) {
                    // Move to current if updated
                    if ((_d = this.settings.breaks[this.prevBreakpoint]) === null || _d === void 0 ? void 0 : _d.enabled) {
                        if (!this.instance.isHidden()) {
                            this.instance.moveToBreak(this.prevBreakpoint);
                        }
                    }
                    // Move to any if removed
                    if (!((_e = this.settings.breaks[this.prevBreakpoint]) === null || _e === void 0 ? void 0 : _e.enabled)) {
                        let nextY = this.instance.swipeNextPoint(1, 1, this.getClosestBreakY());
                        const nextBreak = Object.entries(this.breaks).find(val => val[1] === nextY);
                        this.instance.moveToBreak(nextBreak[0]);
                    }
                    // Re-calc height and top
                    this.instance.paneEl.style.top = this.settings.inverse
                        ? `-${this.bottomer - this.settings.bottomOffset}px` : `unset`;
                    this.instance.paneEl.style.height = `${this.instance.getPaneHeight()}px`;
                    this.instance.scrollElementInit();
                    this.instance.checkOpacityAttr(this.currentBreakpoint);
                    this.instance.checkOverflowAttr(this.currentBreakpoint);
                }
            });
        }
        getCurrentBreakName() {
            if (this.breaks['top'] === this.currentBreakpoint)
                return 'top';
            if (this.breaks['middle'] === this.currentBreakpoint)
                return 'middle';
            if (this.breaks['bottom'] === this.currentBreakpoint)
                return 'bottom';
            return null;
        }
        /**
         * Private class methods
         */
        getPaneFitHeight() {
            return __awaiter(this, void 0, void 0, function* () {
                this.calcHeightInProcess = true;
                let images = this.instance.el.querySelectorAll('img');
                let height;
                // Make element visible to calculate height
                this.instance.el.style.height = 'unset';
                if (!this.instance.rendered) {
                    this.instance.el.style.visibility = 'hidden';
                    this.instance.el.style.pointerEvents = 'none';
                    this.instance.el.style.display = 'block';
                    this.instance.wrapperEl.style.visibility = 'hidden';
                    this.instance.wrapperEl.style.pointerEvents = 'none';
                    this.instance.wrapperEl.style.display = 'block';
                }
                let promises = [];
                if (images.length) {
                    // Bulletins with image height we get after image render
                    promises = Array.from(images).map((image) => new Promise((resolve) => {
                        // Already rendered
                        if (image.complete && image.naturalHeight) {
                            resolve(true);
                        }
                        else {
                            image.onload = () => resolve(true);
                        }
                    }));
                }
                // resized timeouts - 0, render - 150
                promises.push(new Promise((resolve) => setTimeout(() => resolve(true), this.instance.rendered ? 0 : 150)));
                yield Promise.all(promises);
                // height include margins
                let elmHeight = parseInt(document.defaultView.getComputedStyle(this.instance.el, '').getPropertyValue('height'));
                let elmMargin = parseInt(document.defaultView.getComputedStyle(this.instance.el, '').getPropertyValue('margin-top')) + parseInt(document.defaultView.getComputedStyle(this.instance.el, '').getPropertyValue('margin-bottom'));
                let panePaddingBottom = parseInt(document.defaultView.getComputedStyle(this.instance.el.parentElement, '').getPropertyValue('padding-bottom'));
                height = elmHeight + elmMargin;
                height += this.instance.el.offsetTop; // From top to element
                height += panePaddingBottom; // From element to bottom
                // Hide elements back
                if (!this.instance.rendered) {
                    this.instance.el.style.visibility = 'unset';
                    this.instance.el.style.pointerEvents = 'unset';
                    this.instance.el.style.display = 'none';
                    this.instance.wrapperEl.style.visibility = 'unset';
                    this.instance.wrapperEl.style.pointerEvents = 'unset';
                    this.instance.wrapperEl.style.display = 'none';
                }
                this.calcHeightInProcess = false;
                return height;
            });
        }
        getClosestBreakY() {
            return this.brs.reduce((prev, curr) => {
                return (Math.abs(curr - this.instance.getPanelTransformY()) < Math.abs(prev - this.instance.getPanelTransformY()) ? curr : prev);
            });
        }
    }

    class CupertinoPane {
        constructor(selector, conf = {}) {
            this.selector = selector;
            this.disableDragEvents = false;
            this.preventDismissEvent = false;
            this.preventedDismiss = false;
            this.rendered = false;
            this.settings = (new Settings()).instance;
            this.device = new Device();
            this.zStackDefaults = {
                pushElements: null,
                minPushHeight: null,
                cardYOffset: 0,
                cardZScale: 0.93,
                cardContrast: 0.85,
                stackZAngle: 160,
            };
            this.swipeNextPoint = (diff, maxDiff, closest) => {
                let brs = {};
                let settingsBreaks = {};
                if (this.settings.inverse) {
                    brs['top'] = this.breakpoints.breaks['bottom'];
                    brs['middle'] = this.breakpoints.breaks['middle'];
                    brs['bottom'] = this.breakpoints.breaks['top'];
                    settingsBreaks['top'] = Object.assign({}, this.settings.breaks['bottom']);
                    settingsBreaks['middle'] = Object.assign({}, this.settings.breaks['middle']);
                    settingsBreaks['bottom'] = Object.assign({}, this.settings.breaks['top']);
                }
                else {
                    brs = Object.assign({}, this.breakpoints.breaks);
                    settingsBreaks = Object.assign({}, this.settings.breaks);
                }
                if (this.breakpoints.currentBreakpoint === brs['top']) {
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
                if (this.breakpoints.currentBreakpoint === brs['middle']) {
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
                if (this.breakpoints.currentBreakpoint === brs['bottom']) {
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
                console.error('Cupertino Pane: specified selector or DOM element already in use', this.selector);
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
            this.breakpoints = new Breakpoints(this, this.settings);
            this.events = new Events(this, this.settings, this.device, this.breakpoints);
        }
        drawBaseElements() {
            // Parent 
            this.parentEl = this.settings.parentElement;
            // Wrapper
            this.wrapperEl = document.createElement('div');
            this.wrapperEl.classList.add('cupertino-pane-wrapper');
            if (this.settings.inverse) {
                this.wrapperEl.classList.add('inverse');
            }
            if (this.settings.cssClass) {
                this.wrapperEl.className += ` ${this.settings.cssClass}`;
            }
            let internalStyles = '';
            internalStyles += `
      .cupertino-pane-wrapper {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
      }
    `;
            // Panel (appying transform ASAP, avoid timeouts for animate:true)
            this.paneEl = document.createElement('div');
            this.paneEl.style.transform = `translateY(${this.screenHeightOffset}px) translateZ(0px)`;
            this.paneEl.classList.add('pane');
            internalStyles += `
      .cupertino-pane-wrapper .pane {
        position: fixed;
        z-index: 11;
        width: 100%;
        max-width: 500px;
        left: 0px;
        right: 0px;
        margin-left: auto;
        margin-right: auto;
        background: var(--cupertino-pane-background, #ffffff);
        color: var(--cupertino-pane-color, #333333);
        box-shadow: var(--cupertino-pane-shadow, 0 4px 16px rgba(0,0,0,.12));
        will-change: transform;
        padding-top: 15px; 
        border-radius: var(--cupertino-pane-border-radius, 20px) 
                       var(--cupertino-pane-border-radius, 20px) 
                       0 0;
      }
      .cupertino-pane-wrapper.inverse .pane {
        padding-bottom: 15px; 
        border-radius: 0 0 20px 20px;
        border-radius: 0 0
                       var(--cupertino-pane-border-radius, 20px) 
                       var(--cupertino-pane-border-radius, 20px);
      }
    `;
            // Draggable
            this.draggableEl = document.createElement('div');
            this.draggableEl.classList.add('draggable');
            if (this.settings.draggableOver) {
                this.draggableEl.classList.add('over');
            }
            internalStyles += `
      .cupertino-pane-wrapper .draggable {
        padding: 5px;
        position: absolute;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        height: 30px;
        z-index: 12;
        top: 0;
        bottom: initial;
      }
      .cupertino-pane-wrapper .draggable.over {
        top: -30px;
        padding: 15px;
      }
      .cupertino-pane-wrapper.inverse .draggable {
        bottom: 0;
        top: initial;
      }
      .cupertino-pane-wrapper.inverse .draggable.over {
        bottom: -30px;
        top: initial;
      }
    `;
            // Move
            this.moveEl = document.createElement('div');
            this.moveEl.classList.add('move');
            internalStyles += `
      .cupertino-pane-wrapper .move {
        margin: 0 auto;
        height: 5px;
        background: var(--cupertino-pane-move-background, #c0c0c0);
        width: 36px;
        border-radius: 4px;
      }
      .cupertino-pane-wrapper .draggable.over .move {
        width: 70px; 
        background: var(--cupertino-pane-move-background, rgba(225, 225, 225, 0.6));
        ${Support.backdropFilter ? `
          backdrop-filter: saturate(180%) blur(20px);
          -webkit-backdrop-filter: saturate(180%) blur(20px);
        ` : ``}
      }
      .cupertino-pane-wrapper.inverse .move {
        margin-top: 15px;
      }
      .cupertino-pane-wrapper.inverse .draggable.over .move {
        margin-top: -5px;
      }
    `;
            // Destroy button
            this.destroyButtonEl = document.createElement('div');
            this.destroyButtonEl.classList.add('destroy-button');
            internalStyles += `
      .cupertino-pane-wrapper .destroy-button {
        width: 26px;
        height: 26px;
        position: absolute;
        background: var(--cupertino-pane-destroy-button-background, #ebebeb);
        fill: var(--cupertino-pane-icon-close-color, #7a7a7e);
        right: 20px;
        z-index: 14;
        border-radius: 100%;
        top: 16px;
      }
    `;
            // Content user element
            this.contentEl = this.el;
            this.contentEl.style.transition = `opacity ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
            this.contentEl.style.overflowX = 'hidden';
            // Backdrop
            internalStyles += `
      .cupertino-pane-wrapper .backdrop {
        overflow: hidden;
        position: fixed;
        width: 100%;
        bottom: 0;
        right: 0;
        left: 0;
        top: 0;
        display: none;
        z-index: 10;
      }
    `;
            // Inject internal CSS
            this.addStyle(internalStyles);
            // inject DOM
            this.parentEl.appendChild(this.wrapperEl);
            this.wrapperEl.appendChild(this.paneEl);
            this.paneEl.appendChild(this.contentEl);
            if (this.settings.showDraggable) {
                this.paneEl.appendChild(this.draggableEl);
                this.draggableEl.appendChild(this.moveEl);
            }
        }
        present(conf = { animate: false }) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
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
                this.updateScreenHeights();
                this.drawBaseElements();
                yield this.setBreakpoints();
                // Necessary Inlines with breakpoints
                this.paneEl.style.height = `${this.getPaneHeight()}px`;
                if (this.settings.inverse) {
                    this.paneEl.style.top = `-${this.breakpoints.bottomer - this.settings.bottomOffset}px`;
                }
                // Show elements
                this.wrapperEl.style.display = 'block';
                this.contentEl.style.display = 'block';
                this.wrapperEl.classList.add('rendered');
                this.rendered = true;
                if (this.settings.followerElement) {
                    if (!document.querySelector(this.settings.followerElement)) {
                        console.warn('Cupertino Pane: wrong follower element selector specified', this.settings.followerElement);
                        return;
                    }
                    this.followerEl = document.querySelector(this.settings.followerElement);
                    this.followerEl.style.willChange = 'transform, border-radius';
                    this.followerEl.style.transform = `translateY(0px) translateZ(0px)`;
                    this.followerEl.style.transition = this.buildTransitionValue((_a = this.settings.breaks[this.currentBreak()]) === null || _a === void 0 ? void 0 : _a.bounce);
                }
                // Assign multiplicators for push elements
                if (this.settings.zStack) {
                    this.setZstackConfig(this.settings.zStack);
                    this.setPushMultiplicators();
                }
                if ((this.settings.buttonClose && this.settings.buttonDestroy) && !this.settings.inverse) {
                    this.paneEl.appendChild(this.destroyButtonEl);
                    this.destroyButtonEl.addEventListener('click', (t) => this.destroy({ animate: true, destroyButton: true }));
                    this.destroyButtonEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M278.6 256l68.2-68.2c6.2-6.2 6.2-16.4 0-22.6-6.2-6.2-16.4-6.2-22.6 0L256 233.4l-68.2-68.2c-6.2-6.2-16.4-6.2-22.6 0-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3l68.2 68.2-68.2 68.2c-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3 6.2 6.2 16.4 6.2 22.6 0l68.2-68.2 68.2 68.2c6.2 6.2 16.4 6.2 22.6 0 6.2-6.2 6.2-16.4 0-22.6L278.6 256z"/>
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
                this.checkOpacityAttr(this.breakpoints.currentBreakpoint);
                /****** Fix android issues *******/
                if (this.device.android) {
                    // Body patch prevent android pull-to-refresh
                    document.body.style['overscrollBehaviorY'] = 'none';
                }
                /****** Animation & Transition ******/
                if (conf.animate) {
                    yield this.doTransition({ type: 'present', translateY: this.breakpoints.breaks[this.settings.initialBreak] });
                }
                else {
                    // No initial transitions
                    this.breakpoints.prevBreakpoint = this.settings.initialBreak;
                    this.paneEl.style.transform = `translateY(${this.breakpoints.breaks[this.settings.initialBreak]}px) translateZ(0px)`;
                    if (this.settings.backdrop) {
                        this.backdropEl.style.display = `block`;
                    }
                    if (this.settings.zStack) {
                        this.settings.zStack.pushElements.forEach(item => this.pushTransition(document.querySelector(item), this.breakpoints.breaks[this.settings.initialBreak], 'unset'));
                    }
                    // Emit event
                    this.settings.onDidPresent();
                }
                // Some timeout to get offsetTop
                yield new Promise((resolve) => setTimeout(() => resolve(true), 150));
                this.scrollElementInit();
                this.checkOverflowAttr(this.breakpoints.currentBreakpoint);
                /****** Attach Events *******/
                this.events.attachAllEvents();
                return this;
            });
        }
        getPaneHeight() {
            if (!this.settings.inverse) {
                return this.screen_height - this.breakpoints.topper - this.settings.bottomOffset;
            }
            return this.breakpoints.bottomer - this.settings.bottomOffset;
        }
        updateScreenHeights() {
            if (this.settings.inverse) {
                this.screen_height = window.innerHeight;
                this.screenHeightOffset = 0;
            }
            else {
                this.screen_height = window.innerHeight;
                this.screenHeightOffset = window.innerHeight;
            }
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
                this.setOverflowHeight();
            }
        }
        setOverflowHeight(offset = 0) {
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
        checkOpacityAttr(val) {
            let attrElements = this.el.querySelectorAll('[hide-on-bottom]');
            if (!attrElements.length)
                return;
            if (this.settings.inverse)
                return;
            attrElements.forEach((item) => {
                item.style.transition = `opacity ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
                item.style.opacity = (val >= this.breakpoints.breaks['bottom']) ? '0' : '1';
            });
        }
        checkOverflowAttr(val) {
            if (!this.settings.topperOverflow
                || !this.overflowEl) {
                return;
            }
            if (!this.settings.inverse) {
                this.overflowEl.style.overflowY = (val <= this.breakpoints.topper) ? 'auto' : 'hidden';
            }
            else {
                this.overflowEl.style.overflowY = (val >= this.breakpoints.bottomer) ? 'auto' : 'hidden';
            }
        }
        isPanePresented() {
            // Check through all presented panes
            let wrappers = Array.from(document.querySelectorAll(`.cupertino-pane-wrapper.rendered`));
            if (!wrappers.length)
                return false;
            return wrappers.find((item) => item.contains(this.selector)) ? true : false;
        }
        /**
         * Private Utils methods
         */
        buildTransitionValue(bounce) {
            if (bounce) {
                return `all 300ms cubic-bezier(.155,1.105,.295,1.12)`;
            }
            return `all ${this.settings.animationDuration}ms ${this.settings.animationType}`;
        }
        isBackdropPresented() {
            return document.querySelector(`.cupertino-pane-wrapper .backdrop`)
                ? true : false;
        }
        renderBackdrop() {
            this.backdropEl = document.createElement('div');
            this.backdropEl.classList.add('backdrop');
            this.backdropEl.style.transition = `all ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
            this.backdropEl.style.backgroundColor = `rgba(0,0,0, ${this.settings.backdropOpacity})`;
            this.wrapperEl.appendChild(this.backdropEl);
            this.backdropEl.addEventListener('click', (t) => this.settings.onBackdropTap());
        }
        /**
         * Utility function to add minified internal CSS to head.
         * @param {string} styleString
         */
        addStyle(styleString) {
            if (document.querySelector('#cupertino-panes-internal'))
                return;
            const style = document.createElement('style');
            style.id = 'cupertino-panes-internal';
            styleString = styleString.replace(/\s\s+/g, ' ');
            style.textContent = styleString;
            document.head.prepend(style);
        }
        ;
        // Z-Stack: Pushed elements multiplicators
        setPushMultiplicators() {
            this.settings.zStack.pushElements.forEach((item) => {
                let pushElement = document.querySelector(item);
                let multiplicator = this.getPushMulitplicator(pushElement);
                multiplicator = multiplicator ? multiplicator + 1 : 1;
                pushElement.style.setProperty('--push-multiplicator', `${multiplicator}`);
            });
        }
        clearPushMultiplicators() {
            for (let i = 0; i < this.settings.zStack.pushElements.length; i++) {
                let pushElement = document.querySelector(this.settings.zStack.pushElements[i]);
                let multiplicator = this.getPushMulitplicator(pushElement);
                multiplicator -= 1;
                if (multiplicator) {
                    pushElement.style.setProperty('--push-multiplicator', `${multiplicator}`);
                }
                else {
                    pushElement.style.removeProperty('--push-multiplicator');
                }
            }
        }
        getPushMulitplicator(el) {
            let multiplicator = el.style.getPropertyValue('--push-multiplicator');
            return parseInt(multiplicator);
        }
        setZstackConfig(zStack) {
            this.settings.zStack = zStack ? Object.assign(Object.assign({}, this.zStackDefaults), zStack) : null;
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
                // Reset events to attach backdrop stop propagation
                this.events.resetEvents();
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
        /**
         * Public user method to reset breakpoints
         * @param conf
         */
        setBreakpoints(conf, bottomOffset) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.isPanePresented() && !conf) {
                    console.warn(`Cupertino Pane: Provide any breaks configuration`);
                    return;
                }
                yield this.breakpoints.buildBreakpoints(conf, bottomOffset);
            });
        }
        calcFitHeight() {
            return __awaiter(this, void 0, void 0, function* () {
                // Allow user to call method asap, dont check with this.isPanePresented()
                if (!this.wrapperEl || !this.el) {
                    return null;
                }
                if (this.breakpoints.calcHeightInProcess) {
                    console.warn(`Cupertino Pane: calcFitHeight() already in process`);
                    return null;
                }
                yield this.breakpoints.buildBreakpoints(this.breakpoints.lockedBreakpoints);
            });
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
            this.checkOpacityAttr(this.breakpoints.breaks[val]);
            this.checkOverflowAttr(this.breakpoints.breaks[val]);
            this.doTransition({ type: 'breakpoint', translateY: this.breakpoints.breaks[val] });
            this.breakpoints.currentBreakpoint = this.breakpoints.breaks[val];
        }
        moveToHeight(val) {
            if (!this.isPanePresented()) {
                console.warn(`Cupertino Pane: Present pane before call moveToHeight()`);
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
            return this.breakpoints.getCurrentBreakName();
        }
        ;
        destroyResets() {
            this.parentEl.appendChild(this.contentEl);
            this.wrapperEl.remove();
            /****** Detach Events *******/
            this.events.detachAllEvents();
            // Clear pushed elements
            if (this.settings.zStack) ;
            // Reset vars
            delete this.rendered;
            delete this.breakpoints.prevBreakpoint;
            // Reset styles
            this.contentEl.style.display = 'none';
        }
        destroy(conf = {
            animate: false,
            destroyButton: false
        }) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.isPanePresented()) {
                    console.warn(`Cupertino Pane: Present pane before call destroy()`);
                    return null;
                }
                // Prevent dismiss
                if (this.preventDismissEvent) {
                    // Emit event with prevent dismiss if not already sent from drag event
                    if (!this.preventedDismiss) {
                        this.settings.onWillDismiss({ prevented: true });
                        this.moveToBreak(this.breakpoints.prevBreakpoint);
                    }
                    return;
                }
                // Emit event
                this.settings.onWillDismiss();
                /****** Animation & Transition ******/
                if (conf.animate) {
                    yield this.doTransition({ type: 'destroy', translateY: this.screenHeightOffset, destroyButton: conf.destroyButton });
                }
                else {
                    this.destroyResets();
                    // Emit event
                    this.settings.onDidDismiss({ destroyButton: conf.destroyButton });
                }
            });
        }
        pushTransition(pushElement, newPaneY, transition) {
            let zStack = this.settings.zStack.pushElements;
            pushElement.style.transition = transition;
            newPaneY = this.screenHeightOffset - newPaneY;
            const topHeight = this.settings.zStack.minPushHeight
                ? this.settings.zStack.minPushHeight : this.screenHeightOffset - this.breakpoints.bottomer;
            const minHeight = this.screenHeightOffset - this.breakpoints.topper;
            // Math calculations
            let multiplicator = this.getPushMulitplicator(pushElement);
            let scaleNew = Math.pow(this.settings.zStack.cardZScale, multiplicator);
            let scaleNormal = Math.pow(this.settings.zStack.cardZScale, multiplicator - 1);
            let pushY = 6 + this.settings.zStack.cardYOffset; // 6 is iOS style offset for z-stacks
            let yNew = -1 * (pushY * multiplicator);
            let yNormal = (yNew + pushY);
            let contrastNew = Math.pow(this.settings.zStack.cardContrast, multiplicator);
            let contrastNormal = Math.pow(this.settings.zStack.cardContrast, multiplicator - 1);
            // Accumulated styles from each pusher to pushed
            const setStyles = (scale, y, contrast, border) => {
                let exponentAngle = Math.pow(scale, this.settings.zStack.stackZAngle / 100);
                pushElement.style.transform = `translateY(${y * (exponentAngle / scale)}px) scale(${scale})`;
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
                setStyles(scaleNormal, // scale
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
                if (val > max)
                    val = max;
                if (val < min)
                    val = min;
                return val;
            };
            setStyles(getXbyY(scaleNew, scaleNormal), getXbyY(yNew, yNormal), getXbyY(contrastNew, contrastNormal), getXbyY(-10, 0) * -1);
        }
        /***********************************
         * Transitions handler
         */
        doTransition(params = {}) {
            return new Promise((resolve) => {
                var _a;
                // touchmove simple event
                if (params.type === 'move') {
                    this.paneEl.style.transition = 'all 0ms linear 0ms';
                    this.paneEl.style.transform = `translateY(${params.translateY}px) translateZ(0px)`;
                    // Bind for follower same transitions
                    if (this.followerEl) {
                        this.followerEl.style.transition = 'all 0ms linear 0ms';
                        this.followerEl.style.transform = `translateY(${params.translateY - this.breakpoints.breaks[this.settings.initialBreak]}px) translateZ(0px)`;
                    }
                    // Push transition for each element
                    if (this.settings.zStack) {
                        this.settings.zStack.pushElements.forEach(item => this.pushTransition(document.querySelector(item), this.getPanelTransformY(), 'all 0ms linear 0ms'));
                    }
                    return resolve(true);
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
                        this.settings.onDidDismiss({ destroyButton: params.destroyButton });
                    }
                    this.settings.onTransitionEnd({ target: document.body.contains(this.paneEl) ? this.paneEl : null });
                    // Remove listener
                    this.paneEl.removeEventListener('transitionend', transitionEnd);
                    return resolve(true);
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
                        return resolve(true);
                    // Get timing function && push for next 
                    const nextBreak = Object.entries(this.breakpoints.breaks).find(val => val[1] === params.translateY);
                    let bounce = nextBreak && ((_a = this.settings.breaks[nextBreak[0]]) === null || _a === void 0 ? void 0 : _a.bounce);
                    // style
                    this.paneEl.style.transition = this.buildTransitionValue(bounce);
                    // Bind for follower same transitions
                    if (this.followerEl) {
                        this.followerEl.style.transition = this.buildTransitionValue(bounce);
                    }
                    // Push transition
                    if (this.settings.zStack) {
                        // Reason of timeout is to hide empty space when present pane and push element
                        // we should start push after pushMinHeight but for present 
                        // transition we can't calculate where pane Y is.    
                        setTimeout(() => {
                            this.settings.zStack.pushElements.forEach(item => this.pushTransition(document.querySelector(item), params.translateY, `all ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`));
                        }, (this.settings.zStack.cardYOffset && params.type === 'present') ? 50 : 0);
                    }
                    // Main transitions
                    setTimeout(() => {
                        // Emit event
                        this.settings.onTransitionStart({ translateY: { new: params.translateY } });
                        this.paneEl.style.transform = `translateY(${params.translateY}px) translateZ(0px)`;
                        // Bind for follower same transitions
                        if (this.followerEl) {
                            this.followerEl.style.transform = `translateY(${params.translateY - this.breakpoints.breaks[this.settings.initialBreak]}px) translateZ(0px)`;
                        }
                    }, params.type === 'present' ? 50 : 0);
                    let getNextBreakpoint = Object.entries(this.breakpoints.breaks).find(val => val[1] === params.translateY);
                    if (getNextBreakpoint) {
                        this.breakpoints.prevBreakpoint = getNextBreakpoint[0];
                    }
                    this.paneEl.addEventListener('transitionend', transitionEnd);
                }
            });
        }
    }

    return CupertinoPane;

}));
//# sourceMappingURL=cupertino-pane.js.map

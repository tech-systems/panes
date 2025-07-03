/**
 * Cupertino Pane 1.4.22
 * Cupertino Panes is multi-functional modals, cards & panes with touch technologies.
 * https://panejs.com
 *
 * Copyright 2019-2025 Roman Antonov (roman-rr)
 *
 * Released under the MIT License
 *
 * Released on: July 3, 2025
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.CupertinoPane = factory());
})(this, (function () { 'use strict';

    /******************************************************************************
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
    /* global Reflect, Promise, SuppressedError, Symbol, Iterator */


    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

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
     * Touch start, Touch move, Touch end
     * Click, Scroll
     */
    class Events {
        constructor(instance) {
            this.instance = instance;
            this.allowClick = true;
            this.disableDragAngle = false;
            this.mouseDown = false;
            this.contentScrollTop = 0;
            this.steps = [];
            this.isScrolling = false;
            // RequestAnimationFrame properties for smoother touch move
            this.rafId = null;
            this.pendingMoveData = null;
            /**
             * Touch Start Event
             * @param t
             */
            this.touchStartCb = (t) => this.touchStart(t);
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
            this.settings = this.instance.settings;
            this.device = this.instance.device;
            this.breakpoints = this.instance.breakpoints;
            this.transitions = this.instance.transitions;
            this.keyboardEvents = this.instance.keyboardEvents;
            this.resizeEvents = this.instance.resizeEvents;
            this.touchEvents = this.getTouchEvents();
            // Set sensivity lower for web
            this.swipeNextSensivity = window.hasOwnProperty('cordova')
                ? (this.settings.fastSwipeSensivity + 2) : this.settings.fastSwipeSensivity;
        }
        getTouchEvents() {
            const touch = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
            let desktop = ['mousedown', 'mousemove', 'mouseup', 'mouseleave'];
            const touchEventsTouch = {
                start: touch[0], move: touch[1],
                end: touch[2], cancel: touch[3]
            };
            const touchEventsDesktop = {
                start: desktop[0], move: desktop[1],
                end: desktop[2], cancel: desktop[3],
            };
            return Support.touch || !this.settings.simulateTouch ? touchEventsTouch : touchEventsDesktop;
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
            // Handle keyboard events for cordova ios/android
            if (this.settings.handleKeyboard && this.device.cordova) {
                window.addEventListener('keyboardWillShow', this.keyboardEvents.onKeyboardShowCb);
                window.addEventListener('keyboardWillHide', this.keyboardEvents.onKeyboardWillHideCb);
            }
            // Fix Ionic-Android issue with ion-page scroll on keyboard
            if (this.device.ionic && this.device.android) {
                let ionPages = document.querySelectorAll('.ion-page');
                ionPages.forEach((el) => {
                    el.addEventListener('scroll', (e) => {
                        if (el.scrollTop) {
                            el.scrollTo({ top: 0 });
                        }
                    });
                });
            }
            // Orientation change + window resize
            window.addEventListener('resize', this.resizeEvents.onWindowResizeCb);
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
                window.removeEventListener('keyboardWillShow', this.keyboardEvents.onKeyboardShowCb);
                window.removeEventListener('keyboardWillHide', this.keyboardEvents.onKeyboardWillHideCb);
            }
            // Orientation change + window resize
            window.removeEventListener('resize', this.resizeEvents.onWindowResizeCb);
        }
        resetEvents() {
            this.detachAllEvents();
            this.attachAllEvents();
        }
        /**
         * Core DOM elements event listeners
         * @param type
         * @param el
         */
        eventListeners(type, el) {
            if (Support.touch) {
                const passiveListener = this.touchEvents.start === 'touchstart' && Support.passiveListener && this.settings.passiveListeners ? { passive: true, capture: false } : false;
                el[type](this.touchEvents.start, this.touchStartCb, passiveListener);
                el[type](this.touchEvents.move, this.touchMoveCb, Support.passiveListener ? { passive: false, capture: false } : false);
                el[type](this.touchEvents.end, this.touchEndCb, passiveListener);
                el[type](this.touchEvents.cancel, this.touchEndCb, passiveListener);
            }
            else {
                el[type](this.touchEvents.start, this.touchStartCb, false);
                el[type](this.touchEvents.move, this.touchMoveCb, false);
                el[type](this.touchEvents.end, this.touchEndCb, false);
                el[type](this.touchEvents.cancel, this.touchEndCb, false);
            }
            // Prevent accidental unwanted clicks events during swiping
            if (this.settings.preventClicks) {
                el[type]('click', this.onClickCb, true);
            }
        }
        touchStart(t) {
            // Event emitter
            this.instance.emit('onDragStart', t);
            // Cancel any pending animation frame
            if (this.rafId) {
                cancelAnimationFrame(this.rafId);
                this.rafId = null;
                this.pendingMoveData = null;
            }
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
            /**
             * TODO: Switch to pointer events
             */
            const { clientY, clientX } = this.getEventClientYX(t, 'touchstart');
            if (!clientY || !clientX) {
                return;
            }
            this.startY = clientY;
            this.startX = clientX;
            if (t.type === 'mousedown')
                this.mouseDown = true;
            // if overflow content was scrolled
            // and drag not by draggable
            // increase to scrolled value
            if (this.contentScrollTop
                && this.willScrolled()
                && !this.isDraggableElement(t)) {
                this.startY += this.contentScrollTop;
            }
            this.steps.push({ posY: this.startY, posX: this.startX, time: Date.now() });
        }
        touchMove(t) {
            var _a, _b;
            /**
             * TODO: Switch to pointer events
             */
            const { clientY, clientX, velocityY } = this.getEventClientYX(t, 'touchmove');
            if (!clientY || !clientX) {
                return;
            }
            // Deskop: check that touchStart() was initiated
            if (t.type === 'mousemove' && !this.mouseDown)
                return;
            // sometimes touchstart is not called 
            // when touchmove is began before initialization
            if (!this.steps.length) {
                this.steps.push({ posY: clientY, posX: clientX, time: Date.now() });
            }
            // Event emitter
            t.delta = ((_a = this.steps[0]) === null || _a === void 0 ? void 0 : _a.posY) - clientY;
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
            // Block upward drag immediately when scroll at initial position
            if (this.contentScrollTop === 0
                && this.instance.overflowEl.style.overflowY === 'auto'
                && this.isElementScrollable(this.instance.overflowEl)
                && !this.isDraggableElement(t)) {
                const diffY = clientY - ((_b = this.steps[this.steps.length - 1]) === null || _b === void 0 ? void 0 : _b.posY) || 0;
                // Prevent any upward movement (negative diffY) when scroll at initial position
                if (diffY < 0) {
                    return; // Block immediately, no movement allowed
                }
            }
            // Delta
            const diffY = clientY - this.steps[this.steps.length - 1].posY;
            const diffX = clientX - this.steps[this.steps.length - 1].posX;
            // No Y/X changes
            if (!Math.abs(diffY)
                && !Math.abs(diffX)) {
                return;
            }
            // Emit event
            this.instance.emit('onDrag', t);
            // Has changes in position 
            this.instance.setGrabCursor(true, true);
            let newVal = this.instance.getPanelTransformY() + diffY;
            let newValX = this.instance.getPanelTransformX() + diffX;
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
                    this.keyboardEvents.inputBluredbyMove = true;
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
            // Scroll handler
            if (this.instance.overflowEl.style.overflowY === 'auto'
                && this.scrollPreventDrag(t)
                && !this.isDraggableElement(t)) {
                return;
            }
            // Handle Superposition
            let forceNewVal = this.handleSuperposition({
                clientX, clientY, newVal,
                newValX, diffY, diffX
            });
            if (forceNewVal) {
                if (!isNaN(forceNewVal.y))
                    newVal = forceNewVal.y;
                if (!isNaN(forceNewVal.x))
                    newValX = forceNewVal.x;
            }
            if (forceNewVal === false) {
                return;
            }
            // No changes Y/X
            if (this.instance.getPanelTransformY() === newVal
                && this.instance.getPanelTransformX() === newValX) {
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
                    this.instance.emit('onWillDismiss', { prevented: true });
                    this.instance.moveToBreak(this.breakpoints.prevBreakpoint);
                    return;
                }
            }
            // Store the pending move data for requestAnimationFrame
            this.pendingMoveData = { newVal, newValX, clientY, clientX };
            // Request animation frame if not already pending
            if (!this.rafId) {
                this.rafId = requestAnimationFrame(() => this.applyMoveUpdate());
            }
            this.steps.push({ posY: clientY, posX: clientX, time: Date.now() });
        }
        /**
         * Apply the pending move update in animation frame for smoother performance
         */
        applyMoveUpdate() {
            if (!this.pendingMoveData) {
                this.rafId = null;
                return;
            }
            const { newVal, newValX } = this.pendingMoveData;
            // Apply the opacity and overflow attributes
            this.instance.checkOpacityAttr(newVal);
            this.instance.checkOverflowAttr(newVal);
            // Apply the transition
            this.transitions.doTransition({ type: 'move', translateY: newVal, translateX: newValX });
            // Clear the pending data and animation frame ID
            this.pendingMoveData = null;
            this.rafId = null;
        }
        touchEnd(t) {
            var _a, _b;
            if (this.instance.disableDragEvents)
                return;
            // Cancel any pending animation frame
            if (this.rafId) {
                cancelAnimationFrame(this.rafId);
                this.rafId = null;
                // Apply any pending move data immediately before ending
                if (this.pendingMoveData) {
                    this.applyMoveUpdate();
                }
            }
            // Desktop fixes
            if (t.type === 'mouseleave' && !this.mouseDown)
                return;
            if (t.type === 'mouseup' || t.type === 'mouseleave')
                this.mouseDown = false;
            // Determinate nearest point
            let closest = this.breakpoints.getClosestBreakY();
            // Swipe - next (if differ > 10)
            let fastSwipeClose;
            if (this.fastSwipeNext('Y')) {
                closest = this.instance.swipeNextPoint(((_a = this.steps[this.steps.length - 1]) === null || _a === void 0 ? void 0 : _a.posY) - ((_b = this.steps[this.steps.length - 2]) === null || _b === void 0 ? void 0 : _b.posY), //diff
                this.swipeNextSensivity, closest);
                fastSwipeClose = this.settings.fastSwipeClose
                    && this.breakpoints.currentBreakpoint < closest;
            }
            // update currentBreakpoint once `closest` is known so it's available in emitted events
            this.breakpoints.currentBreakpoint = closest;
            // blur tap event
            let blurTapEvent = false;
            if ((this.isFormElement(document.activeElement))
                && !(this.isFormElement(t.target))
                && this.steps.length === 2) {
                blurTapEvent = true;
            }
            // Event emitter
            this.instance.emit('onDragEnd', t);
            // Clear
            this.steps = [];
            delete this.startPointOverTop;
            // touchend with allowClick === tapped event (no move triggered)
            // skip next functions
            if (this.allowClick || blurTapEvent) {
                return;
            }
            // Fast swipe toward bottom - close
            if (fastSwipeClose) {
                this.instance.destroy({ animate: true });
                return;
            }
            this.instance.checkOpacityAttr(closest);
            this.instance.checkOverflowAttr(closest);
            this.instance.setGrabCursor(true, false);
            // Bottom closable
            if (this.settings.bottomClose
                && closest === this.breakpoints.breaks['bottom']) {
                this.instance.destroy({ animate: true });
                return;
            }
            // Simulationiusly emit event when touchend exact with next position (top)
            if (this.instance.getPanelTransformY() === closest) {
                this.instance.emit('onTransitionEnd', { target: this.instance.paneEl });
            }
            this.transitions.doTransition({ type: 'end', translateY: closest });
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
            // Android Multiple Re-focus on PWA
            // with resize keyboard handler
            if (!this.device.cordova
                && this.device.android
                && this.isFormElement(t.target)) {
                this.keyboardEvents.onKeyboardShowCb({ keyboardHeight: this.instance.screen_height - window.innerHeight });
                return;
            }
            // Click to bottom - open middle
            if (this.settings.clickBottomOpen) {
                if (this.isFormElement(document.activeElement)) {
                    return;
                }
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
        fastSwipeNext(axis) {
            var _a, _b;
            const diff = ((_a = this.steps[this.steps.length - 1]) === null || _a === void 0 ? void 0 : _a['pos' + axis]) - ((_b = this.steps[this.steps.length - 2]) === null || _b === void 0 ? void 0 : _b['pos' + axis]);
            return (Math.abs(diff) >= this.swipeNextSensivity);
        }
        /**
         * Private class methods
         */
        /**
         * Superposition handler.
         * Superposition is the ability of a quantum system to be in multiple states at the same time until it is measured.
         * Topper Than Top
         * Lower Than Bottom
         * Lefter Than Left
         * Righter Than Right
         */
        handleSuperposition(coords) {
            // Disallow drag upper than top point
            // And drag bottom when upper than top point (for zStack allowed)
            if (!this.settings.upperThanTop
                && (coords.newVal <= this.breakpoints.topper
                    || (coords.clientY <= this.breakpoints.topper && !this.settings.zStack))) {
                this.steps = [];
                return { y: this.breakpoints.topper };
            }
            /**
             * Allow drag topper than top point
             */
            if (this.settings.upperThanTop
                && ((coords.newVal <= this.breakpoints.topper)
                    || this.startPointOverTop)) {
                // check that finger reach same position before enable normal swipe mode
                if (!this.startPointOverTop) {
                    this.startPointOverTop = coords.clientY;
                }
                if (this.startPointOverTop < coords.clientY) {
                    delete this.startPointOverTop;
                }
                const screenDelta = this.instance.screen_height - this.instance.screenHeightOffset;
                const differKoef = (screenDelta - this.instance.getPanelTransformY()) / (screenDelta - this.breakpoints.topper) / 8;
                return { y: this.instance.getPanelTransformY() + (coords.diffY * differKoef) };
            }
            // Disallow drag lower then bottom
            if (!this.settings.lowerThanBottom
                && coords.newVal >= this.breakpoints.bottomer) {
                return { y: this.breakpoints.bottomer };
            }
        }
        getEventClientYX(ev, name) {
            var _a, _b;
            const targetTouch = ev.type === name && ev.targetTouches && (ev.targetTouches[0] || ev.changedTouches[0]);
            const clientY = (ev.type === name) ? targetTouch === null || targetTouch === void 0 ? void 0 : targetTouch.clientY : ev.clientY;
            const clientX = (ev.type === name) ? targetTouch === null || targetTouch === void 0 ? void 0 : targetTouch.clientX : ev.clientX;
            const timeDiff = (Date.now()) - (((_a = this.steps[this.steps.length - 1]) === null || _a === void 0 ? void 0 : _a.time) || 0);
            const distanceY = Math.abs(clientY - (((_b = this.steps[this.steps.length - 1]) === null || _b === void 0 ? void 0 : _b.posY) || 0));
            const velocityY = distanceY / timeDiff;
            return { clientY, clientX, velocityY };
        }
        scrollPreventDrag(t) {
            let prevention = false;
            if (this.contentScrollTop > 0) {
                prevention = true;
            }
            return prevention;
        }
        willScrolled() {
            if (!(this.isElementScrollable(this.instance.overflowEl)
                && this.instance.overflowEl.style.overflow !== 'hidden')) {
                return false;
            }
            return true;
        }
        isDraggableElement(t) {
            return t.target === this.instance.draggableEl
                || t.target === this.instance.moveEl;
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

    /**
     * Resize, Keyboard show, Keyboard hide
     */
    class KeyboardEvents {
        constructor(instance) {
            this.instance = instance;
            // Keyboard help vars
            this.inputBluredbyMove = false;
            this.keyboardVisibleResize = false;
            this.inputBottomOffset = 0;
            this.previousInputBottomOffset = 0;
            this.prevNewHeight = 0;
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
            this.device = this.instance.device;
            this.breakpoints = this.instance.breakpoints;
        }
        onKeyboardShow(e) {
            return __awaiter(this, void 0, void 0, function* () {
                // focus element not inside pane
                if (!this.isPaneDescendant(document.activeElement)) {
                    return;
                }
                // pane not visible on viewport
                if (!this.isOnViewport()) {
                    return;
                }
                this.keyboardVisibleResize = true;
                this.fixBodyKeyboardResize(true);
                // calculate distances based on transformY
                let currentHeight = (this.instance.getPanelTransformY() - this.instance.screen_height) * -1;
                const inputEl = document.activeElement;
                const inputElBottomBound = this.getActiveInputClientBottomRect();
                const inputSpaceBelow = this.instance.screen_height - inputElBottomBound - this.inputBottomOffset;
                let offset = this.device.cordova && this.device.android ? 130 : 100;
                let spaceBelowOffset = 0;
                let newHeight = currentHeight + (e.keyboardHeight - inputSpaceBelow);
                // Multiple event fired with opened keyboard
                if (this.prevNewHeight) {
                    spaceBelowOffset = this.previousInputBottomOffset - inputElBottomBound;
                    newHeight = this.prevNewHeight;
                }
                // Re-focus input dublicate events
                if (inputEl.isEqualNode(this.prevFocusedElement)) {
                    return;
                }
                // Keyboard will overlaps input
                if (e.keyboardHeight > inputSpaceBelow) {
                    this.prevNewHeight = newHeight - spaceBelowOffset;
                    this.prevFocusedElement = document.activeElement;
                    let nextHeight = newHeight - spaceBelowOffset + offset;
                    // Not push more than pane height
                    if (nextHeight > this.instance.getPaneHeight() + e.keyboardHeight) {
                        nextHeight = this.instance.getPaneHeight() + e.keyboardHeight;
                    }
                    /**
                     * TODO: textarea issues
                     */
                    yield this.instance.moveToHeight(nextHeight);
                    // Determinate device offset for presented keyboard
                    const newInputBottomOffset = this.getActiveInputClientBottomRect();
                    this.previousInputBottomOffset = newInputBottomOffset;
                    if (!this.inputBottomOffset) {
                        this.inputBottomOffset = inputElBottomBound - newInputBottomOffset;
                    }
                }
            });
        }
        onKeyboardWillHide(e) {
            // pane not visible on viewport
            if (!this.isOnViewport()) {
                return;
            }
            this.fixBodyKeyboardResize(false);
            // Clear
            this.inputBottomOffset = 0;
            this.previousInputBottomOffset = 0;
            this.prevNewHeight = 0;
            delete this.prevFocusedElement;
            if (this.inputBluredbyMove) {
                this.inputBluredbyMove = false;
                return;
            }
            if (this.instance.isHidden()) {
                return;
            }
            // Position doesn't changed
            if (this.instance.getPanelTransformY() === this.breakpoints.breaks[this.breakpoints.prevBreakpoint]) {
                return;
            }
            this.instance.moveToBreak(this.breakpoints.prevBreakpoint);
        }
        /**
         * Detect and handle keyboard events from window resize
         * Public method to be called by resize handler
         * @param e
         */
        handleKeyboardFromResize(e) {
            /**
             * Keyboard event detection
             * We should separate keyboard and resize events
             */
            if (this.isFormElement(document.activeElement)) {
                // Only for non-cordova
                if (!this.device.cordova) {
                    this.onKeyboardShow({ keyboardHeight: this.instance.screen_height - window.innerHeight });
                }
                return true; // Keyboard event was handled
            }
            if (this.keyboardVisibleResize) {
                this.keyboardVisibleResize = false;
                // Only for non-cordova
                if (!this.device.cordova) {
                    this.onKeyboardWillHide({});
                }
                return true; // Keyboard event was handled
            }
            return false; // No keyboard event, proceed with resize
        }
        /**
         * Private class methods
         */
        // TODO: switch to contains
        isPaneDescendant(el) {
            if (!el) {
                return false;
            }
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
        isOnViewport() {
            if (this.instance.paneEl
                && this.instance.paneEl.offsetWidth === 0
                && this.instance.paneEl.offsetHeight === 0) {
                return false;
            }
            return true;
        }
        /**
         * Deal with Ionic Framework.
         * ion-input, ion-textarea changes in Client rects after window resize.
         * get rects by parent, not shadowDom el
         */
        getActiveInputClientBottomRect() {
            var _a, _b;
            if (document.activeElement.classList.contains('native-textarea')
                || document.activeElement.classList.contains('native-input')) {
                // Go top until ionic element
                let ionElement = (_b = (_a = document.activeElement.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement;
                return ionElement.getBoundingClientRect().bottom;
            }
            return document.activeElement.getBoundingClientRect().bottom;
        }
        /**
         * Using only to fix follower elemennts jumps out by OSK
         * Fix OSK
         * https://developer.chrome.com/blog/viewport-resize-behavior/
         * Chrome 108+ will adjust with overlays-content
         * When everyones updates, can be replaced with adding content-overlays to meta
         */
        fixBodyKeyboardResize(showKeyboard) {
            if (!this.instance.paneEl)
                return;
            const metaViewport = document.querySelector('meta[name=viewport]');
            window.requestAnimationFrame(() => {
                if (showKeyboard) {
                    document.documentElement.style.setProperty('overflow', 'hidden');
                    document.body.style.setProperty('min-height', `${this.instance.screen_height}px`);
                    metaViewport.setAttribute('content', 'height=' + this.instance.screen_height + ', width=device-width, initial-scale=1.0');
                }
                else {
                    document.documentElement.style.removeProperty('overflow');
                    document.body.style.removeProperty('min-height');
                    metaViewport.setAttribute('content', 'viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no');
                }
            });
        }
    }

    /**
     * Window resize, Orientation change
     */
    class ResizeEvents {
        constructor(instance) {
            this.instance = instance;
            this.rafId = null;
            /**
             * Window resize event handler
             * Handles orientation changes and window resize
             * @param e
             */
            this.onWindowResizeCb = (e) => this.onWindowResize(e);
            this.device = this.instance.device;
            this.breakpoints = this.instance.breakpoints;
        }
        onWindowResize(e) {
            return __awaiter(this, void 0, void 0, function* () {
                // Handle keyboard detection first
                this.instance.keyboardEvents.handleKeyboardFromResize(e);
                // Update screen heights immediately
                this.instance.updateScreenHeights();
                // Cancel previous RAF and schedule new one to to frequent calls
                if (this.rafId) {
                    cancelAnimationFrame(this.rafId);
                }
                this.rafId = requestAnimationFrame(() => {
                    this.breakpoints.buildBreakpoints(JSON.parse(this.breakpoints.lockedBreakpoints));
                    this.rafId = null;
                });
            });
        }
        /**
         * Check if element is a form element
         * Shared utility method for form element detection
         */
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
    }

    class Settings {
        constructor() {
            this.instance = {
                initialBreak: 'middle',
                horizontal: false,
                horizontalOffset: null,
                inverse: false,
                parentElement: null,
                followerElement: null,
                cssClass: null,
                fitHeight: false,
                maxFitHeight: null,
                fitScreenHeight: true,
                ionContentScroll: false,
                backdrop: false,
                backdropBlur: false,
                backdropOpacity: 0.6,
                animationType: 'ease',
                animationDuration: 300,
                dragBy: null,
                bottomOffset: 0,
                bottomClose: false,
                fastSwipeClose: false,
                fastSwipeSensivity: 3,
                freeMode: false,
                buttonDestroy: true,
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
                modal: null,
                zStack: null,
                events: null,
                modules: null
            };
        }
    }

    /**
     * Breakpoints builder
     */
    class Breakpoints {
        constructor(instance) {
            this.instance = instance;
            this.breaks = {};
            this.brs = [];
            this.beforeBuildBreakpoints = () => { };
            this.defaultBreaksConf = {
                top: { enabled: true, height: window.innerHeight - (135 * 0.35) },
                middle: { enabled: true, height: 300 },
                bottom: { enabled: true, height: 100 },
            };
            this.settings = this.instance.settings;
        }
        /**
         * Function builder for breakpoints and heights
         * @param conf breakpoints
         */
        buildBreakpoints(conf, bottomOffset = 0, animated = true) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function* () {
                this.breaks = Object.create(null);
                this.conf = conf;
                this.settings.bottomOffset = bottomOffset || this.settings.bottomOffset;
                // Async hook for modules injections
                yield this.beforeBuildBreakpoints();
                ['top', 'middle', 'bottom'].forEach((val) => {
                    var _a;
                    // Set default if no exist
                    if (!this.settings.breaks[val]) {
                        this.settings.breaks[val] = this.defaultBreaksConf[val];
                    }
                    // Override from user conf on updating
                    if (this.conf && this.conf[val]) {
                        this.settings.breaks[val] = this.conf[val];
                    }
                    // System event
                    this.instance.emit('beforeBreakHeightApplied', { break: val });
                    // Apply initial breaks
                    if ((_a = this.settings.breaks[val]) === null || _a === void 0 ? void 0 : _a.enabled) {
                        this.breaks[val] = this.instance.screenHeightOffset;
                        this.breaks[val] -= this.settings.bottomOffset;
                        this.breaks[val] -= this.settings.breaks[val].height;
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
                // TODO: this.brs to this.breaks.map()
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
                if (!this.instance.isPanePresented()) {
                    this.currentBreakpoint = this.breaks[this.settings.initialBreak];
                }
                if (this.instance.isPanePresented()) {
                    // Move to current if updated
                    if ((_a = this.settings.breaks[this.prevBreakpoint]) === null || _a === void 0 ? void 0 : _a.enabled) {
                        if (!this.instance.isHidden()) {
                            // Move to any if removed
                            this.instance.moveToBreak(this.prevBreakpoint, animated ? 'breakpoint' : 'move');
                        }
                    }
                    if (!((_b = this.settings.breaks[this.prevBreakpoint]) === null || _b === void 0 ? void 0 : _b.enabled)) {
                        if (!this.instance.isHidden()) {
                            let nextY = this.instance.swipeNextPoint(1, 1, this.getClosestBreakY());
                            const nextBreak = Object.entries(this.breaks).find(val => val[1] === nextY);
                            this.instance.moveToBreak(nextBreak[0]);
                        }
                    }
                }
                // Re-calc heights and scrolls
                this.instance.scrollElementInit();
                // Checks
                this.instance.checkOpacityAttr(this.currentBreakpoint);
                this.instance.checkOverflowAttr(this.currentBreakpoint);
                // System event
                this.instance.emit('buildBreakpointsCompleted');
            });
        }
        // TODO: Replace currentBreakpoint with prevBreakpoint if possible
        getCurrentBreakName() {
            if (this.breaks['top'] === this.currentBreakpoint)
                return 'top';
            if (this.breaks['middle'] === this.currentBreakpoint)
                return 'middle';
            if (this.breaks['bottom'] === this.currentBreakpoint)
                return 'bottom';
            return null;
        }
        getClosestBreakY() {
            return this.brs.reduce((prev, curr) => {
                return (Math.abs(curr - this.instance.getPanelTransformY()) < Math.abs(prev - this.instance.getPanelTransformY()) ? curr : prev);
            });
        }
    }

    /**
     * Transitions class
     * Z-Push transitions class
     */
    // TODO: review MoveEnd can be replaced with breakpoint
    var CupertinoTransition;
    (function (CupertinoTransition) {
        CupertinoTransition["Present"] = "present";
        CupertinoTransition["Destroy"] = "destroy";
        CupertinoTransition["Move"] = "move";
        CupertinoTransition["Breakpoint"] = "breakpoint";
        CupertinoTransition["Hide"] = "hide";
        CupertinoTransition["TouchEnd"] = "end";
    })(CupertinoTransition || (CupertinoTransition = {}));
    class Transitions {
        constructor(instance) {
            this.instance = instance;
            this.isPaneHidden = false;
            this.settings = this.instance.settings;
            this.breakpoints = this.instance.breakpoints;
        }
        /***********************************
        * Transitions handler
        */
        doTransition(params = {}) {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                // touchmove simple event
                if (params.type === CupertinoTransition.Move) {
                    // System event
                    this.instance.emit('onMoveTransitionStart', { translateY: params.translateY });
                    this.instance.paneEl.style.transition = 'all 0ms linear 0ms';
                    this.setPaneElTransform(params);
                    return resolve(true);
                }
                // Transition end
                const transitionEnd = () => {
                    if (params.type === CupertinoTransition.Destroy) {
                        this.instance.destroyResets();
                    }
                    this.instance.paneEl.style.transition = `initial`;
                    // isHidden
                    if (params.type === CupertinoTransition.Hide) {
                        this.isPaneHidden = true;
                    }
                    if (params.type === CupertinoTransition.Breakpoint
                        || params.type === CupertinoTransition.Present
                        || params.type === CupertinoTransition.TouchEnd) {
                        this.isPaneHidden = false;
                    }
                    // toggle ion-content scroll-y
                    if ((params.type === CupertinoTransition.Hide
                        || params.type === CupertinoTransition.Destroy)
                        && this.instance.ionContent
                        && !this.settings.ionContentScroll
                        && !this.doesPanesExists()) {
                        this.instance.ionContent.setAttribute('scroll-y', 'true');
                    }
                    // Emit event
                    this.instance.emit('onTransitionEnd', {
                        type: params.type,
                        target: document.body.contains(this.instance.paneEl) ? this.instance.paneEl : null
                    });
                    // Remove listener
                    this.instance.paneEl.removeEventListener('transitionend', transitionEnd);
                    return resolve(true);
                };
                // MoveToBreak, Touchend, Present, Hide, Destroy events
                if (params.type === CupertinoTransition.Breakpoint
                    || params.type === CupertinoTransition.TouchEnd
                    || params.type === CupertinoTransition.Present
                    || params.type === CupertinoTransition.Hide
                    || params.type === CupertinoTransition.Destroy) {
                    // Allow custom transitions for present/destroy
                    // + Fix arguments mutations from re-call present
                    let subTransition = ((_a = params.conf) === null || _a === void 0 ? void 0 : _a.transition)
                        ? JSON.parse(JSON.stringify(params.conf.transition)) : {};
                    // freemode
                    if (params.type === CupertinoTransition.TouchEnd && this.settings.freeMode)
                        return resolve(true);
                    // Get timing function && push for next 
                    const nextBreak = Object.entries(this.breakpoints.breaks).find(val => val[1] === params.translateY);
                    let bounce = nextBreak && ((_b = this.settings.breaks[nextBreak[0]]) === null || _b === void 0 ? void 0 : _b.bounce);
                    // transition style
                    let buildedTransition = this.buildTransitionValue(bounce, subTransition.duration);
                    this.instance.paneEl.style.setProperty('transition', buildedTransition);
                    // Main transitions
                    // Emit event
                    this.instance.emit('onTransitionStart', {
                        type: params.type,
                        translateY: { new: params.translateY },
                        transition: this.instance.paneEl.style.transition
                    });
                    // Move pane
                    this.setPaneElTransform(params);
                    /**
                     * Custom transitions for present/destroy functions
                     */
                    if (subTransition.to) {
                        if (!subTransition.to.transform) {
                            subTransition.to.transform = `translateY(${this.breakpoints.breaks[this.settings.initialBreak]}px) translateZ(0px)`;
                        }
                        Object.assign(this.instance.paneEl.style, subTransition.to);
                    }
                    // set prev breakpoint for service needs
                    let getNextBreakpoint = Object.entries(this.breakpoints.breaks).find(val => val[1] === params.translateY);
                    if (getNextBreakpoint) {
                        this.breakpoints.prevBreakpoint = getNextBreakpoint[0];
                    }
                    this.instance.paneEl.addEventListener('transitionend', transitionEnd);
                }
            }));
        }
        setPaneElTransform(params) {
            this.instance.paneEl.style.transform = `translateY(${params.translateY}px) translateZ(0px)`;
        }
        buildTransitionValue(bounce, duration) {
            if (bounce) {
                return `all 300ms cubic-bezier(.155,1.105,.295,1.12)`;
            }
            return `all ${duration || this.settings.animationDuration}ms ${this.settings.animationType}`;
        }
        /**
         * Private class methods
         */
        doesPanesExists() {
            return !!document.querySelector('.cupertino-pane-wrapper');
        }
    }

    // Add listeners
    function on(events, handler, priority) {
        if (!this.eventsListeners) {
            return;
        }
        if (typeof handler !== 'function') {
            return;
        }
        const method = priority ? 'unshift' : 'push';
        events.split(' ').forEach((event) => {
            if (!this.eventsListeners[event]) {
                this.eventsListeners[event] = [];
            }
            this.eventsListeners[event][method](handler);
        });
    }
    // Emit events
    function emit(...args) {
        if (!this.eventsListeners) {
            return;
        }
        let events = args[0];
        let data = args.slice(1, args.length);
        const eventsArray = Array.isArray(events) ? events : events.split(' ');
        eventsArray.forEach((event) => {
            var _a;
            if ((_a = this.eventsListeners) === null || _a === void 0 ? void 0 : _a[event]) {
                this.eventsListeners[event].forEach((eventHandler) => eventHandler.apply(this, data));
            }
        });
    }

    /**
     * Z-Stack Module
     */
    class ZStackModule {
        constructor(instance) {
            this.instance = instance;
            this.zStackDefaults = {
                pushElements: null,
                minPushHeight: null,
                cardBorderRadius: null,
                cardYOffset: 0,
                cardZScale: 0.93,
                cardContrast: 0.85,
                stackZAngle: 160,
            };
            this.breakpoints = this.instance.breakpoints;
            this.settings = this.instance.settings;
            if (!this.settings.zStack) {
                return;
            }
            // bind to primary instance
            // TODO: change binding strategy according to TypeScript
            // E.G. Using public module methods from modules
            this.instance['setZstackConfig'] = (zStack) => __awaiter(this, void 0, void 0, function* () { return this.setZstackConfig(zStack); });
            // Assign multiplicators for push elements
            this.instance.on('rendered', () => {
                this.setZstackConfig(this.settings.zStack);
                this.setPushMultiplicators();
            });
            // Set initial position without animation on present
            this.instance.on('beforePresentTransition', (ev) => {
                if (!ev.animate) {
                    this.settings.zStack.pushElements.forEach(item => this.pushTransition(document.querySelector(item), this.breakpoints.breaks[this.settings.initialBreak], 'unset'));
                }
            });
            // Move/Drag push transition for each element
            this.instance.on('onMoveTransitionStart', () => {
                this.settings.zStack.pushElements.forEach(item => this.pushTransition(document.querySelector(item), this.instance.getPanelTransformY(), 'all 0ms linear 0ms'));
            });
            // Main transition for pushed elements
            this.instance.on('onTransitionStart', (ev) => {
                this.settings.zStack.pushElements.forEach(item => this.pushTransition(document.querySelector(item), ev.translateY.new, `all ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`));
            });
        }
        /**
         * Change z-stack configuration on the way
         */
        setZstackConfig(zStack) {
            // Allow user to reset config
            this.settings.zStack = zStack ? Object.assign(Object.assign({}, this.zStackDefaults), zStack) : null;
        }
        /**
         * Z-Stack push transitions
         * @param pushElement - element be pushed
         * @param newPaneY - translateY of new pane
         * @param transition - transition style
         * @returns
         */
        pushTransition(pushElement, newPaneY, transition) {
            let zStack = this.settings.zStack.pushElements;
            pushElement.style.transition = transition;
            pushElement.style.overflow = this.settings.zStack.cardBorderRadius && 'hidden';
            newPaneY = this.instance.screenHeightOffset - newPaneY;
            const topHeight = this.settings.zStack.minPushHeight
                ? this.settings.zStack.minPushHeight : this.instance.screenHeightOffset - this.breakpoints.bottomer;
            const minHeight = this.instance.screenHeightOffset - this.breakpoints.topper;
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
            setStyles(getXbyY(scaleNew, scaleNormal), getXbyY(yNew, yNormal), getXbyY(contrastNew, contrastNormal), getXbyY(this.settings.zStack.cardBorderRadius * -1, 0) * -1);
        }
        // Z-Stack: Pushed elements multiplicators
        setPushMultiplicators() {
            this.settings.zStack.pushElements.forEach((item) => {
                let pushElement = document.querySelector(item);
                let multiplicator = this.getPushMulitplicator(pushElement);
                multiplicator = multiplicator ? multiplicator + 1 : 1;
                pushElement.style.setProperty('--push-multiplicator', `${multiplicator}`);
            });
        }
        /**
         * Private class methods
         */
        getPushMulitplicator(el) {
            let multiplicator = el.style.getPropertyValue('--push-multiplicator');
            return parseInt(multiplicator);
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
    }

    /**
     * Follower Element module
     */
    class FollowerModule {
        constructor(instance) {
            this.instance = instance;
            this.breakpoints = this.instance.breakpoints;
            this.transitions = this.instance.transitions;
            this.settings = this.instance.settings;
            if (!this.settings.followerElement) {
                return;
            }
            // Set follower initial transitions
            this.instance.on('rendered', () => {
                var _a;
                if (!document.querySelector(this.settings.followerElement)) {
                    console.warn('Cupertino Pane: wrong follower element selector specified', this.settings.followerElement);
                    return;
                }
                this.followerEl = document.querySelector(this.settings.followerElement);
                this.followerEl.style.willChange = 'transform, border-radius';
                this.followerEl.style.transform = `translateY(0px) translateZ(0px)`;
                this.followerEl.style.transition = this.transitions.buildTransitionValue((_a = this.settings.breaks[this.instance.currentBreak()]) === null || _a === void 0 ? void 0 : _a.bounce);
            });
            // Move transition same for follower element (minus pane height)
            this.instance.on('onMoveTransitionStart', (ev) => {
                this.followerEl.style.transition = 'all 0ms linear 0ms';
                this.followerEl.style.transform = `translateY(${ev.translateY - this.breakpoints.breaks[this.settings.initialBreak]}px) translateZ(0px)`;
            });
            // Reset transition same as for pane element
            this.instance.on('onMoveTransitionStart', (ev) => {
                this.followerEl.style.transition = `initial`;
            });
            this.instance.on('onTransitionStart', (ev) => {
                this.followerEl.style.transition = ev.transition;
                this.followerEl.style.transform = `translateY(${ev.translateY.new - this.breakpoints.breaks[this.settings.initialBreak]}px) translateZ(0px)`;
            });
        }
    }

    /**
     * Backdrop module
     */
    class BackdropModule {
        constructor(instance) {
            this.instance = instance;
            /**
             * Touch Move Event
             * @param t
             */
            this.touchMoveBackdropCb = (t) => this.touchMoveBackdrop(t);
            this.settings = this.instance.settings;
            this.events = this.instance.events;
            if (!this.settings.backdrop) {
                return;
            }
            // bind to primary instance
            this.instance['backdrop'] = (conf) => this.backdrop(conf);
            this.instance.on('rendered', () => {
                this.instance.addStyle(`
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
          ${Support.backdropFilter && this.settings.backdropBlur ? `
            backdrop-filter: saturate(180%) blur(10px);
            -webkit-backdrop-filter: saturate(180%) blur(10px);
          ` : ``}
        }
      `);
                if (this.settings.backdrop) {
                    this.renderBackdrop();
                }
            });
            this.instance.on('beforePresentTransition', (ev) => {
                if (!ev.animate) {
                    this.backdropEl.style.display = `block`;
                }
            });
            this.instance.on('onTransitionStart', (ev) => {
                if (!this.settings.backdrop) {
                    return;
                }
                if (this.instance.isHidden()
                    || ev.type === CupertinoTransition.Hide
                    || ev.type === CupertinoTransition.Destroy
                    || ev.type === CupertinoTransition.Present) {
                    this.backdropEl.style.backgroundColor = 'rgba(0,0,0,.0)';
                    this.backdropEl.style.transition = `all ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
                    if (ev.type !== CupertinoTransition.Hide
                        && ev.type !== CupertinoTransition.Destroy) {
                        this.backdropEl.style.display = 'block';
                        setTimeout(() => {
                            this.backdropEl.style.backgroundColor = `rgba(0,0,0, ${this.settings.backdropOpacity})`;
                        }, 50);
                    }
                }
            });
            this.instance.on('onTransitionEnd', (ev) => {
                if (!this.backdropEl) {
                    return;
                }
                if (ev.type === CupertinoTransition.Destroy
                    || ev.type === CupertinoTransition.Hide) {
                    this.backdropEl.style.transition = `initial`;
                    this.backdropEl.style.display = `none`;
                }
            });
            // Stop propagation for touchmove events
            if (Support.touch) {
                // Attach events
                this.instance.on('onDidPresent', () => {
                    var _a;
                    (_a = this.backdropEl) === null || _a === void 0 ? void 0 : _a.addEventListener(this.events.touchEvents.move, this.touchMoveBackdropCb, Support.passiveListener ? { passive: false, capture: false } : false);
                });
                // Detach events
                this.instance.on('onDidDismiss', (ev) => {
                    var _a;
                    (_a = this.backdropEl) === null || _a === void 0 ? void 0 : _a.removeEventListener(this.events.touchEvents.move, this.touchMoveBackdropCb);
                });
            }
        }
        /**
         * Show/Hide backdrop primary function
         */
        backdrop(conf = { show: true }) {
            var _a, _b;
            if (!this.instance.isPanePresented()) {
                console.warn(`Cupertino Pane: Present pane before call backdrop()`);
                return null;
            }
            if (!this.isBackdropPresented()) {
                this.renderBackdrop();
                // Reset events to attach backdrop stop propagation
                if (Support.touch) {
                    (_a = this.backdropEl) === null || _a === void 0 ? void 0 : _a.removeEventListener(this.events.touchEvents.move, this.touchMoveBackdropCb);
                    (_b = this.backdropEl) === null || _b === void 0 ? void 0 : _b.addEventListener(this.events.touchEvents.move, this.touchMoveBackdropCb, Support.passiveListener ? { passive: false, capture: false } : false);
                }
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
        /**
         * Private class methods
         */
        renderBackdrop() {
            this.backdropEl = document.createElement('div');
            this.backdropEl.classList.add('backdrop');
            this.backdropEl.style.transition = `all ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
            this.backdropEl.style.backgroundColor = `rgba(0,0,0, ${this.settings.backdropOpacity})`;
            this.instance.wrapperEl.appendChild(this.backdropEl);
            this.backdropEl.addEventListener('click', (event) => this.instance.emit('onBackdropTap', event));
        }
        isBackdropPresented() {
            return document.querySelector(`.cupertino-pane-wrapper .backdrop`)
                ? true : false;
        }
        touchMoveBackdrop(t) {
            if (this.settings.touchMoveStopPropagation) {
                t.stopPropagation();
            }
        }
    }

    /**
     * FitHeight module
     * fitHeight / fitScreenHeight / maxFitHeight
     */
    class FitHeightModule {
        constructor(instance) {
            this.instance = instance;
            this.calcHeightInProcess = false;
            this.breakpoints = this.instance.breakpoints;
            this.settings = this.instance.settings;
            if (!this.settings.fitHeight) {
                return;
            }
            // bind to primary instance
            // TODO: change binding strategy according to TypeScript
            // E.G. Using public module methods from modules
            this.instance['calcFitHeight'] = (animated) => __awaiter(this, void 0, void 0, function* () { return this.calcFitHeight(animated); });
            this.instance['setOverflowHeight'] = () => this.setOverflowHeight();
            // Class to wrapper
            this.instance.on('DOMElementsReady', () => {
                this.instance.wrapperEl.classList.add('fit-height');
            });
            this.instance.on('onDidPresent', () => {
                this.instance.paneEl.style.height = `unset`;
            });
            this.instance.on('onTransitionEnd', () => {
                this.instance.paneEl.style.height = `unset`;
            });
            // Pass our code into function buildBreakpoints()
            this.instance.on('onWillPresent', () => {
                this.breakpoints.beforeBuildBreakpoints = () => this.beforeBuildBreakpoints();
            });
            // buildBreakpoints() function hook
            this.instance.on('beforeBreakHeightApplied', (ev) => {
                var _a;
                // fitScreenHeight (breaks styles fit screen)
                if (this.settings.fitScreenHeight) {
                    if (((_a = this.settings.breaks[ev.break]) === null || _a === void 0 ? void 0 : _a.height) > this.instance.screen_height) {
                        this.settings.breaks[ev.break].height = this.instance.screen_height - this.settings.bottomOffset;
                    }
                    // Merge breakpoints if not much difference
                    if (this.settings.breaks['top'] && this.settings.breaks['middle']) {
                        if (this.settings.breaks['top'].height - 50 <= this.settings.breaks['middle'].height) {
                            this.settings.breaks['middle'].enabled = false;
                            this.settings.initialBreak = 'top';
                        }
                    }
                }
                // fitHeight (bullet-in styles for screen)
                if (ev.break === 'top') {
                    if (this.settings.breaks['top'].height > this.instance.screen_height) {
                        this.settings.breaks['top'].height = this.instance.screen_height - (this.settings.bottomOffset * 2);
                        this.settings.topperOverflow = true;
                        this.settings.upperThanTop = false;
                    }
                    else {
                        if (this.instance.overflowEl && !this.settings.maxFitHeight) ;
                    }
                }
            }, true);
        }
        beforeBuildBreakpoints() {
            var _a, _b, _c;
            return __awaiter(this, void 0, void 0, function* () {
                this.settings.fitScreenHeight = false;
                this.settings.initialBreak = 'top';
                // this.settings.topperOverflow = false;
                let height = yield this.getPaneFitHeight();
                // maxFitHeight
                if (this.settings.maxFitHeight
                    && height > this.settings.maxFitHeight) {
                    height = this.settings.maxFitHeight;
                    // this.settings.topperOverflow = true;
                }
                this.breakpoints.conf = {
                    top: { enabled: true, height },
                    middle: { enabled: false }
                };
                this.breakpoints.conf.top.bounce = (_b = (_a = this.settings.breaks) === null || _a === void 0 ? void 0 : _a.top) === null || _b === void 0 ? void 0 : _b.bounce;
                this.breakpoints.conf.bottom = ((_c = this.settings.breaks) === null || _c === void 0 ? void 0 : _c.bottom) || { enabled: true, height: 0 };
            });
        }
        calcFitHeight(animated = true) {
            return __awaiter(this, void 0, void 0, function* () {
                // Allow user to call method asap, dont check with this.isPanePresented()
                if (!this.instance.wrapperEl || !this.instance.el) {
                    return null;
                }
                if (this.calcHeightInProcess) {
                    console.warn(`Cupertino Pane: calcFitHeight() already in process`);
                    return null;
                }
                yield this.breakpoints.buildBreakpoints(this.breakpoints.lockedBreakpoints, null, animated);
            });
        }
        setOverflowHeight(offset = 0) {
            if (this.paneElHeight > this.instance.screen_height) {
                this.instance.paneEl.style.height = `${this.instance.getPaneHeight()}px`;
                this.instance.overflowEl.style.height = `${this.instance.getPaneHeight()
                - this.settings.topperOverflowOffset
                - this.instance.overflowEl.offsetTop
                - offset}px`;
            }
        }
        getPaneFitHeight() {
            return __awaiter(this, void 0, void 0, function* () {
                this.calcHeightInProcess = true;
                let images = this.instance.el.querySelectorAll('img');
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
                // Bulletins with image height we get after images render
                let promises = [];
                if (images.length) {
                    promises = Array.from(images).map((image) => new Promise((resolve) => {
                        // Already rendered or passed height attr
                        if (image.height
                            || (image.complete && image.naturalHeight)) {
                            return resolve(true);
                        }
                        image.onload = () => resolve(true);
                        image.onerror = () => resolve(true);
                    }));
                }
                yield Promise.all(promises);
                yield new Promise(resolve => requestAnimationFrame(resolve));
                let newPaneElHeight = Math.floor(this.instance.paneEl.getBoundingClientRect().height);
                /**
                 * To prevent raggy transition on pane icrease/decrease,
                 * we set height before animation transition,
                 * and afrer transition we release height to be 'unset'
                 * for proper calculations in further.
                 *
                 * Only for changes in pane height,
                 * to release `height` on 'onTransitionEnd'.
                 */
                if (this.paneElHeight !== newPaneElHeight) {
                    this.instance.paneEl.style.height = `${(newPaneElHeight <= this.paneElHeight) ? this.paneElHeight : newPaneElHeight}px`;
                }
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
                this.paneElHeight = newPaneElHeight;
                return this.paneElHeight;
            });
        }
    }

    /**
     * Inverse module
     */
    class InverseModule {
        constructor(instance) {
            this.instance = instance;
            this.breakpoints = this.instance.breakpoints;
            this.settings = this.instance.settings;
            this.events = this.instance.events;
            if (!this.settings.inverse) {
                return;
            }
            // Forcely remove
            this.settings.buttonDestroy = false;
            // re-bind functions
            this.instance['getPaneHeight'] = () => this.getPaneHeight();
            this.instance['updateScreenHeights'] = () => this.updateScreenHeights();
            this.instance['setOverflowHeight'] = () => this.settings.fitHeight ? {} : this.setOverflowHeight();
            this.instance['checkOpacityAttr'] = () => { };
            this.instance['checkOverflowAttr'] = (val) => this.checkOverflowAttr(val);
            this.instance['prepareBreaksSwipeNextPoint'] = () => this.prepareBreaksSwipeNextPoint();
            // re-bind events functions
            this.events['handleSuperposition'] = (coords) => this.handleSuperposition(coords);
            this.events['scrollPreventDrag'] = (t) => this.scrollPreventDrag(t);
            this.events['onScroll'] = () => this.onScroll();
            // Class to wrapper
            this.instance.on('DOMElementsReady', () => {
                this.instance.wrapperEl.classList.add('inverse');
            });
            // Styles to elements
            this.instance.on('rendered', () => {
                this.instance.addStyle(`
        .cupertino-pane-wrapper.inverse .pane {
          border-radius: 0 0 20px 20px;
          border-radius: 0 0
                        var(--cupertino-pane-border-radius, 20px) 
                        var(--cupertino-pane-border-radius, 20px);
        }
        .cupertino-pane-wrapper.inverse:not(.fit-height) .pane {
          padding-bottom: 15px; 
        }
        .cupertino-pane-wrapper.inverse .draggable {
          bottom: 0;
          top: initial;
        }
        .cupertino-pane-wrapper.inverse .draggable.over {
          bottom: -30px;
          top: initial;
        }
        .cupertino-pane-wrapper.inverse .move {
          margin-top: 15px;
        }
        .cupertino-pane-wrapper.inverse .draggable.over .move {
          margin-top: -5px;
        }
      `);
            });
            this.instance.on('buildBreakpointsCompleted', () => {
                this.breakpoints.topper = this.breakpoints.bottomer;
                // Re-calc top after setBreakpoints();
                this.instance.paneEl.style.top = `-${this.breakpoints.bottomer - this.settings.bottomOffset}px`;
            });
            this.instance.on('onWillPresent', () => {
                this.breakpoints.beforeBuildBreakpoints = () => this.beforeBuildBreakpoints();
            });
        }
        getPaneHeight() {
            return this.breakpoints.bottomer - this.settings.bottomOffset;
        }
        updateScreenHeights() {
            this.instance.screen_height = window.innerHeight;
            this.instance.screenHeightOffset = 0;
        }
        setOverflowHeight() {
            this.instance.overflowEl.style.height = `${this.getPaneHeight()
            - 30
            - this.settings.topperOverflowOffset
            - this.instance.overflowEl.offsetTop}px`;
        }
        checkOverflowAttr(val) {
            if (!this.settings.topperOverflow
                || !this.instance.overflowEl) {
                return;
            }
            this.instance.overflowEl.style.overflowY = (val >= this.breakpoints.bottomer) ? 'auto' : 'hidden';
        }
        prepareBreaksSwipeNextPoint() {
            let brs = {};
            let settingsBreaks = {};
            brs['top'] = this.breakpoints.breaks['bottom'];
            brs['middle'] = this.breakpoints.breaks['middle'];
            brs['bottom'] = this.breakpoints.breaks['top'];
            settingsBreaks['top'] = Object.assign({}, this.settings.breaks['bottom']);
            settingsBreaks['middle'] = Object.assign({}, this.settings.breaks['middle']);
            settingsBreaks['bottom'] = Object.assign({}, this.settings.breaks['top']);
            return { brs, settingsBreaks };
        }
        /**
         * Topper Than Top
         * Lower Than Bottom
         * Otherwise don't changes
         */
        handleSuperposition(coords) {
            // Inverse gestures
            // Allow drag topper than top point
            if (this.settings.upperThanTop
                && ((coords.newVal >= this.breakpoints.topper)
                    || this.events.startPointOverTop)) {
                // check that finger reach same position before enable normal swipe mode
                if (!this.events.startPointOverTop) {
                    this.events.startPointOverTop = coords.clientY;
                }
                if (this.events.startPointOverTop > coords.clientY) {
                    delete this.events.startPointOverTop;
                }
                const screenDelta = this.instance.screen_height - this.instance.screenHeightOffset;
                const differKoef = (screenDelta - this.instance.getPanelTransformY()) / (screenDelta - this.breakpoints.topper) / 8;
                return { y: this.instance.getPanelTransformY() + (coords.diffY * differKoef) };
            }
            // Disallow drag topper than top point
            if (!this.settings.upperThanTop
                && (coords.newVal >= this.breakpoints.topper)) {
                return { y: this.breakpoints.topper };
            }
        }
        scrollPreventDrag(t) {
            let prevention = false;
            if (this.events.willScrolled()
                && this.isOverflowEl(t.target)) {
                prevention = true;
            }
            return prevention;
        }
        isOverflowEl(el) {
            if (!el) {
                return false;
            }
            let node = el.parentNode;
            while (node != null) {
                if (node == this.instance.overflowEl) {
                    return true;
                }
                node = node.parentNode;
            }
            return false;
        }
        onScroll() {
            return __awaiter(this, void 0, void 0, function* () {
                this.events.isScrolling = true;
            });
        }
        beforeBuildBreakpoints() {
            // Set custom inverse values BEFORE main calculation starts
            ['top', 'middle', 'bottom'].forEach((breakName) => {
                var _a;
                if ((_a = this.settings.breaks[breakName]) === null || _a === void 0 ? void 0 : _a.enabled) {
                    this.breakpoints.breaks[breakName] = 2 * (this.settings.breaks[breakName].height + this.settings.bottomOffset);
                }
            });
        }
    }

    /**
     * Horizontal module
     */
    class HorizontalModule {
        // Force to use settings by module
        static CollectSettings(settings) {
            return settings.horizontal
                ? Object.assign(Object.assign({}, settings), HorizontalModule.forceSettings) : settings;
        }
        constructor(instance) {
            this.instance = instance;
            this.initialBreakX = 'left'; // Default horizontal position
            this.initialBreakY = 'middle'; // Default vertical position
            this.settings = this.instance.settings;
            this.transitions = this.instance.transitions;
            this.events = this.instance.events;
            if (!this.settings.horizontal) {
                return null;
            }
            // Parse combined initialBreak pattern
            this.parseInitialBreak();
            // Override transitions setPaneElTransform
            this.transitions['setPaneElTransform'] = (params) => this.setPaneElTransform(params);
            this.instance.on('beforeBreakHeightApplied', (ev) => {
                this.calcHorizontalBreaks();
            });
            // Override initial positioning
            this.instance.on('beforePresentTransition', () => {
                this.calcHorizontalBreaks();
                this.overrideInitialPositioning();
            });
            // Calculate horizontal breakpoints when needed
            this.instance.on('onTransitionEnd', (ev) => {
                if ((ev.type === 'breakpoint' || ev.type === 'present')
                    && !this.instance.getPanelTransformX()) {
                    this.calcHorizontalBreaks();
                }
            });
            // In case of present({animate: false})
            this.instance.on('onDidPresent', (ev) => {
                if (!ev.animate)
                    this.calcHorizontalBreaks();
            });
            this.instance.on('onDragEnd', (ev) => {
                this.fastSwipeNext = this.events.fastSwipeNext('X');
            });
        }
        parseInitialBreak() {
            const breakParts = this.settings.initialBreak.split(' ');
            if (breakParts.length === 1) {
                // Single break like 'middle' - use for Y, default X to left
                this.initialBreakY = breakParts[0];
                this.initialBreakX = 'left';
            }
            else if (breakParts.length === 2) {
                // Combined break like 'middle right'
                this.initialBreakY = breakParts[0]; // top/middle/bottom
                this.initialBreakX = breakParts[1]; // left/right
            }
            // Validate Y break
            if (!['top', 'middle', 'bottom'].includes(this.initialBreakY)) {
                console.warn(`Cupertino Pane: Invalid Y breakpoint "${this.initialBreakY}", using "middle"`);
                this.initialBreakY = 'middle';
            }
            // Validate X break
            if (!['left', 'right'].includes(this.initialBreakX)) {
                console.warn(`Cupertino Pane: Invalid X breakpoint "${this.initialBreakX}", using "left"`);
                this.initialBreakX = 'left';
            }
        }
        calcHorizontalBreaks() {
            return __awaiter(this, void 0, void 0, function* () {
                const rect = this.instance.paneEl.getBoundingClientRect();
                const paneWidth = rect.width;
                // Calculate the original centered position (not the transformed position)
                // The pane is centered using CSS: margin-left: auto; margin-right: auto
                const originalCenteredLeft = (window.innerWidth - paneWidth) / 2;
                this.defaultRect = {
                    width: paneWidth,
                    left: originalCenteredLeft,
                    right: originalCenteredLeft + paneWidth
                };
                this.horizontalBreaks = {
                    left: -this.defaultRect.left + this.settings.horizontalOffset,
                    right: window.innerWidth - this.defaultRect.left - this.defaultRect.width - this.settings.horizontalOffset
                };
            });
        }
        overrideInitialPositioning() {
            // Get Y position from breakpoints
            const yPosition = this.instance.breakpoints.breaks[this.initialBreakY];
            // Get X position from horizontal breaks  
            const xPosition = this.horizontalBreaks[this.initialBreakX];
            // Check if we're in an animated presentation
            // If so, we should start from the screen height offset for the animation
            const currentTransform = this.instance.paneEl.style.transform;
            const isAnimatedPresent = currentTransform.includes(`${this.instance.screenHeightOffset}px`);
            if (isAnimatedPresent) {
                // For animated presentations, only set X position, keep Y at screen height offset
                this.instance.paneEl.style.transform = `translateX(${xPosition}px) translateY(${this.instance.screenHeightOffset}px) translateZ(0px)`;
            }
            else {
                // For non-animated presentations, set both X and Y to final positions
                this.instance.paneEl.style.transform = `translateX(${xPosition}px) translateY(${yPosition}px) translateZ(0px)`;
            }
            // Update currentBreakpoint to reflect actual position
            this.currentBreakpoint = this.initialBreakX;
            this.instance.breakpoints.currentBreakpoint = yPosition;
        }
        setPaneElTransform(params) {
            let closestY = params.translateY;
            let closestX = params.translateX || this.instance.getPanelTransformX();
            // resize event for x-axis
            if (params.type === 'breakpoint' && !params.translateX) {
                closestX = this.horizontalBreaks[this.currentBreakpoint];
            }
            if (params.type === 'end') {
                // Get closest Y breakpoint (existing logic)
                closestY = this.instance.breakpoints.getClosestBreakY();
                // Get closest X breakpoint
                closestX = this.getClosestBreakX();
                // Handle fast swipe in X direction
                if (this.fastSwipeNext) {
                    if (this.currentBreakpoint === 'left'
                        && this.instance.getPanelTransformX() > this.horizontalBreaks.left) {
                        closestX = this.horizontalBreaks.right;
                    }
                    if (this.currentBreakpoint === 'right'
                        && this.instance.getPanelTransformX() < this.horizontalBreaks.right) {
                        closestX = this.horizontalBreaks.left;
                    }
                }
                // Update current breakpoint
                this.currentBreakpoint = closestX === this.horizontalBreaks.left ? 'left' : 'right';
                this.instance.breakpoints.currentBreakpoint = closestY;
            }
            // Apply combined transform
            this.instance.paneEl.style.transform = `translateX(${closestX || 0}px) translateY(${closestY || 0}px) translateZ(0px)`;
        }
        getClosestBreakX() {
            const currentX = this.instance.getPanelTransformX();
            return Math.abs(this.horizontalBreaks.left - currentX) < Math.abs(this.horizontalBreaks.right - currentX)
                ? this.horizontalBreaks.left
                : this.horizontalBreaks.right;
        }
        // Public method to move to specific horizontal break
        moveToHorizontalBreak(breakX) {
            if (!this.horizontalBreaks) {
                this.calcHorizontalBreaks();
            }
            const currentY = this.instance.getPanelTransformY();
            const targetX = this.horizontalBreaks[breakX];
            this.instance.paneEl.style.transform = `translateX(${targetX}px) translateY(${currentY}px) translateZ(0px)`;
            this.currentBreakpoint = breakX;
        }
        // Get current horizontal breakpoint
        getCurrentHorizontalBreak() {
            return this.currentBreakpoint;
        }
    }
    HorizontalModule.forceSettings = {
        touchAngle: null
    };

    /**
     * Modal module
     */
    class ModalModule {
        // Force to use settings by module
        static CollectSettings(settings) {
            return settings.modal
                ? Object.assign(Object.assign({}, settings), ModalModule.ForceSettings) : settings;
        }
        constructor(instance) {
            this.instance = instance;
            this.modalDefaults = {
                transition: 'fade',
                flying: false,
                dismissOnIntense: false
            };
            this.settings = this.instance.settings;
            this.events = this.instance.events;
            this.breakpoints = this.instance.breakpoints;
            this.transitions = this.instance.transitions;
            if (!this.settings.modal) {
                return;
            }
            // set defaults
            this.settings.modal = (typeof this.settings.modal === "object")
                ? Object.assign(Object.assign({}, this.modalDefaults), this.settings.modal) : this.modalDefaults;
            // ehance + re-bind functions (+ get rid of recursion)
            this.instance['customPresent'] = this.instance['present'];
            this.instance['present'] = (conf) => this.present(conf);
            this.instance['customDestroy'] = this.instance['destroy'];
            this.instance['destroy'] = (conf) => this.destroy(conf);
            // re-bind functions
            this.events['handleSuperposition'] = (coords) => this.handleSuperposition(coords);
            this.transitions['setPaneElTransform'] = (params) => this.setPaneElTransform(params);
            // Hooks
            this.instance.on('beforeBreakHeightApplied', (ev) => {
                if (ev.break === 'top') {
                    this.settings.breaks['top'].height -= this.settings.bottomOffset * 2;
                    this.settings.breaks['top'].height += (this.instance.screen_height - this.settings.breaks['top'].height) / 2;
                }
                if (ev.break === 'bottom') {
                    this.settings.breaks['bottom'] = { enabled: false };
                }
                this.instance.addStyle(`
        .cupertino-pane-wrapper .pane {
          transform-origin: center ${this.breakpoints.breaks[this.settings.initialBreak]}px
        }
      `);
            });
            this.instance.on('rendered', () => {
                this.instance.addStyle(`
        .cupertino-pane-wrapper .pane {
          border-radius: var(--cupertino-pane-border-radius, 20px) 
                         var(--cupertino-pane-border-radius, 20px)
                         var(--cupertino-pane-border-radius, 20px)
                         var(--cupertino-pane-border-radius, 20px);
          width: calc(100% - 16px) !important;
          margin: auto;
        }
        .cupertino-pane-wrapper .pane.modal-flying {
          animation: modalFlyingX 2000ms ease-in-out infinite alternate,
                     modalFlyingY 3000ms ease-in-out infinite alternate;
        }
        @keyframes modalFlyingX {
          0% { left: -10px; }
          100% { left: 10px; }
        }
        @keyframes modalFlyingY {
          0% { top: -10px; }
          100% { top: 0px; }
        }
      `);
                if (this.settings.modal['flying']) {
                    this.instance.paneEl.classList.add('modal-flying');
                }
                if (this.settings.modal['dismissOnIntense']) {
                    this.instance.enableDrag();
                }
            });
        }
        setPaneElTransform(params) {
            let closest = params.type === 'end' ? 0 : params.translateX;
            this.instance.paneEl.style.transform = `translateX(${closest || 0}px) translateY(${params.translateY}px) translateZ(0px)`;
        }
        /**
         * Private class methods
         */
        // Enhance with animation
        present(conf) {
            let { transition } = conf;
            if (!transition) {
                transition = ModalModule.BuildInTransition[this.settings.modal['transition']];
            }
            return this.instance['customPresent'](Object.assign(Object.assign({}, conf), { transition }));
        }
        // Enhance with animation
        destroy(conf) {
            let { transition } = conf;
            if (!transition) {
                transition = JSON.parse(JSON.stringify({
                    duration: ModalModule.BuildInTransition[this.settings.modal['transition']].duration,
                    from: ModalModule.BuildInTransition[this.settings.modal['transition']].to,
                    to: ModalModule.BuildInTransition[this.settings.modal['transition']].from
                }));
            }
            if (conf.fromCurrentPosition) {
                let computedTranslate = new WebKitCSSMatrix(window.getComputedStyle(this.instance.paneEl).transform);
                transition.to.transform = `translateY(${computedTranslate.m42}px) translateX(${computedTranslate.m41}px) translateZ(0px)`;
            }
            return this.instance['customDestroy'](Object.assign(Object.assign({}, conf), { transition }));
        }
        handleSuperposition(coords) {
            // dismissOnIntense 
            let intenseKoeff = 40;
            let differY = Math.abs(this.instance.getPanelTransformY() - this.breakpoints.topper);
            let differX = Math.abs(this.instance.getPanelTransformX());
            if (this.settings.modal['dismissOnIntense']
                && (differY > intenseKoeff || differX > intenseKoeff - 10)) {
                this.instance.disableDrag();
                this.destroy({ animate: true, fromCurrentPosition: true });
                return false;
            }
            // calc new-pos
            let hardness = 8;
            const differKoefY = this.instance.getPanelTransformY() / this.breakpoints.topper / hardness;
            const differKoefX = this.instance.getPanelTransformX() / this.breakpoints.topper / hardness;
            return {
                y: this.instance.getPanelTransformY() + (coords.diffY * (differKoefY + differKoefX)),
                x: this.instance.getPanelTransformX() + (coords.diffX * (differKoefY + differKoefX))
            };
        }
    }
    ModalModule.BuildInTransition = {
        fade: {
            duration: 300,
            from: {
                opacity: 0
            },
            to: {
                opacity: 1
            },
        },
        zoom: {
            duration: 300,
            from: {
                opacity: 0,
                scale: 0.5
            },
            to: {
                opacity: 1,
                scale: 1
            },
        }
    };
    ModalModule.ForceSettings = {
        fitHeight: true,
        touchAngle: null,
        showDraggable: false
    };

    const Modules = { ZStackModule: ZStackModule, FollowerModule: FollowerModule, BackdropModule: BackdropModule, FitHeightModule: FitHeightModule, InverseModule: InverseModule, HorizontalModule: HorizontalModule, ModalModule: ModalModule };
    class CupertinoPane {
        constructor(selector, conf = {}) {
            this.selector = selector;
            this.disableDragEvents = false;
            this.preventDismissEvent = false;
            this.preventedDismiss = false;
            this.rendered = false;
            this.settings = (new Settings()).instance;
            this.device = new Device();
            this.modules = {};
            // Events emitter
            this.eventsListeners = {};
            this.on = on;
            this.emit = emit;
            // Temporary: modules public functions
            // should be moved under modules completely
            this.calcFitHeight = () => {
                if (!this.settings.fitHeight) {
                    console.warn(`Cupertino Pane: calcFitHeight() should be used for auto-height panes with enabled fitHeight option`);
                    return null;
                }
            };
            this.swipeNextPoint = (diff, maxDiff, closest) => {
                let { brs, settingsBreaks } = this.prepareBreaksSwipeNextPoint();
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
            // Get modules and collect settings 
            let allModules = Object.keys(Modules).map((key) => Modules[key]);
            let modules = this.settings.modules || allModules;
            modules.forEach((module) => !!module.CollectSettings ? this.settings = module.CollectSettings(this.settings) : null);
            // Parent el as string or HTMLelement or get default element method
            let parentElement = this.el.parentElement;
            if (this.settings.parentElement) {
                parentElement = this.settings.parentElement instanceof HTMLElement
                    ? this.settings.parentElement
                    : document.querySelector(this.settings.parentElement);
            }
            this.settings.parentElement = parentElement;
            // Ion-content element
            if (this.device.ionic) {
                this.ionContent = document.querySelector('ion-content');
                this.ionApp = document.querySelector('ion-app');
            }
            // Events listeners
            if (this.settings.events) {
                Object.keys(this.settings.events).forEach(name => this.on(name, this.settings.events[name]));
            }
            // Core classes - Order matters! ResizeEvents needs to be before Events
            this.breakpoints = new Breakpoints(this);
            this.transitions = new Transitions(this);
            this.keyboardEvents = new KeyboardEvents(this);
            this.resizeEvents = new ResizeEvents(this);
            this.events = new Events(this);
            // Install modules
            modules.forEach((module) => this.modules[this.getModuleRef(module.name)] = new module(this));
        }
        drawBaseElements() {
            // Style element on head
            this.styleEl = document.createElement('style');
            this.styleEl.id = `cupertino-pane-${(Math.random() + 1).toString(36).substring(7)}`;
            // Parent
            this.parentEl = this.settings.parentElement;
            // Wrapper
            this.wrapperEl = document.createElement('div');
            this.wrapperEl.classList.add('cupertino-pane-wrapper');
            if (this.settings.cssClass) {
                this.settings.cssClass.split(' ')
                    .filter(item => !!item)
                    .forEach(item => this.wrapperEl.classList.add(item));
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
        -webkit-user-select: none;
      }
      .cupertino-pane-wrapper .pane img {
        -webkit-user-drag: none;
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
        z-index: -1;
        top: 0;
        bottom: initial;
      }
      .cupertino-pane-wrapper .draggable.over {
        top: -30px;
        padding: 15px;
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
    `;
            // Destroy button
            this.destroyButtonEl = document.createElement('div');
            this.destroyButtonEl.classList.add('destroy-button');
            internalStyles += `
      .cupertino-pane-wrapper .destroy-button {
        width: 26px;
        height: 26px;
        cursor: pointer;
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
            // Inject internal CSS
            this.styleEl.textContent = internalStyles.replace(/\s\s+/g, ' ');
            document.head.prepend(this.styleEl);
            // inject DOM
            this.parentEl.appendChild(this.wrapperEl);
            this.wrapperEl.appendChild(this.paneEl);
            this.paneEl.appendChild(this.contentEl);
            if (this.settings.showDraggable) {
                this.paneEl.appendChild(this.draggableEl);
                this.draggableEl.appendChild(this.moveEl);
            }
            // System event
            this.emit('DOMElementsReady');
        }
        present(conf = { animate: false }) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.el || !document.body.contains(this.el)) {
                    console.warn('Cupertino Pane: specified DOM element must be attached to the DOM');
                    return;
                }
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
                /**
                 * Deal with Ionic Framework
                 * Ionic cancel transition if the app is not ready
                 * https://github.com/tech-systems/panes/issues/216
                 * Good to get rid of that, but Ionic team seems not
                 * have a solution for this
                 * https://github.com/ionic-team/ionic-framework/issues/27984
                 */
                if (conf.animate && this.device.ionic) {
                    // Ionic/React removed componentOnReady ???
                    if (this.ionApp['componentOnReady']) {
                        yield this.ionApp['componentOnReady']();
                    }
                    yield new Promise(resolve => requestAnimationFrame(resolve));
                }
                // Emit event
                this.emit('onWillPresent');
                this.updateScreenHeights();
                this.drawBaseElements();
                yield this.setBreakpoints();
                /**
                 * Custom transitions for present/destroy functions
                 * + Fix mutations on arguments
                 */
                let customTransitionFrom = ((_a = conf === null || conf === void 0 ? void 0 : conf.transition) === null || _a === void 0 ? void 0 : _a.from)
                    ? JSON.parse(JSON.stringify(conf.transition.from)) : null;
                if (customTransitionFrom) {
                    if (!customTransitionFrom.transform) {
                        customTransitionFrom.transform = `translateY(${this.breakpoints.breaks[this.settings.initialBreak]}px) translateZ(0px)`;
                    }
                    Object.assign(this.paneEl.style, customTransitionFrom);
                }
                // Show elements
                this.wrapperEl.style.display = 'block';
                this.contentEl.style.display = 'block';
                this.wrapperEl.classList.add('rendered');
                this.rendered = true;
                // Init scroll (for some render DOM reasons important keep here for init)
                this.scrollElementInit();
                // System event
                this.emit('rendered');
                // Cursor
                this.setGrabCursor(true);
                // Button destroy
                if (this.settings.buttonDestroy) {
                    this.paneEl.appendChild(this.destroyButtonEl);
                    this.destroyButtonEl.addEventListener('click', (t) => this.destroy({ animate: true, destroyButton: true }));
                    this.destroyButtonEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M278.6 256l68.2-68.2c6.2-6.2 6.2-16.4 0-22.6-6.2-6.2-16.4-6.2-22.6 0L256 233.4l-68.2-68.2c-6.2-6.2-16.4-6.2-22.6 0-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3l68.2 68.2-68.2 68.2c-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3 6.2 6.2 16.4 6.2 22.6 0l68.2-68.2 68.2 68.2c6.2 6.2 16.4 6.2 22.6 0 6.2-6.2 6.2-16.4 0-22.6L278.6 256z"/>
        </svg>`;
                }
                // disable ion-content scroll-y
                if (this.device.ionic
                    && !this.settings.ionContentScroll) {
                    this.ionContent.setAttribute('scroll-y', 'false');
                }
                if (this.settings.bottomClose) {
                    this.settings.breaks.bottom.enabled = true;
                }
                if (this.settings.freeMode) {
                    this.settings.lowerThanBottom = false;
                }
                /****** Fix android issues *******/
                if (this.device.android) {
                    // Body patch prevent android pull-to-refresh
                    document.body.style['overscrollBehaviorY'] = 'none';
                }
                // System event
                this.emit('beforePresentTransition', { animate: conf.animate });
                // One frame before transition
                yield new Promise(resolve => requestAnimationFrame(resolve));
                if (conf.animate) {
                    yield this.transitions.doTransition({
                        type: 'present', conf,
                        translateY: this.breakpoints.breaks[this.settings.initialBreak]
                    });
                }
                else {
                    this.breakpoints.prevBreakpoint = this.settings.initialBreak;
                    this.paneEl.style.transform = `translateY(${this.breakpoints.breaks[this.settings.initialBreak]}px) translateZ(0px)`;
                }
                /****** Attach Events *******/
                this.events.attachAllEvents();
                // Emit event
                this.emit('onDidPresent', { animate: conf.animate });
                return this;
            });
        }
        getPaneHeight() {
            return this.screen_height - this.breakpoints.topper - this.settings.bottomOffset;
        }
        updateScreenHeights() {
            this.screen_height = window.innerHeight;
            this.screenHeightOffset = window.innerHeight;
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
            this.overflowEl.style.overscrollBehavior = 'none';
            this.setOverflowHeight();
        }
        setOverflowHeight(offset = 0) {
            this.paneEl.style.height = `${this.getPaneHeight()}px`;
            this.overflowEl.style.height = `${this.getPaneHeight()
            - this.settings.topperOverflowOffset
            - this.overflowEl.offsetTop
            - offset}px`;
        }
        checkOpacityAttr(val) {
            let attrElements = this.el.querySelectorAll('[hide-on-bottom]');
            if (!attrElements.length)
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
            this.overflowEl.style.overflowY = (val <= this.breakpoints.topper) ? 'auto' : 'hidden';
        }
        // TODO: replace with body.contains()
        isPanePresented() {
            // Check through all presented panes
            let wrappers = Array.from(document.querySelectorAll(`.cupertino-pane-wrapper.rendered`));
            if (!wrappers.length)
                return false;
            return wrappers.find((item) => item.contains(this.selector)) ? true : false;
        }
        prepareBreaksSwipeNextPoint() {
            return {
                brs: Object.assign({}, this.breakpoints.breaks),
                settingsBreaks: Object.assign({}, this.settings.breaks)
            };
        }
        /**
         * Utility function to add minified internal CSS to head.
         * @param {string} styleString
         */
        addStyle(styleString) {
            this.styleEl.textContent += styleString.replace(/\s\s+/g, ' ');
        }
        ;
        getModuleRef(className) {
            return (className.charAt(0).toLowerCase() + className.slice(1)).replace('Module', '');
        }
        /************************************
         * Public user methods
         */
        getPanelTransformY() {
            const translateYRegex = /\.*translateY\((.*)px\)/i;
            return parseFloat(translateYRegex.exec(this.paneEl.style.transform)[1]);
        }
        // TODO: merge to 1 function above
        getPanelTransformX() {
            const translateYRegex = /\.*translateX\((.*)px\)/i;
            let translateExec = translateYRegex.exec(this.paneEl.style.transform);
            return translateExec ? parseFloat(translateExec[1]) : 0;
        }
        /**
         * Prevent dismiss event
         */
        preventDismiss(val = false) {
            this.preventDismissEvent = val;
        }
        /**
         * GrabCursor for desktop
         */
        setGrabCursor(enable, moving) {
            if (!this.device.desktop) {
                return;
            }
            this.paneEl.style.cursor = enable ? (moving ? 'grabbing' : 'grab') : '';
        }
        /**
         * Disable pane drag events
         */
        disableDrag() {
            this.disableDragEvents = true;
            this.setGrabCursor(false);
        }
        /**
         * Enable pane drag events
         */
        enableDrag() {
            this.disableDragEvents = false;
            this.setGrabCursor(true);
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
        moveToBreak(val, type = 'breakpoint') {
            return __awaiter(this, void 0, void 0, function* () {
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
                yield this.transitions.doTransition({ type, translateY: this.breakpoints.breaks[val] });
                this.breakpoints.currentBreakpoint = this.breakpoints.breaks[val];
                return Promise.resolve(true);
            });
        }
        moveToHeight(val) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.isPanePresented()) {
                    console.warn(`Cupertino Pane: Present pane before call moveToHeight()`);
                    return null;
                }
                let translateY = this.screenHeightOffset ? this.screen_height - val : val;
                this.checkOpacityAttr(translateY);
                yield this.transitions.doTransition({ type: 'breakpoint', translateY });
            });
        }
        hide() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.isPanePresented()) {
                    console.warn(`Cupertino Pane: Present pane before call hide()`);
                    return null;
                }
                if (this.isHidden()) {
                    console.warn(`Cupertino Pane: Pane already hidden`);
                    return null;
                }
                yield this.transitions.doTransition({ type: 'hide', translateY: this.screenHeightOffset });
            });
        }
        isHidden() {
            if (!this.isPanePresented()) {
                console.warn(`Cupertino Pane: Present pane before call isHidden()`);
                return null;
            }
            return this.transitions.isPaneHidden;
        }
        currentBreak() {
            if (!this.isPanePresented()) {
                console.warn(`Cupertino Pane: Present pane before call currentBreak()`);
                return null;
            }
            return this.breakpoints.getCurrentBreakName();
        }
        ;
        destroy(conf = {
            animate: false,
            destroyButton: false
        }) {
            return __awaiter(this, void 0, void 0, function* () {
                // Experimentally allow to destroy, even if not currently in DOM,
                // instead of this.isPanePresented() check with rendered (#163 issue)
                if (!this.rendered) {
                    console.warn(`Cupertino Pane: Present pane before call destroy()`);
                    return null;
                }
                // Prevent dismiss
                if (this.preventDismissEvent) {
                    // Emit event with prevent dismiss if not already sent from drag event
                    if (!this.preventedDismiss) {
                        this.emit('onWillDismiss', { prevented: true });
                        this.moveToBreak(this.breakpoints.prevBreakpoint);
                    }
                    return;
                }
                // Emit event
                this.emit('onWillDismiss');
                /****** Animation & Transition ******/
                if (conf.animate) {
                    yield this.transitions.doTransition({
                        type: 'destroy', conf,
                        translateY: this.screenHeightOffset,
                        destroyButton: conf.destroyButton
                    });
                }
                else {
                    this.destroyResets();
                }
                // Emit event
                this.emit('onDidDismiss', { destroyButton: conf.destroyButton });
            });
        }
        destroyResets() {
            this.keyboardEvents.fixBodyKeyboardResize(false);
            this.parentEl.appendChild(this.contentEl);
            this.wrapperEl.remove();
            this.styleEl.remove();
            /****** Detach Events *******/
            this.events.detachAllEvents();
            // Reset vars
            delete this.rendered;
            delete this.breakpoints.prevBreakpoint;
            // Reset styles
            this.contentEl.style.display = 'none';
        }
    }

    return CupertinoPane;

}));

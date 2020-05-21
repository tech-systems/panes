/**
 * Cupertino Pane 1.1.52
 * Multiplatform slide-over pane
 * https://github.com/roman-rr/cupertino-pane/
 *
 * Copyright 2019-2020 Roman Antonov (roman-rr)
 *
 * Released under the MIT License
 *
 * Released on: May 21, 2020
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class Support {
    static get touch() {
        return (window['Modernizr'] && window['Modernizr'].touch === true) || (function checkTouch() {
            return !!((window.navigator.maxTouchPoints > 0) || ('ontouchstart' in window) || (window['DocumentTouch'] && document instanceof window['DocumentTouch']));
        }());
    }
    static get observer() {
        return ('MutationObserver' in window || 'WebkitMutationObserver' in window);
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
    static pointerEvents() {
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

class CupertinoPane {
    constructor(selector, conf = {}) {
        this.selector = selector;
        this.settings = {
            initialBreak: 'middle',
            parentElement: null,
            followerElement: null,
            backdrop: false,
            backdropOpacity: 0.4,
            animationType: 'ease',
            animationDuration: 300,
            darkMode: false,
            bottomClose: false,
            freeMode: false,
            buttonClose: true,
            topperOverflow: true,
            topperOverflowOffset: 0,
            showDraggable: true,
            draggableOver: false,
            draggableTranslucent: false,
            clickBottomOpen: true,
            dragByCursor: false,
            simulateTouch: true,
            passiveListeners: true,
            breaks: {},
            onDidDismiss: () => { },
            onWillDismiss: () => { },
            onDidPresent: () => { },
            onWillPresent: () => { },
            onDragStart: () => { },
            onDrag: () => { },
            onDragEnd: () => { },
            onBackdropTap: () => { },
            onTransitionEnd: () => { }
        };
        this.defaultBreaksConf = {
            top: { enabled: true, offset: window.innerHeight - (135 * 0.35) },
            middle: { enabled: true, offset: 300 },
            bottom: { enabled: true, offset: 100 },
        };
        this.screen_height = window.innerHeight;
        this.steps = [];
        this.pointerDown = false;
        this.disableDragEvents = false;
        this.breaks = {};
        this.brs = [];
        this.device = new Device();
        this.swipeNextPoint = (diff, maxDiff, closest) => {
            if (this.currentBreakpoint === this.breaks['top']) {
                if (diff > maxDiff) {
                    if (this.settings.breaks['middle'].enabled) {
                        return this.breaks['middle'];
                    }
                    if (this.settings.breaks['bottom'].enabled) {
                        if (this.breaks['middle'] < closest) {
                            return closest;
                        }
                        return this.breaks['bottom'];
                    }
                }
                return this.breaks['top'];
            }
            if (this.currentBreakpoint === this.breaks['middle']) {
                if (diff < -maxDiff) {
                    if (this.settings.breaks['top'].enabled) {
                        return this.breaks['top'];
                    }
                }
                if (diff > maxDiff) {
                    if (this.settings.breaks['bottom'].enabled) {
                        return this.breaks['bottom'];
                    }
                }
                return this.breaks['middle'];
            }
            if (this.currentBreakpoint === this.breaks['bottom']) {
                if (diff < -maxDiff) {
                    if (this.settings.breaks['middle'].enabled) {
                        if (this.breaks['middle'] > closest) {
                            return closest;
                        }
                        return this.breaks['middle'];
                    }
                    if (this.settings.breaks['top'].enabled) {
                        return this.breaks['top'];
                    }
                }
                return this.breaks['bottom'];
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
        // Unable attach DOM element
        if (!document.querySelector(this.selector)) {
            console.warn('Cupertino Pane: wrong selector specified', this.selector);
            return;
        }
        // Pane already was rendered
        if (this.isPanePresented()) {
            console.warn('Cupertino Pane: specified selector already in use', this.selector);
            return;
        }
        this.el = document.querySelector(this.selector);
        this.el.style.display = 'none';
        this.settings = Object.assign(Object.assign({}, this.settings), conf);
        if (this.settings.parentElement) {
            this.settings.parentElement = document.querySelector(this.settings.parentElement);
        }
        else {
            this.settings.parentElement = this.el.parentElement;
        }
    }
    drawElements() {
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
        this.paneEl.style.paddingTop = '15px';
        this.paneEl.style.width = '100%';
        this.paneEl.style.height = '100%';
        this.paneEl.style.background = '#ffffff';
        this.paneEl.style.borderTopLeftRadius = '20px';
        this.paneEl.style.borderTopRightRadius = '20px';
        this.paneEl.style.boxShadow = '0 4px 16px rgba(0,0,0,.12)';
        this.paneEl.style.overflow = 'hidden';
        this.paneEl.style.willChange = 'transform';
        this.paneEl.style.transform = `translateY(${this.breaks[this.settings.initialBreak]}px) translateZ(0px)`;
        // Draggable
        this.draggableEl = document.createElement('div');
        this.draggableEl.className = 'draggable';
        this.draggableEl.style.padding = '5px';
        this.draggableEl.style.position = 'absolute';
        this.draggableEl.style.top = '0';
        this.draggableEl.style.left = '0';
        this.draggableEl.style.right = '0';
        this.draggableEl.style.marginLeft = 'auto';
        this.draggableEl.style.marginRight = 'auto';
        this.draggableEl.style.height = '30px';
        // Move
        this.moveEl = document.createElement('div');
        this.moveEl.className = 'move';
        this.moveEl.style.margin = '0 auto';
        this.moveEl.style.height = '5px';
        this.moveEl.style.background = '#c0c0c0';
        this.moveEl.style.width = '36px';
        this.moveEl.style.borderRadius = '4px';
        // Content
        this.contentEl = this.el;
        this.contentEl.style.display = '';
        this.contentEl.style.transition = `opacity ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
        this.contentEl.style.overflowX = 'hidden';
        // Backdrop
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
        // Close button
        this.closeEl = document.createElement('div');
        this.closeEl.className = 'close-button';
        this.closeEl.style.width = '26px';
        this.closeEl.style.height = '26px';
        this.closeEl.style.position = 'absolute';
        this.closeEl.style.background = '#ebebeb';
        this.closeEl.style.top = '16px';
        this.closeEl.style.right = '20px';
        this.closeEl.style.borderRadius = '100%';
    }
    present(conf = { animate: false }) {
        if (!this.el)
            return;
        // Pane already was rendered
        if (this.isPanePresented()) {
            this.moveToBreak(this.settings.initialBreak);
            return;
        }
        // Emit event
        this.settings.onWillPresent();
        this.breaks = {
            top: this.screen_height,
            middle: this.screen_height,
            bottom: this.screen_height
        };
        ['top', 'middle', 'bottom'].forEach((val) => {
            // Set default if no exist
            if (!this.settings.breaks[val]) {
                this.settings.breaks[val] = this.defaultBreaksConf[val];
            }
            // Add offsets
            if (this.settings.breaks[val]
                && this.settings.breaks[val].enabled
                && this.settings.breaks[val].offset) {
                this.breaks[val] -= this.settings.breaks[val].offset;
            }
        });
        // Warnings 
        if (!this.settings.breaks[this.settings.initialBreak].enabled) {
            console.warn('Cupertino Pane: Please set initialBreak for enabled breakpoint');
        }
        if (this.settings.breaks['middle'].offset >= this.settings.breaks['top'].offset) {
            console.warn('Cupertino Pane: Please set middle offset lower than top offset');
        }
        if (this.settings.breaks['middle'].offset <= this.settings.breaks['bottom'].offset) {
            console.warn('Cupertino Pane: Please set bottom offset lower than middle offset');
        }
        this.currentBreakpoint = this.breaks[this.settings.initialBreak];
        this.drawElements();
        this.parentEl.appendChild(this.wrapperEl);
        this.wrapperEl.appendChild(this.paneEl);
        this.paneEl.appendChild(this.draggableEl);
        this.paneEl.appendChild(this.contentEl);
        this.draggableEl.appendChild(this.moveEl);
        if (this.settings.followerElement) {
            if (!document.querySelector(this.settings.followerElement)) {
                console.warn('Cupertino Pane: wrong follower element selector specified', this.settings.followerElement);
                return;
            }
            this.followerEl = document.querySelector(this.settings.followerElement);
            this.followerEl.style.willChange = 'transform';
            this.followerEl.style.transform = `translateY(0px) translateZ(0px)`;
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
        }
        // Draggable translucent style
        if (this.settings.draggableTranslucent) {
            this.draggableEl.querySelector('.move').style.background = 'rgba(228, 228, 228, 0.6)';
            this.draggableEl.querySelector('.move').classList.add('move-translucent');
            let draggableStyle = document.createElement('style');
            draggableStyle.innerHTML = ".move-translucent{backdrop-filter:blur(6px)}";
            document.body.appendChild(draggableStyle);
        }
        if (this.settings.darkMode) {
            this.paneEl.style.background = '#1c1c1d';
            this.paneEl.style.color = '#ffffff';
            this.moveEl.style.background = '#5a5a5e';
        }
        if (this.settings.buttonClose) {
            this.paneEl.appendChild(this.closeEl);
            this.closeEl.addEventListener('click', (t) => this.destroy({ animate: true }));
            let iconColor = '#7a7a7e';
            if (this.settings.darkMode) {
                this.closeEl.style.background = '#424246';
                iconColor = '#a8a7ae';
            }
            this.closeEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path fill="${iconColor}" d="M278.6 256l68.2-68.2c6.2-6.2 6.2-16.4 0-22.6-6.2-6.2-16.4-6.2-22.6 0L256 233.4l-68.2-68.2c-6.2-6.2-16.4-6.2-22.6 0-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3l68.2 68.2-68.2 68.2c-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3 6.2 6.2 16.4 6.2 22.6 0l68.2-68.2 68.2 68.2c6.2 6.2 16.4 6.2 22.6 0 6.2-6.2 6.2-16.4 0-22.6L278.6 256z"/>
        </svg>`;
        }
        if (this.settings.bottomClose) {
            this.settings.breaks.bottom.enabled = true;
        }
        if (this.settings.backdrop) {
            this.wrapperEl.appendChild(this.backdropEl);
            this.backdropEl.style.display = 'block';
            this.backdropEl.addEventListener('click', (t) => this.settings.onBackdropTap());
        }
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
        // Get overflow element
        let attrElements = document.querySelectorAll(`${this.selector} [overflow-y]`);
        if (!attrElements.length || attrElements.length > 1) {
            this.overflowEl = this.contentEl;
        }
        else {
            this.overflowEl = attrElements[0];
        }
        this.overflowEl.style.height = `${this.screen_height
            - this.breaks['top'] - 51
            + (this.settings.draggableOver ? 30 : 0)
            - this.settings.topperOverflowOffset}px`;
        this.checkOpacityAttr(this.currentBreakpoint);
        this.checkOverflowAttr(this.currentBreakpoint);
        /****** Attach Events *******/
        this.attachEvents();
        /****** Animation & Transition ******/
        if (conf.animate) {
            this.doTransition({ type: 'present', translateY: this.breaks[this.settings.initialBreak] });
        }
        else {
            // Emit event
            this.settings.onDidPresent();
        }
    }
    checkOpacityAttr(val) {
        let attrElements = document.querySelectorAll(`${this.selector} [hide-on-bottom]`);
        if (!attrElements.length)
            return;
        attrElements.forEach((item) => {
            item.style.transition = `opacity ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
            item.style.opacity = (val >= this.breaks['bottom']) ? '0' : '1';
        });
    }
    checkOverflowAttr(val) {
        if (!this.settings.topperOverflow)
            return;
        this.overflowEl.style.overflowY = (val <= this.topper) ? 'auto' : 'hidden';
    }
    isPanePresented() {
        return document.querySelector(`.cupertino-pane-wrapper ${this.selector}`)
            ? true : false;
    }
    /**
     * Touch Start Event
     * @param t
     */
    touchStart(t) {
        // Event emitter
        this.settings.onDragStart(t);
        if (this.disableDragEvents)
            return;
        const targetTouch = t.type === 'touchstart' && t.targetTouches && (t.targetTouches[0] || t.changedTouches[0]);
        const screenY = t.type === 'touchstart' ? targetTouch.screenY : t.screenY;
        if (t.type === 'pointerdown')
            this.pointerDown = true;
        this.startP = screenY;
        this.steps.push(this.startP);
    }
    /**
     * Touch Move Event
     * @param t
     */
    touchMove(t) {
        // Event emitter
        this.settings.onDrag(t);
        if (this.disableDragEvents)
            return;
        // Handle desktop/mobile events
        const targetTouch = t.type === 'touchmove' && t.targetTouches && (t.targetTouches[0] || t.changedTouches[0]);
        const screenY = t.type === 'touchmove' ? targetTouch.screenY : t.screenY;
        if (t.type === 'pointermove' && !this.pointerDown)
            return;
        // Delta
        const n = screenY;
        const diff = n - this.steps[this.steps.length - 1];
        const newVal = this.getPanelTransformY + diff;
        // Not allow move panel with positive overflow scroll
        if (this.overflowEl.style.overflowY === 'auto') {
            this.overflowEl.addEventListener('scroll', (s) => {
                this.contentScrollTop = s.target.scrollTop;
            });
            if ((newVal > this.topper && this.contentScrollTop > 0)
                || (newVal <= this.topper)) {
                return;
            }
        }
        // Not allow drag upper than topper point
        // Not allow drag lower than bottom if free mode
        if ((newVal <= this.topper)
            || (this.settings.freeMode && !this.settings.bottomClose && (newVal >= this.bottomer))) {
            return;
        }
        this.checkOpacityAttr(newVal);
        this.checkOverflowAttr(newVal);
        this.doTransition({ type: 'move', translateY: newVal });
        this.steps.push(n);
    }
    /**
     * Touch End Event
     * @param t
     */
    touchEnd(t) {
        // Event emitter
        this.settings.onDragEnd(t);
        if (this.disableDragEvents)
            return;
        const targetTouch = t.type === 'touchmove' && t.targetTouches && (t.targetTouches[0] || t.changedTouches[0]);
        const screenY = t.type === 'touchmove' ? targetTouch.screenY : t.screenY;
        if (t.type === 'pointerup')
            this.pointerDown = false;
        // Determinate nearest point
        let closest = this.brs.reduce((prev, curr) => {
            return (Math.abs(curr - this.getPanelTransformY) < Math.abs(prev - this.getPanelTransformY) ? curr : prev);
        });
        // Swipe - next (if differ > 10)
        const diff = this.steps[this.steps.length - 1] - this.steps[this.steps.length - 2];
        // Set sensivity lower for web
        const swipeNextSensivity = window.hasOwnProperty('cordova') ? 4 : 3;
        if (Math.abs(diff) >= swipeNextSensivity) {
            closest = this.swipeNextPoint(diff, swipeNextSensivity, closest);
        }
        // Click to bottom - open middle
        if (this.settings.clickBottomOpen) {
            if (this.currentBreakpoint === this.breaks['bottom'] && isNaN(diff)) {
                closest = this.settings.breaks['middle'].enabled
                    ? this.breaks['middle'] : this.settings.breaks['top'].enabled
                    ? this.breaks['top'] : this.breaks['bottom'];
            }
        }
        this.steps = [];
        this.currentBreakpoint = closest;
        this.checkOpacityAttr(this.currentBreakpoint);
        this.checkOverflowAttr(this.currentBreakpoint);
        // Bottom closable
        if (this.settings.bottomClose && closest === this.breaks['bottom']) {
            this.destroy({ animate: true });
            return;
        }
        this.doTransition({ type: 'end', translateY: closest });
    }
    attachEvents() {
        let el = this.paneEl;
        if (this.settings.dragByCursor) {
            el = this.draggableEl;
        }
        // Touch Events
        if (!Support.touch && Support.pointerEvents) {
            el.addEventListener(this.touchEvents.start, (t) => this.touchStart(t), false);
            el.addEventListener(this.touchEvents.move, (t) => this.touchMove(t), false);
            el.addEventListener(this.touchEvents.end, (t) => this.touchEnd(t), false);
        }
        else {
            if (Support.touch) {
                const passiveListener = this.touchEvents.start === 'touchstart' && Support.passiveListener && this.settings.passiveListeners ? { passive: true, capture: false } : false;
                el.addEventListener(this.touchEvents.start, (t) => this.touchStart(t), passiveListener);
                el.addEventListener(this.touchEvents.move, (t) => this.touchMove(t), Support.passiveListener ? { passive: false, capture: false } : false);
                el.addEventListener(this.touchEvents.end, (t) => this.touchEnd(t), passiveListener);
                if (this.touchEvents['cancel']) {
                    el.addEventListener(this.touchEvents['cancel'], (t) => this.touchEnd(t), passiveListener);
                }
            }
            if ((this.settings.simulateTouch && !this.device.ios && !this.device.android) || (this.settings.simulateTouch && !Support.touch && this.device.ios)) {
                el.addEventListener('mousedown', (t) => this.touchStart(t), false);
                el.addEventListener('mousemove', (t) => this.touchMove(t), false);
                el.addEventListener('mouseup', (t) => this.touchEnd(t), false);
            }
        }
    }
    detachEvents() {
        let el = this.paneEl;
        if (this.settings.dragByCursor) {
            el = this.draggableEl;
        }
        // Touch Events
        if (!Support.touch && Support.pointerEvents) {
            el.removeEventListener(this.touchEvents.start, (t) => this.touchStart(t), false);
            el.removeEventListener(this.touchEvents.move, (t) => this.touchMove(t), false);
            el.removeEventListener(this.touchEvents.end, (t) => this.touchEnd(t), false);
        }
        else {
            if (Support.touch) {
                const passiveListener = this.touchEvents.start === 'onTouchStart' && Support.passiveListener && this.settings.passiveListeners ? { passive: true, capture: false } : false;
                el.removeEventListener(this.touchEvents.start, (t) => this.touchStart(t), passiveListener);
                el.removeEventListener(this.touchEvents.move, (t) => this.touchMove(t), false);
                el.removeEventListener(this.touchEvents.end, (t) => this.touchEnd(t), passiveListener);
                if (this.touchEvents['cancel']) {
                    el.removeEventListener(this.touchEvents['cancel'], (t) => this.touchEnd(t), passiveListener);
                }
            }
            if ((this.settings.simulateTouch && !this.device.ios && !this.device.android) || (this.settings.simulateTouch && !Support.touch && this.device.ios)) {
                el.removeEventListener('mousedown', (t) => this.touchStart(t), false);
                el.removeEventListener('mousemove', (t) => this.touchMove(t), false);
                el.removeEventListener('mouseup', (t) => this.touchEnd(t), false);
            }
        }
    }
    get getPanelTransformY() {
        const translateYRegex = /\.*translateY\((.*)px\)/i;
        return parseFloat(translateYRegex.exec(this.paneEl.style.transform)[1]);
    }
    /************************************
     * Public user methods
     */
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
    hide() {
        if (!this.isPanePresented()) {
            console.warn(`Cupertino Pane: Present pane before call hide()`);
            return null;
        }
        if (this.isHidden()) {
            console.warn(`Cupertino Pane: Pane already hidden`);
            return null;
        }
        this.doTransition({ type: 'hide', translateY: this.screen_height });
    }
    isHidden() {
        if (!this.isPanePresented()) {
            console.warn(`Cupertino Pane: Present pane before call isHidden()`);
            return null;
        }
        return this.paneEl.style.transform === `translateY(${this.screen_height}px) translateZ(0px)`;
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
        this.parentEl.removeChild(this.wrapperEl);
        /****** Detach Events *******/
        this.detachEvents();
        // Reset vars
        this.currentBreakpoint = this.breaks[this.settings.initialBreak];
        // Reset styles
        this.contentEl.style.display = 'none';
    }
    destroy(conf = { animate: false }) {
        if (!this.isPanePresented()) {
            console.warn(`Cupertino Pane: Present pane before call destroy()`);
            return null;
        }
        // Emit event
        this.settings.onWillDismiss();
        /****** Animation & Transition ******/
        if (conf.animate) {
            this.doTransition({ type: 'destroy', translateY: this.screen_height });
        }
        else {
            this.destroyResets();
            // Emit event
            this.settings.onDidDismiss();
        }
    }
    /***********************************
     * Transitions handler
     */
    doTransition(params = {}) {
        // touchmove simple event
        if (params.type === 'move') {
            this.paneEl.style.transition = 'initial';
            this.paneEl.style.transform = `translateY(${params.translateY}px) translateZ(0px)`;
            // Bind for follower same transitions
            if (this.followerEl) {
                this.followerEl.style.transition = 'initial';
                this.followerEl.style.transform = `translateY(${params.translateY - this.breaks[this.settings.initialBreak]}px) translateZ(0px)`;
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
            this.settings.onTransitionEnd();
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
            // style
            this.paneEl.style.transition = `transform ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
            // Bind for follower same transitions
            if (this.followerEl) {
                this.followerEl.style.transition = `transform ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
            }
            // main transitions
            if (params.type === 'present') {
                this.paneEl.style.transform = `translateY(${this.screen_height}px) translateZ(0px)`;
                // Bind for follower same transitions
                if (this.followerEl) {
                    this.followerEl.style.transform = `translateY(${this.screen_height - this.breaks[this.settings.initialBreak]}px) translateZ(0px)`;
                }
                setTimeout(() => {
                    this.paneEl.style.transform = `translateY(${this.breaks[this.settings.initialBreak]}px) translateZ(0px)`;
                    // Bind for follower same transitions
                    if (this.followerEl) {
                        this.followerEl.style.transform = `translateY(${this.breaks[this.settings.initialBreak] - this.breaks[this.settings.initialBreak]}px) translateZ(0px)`;
                    }
                }, 50);
            }
            else {
                this.paneEl.style.transform = `translateY(${params.translateY}px) translateZ(0px)`;
                // Bind for follower same transitions
                if (this.followerEl) {
                    this.followerEl.style.transform = `translateY(${params.translateY - this.breaks[this.settings.initialBreak]}px) translateZ(0px)`;
                }
            }
            this.paneEl.addEventListener('transitionend', transitionEnd);
            return;
        }
    }
}

exports.CupertinoPane = CupertinoPane;
//# sourceMappingURL=cupertino-pane.js.map

/**
 * Cupertino Pane 1.1.83
 * Multiplatform slide-over pane
 * https://github.com/roman-rr/cupertino-pane/
 *
 * Copyright 2019-2020 Roman Antonov (roman-rr)
 *
 * Released under the MIT License
 *
 * Released on: October 6, 2020
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

class CupertinoPane {
    constructor(selector, conf = {}) {
        this.selector = selector;
        this.settings = {
            initialBreak: 'middle',
            parentElement: null,
            followerElement: null,
            pushElement: null,
            pushMinHeight: null,
            backdrop: false,
            backdropOpacity: 0.4,
            animationType: 'ease',
            animationDuration: 300,
            dragBy: null,
            bottomOffset: 0,
            darkMode: false,
            bottomClose: false,
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
        this.defaultBreaksConf = {
            top: { enabled: true, height: window.innerHeight - (135 * 0.35) },
            middle: { enabled: true, height: 300 },
            bottom: { enabled: true, height: 100 },
        };
        this.screen_height = window.innerHeight;
        this.steps = [];
        this.pointerDown = false;
        this.contentScrollTop = 0;
        this.disableDragEvents = false;
        this.disableDragAngle = false;
        this.rendered = false;
        this.allowClick = true;
        this.iconCloseColor = '#7a7a7e';
        this.breaks = {};
        this.brs = [];
        this.device = new Device();
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
        this.paneEl.style.paddingTop = '15px';
        this.paneEl.style.width = '100%';
        this.paneEl.style.maxWidth = '500px';
        this.paneEl.style.left = '0px';
        this.paneEl.style.right = '0px';
        this.paneEl.style.marginLeft = 'auto';
        this.paneEl.style.marginRight = 'auto';
        this.paneEl.style.height = `${this.screen_height - this.topper - this.settings.bottomOffset}px`;
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
        this.draggableEl.style.zIndex = '12';
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
        this.contentEl.style.display = 'block';
        this.contentEl.style.transition = `opacity ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`;
        this.contentEl.style.overflowX = 'hidden';
        // Close button
        this.closeEl = document.createElement('div');
        this.closeEl.className = 'close-button';
        this.closeEl.style.width = '26px';
        this.closeEl.style.height = '26px';
        this.closeEl.style.position = 'absolute';
        this.closeEl.style.background = '#ebebeb';
        this.closeEl.style.top = '16px';
        this.closeEl.style.right = '20px';
        this.closeEl.style.zIndex = '14';
        this.closeEl.style.borderRadius = '100%';
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
            this.settings.pushElement = document.querySelector(this.settings.pushElement);
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
        if (this.settings.buttonClose) {
            this.paneEl.appendChild(this.closeEl);
            this.closeEl.addEventListener('click', (t) => this.destroy({ animate: true }));
            this.closeEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path fill="${this.iconCloseColor}" d="M278.6 256l68.2-68.2c6.2-6.2 6.2-16.4 0-22.6-6.2-6.2-16.4-6.2-22.6 0L256 233.4l-68.2-68.2c-6.2-6.2-16.4-6.2-22.6 0-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3l68.2 68.2-68.2 68.2c-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3 6.2 6.2 16.4 6.2 22.6 0l68.2-68.2 68.2 68.2c6.2 6.2 16.4 6.2 22.6 0 6.2-6.2 6.2-16.4 0-22.6L278.6 256z"/>
        </svg>`;
        }
        if (this.settings.bottomClose) {
            this.settings.breaks.bottom.enabled = true;
        }
        if (this.settings.backdrop) {
            this.renderBackdrop();
        }
        /****** Fix android issues *******/
        if (this.device.android) {
            // Body patch prevent android pull-to-refresh
            document.body.style['overscrollBehaviorY'] = 'none';
            if (this.device.ionic
                && this.device.cordova) {
                // TODO: manual keyboard control (#49 issue)
                // Fix android keyboard issue with transition (resize height on hide)
                window.addEventListener('keyboardWillHide', () => {
                    if (!this.paneEl)
                        return;
                    window.requestAnimationFrame(() => {
                        this.wrapperEl.style.width = '100%';
                        this.paneEl.style.position = 'absolute';
                        window.requestAnimationFrame(() => {
                            this.wrapperEl.style.width = 'unset';
                            this.paneEl.style.position = 'fixed';
                        });
                    });
                });
            }
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
            // Good to get rid of timeout
            // but render dom take a time  
            setTimeout(() => {
                this.overflowEl.style.height = `${this.screen_height
                    - this.topper
                    - this.settings.bottomOffset
                    - this.settings.topperOverflowOffset
                    - this.overflowEl.offsetTop}px`;
            }, 150);
        }
    }
    getTimingFunction(bounce) {
        return bounce ? 'cubic-bezier(0.175, 0.885, 0.370, 1.120)' : this.settings.animationType;
    }
    checkOpacityAttr(val) {
        let attrElements = this.el.querySelectorAll('[hide-on-bottom]');
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
        // Check through all presented panes
        let wrappers = Array.from(document.querySelectorAll('.cupertino-pane-wrapper'));
        if (!wrappers.length)
            return false;
        return wrappers.find((item) => item.contains(this.selector)) ? true : false;
    }
    /**
     * Check if drag event fired by scrollable element
     */
    isDragScrollabe(path) {
        return !!path.find(item => item === this.overflowEl);
    }
    touchStart(t) {
        // Event emitter
        this.settings.onDragStart(t);
        if (this.disableDragEvents)
            return;
        // Allow clicks by default, disallow on move
        this.allowClick = true;
        // Allow touch angle by default, disallow no move with condition
        this.disableDragAngle = false;
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
        /****** Fix android issue https://bugs.chromium.org/p/chromium/issues/detail?id=1123304 *******/
        if (this.device.android && this.movePreventDefault(t)) {
            t.preventDefault();
        }
        // Event emitter
        this.settings.onDrag(t);
        if (this.disableDragEvents)
            return;
        if (this.disableDragAngle)
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
        let newVal = this.getPanelTransformY() + diffY;
        // Touch angle
        if (this.settings.touchAngle) {
            let touchAngle;
            const diffX = v - this.startX;
            const diffY = n - this.startY;
            touchAngle = (Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180) / Math.PI;
            if (diffX * diffX + diffY * diffY >= 25
                && (90 - touchAngle > this.settings.touchAngle)) {
                this.disableDragAngle = true;
                return;
            }
        }
        // Not allow move panel with positive overflow scroll
        if (this.isDragScrollabe(t.path || t.composedPath())
            && this.overflowEl.style.overflowY === 'auto') {
            this.overflowEl.addEventListener('scroll', (s) => {
                this.contentScrollTop = s.target.scrollTop;
            });
            // Scrolled -> Disable drag
            if ((newVal > this.topper && this.contentScrollTop > 0)
                || (newVal <= this.topper)) {
                return;
            }
            else {
                /****** Fix android issue https://bugs.chromium.org/p/chromium/issues/detail?id=1123304 *******/
                if (this.device.android) {
                    t.preventDefault();
                }
            }
        }
        // Not allow drag topper than top point
        if (newVal <= this.topper && !this.settings.upperThanTop) {
            this.paneEl.style.transform = `translateY(${this.topper}px) translateZ(0px)`;
            return;
        }
        // Allow drag topper than top point
        if (newVal <= this.topper && this.settings.upperThanTop) {
            const differKoef = ((-this.topper + this.topper - this.getPanelTransformY()) / this.topper) / -8;
            newVal = this.getPanelTransformY() + (diffY * differKoef);
        }
        // Not allow drag lower than bottom if free mode
        if (this.settings.freeMode && !this.settings.bottomClose && (newVal >= this.bottomer)) {
            return;
        }
        // Custom Lower then bottom 
        // (for example in follower drag events)
        if (!this.settings.lowerThanBottom && (newVal >= this.bottomer)) {
            this.destroy({ animate: true });
            return;
        }
        // Disallow accidentaly clicks while slide gestures
        this.allowClick = false;
        this.checkOpacityAttr(newVal);
        this.checkOverflowAttr(newVal);
        this.doTransition({ type: 'move', translateY: newVal });
        this.steps.push(n);
    }
    touchEnd(t) {
        // Event emitter
        this.settings.onDragEnd(t);
        if (this.disableDragEvents)
            return;
        const targetTouch = t.type === 'touchmove' && t.targetTouches && (t.targetTouches[0] || t.changedTouches[0]);
        const screenY = t.type === 'touchmove' ? targetTouch.clientY : t.clientY;
        if (t.type === 'mouseup')
            this.pointerDown = false;
        // Determinate nearest point
        let closest = this.getClosestBreakY();
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
    onClick(t) {
        // Prevent accidental unwanted clicks events during swiping
        if (!this.allowClick) {
            if (this.settings.preventClicks) {
                t.preventDefault();
                t.stopPropagation();
                t.stopImmediatePropagation();
            }
        }
    }
    movePreventDefault(t) {
        if (!(this.overflowEl.scrollHeight > this.overflowEl.clientHeight
            && this.overflowEl.style.overflow !== 'hidden'
            && this.isDragScrollabe(t.path || t.composedPath()))) {
            return true;
        }
        return false;
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
            el.addEventListener(this.touchEvents.start, this.touchStartCb, false);
            el.addEventListener(this.touchEvents.move, this.touchMoveCb, false);
            el.addEventListener(this.touchEvents.end, this.touchEndCb, false);
            // Backdrop propagation fix
            (_a = this.backdropEl) === null || _a === void 0 ? void 0 : _a.addEventListener(this.touchEvents.move, this.touchMoveBackdropCb, false);
        }
        else {
            if (Support.touch) {
                const passiveListener = this.touchEvents.start === 'touchstart' && Support.passiveListener && this.settings.passiveListeners ? { passive: true, capture: false } : false;
                el.addEventListener(this.touchEvents.start, this.touchStartCb, passiveListener);
                el.addEventListener(this.touchEvents.move, this.touchMoveCb, Support.passiveListener ? { passive: false, capture: false } : false);
                el.addEventListener(this.touchEvents.end, this.touchEndCb, passiveListener);
                // Backdrop propagation fix
                (_b = this.backdropEl) === null || _b === void 0 ? void 0 : _b.addEventListener(this.touchEvents.move, this.touchMoveBackdropCb, Support.passiveListener ? { passive: false, capture: false } : false);
                if (this.touchEvents['cancel']) {
                    el.addEventListener(this.touchEvents['cancel'], this.touchEndCb, passiveListener);
                }
            }
            if ((this.settings.simulateTouch && !this.device.ios && !this.device.android) || (this.settings.simulateTouch && !Support.touch && this.device.ios)) {
                el.addEventListener('mousedown', this.touchStartCb, false);
                el.addEventListener('mousemove', this.touchMoveCb, false);
                el.addEventListener('mouseup', this.touchEndCb, false);
                // Backdrop propagation fix
                (_c = this.backdropEl) === null || _c === void 0 ? void 0 : _c.addEventListener('mousemove', this.touchMoveBackdropCb, false);
            }
        }
        // Prevent accidental unwanted clicks events during swiping
        if (this.settings.preventClicks) {
            el.addEventListener('click', this.onClickCb, true);
        }
    }
    detachEvents(el) {
        var _a, _b, _c;
        // Touch Events
        if (!Support.touch && Support.pointerEvents) {
            el.removeEventListener(this.touchEvents.start, this.touchStartCb, false);
            el.removeEventListener(this.touchEvents.move, this.touchMoveCb, false);
            el.removeEventListener(this.touchEvents.end, this.touchEndCb, false);
            // Backdrop propagation fix
            (_a = this.backdropEl) === null || _a === void 0 ? void 0 : _a.removeEventListener(this.touchEvents.move, this.touchMoveBackdropCb, false);
        }
        else {
            if (Support.touch) {
                const passiveListener = this.touchEvents.start === 'onTouchStart' && Support.passiveListener && this.settings.passiveListeners ? { passive: true, capture: false } : false;
                el.removeEventListener(this.touchEvents.start, this.touchStartCb, passiveListener);
                el.removeEventListener(this.touchEvents.move, this.touchMoveCb, false);
                el.removeEventListener(this.touchEvents.end, this.touchEndCb, passiveListener);
                // Backdrop propagation fix
                (_b = this.backdropEl) === null || _b === void 0 ? void 0 : _b.removeEventListener(this.touchEvents.move, this.touchMoveBackdropCb, false);
                if (this.touchEvents['cancel']) {
                    el.removeEventListener(this.touchEvents['cancel'], this.touchEndCb, passiveListener);
                }
            }
            if ((this.settings.simulateTouch && !this.device.ios && !this.device.android) || (this.settings.simulateTouch && !Support.touch && this.device.ios)) {
                el.removeEventListener('mousedown', this.touchStartCb, false);
                el.removeEventListener('mousemove', this.touchMoveCb, false);
                el.removeEventListener('mouseup', this.touchEndCb, false);
                // Backdrop propagation fix
                (_c = this.backdropEl) === null || _c === void 0 ? void 0 : _c.removeEventListener('mousemove', this.touchMoveBackdropCb, false);
            }
        }
        // Prevent accidental unwanted clicks events during swiping
        if (this.settings.preventClicks) {
            el.removeEventListener('click', this.onClickCb, true);
        }
    }
    getPanelTransformY() {
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
        let prevBreak;
        if (this.isPanePresented() && !conf) {
            console.warn(`Cupertino Pane: Provide any breaks configuration`);
            return;
        }
        if (this.isPanePresented()) {
            prevBreak = this.currentBreak();
        }
        this.breaks = {
            top: this.screen_height,
            middle: this.screen_height,
            bottom: this.screen_height
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
                this.breaks[val] -= this.settings.breaks[val].height;
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
            if (!this.currentBreak()
                && this.settings.breaks[prevBreak].enabled) {
                this.moveToBreak(prevBreak);
            }
            // Move to any if removed
            if (!this.settings.breaks[prevBreak].enabled) {
                let nextY = this.swipeNextPoint(1, 1, this.getClosestBreakY());
                const nextBreak = Object.entries(this.breaks).find(val => val[1] === nextY);
                this.moveToBreak(nextBreak[0]);
            }
            // Re-calc height
            this.paneEl.style.height = `${this.screen_height - this.topper - this.settings.bottomOffset}px`;
            // Re-calc overflow elements
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
        this.wrapperEl.remove();
        /****** Detach Events *******/
        this.detachAllEvents();
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
    pushTransition(newPaneY, transition) {
        newPaneY = this.screen_height - newPaneY;
        const topHeight = this.settings.pushMinHeight ? this.settings.pushMinHeight : this.screen_height - this.bottomer;
        const minHeight = this.screen_height - this.topper;
        this.settings.pushElement.style.transition = transition;
        const setStyles = (scale, y, border, contrast) => {
            this.settings.pushElement.style.transform = `translateY(${y}px) scale(${scale})`;
            this.settings.pushElement.style.borderRadius = `${border}px`;
            this.settings.pushElement.style.filter = `contrast(${contrast})`;
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
        setStyles(getXbyY(0.93, 1), getXbyY(-6, 0) * -1, getXbyY(-10, 0) * -1, getXbyY(0.85, 1));
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
            const nextBreak = Object.entries(this.settings.breaks).find(val => val[1].height === (this.screen_height - params.translateY));
            const timingForNext = this.getTimingFunction(nextBreak && nextBreak[1].bounce ? true : false);
            // style
            this.paneEl.style.transition = `transform ${this.settings.animationDuration}ms ${timingForNext} 0s`;
            // Bind for follower same transitions
            if (this.followerEl) {
                this.followerEl.style.transition = `transform ${this.settings.animationDuration}ms ${timingForNext} 0s`;
            }
            // Push transition
            if (this.settings.pushElement) {
                this.pushTransition(params.translateY, `all ${this.settings.animationDuration}ms ${this.settings.animationType} 0s`);
            }
            // Main transitions
            if (params.type === 'present') {
                this.paneEl.style.transform = `translateY(${this.screen_height}px) translateZ(0px)`;
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
            this.paneEl.addEventListener('transitionend', transitionEnd);
            return;
        }
    }
}

export { CupertinoPane };
//# sourceMappingURL=cupertino-pane.esm.bundle.js.map

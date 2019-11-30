/**
 * Cupertino Pane 0.1.2
 * Multiplatform slide-over pane
 * https://github.com/roman-rr/cupertino-pane/
 *
 * Copyright 2019-2019 Roman Antonov (roman-rr)
 *
 * Released under the MIT License
 *
 * Released on: November 30, 2019
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global['Cupertino Pane'] = {}));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var CupertinoPane = /** @class */ (function () {
        function CupertinoPane(el, conf) {
            var _this = this;
            if (conf === void 0) { conf = {}; }
            this.el = el;
            this.settings = {
                initialShow: false,
                initialBreak: 'middle',
                backdrop: false,
                backdropClose: false,
                animationType: 'ease',
                animationDuration: 300,
                darkMode: false,
                bottomClose: false,
                freeMode: false,
                buttonClose: true,
                topperOverflow: true,
                topperOverflowOffset: 0,
                showDraggable: true,
                breaks: {
                    top: { enabled: true, offset: 0 },
                    middle: { enabled: true, offset: 0 },
                    bottom: { enabled: true, offset: 0 },
                },
                onDidDismiss: function () { },
                onWillDismiss: function () { },
                onDidPresent: function () { },
                onWillPresent: function () { },
                onDragStart: function () { },
                onDrag: function () { }
            };
            this.screen_height = window.screen.height;
            this.steps = [];
            this.breaks = {
                top: 50,
                middle: Math.round(this.screen_height - (this.screen_height * 0.35)),
                bottom: this.screen_height - 80
            };
            this.swipeNextPoint = function (diff, maxDiff, closest) {
                if (_this.currentBreak === _this.breaks['top']) {
                    if (diff > maxDiff) {
                        if (_this.settings.breaks['middle'].enabled) {
                            return _this.breaks['middle'];
                        }
                        if (_this.settings.breaks['bottom'].enabled) {
                            return _this.breaks['bottom'];
                        }
                    }
                    return _this.breaks['top'];
                }
                if (_this.currentBreak === _this.breaks['middle']) {
                    if (diff < -maxDiff) {
                        if (_this.settings.breaks['top'].enabled) {
                            return _this.breaks['top'];
                        }
                    }
                    if (diff > maxDiff) {
                        if (_this.settings.breaks['bottom'].enabled) {
                            return _this.breaks['bottom'];
                        }
                    }
                    return _this.breaks['middle'];
                }
                if (_this.currentBreak === _this.breaks['bottom']) {
                    if (diff < -maxDiff) {
                        if (_this.settings.breaks['middle'].enabled) {
                            return _this.breaks['middle'];
                        }
                        if (_this.settings.breaks['top'].enabled) {
                            return _this.breaks['top'];
                        }
                    }
                    return _this.breaks['bottom'];
                }
                return closest;
            };
            this.settings = __assign(__assign({}, this.settings), conf);
            this.el = document.querySelector(this.el);
            if (this.settings.parentElement) {
                this.settings.parentElement = document.querySelector(this.settings.parentElement);
            }
            else {
                this.settings.parentElement = this.el.parentElement;
            }
            ['top', 'middle', 'bottom'].forEach(function (val) {
                // If initial break disabled - set first enabled
                if (!_this.settings.breaks[_this.settings.initialBreak].enabled) {
                    if (_this.settings.breaks[val].enabled) {
                        _this.settings.initialBreak = val;
                    }
                }
                // Add offsets
                if (_this.settings.breaks[val]
                    && _this.settings.breaks[val].enabled
                    && _this.settings.breaks[val].offset) {
                    _this.breaks[val] -= _this.settings.breaks[val].offset;
                }
            });
            this.currentBreak = this.breaks[this.settings.initialBreak];
            if (this.settings.initialShow) {
                this.present();
            }
        }
        CupertinoPane.prototype.drawElements = function () {
            this.el.style.display = 'none';
            this.parentEl = this.settings.parentElement;
            // Wrapper
            this.wrapperEl = document.createElement('div');
            this.wrapperEl.className = "cupertino-pane-wrapper " + this.el.className;
            this.wrapperEl.style.position = 'absolute';
            this.wrapperEl.style.top = '0';
            // Panel
            this.paneEl = document.createElement('div');
            this.paneEl.className = 'pane';
            this.paneEl.style.position = 'fixed';
            this.paneEl.style.zIndex = '11';
            this.paneEl.style.width = '100%';
            this.paneEl.style.height = '100%';
            this.paneEl.style.background = '#ffffff';
            this.paneEl.style.borderTopLeftRadius = '20px';
            this.paneEl.style.borderTopRightRadius = '20px';
            this.paneEl.style.boxShadow = '0 4px 16px rgba(0,0,0,.12)';
            this.paneEl.style.overflow = 'hidden';
            this.paneEl.style.transform = "translateY(" + (this.settings.initialShow ?
                this.breaks[this.settings.initialBreak] : this.screen_height) + "px)";
            // Draggable
            this.draggableEl = document.createElement('div');
            this.draggableEl.className = 'draggable';
            this.draggableEl.style.padding = '5px';
            // Move
            this.moveEl = document.createElement('div');
            this.moveEl.className = 'move';
            this.moveEl.style.margin = '0 auto';
            this.moveEl.style.height = '5px';
            this.moveEl.style.background = '#c0c0c0';
            this.moveEl.style.width = '36px';
            this.moveEl.style.borderRadius = '4px';
            // Header
            this.headerEl = this.el.childNodes[0];
            // Content
            this.contentEl = this.el.childNodes[1];
            this.contentEl.style.transition = "opacity " + this.settings.animationDuration + "ms " + this.settings.animationType + " 0s";
            this.contentEl.style.overflowX = 'hidden';
            this.contentEl.style.height = this.screen_height
                - this.breaks['top'] - 51
                - this.settings.topperOverflowOffset + "px";
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
            this.backdropEl.style.backgroundColor = 'rgba(0,0,0,.4)';
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
        };
        CupertinoPane.prototype.present = function () {
            var _this = this;
            if (document.querySelector(".cupertino-pane-wrapper." + this.el.className.split(' ').join('.'))) {
                this.moveToBreak(this.settings.initialBreak);
                return;
            }
            // Emit event
            this.settings.onWillPresent();
            this.drawElements();
            this.parentEl.appendChild(this.wrapperEl);
            this.wrapperEl.appendChild(this.paneEl);
            this.paneEl.appendChild(this.draggableEl);
            this.paneEl.appendChild(this.headerEl);
            this.paneEl.appendChild(this.contentEl);
            this.draggableEl.appendChild(this.moveEl);
            if (!this.settings.initialShow) {
                this.paneEl.style.transition = "transform " + this.settings.animationDuration + "ms " + this.settings.animationType + " 0s";
                setTimeout(function () {
                    _this.paneEl.style.transform = "translateY(" + _this.breaks[_this.settings.initialBreak] + "px)";
                }, 50);
                var initTransitionEv_1 = this.paneEl.addEventListener('transitionend', function (t) {
                    _this.paneEl.style.transition = "initial";
                    initTransitionEv_1 = undefined;
                });
            }
            // Emit event
            this.settings.onDidPresent();
            if (this.settings.backdrop) {
                this.wrapperEl.appendChild(this.backdropEl);
                if (this.settings.backdropClose) {
                    this.backdropEl.addEventListener('click', function (t) { return _this.closePane(_this.backdropEl); });
                }
            }
            if (!this.settings.showDraggable) {
                this.draggableEl.style.opacity = '0';
            }
            if (this.settings.darkMode) {
                this.paneEl.style.background = '#1c1c1d';
                this.paneEl.style.color = '#ffffff';
                this.moveEl.style.background = '#5a5a5e';
            }
            if (this.settings.buttonClose) {
                this.paneEl.appendChild(this.closeEl);
                this.closeEl.addEventListener('click', function (t) { return _this.closePane(_this.backdropEl); });
                var iconColor = '#7a7a7e';
                if (this.settings.darkMode) {
                    this.closeEl.style.background = '#424246';
                    iconColor = '#a8a7ae';
                }
                this.closeEl.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\">\n          <path fill=\"" + iconColor + "\" d=\"M278.6 256l68.2-68.2c6.2-6.2 6.2-16.4 0-22.6-6.2-6.2-16.4-6.2-22.6 0L256 233.4l-68.2-68.2c-6.2-6.2-16.4-6.2-22.6 0-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3l68.2 68.2-68.2 68.2c-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3 6.2 6.2 16.4 6.2 22.6 0l68.2-68.2 68.2 68.2c6.2 6.2 16.4 6.2 22.6 0 6.2-6.2 6.2-16.4 0-22.6L278.6 256z\"/>\n        </svg>";
            }
            if (this.currentBreak === this.breaks['bottom']) {
                this.contentEl.style.opacity = '0';
            }
            else {
                this.contentEl.style.opacity = '1';
            }
            if (this.settings.bottomClose) {
                this.settings.breaks.bottom.enabled = true;
            }
            var brs = [];
            ['top', 'middle', 'bottom'].forEach(function (val) {
                if (_this.settings.breaks[val].enabled) {
                    brs.push(_this.breaks[val]);
                }
            });
            // Determinate topper point
            this.topper = brs.reduce(function (prev, curr) {
                return (Math.abs(curr) < Math.abs(prev) ? curr : prev);
            });
            // Determinate bottomer point
            this.bottomer = brs.reduce(function (prev, curr) {
                return (Math.abs(curr) > Math.abs(prev) ? curr : prev);
            });
            if (this.currentBreak === this.topper
                && this.settings.topperOverflow) {
                this.contentEl.style.overflowY = 'auto';
                // headerEl.style.borderBottom = '1px solid #ebebeb';
            }
            /****** Events *******/
            // Touchstart
            this.paneEl.addEventListener('touchstart', function (t) {
                // Event emitter
                _this.settings.onDragStart();
                _this.startP = t.touches[0].screenY;
                _this.steps.push(_this.startP);
            });
            // Touchmove
            this.paneEl.addEventListener('touchmove', function (t) {
                _this.settings.onDrag();
                var translateYRegex = /\.*translateY\((.*)px\)/i;
                var p = parseFloat(translateYRegex.exec(_this.paneEl.style.transform)[1]);
                // Delta
                var n = t.touches[0].screenY;
                var diff = n - _this.steps[_this.steps.length - 1];
                var newVal = p + diff;
                // Not allow move panel with overflow scroll
                var noScroll = false;
                if (_this.contentEl.style.overflowY === 'auto') {
                    t.composedPath().forEach(function (item) {
                        if (item['className'] && item['className'].includes('cupertino-content')) {
                            noScroll = true;
                        }
                    });
                    if (noScroll && _this.contentEl.scrollTop > 20) {
                        return;
                    }
                    if ((p + diff) <= _this.topper && noScroll) {
                        return;
                    }
                }
                // Not allow drag upper than topper point
                // Not allow drag lower than bottom if free mode
                if (((p + diff) <= _this.topper - 20)
                    || (_this.settings.freeMode && !_this.settings.bottomClose && ((p + diff) >= _this.bottomer + 20))) {
                    return;
                }
                _this.paneEl.style.transform = "translateY(" + newVal + "px)";
                _this.steps.push(n);
            });
            // Touchend
            this.paneEl.addEventListener('touchend', function (t) {
                var translateYRegex = /\.*translateY\((.*)px\)/i;
                var p = parseFloat(translateYRegex.exec(_this.paneEl.style.transform)[1]);
                // Determinate nearest point
                var closest = brs.reduce(function (prev, curr) {
                    return (Math.abs(curr - p) < Math.abs(prev - p) ? curr : prev);
                });
                // Swipe - next (if differ > 10)
                var diff = _this.steps[_this.steps.length - 1] - _this.steps[_this.steps.length - 2];
                var maxDiff = 4;
                if (Math.abs(diff) >= maxDiff) {
                    closest = _this.swipeNextPoint(diff, maxDiff, closest);
                }
                // Click to bottom - open middle
                if (_this.currentBreak === _this.breaks['bottom'] && isNaN(diff)) {
                    closest = _this.settings.breaks['middle'].enabled
                        ? _this.breaks['middle'] : _this.settings.breaks['top'].enabled
                        ? _this.breaks['top'] : _this.breaks['bottom'];
                }
                // Bottom closable
                if (_this.settings.bottomClose && closest === _this.breaks['bottom']) {
                    _this.closePane(_this.backdropEl);
                    return;
                }
                _this.steps = [];
                _this.currentBreak = closest;
                if (_this.currentBreak === _this.breaks['bottom']) {
                    _this.contentEl.style.opacity = '0';
                }
                else {
                    _this.contentEl.style.opacity = '1';
                }
                if (_this.currentBreak === _this.topper
                    && _this.settings.topperOverflow) {
                    _this.contentEl.style.overflowY = 'auto';
                }
                else {
                    _this.contentEl.style.overflowY = 'hidden';
                }
                if (!_this.settings.freeMode) {
                    _this.paneEl.style.transition = "transform " + _this.settings.animationDuration + "ms " + _this.settings.animationType + " 0s";
                    _this.paneEl.style.transform = "translateY(" + closest + "px)";
                    var initTransitionEv_2 = _this.paneEl.addEventListener('transitionend', function () {
                        _this.paneEl.style.transition = "initial";
                        initTransitionEv_2 = undefined;
                    });
                }
            });
        };
        CupertinoPane.prototype.moveToBreak = function (val) {
            var _this = this;
            if (this.breaks[val] === this.breaks['bottom']) {
                this.contentEl.style.opacity = '0';
            }
            else {
                this.contentEl.style.opacity = '1';
            }
            if (this.breaks[val] === this.topper
                && this.settings.topperOverflow) {
                this.contentEl.style.overflowY = 'auto';
            }
            else {
                this.contentEl.style.overflowY = 'hidden';
            }
            this.paneEl.style.transition = "transform " + this.settings.animationDuration + "ms " + this.settings.animationType + " 0s";
            this.paneEl.style.transform = "translateY(" + this.breaks[val] + "px)";
            var initTransitionEv = this.paneEl.addEventListener('transitionend', function (t) {
                _this.paneEl.style.transition = "initial";
                initTransitionEv = undefined;
            });
        };
        CupertinoPane.prototype.hide = function () {
            var _this = this;
            this.paneEl.style.transition = "transform " + this.settings.animationDuration + "ms " + this.settings.animationType + " 0s";
            this.paneEl.style.transform = "translateY(" + this.screen_height + "px)";
            var initTransitionEv = this.paneEl.addEventListener('transitionend', function (t) {
                _this.paneEl.style.transition = "initial";
                initTransitionEv = undefined;
            });
        };
        CupertinoPane.prototype.closePane = function (backdropEl) {
            var _this = this;
            // Emit event
            this.settings.onWillDismiss();
            this.paneEl.style.transition = "transform " + this.settings.animationDuration + "ms " + this.settings.animationType + " 0s";
            this.paneEl.style.transform = "translateY(" + this.screen_height + "px)";
            backdropEl.style.transition = "transform " + this.settings.animationDuration + "ms " + this.settings.animationType + " 0s";
            backdropEl.style.backgroundColor = 'rgba(0,0,0,.0)';
            // Return dynamic content
            this.el.appendChild(this.headerEl);
            this.el.appendChild(this.contentEl);
            this.paneEl.addEventListener('transitionend', function (t) {
                _this.parentEl.removeChild(_this.wrapperEl);
                // Emit event
                _this.settings.onDidDismiss();
            });
        };
        return CupertinoPane;
    }());

    exports.CupertinoPane = CupertinoPane;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=cupertino-pane.js.map

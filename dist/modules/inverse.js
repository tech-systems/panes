/**
 * Cupertino Pane 1.3.51
 * Cupertino Panes is multi-functional modals, cards & panes with touch technologies.
 * https://panejs.com
 *
 * Copyright 2019-2023 Roman Antonov (roman-rr)
 *
 * Released under the MIT License
 *
 * Released on: August 18, 2023
 */

function __awaiter(t,e,s,n){return new(s||(s=Promise))((function(i,r){function o(t){try{p(n.next(t))}catch(t){r(t)}}function a(t){try{p(n.throw(t))}catch(t){r(t)}}function p(t){var e;t.done?i(t.value):(e=t.value,e instanceof s?e:new s((function(t){t(e)}))).then(o,a)}p((n=n.apply(t,e||[])).next())}))}"function"==typeof SuppressedError&&SuppressedError;class InverseModule{constructor(t){this.instance=t,this.breakpoints=this.instance.breakpoints,this.settings=this.instance.settings,this.events=this.instance.events,this.settings.inverse&&(this.settings.buttonDestroy=!1,this.instance.getPaneHeight=()=>this.getPaneHeight(),this.instance.updateScreenHeights=()=>this.updateScreenHeights(),this.instance.setOverflowHeight=()=>this.settings.fitHeight?{}:this.setOverflowHeight(),this.instance.checkOpacityAttr=()=>{},this.instance.checkOverflowAttr=t=>this.checkOverflowAttr(t),this.instance.prepareBreaksSwipeNextPoint=()=>this.prepareBreaksSwipeNextPoint(),this.events.handleTopperLowerPositions=t=>this.handleTopperLowerPositions(t),this.events.scrollPreventDrag=t=>this.scrollPreventDrag(t),this.events.onScroll=()=>this.onScroll(),this.instance.on("DOMElementsReady",(()=>{this.instance.wrapperEl.classList.add("inverse")})),this.instance.on("rendered",(()=>{this.instance.addStyle("\n        .cupertino-pane-wrapper.inverse .pane {\n          border-radius: 0 0 20px 20px;\n          border-radius: 0 0\n                        var(--cupertino-pane-border-radius, 20px) \n                        var(--cupertino-pane-border-radius, 20px);\n        }\n        .cupertino-pane-wrapper.inverse:not(.fit-height) .pane {\n          padding-bottom: 15px; \n        }\n        .cupertino-pane-wrapper.inverse .draggable {\n          bottom: 0;\n          top: initial;\n        }\n        .cupertino-pane-wrapper.inverse .draggable.over {\n          bottom: -30px;\n          top: initial;\n        }\n        .cupertino-pane-wrapper.inverse .move {\n          margin-top: 15px;\n        }\n        .cupertino-pane-wrapper.inverse .draggable.over .move {\n          margin-top: -5px;\n        }\n      ")})),this.instance.on("beforeBreakHeightApplied",(t=>{var e;(null===(e=this.settings.breaks[t.break])||void 0===e?void 0:e.enabled)&&(this.breakpoints.breaks[t.break]=2*(this.settings.breaks[t.break].height+this.settings.bottomOffset))}),!1),this.instance.on("buildBreakpointsCompleted",(()=>{this.breakpoints.topper=this.breakpoints.bottomer,this.instance.paneEl.style.top=`-${this.breakpoints.bottomer-this.settings.bottomOffset}px`})))}getPaneHeight(){return this.breakpoints.bottomer-this.settings.bottomOffset}updateScreenHeights(){this.instance.screen_height=window.innerHeight,this.instance.screenHeightOffset=0}setOverflowHeight(){this.instance.overflowEl.style.height=this.getPaneHeight()-30-this.settings.topperOverflowOffset-this.instance.overflowEl.offsetTop+"px"}checkOverflowAttr(t){this.settings.topperOverflow&&this.instance.overflowEl&&(this.instance.overflowEl.style.overflowY=t>=this.breakpoints.bottomer?"auto":"hidden")}prepareBreaksSwipeNextPoint(){let t={},e={};return t.top=this.breakpoints.breaks.bottom,t.middle=this.breakpoints.breaks.middle,t.bottom=this.breakpoints.breaks.top,e.top=Object.assign({},this.settings.breaks.bottom),e.middle=Object.assign({},this.settings.breaks.middle),e.bottom=Object.assign({},this.settings.breaks.top),{brs:t,settingsBreaks:e}}handleTopperLowerPositions(t){if(this.settings.upperThanTop&&(t.newVal>=this.breakpoints.topper||this.events.startPointOverTop)){this.events.startPointOverTop||(this.events.startPointOverTop=t.clientY),this.events.startPointOverTop>t.clientY&&delete this.events.startPointOverTop;const e=this.instance.screen_height-this.instance.screenHeightOffset,s=(e-this.instance.getPanelTransformY())/(e-this.breakpoints.topper)/8;return this.instance.getPanelTransformY()+t.diffY*s}if(!this.settings.upperThanTop&&t.newVal>=this.breakpoints.topper)return this.breakpoints.topper}scrollPreventDrag(t){let e=!1;return this.events.willScrolled()&&this.isOverflowEl(t.target)&&(e=!0),e}isOverflowEl(t){if(!t)return!1;let e=t.parentNode;for(;null!=e;){if(e==this.instance.overflowEl)return!0;e=e.parentNode}return!1}onScroll(){return __awaiter(this,void 0,void 0,(function*(){this.events.isScrolling=!0}))}}export{InverseModule};
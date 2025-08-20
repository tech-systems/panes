/**
 * Cupertino Pane 1.4.22
 * Cupertino Panes is multi-functional modals, cards & panes with touch technologies.
 * https://panejs.com
 *
 * Copyright 2019-2025 Roman Antonov (roman-rr)
 *
 * Released under the MIT License
 *
 * Released on: August 21, 2025
 */

class FollowerModule{constructor(t){this.instance=t,this.breakpoints=this.instance.breakpoints,this.transitions=this.instance.transitions,this.settings=this.instance.settings,this.settings.followerElement&&(this.instance.on("rendered",(()=>{var t;document.querySelector(this.settings.followerElement)?(this.followerEl=document.querySelector(this.settings.followerElement),this.followerEl.style.willChange="transform, border-radius",this.followerEl.style.transform=this.instance.buildTransform3d(0,0,0),this.followerEl.style.transition=this.transitions.buildTransitionValue(null===(t=this.settings.breaks[this.instance.currentBreak()])||void 0===t?void 0:t.bounce)):console.warn("Cupertino Pane: wrong follower element selector specified",this.settings.followerElement)})),this.instance.on("onMoveTransitionStart",(t=>{this.followerEl.style.transition="all 0ms linear 0ms",this.followerEl.style.transform=this.instance.buildTransform3d(0,t.translateY-this.breakpoints.breaks[this.settings.initialBreak],0)})),this.instance.on("onMoveTransitionStart",(t=>{this.followerEl.style.transition="initial"})),this.instance.on("onTransitionStart",(t=>{this.followerEl.style.transition=t.transition,this.followerEl.style.transform=this.instance.buildTransform3d(0,t.translateY.new-this.breakpoints.breaks[this.settings.initialBreak],0)})))}}export{FollowerModule};
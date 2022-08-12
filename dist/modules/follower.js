/**
 * Cupertino Pane 1.3.01
 * New generation interfaces for web3 progressive applications
 * https://github.com/roman-rr/cupertino-pane/
 *
 * Copyright 2019-2022 Roman Antonov (roman-rr)
 *
 * Released under the MIT License
 *
 * Released on: August 12, 2022
 */

class FollowerModule{constructor(t){this.instance=t,this.breakpoints=this.instance.breakpoints,this.transitions=this.instance.transitions,this.settings=this.instance.settings,this.settings.followerElement&&(this.instance.on("rendered",(()=>{var t;document.querySelector(this.settings.followerElement)?(this.followerEl=document.querySelector(this.settings.followerElement),this.followerEl.style.willChange="transform, border-radius",this.followerEl.style.transform="translateY(0px) translateZ(0px)",this.followerEl.style.transition=this.transitions.buildTransitionValue(null===(t=this.settings.breaks[this.instance.currentBreak()])||void 0===t?void 0:t.bounce)):console.warn("Cupertino Pane: wrong follower element selector specified",this.settings.followerElement)})),this.instance.on("onMoveTransitionStart",(t=>{this.followerEl.style.transition="all 0ms linear 0ms",this.followerEl.style.transform=`translateY(${t.translateY-this.breakpoints.breaks[this.settings.initialBreak]}px) translateZ(0px)`})),this.instance.on("onMoveTransitionStart",(t=>{this.followerEl.style.transition="initial"})),this.instance.on("onTransitionStart",(t=>{this.followerEl.style.transition=t.transition,this.followerEl.style.transform=`translateY(${t.translateY.new-this.breakpoints.breaks[this.settings.initialBreak]}px) translateZ(0px)`})))}}export{FollowerModule};
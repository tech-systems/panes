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

class HorizontalModule{constructor(t){this.instance=t,this.settings=this.instance.settings,this.transitions=this.instance.transitions,this.events=this.instance.events,this.settings.horizontal&&(this.settings.touchAngle=null,this.transitions.setPaneElTransform=t=>this.setPaneElTransform(t),this.instance.on("onTransitionEnd",(t=>{"breakpoint"!==t.type&&"present"!==t.type||this.instance.getPanelTransformX()||this.calcHorizontalBreaks()})),this.instance.on("onDragEnd",(t=>{this.fastSwipeNext=this.events.fastSwipeNext("X")})))}calcHorizontalBreaks(){this.defaultRect={width:this.instance.paneEl.getBoundingClientRect().width,left:this.instance.paneEl.getBoundingClientRect().left,right:this.instance.paneEl.getBoundingClientRect().right},this.horizontalBreaks=[-this.defaultRect.left+this.settings.horizontalOffset,window.innerWidth-this.defaultRect.left-this.defaultRect.width-this.settings.horizontalOffset]}setPaneElTransform(t){let s=t.translateX;"end"===t.type&&(s=this.getClosestBreakX(),this.fastSwipeNext&&("left"===this.currentBreakpoint&&this.instance.getPanelTransformX()>this.horizontalBreaks[0]&&(s=this.horizontalBreaks[1]),"right"===this.currentBreakpoint&&this.instance.getPanelTransformX()<this.horizontalBreaks[1]&&(s=this.horizontalBreaks[0])),this.currentBreakpoint=s===this.horizontalBreaks[0]?"left":"right"),this.instance.paneEl.style.transform=`translateX(${s||0}px) translateY(${t.translateY}px) translateZ(0px)`}getClosestBreakX(){return this.horizontalBreaks.reduce(((t,s)=>Math.abs(s-this.instance.getPanelTransformX())<Math.abs(t-this.instance.getPanelTransformX())?s:t))}}export{HorizontalModule};
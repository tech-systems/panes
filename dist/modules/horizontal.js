/**
 * Cupertino Pane 1.4.0
 * Cupertino Panes is multi-functional modals, cards & panes with touch technologies.
 * https://panejs.com
 *
 * Copyright 2019-2023 Roman Antonov (roman-rr)
 *
 * Released under the MIT License
 *
 * Released on: September 5, 2023
 */

class HorizontalModule{static CollectSettings(t){return t.horizontal?Object.assign(Object.assign({},t),HorizontalModule.forceSettings):t}constructor(t){if(this.instance=t,this.settings=this.instance.settings,this.transitions=this.instance.transitions,this.events=this.instance.events,!this.settings.horizontal)return null;this.transitions.setPaneElTransform=t=>this.setPaneElTransform(t),this.instance.on("onTransitionEnd",(t=>{"breakpoint"!==t.type&&"present"!==t.type||this.instance.getPanelTransformX()||this.calcHorizontalBreaks()})),this.instance.on("onDidPresent",(t=>{t.animate||this.calcHorizontalBreaks()})),this.instance.on("onDragEnd",(t=>{this.fastSwipeNext=this.events.fastSwipeNext("X")}))}calcHorizontalBreaks(){this.defaultRect={width:this.instance.paneEl.getBoundingClientRect().width,left:this.instance.paneEl.getBoundingClientRect().left,right:this.instance.paneEl.getBoundingClientRect().right},this.horizontalBreaks=[-this.defaultRect.left+this.settings.horizontalOffset,window.innerWidth-this.defaultRect.left-this.defaultRect.width-this.settings.horizontalOffset]}setPaneElTransform(t){let e=t.translateX;"end"===t.type&&(e=this.getClosestBreakX(),this.fastSwipeNext&&("left"===this.currentBreakpoint&&this.instance.getPanelTransformX()>this.horizontalBreaks[0]&&(e=this.horizontalBreaks[1]),"right"===this.currentBreakpoint&&this.instance.getPanelTransformX()<this.horizontalBreaks[1]&&(e=this.horizontalBreaks[0])),this.currentBreakpoint=e===this.horizontalBreaks[0]?"left":"right"),this.instance.paneEl.style.transform=`translateX(${e||0}px) translateY(${t.translateY}px) translateZ(0px)`}getClosestBreakX(){return this.horizontalBreaks.reduce(((t,e)=>Math.abs(e-this.instance.getPanelTransformX())<Math.abs(t-this.instance.getPanelTransformX())?e:t))}}HorizontalModule.forceSettings={touchAngle:null};export{HorizontalModule};
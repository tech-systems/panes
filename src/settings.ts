import { CupertinoSettings } from './models';

export class Settings {

  public instance: CupertinoSettings;
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
      events: null,
      modules: null
    };
  }
}

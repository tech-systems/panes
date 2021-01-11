import { CupertinoSettings } from './cupertino-pane';

export class Settings {

  public instance: CupertinoSettings;
  constructor() {
    this.instance = {
      initialBreak: 'middle',
      inverse: false,
      parentElement: null,
      followerElement: null,
      pushElement: null,
      pushMinHeight: null,
      pushYOffset: 0,
      backdrop: false,
      backdropOpacity: 0.4,
      animationType: 'ease',
      animationDuration: 300,
      dragBy: null,
      bottomOffset: 0,
      darkMode: false,
      bottomClose: false,
      fastSwipeClose: false,
      fastSwipeSensivity: 3,
      freeMode: false,
      buttonDestroy: true,
      buttonClose: true,
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
      touchAngle: null,
      breaks: {},
      onDidDismiss: () => {},
      onWillDismiss: () => {},
      onDidPresent: () => {},
      onWillPresent: () => {},
      onDragStart: () => {},
      onDrag: () => {},
      onDragEnd: () => {},
      onBackdropTap: () => {},
      onTransitionStart: () => {},
      onTransitionEnd: () => {}
    };
  }
}
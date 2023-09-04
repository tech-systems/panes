export interface PaneBreak {
  enabled: boolean,
  height?: number,
  bounce?: boolean
}

export interface PaneBreaks {
  top?: PaneBreak;
  middle?: PaneBreak;
  bottom?: PaneBreak;
}

export interface ZStackSettings {
  pushElements: string[];
  minPushHeight?: number;
  cardBorderRadius: number,
  cardYOffset?: number;
  cardZScale?: number;
  cardContrast?: number;
  stackZAngle?: number;
}

export interface ModalSettings {
  transition?: 'fade' | 'zoom';
  flying?: boolean;
  dismissOnIntense?: boolean;
}

export interface TransitionStartEvent {
  translateY: { new: number};
}

export interface CupertinoEvents {
  onDidDismiss?: (event?: CustomEvent) => void;
  onWillDismiss?: (event?: CustomEvent) => void;
  onDidPresent?: (event?: CustomEvent) => void;
  onWillPresent?: (event?: CustomEvent) => void;
  onDragStart?: (event?: CustomEvent) => void;
  onDrag?: (event?: any) => void;
  onDragEnd?: (event?: CustomEvent) => void;
  onBackdropTap?: (event?: CustomEvent) => void;
  onTransitionStart?: (event?: TransitionStartEvent) => void;
  onTransitionEnd?: (event?: any) => void;
}

export interface PaneSettings {
  initialBreak: ('top' | 'middle' | 'bottom');
  horizontal: boolean;
  horizontalOffset: number;
  inverse: boolean;
  parentElement: string | HTMLElement;
  followerElement: string;
  cssClass: string;
  fitHeight: boolean;
  maxFitHeight: number;
  fitScreenHeight: boolean;
  ionContentScroll: boolean;
  backdrop: boolean;
  backdropBlur: boolean;
  backdropOpacity: number;
  animationType: string;
  animationDuration: number;
  bottomOffset: number,
  bottomClose: boolean;
  fastSwipeClose: boolean;
  fastSwipeSensivity: number;
  freeMode: boolean;
  buttonDestroy: boolean;
  topperOverflow: boolean;
  topperOverflowOffset: number;
  lowerThanBottom: boolean;
  upperThanTop: boolean;
  showDraggable: boolean;
  draggableOver: boolean;
  clickBottomOpen: boolean;
  dragBy: string[];
  preventClicks: boolean;
  handleKeyboard: boolean;
  simulateTouch: boolean;
  passiveListeners: boolean;
  touchMoveStopPropagation: boolean;
  touchAngle: number;
  breaks: PaneBreaks;
  modal: ModalSettings | boolean;
  zStack: ZStackSettings;
  events: CupertinoEvents;
  modules: any[];
}

export type CupertinoSettings = Partial<PaneSettings>;
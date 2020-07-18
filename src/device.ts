import { Support } from './support';

export class Device {
  public ios: boolean = false;
  public android: boolean = false;
  public androidChrome: boolean = false;
  public desktop:boolean = false;
  public iphone: boolean = false;
  public ipod: boolean = false;
  public ipad: boolean = false;
  public edge: boolean = false;
  public ie: boolean = false;
  public firefox: boolean = false;
  public macos: boolean = false;
  public windows: boolean = false;
  public cordova: boolean = !!(window['cordova'] || window['phonegap']);
  public phonegap: boolean = !!(window['cordova'] || window['phonegap']);
  public electron: boolean = false;
  public os: string;
  public osVersion: string;
  public webView: any;
  public webview: any;
  public standalone: any;
  public pixelRatio: any;
  public ionic: boolean = !!document.querySelector('ion-app');

  constructor() {
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
      && (
        (screenWidth === 1024 && screenHeight === 1366) // Pro 12.9
        || (screenWidth === 834 && screenHeight === 1194) // Pro 11
        || (screenWidth === 834 && screenHeight === 1112) // Pro 10.5
        || (screenWidth === 768 && screenHeight === 1024) // other
      )
    ) {
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
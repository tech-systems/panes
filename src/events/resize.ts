import { CupertinoPane } from '../cupertino-pane';
import { Device } from '../device';
import { Breakpoints } from '../breakpoints';

/**
 * Window resize, Orientation change
 */
export class ResizeEvents {
  private device: Device;
  private breakpoints: Breakpoints;
  private rafId: number | null = null;

  constructor(private instance: CupertinoPane) {
    this.device = this.instance.device;
    this.breakpoints = this.instance.breakpoints;
  }

  /**
   * Window resize event handler
   * Handles orientation changes and window resize
   * @param e
   */
  public onWindowResizeCb = (e) => this.onWindowResize(e);
  
  private async onWindowResize(e) {
    // Handle keyboard detection first
    this.instance.keyboardEvents.handleKeyboardFromResize(e);
    
    // Update screen heights immediately
    this.instance.updateScreenHeights();

    // Cancel previous RAF and schedule new one to to frequent calls
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }

    this.rafId = requestAnimationFrame(() => {
      this.breakpoints.buildBreakpoints(JSON.parse(this.breakpoints.lockedBreakpoints));
      this.rafId = null;
    });
  }

  /**
   * Check if element is a form element
   * Shared utility method for form element detection
   */
  public isFormElement(el): boolean {
    const formElements: string[] = [
      'input', 'select', 'option', 
      'textarea', 'button', 'label'
    ];

    if (el && el.tagName 
        && formElements.includes(el.tagName.toLowerCase())) {
      return true;
    }
    return false;
  }
} 
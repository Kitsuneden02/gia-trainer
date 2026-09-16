/**
 * GIA Trainer Keyboard Controller
 * Zero-latency ergonomic input dispatcher with numpad normalization and scroll prevention.
 */

export class KeyboardController {
  /**
   * @param {Object} options
   * @param {(key: string) => void} options.onKeyPress - Callback invoked on recognized key press
   * @param {() => boolean} [options.isActive] - Predicate whether shortcuts should be captured
   */
  constructor({ onKeyPress, isActive = () => true }) {
    this.onKeyPress = onKeyPress;
    this.isActive = isActive;
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.isAttached = false;
  }

  attach() {
    if (this.isAttached) return;
    window.addEventListener('keydown', this.handleKeyDown, { passive: false });
    this.isAttached = true;
  }

  detach() {
    if (!this.isAttached) return;
    window.removeEventListener('keydown', this.handleKeyDown);
    this.isAttached = false;
  }

  /**
   * @param {KeyboardEvent} e
   */
  handleKeyDown(e) {
    // Ignore input if focus is inside an input, textarea, or select
    const targetTag = e.target && e.target.tagName;
    if (targetTag === 'INPUT' || targetTag === 'TEXTAREA' || targetTag === 'SELECT') {
      return;
    }

    if (!this.isActive()) {
      return;
    }

    const key = e.key;
    const code = e.code;

    // Normalization table
    let normalized = null;

    if (key === ' ' || code === 'Space') {
      normalized = 'Space';
    } else if (key === 'Enter' || code === 'Enter' || code === 'NumpadEnter') {
      normalized = 'Enter';
    } else if (key >= '0' && key <= '9') {
      normalized = key;
    } else if (code.startsWith('Numpad') && code.length === 7 && code[6] >= '0' && code[6] <= '9') {
      normalized = code[6];
    } else if (key === 'ArrowLeft' || code === 'ArrowLeft') {
      normalized = 'ArrowLeft';
    } else if (key === 'ArrowRight' || code === 'ArrowRight') {
      normalized = 'ArrowRight';
    } else if (key === 'ArrowDown' || code === 'ArrowDown') {
      normalized = 'ArrowDown';
    } else if (key === 'ArrowUp' || code === 'ArrowUp') {
      normalized = 'ArrowUp';
    } else if (key === 'Escape' || code === 'Escape') {
      normalized = 'Escape';
    }

    if (normalized) {
      // Prevent browser default behavior (such as page scrolling on Space or Arrow keys)
      if (['Space', 'ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'].includes(normalized)) {
        e.preventDefault();
      }
      this.onKeyPress(normalized);
    }
  }
}

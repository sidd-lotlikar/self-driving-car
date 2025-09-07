export class Controls {
  /**
   * Handles keyboard input for controlling the car.
   * Tracks four directional states: forward, backward (downward), left, right.
   */
  constructor(type) {
    // Control states (pressed = true, not pressed = false)
    this.forward = false;
    this.left = false;
    this.right = false;
    this.downward = false;

    // Set up event listeners for key presses
    switch (type) {
      case "KEYS":
        this.#addKeyboardListeners();
        break;
      case "DUMMY":
        this.forward = true;
        break;
    }
  }

  /**
   * Private method that attaches keyboard event listeners
   * for arrow keys and updates control state accordingly.
   */
  #addKeyboardListeners() {
    /**
     * Handles key press (keydown) events.
     * When a key is pressed, set the corresponding control to true.
     *
     * @param {KeyboardEvent} event - The keyboard event object.
     */
    document.onkeydown = (event) => {
      switch (event.key) {
        case "ArrowLeft":
          this.left = true;
          break;
        case "ArrowRight":
          this.right = true;
          break;
        case "ArrowUp":
          this.forward = true;
          break;
        case "ArrowDown":
          this.downward = true;
          break;
      }
    };

    /**
     * Handles key release (keyup) events.
     * When a key is released, set the corresponding control back to false.
     *
     * @param {KeyboardEvent} event - The keyboard event object.
     */
    document.onkeyup = (event) => {
      switch (event.key) {
        case "ArrowLeft":
          this.left = false;
          break;
        case "ArrowRight":
          this.right = false;
          break;
        case "ArrowUp":
          this.forward = false;
          break;
        case "ArrowDown":
          this.downward = false;
          break;
      }
    };
  }
}

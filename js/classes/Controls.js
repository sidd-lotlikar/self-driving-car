export class Controls {
  constructor() {
    this.forward = false;
    this.left = false;
    this.right = false;
    this.downward = false;

    this.#addKeyboardListeners();
  }

  #addKeyboardListeners() {
    /**
     *
     * @param {KeyboardEvent} event
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
     *
     * @param {KeyboardEvent} event
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

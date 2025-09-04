class Car {
  /**
   *
   * @param {number} x - The horizontal position of the car relative to the canvas.
   * @param {number} y - The vertical position of the car relative to the canvas.
   * @param {number} width - The width of the car.
   * @param {number} height - The height of the car.
   */
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * Draws the car on the given canvas rendering context.
   * @param {CanvasRenderingContext2D} drawingContext
   */
  draw(drawingContext) {
    drawingContext.beginPath();
    drawingContext.rect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    drawingContext.fill();
  }
}

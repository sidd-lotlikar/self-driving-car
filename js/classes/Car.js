import { Controls } from "./Controls.js";

export class Car {
  /**
   *
   * @param {number} x - The horizontal position of the car relative to the canvas.
   * @param {number} y - The vertical position of the car relative to the canvas.
   * @param {number} width - The width of the car.
   * @param {number} height - The height of the car.
   */
  constructor(x, y, width, height) {
    // Position
    this.x = x;
    this.y = y;
    // Size
    this.width = width;
    this.height = height;
    // Mechanics
    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = 3;
    this.friction = 0.05;
    this.angle = 0;
    // Controls
    this.controls = new Controls();
  }

  update() {
    this.#move();
  }

  #move() {
    // Move Forward and Downward
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.downward) {
      this.speed -= this.acceleration;
    }
    // Move Left and Right
    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }
      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
    }
    // Cap the Speed
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }
    // Impose Friction to the Car
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }
    // Update the position based on the changes of the angle and speed
    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed; // y-axis grows downward (unlike traditional math graphs where y goes upward)
  }

  /**
   * Draws the car on the given canvas rendering context.
   * @param {CanvasRenderingContext2D} drawingContext
   */
  draw(drawingContext) {
    drawingContext.save();
    drawingContext.translate(this.x, this.y);
    drawingContext.rotate(-this.angle);

    drawingContext.fillStyle = "rgba(255, 0, 0, 0.5)"; // semi-transparent red
    drawingContext.beginPath();
    drawingContext.rect(
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    drawingContext.fill();

    drawingContext.restore();
  }
}

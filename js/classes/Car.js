import { Controls } from "./Controls.js";
import { Sensor } from "./Sensors.js";

export class Car {
  /**
   * Represents a car with position, size, physics, controls, and sensors.
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

    // Motion physics
    this.speed = 0; // current velocity
    this.acceleration = 0.2; // how fast it speeds up
    this.maxSpeed = 3; // maximum allowed speed
    this.friction = 0.05; // natural slowdown (simulates drag/rolling resistance)
    this.angle = 0; // car orientation in radians

    // Input controls (keyboard arrows)
    this.controls = new Controls();

    // Sensor system
    this.sensor = new Sensor(this);
  }

  /**
   * Updates the car’s position and sensor readings.
   *
   * @param {Array<Array<{x: number, y: number}>>} roadBoarders - Array of road boundaries.
   */
  update(roadBoarders) {
    this.#move(); // update motion
    this.sensor.update(roadBoarders); // update sensor intersections
  }

  /**
   * Handles car motion physics:
   * - Acceleration forward/backward
   * - Steering left/right
   * - Speed capping
   * - Friction
   * - Position updates based on angle
   */
  #move() {
    // --- Acceleration ---
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.downward) {
      this.speed -= this.acceleration;
    }

    // --- Steering ---
    if (this.speed != 0) {
      // Flip ensures correct steering when reversing
      const flip = this.speed > 0 ? 1 : -1;

      if (this.controls.left) {
        this.angle += 0.03 * flip; // turn left
      }
      if (this.controls.right) {
        this.angle -= 0.03 * flip; // turn right
      }
    }

    // --- Speed limits ---
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2; // reverse speed capped to half
    }

    // --- Friction (gradual slowdown) ---
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0; // prevent endless tiny movement
    }

    // --- Position update based on angle ---
    // Uses trigonometry to move the car in the direction it’s facing
    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
    // Note: Canvas y-axis grows downward, opposite to math graphs
  }

  /**
   * Draws the car and its sensor rays on the canvas.
   *
   * @param {CanvasRenderingContext2D} drawingContext - The canvas drawing context.
   */
  draw(drawingContext) {
    drawingContext.save();

    // Move drawing origin to car’s position
    drawingContext.translate(this.x, this.y);

    // Rotate canvas so car points in the correct direction
    drawingContext.rotate(-this.angle);

    // Draw car rectangle (semi-transparent red)
    drawingContext.fillStyle = "rgba(255, 0, 0, 0.5)";
    drawingContext.beginPath();
    drawingContext.rect(
      -this.width / 2, // center rectangle horizontally
      -this.height / 2, // center rectangle vertically
      this.width,
      this.height
    );
    drawingContext.fill();

    drawingContext.restore();

    // Draw sensor rays on top of car
    this.sensor.draw(drawingContext);
  }
}

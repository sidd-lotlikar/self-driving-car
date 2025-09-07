import { Controls } from "./Controls.js";
import { Sensor } from "./Sensors.js";
import { polysIntersect } from "../utils/utils.js";

export class Car {
  /**
   * Represents a car with position, size, physics, controls, and sensors.
   *
   * @param {number} x - The horizontal position of the car relative to the canvas.
   * @param {number} y - The vertical position of the car relative to the canvas.
   * @param {number} width - The width of the car.
   * @param {number} height - The height of the car.
   */
  constructor(x, y, width, height, maxSpeed = 3, controlType) {
    // Position
    this.x = x;
    this.y = y;

    // Size
    this.width = width;
    this.height = height;

    // Motion physics - in the future some of these variables will be in the constructor
    this.speed = 0; // current velocity
    this.acceleration = 0.2; // how fast it speeds up
    this.maxSpeed = maxSpeed; // maximum allowed speed
    this.friction = 0.05; // natural slowdown (simulates drag/rolling resistance)
    this.angle = 0; // car orientation in radians
    this.damaged = false; // tracks whether the car has collided
    this.steeringSensitivity = 0.03; // how sharply the car turns per update (radians per frame)

    if (controlType != "DUMMY") {
      // Sensor system
      this.sensor = new Sensor(this);
    }
    // Input controls (keyboard arrows)
    this.controls = new Controls(controlType);
  }

  /**
   * Updates the car’s position and sensor readings.
   *
   * @param {Array<Array<{x: number, y: number}>>} roadBoarders - Array of road boundaries.
   */
  update(roadBoarders, traffic) {
    if (!this.damaged) {
      this.#move(); // update motion based on controls and physics
      this.polygon = this.#createPolygon(); // update car's polygon shape for collision detection
      this.damaged = this.#assessDamaged(roadBoarders, traffic); // check for collisions with road boundaries and traffic
    }
    if (this.sensor) {
      this.sensor.update(roadBoarders, traffic); // update sensor intersections regardless of damage
    }
  }

  /**
   * Checks if the car has collided with any road boundaries.
   * @param {Array<Array<{x: number, y: number}>>} roadBoarders - Array of road boundary polygons
   * @returns {boolean} - True if collision detected, false otherwise
   */
  #assessDamaged(roadBoarders, traffic) {
    for (let i = 0; i < roadBoarders.length; i++) {
      if (polysIntersect(this.polygon, roadBoarders[i])) {
        return true; // collision detected
      }
    }
    for (let i = 0; i < traffic.length; i++) {
      if (polysIntersect(this.polygon, traffic[i].polygon)) {
        return true; // collision detected
      }
    }
    return false; // no collision
  }

  /**
   * Calculates the four corner points of the car based on position and angle.
   * Used for collision detection and rendering.
   * @returns {Array<{x: number, y: number}>} - Corner points of the car polygon
   */
  #createPolygon() {
    const points = [];
    const radius = Math.hypot(this.width, this.height) / 2; // distance from center to corner
    const alpha = Math.atan2(this.width, this.height); // angle between center and corner

    // Top-left corner
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * radius,
      y: this.y - Math.cos(this.angle - alpha) * radius,
    });
    // Top-right corner
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * radius,
      y: this.y - Math.cos(this.angle + alpha) * radius,
    });
    // Bottom-left corner
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * radius,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * radius,
    });
    // Bottom-right corner
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * radius,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * radius,
    });

    return points;
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
      this.speed += this.acceleration; // increase speed when moving forward
    }
    if (this.controls.downward) {
      this.speed -= this.acceleration; // decrease speed when moving backward
    }

    // --- Steering ---
    if (this.speed != 0) {
      // Flip ensures correct steering when reversing
      const flip = this.speed > 0 ? 1 : -1;

      if (this.controls.left) {
        this.angle += this.steeringSensitivity * flip; // turn left
      }
      if (this.controls.right) {
        this.angle -= this.steeringSensitivity * flip; // turn right
      }
    }

    // --- Speed limits ---
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed; // cap forward speed
    }
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2; // cap reverse speed to half
    }

    // --- Friction ---
    if (this.speed > 0) {
      this.speed -= this.friction; // reduce speed gradually
    }
    if (this.speed < 0) {
      this.speed += this.friction; // reduce backward speed gradually
    }
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0; // prevent small oscillating movement
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
    // Change color if damaged
    if (this.damaged) {
      drawingContext.fillStyle = "orange";
    } else {
      drawingContext.fillStyle = "rgba(255, 0, 0, 0.5)";
    }

    // Draw car polygon
    drawingContext.beginPath();
    drawingContext.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      drawingContext.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    drawingContext.fill();

    // Draw sensor rays on top of car
    if (this.sensor) {
      this.sensor.draw(drawingContext);
    }
  }
}

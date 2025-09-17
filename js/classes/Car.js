import { Controls } from "./Controls.js";
import { Sensor } from "./Sensors.js";
import { polysIntersect } from "../utils/utils.js";
import { NeuralNetwork } from "./NeuralNetwork.js";

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
    this.height = height;
    this.width = width;

    // Motion physics
    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = maxSpeed;
    this.friction = 0.05;
    this.angle = 0;
    this.damaged = false;
    this.steeringSensitivity = 0.03;

    this.useAI = controlType == "AI";

    if (controlType != "DUMMY") {
      // Attach sensors + neural network (for AI control)
      this.sensor = new Sensor(this);
      // Network shape: input layer = number of rays, one hidden layer (6 neurons), 4 outputs
      this.neuralNetwork = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
    }
    // Keyboard or dummy controls
    this.controls = new Controls(controlType);
  }

  /**
   * Updates the car’s position and sensor readings.
   *
   * @param {Array<Array<{x: number, y: number}>>} roadBoarders - Array of road boundaries.
   */
  update(roadBoarders, traffic) {
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damaged = this.#assessDamaged(roadBoarders, traffic);
    }
    if (this.sensor) {
      this.sensor.update(roadBoarders, traffic);

      // Convert sensor readings into normalized inputs (0..1)
      const offsets = this.sensor.readings.map((s) =>
        s == null ? 0 : 1 - s.offset
      );

      // Run network to get control outputs
      const outputs = NeuralNetwork.feedForward(offsets, this.neuralNetwork);

      // AI uses network outputs to control car
      if (this.useAI) {
        this.controls.forward = outputs[0];
        this.controls.left = outputs[1];
        this.controls.right = outputs[2];
        this.controls.downward = outputs[3];
      }
    }
  }

  /**
   * Checks if the car has collided with any road boundaries.
   */
  #assessDamaged(roadBoarders, traffic) {
    for (let i = 0; i < roadBoarders.length; i++) {
      if (polysIntersect(this.polygon, roadBoarders[i])) {
        return true;
      }
    }
    for (let i = 0; i < traffic.length; i++) {
      if (polysIntersect(this.polygon, traffic[i].polygon)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Calculates the four corner points of the car based on position and angle.
   */
  #createPolygon() {
    const points = [];
    const radius = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);

    points.push({
      x: this.x - Math.sin(this.angle - alpha) * radius,
      y: this.y - Math.cos(this.angle - alpha) * radius,
    });
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * radius,
      y: this.y - Math.cos(this.angle + alpha) * radius,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * radius,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * radius,
    });
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
      this.speed += this.acceleration;
    }
    if (this.controls.downward) {
      this.speed -= this.acceleration;
    }

    // --- Steering ---
    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) {
        this.angle += this.steeringSensitivity * flip;
      }
      if (this.controls.right) {
        this.angle -= this.steeringSensitivity * flip;
      }
    }

    // --- Speed limits ---
    if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
    if (this.speed < -this.maxSpeed / 2) this.speed = -this.maxSpeed / 2;

    // --- Friction ---
    if (this.speed > 0) this.speed -= this.friction;
    if (this.speed < 0) this.speed += this.friction;
    if (Math.abs(this.speed) < this.friction) this.speed = 0;

    // --- Position update ---
    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  /**
   * Draws the car and its sensors on the canvas.
   */
  draw(drawingContext) {
    drawingContext.fillStyle = this.damaged ? "orange" : "rgba(255, 0, 0, 0.5)";

    drawingContext.beginPath();
    drawingContext.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      drawingContext.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    drawingContext.fill();

    if (this.sensor) {
      this.sensor.draw(drawingContext);
    }
  }
}

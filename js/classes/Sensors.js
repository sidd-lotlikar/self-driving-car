import { lerp } from "../utils/utils.js";
import { Car } from "./Car.js";

export class Sensor {
  /**
   *
   * @param {Car} car
   */
  constructor(car) {
    this.car = car;
    this.rayCount = 3;
    this.rayLength = 100;
    this.raySpread = Math.PI / 4;

    this.rays = [];
  }

  update() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle;

      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };
      this.rays.push([start, end]);
    }
  }

  /**
   *
   * @param {CanvasRenderingContext2D} drawingContext
   */
  draw(drawingContext) {
    for (let i = 0; i < this.rayCount; i++) {
      drawingContext.beginPath();
      drawingContext.lineWidth = 2;
      drawingContext.strokeStyle = "yellow";
      drawingContext.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      drawingContext.lineTo(this.rays[i][1].x, this.rays[i][1].y);
      drawingContext.stroke();
    }
  }
}

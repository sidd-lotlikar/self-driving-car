import { lerp, getIntersection } from "../utils/utils.js";
import { Car } from "./Car.js";

export class Sensor {
  /**
   * A sensor system for a car.
   * It casts rays outward from the car, detects intersections with road borders,
   * and provides distance readings (like LIDAR or radar).
   *
   * @param {Car} car - The car this sensor belongs to.
   */
  constructor(car) {
    this.car = car;

    // Number of rays to cast (like multiple "sightlines")
    this.rayCount = 5;

    // Maximum length of each ray
    this.rayLength = 150;

    // The angular spread of rays (in radians) — wider spread = wider vision
    this.raySpread = Math.PI / 4; // 45 degrees

    // Stores all rays (each ray is [startPoint, endPoint])
    this.rays = [];

    // Stores sensor readings (intersection points with road borders, or null if no hit)
    this.readings = [];
  }

  /**
   * Update the sensor by casting rays and detecting intersections.
   *
   * @param {Array<Array<{x: number, y: number}>>} roadBoarders - List of road borders,
   *        where each border is a line segment represented by two points [A, B].
   */
  update(roadBoarders, traffic) {
    // Generate rays based on car position and orientation
    this.#castRays();

    // Reset readings for this frame
    this.readings = [];

    // For each ray, calculate the nearest intersection with road borders
    for (let i = 0; i < this.rays.length; i++) {
      this.readings.push(
        this.#getReadings(this.rays[i], roadBoarders, traffic)
      );
    }
  }

  /**
   * For a single ray, find the closest intersection with road borders.
   *
   * @param {[{x: number, y: number}, {x: number, y: number}]} ray - The ray [start, end].
   * @param {Array<Array<{x: number, y: number}>>} roadBoarders - List of road border segments.
   * @returns { {x: number, y: number, offset: number} | null } - The closest intersection point,
   *           or null if no intersection.
   */
  #getReadings(ray, roadBoarders, traffic) {
    let touches = [];

    // Check intersection with every road border
    for (let i = 0; i < roadBoarders.length; i++) {
      const touch = getIntersection(
        ray[0], // start of ray
        ray[1], // end of ray
        roadBoarders[i][0], // border start
        roadBoarders[i][1] // border end
      );
      if (touch) {
        touches.push(touch);
      }
    }

    // Check intersection with the traffic
    for (let i = 0; i < traffic.length; i++) {
      const poly = traffic[i].polygon;
      for (let j = 0; j < poly.length; j++) {
        const value = getIntersection(
          ray[0],
          ray[1],
          poly[j],
          poly[(j + 1) % poly.length]
        );
        if (value) {
          touches.push(value);
        }
      }
    }

    // If no intersections found, return null
    if (touches.length == 0) {
      return null;
    } else {
      // Find the intersection closest to the car (smallest offset along the ray)
      const offsets = touches.map((e) => e.offset);
      const minOffset = Math.min(...offsets);
      return touches.find((e) => e.offset == minOffset);
    }
  }

  /**
   * Casts rays outward from the car based on car position, angle, and ray spread.
   */
  #castRays() {
    this.rays = [];

    for (let i = 0; i < this.rayCount; i++) {
      // Interpolate ray angle between leftmost and rightmost spread
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle;

      // Start of the ray is always the car’s position
      const start = { x: this.car.x, y: this.car.y };

      // End of the ray is determined by angle and fixed length
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };

      // Save ray
      this.rays.push([start, end]);
    }
  }

  /**
   * Draw rays and detected intersections on the canvas.
   *
   * Yellow = active part of ray (up to the closest hit).
   * Black = remainder of the ray (past the hit, not used).
   *
   * @param {CanvasRenderingContext2D} drawingContext
   */
  draw(drawingContext) {
    for (let i = 0; i < this.rayCount; i++) {
      // By default, draw ray up to its maximum length
      let end = this.rays[i][1];

      // If intersection found, shorten the ray to the hit point
      if (this.readings[i]) {
        end = this.readings[i];
      }

      // Draw the active (detected) ray in yellow
      drawingContext.beginPath();
      drawingContext.lineWidth = 2;
      drawingContext.strokeStyle = "yellow";
      drawingContext.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      drawingContext.lineTo(end.x, end.y);
      drawingContext.stroke();

      // Draw the inactive (beyond detection) part of ray in black
      drawingContext.beginPath();
      drawingContext.lineWidth = 2;
      drawingContext.strokeStyle = "black";
      drawingContext.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      drawingContext.lineTo(end.x, end.y);
      drawingContext.stroke();
    }
  }
}

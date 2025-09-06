import { lerp } from "../utils/utils.js";

export class Road {
  /**
   * Represents a road with multiple lanes and borders.
   *
   * @param {number} x - The horizontal center of the road on the canvas.
   * @param {number} width - The total width of the road.
   * @param {number} laneCount - The number of lanes (default: 3).
   */
  constructor(x, width, laneCount = 3) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;

    // Left and right edges of the road
    this.left = x - width / 2;
    this.right = x + width / 2;

    // Simulate infinite road length (upwards and downwards on canvas)
    const infinity = 1000000;
    this.top = -infinity; // far upward
    this.bottom = infinity; // far downward

    // Store road border lines (two vertical lines at left & right edges)
    const topLeft = { x: this.left, y: this.top };
    const topRight = { x: this.right, y: this.top };
    const bottomLeft = { x: this.left, y: this.bottom };
    const bottomRight = { x: this.right, y: this.bottom };
    this.borders = [
      [topLeft, bottomLeft], // left border line
      [topRight, bottomRight], // right border line
    ];
  }

  /**
   * Get the x-coordinate of the center of a given lane.
   *
   * @param {number} laneIndex - The index of the lane (0 = leftmost).
   * @returns {number} The x-coordinate of the lane center.
   */
  getLaneCenter(laneIndex) {
    const laneWidth = this.width / this.laneCount;
    return (
      this.left +
      laneWidth / 2 + // shift to middle of the lane
      Math.min(laneIndex, this.laneCount - 1) * laneWidth
    );
  }

  /**
   * Draw the road on the canvas, including:
   * - Asphalt background
   * - Lane dividers
   * - Left and right borders
   *
   * @param {CanvasRenderingContext2D} drawingContext - The canvas rendering context.
   */
  draw(drawingContext) {
    // --- Draw road background ---
    drawingContext.fillStyle = "#2c2c2c"; // dark asphalt color
    drawingContext.fillRect(
      this.left,
      this.top,
      this.width,
      this.bottom - this.top
    );

    // --- Draw lane dividers ---
    drawingContext.lineWidth = 5;
    drawingContext.strokeStyle = "white";

    for (let i = 1; i <= this.laneCount - 1; i++) {
      // Interpolate evenly spaced divider lines
      const x = lerp(this.left, this.right, i / this.laneCount);

      // Dashed white lines for dividers
      drawingContext.setLineDash([20, 20]);

      drawingContext.beginPath();
      drawingContext.moveTo(x, this.top);
      drawingContext.lineTo(x, this.bottom);
      drawingContext.stroke();
    }

    // --- Draw road borders (solid lines) ---
    drawingContext.setLineDash([]); // solid line
    this.borders.forEach((border) => {
      drawingContext.beginPath();
      drawingContext.moveTo(border[0].x, border[0].y);
      drawingContext.lineTo(border[1].x, border[1].y);
      drawingContext.stroke();
    });
  }
}

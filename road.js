class Road {
  constructor(x, width, laneCount = 3) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;

    this.left = x - width / 2;
    this.right = x + width / 2;

    // Define the top and bottom of the road
    const infinity = 1000000;
    this.top = -infinity;
    this.bottom = infinity;

    // Store borders in memory
    const topLeft = { x: this.left, y: this.top };
    const topRight = { x: this.right, y: this.top };
    const bottomLeft = { x: this.left, y: this.bottom };
    const bottomRight = { x: this.right, y: this.bottom };
    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ];
  }

  getLaneCenter(laneIndex) {
    const laneWidth = this.width / this.laneCount;
    return (
      this.left +
      laneWidth / 2 +
      Math.min(laneIndex, this.laneCount - 1) * laneWidth
    );
  }

  /**
   *
   * @param {CanvasRenderingContext2D} drawingContext
   */
  draw(drawingContext) {
    // Road background
    drawingContext.fillStyle = "#2c2c2c"; // dark asphalt color
    drawingContext.fillRect(
      this.left,
      this.top,
      this.width,
      this.bottom - this.top
    );

    drawingContext.lineWidth = 5;
    drawingContext.strokeStyle = "white";

    for (let i = 1; i <= this.laneCount - 1; i++) {
      const x = lerp(this.left, this.right, i / this.laneCount);

      // Lane dividers
      drawingContext.setLineDash([20, 20]);

      drawingContext.beginPath();
      drawingContext.moveTo(x, this.top);
      drawingContext.lineTo(x, this.bottom);
      drawingContext.stroke();
    }
    drawingContext.setLineDash([]);
    this.borders.forEach((border) => {
      drawingContext.beginPath();
      drawingContext.moveTo(border[0].x, border[0].y);
      drawingContext.lineTo(border[1].x, border[1].y);
      drawingContext.stroke();
    });
  }
}

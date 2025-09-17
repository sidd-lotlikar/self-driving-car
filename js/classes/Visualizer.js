import { lerp, getRGBA } from "../utils/utils.js";

export class Visualizer {
  /**
   * Draws an entire neural network on a canvas context.
   *
   * @param {CanvasRenderingContext2D} ctx - The 2D drawing context of a canvas.
   * @param {Object} network - The neural network object containing `levels`.
   */
  static drawNetwork(ctx, network) {
    const margin = 50;
    const left = margin;
    const top = margin;
    const width = ctx.canvas.width - margin * 2;
    const height = ctx.canvas.height - margin * 2;

    // Divide canvas vertically by the number of levels in the network
    const levelHeight = height / network.levels.length;

    // Draw levels from output (last) to input (first)
    for (let i = network.levels.length - 1; i >= 0; i--) {
      const levelTop =
        top +
        lerp(
          height - levelHeight,
          0,
          network.levels.length == 1 ? 0.5 : i / (network.levels.length - 1)
        );

      ctx.setLineDash([7, 3]); // Dashed line for better visual separation
      Visualizer.drawLevel(
        ctx,
        network.levels[i],
        left,
        levelTop,
        width,
        levelHeight,
        // Use arrow symbols for the last (output) level
        i == network.levels.length - 1 ? ["🠉", "🠈", "🠊", "🠋"] : []
      );
    }
  }

  /**
   * Draws a single level of the network, including its input nodes,
   * output nodes, and weighted connections.
   *
   * @param {CanvasRenderingContext2D} ctx - The 2D drawing context of a canvas.
   * @param {Object} level - The level object containing inputs, outputs, weights, and biases.
   * @param {number} left - The left boundary (x-coordinate) of the level drawing area.
   * @param {number} top - The top boundary (y-coordinate) of the level drawing area.
   * @param {number} width - The width of the drawing area for this level.
   * @param {number} height - The height of the drawing area for this level.
   * @param {string[]} outputLabels - Optional labels to display on output nodes.
   */
  static drawLevel(ctx, level, left, top, width, height, outputLabels) {
    const right = left + width;
    const bottom = top + height;
    const { inputs, outputs, weights, biases } = level;

    // --- Draw weighted connections between inputs and outputs ---
    for (let i = 0; i < inputs.length; i++) {
      for (let j = 0; j < outputs.length; j++) {
        ctx.beginPath();
        ctx.moveTo(Visualizer.#getNodeX(inputs, i, left, right), bottom);
        ctx.lineTo(Visualizer.#getNodeX(outputs, j, left, right), top);
        ctx.lineWidth = 2;
        ctx.strokeStyle = getRGBA(weights[i][j]); // Color encodes weight value
        ctx.stroke();
      }
    }

    // --- Draw input nodes ---
    const nodeRadius = 18;
    for (let i = 0; i < inputs.length; i++) {
      const x = Visualizer.#getNodeX(inputs, i, left, right);

      // Outer circle (node border)
      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();

      // Inner circle (activation value)
      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = getRGBA(inputs[i]);
      ctx.fill();
    }

    // --- Draw output nodes ---
    for (let i = 0; i < outputs.length; i++) {
      const x = Visualizer.#getNodeX(outputs, i, left, right);

      // Outer circle (node border)
      ctx.beginPath();
      ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();

      // Inner circle (activation value)
      ctx.beginPath();
      ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = getRGBA(outputs[i]);
      ctx.fill();

      // Bias visualization as dashed circle
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);
      ctx.strokeStyle = getRGBA(biases[i]);
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw optional output label (arrows for directions)
      if (outputLabels[i]) {
        ctx.beginPath();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ctx.strokeStyle = "white";
        ctx.font = nodeRadius * 1.5 + "px Arial";
        ctx.fillText(outputLabels[i], x, top + nodeRadius * 0.1);
        ctx.lineWidth = 0.5;
        ctx.strokeText(outputLabels[i], x, top + nodeRadius * 0.1);
      }
    }
  }

  /**
   * Computes the x-position for a node, distributing nodes evenly across the level width.
   *
   * @param {Array<number>} nodes - Array of nodes (inputs or outputs).
   * @param {number} index - The index of the current node.
   * @param {number} left - The left boundary.
   * @param {number} right - The right boundary.
   * @returns {number} - The x-coordinate of the node.
   */
  static #getNodeX(nodes, index, left, right) {
    return lerp(
      left,
      right,
      nodes.length == 1 ? 0.5 : index / (nodes.length - 1)
    );
  }
}

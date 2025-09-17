/**
 * Performs linear interpolation between two values.
 *
 * @param {number} A - The starting value.
 * @param {number} B - The ending value.
 * @param {number} t - The interpolation factor (0 returns A, 1 returns B, values in between return a point between A and B).
 * @returns {number} The interpolated value between A and B.
 */
export function lerp(A, B, t) {
  return A + (B - A) * t;
}

/**
 * Get the intersection between two line segments AB and CD.
 *
 * @param {{x: number, y: number}} A - Start of first segment
 * @param {{x: number, y: number}} B - End of first segment
 * @param {{x: number, y: number}} C - Start of second segment
 * @param {{x: number, y: number}} D - End of second segment
 * @returns {{x: number, y: number, offset: number} | null} Intersection point with offset along AB, or null if no intersection.
 */
export function getIntersection(A, B, C, D) {
  // Vector differences
  const ABx = B.x - A.x;
  const ABy = B.y - A.y;
  const CDx = D.x - C.x;
  const CDy = D.y - C.y;

  // Determinant (denominator)
  const den = ABx * CDy - ABy * CDx;
  if (den === 0) {
    return null; // Parallel or coincident
  }

  // Solve for t and u
  const t = ((C.x - A.x) * CDy - (C.y - A.y) * CDx) / den;
  const u = ((C.x - A.x) * ABy - (C.y - A.y) * ABx) / den;

  // Check if intersection is within both segments
  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return {
      x: A.x + ABx * t,
      y: A.y + ABy * t,
      offset: t, // how far along AB the intersection is (useful for sensors)
    };
  }

  return null; // No intersection within segment bounds
}

/**
 * Checks if two polygons intersect.
 *
 * @param {Array<{x: number, y: number}>} poly1 - First polygon as an array of points
 * @param {Array<{x: number, y: number}>} poly2 - Second polygon as an array of points
 * @returns {boolean} - True if polygons intersect, false otherwise
 */
export function polysIntersect(poly1, poly2) {
  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      const touch = getIntersection(
        poly1[i], // start point of current edge in poly1
        poly1[(i + 1) % poly1.length], // end point of current edge in poly1 (wraps around)
        poly2[j], // start point of current edge in poly2
        poly2[(j + 1) % poly2.length] // end point of current edge in poly2 (wraps around)
      );

      if (touch) {
        return true; // polygons collide
      }
    }
  }

  return false; // polygons do not collide
}

/**
 * Converts a numeric value (-1 to 1) into an RGBA color string.
 *
 * - Positive values is red
 * - Negative values is blue
 * - Alpha (transparency) = absolute value (stronger color for larger magnitude)
 *
 * @param {number} value - Number in range [-1, 1] representing weight/activation.
 * @returns {string} RGBA color string usable in canvas drawing.
 */
export function getRGBA(value) {
  const alpha = Math.abs(value); // Transparency proportional to magnitude
  const R = value < 0 ? 0 : 255; // Red for positive values
  const G = R; // G matches R (gives red/white gradient)
  const B = value > 0 ? 0 : 255; // Blue for negative values
  return "rgba(" + R + "," + G + "," + B + "," + alpha + ")";
}

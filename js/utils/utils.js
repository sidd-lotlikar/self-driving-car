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

/**
 * Performs linear interpolation between two values.
 *
 * @param {number} A - The starting value.
 * @param {number} B - The ending value.
 * @param {number} t - The interpolation factor (0 returns A, 1 returns B, values in between return a point between A and B).
 * @returns {number} The interpolated value between A and B.
 */
function lerp(A, B, t) {
  return A + (B - A) * t;
}

export class Level {
  /**
   * Creates a new network layer with randomized weights and biases.
   *
   * @param {number} inputCount  Number of input neurons in this layer.
   * @param {number} outputCount Number of output neurons this layer produces.
   */
  constructor(inputCount, outputCount) {
    /**
     * @type {number[]} Stores current input values (length = inputCount)
     */
    this.inputs = new Array(inputCount);

    /**
     * @type {number[]} Stores current output values (length = outputCount)
     */
    this.outputs = new Array(outputCount);

    /**
     * @type {number[]} Thresholds for each output neuron.
     * If weighted sum > bias → output = 1, else 0.
     */
    this.biases = new Array(outputCount);

    /**
     * @type {number[][]} Connection weights.
     * weights[i][j] = weight from input neuron i → output neuron j.
     */
    this.weights = [];
    for (let i = 0; i < inputCount; i++) {
      this.weights[i] = new Array(outputCount);
    }

    // Initialize weights & biases with random values in range [-1, 1]
    Level.#randomize(this);
  }

  /**
   * Randomizes weights and biases for the given level.
   *
   * This gives the network "starting values" before any training
   * (or evolution/mutation) happens.
   *
   * @param {Level} level The level instance to initialize.
   */
  static #randomize(level) {
    // Assign random weights between -1 and 1
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        level.weights[i][j] = Math.random() * 2 - 1;
      }
    }

    // Assign random biases between -1 and 1
    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random() * 2 - 1;
    }
  }

  /**
   * Performs a feed-forward calculation:
   * 1. Copies input values into this level.
   * 2. Computes a weighted sum for each output neuron.
   * 3. Compares sum against bias → produces binary output (1 or 0).
   *
   * @param {number[]} inputs Input values to this level.
   * @param {Level} level The level being processed.
   * @returns {number[]} The calculated outputs for this level.
   */
  static feedForward(inputs, level) {
    // Copy input values into level
    for (let i = 0; i < level.inputs.length; i++) {
      level.inputs[i] = inputs[i];
    }

    // Compute outputs for each neuron
    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0;

      // Weighted sum of all inputs for this output neuron
      for (let j = 0; j < level.inputs.length; j++) {
        sum += level.inputs[j] * level.weights[j][i];
      }

      //  Activation function (threshold)
      // If sum > bias, neuron "fires" (1), else stays inactive (0)
      level.outputs[i] = sum > level.biases[i] ? 1 : 0;
    }

    return level.outputs;
  }
}

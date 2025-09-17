import { Level } from "./Level.js";

export class NeuralNetwork {
  /**
   * Creates a new neural network with the given neuron counts.
   *
   * @param {number[]} neuronCounts - An array where each element represents
   *                                  the number of neurons in that layer.
   *                                  Example: [3, 4, 2] creates a network
   *                                  with 3 input neurons, one hidden layer
   *                                  with 4 neurons, and 2 output neurons.
   */
  constructor(neuronCounts) {
    this.levels = [];

    // Create each level by pairing current layer with next layer
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
    }
  }

  /**
   * Feeds input values through the entire neural network and returns the outputs.
   *
   * @param {number[]} inputs - Array of input values for the first layer.
   * @param {NeuralNetwork} network - The network to evaluate.
   * @returns {number[]} - The final output values after passing through all layers.
   */
  static feedForward(inputs, network) {
    // Process the first level with the initial inputs
    let outputs = Level.feedForward(inputs, network.levels[0]);

    // Feed outputs of each level into the next level
    for (let i = 1; i < network.levels.length; i++) {
      outputs = Level.feedForward(outputs, network.levels[i]);
    }

    return outputs;
  }
}

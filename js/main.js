import { Car } from "./classes/Car.js";
import { Road } from "./classes/Road.js";
import { Visualizer } from "./classes/Visualizer.js";

// === Canvas Setup ===
const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200; // Narrow canvas to focus on lane view

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300; // Wider canvas for neural network visualization

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

// === Road Setup ===
const roadX = carCanvas.width / 2; // Road is centered on the canvas
const roadWidth = carCanvas.width * 0.9; // Road occupies 90% of canvas width
const road = new Road(roadX, roadWidth);

// === Car Parameters ===
const carX = road.getLaneCenter(1); // Start car in lane 1 (middle lane)
const carY = 100; // Starting y-position
const carHeight = 30;
const carWidth = 50;
const maxCarSpeed = 3;
const carControlType = "AI"; // Let neural network control the car

// === Generate N Cars ===
const N = 100; // Number of AI cars to spawn
const cars = generateCars(N);
let bestCar = cars[0]; // Track which car is performing best (farthest ahead)

// === Load Saved "Best Brain" From LocalStorage ===
if (localStorage.getItem("bestBrain")) {
  bestCar.neuralNetwork = JSON.parse(
    (bestCar.neuralNetwork = JSON.parse(localStorage.getItem("bestBrain")))
  );
}

// === Dummy Traffic Cars (Obstacles) ===
const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, 2, "DUMMY"), // Parked car ahead
];

animate(); // Start the simulation loop

// === Save Best Neural Network to LocalStorage ===
function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.neuralNetwork));
}

// === Discard Saved Neural Network ===
function discard() {
  localStorage.removeItem("bestBrain");
}

// === Generate Multiple AI Cars ===
// Returns an array of cars with identical starting position and brains
function generateCars(nCars) {
  const cars = [];
  for (let i = 1; i <= nCars; i++) {
    cars.push(
      new Car(carX, carY, carHeight, carWidth, maxCarSpeed, carControlType)
    );
  }
  return cars;
}

// === Main Animation Loop ===
function animate(time) {
  // Update traffic (they don't avoid collisions, just move forward)
  traffic.forEach((car) => {
    car.update(road.borders, []);
  });

  // Update all AI cars and check for collisions
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }

  // Determine which car is farthest ahead (minimum y-value)
  bestCar = cars.find((car) => car.y == Math.min(...cars.map((c) => c.y)));

  // Resize canvases for full-height rendering each frame
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  // === Camera Follow System ===
  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  // === Draw Scene ===
  road.draw(carCtx);

  // Draw traffic (red cars)
  traffic.forEach((car) => {
    car.draw(carCtx, "red");
  });

  // Draw all cars with low opacity for a "ghost" effect
  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "blue");
  }
  carCtx.globalAlpha = 1;

  // Draw the best car fully opaque and highlighted
  bestCar.draw(carCtx, "blue", true);

  carCtx.restore();

  // === Neural Network Visualization ===
  networkCtx.lineDashOffset = -time / 50; // Animate connection lines
  Visualizer.drawNetwork(networkCtx, bestCar.neuralNetwork);

  // Continue animation loop
  requestAnimationFrame(animate);
}

import { Car } from "./classes/Car.js";
import { Road } from "./classes/Road.js";
import { Visualizer } from "./classes/Visualizer.js";

const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

// Define the Road
const roadX = carCanvas.width / 2;
const roadWidth = carCanvas.width * 0.9;
const road = new Road(roadX, roadWidth);
// Define the Car
const carX = road.getLaneCenter(1);
const carY = 100;
const carHeight = 30;
const carWidth = 50;
const maxCarSpeed = 3;
const carControlType = "AI";
const car = new Car(
  carX,
  carY,
  carHeight,
  carWidth,
  maxCarSpeed,
  carControlType
);
// Define the Traffic
const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, 2, "DUMMY")];

animate();

function animate() {
  traffic.forEach((car) => {
    car.update(road.borders, []);
  });
  car.update(road.borders, traffic);

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -car.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  traffic.forEach((car) => {
    car.draw(carCtx);
  });
  car.draw(carCtx);

  carCtx.restore();

  Visualizer.drawNetwork(networkCtx, car.neuralNetwork);
  requestAnimationFrame(animate);
}

import { Car } from "./classes/Car.js";
import { Road } from "./classes/Road.js";

const canvas = document.getElementById("mainCanvas");
canvas.width = 200;

const drawingContext = canvas.getContext("2d");

// Define the Road
const roadX = canvas.width / 2;
const roadWidth = canvas.width * 0.9;
const road = new Road(roadX, roadWidth);
// Define the Car
const carX = road.getLaneCenter(1);
const carY = 100;
const carHeight = 30;
const carWidth = 50;
const car = new Car(carX, carY, carHeight, carWidth);

animate();

function animate() {
  car.update(road.borders);

  canvas.height = window.innerHeight;

  drawingContext.save();
  drawingContext.translate(0, -car.y + canvas.height * 0.7);

  road.draw(drawingContext);
  car.draw(drawingContext);

  drawingContext.restore();
  requestAnimationFrame(animate);
}

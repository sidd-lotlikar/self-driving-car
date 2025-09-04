const canvas = document.getElementById("mainCanvas");
canvas.height = window.innerHeight;
canvas.width = 200;

const drawingContext = canvas.getContext("2d");

const carX = 100;
const carY = 100;
const carHeight = 30;
const carWidth = 50;
const car = new Car(carX, carY, carHeight, carWidth);

car.draw(drawingContext);

# Math, AI, and Rendering Concepts Behind the Self-Driving Car Simulation

This document explains the **math**, **AI techniques**, and **rendering system** used in this project.  
Instead of just describing the code, it walks through the **problem → approach → solution** process to show how each piece came together.

---

## The Problem

How can we simulate a self-driving car in a way that is both **realistic** and **simple enough to run in a browser**?  
We need:

- Motion physics that feel believable (acceleration, friction, turning)
- Collision detection with road borders and traffic
- A way for the car to "see" its environment
- An AI brain that can make steering and throttle decisions in real time
- A rendering system that visualizes everything clearly

---

## The Approach

We broke the problem into layers:

1. **Car Physics:** Model the car as a moving rectangle with speed, friction, and steering.
2. **Environment:** Represent the road and traffic as polygons.
3. **Perception:** Cast rays (like LIDAR) to detect distance to obstacles.
4. **Decision Making:** Feed those distances into a neural network to produce driving actions.
5. **Visualization:** Render everything on an HTML5 Canvas for debugging and learning.

---

## Core Math Concepts

### 1. Trigonometry for Motion

We update the car's position based on its angle and speed:

```
x -= sin(angle) * speed
y -= cos(angle) * speed
```

This means the car moves in the direction it is facing rather than just left/right/up/down.

---

### 2. Polygon Collision Detection

Each car is represented as a four-point polygon.  
Each frame, we check:

```
if polysIntersect(carPolygon, borderPolygon):
    car.damaged = true
```

This ensures collisions with road borders or traffic cars stop the car.

---

### 3. Linear Interpolation (`lerp`)

We use `lerp` to space out lane centers and sensor rays evenly:

```
lerp(A, B, t) = A + (B - A) * t
```

Example: if `A=0`, `B=100`, and `t=0.5`, result = 50 (middle point).

---

### 4. Ray Casting (Virtual Sensors)

For each ray:

```
start = car position
end   = start + direction * rayLength
check intersections with borders/traffic
take closest intersection as sensor reading
```

Output is normalized to [0, 1] where 1 = very close.

ASCII representation:

```
Car --> |-----------x
        ^           ^
      start      intersection
```

---

## Neural Network (AI Brain)

### Architecture

We built a very small feed-forward network:

```
Inputs (5)  -->  Hidden Layer (6)  -->  Outputs (4)
[sensor rays]    [weighted sums]      [F / L / R / B]
```

Where outputs map to controls:  
`[Forward, Left, Right, Backward]`.

### Algorithm

For each layer:

```
sum = Σ(input[i] * weight[i][j])
if sum > bias[j]: output[j] = 1
else:             output[j] = 0
```

This gives a set of binary on/off signals that control the car.

---

## Canvas Rendering System

### 1. Camera and Translation

We "move" the camera instead of the road by translating the canvas context:

```
ctx.translate(0, -car.y + canvas.height * 0.7)
```

This keeps the car near the bottom of the screen while the world scrolls past.

---

### 2. Draw Order

Each frame is drawn in this order:

```
1. Road and lane markers
2. Traffic cars
3. Player/AI car
4. Sensor rays (so they appear above everything else)
```

This ensures a clean, layered look.

---

### 3. Neural Network Visualization

We also draw the network live:

```
(inputs) ---o---o---o--- (hidden layer) ---o---o--- (outputs)
     \       |    |           |   |                  \------o----o-----------o---o-------------o
```

- Lines change color based on weight sign (+ = red, - = blue)
- Line transparency shows strength
- Output nodes light up when active

This makes the "thinking process" of the AI visible.

---

## Solution & Learning Outcomes

By combining **geometry**, **trigonometry**, **ray casting**, and a **tiny neural network**,  
we created a self-driving car simulation that runs entirely in the browser.

### Key Takeaways

- Geometry + simple physics = believable vehicle motion
- Ray casting is a lightweight way to simulate sensors
- Even a small network can control a car
- Canvas lets us visualize both the simulation and the AI brain in real time
- Debugging becomes easier when you can see what the AI "sees"

This project is a great foundation for experimenting with genetic algorithms or reinforcement learning to evolve better drivers.

---

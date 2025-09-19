#  Math & AI Concepts Behind the Self-Driving Car Simulation

This document explains the **mathematical foundations**, **AI techniques**, and **design decisions** used to build this project.  
Rather than just describing the code, this walks through the **problem → approach → solution** process to show how each piece came together.

---

## The Problem

How can we simulate a self-driving car in a way that is both **realistic** and **simple enough to run in a browser**?  
We need:

- Motion physics that feel believable (acceleration, friction, turning)
- Collision detection with road borders and traffic
- A way for the car to "see" its environment
- An AI brain that can make steering and throttle decisions in real time

---

## The Approach

Our approach was to break the problem into layers:

1. **Car Physics:** Model the car as a moving rectangle with speed, friction, and steering.
2. **Environment:** Represent the road and traffic as polygons.
3. **Perception:** Cast rays (like LIDAR) to detect distance to obstacles.
4. **Decision Making:** Feed those distances into a neural network to produce driving actions.
5. **Visualization:** Render everything on an HTML5 Canvas for debugging and learning.

---

## Core Math Concepts

### 1. Trigonometry for Motion

We use basic trigonometry to update car position based on its angle:

```
x -= sin(angle) * speed
y -= cos(angle) * speed
```

This allows the car to move **in the direction it’s facing**, not just up/down/left/right.

<p align="center">
  <img src="https://i.imgur.com/rGh9uyn.png" width="350" alt="Trigonometry Diagram"/>
</p>

### 2. Polygon Collision Detection

- The car is represented as a **rotated polygon** (4 corner points).
- Road borders and traffic cars are also polygons.
- We check for intersections between polygons using a custom `polysIntersect()` function.

<p align="center">
  <img src="https://i.imgur.com/PlA7G3a.png" width="450" alt="Polygon Collision Detection"/>
</p>

### 3. Linear Interpolation (`lerp`)

We use `lerp()` to:

- Space out **lane centers**
- Evenly distribute **sensor rays** between leftmost and rightmost angles

```
lerp(A, B, t) = A + (B - A) * t
```

This gives smooth, evenly spaced points.

### 4. Ray Casting (Virtual Sensors)

Each sensor ray extends outward from the car and stops at the first collision.  
We then normalize its distance (0 = no hit, 1 = very close) to feed into the neural network.

<p align="center">
  <img src="https://i.imgur.com/dYd0Y9D.png" width="500" alt="Ray Casting Visual"/>
</p>

---

## Neural Network (AI Brain)

### Architecture

We built a **lightweight feed-forward neural network** from scratch:

<p align="center">
  <img src="https://i.imgur.com/XBoG5TJ.png" width="500" alt="Neural Network Diagram"/>
</p>

- **Inputs:** One per sensor ray (5 total)
- **Hidden Layer:** 6 neurons
- **Outputs:** 4 neurons → forward, left, right, reverse

### Algorithm

For each layer:

1. Compute weighted sum of inputs:  
   \( sum = \sum input*i \times weight*{i,j} \)
2. Compare with bias → output is **1** if `sum > bias`, otherwise \*\*0`.

This produces a binary decision for each control.

---

## Visualization

We draw everything on a canvas to make debugging intuitive:

- Car polygons (turn orange when damaged)
- Road borders & lanes
- Sensor rays (yellow until they hit something)
- Neural network activity (colored connections based on weight sign & strength)

<p align="center">
  <img src="https://i.imgur.com/gyQWUpK.png" width="500" alt="Canvas Visualization Example"/>
</p>

---

## Solution & Learning Outcomes

By combining **math (trigonometry, geometry, interpolation)** and **AI (neural networks)**, we created a working simulation where cars can drive themselves.

**Key takeaways:**

- Geometry + simple physics = believable vehicle movement
- Ray casting is a powerful way to simulate perception
- Even a tiny neural network can control a car in real time
- Visualizing data makes debugging and learning much easier

This project serves as a foundation for experimenting with **genetic algorithms**, **reinforcement learning**, or more advanced planning strategies.

---

> **Next Steps:** Try evolving the neural network weights over generations to make better drivers!

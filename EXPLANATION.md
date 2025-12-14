# Boid Simulation

## What are Boids?

Boids are artificial life programs that simulate the flocking behavior of birds (the name "boid" comes from "bird-oid").

Created by Craig Reynolds in 1986, boids follow three simple rules that create complex, emergent flocking behavior.

Watch the following videos to see flocking in real life:

1. [Nature's Mystery: Watch the Hypnotic Dance of a Starling Murmuration](https://www.youtube.com/watch?v=X0sE10zUYyY)
2. [AMAZING Bird Flocks! | BBC Earth Explore](https://www.youtube.com/watch?v=DLuEwFblaN4)
3. [I Didn't know Birds use Math in Murmurations! - Smarter Every Day 234](https://www.youtube.com/watch?v=4LWmRuB-uNU) [MUST WATCH]
4. [Coding Adventure: Boids - Sebastian Lague](https://www.youtube.com/watch?v=bqtqltqcQhw)
5. [Coding Challenge 124: Flocking Simulation - The Coding Train](https://youtu.be/mhjuuHl6qHM?si=E0MJESbHd8gApArA)

## Architecture Overview

This is the core execution, everything apart from this is extra or for utility:

<img src="media/main_loop.png">

## Module Breakdown

### 1. **Vec (Vector) - `src/utils/vector.js`**

**Purpose:** Mathematical foundation for 2D movement

**Key Concepts:**

- Represents a point or direction in 2D space (x, y)
- Provides vector operations: add, subtract, multiply, divide
- `limit()`: Caps vector magnitude (prevents infinite speed)
- `dist()`: Calculates distance between two points

**Why it matters:** All boid movement is based on vector math!

```javascript
// Example: Adding velocity to position
position.add(velocity); // moves the boid
```

### 2. **Boid - `src/core/boid.js`**

**Purpose:** Individual agent with autonomous behavior

#### Properties:

- `position`: Where the boid is
- `velocity`: Direction and speed of movement
- `acceleration`: Force being applied this frame
- `maxSpeed`: Speed limit
- `maxForce`: Maximum steering force

#### The Three Core Rules:

<img src="media/prop.png">

##### **Rule 1: Separation**

```
Goal: Avoid crowding neighbors
Logic:
  - For each nearby boid (within 30 pixels)
  - Calculate vector pointing away from it
  - Stronger push when closer (divide by distance)
  - Average all repulsion forces
```

##### **Rule 2: Alignment**

```
Goal: Steer toward average heading of neighbors
Logic:
  - For each neighbor within visual range
  - Sum up their velocities
  - Average them
  - This becomes your desired direction
```

##### **Rule 3: Cohesion**

```
Goal: Move toward the center of mass of neighbors
Logic:
  - Find average position of all neighbors
  - Calculate vector pointing toward that center
  - This "pulls" the boid toward the group
```

#### Update Cycle:

<img src="media/boid_update.png">

1. Apply acceleration to velocity
2. Limit velocity to max speed
3. Apply velocity to position
4. Reset acceleration to zero
5. Update trail (if enabled)

### 3. **Flock - `src/core/flock.js`**

**Purpose:** Collection manager that applies rules to all boids

#### The Step Function:

```
For each boid:
  1. Calculate separation force × weight
  2. Calculate alignment force × weight
  3. Calculate cohesion force × weight
  4. Apply all forces to the boid
```

**Key Insight:** The weights (from CONFIG) let you tune behavior:

- High separation -> boids spread out
- High alignment -> synchronized movement
- High cohesion -> tight flocks

### 4. **Simulation - `src/core/simulation.js`**

**Purpose:** Game loop orchestration and world boundaries

#### Responsibilities:

1. **Step the flock:** Trigger force calculations
2. **Update boids:** Apply physics
3. **Wrap positions:** Implement "toroidal" world (Pac-Man effect)

#### Wrapping Logic:

```
If boid exits left ->> reappear on right
If boid exits top ->> reappear on bottom
(And clear trail to avoid visual artifacts)
```

### 5. **CanvasRenderer - `src/render/canvasRenderer.js`**

**Purpose:** Visual representation

#### Rendering Pipeline:

1. Clear canvas
2. For each boid:
   - Draw trail (if enabled)
   - Draw velocity vector (if enabled)
   - Draw boid as colored circle

### 6. **VectorRenderer - `src/render/vectorRenderer.js`**

**Purpose:** Debug visualization of velocity

Draws an arrow showing:

- Direction of movement
- Speed (arrow length)

### 7. **Controls - `src/ui/controls.js`**

**Purpose:** User interface for tweaking simulation

Features:

- Toggle velocity vectors
- Adjust simulation speed
- Monitor FPS (frames per second)

## The Main Loop (`main.js`)

```
1. Initialize:
   - Create canvas
   - Spawn boids at random positions
   - Create flock, simulation, renderer, controls

2. Loop (60 times per second):
   - sim.step() -> Calculate forces & update positions
   - renderer.render() -> Draw everything
   - controls.updateFrame() -> Update FPS counter
   - requestAnimationFrame() -> Schedule next frame
```

## Configuration (`config.js`)

**Tunable Parameters:**

| Parameter | Effect |
| |- |
| `boidCount` | Number of boids |
| `maxSpeed` | Top speed limit |
| `maxForce` | Steering agility |
| `visualRange` | How far boids can "see" |
| `separationWeight` | Personal space priority |
| `alignmentWeight` | Synchronization priority |
| `cohesionWeight` | Group attraction priority |

**Experiment:** Try `separationWeight: 5` for scattered behavior or `cohesionWeight: 5` for tight flocks!

Here's a comprehensive section to add to your explanation.md file:

## How to Add Features & Fix Bugs

This section will help you understand how to enhance the simulation, add new features, or fix bugs effectively.

<img src="media/feature_add.png">

### Understanding the Data Flow

Before making changes, understand how data flows through the system:+

<img src="media/data_flow.png">

### Common Modification Patterns

#### 1. **Adding a New Boid Behavior**

**Where:** `src/core/boid.js`

**Pattern:**

```javascript
newBehavior(neighbors) {
  const effectRange = CONFIG.someRange; // Use CONFIG for tunability
  let steer = new Vec(0, 0);
  let count = 0;

  for (let other of neighbors) {
    const d = Vec.dist(this.position, other.position);
    if (other !== this && d < effectRange) {
      // Calculate your force here
      // steer.add(someForce);
      count++;
    }
  }

  if (count > 0) steer.div(count); // Average if needed
  steer.limit(this.maxForce); // Always limit!
  return steer;
}
```

**Then apply it in:** `src/core/flock.js`

```javascript
step() {
  for (let b of this.boids) {
    const neighbors = this.boids;

    // ... existing forces ...
    const newForce = b.newBehavior(neighbors).mult(CONFIG.newBehaviorWeight);
    b.applyForce(newForce);
  }
}
```

**Don't forget:** Add `newBehaviorWeight: 1.0` to `config.js`

#### 2. **Adding a New CONFIG Parameter**

**Step 1:** Add to `config.js`

```javascript
const CONFIG = {
  // ... existing ...
  myNewParameter: 50,
};
```

**Step 2:** Use it in your code

```javascript
const range = CONFIG.myNewParameter;
```

**Step 3:** (Optional) Add UI control in `src/ui/controls.js`

```javascript
createUI() {
  // ... existing controls ...
  this.gui.add(CONFIG, 'myNewParameter', 0, 100, 1)
    .name('My Parameter');
}
```

#### 3. **Adding Properties to Individual Boids**

**Where:** `src/core/boid.js` constructor

```javascript
constructor(x, y) {
  // ... existing properties ...

  // Add your new property
  this.myProperty = initialValue;
}
```

**Update it in:** `update()` method or relevant behavior method

```javascript
update() {
  // ... existing code ...
  this.myProperty += someChange;
}
```

#### 4. **Adding Visual Effects**

**Where:** `src/render/canvasRenderer.js`

<img src="media/renderer.png">

**For per-boid effects:**

```javascript
drawBoid(boid, showVectors = true) {
  const ctx = this.ctx;

  // Add your visual effect here
  ctx.strokeStyle = '#yourColor';
  ctx.beginPath();
  // ... your drawing code ...
  ctx.stroke();

  // ... existing boid drawing ...
}
```

**For global effects:**

```javascript
render(controls) {
  // Draw before boids (background layer)
  this.drawMyBackgroundEffect();

  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  // Draw boids
  for (let b of this.flock.boids) this.drawBoid(b, showVectors);

  // Draw after boids (foreground layer)
  this.drawMyForegroundEffect();
}
```

#### 5. **Adding Vector Math Operations**

**Where:** `src/utils/vector.js`

**Pattern:**

```javascript
myOperation() {
  // Modify this vector
  this.x = /* your calculation */;
  this.y = /* your calculation */;
  return this; // Enable chaining
}

static myStaticOperation(vec1, vec2) {
  // Return a NEW vector
  return new Vec(/* calculation */);
}
```

**Usage:**

```javascript
// Instance method (modifies original)
myVector.myOperation();

// Static method (creates new vector)
const result = Vec.myStaticOperation(vec1, vec2);
```

### Debugging Tips

#### 1. **Visualize Forces**

Add temporary drawing code to see what's happening:

```javascript
// In canvasRenderer.js drawBoid()
ctx.strokeStyle = "#ff0000";
ctx.beginPath();
ctx.moveTo(boid.position.x, boid.position.y);
ctx.lineTo(
  boid.position.x + someForce.x * 20,
  boid.position.y + someForce.y * 20
);
ctx.stroke();
```

#### 2. **Console Logging**

```javascript
// In boid.js
if (this.id === 0) {
  // Only log first boid to avoid spam
  console.log("Force magnitude:", steer.mag());
}
```

#### 3. **Check Force Magnitudes**

Forces that are too large cause chaos, too small do nothing:

```javascript
const force = this.myBehavior(neighbors);
console.log("Force mag:", Math.sqrt(force.x * force.x + force.y * force.y));
// Typical range: 0.01 - 0.1
```

### Performance Considerations

#### When Adding Features:

1. **Avoid nested loops** in `step()` - it's already O(n²)
2. **Limit distance calculations** - they use `Math.sqrt()` which is expensive
3. **Use squared distance** when you only need comparisons:
   ```javascript
   const distSq = dx * dx + dy * dy;
   if (distSq < range * range) {
     // Avoids sqrt!
     // ...
   }
   ```
4. **Don't allocate objects in hot loops**:

   ```javascript
   // BAD (creates new Vec every frame for every boid)
   for (let i = 0; i < 1000; i++) {
     let v = new Vec(0, 0);
   }

   // GOOD (reuse)
   let v = new Vec(0, 0);
   for (let i = 0; i < 1000; i++) {
     v.x = 0;
     v.y = 0;
   }
   ```

### Common Bugs & How to Fix Them

#### Bug: Boids explode/scatter infinitely

**Cause:** Force not limited or weight too high
**Fix:**

```javascript
steer.limit(this.maxForce); // Add this!
// OR reduce weight in CONFIG
```

#### Bug: Boids don't move

**Cause:** Forgot to apply force or update is broken
**Fix:** Check that `applyForce()` is called and `update()` runs

#### Bug: Trail doesn't follow boid

**Cause:** Trail cleared at wrong time or positions not updating
**Fix:** Check `wrap()` clears trail, ensure `position.add(velocity)` runs

#### Bug: Vectors point in wrong direction

**Cause:** X and Y swapped in canvas coordinates
**Fix:** Canvas uses (x, y) not (y, x) - check your `moveTo/lineTo` calls

#### Bug: Performance degrades over time

**Cause:** Memory leak (array growing indefinitely)
**Fix:** Ensure arrays have max size (like `trail.length > CONFIG.trailLength`)

### Testing Your Changes

#### 1. **Isolation Test**

Test your feature with minimal boids first:

```javascript
// In config.js
boidCount: 10, // Start small!
```

#### 2. **Extreme Values Test**

Try extreme CONFIG values to find edge cases:

```javascript
separationWeight: 0,    // Should cluster
separationWeight: 10,   // Should scatter
```

#### 3. **Visual Inspection**

Enable vectors to see if forces make sense:

- Toggle "Show Vectors" in UI
- Forces should point in logical directions

#### 4. **Performance Test**

```javascript
// In main.js, before loop()
console.time("frame");
function loop() {
  sim.step();
  renderer.render(controls);
  console.timeEnd("frame");
  console.time("frame");
  // ...
}
```

Aim for < 16ms per frame (60 FPS)

### Example: Adding a Complete Feature

Let's add "Boid Hunger System" from scratch:

**Step 1:** Add CONFIG parameters

```javascript
// config.js
hungerEnabled: true,
hungerRate: 0.1,
starvationThreshold: 20,
```

**Step 2:** Add boid properties

```javascript
// boid.js constructor
this.hunger = 100; // Full at start
```

**Step 3:** Update hunger each frame

```javascript
// boid.js update()
update() {
  // ... existing code ...

  if (CONFIG.hungerEnabled) {
    this.hunger -= CONFIG.hungerRate;
    this.hunger = Math.max(0, this.hunger);

    // Slow down when hungry
    if (this.hunger < CONFIG.starvationThreshold) {
      this.maxSpeed = CONFIG.maxSpeed * 0.5;
    } else {
      this.maxSpeed = CONFIG.maxSpeed;
    }
  }
}
```

**Step 4:** Visualize it

```javascript
// canvasRenderer.js drawBoid()
// Change color based on hunger
if (CONFIG.hungerEnabled) {
  const hungerRatio = boid.hunger / 100;
  ctx.fillStyle = hungerRatio > 0.5 ? boid.color : "#666666";
} else {
  ctx.fillStyle = boid.color;
}
```

**Step 5:** Add UI controls

```javascript
// controls.js createUI()
const hungerFolder = this.gui.addFolder("Hunger System");
hungerFolder.add(CONFIG, "hungerEnabled").name("Enable Hunger");
hungerFolder.add(CONFIG, "hungerRate", 0, 1, 0.01).name("Hunger Rate");
hungerFolder.add(CONFIG, "starvationThreshold", 0, 100, 5).name("Starve At");
```

Done! You've added a complete feature.

### Getting Help

**Before asking:**

1. Check the browser console for errors (F12)
2. Add `console.log()` to trace your code's execution
3. Compare your code to existing behaviors (separation, alignment, cohesion)

**When asking for help, provide:**

1. What you're trying to achieve
2. What's happening instead
3. Relevant code snippet
4. Any console errors

### Quick Reference: File Responsibilities

| File | What to edit here |
|- | |
| `boid.js` | Behavior algorithms, boid properties |
| `flock.js` | How forces are applied, force combinations |
| `simulation.js` | World boundaries, global rules |
| `canvasRenderer.js` | Visual appearance, effects |
| `vectorRenderer.js` | Debug visualizations |
| `controls.js` | UI controls, user input |
| `vector.js` | Math operations |
| `config.js` | Tunable parameters |
| `main.js` | Initialization, main loop |

**Remember:** The best way to learn is to experiment! Try breaking things, see what happens, and piece together why. The simulation is resilient - you can always refresh to reset.

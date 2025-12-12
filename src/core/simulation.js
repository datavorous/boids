class Simulation {
  constructor(flock, width, height) {
    this.flock = flock;
    this.width = width;
    this.height = height;
  }

  wrap(boid) {
    let wrapped = false;
    if (boid.position.x < 0) {
      boid.position.x = this.width;
      wrapped = true;
    }
    if (boid.position.x > this.width) {
      boid.position.x = 0;
      wrapped = true;
    }
    if (boid.position.y < 0) {
      boid.position.y = this.height;
      wrapped = true;
    }
    if (boid.position.y > this.height) {
      boid.position.y = 0;
      wrapped = true;
    }

    if (wrapped && CONFIG.trailEnabled) {
      boid.trail = [];
    }
  }

  step(currentSpeed) {
    this.flock.step();

    for (let boid of this.flock.boids) {
      boid.maxSpeed = CONFIG.maxSpeed * currentSpeed;

      boid.update();
      this.wrap(boid);
    }
  }
}

class Simulation {
  constructor(flock, width, height) {
    this.flock = flock;
    this.width = width;
    this.height = height;

    const validBehaviors = Object.values(CONFIG.EDGE_BEHAVIORS);
    if (!validBehaviors.includes(CONFIG.edgeBehavior))
      console.warn("Unknown edge behavior, Falling back to WRAP");
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

  bounce(boid) {
    const margin = 10;
    if (boid.position.x < margin || boid.position.x > this.width - margin) {
      boid.velocity.x *= -1;
    }
    if (boid.position.y < margin || boid.position.y > this.height - margin) {
      boid.velocity.y *= -1;
    }
  }

  avoid(boid) {
    const margin = 75;
    const force = new Vec(0, 0);

    if (boid.position.x < margin) {
      force.x += (margin - boid.position.x) / margin;
    } else if (boid.position.x > this.width - margin) {
      force.x -= (boid.position.x - (this.width - margin)) / margin;
    }

    if (boid.position.y < margin) {
      force.y += (margin - boid.position.y) / margin;
    } else if (boid.position.y > this.height - margin) {
      force.y -= (boid.position.y - (this.height - margin)) / margin;
    }

    // To make it stronger than other forces
    const maxStrength = boid.maxForce * 2.5;
    force.limit(maxStrength);
    boid.applyForce(force);
  }

  handleEdges(boid) {
    if (CONFIG.edgeBehavior == CONFIG.EDGE_BEHAVIORS.WRAP) {
      this.wrap(boid);
    } else if (CONFIG.edgeBehavior == CONFIG.EDGE_BEHAVIORS.BOUNCE) {
      this.bounce(boid);
    } else if (CONFIG.edgeBehavior == CONFIG.EDGE_BEHAVIORS.AVOID) {
      this.avoid(boid);
    } else {
      this.wrap(boid);
    }
  }
  reset() {
    this.flock.reset(this.width, this.height);
  }
  step() {
    this.flock.step();

    for (let boid of this.flock.boids) {
      boid.update();
      this.handleEdges(boid);
    }
  }
}

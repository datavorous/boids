class Flock {
  constructor(boids, grpboids, width, height) {
    this.boids = boids;
    this.width = width;
    this.height = height;
    this.grpboids = grpboids;
    this.flockCount = CONFIG.flockCount;
  }

  reset(w, h) {
    this.boids.length = 0;
    this.grpboids = [];

    for (let i = 0; i < CONFIG.boidCount; i++) {
      this.boids.push(new Boid(Math.random() * w, Math.random() * h));
    }
  }

  applyFlockChange(v) {
    let newgrpboids = [];
    for (let g = 0; g < v; g++) {
      newgrpboids[g] = [];
    }

    for (let i = 0; i < allBoids.length; i++) {
      let b = allBoids[i];
      b.group = i % v;
      b.color = CONFIG.colors[i % v];
      newgrpboids[i % v].push(b);
    }
    flock.grpboids = newgrpboids;
  }

  step(quad) {
    for (let b of this.boids) {
      const neighbors = this.boids;
      const groupNeighbors = this.grpboids[b.group];

      const sep = b.separation(neighbors);
      const ali = b.alignment(groupNeighbors);
      const coh = b.cohesion(groupNeighbors);
      const wan = b.wander(CONFIG.wanderAngle);
      const mas = b
        .cohesion(neighbors)
        .mult(b.mass / 1000)
        .mult(CONFIG.massBasedClusteringFactor);

      b.applyForce(sep, CONFIG.separationWeight);
      b.applyForce(ali, CONFIG.alignmentWeight);
      b.applyForce(coh, CONFIG.cohesionWeight);
      b.applyForce(wan, CONFIG.wanderWeight);
      b.applyForce(mas);
      let C = new Circle(
        b.position.x,
        b.position.y,
        b.radius + CONFIG.maxRadius
      );
      const others = quad.query(C);
      for (let p of others) {
        const other = p.userData;
        if (
          other != b &&
          b.intersection(other) &&
          this.boids.indexOf(other) > this.boids.indexOf(b)
        ) {
          b.collision(other);
        }
      }
    }
  }
}

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

  step() {
    for (let b of this.boids) {
      const neighbors = this.boids;
      const groupNeighbors = this.grpboids[b.group];

      const sep = b.separation(neighbors).mult(CONFIG.separationWeight);
      const ali = b.alignment(groupNeighbors).mult(CONFIG.alignmentWeight);
      const coh = b.cohesion(groupNeighbors).mult(CONFIG.cohesionWeight);
      const wan = b.wander(CONFIG.wanderAngle).mult(CONFIG.wanderWeight);
      const mas = b
        .cohesion(neighbors)
        .mult(b.mass / 1000)
        .mult(CONFIG.massBasedClusteringFactor);

      b.applyForce(sep);
      b.applyForce(ali);
      b.applyForce(coh);
      b.applyForce(wan);
      b.applyForce(mas);
    }
  }
}

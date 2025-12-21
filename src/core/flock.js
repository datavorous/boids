class Flock {
   constructor(boids,grpboids, width, height) {
    this.boids = boids;
    this.width = width;
    this.height = height;
    this.grpboids = grpboids;
  }

  reset() {
    this.boids.length = 0;

    for (let i = 0; i < CONFIG.boidCount; i++) {
      this.boids.push(
        new Boid(Math.random() * this.width, Math.random() * this.height)
      );
    }
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

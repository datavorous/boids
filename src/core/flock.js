class Flock {
  constructor(boids) {
    this.boids = boids;
  }

  step() {
    for (let b of this.boids) {
      const neighbors = this.boids;

      const sep = b.separation(neighbors).mult(CONFIG.separationWeight);
      const ali = b.alignment(neighbors).mult(CONFIG.alignmentWeight);
      const coh = b.cohesion(neighbors).mult(CONFIG.cohesionWeight);
      const wan = b.wander(CONFIG.wanderAngle).mult(CONFIG.wanderWeight);

      b.applyForce(sep);
      b.applyForce(ali);
      b.applyForce(coh);
      b.applyForce(wan);
    }
  }
}

class Boid {
  constructor(x, y, group) {
    this.position = new Vec(x, y);

    const angle = Math.random() * Math.PI * 2;
    const massVariationFactor = CONFIG.massVariation || 30;
    const baseMass = CONFIG.baseMass || 1;

    this.mass = baseMass + massVariationFactor * Math.random();

    this.velocity = new Vec(Math.cos(angle), Math.sin(angle));
    this.acceleration = new Vec(0, 0);

    this.maxSpeed = CONFIG.maxSpeed;
    this.maxForce = CONFIG.maxForce;

    this.trail = [];

    const colors = ["#f38ba8", "#a6e3a1", "#89b4fa", "#fddd6bff", "#df68fdff"];
    this.group = group;
    this.color = colors[group];
  }

  applyForce(force, weight = 1.0) {
    this.acceleration.add(force.mult(weight));
  }

  update() {
    this.velocity.add(this.acceleration).limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);

    if (CONFIG.trailEnabled) {
      this.trail.push({ x: this.position.x, y: this.position.y });
      if (this.trail.length > CONFIG.trailLength) {
        this.trail.shift();
      }
    }
  }

  separation(neighbors) {
    const desiredDist = CONFIG.separationDistance || 30;
    let steer = new Vec(0, 0);
    let count = 0;

    for (let other of neighbors) {
      const d = Vec.dist(this.position, other.position);
      if (other !== this && d < desiredDist) {
        let diff = new Vec(
          this.position.x - other.position.x,
          this.position.y - other.position.y
        );
        diff.div(d);
        steer.add(diff);
        count++;
      }
    }

    if (count > 0) steer.div(count);

    if (steer.x !== 0 || steer.y !== 0) {
      steer.limit(this.maxForce);
    }

    return steer;
  }

  alignment(neighbors) {
    const neighDist = CONFIG.visualRange;
    let sum = new Vec(0, 0);
    let count = 0;

    for (let other of neighbors) {
      const d = Vec.dist(this.position, other.position);
      if (other !== this && d < neighDist) {
        sum.add(other.velocity);
        count++;
      }
    }

    if (count > 0) {
      sum.div(count);
      sum.limit(this.maxForce);
      return sum;
    }

    return new Vec(0, 0);
  }

  cohesion(neighbors) {
    const neighDist = CONFIG.visualRange;
    let center = new Vec(0, 0);
    let count = 0;

    for (let other of neighbors) {
      const d = Vec.dist(this.position, other.position);
      if (other !== this && d < neighDist) {
        center.add(other.position);
        count++;
      }
    }

    if (count > 0) {
      center.div(count);
      const desired = new Vec(
        center.x - this.position.x,
        center.y - this.position.y
      );
      desired.limit(this.maxForce);
      return desired;
    }

    return new Vec(0, 0);
  }

  wander(smallAngle) {
    let randomForce = new Vec(0, 0);
    const bias = 3;
    const angle =
      Math.pow(Math.random() - 0.5, bias) *
      Math.abs(smallAngle) *
      Math.pow(2, bias);

    const x = this.velocity.x / this.velocity.mag() + 0.0001;
    const y = this.velocity.y / this.velocity.mag() + 0.0001;

    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    randomForce.x = x * cos - y * sin;
    randomForce.y = x * sin + y * cos;

    randomForce.limit(this.maxForce);

    return randomForce;
  }
}

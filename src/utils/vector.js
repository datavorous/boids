class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }
  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }
  mult(n) {
    this.x *= n;
    this.y *= n;
    return this;
  }
  div(n) {
    this.x /= n;
    this.y /= n;
    return this;
  }

  limit(max) {
    const magSq = this.x * this.x + this.y * this.y;
    if (magSq > max * max) {
      const mag = Math.sqrt(magSq);
      this.x = (this.x / mag) * max;
      this.y = (this.y / mag) * max;
    }
    return this;
  }

  static dist(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  normalize() {
    if (this.mag() == 0) return this;
    return this.div(this.mag());
  }

  static sub(a, b) {
    return new Vec(a.x - b.x, a.y - b.y);
  }

  static mult(v, n) {
    return new Vec(v.x * n, v.y * n);
  }

  static add(a, b) {
    return new Vec(a.x + b.x, a.y + b.y);
  }
}

class CanvasRenderer {
  constructor(canvas, flock) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.flock = flock;
    this.fadeFactor = 1;
    this.fadeStep = 0.1; //trail fading on pause [increase for faster]
  }

  drawBoid(boid, showVectors = true, isPaused = false) {
    const ctx = this.ctx;

    if (CONFIG.trailEnabled && boid.trail.length > 1) {
      ctx.strokeStyle = boid.color;
      ctx.lineWidth = 0.1 * boid.mass;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let i = 1; i < boid.trail.length; i++) {
        const init = boid.trail[i - 1];
        const final = boid.trail[i];
        const pixelbuffer = 5;
        const dist = ((final.x - init.x) ** 2 + (final.y - init.y) ** 2) ** 0.5;

        ctx.globalAlpha = (this.fadeFactor * i ** 2) / boid.trail.length ** 2;

        ctx.beginPath();
        ctx.moveTo(init.x, init.y);
        ctx.lineTo(
          init.x + (pixelbuffer / dist) * (final.x - init.x),
          init.y + (pixelbuffer / dist) * (final.y - init.y)
        );
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;
    }

    if (showVectors) {
      VectorRenderer.drawVelocityVector(ctx, boid);
    }

    ctx.fillStyle = boid.color;
    ctx.beginPath();
    ctx.arc(boid.position.x, boid.position.y, 0.05 * boid.mass, 0, Math.PI * 2);
    ctx.fill();
  }

  render(controls) {
    window.addEventListener("resize", () => {
      this.canvas.width = sim.width = window.innerWidth;
      this.canvas.height = sim.height = window.innerHeight;
    });

    if (controls.isPaused()) {
      //fade logic
      this.fadeFactor = Math.max(0, this.fadeFactor - this.fadeStep); //fade out
    } else {
      this.fadeFactor = Math.min(1, this.fadeFactor + this.fadeStep); //fade in
    }
    //[SLIGHT ISSUE: THis is FPS Dependent for now [higher fps=faster fade]]

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const showVectors = controls ? controls.shouldDrawVectors() : true;
    const paused = controls ? controls.isPaused() : false;

    for (let b of this.flock.boids) this.drawBoid(b, showVectors, paused);
  }
}

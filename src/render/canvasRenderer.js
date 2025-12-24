class CanvasRenderer {
  constructor(canvas, flock, sim) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.flock = flock;
    this.fadeFactor = 1;
    this.sim = sim;
    this.fadeStep = 0.1; //trail fading on pause [increase for faster]
    console.log("CanvasRenderer ctor sim === global sim ?", this.sim === sim);
  }

  drawQuadtree(node) {
    if (node == null) return;
    const ctx = this.ctx;
    const b = node.boundary;
    ctx.strokeStyle = "#8caaee";
    ctx.lineWidth = 0.5;
    ctx.strokeRect(
      b.x - b.w, // left
      b.y - b.h, // top
      b.w * 2, // width
      b.h * 2 // height
    );
    if (node.divided) {
      this.drawQuadtree(node.northeast);
      this.drawQuadtree(node.southeast);
      this.drawQuadtree(node.northwest);
      this.drawQuadtree(node.southwest);
    }
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
    ctx.strokeStyle = "rgba(255, 0, 0, 0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(boid.position.x, boid.position.y, boid.radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  render(controls) {
    window.addEventListener("resize", () => {
      this.canvas.width = this.sim.width = window.innerWidth;
      this.canvas.height = this.sim.height = window.innerHeight;
    });

    if (controls.isPaused()) {
      //fade logic
      this.fadeFactor = Math.max(0, this.fadeFactor - this.fadeStep); //fade out
    } else {
      this.fadeFactor = Math.min(1, this.fadeFactor + this.fadeStep); //fade in
    }
    //[SLIGHT ISSUE: THis is FPS Dependent for now [higher fps=faster fade]]

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (
      this.sim &&
      this.sim.quad &&
      controls &&
      controls.shouldDrawQuadtree()
    ) {
      this.drawQuadtree(this.sim.quad);
    }
    const showVectors = controls ? controls.shouldDrawVectors() : true;
    const paused = controls ? controls.isPaused() : false;
    for (let b of this.flock.boids) this.drawBoid(b, showVectors, paused);
    //console.log("quad in render:", this.sim && this.sim.quad);
  }
}

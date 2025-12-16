class CanvasRenderer {
  constructor(canvas, flock) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.flock = flock;
  }

  drawBoid(boid, showVectors = true) {
    const ctx = this.ctx;

    if (CONFIG.trailEnabled && boid.trail.length > 1) {
      ctx.strokeStyle = boid.color;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let i = 1; i < boid.trail.length; i++) {
        const alpha = i / boid.trail.length;
        ctx.globalAlpha = Math.random();
        ctx.beginPath();
        ctx.moveTo(boid.trail[i - 1].x, boid.trail[i - 1].y);
        ctx.lineTo(boid.trail[i].x, boid.trail[i].y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;
    }

    if (showVectors) {
      VectorRenderer.drawVelocityVector(ctx, boid);
    }

    ctx.fillStyle = boid.color;
    ctx.beginPath();
    ctx.arc(boid.position.x, boid.position.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  render(controls) { 
    
    window.addEventListener('resize',() =>{
      this.canvas.width=sim.width=window.innerWidth;
      this.canvas.height=sim.height=window.innerHeight;
    })
      
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const showVectors = controls ? controls.shouldDrawVectors() : true;
    for (let b of this.flock.boids) this.drawBoid(b, showVectors);
  }
}

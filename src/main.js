const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const boids = [];

for (let i = 0; i < CONFIG.boidCount; i++) {
  boids.push(
    new Boid(Math.random() * canvas.width, Math.random() * canvas.height)
  );
}

const flock = new Flock(boids);
const sim = new Simulation(flock, canvas.width, canvas.height);
const renderer = new CanvasRenderer(canvas, flock);
const controls = new Controls();

function loop() {
  const speed = controls.getSpeed()
  for (let i = 0; i < Math.ceil(speed); i++) {
      sim.step(); 
  }
  renderer.render(controls);
  controls.updateFrame();
  requestAnimationFrame(loop);
}

loop();

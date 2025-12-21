const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const allBoids = [];
const grpboids = [];

for (let g = 0; g < CONFIG.flockCount; g++) {
  grpboids[g] = [];
}

for (let i = 0; i < CONFIG.boidCount; i++) {
  let boid = new Boid(
    Math.random() * canvas.width,
    Math.random() * canvas.height,
    i % CONFIG.flockCount
  );
  allBoids.push(boid);
  grpboids[boid.group].push(boid);
}

const flock = new Flock(allBoids, grpboids, canvas.width, canvas.height);
const sim = new Simulation(flock, canvas.width, canvas.height);
const renderer = new CanvasRenderer(canvas, flock);
const controls = new Controls();

function loop() {
  if (!controls.isPaused()) {
    const speed = controls.getSpeed() || 1;
    for (let i = 0; i < Math.ceil(speed); i++) {
      sim.step();
    }
  }
  //refactoring to fix pause trail issue

  renderer.render(controls);
  controls.updateFrame();

  requestAnimationFrame(loop);
}

loop();

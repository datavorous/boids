class Controls {
  constructor() {
    this.paused = false;
    this.vectorsEnabled = false;
    this.simulationSpeed = 1;
    this.flockCount = CONFIG.flockCount;
    this.tempFlockCount = CONFIG.flockCount;
    this.maxSpeed = CONFIG.maxSpeed;
    this.wanderAngleDeg = (CONFIG.wanderAngle * 180) / Math.PI;

    this.fps = 0;
    this.frameCount = 0;
    this.lastTime = performance.now();

    this.gui = new lil.GUI({ title: "Controls" });
    this.createUI();
    this.addListeners();

    this.startFPSCounter();
  }

  createUI() {
    this.gui.add(this, "paused").name("Pause").listen();

    this.gui.add(this, "vectorsEnabled").name("Show Vectors");

    this.gui
      .add(CONFIG, "trailEnabled")
      .name("Show Trails")
      .onChange((enabled) => {
        if (enabled) {
          flock.boids.forEach((b) => (b.trail = [])); //To fix "ghost" trails when re-enabling
        }
      });

    this.gui.add(this, "simulationSpeed", 1, 10, 1).name("Time Multiplier");

    this.gui.add(this, "fps").name("FPS").listen();
    this.gui
      .add(
        {
          reset: () => {
            sim.reset();
            flock.applyFlockChange(this.tempFlockCount);
          },
        },
        "reset"
      )
      .name("Reset");

    //Properties
    const configFolder = this.gui.addFolder("Simulation Properties");

    configFolder.add(CONFIG, "boidCount", 10, 500, 1).name("*Boid Count");
    configFolder
      .add(this, "flockCount", 1, 6, 1)
      .name("*No of Flocks")
      .onChange((v) => {
        this.tempFlockCount = v; //queue no. of flock changes
      });
    configFolder
      .add(this, "maxSpeed", 1, 10, 0.05)
      .name("Max Speed")
      .onChange(() => {
        boids.forEach((boid) => (boid.maxSpeed = this.maxSpeed));
      });
    configFolder
      .add(this, "wanderAngleDeg", 0, 90, 1)
      .name("Wander Angle (°)")
      .onChange((deg) => {
        CONFIG.wanderAngle = (deg * Math.PI) / 180;
      });

    configFolder.add(CONFIG, "visualRange", 0, 200, 1).name("Visual Range");
    configFolder
      .add(CONFIG, "separationDistance", 1, 100, 5)
      .name("Separation");
    //EDGE BEHAVIOURS
    configFolder
      .add(CONFIG, "edgeBehavior", CONFIG.EDGE_BEHAVIORS)
      .name("Edge Behavior");

    configFolder.open();

    //Weights
    const Weights = this.gui.addFolder("Weights");

    Weights.add(CONFIG, "cohesionWeight", 0, 10, 0.2).name("Cohesion");
    Weights.add(CONFIG, "alignmentWeight", 0, 10, 0.2).name("Alignment");
    Weights.add(CONFIG, "wanderWeight", 0, 10, 0.2).name("Wander");
    Weights.add(CONFIG, "separationWeight", 0, 10, 0.2).name("Separation");
    Weights.add(CONFIG, "massBasedClusteringFactor", 0, 10, 0.2).name(
      "Mass Clustering"
    );
    Weights.open();
  }

  addListeners() {
    window.addEventListener("keydown", (event) => {
      if (event.code === "Space") {
        event.preventDefault();
        this.togglePause();
      }
    });
  }
  startFPSCounter() {
    setInterval(() => {
      const now = performance.now();
      const delta = now - this.lastTime;

      this.fps = Math.round((this.frameCount * 1000) / delta);
      this.frameCount = 0;
      this.lastTime = now;
    }, 1000);
  }

  updateFrame() {
    this.frameCount++;
  }

  shouldDrawVectors() {
    return this.vectorsEnabled;
  }

  getSpeed() {
    return this.simulationSpeed;
  }

  isPaused() {
    return this.paused;
  }

  togglePause() {
    return (this.paused = !this.paused);
  }
}

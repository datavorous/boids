const CONFIG = {
  boidCount: 240,
  flockCount: 3,
  maxSpeed: 3.5,
  maxForce: 0.1,
  visualRange: 60,
  separationDistance: 30,

  baseMass: 50,
  massVariation: 100,
  massBasedClusteringFactor: 2.5,

  get maxMass() {
    return this.baseMass + this.massVariation;
  },

  get maxRadius() {
    return 0.05 * this.maxMass;
  },

  cohesionWeight: 0.1,
  alignmentWeight: 1.0,
  separationWeight: 1.2,
  wanderWeight: 2,

  wanderAngle: Math.PI / 3,
  quadtreeCapacity: 2,

  colors: [
    "#f38ba8",
    "#a6e3a1",
    "#89b4fa",
    "#fddd6bff",
    "#df68fdff",
    "#ffffffff",
  ],

  trailLength: 12,
  trailEnabled: true,

  EDGE_BEHAVIORS: {
    WRAP: "wrap",
    BOUNCE: "bounce",
    AVOID: "avoid",
  },
  edgeBehavior: "avoid",
};

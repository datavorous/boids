const CONFIG = {
  boidCount: 100,
  flockCount: 3,
  maxSpeed: 2.5,
  maxForce: 0.1,
  visualRange: 60,
  separationDistance: 30,

  baseMass: 50,
  massVariation: 100,
  massBasedClusteringFactor: 2.5,

  cohesionWeight: 0.1,
  alignmentWeight: 1.0,
  separationWeight: 1.2,
  wanderWeight: 2,

  wanderAngle: Math.PI / 3,

  wallRigidness: 3.5,

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

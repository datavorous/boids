const CONFIG = {
  boidCount: 150,
  maxSpeed: 3.5,
  maxForce: 0.1,
  visualRange: 60,

  cohesionWeight: 1.0,
  alignmentWeight: 1.0,
  separationWeight: 1.9,
  wanderWeight: 1.0,

  wanderAngle: Math.PI / 3,

  trailLength: 12,
  trailEnabled: true,

  EDGE_BEHAVIORS: {
    WRAP: "wrap",
    BOUNCE: "bounce",
    AVOID: "avoid",
  },
  edgeBehavior: "avoid",
};

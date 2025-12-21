class VectorRenderer {
  static drawVelocityVector(ctx, boid, scale = 10) {
    ctx.strokeStyle = boid.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(boid.position.x, boid.position.y);
    ctx.lineTo(
      boid.position.x + boid.velocity.x * scale,
      boid.position.y + boid.velocity.y * scale
    );
    ctx.stroke();

    const angle = Math.atan2(boid.velocity.y, boid.velocity.x);
    const arrowLength = 5;
    const arrowAngle = Math.PI / 6;
    const endX = boid.position.x + boid.velocity.x * scale;
    const endY = boid.position.y + boid.velocity.y * scale;

    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - arrowLength * Math.cos(angle - arrowAngle),
      endY - arrowLength * Math.sin(angle - arrowAngle)
    );
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - arrowLength * Math.cos(angle + arrowAngle),
      endY - arrowLength * Math.sin(angle + arrowAngle)
    );
    ctx.stroke();
  }
}

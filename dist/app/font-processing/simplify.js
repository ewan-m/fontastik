export function simplify(points, tolerance) {
  if (points.length <= 2)
    return points;
  points = simplifyRadialDistance(points, tolerance);
  return points;
}
function simplifyRadialDistance(points, sqTolerance) {
  return points.filter((currentPoint, index, points2) => currentPoint.type === "M" || squareDistance(currentPoint, points2[index - 1]) > sqTolerance);
}
function squareDistance(pointA, pointB) {
  return Math.pow(pointA.x - (pointB ? pointB.x : 0), 2) + Math.pow(pointA.y - (pointB ? pointB.y : 0), 2);
}
function getSquareDistanceToSegment(p, p1, p2) {
  let x = p1.x, y = p1.y, dx = p2.x - x, dy = p2.y - y;
  if (dx !== 0 || dy !== 0) {
    const t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      x = p2.x;
      y = p2.y;
    } else if (t > 0) {
      x += dx * t;
      y += dy * t;
    }
  }
  dx = p.x - x;
  dy = p.y - y;
  return dx * dx + dy * dy;
}
function simplifyDPStep(points, first, last, sqTolerance, simplified) {
  let maxSqDist = sqTolerance, index = 0;
  for (let i = first + 1; i < last; i++) {
    const sqDist = getSquareDistanceToSegment(points[i], points[first], points[last]);
    if (sqDist > maxSqDist) {
      index = i;
      maxSqDist = sqDist;
    }
  }
  if (maxSqDist > sqTolerance) {
    if (index - first > 1)
      simplifyDPStep(points, first, index, sqTolerance, simplified);
    simplified.push(points[index]);
    if (last - index > 1)
      simplifyDPStep(points, index, last, sqTolerance, simplified);
  }
}
function simplifyDouglasPeucker(points, sqTolerance) {
  const last = points.length - 1;
  const simplified = [points[0]];
  simplifyDPStep(points, 0, last, sqTolerance, simplified);
  simplified.push(points[last]);
  return simplified;
}

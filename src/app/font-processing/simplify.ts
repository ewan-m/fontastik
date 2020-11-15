import { Point } from "./point.interface";

export function simplify(points: Point[], tolerance: number) {
	if (points.length <= 2) return points;

	points = simplifyRadialDistance(points, tolerance);
	// points = simplifyDouglasPeucker(points, tolerance);

	return points;
}

function simplifyRadialDistance(points: Point[], sqTolerance: number) {
	return points.filter(
		(currentPoint, index, points) =>
			currentPoint.type === "M" ||
			squareDistance(currentPoint, points[index - 1]) > sqTolerance
	);
}

function squareDistance(pointA: Point, pointB?: Point) {
	return (
		Math.pow(pointA.x - (pointB ? pointB.x : 0), 2) +
		Math.pow(pointA.y - (pointB ? pointB.y : 0), 2)
	);
}

function getSquareDistanceToSegment(p: Point, p1: Point, p2: Point) {
	let x = p1.x,
		y = p1.y,
		dx = p2.x - x,
		dy = p2.y - y;

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

function simplifyDPStep(
	points: Point[],
	first: number,
	last: number,
	sqTolerance: number,
	simplified: Point[]
): void {
	let maxSqDist = sqTolerance,
		index = 0;

	for (let i = first + 1; i < last; i++) {
		const sqDist = getSquareDistanceToSegment(
			points[i],
			points[first],
			points[last]
		);

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

function simplifyDouglasPeucker(points: Point[], sqTolerance: number) {
	const last = points.length - 1;

	const simplified = [points[0]];
	simplifyDPStep(points, 0, last, sqTolerance, simplified);
	simplified.push(points[last]);

	return simplified;
}

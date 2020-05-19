interface Point {
	x: number;
	y: number;
	type: "M" | "L";
}

export function convertPathToPoints(svgPath: string): Array<Point> {
	return svgPath
		.trim()
		.split(" ")
		.map((coordsString) => {
			const [x, y] = coordsString
				.substring(1)
				.split(",")
				.map((str) => Number(str));
			return {
				x,
				y,
				type: coordsString[0] as "M" | "L",
			};
		});
}

export function convertPointsToPath(points: Array<Point>): string {
	return points
		.map((coords) => `${coords.type}${coords.x},${coords.y}`)
		.join(" ");
}

export function optimizeSvgPath(svgPath: string): Array<string> {
	let newArray = [] as Array<Point[]>;
	let lastIndex = 0;
	const points = svgPath
		.trim()
		.split(" ")
		.map((coordsString) => {
			const [x, y] = coordsString
				.substring(1)
				.split(",")
				.map((str) => Number(str));
			return {
				x,
				y,
				type: coordsString[0],
			} as Point;
		});

	points.slice(1).forEach((item, index, points) => {
		if (item.type === "M") {
			newArray.push(points.slice(lastIndex, index));
			lastIndex = index;
		}
	});

	newArray.push(points.slice(lastIndex));

	console.log(newArray);

	return newArray.map((points) =>
		points.reduce((pathSoFar, currentPoint, index, points) => {
			if (index === 0) {
				return `M ${currentPoint.x},${currentPoint.y}`;
			} else {
				const cps = controlPoint(
					points[index - 1],
					points[index - 2],
					currentPoint
				);
				const cpe = controlPoint(
					currentPoint,
					points[index - 1],
					points[index + 1],
					true
				);
				return `${pathSoFar} C ${cps.x.toFixed(2)},${cps.y.toFixed(
					2
				)} ${cpe.x.toFixed(2)},${cpe.y.toFixed(2)} ${currentPoint.x.toFixed(
					2
				)},${currentPoint.y.toFixed(2)}`;
			}
		}, "")
	);
}

const line = (pointA: Point, pointB: Point) => {
	const lengthX = pointB.x - pointA.x;
	const lengthY = pointB.y - pointA.y;
	return {
		length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
		angle: Math.atan2(lengthY, lengthX),
	};
};

const controlPoint = (
	current: Point,
	previous: Point,
	next: Point,
	reverse?: boolean
) => {
	const p = previous || current;
	const n = next || current;

	const o = line(p, n);

	const angle = o.angle + (reverse ? Math.PI : 0);
	const length = o.length * 0.2;

	const x = current.x + Math.cos(angle) * length;
	const y = current.y + Math.sin(angle) * length;
	return { x, y };
};

const squareDistance = (pointA: Point, pointB?: Point): number =>
	Math.pow(pointA.x - (pointB ? pointB.x : 0), 2) +
	Math.pow(pointA.y - (pointB ? pointB.y : 0), 2);

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

const simplifyRadialDistance = (
	points: Array<Point>,
	sqTolerance: number
): Array<Point> =>
	points.filter(
		(currentPoint, index, points) =>
			squareDistance(currentPoint, points[index - 1]) > sqTolerance
	);

function simplifyDPStep(
	points: Array<Point>,
	first: number,
	last: number,
	sqTolerance: number,
	simplified: Array<Point>
) {
	let maxSqDist = sqTolerance,
		index = 0;

	for (var i = first + 1; i < last; i++) {
		var sqDist = getSquareDistanceToSegment(
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

function simplifyDouglasPeucker(points: Array<Point>, sqTolerance: number) {
	var last = points.length - 1;

	var simplified = [points[0]];
	simplifyDPStep(points, 0, last, sqTolerance, simplified);
	simplified.push(points[last]);

	return simplified;
}

function simplify(points: Array<Point>, tolerance: number) {
	if (points.length <= 2) return points;

	var sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;

	points = simplifyRadialDistance(points, sqTolerance);
	points = simplifyDouglasPeucker(points, sqTolerance);

	return points;
}

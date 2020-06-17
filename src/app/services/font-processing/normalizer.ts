import { Point } from "./point.interface";

const LETTER_PADDING = 20;

export function normalize(points: Point[]): [Point[], number] {
	const startingX =
		Number(Math.min(...points.map((point) => point.x))) - LETTER_PADDING;

	const shiftedPoints = points.map((point) => ({
		...point,
		y: -1 * Number(point.y) + 250,
		x: Number(point.x) - startingX,
	}));

	const horizontalShift = Math.round(
		Math.max(...shiftedPoints.map((point) => point.x)) + LETTER_PADDING
	);

	return [shiftedPoints, horizontalShift];
}

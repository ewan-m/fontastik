export function calculateDistance(
	location1: { x: number; y: number },
	location2: { x: number; y: number }
) {
	if (
		(location1.x === 0 && location1.y === 0) ||
		(location2.x === 0 && location2.y === 0)
	) {
		return null;
	}

	const R = 6371; // km
	const φ1 = (location1.x * Math.PI) / 180; // φ, λ in radians
	const φ2 = (location2.x * Math.PI) / 180;
	const Δφ = ((location2.x - location1.x) * Math.PI) / 180;
	const Δλ = ((location2.y - location1.y) * Math.PI) / 180;

	const a =
		Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
		Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return (R * c).toFixed(0);
}

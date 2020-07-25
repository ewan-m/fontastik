import MakerJS from "makerjs";

export function convertPathToOutline(svgPath: string): string {
	const model = MakerJS.model.simplify(
		MakerJS.importer.fromSVGPathData(svgPath, {
			bezierAccuracy: 1,
		})
	);

	return MakerJS.exporter
		.toSVGPathData(MakerJS.model.outline(model, 5, 2, false), {
			accuracy: 0,
			fillRule: "nonzero",
			origin: [0, 250],
		})
		.toString();
}

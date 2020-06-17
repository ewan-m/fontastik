import MakerJS from "makerjs";

export function convertPathToOutline(svgPath: string): string {
	const model = MakerJS.model.simplify(
		MakerJS.importer.fromSVGPathData(svgPath, {
			bezierAccuracy: 0.5,
		})
	);

	return MakerJS.exporter
		.toSVGPathData(MakerJS.model.simplify(MakerJS.model.outline(model, 5, 0)), {
			accuracy: 1,
			fillRule: "nonzero",
		})
		.toString();
}

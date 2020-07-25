import { model, exporter, importer } from "makerjs";

export function convertPathToOutline(svgPath: string): string {
	const makerObject = model.simplify(
		importer.fromSVGPathData(svgPath, {
			bezierAccuracy: 1,
		})
	);

	return exporter
		.toSVGPathData(model.outline(makerObject, 5, 2, false), {
			accuracy: 0,
			fillRule: "nonzero",
			origin: [0, 250],
		})
		.toString();
}

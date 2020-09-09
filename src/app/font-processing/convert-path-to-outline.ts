import { model, exporter, importer } from "makerjs";

export function convertPathToOutline(svgPath: string): string {
	const makerObject = model.simplify(
		importer.fromSVGPathData(svgPath, {
			bezierAccuracy: 1,
		})
	);

	return exporter
		.toSVGPathData(
			model.outline(makerObject, 8, 0, false, { trimDeadEnds: true }),
			{
				accuracy: 0,
				fillRule: "nonzero",
				origin: [0, 250],
			}
		)
		.toString();
}

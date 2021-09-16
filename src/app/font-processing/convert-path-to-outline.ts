import { model, exporter, importer } from "makerjs";

export function convertPathToOutline(svgPath: string): string {
	const makerObject = model.simplify(
		importer.fromSVGPathData(svgPath, {
			bezierAccuracy: 1,
		})
	);

	return exporter
		.toSVGPathData(
			model.expandPaths(makerObject, 5.0001, 0, { trimDeadEnds: false}),
			{
				accuracy: 2,
				fillRule: "nonzero",
				origin: [0, 250],
			}
		)
		.toString();
}

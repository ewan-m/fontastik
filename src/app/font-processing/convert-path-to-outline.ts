import { model, exporter, importer } from "makerjs";

import ClipperLib from "clipper-lib";
import * as maker from "makerjs";

const EndTypes = {
	etOpenSquare: 0,
	etOpenRound: 1,
	etOpenButt: 2,
	etClosedPolygon: 3,
	etClosedLine: 4,
};

function clipperOffset(
	modelToOutline: maker.IModel,
	offset: number
): maker.IModel {
	const tolerance = 0.01;
	const scale = 10000;
	const chains = maker.model.findChains(modelToOutline) as maker.IChain[];
	const models = chains.reduce((memo, chain, i) => {
		const divisions = Math.floor(chain.pathLength / tolerance);
		const spacing = chain.pathLength / divisions;
		const keyPoints = maker.chain.toKeyPoints(chain, spacing);
		if (chain.endless) {
			keyPoints.push(keyPoints[0]);
		}
		let paths = [
			keyPoints.map((point) => ({
				X: Math.round(point[0] * scale),
				Y: Math.round(point[1] * scale),
			})),
		];
		const co = new ClipperLib.ClipperOffset();
		const offsetted = new ClipperLib.Paths();
		co.Clear();
		co.AddPaths(
			paths,
			ClipperLib.JoinType.jtRound,
			chain.endless ? EndTypes.etClosedPolygon : EndTypes.etOpenRound
		);
		co.MiterLimit = 2;
		co.ArcTolerance = 0.25;
		co.Execute(offsetted, offset * scale);
		offsetted.forEach((points: any, j: number) => {
			if (points.length === 0) return;
			let result: maker.IPoint[] = [];
			points.forEach((point: any) => {
				result.push([point.X / scale, point.Y / scale]);
			});
			const newModel = new maker.models.ConnectTheDots(chain.endless, result);
			// @ts-ignore
			memo[i + "_" + j] = newModel;
		});
		return memo;
	}, {});
	return {
		models,
	};
}

export function convertPathToOutline(svgPath: string): string {
	const makerObject = model.simplify(
		importer.fromSVGPathData(svgPath, {
			bezierAccuracy: 10,
		})
	);

	return exporter
		.toSVGPathData(clipperOffset(makerObject, 5.0001), {
			accuracy: 2,
			fillRule: "nonzero",
			origin: [0, 250],
		})
		.toString();
}

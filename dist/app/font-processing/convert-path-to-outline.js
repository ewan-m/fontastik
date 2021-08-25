import {model, exporter, importer} from "../../../_snowpack/pkg/makerjs.js";
export function convertPathToOutline(svgPath) {
  const makerObject = model.simplify(importer.fromSVGPathData(svgPath, {
    bezierAccuracy: 1
  }));
  return exporter.toSVGPathData(model.outline(makerObject, 5, 0, false, {trimDeadEnds: false}), {
    accuracy: 2,
    fillRule: "nonzero",
    origin: [0, 250]
  }).toString();
}

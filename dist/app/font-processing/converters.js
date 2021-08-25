export function convertPathToPoints(svgPath) {
  return svgPath.trim().split(" ").map((coordsString) => {
    const [x, y] = coordsString.substring(1).split(",").map((str) => Number(str));
    return {
      x,
      y,
      type: coordsString[0]
    };
  });
}
export function convertPointsToPath(points) {
  return points.map((coords) => `${coords.type}${coords.x},${coords.y}`).join(" ");
}

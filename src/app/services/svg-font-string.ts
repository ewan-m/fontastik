import { Font } from "./font.interface";
import svg2ttf from "svg2ttf";
import { simplify } from "./font-processing/simplify";
import {
	convertPathToPoints,
	convertPointsToPath,
} from "./font-processing/converters";
import { normalize } from "./font-processing/normalizer";
import { convertPathToOutline } from "./font-processing/convert-path-to-outline";

const getSvgFontString = (glyphs: string) => `
<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg">
    <defs>
        <font id="Handwriting" horiz-adv-x="200" >
        <font-face font-family="Handwriting"
            units-per-em="250"
            panose-1="2 11 6 6 3 5 4 2 2 4"
            ascent="250"
            descent="0"
            alphabetic="0"
        />
        ${glyphs}
        </font>
    </defs>
</svg>`;

const getSvgGlyph = (letter: string, path: string, horizontalAdvance: number) =>
	`<glyph unicode="${letter}" glyph-name="${letter}" horiz-adv-x="${horizontalAdvance}" d="${path}" />`;

export function convertToTTF(font: Font) {
	const svgFontString = getSvgFontString(
		Object.entries(font)
			.map(([key, value]) => {
				const simpleResult = simplify(convertPathToPoints(value.trim()), 0.5);
				const [shiftedPath, horizontalAdvance] = normalize(simpleResult);

				return getSvgGlyph(
					key,
					convertPathToOutline(convertPointsToPath(shiftedPath)),
					horizontalAdvance
				);
			})
			.join(" ")
	);
	const res = svg2ttf(svgFontString);

	document.fonts.add(new FontFace("Handwriting", res.buffer));
}

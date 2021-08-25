import type { Font } from "./font.type";
import svg2ttf from "svg2ttf";
import { convertPathToPoints, convertPointsToPath } from "./converters";
import { normalize } from "./normalizer";
import { convertPathToOutline } from "./convert-path-to-outline";
import { numbers, specialCharacters } from "../pages/create/characters";
import { defaultNumbers, defaultSpecialCharacters } from "./default-characters";
import { simplify } from "./simplify";

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

const fontHas = (font: Font, characters: string[]) =>
	Object.keys(font).join("").includes(characters.join(""));

const enrichWithDefaultCharacters = (font: Font): Font => ({
	...font,
	...(fontHas(font, specialCharacters) ? {} : defaultSpecialCharacters),
	...(fontHas(font, numbers) ? {} : defaultNumbers),
});

function convertToTTF(font: Font): svg2ttf.MicroBuffer {
	const fullFont = enrichWithDefaultCharacters(font);

	return svg2ttf(
		getSvgFontString(
			Object.entries(fullFont)
				.map(([key, value]) => {
					const [shiftedPath, horizontalAdvance] = normalize(
						simplify(convertPathToPoints(value.trim()), 1)
					);

					return getSvgGlyph(
						key,
						convertPathToOutline(convertPointsToPath(shiftedPath)),
						horizontalAdvance
					);
				})
				.join(" ")
		)
	);
}

(self as unknown as Worker).onmessage = (ev: { data: Font }) => {
	const ttf = convertToTTF(ev.data);

	(self as unknown as Worker).postMessage(ttf);
};

import type svg2ttf from "svg2ttf";
import type { Font } from "./font.type";

export function convertToTTF(font: Font): Promise<svg2ttf.MicroBuffer> {
	return new Promise((resolve, reject) => {
		try {
			const worker = new Worker(
				new URL("./app/font-processing/font-worker.js", import.meta.url)
			);
			worker.postMessage(font);
			worker.onmessage = (e: { data: svg2ttf.MicroBuffer }) => {
				resolve(e.data);
			};
		} catch (error) {
			reject("Failed to create .ttf font");
		}
	});
}

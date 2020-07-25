import svg2ttf from "svg2ttf";
import { Font } from "./font.interface";

export function convertToTTF(font: Font): Promise<svg2ttf.MicroBuffer> {
	return new Promise((resolve, reject) => {
		try {
			const worker = new Worker("./font-worker.ts");
			worker.postMessage(font);
			worker.onmessage = (e: { data: svg2ttf.MicroBuffer }) => {
				resolve(e.data);
			};
		} catch (error) {
			reject("Failed to create .ttf font");
		}
	});
}

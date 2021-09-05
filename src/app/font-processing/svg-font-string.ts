import type svg2ttf from "svg2ttf";
import type { Font } from "./font.type";

export function convertToTTF(font: Font): Promise<svg2ttf.MicroBuffer> {
	return new Promise((resolve, reject) => {
		try {
			const worker = new Worker(new URL("./font-worker.ts", import.meta.url), {
				name: "font-worker",
				type: "module",
			});
			worker.postMessage(font);
			worker.onmessage = (e: { data: svg2ttf.MicroBuffer }) => {
				resolve(e.data);
			};
		} catch (error) {
			reject("Failed to create .ttf font");
		}
	});
}

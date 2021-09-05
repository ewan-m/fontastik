import type svg2ttf from "svg2ttf";
import {
	GenerationProgress,
	useGenerationProgressStore,
} from "../store/global-store";
import type { Font } from "./font.type";

export function convertToTTF(font: Font): Promise<svg2ttf.MicroBuffer> {
	const updateProgress = useGenerationProgressStore.getState().updateProgress;

	return new Promise((resolve, reject) => {
		try {
			const worker = new Worker(new URL("./font-worker.ts", import.meta.url), {
				name: "font-worker",
				type: "module",
			});
			worker.postMessage(font);
			worker.onmessage = (e: {
				data:
					| { type: "result"; contents: svg2ttf.MicroBuffer }
					| { type: "progress"; contents: GenerationProgress };
			}) => {
				if (e.data.type === "progress") {
					updateProgress(
						...(Object.values(e.data.contents) as [string, number, number])
					);
				} else if (e.data.type === "result") {
					resolve(e.data.contents);
				}
			};
		} catch (error) {
			reject("Failed to create .ttf font");
		}
	});
}

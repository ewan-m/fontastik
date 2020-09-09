import { Font } from "../font-processing/font.interface";

const storageKey = "CUSTOM_FONT";

export const fontStore = {
	get: () => {
		try {
			return JSON.parse(localStorage.getItem(storageKey) ?? "") as Font;
		} catch (error) {
			return {};
		}
	},
	setLetter: (letter: string, path: string) => {
		const font = fontStore.get();
		font[letter] = path;
		localStorage.setItem(storageKey, JSON.stringify(font));
	},
	set: (font: Font) => {
		localStorage.setItem(storageKey, JSON.stringify(font));
	},
	remove: () => localStorage.removeItem(storageKey),
};

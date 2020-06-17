import { Font } from "./font.interface";

const storageKey = "CUSTOM_FONT";

export function getFont(): Font {
	try {
		return JSON.parse(localStorage.getItem(storageKey) ?? "") as Font;
	} catch (error) {
		return {};
	}
}

export function updateFont(letter: string, path: string) {
	const font = getFont();
	font[letter] = path;
	localStorage.setItem(storageKey, JSON.stringify(font));
}

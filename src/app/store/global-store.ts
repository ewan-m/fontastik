import create from "zustand";
import { combine } from "zustand/middleware";
import { persist } from "./store-persistence-middleware";
import { Font } from "../font-processing/font.interface";

export const usePreferencesStore = create(
	persist(
		combine({ showRuler: false }, (set) => ({
			toggleRulerPreference: () =>
				set((state) => ({ showRuler: !state.showRuler })),
		})),
		localStorage,
		"PREFERENCES"
	)
);

export const useAuthStore = create(
	persist(
		combine(
			{
				token: "",
			},
			(set) => ({
				login: (token: string) => set((store) => ({ token })),
				logout: () => set(() => ({ token: "" })),
			})
		),
		localStorage,
		"AUTH"
	)
);

export const useFontStore = create(
	persist(
		combine(
			{
				font: {} as Font,
			},
			(set) => ({
				setLetter: (letter: string, path: string) => {
					set(({ font }) => ({ font: { ...font, [letter]: path } }));
				},
				setFont: (font: Font) => set(() => ({ font })),
				remove: () => set(() => ({ font: {} })),
			})
		),
		localStorage,
		"FONT"
	)
);

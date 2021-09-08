import create from "zustand";
import { combine } from "zustand/middleware";
import { persist } from "./store-persistence-middleware";
import type { Font } from "fontastik/font-processing/font.type";

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

export const useFontCreationProgressStore = create(
	persist(
		combine(
			{
				step: 0,
			},
			(set) => ({
				setStep: (newStep: number) => {
					set(() => ({ step: newStep }));
				},
			})
		),
		localStorage,
		"FONT_CREATION_PROGRESS"
	)
);

export type GenerationProgress = {
	character: string;
	completed: number;
	total: number;
};

export const useGenerationProgressStore = create(
	combine(
		{
			character: "",
			completed: 0,
			total: 999,
		},
		(set) => ({
			updateProgress: (character: string, completed: number, total: number) => {
				set(() => ({ character, completed, total }));
			},
		})
	)
);

export const useFooterVisibilityStore = create(
	combine(
		{
			isFooterHidden: false,
		},
		(set) => ({
			hide: () => {
				set(() => ({ isFooterHidden: true }));
			},
			show: () => {
				set(() => ({ isFooterHidden: false }));
			},
		})
	)
);

export const usePostLikesStore = create(
	persist(
		combine(
			{
				postsLikedIds: [] as number[],
			},
			(set) => ({
				addPost: (postId: number) => {
					set((store) => ({ postsLikedIds: [...store.postsLikedIds, postId] }));
				},
				removePost: (postId: number) => {
					set((store) => ({
						postsLikedIds: store.postsLikedIds.filter((id) => id !== postId),
					}));
				},
				syncWithApi: (apiIds: number[]) => {
					set(() => ({ postsLikedIds: apiIds }));
				},
			})
		),
		localStorage,
		"POST_LIKE_IDS"
	)
);

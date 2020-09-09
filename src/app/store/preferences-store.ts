const rulerPreferenceKey = "SHOW_RULER";

export const preferencesStore = {
	getRulerPreference: () => localStorage.getItem(rulerPreferenceKey) === "true",

	setRulerPreference: (preference: boolean) =>
		localStorage.setItem(rulerPreferenceKey, `${preference}`),
};

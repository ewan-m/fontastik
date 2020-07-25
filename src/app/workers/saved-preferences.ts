const RULER_PREFERENCE_KEY = "SHOW_RULER";

export const preferences = {
	getRulerPreference: () =>
		localStorage.getItem(RULER_PREFERENCE_KEY) === "true",

	setRulerPreference: (preference: boolean) =>
		localStorage.setItem(RULER_PREFERENCE_KEY, `${preference}`),
};

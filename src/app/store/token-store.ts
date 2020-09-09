const tokenStorageKey = "TOKEN";

export const tokenStore = {
	get: () => localStorage.getItem(tokenStorageKey),
	set: (token: string) => localStorage.setItem(tokenStorageKey, token),
	remove: () => localStorage.removeItem(tokenStorageKey),
};

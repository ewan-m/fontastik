const TOKEN_STORE_KEY = "TOKEN";

export const tokenStore = {
	get: () => localStorage.getItem(TOKEN_STORE_KEY),
	set: (token: string) => localStorage.setItem(TOKEN_STORE_KEY, token),
	remove: () => localStorage.removeItem(TOKEN_STORE_KEY),
};

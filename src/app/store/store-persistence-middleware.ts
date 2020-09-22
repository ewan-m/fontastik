import { GetState, SetState, StateCreator, StoreApi } from "zustand";

interface AbstractStorage {
	setItem: (key: string, value: string) => void;
	getItem: (key: string) => string | null;
}

export const persist = <T extends Record<string | number | symbol, unknown>>(
	config: StateCreator<T>,
	storage: AbstractStorage,
	persistenceKey: string
) => (set: SetState<T>, get: GetState<T>, api: StoreApi<T>): T => {
	const state = config(
		(payload) => {
			set(payload);
			storage.setItem(persistenceKey, JSON.stringify(get()));
		},
		get,
		api
	);

	return {
		...state,
		...JSON.parse(storage.getItem(persistenceKey) ?? "{}"),
	};
};

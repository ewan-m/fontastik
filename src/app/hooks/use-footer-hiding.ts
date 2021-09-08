import { useEffect } from "react";
import { useFooterVisibilityStore } from "../store/global-store";

export const useFooterHiding = (enabled?: boolean) => {
	const { show, hide } = useFooterVisibilityStore();

	useEffect(() => {
		if (enabled) {
			hide();
		}
		return () => {
			show();
		};
	}, [enabled]);
};

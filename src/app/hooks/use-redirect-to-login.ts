import { useAuthStore } from "fontastik/store/global-store";
import { useEffect } from "react";
import { useHistory } from "react-router";

export const useRedirectToLogin = () => {
	const token = useAuthStore((state) => state.token);
	const history = useHistory();
	useEffect(() => {
		if (!token) {
			history.push("account/log-in");
		}
	}, []);
};

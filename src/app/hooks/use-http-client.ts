import { useHistory } from "react-router-dom";
import { environment } from "../environment";
import { useAuthStore } from "../store/global-store";

type Request = {
	method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	uri: string;
	headers?: any;
	body?: any;
	withAuth: boolean;
};

export const useHttpClient = () => {
	const history = useHistory();
	const token = useAuthStore((store) => store.token);
	const logoutAction = useAuthStore((store) => store.logout);

	const request = async ({ method, uri, headers, body, withAuth }: Request) => {
		const url = environment.apiUrl + uri;
		headers = {
			...headers,
			"mode": "cors",
			"Content-Type": "application/json",
			...(withAuth ? { Authorization: `Bearer ${token}` } : {}),
		};
		body = JSON.stringify(body);

		const response = await fetch(url.toString(), {
			headers,
			method,
			body,
		});
		response
			.clone()
			.json()
			.then((resolved) => {
				if (resolved?.message?.includes("Invalid token")) {
					logoutAction();
					history.push("/");
				}
			});
		return response;
	};

	return { request };
};

import { useHistory } from "react-router-dom";
import { environment } from "../environment";

interface Request {
	method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	uri: string;
	headers?: any;
	body?: any;
	withAuth: boolean;
}

export const useHttpClient = () => {
	const history = useHistory();
	const token = "ey";

	const request = async ({ method, uri, headers, body, withAuth }: Request) => {
		const url = environment.apiUrl + uri;
		headers = {
			...headers,
			"mode": "cors",
			"Content-Type": "application/json",
			...(withAuth ? { Authorization: `Bearer ${token}` } : {}),
		};
		body = JSON.stringify(body);

		const result = (
			await fetch(url.toString(), {
				headers,
				method,
				body,
			})
		).json();
		result.then((resolved) => {
			if (resolved?.message?.includes("Invalid token")) {
				history.push("/");
			}
		});
		return result;
	};

	return { request };
};

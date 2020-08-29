import * as React from "react";
import { useState, MouseEvent, useEffect } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { Errors } from "../../global/Errors";
import { Icon } from "../../global/Icon";
import "./auth.scss";
import { useHttpClient } from "../../hooks/use-http-client";
import { tokenStore } from "../../token-store";

export const LogIn = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState([] as string[]);
	const [isSendingRequest, setIsSendingRequest] = useState(false);
	const http = useHttpClient();
	const history = useHistory();

	const token = new URLSearchParams(useLocation().search).get("token");

	useEffect(() => {
		if (token) {
			tokenStore.set(token);
			history.push("/home");
		}
	}, [token]);

	const onSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setErrors([]);
		setIsSendingRequest(true);

		const response = await http.request({
			method: "POST",
			uri: "sign-in",
			body: { email, password, name },
			withAuth: false,
		});
		const result = await response.json();

		setIsSendingRequest(false);
		if (response.ok) {
			if (result.token) {
				tokenStore.set(result.token);
				history.push("/home");
			}
		} else {
			setErrors(result.message ?? ["Something went wrong signing you in."]);
		}
	};

	return (
		<div className="authPage contentAppear">
			<h2 className="pageTitle">Log in.</h2>
			<form className="form">
				<label className="form__label">
					Email
					<input
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
						}}
						className="form__input"
						type="email"
					/>
				</label>
				<label className="form__label">
					Password
					<input
						value={password}
						onChange={(e) => {
							setPassword(e.target.value);
						}}
						className="form__input"
						type="password"
					/>
				</label>
				<button
					className="button button__primary button--large button--wide"
					onClick={onSubmit}
					type="submit"
					disabled={isSendingRequest}
				>
					Log in<Icon withMargin="right">arrow_forward</Icon>
				</button>
				<Errors errors={errors} />
			</form>
			<div className="authPage__links">
				<Link className="link" to="/account/magic-link">
					Forgot password?
				</Link>
				<span className="authPage__links__divider">|</span>
				<Link className="link" to="/account/sign-up">
					Sign up for fontastik
				</Link>
			</div>
		</div>
	);
};

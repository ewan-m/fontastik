import * as React from "react";
import { useState, MouseEvent } from "react";
import { Link, useHistory } from "react-router-dom";
import { Errors } from "fontastik/global/Errors";
import { Icon } from "fontastik/global/Icon";
import "./auth.scss";
import { useHttpClient } from "fontastik/hooks/use-http-client";
import { useAuthStore } from "fontastik/store/global-store";

export const SignUp = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState([] as string[]);
	const [isSendingRequest, setIsSendingRequest] = useState(false);

	const http = useHttpClient();
	const history = useHistory();
	const loginAction = useAuthStore((store) => store.login);

	const onSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setErrors([]);
		setIsSendingRequest(true);

		const response = await http.request({
			method: "POST",
			uri: "sign-up",
			body: { email, password, name },
			withAuth: false,
		});
		const result = await response.json();
		setIsSendingRequest(false);

		if (!response.ok) {
			if (result.message) {
				setErrors(result.message);
			} else {
				setErrors(["Something went wrong signing you up."]);
			}
		} else {
			if (result.token) {
				loginAction(result.token);
				history.push("/home");
			}
		}
	};

	return (
		<div className="authPage contentAppear">
			<h2 className="pageTitle">Sign up.</h2>
			<p className="paragraph paragraph--b">
				Create an account so you can save your fonts and share messages with the
				fontastik community.
			</p>
			<form className="form">
				<label className="form__label">
					Name
					<input
						value={name}
						onChange={(e) => {
							setName(e.target.value);
						}}
						className="form__input"
						type="text"
					/>
				</label>
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
					Sign up<Icon withMargin="right">arrow_forward</Icon>
				</button>
				<Errors errors={errors} />
			</form>

			<div className="authPage__links">
				<Link className="link" to="/account/magic-link">
					Forgot password?
				</Link>

				<span className="authPage__links__divider">|</span>
				<Link className="link" to="/account/log-in">
					Log in to fontastik
				</Link>
			</div>
		</div>
	);
};

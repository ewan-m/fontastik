import * as React from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Errors } from "../../global/Errors";
import { Icon } from "../../global/Icon";
import "./auth.scss";

export const LogIn = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState([] as string[]);
	const [isSendingRequest, setIsSendingRequest] = useState(false);

	const token = new URLSearchParams(useLocation().search).get("token");

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
					onClick={() => {}}
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
					Sign up for Fontastik
				</Link>
			</div>
		</div>
	);
};

import * as React from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Errors } from "../../global/Errors";
import { Icon } from "../../global/Icon";
import "./auth.scss";

export const SignUp = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState([] as string[]);
	const [isSendingRequest, setIsSendingRequest] = useState(false);

	const token = new URLSearchParams(useLocation().search).get("token");

	return (
		<div className="authPage contentAppear">
			<h2 className="pageTitle">Sign up.</h2>
			<p className="paragraph paragraph--b">
				Create an account so you can save your fonts and share messages with the
				Bespoke community.
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
					onClick={() => {}}
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
					Log in to Bespoke
				</Link>
			</div>
		</div>
	);
};

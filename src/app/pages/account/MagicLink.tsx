import * as React from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Errors } from "../../global/Errors";
import { Icon } from "../../global/Icon";
import "./auth.scss";

export const MagicLink = () => {
	const [email, setEmail] = useState("");
	const [errors, setErrors] = useState([] as string[]);
	const [isSendingRequest, setIsSendingRequest] = useState(false);

	const token = new URLSearchParams(useLocation().search).get("token");

	return (
		<div className="authPage contentAppear">
			<h2 className="pageTitle">Forgotten your password?</h2>
			<p className="paragraph paragraph--b">
				Don't worry about it! Just enter the email you used to register and we'll
				send you a magic login link straight to your inbox.
			</p>
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
				<button
					className="button button__primary button--large button--wide"
					onClick={() => {}}
					type="submit"
					disabled={isSendingRequest}
				>
					Send a magic link<Icon withMargin="right">arrow_forward</Icon>
				</button>
				<Errors errors={errors} />
			</form>
			<div className="authPage__links">
				<Link className="link" to="/account/log-in">
					Log in to Bespoke
				</Link>
				<span className="authPage__links__divider">|</span>
				<Link className="link" to="/account/sign-up">
					Sign up for Bespoke
				</Link>
			</div>
		</div>
	);
};

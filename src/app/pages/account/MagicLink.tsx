import * as React from "react";
import { useState, MouseEvent } from "react";
import { Link } from "react-router-dom";
import { Errors } from "../../global/Errors";
import { Icon } from "../../global/Icon";
import "./auth.scss";
import { useHttpClient } from "../../hooks/use-http-client";
import { LoadingSpinner } from "../../global/LoadingSpinner";

type Situation = "initial" | "sending" | "success";

export const MagicLink = () => {
	const [email, setEmail] = useState("");
	const [errors, setErrors] = useState([] as string[]);
	const [situation, setSituation] = useState<Situation>("initial");
	const http = useHttpClient();

	const onSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setSituation("sending");
		setErrors([]);

		const response = await http.request({
			method: "POST",
			uri: "magic-link",
			body: { email },
			withAuth: false,
		});

		const result = await response.json();

		if (response.ok) {
			setSituation("success");
		} else {
			setErrors(
				result.message ?? ["Something went wrong sending you a magic link."]
			);
			setSituation("initial");
		}
	};

	return (
		<div className="authPage contentAppear">
			<h2 className="pageTitle">Forgotten your password?</h2>
			{(situation === "initial" || situation === "sending") && (
				<>
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
							onClick={onSubmit}
							type="submit"
							disabled={situation === "sending"}
						>
							Send a magic link<Icon withMargin="right">arrow_forward</Icon>
						</button>
						{situation === "sending" && <LoadingSpinner />}
						<Errors errors={errors} />
					</form>
				</>
			)}
			{situation === "success" && (
				<p className="paragraph paragraph--b">
					If you have an account registered with us by that email you should find a
					magic sign in link in your inbox.
				</p>
			)}
			<div className="authPage__links">
				<Link className="link" to="/account/log-in">
					Log in to fontastik
				</Link>
				<span className="authPage__links__divider">|</span>
				<Link className="link" to="/account/sign-up">
					Sign up for fontastik
				</Link>
			</div>
		</div>
	);
};

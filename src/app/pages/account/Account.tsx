import * as React from "react";
import { FunctionComponent, useEffect, useState, MouseEvent } from "react";
import { useHistory } from "react-router";
import { Icon } from "fontastik/global/Icon";
import "./Account.scss";
import { useHttpClient } from "fontastik/hooks/use-http-client";
import { useRedirectToLogin } from "fontastik/hooks/use-redirect-to-login";
import { LoadingSpinner } from "fontastik/global/LoadingSpinner";
import { Errors } from "fontastik/global/Errors";
import { useAuthStore } from "fontastik/store/global-store";
import decode from "jwt-decode";
import type { TokenPayload } from "fontastik/global/token-payload.type";
import { AccountPosts } from "./AccountPosts";

type FormState = "initial" | "editing" | "sending" | "completed";

const MiniForm: FunctionComponent<{
	label: string;
	initialValue: string;
	endpoint: string;
	bodyTag: string;
	inputType?: string;
}> = ({ label, initialValue, endpoint, bodyTag, inputType = "text" }) => {
	const [formState, setFormState] = useState<FormState>("initial");
	const [value, setValue] = useState("");
	const [errors, setErrors] = useState([]);
	const http = useHttpClient();
	const loginAction = useAuthStore((store) => store.login);

	useEffect(() => {
		setValue(initialValue);
		if (inputType === "password") {
			setValue("");
		}
	}, []);

	const onSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setErrors([]);
		setFormState("sending");

		const result = await http.request({
			method: "POST",
			uri: endpoint,
			body: { [bodyTag]: value },
			withAuth: true,
		});
		console.log(result);
		if (result.ok) {
			setFormState("completed");
			const response = await result.json();
			if (response?.token) {
				loginAction(response.token);
			}
		} else {
			setFormState("editing");
			const message = (await result.json())?.message;
			setErrors(message ?? "Something went wrong changing that for you.");
		}
	};

	switch (formState) {
		case "initial":
			return (
				<button
					className="linkButton"
					onClick={() => {
						setFormState("editing");
					}}
				>
					{initialValue}
					<Icon withMargin="right">edit</Icon>
				</button>
			);
		case "sending":
		case "editing":
			return (
				<form className="form profileInfo__editForm">
					<label className="form__label">
						{label}
						<input
							type={inputType}
							className="form__input"
							value={value}
							onChange={(e) => {
								setValue(e.target.value);
							}}
						/>
					</label>
					<div className="buttonRow">
						<button
							onClick={onSubmit}
							disabled={formState === "sending"}
							className="button button__primary"
							type="submit"
						>
							Save changes
						</button>
						<button
							onClick={(e) => {
								e.preventDefault();
								setFormState("initial");
							}}
							className="button secondary"
						>
							Cancel
						</button>
					</div>
					<Errors errors={errors} />
					{formState === "sending" && <LoadingSpinner />}
				</form>
			);
		case "completed":
			return (
				<div className="profileInfo__editForm">
					<p className="paragraph paragraph--b">
						Nice one! We've changed that for you.
					</p>
					<button
						onClick={(e) => {
							e.preventDefault();
							setFormState("initial");
						}}
						className="button button__primary"
					>
						Okay, thanks!
					</button>
				</div>
			);
		default:
			return null;
	}
};

export const Account = () => {
	useRedirectToLogin();

	const token = useAuthStore((state) => state.token);
	const history = useHistory();

	const decodedToken = token ? (decode(token) as TokenPayload) : undefined;
	const http = useHttpClient();

	const logoutAction = useAuthStore((store) => store.logout);

	return decodedToken ? (
		<div className="accountPage">
			<h2 className="pageTitle contentAppear">Your info.</h2>
			<div className="accountFields contentAppear">
				<MiniForm
					endpoint="change-name"
					bodyTag="name"
					initialValue={decodedToken?.name}
					label="Name"
				/>
				<MiniForm
					endpoint="change-email"
					bodyTag="email"
					inputType="email"
					initialValue={decodedToken?.email}
					label="Email"
				/>
				<MiniForm
					endpoint="reset-password"
					bodyTag="password"
					inputType="password"
					initialValue="Change your password"
					label="Change your password"
				/>
				<button
					className="button button__primary button--stacked"
					onClick={() => {
						logoutAction();
						history.push("account/log-in");
					}}
				>
					<Icon withMargin="left">lock</Icon> Sign out
				</button>
				<button
					className="button button__destructive button--stacked"
					onClick={() => {
						(async () => {
							const resp = await http.request({
								method: "DELETE",
								uri: "account",
								withAuth: true,
							});
							if (resp.ok) {
								logoutAction();
								history.push("account/log-in");
							}
						})();
					}}
				>
					<Icon withMargin="left">delete</Icon> Delete your account
				</button>
			</div>
			<AccountPosts userId={decodedToken?.id.toString()} title="Your posts." />
		</div>
	) : (
		<></>
	);
};

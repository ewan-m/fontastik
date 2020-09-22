import * as React from "react";
import { FunctionComponent, useEffect, useState, MouseEvent } from "react";
import { useHistory } from "react-router-dom";
import { Icon } from "../../global/Icon";
import "./Account.scss";
import { useHttpClient } from "../../hooks/use-http-client";
import { LoadingSpinner } from "../../global/LoadingSpinner";
import { Errors } from "../../global/Errors";
import { useAuthStore } from "../../store/global-store";

enum FormState {
	initial = "initial",
	editing = "editing",
	sending = "sending",
	completed = "completed",
}

const MiniForm: FunctionComponent<{
	label: string;
	initialValue: string;
	endpoint: string;
	bodyTag: string;
	inputType?: string;
}> = ({ label, initialValue, endpoint, bodyTag, inputType = "text" }) => {
	const [formState, setFormState] = useState(FormState.initial);
	const [value, setValue] = useState("");
	const [errors, setErrors] = useState([]);
	const http = useHttpClient();

	useEffect(() => {
		setValue(initialValue);
		if (inputType === "password") {
			setValue("");
		}
	}, []);

	const onSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setErrors([]);
		setFormState(FormState.sending);

		const result = await http.request({
			method: "POST",
			uri: endpoint,
			body: { [bodyTag]: value },
			withAuth: true,
		});
		console.log(result);
		if (result.ok) {
			setFormState(FormState.completed);
		} else {
			setFormState(FormState.editing);
			const message = (await result.json())?.message;
			setErrors(message ?? "Something went wrong changing that for you.");
		}
	};

	switch (formState) {
		case FormState.initial:
			return (
				<button
					className="button  button__secondary button--large button--stacked"
					onClick={() => {
						setFormState(FormState.editing);
					}}
				>
					{initialValue}
					<Icon withMargin="right">edit</Icon>
				</button>
			);
		case FormState.sending:
		case FormState.editing:
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
							disabled={formState === FormState.sending}
							className="button button__primary"
							type="submit"
						>
							Save changes
						</button>
						<button
							onClick={(e) => {
								e.preventDefault();
								setFormState(FormState.initial);
							}}
							className="button secondary"
						>
							Cancel
						</button>
					</div>
					<Errors errors={errors} />
					{formState === FormState.sending && <LoadingSpinner />}
				</form>
			);
		case FormState.completed:
			return (
				<div className="profileInfo__editForm">
					<p className="paragraph paragraph--b">
						Nice one! We've changed that for you.
					</p>
					<button
						onClick={(e) => {
							e.preventDefault();
							setFormState(FormState.initial);
						}}
						className="button button__primary"
					>
						Okay
					</button>
				</div>
			);
		default:
			return null;
	}
};

export const Account = () => {
	const history = useHistory();
	const token = useAuthStore((state) => state.token);
	useEffect(() => {
		if (!token) {
			history.push("account/log-in");
		}
	}, []);

	return (
		<div className="accountPage">
			<h2 className="pageTitle contentAppear">Your info.</h2>
			<div className="profileInfo contentAppear">
				<div className="profileInfo__picture">
					<img
						className="profileInfo__picture__img"
						alt="user profile picture"
						src={require("../../../assets/sofia.jpg")}
					/>
					<button className="button button__secondary">
						<Icon withMargin="left">portrait</Icon> Change your profile picture
					</button>
					{/* <input type="file" className="button button__secondary"  style={{boxSizing: "border-box", width: "100%"} } accept="image/*"/> */}
				</div>
				<div className="profileInfo__fields">
					<MiniForm initialValue="Sofia" label="Name" />
					<MiniForm
						inputType="email"
						initialValue="itsemail@gmail.com"
						label="Email"
					/>
					<MiniForm
						endpoint="reset-password"
						bodyTag="password"
						inputType="password"
						initialValue="Change your password"
						label="Change your password"
					/>
					<button className="button button__destructive button--stacked">
						<Icon withMargin="left">delete</Icon> Delete your account
					</button>
				</div>
			</div>
			<h2 className="pageTitle contentAppear">Your posts.</h2>
		</div>
	);
};

import * as React from "react";
import { FunctionComponent, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Icon } from "../../global/Icon";
import "./Account.scss";

enum FormState {
	initial = "initial",
	editing = "editing",
	sending = "sending",
}

const MiniForm: FunctionComponent<{ label: string; initialValue: string }> = ({
	label,
	initialValue,
}) => {
	const [formState, setFormState] = useState(FormState.initial);

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
		case FormState.editing:
			return (
				<form className="form">
					<label className="form__label">
						{label}
						<input className="form__input" value={initialValue}></input>
					</label>
					<div className="buttonRow">
						<button className="button button__primary">Save changes</button>
						<button className="button secondary">Cancel</button>
					</div>
				</form>
			);
		default:
			return <>"this shouldn't happen :P"</>;
	}
};

export const Account = () => {
	const history = useHistory();
	useEffect(() => {
		// history.push("account/log-in");
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
					<MiniForm initialValue="itsemail@gmail.com" label="Email" />
					<button className="button button__primary button--stacked">
						<Icon withMargin="left">lock_open</Icon>Change your password
					</button>
					<button className="button button__destructive button--stacked">
						<Icon withMargin="left">delete</Icon> Delete your account
					</button>
				</div>
			</div>
		</div>
	);
};

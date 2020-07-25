import * as React from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Post } from "../home/Post";
import "./Account.scss";
import { Icon } from "../../global/Icon";

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
					<button className="button  button__secondary button--large button--stacked">
						Sofia<Icon withMargin="right">edit</Icon>
					</button>
					<button className="button button__secondary button--large button--stacked">
						itsemail@gmail.com<Icon withMargin="right">edit</Icon>
					</button>
					<button className="button button__primary button--stacked">
						<Icon withMargin="left">lock_open</Icon>Change your password
					</button>
					<button className="button button__destructive button--stacked">
						<Icon withMargin="left">delete</Icon> Delete your account
					</button>
				</div>
			</div>
			<h2 className="pageTitle contentAppear">Your posts.</h2>
			<Post />
			<Post />
			<Post />
		</div>
	);
};

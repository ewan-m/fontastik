import * as React from "react";
import { useLocation, useParams } from "react-router-dom";
import { Icon } from "../../global/Icon";
import { AccountPosts } from "../account/AccountPosts";
import "./User.scss";

export const User = () => {
	const { userId } = useParams<{ userId: string }>();

	const title = new URLSearchParams(useLocation().search).get("name");

	return (
		<div className="userPage">
			<button
				className="linkButton contentAppear"
				onClick={(e) => {
					e.preventDefault();
					window.history.back();
				}}
			>
				<Icon withMargin="left">arrow_back</Icon>Back
			</button>
			<AccountPosts title={title + "."} userId={userId} />
		</div>
	);
};

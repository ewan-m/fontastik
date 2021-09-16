import * as React from "react";

export const Conversations = () => {
	return (
		<div className="messagesPage">
			<h2 className="pageTitle contentAppear">Messages.</h2>
			<button className="button button__primary button--large">Start a chat</button>
			<p className="paragraph conversations__">You currently have no chats. Why not message someone?</p>
		</div>
	);
};

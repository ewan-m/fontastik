import * as React from "react";
import { FunctionComponent, useState } from "react";
import { useHistory } from "react-router-dom";
import { useFooterHiding } from "fontastik/hooks/use-footer-hiding";
import { useIsMobile } from "fontastik/hooks/use-is-mobile";
import { Icon } from "fontastik/global/Icon";
import "./Conversation.scss";
import type { Message } from "./message.type";

const MAX_MESSAGE_LENGTH = 840;

export const Conversation: FunctionComponent<{ conversationId?: string }> = ({
	conversationId,
}) => {
	useFooterHiding(true);
	const isMobile = useIsMobile();
	const history = useHistory();
	const [inputMessage, setInputMessage] = useState("");

	return (
		<>
			<div className="messagesPage">
				<div>
					{isMobile && (
						<button
							className="linkButton contentAppear"
							onClick={(e) => {
								e.preventDefault();
								history.push("/messages");
							}}
						>
							<Icon withMargin="left">arrow_back</Icon>Back
						</button>
					)}
					<h2
						style={{ fontFamily: "UserFont-275" }}
						className="pageTitle contentAppear"
					>
						Miguel
					</h2>
					<link
						rel="stylesheet"
						type="text/css"
						crossOrigin="anonymous"
						href="https://min.gitcdn.link/repo/ewan-m/fontastik-data/master/UserFont-1.css"
					/>
					<link
						rel="stylesheet"
						type="text/css"
						crossOrigin="anonymous"
						href="https://min.gitcdn.link/repo/ewan-m/fontastik-data/master/UserFont-275.css"
					/>
				</div>
				<div className="conversation__messagesContainer">
					<p
						style={{ fontFamily: "UserFont-275" }}
						className="conversation__message conversation__message--received conversation__message--first"
					>
						can I interest you in my societal vision of vegan chorizo communism,
						muchachos?
					</p>
					<p
						style={{ fontFamily: "UserFont-275" }}
						className="conversation__message conversation__message--received conversation__message--middle"
					>
						can I interest you in my societal vision of vegan chorizo communism,
						muchachos?
					</p>
					<p
						style={{ fontFamily: "UserFont-275" }}
						className="conversation__message conversation__message--received conversation__message--last"
					>
						can I interest you in my societal vision of vegan chorizo communism,
						muchachos?
					</p>

					<p
						style={{ fontFamily: "UserFont-1" }}
						className="conversation__message conversation__message--sent conversation__message--standalone"
					>
						yeeeahhh boi! it's a long message a really big one, really fucking huge
						just to see what it looks woah
					</p>
					<p
						style={{ fontFamily: "UserFont-1" }}
						className="conversation__message conversation__message--sent conversation__message--standalone"
					>
						yeeeahhh boi! it's a long message a really big one, really fucking huge
						just to see what it looks woah
					</p>
					<p
						style={{ fontFamily: "UserFont-1" }}
						className="conversation__message conversation__message--sent conversation__message--standalone"
					>
						yeeeahhh boi! it's a long message a really big one, really fucking huge
						just to see what it looks woah
					</p>
				</div>
			</div>
			<div className="conversation__inputContainer">
				<div className="conversation__inputContainer__bg">
					<form className="conversation__inputContainer__form">
						<textarea
							rows={1}
							className="form__input"
							placeholder="Type a message..."
							style={{ fontFamily: "UserFont-1" }}
							value={inputMessage}
							onChange={(e) => {
								e.target.value.length < MAX_MESSAGE_LENGTH &&
									setInputMessage(e.target.value);
							}}
						/>
						<button className="button button__primary">
							<Icon>send</Icon>
						</button>
					</form>
				</div>
			</div>
		</>
	);
};

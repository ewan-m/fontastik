import * as React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useFooterHiding } from "fontastik/hooks/use-footer-hiding";
import { useIsMobile } from "fontastik/hooks/use-is-mobile";
import { Icon } from "fontastik/global/Icon";

const MAX_MESSAGE_LENGTH = 840;

export const Conversation = () => {
	useFooterHiding(true);
	const isMobile = useIsMobile();
	const history = useHistory();
	const [inputMessage, setInputMessage] = useState("");

	return (
		<>
			<h2 className="pageTitle contentAppear">Message.</h2>
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
			<input
				value={inputMessage}
				onChange={(e) => {
					e.target.value.length < MAX_MESSAGE_LENGTH &&
						setInputMessage(e.target.value);
				}}
			/>
		</>
	);
};

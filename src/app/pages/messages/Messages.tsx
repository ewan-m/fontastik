import * as React from "react";
import { useParams } from "react-router-dom";
import { useIsMobile } from "../../hooks/use-is-mobile";
import { Conversations } from "./conversations/Conversations";
import { Conversation } from "./conversation/Conversation";
import "./Messages.scss";

export const Messages = () => {
	const isMobile = useIsMobile();
	const { conversationId } = useParams<{ conversationId?: string }>();

	return (
		<div className="messagesPage">
			{!(isMobile && conversationId) && <Conversations />}
			{!(isMobile && !conversationId) && <Conversation />}
		</div>
	);
};

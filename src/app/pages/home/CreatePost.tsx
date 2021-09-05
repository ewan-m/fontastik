import * as React from "react";
import { useState, MouseEvent, useRef, useEffect } from "react";
import "./CreatePost.scss";
import { Icon } from "../../global/Icon";
import { useHistory } from "react-router-dom";
import { LoadingSpinner } from "../../global/LoadingSpinner";
import { useAuthStore } from "../../store/global-store";
import { useHttpClient } from "../../hooks/use-http-client";
import decode from "jwt-decode";
import { environment } from "../../environment";
import type { TokenPayload } from "../../global/token-payload.type";

const defaultLocation = { x: 0, y: 0 };

type RequestStatus = "initial" | "sending" | "sent";

export const CreatePost = () => {
	const [active, setActive] = useState(false);
	const [location, setLocation] = useState({
		data: defaultLocation,
		state: "unset",
	});
	const [inputText, setInputText] = useState("");
	const [requestStatus, setRequestStatus] = useState("initial" as RequestStatus);
	const history = useHistory();
	const createFrame = useRef<HTMLDivElement>(null);
	const inputElement = useRef<HTMLTextAreaElement>(null);
	const token = useAuthStore((store) => store.token);
	const userId = token ? (decode(token) as TokenPayload)?.["id"] : undefined;
	const http = useHttpClient();

	useEffect(() => {
		if (active) {
			(async () => {
				const response = await http.request({
					method: "GET",
					uri: "has-saved-font",
					withAuth: true,
				});

				if (response.ok) {
					const result = await response.json();
					if (result?.hasSavedFont) {
						return;
					}
				}
				history.push("/create");
			})();
		}
	}, [active]);

	useEffect(() => {
		if (active) {
			document.body.classList.add("no-scrolling");
			inputElement?.current?.focus();
		} else {
			document.body.classList.remove("no-scrolling");
		}
	}, [active]);

	const onCreateClick = () => {
		if (!token) {
			history.push("/account/log-in");
		} else {
			setActive(true);
		}
	};

	const onLocationClick = () => {
		const error = { state: "error", data: defaultLocation };
		setLocation({ state: "loading", data: defaultLocation });
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				({ coords }) => {
					setLocation({
						data: { x: coords.latitude, y: coords.longitude },
						state: "set",
					});
				},
				() => {
					setLocation(error);
				}
			);
		} else {
			setLocation(error);
		}
	};

	const onCloseClick = (e: MouseEvent<HTMLButtonElement>) => {
		createFrame?.current?.classList.add("createPostScreen--closing");
		const delay = setTimeout(() => {
			setActive(false);
			clearTimeout(delay);
		}, 300);
	};

	const onShareClick = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (!inputText || inputText.length > 420) {
			return;
		}
		setRequestStatus("sending");

		const response = await http.request({
			method: "POST",
			uri: "post",
			body: {
				content: inputText,
				x: parseFloat(location.data.x.toFixed(2)),
				y: parseFloat(location.data.y.toFixed(2)),
			},
			withAuth: true,
		});

		if (response.ok) {
			setRequestStatus("sent");
		} else {
			setRequestStatus("initial");
		}
	};

	return (
		<>
			{!active && (
				<button className="createPostButton" onClick={onCreateClick}>
					<Icon>send</Icon>
				</button>
			)}
			{active && (
				<div className="createPostScreen" ref={createFrame}>
					<link
						rel="stylesheet"
						type="text/css"
						href={`${environment.githubDataUrl}/UserFont-${userId}.css`}
					/>
					<div className="createPostScreen__header">
						<h2 className="createPostScreen__header__title">Share with fontastik.</h2>
						<button
							className="createPostScreen__header__close"
							onClick={onCloseClick}
						>
							<Icon>close</Icon>
						</button>
					</div>
					<div className="createPostScreen__inputContainer">
						<textarea
							placeholder="What's the scoop?!"
							aria-label="create-post-input"
							ref={inputElement}
							value={inputText}
							onChange={(e) => {
								setInputText(e.target.value);
							}}
							className="createPostScreen__input"
							style={{ fontFamily: "UserFont-" + userId }}
						></textarea>

						<div className="createPostScreen__buttonRow">
							{location.state === "unset" && (
								<button className="button button__secondary" onClick={onLocationClick}>
									Add location<Icon withMargin="right">place</Icon>
								</button>
							)}
							{location.state === "loading" && <LoadingSpinner />}
							{location.state === "error" && (
								<p className="paragraph">Location not working</p>
							)}
							{location.state === "set" && (
								<p className="paragraph">
									{location.data.x.toFixed(2)}, {location.data.y.toFixed(2)}
								</p>
							)}
							<p className="paragraph paragraph">
								{420 - inputText.length} characters remaining
							</p>
						</div>
						{requestStatus === "initial" && (
							<button
								onClick={onShareClick}
								className="button button__primaryAlt button--large createPostScreen__sendButton"
							>
								Share<Icon withMargin="right">send</Icon>
							</button>
						)}
						{requestStatus === "sending" && <LoadingSpinner />}
						{requestStatus === "sent" && (
							<>
								<p className="paragraph paragraph--b">
									Your message is now released into the world.
								</p>
								<div className="buttonRow">
									<button
										onClick={() => {
											setInputText("");
											setRequestStatus("initial");
										}}
										className="button button__secondary button--large"
									>
										Post another
									</button>
									<button
										onClick={onCloseClick}
										className="button button__primaryAlt button--large"
									>
										Woohoo!
									</button>
								</div>
							</>
						)}
					</div>
				</div>
			)}
		</>
	);
};

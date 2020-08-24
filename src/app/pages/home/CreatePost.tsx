import * as React from "react";
import { useState, MouseEvent, useRef, useEffect } from "react";
import "./CreatePost.scss";
import { Icon } from "../../global/Icon";
import { useHistory } from "react-router-dom";
import { tokenStore } from "../../token-store";
import { LoadingSpinner } from "../../global/LoadingSpinner";

const defaultLocation = { latitude: 0, longitude: 0 };

export const CreatePost = () => {
	const [active, setActive] = useState(false);
	const [location, setLocation] = useState({
		data: defaultLocation,
		state: "unset",
	});
	const [inputText, setInputText] = useState("");
	const history = useHistory();
	const createFrame = useRef<HTMLDivElement>(null);
	const inputElement = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (active) {
			document.body.classList.add("no-scrolling");
			inputElement?.current?.focus();
		} else {
			document.body.classList.remove("no-scrolling");
		}
	}, [active]);

	const onCreateClick = () => {
		if (tokenStore.get()) {
			history.push("/account/log-in");
		} else if (false /*hasntMadeFont*/) {
			history.push("/create");
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
					setLocation({ data: coords, state: "set" });
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

	return (
		<>
			{!active && (
				<button className="createPostButton" onClick={onCreateClick}>
					<Icon>send</Icon>
				</button>
			)}
			{active && (
				<div className="createPostScreen" ref={createFrame}>
					<div className="createPostScreen__header">
						<h2 className="createPostScreen__header__title">Share with Fontastik.</h2>
						<button
							className="createPostScreen__header__close"
							onClick={onCloseClick}
						>
							<Icon>close</Icon>
						</button>
					</div>
					<div className="createPostScreen__inputContainer">
						<textarea
							placeholder="What's the scoop"
							ref={inputElement}
							value={inputText}
							onChange={(e) => {
								setInputText(e.target.value);
							}}
							className="createPostScreen__input"
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
									{location.data.latitude.toFixed(2)},{" "}
									{location.data.longitude.toFixed(2)}
								</p>
							)}
							<p className="paragraph paragraph">
								{420 - inputText.length} characters remaining
							</p>
						</div>

						<button className="button button__primaryAlt button--large createPostScreen__sendButton">
							Share<Icon withMargin="right">send</Icon>
						</button>
					</div>
				</div>
			)}
		</>
	);
};

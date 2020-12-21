import * as React from "react";
import {
	FunctionComponent,
	useEffect,
	useState,
	MouseEvent,
	CSSProperties,
} from "react";
import { useHistory } from "react-router-dom";
import { Icon } from "../../global/Icon";
import "./Account.scss";
import { useHttpClient } from "../../hooks/use-http-client";
import { LoadingSpinner } from "../../global/LoadingSpinner";
import { Errors } from "../../global/Errors";
import { useAuthStore } from "../../store/global-store";
import { decode } from "jsonwebtoken";
import { TokenPayload } from "../../global/token-payload.type";
import { environment } from "../../environment";
import { Post } from "../home/Post";
import { PostData } from "../home/post-data.interface";

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
	const loginAction = useAuthStore((store) => store.login);

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
			const response = await result.json();
			if (response?.token) {
				loginAction(response.token);
			}
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
					className="linkButton"
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
						Okay, thanks!
					</button>
				</div>
			);
		default:
			return null;
	}
};

type RequestStatus = "fetching" | "fetched" | "error";

export const Account = () => {
	const history = useHistory();
	const token = useAuthStore((state) => state.token);
	useEffect(() => {
		if (!token) {
			history.push("account/log-in");
		}
	}, []);

	const decodedToken = decode(token) as TokenPayload;

	const [requestStatus, setRequestStatus] = useState(
		"fetching" as RequestStatus
	);
	const [posts, setPosts] = useState([] as PostData[]);
	const http = useHttpClient();

	useEffect(() => {
		setRequestStatus("fetching");
		(async () => {
			const response = await http.request({
				uri: `user/${decodedToken.id}/posts`,
				method: "GET",
				withAuth: true,
			});
			if (response.ok) {
				const result = await response.json();
				setPosts(result);
				setRequestStatus("fetched");
			} else {
				setRequestStatus("error");
			}
		})();
	}, []);

	const logoutAction = useAuthStore((store) => store.logout);

	return (
		<div className="accountPage">
			<h2 className="pageTitle contentAppear">Your info.</h2>
			<div className="accountFields contentAppear">
				<MiniForm
					endpoint="change-name"
					bodyTag="name"
					initialValue={decodedToken?.name}
					label="Name"
				/>
				<MiniForm
					endpoint="change-email"
					bodyTag="email"
					inputType="email"
					initialValue={decodedToken?.email}
					label="Email"
				/>
				<MiniForm
					endpoint="reset-password"
					bodyTag="password"
					inputType="password"
					initialValue="Change your password"
					label="Change your password"
				/>
				<button
					className="button button__primary button--stacked"
					onClick={() => {
						logoutAction();
						history.push("account/log-in");
					}}
				>
					<Icon withMargin="left">lock</Icon> Sign out
				</button>
				<button
					className="button button__destructive button--stacked"
					onClick={() => {
						(async () => {
							const resp = await http.request({
								method: "DELETE",
								uri: "account",
								withAuth: true,
							});
							if (resp.ok) {
								logoutAction();
								history.push("account/log-in");
							}
						})();
					}}
				>
					<Icon withMargin="left">delete</Icon> Delete your account
				</button>
			</div>
			<h2 className="pageTitle contentAppear">Your posts.</h2>
			<div>
				{requestStatus === "fetched" && (
					<>
						{[...new Set(posts.map((post) => post.user_id))].map((userId) => (
							<link
								key={userId}
								rel="stylesheet"
								type="text/css"
								href={`${environment.githubDataUrl}/UserFont-${userId}.css`}
							/>
						))}
						{posts.map((post, index) => (
							<div
								className="animateIn"
								key={post.post_id}
								style={{ "--animation-order": index } as CSSProperties}
							>
								<Post showName={false} currentLocation={{ x: 0, y: 0 }} {...post} />
							</div>
						))}
					</>
				)}
				{requestStatus === "fetching" && <LoadingSpinner />}
				{requestStatus === "error" && (
					<p className="paragraph">Something went wrong fetching posts.</p>
				)}
			</div>
		</div>
	);
};

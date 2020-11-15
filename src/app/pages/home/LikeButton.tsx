import * as React from "react";
import { useState, FunctionComponent } from "react";
import { useHttpClient } from "../../hooks/use-http-client";
import { usePostLikesStore } from "../../store/global-store";
import "./LikeButton.scss";

export const LikeButton: FunctionComponent<{
	likes: string;
	postId: number;
}> = ({ likes, postId }) => {
	const postsLikedIds = usePostLikesStore((store) => store.postsLikedIds);
	const likePost = usePostLikesStore((store) => store.addPost);
	const unlikePost = usePostLikesStore((store) => store.removePost);

	const isLiked = postsLikedIds.includes(postId);
	const http = useHttpClient();

	const [initiallyLiked] = useState(isLiked);

	const getModifier = () => {
		if (!initiallyLiked && isLiked) {
			return +1;
		}
		if (initiallyLiked && !isLiked) {
			return -1;
		}
		return 0;
	};

	const handleClick = () => {
		isLiked ? unlikePost(postId) : likePost(postId);

		http.request({
			uri: "react-to-post",
			method: "POST",
			body: { isLike: !isLiked, postId: postId },
			withAuth: true,
		});
	};

	return (
		<div
			role="button"
			tabIndex={0}
			className="likeButtonContainer"
			onKeyPress={(e) => {
				if (e.key === "Enter") {
					handleClick();
				}
			}}
			onClick={handleClick}
		>
			<svg
				className={`likeButton ${isLiked ? "likeButton--liked" : ""}`}
				viewBox="467 392 58 57"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g fill="none" fillRule="evenodd" transform="translate(467 392)">
					<path
						d="M29.144 20.773c-.063-.13-4.227-8.67-11.44-2.59C7.63 28.795 28.94 43.256 29.143 43.394c.204-.138 21.513-14.6 11.44-25.213-7.214-6.08-11.377 2.46-11.44 2.59z"
						className="likeButton__heart"
						fill="#999"
					/>
					<circle
						className="likeButton__circle"
						fill="#d65071"
						opacity="0"
						cx="29.5"
						cy="29.5"
						r="1.5"
					/>

					<g id="grp7" opacity="0" transform="translate(7 6)">
						<circle id="oval1" fill="#995a8f" cx="2" cy="6" r="2" />
						<circle id="oval2" fill="#463772" cx="5" cy="2" r="2" />
					</g>

					<g id="grp6" opacity="0" transform="translate(0 28)">
						<circle id="oval1" fill="#bd556f" cx="2" cy="7" r="2" />
						<circle id="oval2" fill="#463772" cx="3" cy="2" r="2" />
					</g>

					<g id="grp3" opacity="0" transform="translate(52 28)">
						<circle id="oval2" fill="#995a8f" cx="2" cy="7" r="2" />
						<circle id="oval1" fill="#995a8f" cx="4" cy="2" r="2" />
					</g>

					<g id="grp2" opacity="0" transform="translate(44 6)">
						<circle id="oval2" fill="#bd556f" cx="5" cy="6" r="2" />
						<circle id="oval1" fill="#995a8f" cx="2" cy="2" r="2" />
					</g>

					<g id="grp5" opacity="0" transform="translate(14 50)">
						<circle id="oval1" fill="#463772" cx="6" cy="5" r="2" />
						<circle id="oval2" fill="#463772" cx="2" cy="2" r="2" />
					</g>

					<g id="grp4" opacity="0" transform="translate(35 50)">
						<circle id="oval1" fill="#995a8f" cx="6" cy="5" r="2" />
						<circle id="oval2" fill="#bd556f" cx="2" cy="2" r="2" />
					</g>

					<g id="grp1" opacity="0" transform="translate(24)">
						<circle id="oval1" fill="#463772" cx="2.5" cy="3" r="2" />
						<circle id="oval2" fill="#463772" cx="7.5" cy="2" r="2" />
					</g>
				</g>
			</svg>
			<label className="likeCount">{Number(likes) + getModifier()}</label>
		</div>
	);
};

import * as React from "react";
import { FunctionComponent } from "react";
import "./Post.scss";
import { Icon } from "../../global/Icon";
import { LikeButton } from "./LikeButton";
import { useMediaQuery } from "../../hooks/use-media-query";

export const Post: FunctionComponent = () => {
	const isMobile = useMediaQuery("(max-width: 450px)");

	return (
		<article className="post">
			<div className="post__side">
				<img
					className="post__image"
					alt="user profile picture"
					src={require("../../../assets/sofia.jpg")}
				/>
				{isMobile && <LikeButton />}
			</div>
			<div className="post__body">
				<address className="post__author">Sofia </address>
				<p className="post__content">
					I think a better name for this app would have been fontastique, it's a got
					a bit of a French flare. Ooh la la if you will. je ne se quois.
				</p>
				<div className="post__info">
					<time className="post__time">
						<Icon>schedule</Icon>&nbsp;5 minutes ago
					</time>
					<label className="post__location">
						<Icon>location_on</Icon>&nbsp;5 miles away
					</label>
				</div>
			</div>
			{!isMobile && <LikeButton />}
		</article>
	);
};

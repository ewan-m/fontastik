import * as React from "react";
import { FunctionComponent } from "react";
import "./Post.scss";
import { Icon } from "../../global/Icon";
import { LikeButton } from "./LikeButton";
import { PostData } from "./post-data.interface";
import { formatDistance } from "date-fns";
import { calculateDistance } from "./calculate-distance";

interface PostComponent extends PostData {
	currentLocation: { x: number; y: number };
	showName?: boolean;
}

export const Post: FunctionComponent<PostComponent> = ({
	name,
	content,
	created,
	location,
	currentLocation,
	user_id,
	post_id,
	post_likes,
	showName = true
}) => {
	const distance = calculateDistance(location, currentLocation);
	return (
		<article className="post">
			<div className="post__body">
				{showName && <address className="post__author">{name} </address>}
				<p className="post__content" style={{ fontFamily: "UserFont-" + user_id }}>
					{content}
				</p>
				<div className="post__info">
					<time className="post__time">
						<Icon>schedule</Icon>&nbsp;
						{formatDistance(new Date(created), new Date(), { addSuffix: true })}
					</time>
					{distance !== null && (
						<label className="post__location">
							<Icon>location_on</Icon>&nbsp;{distance} kilometres away
						</label>
					)}
				</div>
			</div>
			<LikeButton postId={post_id} likes={post_likes} />
		</article>
	);
};

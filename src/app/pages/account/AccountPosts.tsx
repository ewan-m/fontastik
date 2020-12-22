import * as React from "react";
import { CSSProperties, FunctionComponent, useEffect, useState } from "react";
import { environment } from "../../environment";
import { LoadingSpinner } from "../../global/LoadingSpinner";
import { useHttpClient } from "../../hooks/use-http-client";
import { Post } from "../home/Post";
import { PostData } from "../home/post-data.interface";

type RequestStatus = "fetching" | "fetched" | "error";

export const AccountPosts: FunctionComponent<{
	userId: string;
	title: string;
}> = ({ userId, title }) => {
	const [requestStatus, setRequestStatus] = useState(
		"fetching" as RequestStatus
	);
	const [posts, setPosts] = useState([] as PostData[]);
	const http = useHttpClient();

	useEffect(() => {
		setRequestStatus("fetching");
		(async () => {
			const response = await http.request({
				uri: `user/${userId}/posts`,
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

	return (
		<>
			<h2 className="pageTitle contentAppear">{title}</h2>
			<div>
				{requestStatus === "fetched" && (
					<>
						<link
							rel="stylesheet"
							type="text/css"
							href={`${environment.githubDataUrl}/UserFont-${userId}.css`}
						/>
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
		</>
	);
};

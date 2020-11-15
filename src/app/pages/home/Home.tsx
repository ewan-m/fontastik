import * as React from "react";
import "./Home.scss";
import { Icon } from "../../global/Icon";
import { Post } from "./Post";
import { useParams, NavLink } from "react-router-dom";
import { CreatePost } from "./CreatePost";
import { useState, useEffect, CSSProperties } from "react";
import { useHttpClient } from "../../hooks/use-http-client";
import { PostData } from "./post-data.interface";
import { environment } from "../../environment";
import { LoadingSpinner } from "../../global/LoadingSpinner";

type RequestStatus = "fetching" | "fetched" | "error";

const defaultLocation = { x: 0, y: 0 };

export const Home = () => {
	const { category }: { category: string } = useParams();
	const [requestStatus, setRequestStatus] = useState(
		"fetching" as RequestStatus
	);
	const [posts, setPosts] = useState([] as PostData[]);
	const [location, setLocation] = useState({
		data: defaultLocation,
		state: "unset",
	});
	const http = useHttpClient();

	useEffect(() => {
		if (category === "local" && location.state === "unset") {
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
		}
	}, [category]);

	useEffect(() => {
		setRequestStatus("fetching");
		(async () => {
			const response = await http.request({
				method: "GET",
				uri: `posts?type=${category}${
					location.data.x !== 0 && location.data.y !== 0
						? `&x=${location.data.x.toFixed(2)}&y=${location.data.y.toFixed(2)}`
						: ""
				}`,
				withAuth: false,
			});
			if (response.ok) {
				const result = await response.json();
				setPosts(result);
				setRequestStatus("fetched");
			} else {
				setRequestStatus("error");
			}
		})();
	}, [category, location.state]);

	return (
		<div className="homePage">
			<nav className="categoryContainer contentAppear">
				<NavLink
					to="/home/popular"
					activeClassName="categoryLink--active"
					className="categoryLink"
				>
					<Icon withMargin="left">local_fire_department</Icon> Popular
				</NavLink>
				<NavLink
					to="/home/local"
					activeClassName="categoryLink--active"
					className="categoryLink"
				>
					<Icon withMargin="left">place</Icon> Local
				</NavLink>
				<NavLink
					to="/home/new"
					activeClassName="categoryLink--active"
					className="categoryLink"
				>
					<Icon withMargin="left">local_florist</Icon> New
				</NavLink>
			</nav>
			<CreatePost />
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
							<Post currentLocation={location.data} {...post} />
						</div>
					))}
				</>
			)}
			{requestStatus === "fetching" && <LoadingSpinner />}
			{requestStatus === "error" && (
				<p className="paragraph">Something went wrong fetching posts.</p>
			)}
		</div>
	);
};

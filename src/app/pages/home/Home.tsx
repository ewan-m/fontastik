import * as React from "react";
import "./Home.scss";
import { Icon } from "../../global/Icon";
import { Post } from "./Post";
import { useParams, NavLink } from "react-router-dom";
import { CreatePost } from "./CreatePost";

export const Home = () => {
	const { category }: { category: string } = useParams();
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
			<Post />
			<Post />
		</div>
	);
};

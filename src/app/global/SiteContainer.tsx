import * as React from "react";
import { FunctionComponent } from "react";
import { NavLink } from "react-router-dom";
import { useMediaQuery } from "../hooks/use-media-query";
import { Icon } from "./Icon";
import "./SiteContainer.scss";

function NavigationItems({ type }: { type: "footer" | "header" }) {
	return (
		<nav>
			<ul className={`${type}Nav`}>
				<li className={`${type}Nav__item`}>
					<NavLink
						activeClassName={`${type}Nav__item__a--active`}
						className={`${type}Nav__item__a`}
						to="/home"
					>
						<Icon>home</Icon>
						&nbsp;Home
					</NavLink>
				</li>
				<li className={`${type}Nav__item`}>
					<NavLink
						activeClassName={`${type}Nav__item__a--active`}
						className={`${type}Nav__item__a`}
						to="/create"
					>
						<Icon>create</Icon>
						&nbsp;Create
					</NavLink>
				</li>
				<li className={`${type}Nav__item`}>
					<NavLink
						activeClassName={`${type}Nav__item__a--active`}
						className={`${type}Nav__item__a`}
						to="/account"
					>
						<Icon>account_circle</Icon>
						&nbsp;Account
					</NavLink>
				</li>
			</ul>
		</nav>
	);
}

export const SiteContainer: FunctionComponent = ({ children }) => {
	const isMobile = useMediaQuery("(max-width: 450px)");

	return (
		<>
			<header className="siteHeader">
				<div className="siteHeader__inner">
					<NavLink to="/home" className="link">
						<h1 className="siteHeader__h1">
							<Icon>chat</Icon>Font<span style={{ fontWeight: 500 }}>astik</span>.
						</h1>
					</NavLink>
					{!isMobile && <NavigationItems type="header" />}
				</div>
			</header>
			<main className="siteMain">{children}</main>
			{isMobile && (
				<footer className="siteFooter">
					<NavigationItems type="footer" />
				</footer>
			)}
		</>
	);
};

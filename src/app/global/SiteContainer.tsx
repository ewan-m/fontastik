import * as React from "react";
import type { FunctionComponent } from "react";
import { NavLink } from "react-router-dom";
import { useIsMobile } from "../hooks/use-is-mobile";
import { Icon } from "./Icon";
import "./SiteContainer.scss";
import Logo from "url:../../assets/fontastik.png";
import { toSentenceCase } from "./toSentenceCase";
import { useFooterVisibilityStore } from "../store/global-store";

const navItems = [
	{ route: "home" },
	{ route: "create" },
	{ icon: "mail", route: "messages" },
	{ icon: "account_circle", route: "account" },
];

const NavigationItems = ({ type }: { type: "footer" | "header" }) => (
	<nav>
		<ul className={`${type}Nav`}>
			{navItems.map(({ icon, route }) => (
				<li key={route} className={`${type}Nav__item`}>
					<NavLink
						activeClassName={`${type}Nav__item__a--active`}
						className={`${type}Nav__item__a`}
						to={`/${route}`}
					>
						<Icon>{icon ?? route}</Icon>
						{toSentenceCase(route)}
					</NavLink>
				</li>
			))}
		</ul>
	</nav>
);

export const SiteContainer: FunctionComponent = ({ children }) => {
	const isMobile = useIsMobile();
	const { isFooterHidden } = useFooterVisibilityStore();

	return (
		<>
			<header className="siteHeader">
				<div className="siteHeader__inner">
					<NavLink to="/home" className="link">
						<img className="siteHeader__logo" src={Logo} alt="fontastik logo" />
					</NavLink>
					{!isMobile && <NavigationItems type="header" />}
				</div>
			</header>

			<main className="siteMain">
				<div className="pointlessBollocksToMakeStuffLineup"></div>
				{children}
				<div className="pointlessBollocksToMakeStuffLineup"></div>
			</main>
			{isMobile && !isFooterHidden && (
				<footer className="siteFooter">
					<NavigationItems type="footer" />
				</footer>
			)}
		</>
	);
};

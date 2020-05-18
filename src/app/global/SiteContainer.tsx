import * as React from "react";
import { FunctionComponent } from "react";
import { NavLink } from "react-router-dom";
import { Icon } from "./Icon";

export const SiteContainer: FunctionComponent = ({ children }) => (
	<div className="outerWindow">
		<div className="innerWindow">
			<header className="siteHeader">
				<h1 className="siteHeader__h1">Bespoke</h1>
			</header>
			<main className="siteMain">{children}</main>
			<footer className="siteFooter">
				<nav>
					<ul className="footerNav">
						<li className="footerNav__item">
							<NavLink
								activeClassName="footerNav__item__a--active"
								className="footerNav__item__a"
								to="stream"
							>
								<Icon>home</Icon>
								&nbsp;Stream
							</NavLink>
						</li>
						<li className="footerNav__item">
							<NavLink
								activeClassName="footerNav__item__a--active"
								className="footerNav__item__a"
								to="create"
							>
								<Icon>create</Icon>
								&nbsp;Create
							</NavLink>
						</li>
						<li className="footerNav__item">
							<NavLink
								activeClassName="footerNav__item__a--active"
								className="footerNav__item__a"
								to="profile"
							>
								<Icon>account_circle</Icon>
								&nbsp;Profile
							</NavLink>
						</li>
					</ul>
				</nav>
			</footer>
		</div>
	</div>
);

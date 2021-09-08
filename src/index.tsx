import * as React from "react";
import { StrictMode } from "react";
import { render } from "react-dom";
import { Route, Switch, Redirect, HashRouter } from "react-router-dom";
import { SiteContainer } from "./app/global/SiteContainer";
import { Account } from "./app/pages/account/Account";
import { LogIn } from "./app/pages/account/LogIn";
import { MagicLink } from "./app/pages/account/MagicLink";
import { SignUp } from "./app/pages/account/SignUp";
import { Create } from "./app/pages/create/Create";
import { Messages } from "./app/pages/messages/Messages";
import { Home } from "./app/pages/home/Home";
import { User } from "./app/pages/home/User";
import "./index.scss";

const App = () => (
	<StrictMode>
		<HashRouter basename="/">
			<SiteContainer>
				<Switch>
					<Redirect path="/" exact to="home" />
					<Redirect path="/home" exact to="home/popular" />
					<Route path="/home/:category" exact component={Home} />
					<Route path="/home/user/:userId" exact component={User} />
					<Route path="/create" exact component={Create} />
					<Route path="/messages" exact component={Messages} />
					<Route path="/messages/:conversationId" exact component={Messages} />
					<Route path="/account" exact component={Account} />
					<Route path="/account/log-in" exact component={LogIn} />
					<Route path="/account/magic-link" exact component={MagicLink} />
					<Route path="/account/sign-up" exact component={SignUp} />
				</Switch>
			</SiteContainer>
		</HashRouter>
	</StrictMode>
);

render(<App />, document.getElementById("root"));

if ((import.meta as any).hot) {
	(import.meta as any).hot.accept();
}

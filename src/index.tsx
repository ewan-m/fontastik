import { createBrowserHistory } from "history";
import * as React from "react";
import { render } from "react-dom";
import { Route, Router, Switch } from "react-router-dom";
import { SiteContainer } from "./app/global/SiteContainer";
import { Account } from "./app/pages/account/Account";
import { LogIn } from "./app/pages/account/LogIn";
import { MagicLink } from "./app/pages/account/MagicLink";
import { SignUp } from "./app/pages/account/SignUp";
import { Create } from "./app/pages/create/Create";
import { Stream } from "./app/pages/Stream";
import "./index.scss";

const history = createBrowserHistory();

const App = () => (
	<Router history={history}>
		<SiteContainer>
			<Switch>
				<Route path="/stream" exact component={Stream} />
				<Route path="/create" exact component={Create} />
				<Route path="/account" exact component={Account} />
				<Route path="/account/log-in" exact component={LogIn} />
				<Route path="/account/magic-link" exact component={MagicLink} />
				<Route path="/account/sign-up" exact component={SignUp} />
			</Switch>
		</SiteContainer>
	</Router>
);

render(<App />, document.getElementById("root"));

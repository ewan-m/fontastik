import { createBrowserHistory } from "history";
import * as React from "react";
import { render } from "react-dom";
import { Route, Router, Switch } from "react-router-dom";
import { Create } from "./app/pages/create/Create";
import { Profile } from "./app/pages/Profile";
import { Stream } from "./app/pages/Stream";
import { SiteContainer } from "./app/global/SiteContainer";
import "./index.scss";

const history = createBrowserHistory();

const App = () => (
	<Router history={history}>
		<SiteContainer>
			<Switch>
				<Route path="/stream" exact component={Stream} />
				<Route path="/create" exact component={Create} />
				<Route path="/profile" exact component={Profile} />
			</Switch>
		</SiteContainer>
	</Router>
);

render(<App />, document.getElementById("root"));

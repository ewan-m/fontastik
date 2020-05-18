import * as React from "react";
import { FunctionComponent } from "react";
import "./Icon.scss";

export const Icon: FunctionComponent<{ withMargin?: "left" | "right" }> = ({
	children,
	withMargin,
}) => (
	<span
		className={`material-icons ${
			withMargin ? ` material-icons--${withMargin}` : ""
		}`}
	>
		{children}
	</span>
);

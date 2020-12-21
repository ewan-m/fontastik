import * as React from "react";
import { FunctionComponent } from "react";
import "./Icon.scss";

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
	withMargin?: "left" | "right";
}

export const Icon: FunctionComponent<IconProps> = ({
	children,
	withMargin,
	className,
	...props
}) => (
	<span
		{...props}
		className={`material-icons${
			withMargin ? ` material-icons--${withMargin}` : ""
		}${className ? ` ${className}` : ""}`}
	>
		{children}
	</span>
);

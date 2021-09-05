import * as React from "react";
import type { FunctionComponent, HTMLAttributes } from "react";
import "./Icon.scss";

export const Icon: FunctionComponent<
	{ withMargin?: "left" | "right" } & HTMLAttributes<HTMLSpanElement>
> = ({ children, withMargin, className, ...props }) => (
	<span
		{...props}
		className={`material-icons${
			withMargin ? ` material-icons--${withMargin}` : ""
		}${className ? ` ${className}` : ""}`}
	>
		{children}
	</span>
);

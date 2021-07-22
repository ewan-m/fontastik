import * as React from "react";
import { FunctionComponent } from "react";
import { Icon } from "./Icon";

export const Errors: FunctionComponent<{ errors: string[] }> = ({ errors }) => {
	if (typeof errors === "string") {
		errors = [errors];
	}
	const formatError = (error: string) => {
		return `${error[0].toUpperCase()}${error.substring(1)}${
			error[error.length - 1] === "." ? "" : "."
		}`;
	};
	return Array.isArray(errors) && errors.length > 0 ? (
		<>
			{errors.map((error) => (
				<p key={error} className="paragraph paragraph--error contentAppear">
					<Icon withMargin="left">error</Icon>
					{formatError(error)}
				</p>
			))}
		</>
	) : (
		<></>
	);
};

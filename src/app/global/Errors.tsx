import * as React from "react";
import type { FunctionComponent } from "react";
import { Icon } from "./Icon";
import { toSentenceCase } from "./to-sentence-case";

export const Errors: FunctionComponent<{ errors: string[] | string }> = ({
	errors,
}) => {
	if (typeof errors === "string") {
		errors = [errors];
	}
	const formatError = (error: string) =>
		`${toSentenceCase(error)}${error[error.length - 1] === "." ? "" : "."}`;

	return (
		<>
			{errors?.map((error) => (
				<p key={error} className="paragraph paragraph--error contentAppear">
					<Icon withMargin="left">error</Icon>
					{formatError(error)}
				</p>
			))}
		</>
	);
};

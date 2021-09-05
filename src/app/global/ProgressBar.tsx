import * as React from "react";
import type { FunctionComponent } from "react";
import "./ProgressBar.scss";

export const ProgressBar: FunctionComponent<{
	totalSteps: number;
	currentStep: number;
	stepName?: string;
}> = ({ totalSteps, currentStep, stepName }) => (
	<div className="progressBar">
		<div
			style={{ width: `${((100 * (currentStep + 1)) / totalSteps).toFixed(2)}%` }}
			className="progressBar__completed"
		>
			<p className="progressBar__completed__p">{stepName}</p>
		</div>
	</div>
);

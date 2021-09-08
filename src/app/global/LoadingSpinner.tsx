import * as React from "react";
import "./LoadingSpinner.scss";
import { useRandomId } from "fontastik/hooks/use-random-id";

export const LoadingSpinner = () => {
	const random = useRandomId("loadingSpinner");

	return (
		<span aria-label="Loading" className="loadingSpinner__circle">
			<svg viewBox="0 0 50 50" className="loadingSpinner__circle__svg">
				<defs>
					<linearGradient id={random}>
						<stop className="loadingSpinner__circle__colour1" offset="5%" />
						<stop className="loadingSpinner__circle__colour2" offset="95%" />
					</linearGradient>
				</defs>
				<circle
					className="loadingSpinner__circle__svg__circle"
					cx="25"
					cy="25"
					r="20"
					fill="none"
					stroke={`url(#${random})`}
				></circle>
			</svg>
		</span>
	);
};

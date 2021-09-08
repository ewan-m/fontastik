import { useState } from "react";

const useMediaQuery = (query: string) => {
	const mediaQuery = window.matchMedia(query);
	const [matches, setMatches] = useState(mediaQuery.matches);
	mediaQuery.onchange = (e) => {
		setMatches(e.matches);
	};
	return matches;
};

export const useIsMobile = () => useMediaQuery("(max-width: 450px)");

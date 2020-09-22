import { useEffect, useRef } from "react";

export const useInterval = (callback: () => void, delay: number) => {
	const savedCallback = useRef(callback);

	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	useEffect(() => {
		function tick() {
			savedCallback.current();
		}
		const handler = setInterval(tick, delay);
		return () => clearInterval(handler);
	}, [delay]);
};

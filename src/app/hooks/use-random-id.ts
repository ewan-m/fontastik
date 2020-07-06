import { useEffect, useState } from "react";

export const useRandomId = (prefix: string = "") => {
	const [randomId, setRandomId] = useState(`${prefix}0`);
	useEffect(() => {
		setRandomId(`${prefix}${Math.random().toString().substring(2)}`);
	}, []);
	return randomId;
};

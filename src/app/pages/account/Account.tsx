import * as React from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

export const Account = () => {
	const history = useHistory();
	useEffect(() => {
		history.push("account/log-in");
	}, []);
	return <></>;
};

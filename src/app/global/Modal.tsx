import * as React from "react";
import { useEffect } from "react";
import "./Modal.scss";
import FocusTrap from "focus-trap-react";
import { Icon } from "./Icon";

export const Modal = ({
	isVisible,
	onClose,
	children,
	title,
}: {
	isVisible: boolean;
	children: React.ReactNode;
	onClose: () => void;
	title: string;
}) => {
	const handleClose = () => {
		onClose();
	};

	useEffect(() => {
		const onEscCloseModal = ({ key }: KeyboardEvent) => {
			if (key === "Escape") {
				handleClose();
			}
		};

		if (isVisible) {
			document.addEventListener("keydown", onEscCloseModal);
			document.body.style.top = `-${window.scrollY}px`;
			document.body.style.left = "0";
			document.body.style.right = "0";
			document.body.style.position = "fixed";
			document.body.style.overflowY = "scroll";
		} else {
			document.removeEventListener("keydown", onEscCloseModal);
			const scrollY = document.body.style.top;
			document.body.style.position = "";
			document.body.style.top = "";
			document.body.style.left = "";
			document.body.style.right = "";
			document.body.style.overflowY = "";
			window.scrollTo(0, parseInt(scrollY || "0") * -1);
		}

		return () => document.removeEventListener("keydown", onEscCloseModal);
	}, [isVisible]);

	if (!isVisible) {
		return null;
	}

	const onClickBackground = (e: React.MouseEvent) => {
		if ((e.target as Element).matches(".modal__background")) {
			handleClose();
		}
	};

	return (
		<FocusTrap>
			<div className="modal__background" onClick={onClickBackground}>
				<div role="dialog" className="modal__foreground modal--sizeSmall">
					<header className="modal__titleBar">
						<h3 className="modal__title">{title}</h3>
						<button onClick={handleClose} className="button button__secondary">
							<Icon>close</Icon>
						</button>
					</header>
					<div tabIndex={0} className={"modal__content"}>
						<div className={"modal__content__child"}>{children}</div>
					</div>
				</div>
			</div>
		</FocusTrap>
	);
};

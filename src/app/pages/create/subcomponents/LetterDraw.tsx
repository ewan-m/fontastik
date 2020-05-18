import * as React from "react";
import {
	createRef,
	FunctionComponent,
	MouseEvent,
	TouchEvent,
	useState,
	useEffect,
} from "react";
import { updateFont, getFont } from "../../../services/font-storage";
import "./LetterDraw.scss";
import { Icon } from "../../../global/Icon";

const size = 250;

interface LetterDrawProps {
	letter: string;
	setContainsLetter: (doesItContainTheLetter: boolean) => void;
}

export const LetterDraw: FunctionComponent<LetterDrawProps> = ({
	letter,
	setContainsLetter,
}) => {
	const svgElement = createRef<SVGSVGElement>();
	const [path, setPath] = useState("");
	const [isDrawing, setIsDrawing] = useState(false);
	const [showGuides, setShowGuides] = useState(
		localStorage.getItem("showGuides") === "true"
	);

	useEffect(() => {
		const font = getFont();
		if (font[letter]) {
			setPath(font[letter]);
			setContainsLetter(true);
		} else {
			setPath("");
		}
	}, [letter]);

	useEffect(() => {
		updateFont(letter, path);
	}, [path]);

	const startPath = (x: number, y: number) => {
		setIsDrawing(true);
		if (svgElement.current) {
			const { left, top } = svgElement.current.getBoundingClientRect();
			setPath(`${path} M ${(x - left).toFixed(2)} ${(y - top).toFixed(2)}`);
		}
	};

	const drawPath = (x: number, y: number) => {
		if (isDrawing) {
			if (svgElement.current) {
				const { left, top } = svgElement.current.getBoundingClientRect();
				setPath(`${path} L ${(x - left).toFixed(2)} ${(y - top).toFixed(2)}`);
			}
		}
	};
	const endPath = () => {
		setIsDrawing(false);
		setContainsLetter(true);
	};

	const leaveArea = () => {
		setIsDrawing(false);
	};

	const startPathM = (event: MouseEvent<SVGSVGElement>) => {
		startPath(event.clientX, event.clientY);
	};

	const startPathT = (event: TouchEvent<SVGSVGElement>) => {
		event.preventDefault();
		startPath(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
	};

	const drawPathM = (event: MouseEvent<SVGSVGElement>) => {
		drawPath(event.clientX, event.clientY);
	};

	const drawPathT = (event: TouchEvent<SVGSVGElement>) => {
		event.preventDefault();
		drawPath(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
	};

	const tryAgain = () => {
		setPath("");
		setContainsLetter(false);
	};

	return (
		<div className="letterDraw">
			<label className="letterDraw__label" id={`letterDraw__${letter}`}>
				Drawing: <strong>{letter}</strong>
			</label>
			<svg
				ref={svgElement}
				width={size}
				height={size}
				viewBox={`0 0 ${size} ${size}`}
				onMouseDown={startPathM}
				onMouseMove={drawPathM}
				onTouchStart={startPathT}
				onTouchMove={drawPathT}
				onTouchEnd={endPath}
				onTouchCancel={leaveArea}
				onMouseLeave={leaveArea}
				onMouseUp={endPath}
				className="letterDraw__canvas"
				aria-labelledby={`letterDraw__${letter}`}
			>
				{showGuides && (
					<>
						<path className="letterDraw__canvas__guide" d="M10,30 L10,30 L240,30" />
						<path
							className="letterDraw__canvas__guide"
							d="M10,100 L10,100 L240,100"
						/>
						<path
							className="letterDraw__canvas__guide"
							d="M10,185 L10,185 L240,185"
						/>
						<path
							className="letterDraw__canvas__guide"
							d="M10,240 L10,240 L240,240"
						/>
					</>
				)}
				<path d={path} />
			</svg>
			<div>
				<button
					className="button button__secondary letterDraw__button"
					onClick={() => {
						setShowGuides(!showGuides);
						localStorage.setItem("showGuides", `${!showGuides}`);
					}}
				>
					{showGuides ? (
						<>
							<Icon withMargin="left">visibility_off</Icon> Hide guides
						</>
					) : (
						<>
							<Icon withMargin="left">visibility</Icon> Show guides
						</>
					)}
				</button>
				<button
					className="button button__secondary letterDraw__button"
					onClick={tryAgain}
				>
					<Icon withMargin="left">undo</Icon> Try again
				</button>
			</div>
		</div>
	);
};

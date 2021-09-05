import * as React from "react";
import {
	createRef,
	FunctionComponent,
	MouseEvent,
	TouchEvent,
	useState,
	useEffect,
} from "react";
import "./LetterDraw.scss";
import { Icon } from "../../../global/Icon";
import { usePreferencesStore, useFontStore } from "../../../store/global-store";
import { useInterval } from "../../../hooks/use-interval";

const size = 250;

export const LetterDraw: FunctionComponent<{ letter: string }> = ({
	letter,
}) => {
	const svgElement = createRef<SVGSVGElement>();

	const [path, setPath] = useState("");
	const [isThrottled, setIsThrottled] = useState(false);
	const [isDrawing, setIsDrawing] = useState(false);
	const [syncRequired, setSyncRequired] = useState(false);

	const showRuler = usePreferencesStore((store) => store.showRuler);
	const toggleRulerAction = usePreferencesStore(
		(store) => store.toggleRulerPreference
	);

	const syncPath = (path: string) => {
		setPath(path);
		setSyncRequired(true);
	};

	const font = useFontStore((store) => store.font);
	const updateLetterAction = useFontStore((store) => store.setLetter);

	useInterval(() => {
		if (syncRequired) {
			updateLetterAction(letter, path);
			setSyncRequired(false);
		}
	}, 500);

	useInterval(() => {
		setIsThrottled(false);
	}, 25);

	useEffect(() => {
		if (font[letter]) {
			setPath(font[letter]);
		} else {
			setPath("");
		}
	}, [letter]);

	const startPath = (x: number, y: number) => {
		setIsDrawing(true);
		if (svgElement.current) {
			const { left, top } = svgElement.current.getBoundingClientRect();
			syncPath(`${path} M${(x - left).toFixed(2)},${(y - top).toFixed(2)}`);
		}
	};

	const drawPath = (x: number, y: number) => {
		if (isDrawing) {
			if (svgElement.current) {
				const { left, top } = svgElement.current.getBoundingClientRect();
				syncPath(`${path} L${(x - left).toFixed(2)},${(y - top).toFixed(2)}`);
			}
		}
	};
	const endPath = () => {
		setIsDrawing(false);
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
		if (!isThrottled) {
			drawPath(event.clientX, event.clientY);
		}
		setIsThrottled(true);
	};

	const drawPathT = (event: TouchEvent<SVGSVGElement>) => {
		event.preventDefault();
		if (!isThrottled) {
			drawPath(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
		}
		setIsThrottled(true);
	};

	const tryAgain = () => {
		syncPath("");
	};

	return (
		<div className="letterDraw">
			<label className="letterDraw__label" id={`letterDraw__${letter}`}>
				Drawing:{" "}
				<strong>
					{/[A-Za-z]/.test(letter) && (
						<>{letter.toLocaleLowerCase() === letter ? "Lowercase " : "Capital "}</>
					)}
					{letter}
				</strong>
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
				{showRuler && (
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
						toggleRulerAction();
					}}
				>
					{showRuler ? (
						<>
							<Icon withMargin="left">visibility_off</Icon> Hide ruler
						</>
					) : (
						<>
							<Icon withMargin="left">visibility</Icon> Show ruler
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

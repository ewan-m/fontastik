import * as React from "react";
import "../Page.scss";
import { LetterDraw } from "./subcomponents/LetterDraw";
import { Icon } from "../../global/Icon";
import { FunctionComponent, useState } from "react";
import "./Create.scss";
import { characters } from "./characters";
import { getFont } from "../../services/font-storage";

interface Step {
	setStep: (stepNumber: number) => void;
}

const Step0: FunctionComponent<Step> = ({ setStep }) => {
	const [complete, setComplete] = useState(false);

	return (
		<div className="fadeInBottomEntrance">
			<p>
				You see all that cool writing on the stream tab? Those fellas made their own
				font and you can too! Let's start with the letter 'A' in the box below.
			</p>
			<LetterDraw letter="A" setContainsLetter={setComplete} />
			{complete && (
				<p className="fadeInBottomEntrance">
					When you like how it looks hit{" "}
					<button
						className="button button__primary button--large"
						onClick={(e) => {
							e.preventDefault();
							setStep(1);
						}}
					>
						Next <Icon withMargin="right">arrow_forward</Icon>
					</button>
				</p>
			)}
		</div>
	);
};

const Step1: FunctionComponent<Step> = ({ setStep }) => {
	const [complete, setComplete] = useState(false);
	return (
		<div className="fadeInBottomEntrance">
			<p>
				Do you know what's coming next? You guessed it baby, I'm gonna need you to
				draw the letter 'a'.
			</p>
			<LetterDraw letter="a" setContainsLetter={setComplete} />
			{complete && (
				<>
					<p className="fadeInBottomEntrance">
						Looking good, my friend.{" "}
						<button
							className="button button__primary button--large"
							onClick={(e) => {
								e.preventDefault();
								setStep(2);
							}}
						>
							Next <Icon withMargin="right">arrow_forward</Icon>
						</button>
					</p>
				</>
			)}
		</div>
	);
};

const Step2: FunctionComponent<Step> = ({ setStep }) => {
	const [selectedLetter, setSelectedLetter] = useState(characters[2]);
	const [completedLetters, setCompletedLetters] = useState(
		Object.keys(getFont())
	);

	const getLiClassName = (letter: string) => {
		const classes = ["letterNavigation__item"];
		if (letter === selectedLetter) {
			classes.push("letterNavigation__item--current");
		}
		if (completedLetters.includes(letter)) {
			classes.push("letterNavigation__item--completed");
		}
		return classes.join(" ");
	};

	return (
		<div className="fadeInBottomEntrance">
			<p>It's the alphabet time buddy!</p>
			<LetterDraw
				letter={selectedLetter}
				setContainsLetter={(containsIt) => {
					if (containsIt) {
						setCompletedLetters([selectedLetter, ...completedLetters]);
					} else {
						setCompletedLetters(
							completedLetters.filter((letter) => letter !== selectedLetter)
						);
					}
				}}
			/>
			<ol className="letterNavigation">
				{characters.map((letter) => (
					<li className={getLiClassName(letter)} key={letter}>
						<a
							href={`#${letter}`}
							className="letterNavigation__item__a"
							onClick={(e) => {
								e.preventDefault();
								setSelectedLetter(letter);
							}}
						>
							{completedLetters.includes(letter) ? (
								<Icon
									withMargin="left"
									key={`${letter}--${completedLetters.includes(letter)}`}
									className="fadeInBottomEntrance"
									style={{ fontSize: "1.25rem" }}
								>
									check_circle
								</Icon>
							) : (
								<Icon
									withMargin="left"
									key={`${letter}--${completedLetters.includes(letter)}`}
									className="fadeInBottomEntrance"
									style={{ fontSize: "1.25rem" }}
								>
									radio_button_unchecked
								</Icon>
							)}
							{getFont()[letter] ? (
								<svg
									className="letterPreviewSvg"
									width="1em"
									height="1em"
									viewBox="0 0 250 250"
								>
									<path d={getFont()[letter]} />
								</svg>
							) : (
								letter
							)}
						</a>
					</li>
				))}
			</ol>
			<p className="fadeInBottomEntrance">
				Looking good, my friend.{" "}
				<button
					className="button button__primary button--large"
					onClick={(e) => {
						e.preventDefault();
						setStep(3);
					}}
				>
					Next <Icon withMargin="right">arrow_forward</Icon>
				</button>
			</p>
		</div>
	);
};

export const Step3: FunctionComponent<Step> = ({ setStep }) => {
	const [somethingImTyping, setSomethingImTyping] = useState("");
	const font = getFont();

	return (
		<div className="fadeInBottomEntrance">
			<textarea
				className="fontPreview"
				value={somethingImTyping}
				onChange={(event) => {
					setSomethingImTyping(event.target.value);
				}}
			></textarea>

			{somethingImTyping.split("").map((letter) => (
				<svg
					viewBox="0 0 250 250"
					width="1em"
					height="1em"
					className="letterPreviewSvg"
				>
					<path d={font[letter]} />
				</svg>
			))}
		</div>
	);
};

export const Create = () => {
	const [step, setStep] = useState(0);

	return (
		<div className="pageContainer">
			<h2 className="pageTitle">Create your own font</h2>
			{
				[
					<Step0 setStep={setStep} key={0} />,
					<Step1 setStep={setStep} key={1} />,
					<Step2 setStep={setStep} key={2} />,
					<Step3 setStep={setStep} key={3} />,
				][step]
			}
		</div>
	);
};

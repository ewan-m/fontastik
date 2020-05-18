import * as React from "react";
import "../Page.scss";
import { LetterDraw } from "./subcomponents/LetterDraw";
import { Icon } from "../../global/Icon";
import { FunctionComponent, useState } from "react";

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

const Step2: FunctionComponent<Step> = () => {
	const letters = ["B", "b", "C", "c"];
	const [selectedLetter, setSelectedLetter] = useState(letters[0]);

	return (
		<div className="fadeInBottomEntrance">
			<ol className="lettersSideBar">
				{letters.map((letter) => (
					<li className="lettersSideBar__li" key={letter}>
						<button
							className="button"
							onClick={(e) => {
								e.preventDefault();
								setSelectedLetter(letter);
							}}
						>
							{letter}
						</button>
					</li>
				))}
			</ol>
			<LetterDraw letter={selectedLetter} setContainsLetter={(containsIt) => {}} />
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
				][step]
			}
		</div>
	);
};

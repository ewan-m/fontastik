import * as React from "react";
import { FunctionComponent, useEffect, useState, MouseEvent } from "react";
import { Icon } from "../../global/Icon";
import { getFont } from "../../workers/font-storage";
import "../Page.scss";
import { characters } from "./characters";
import "./Create.scss";
import { LetterDraw } from "./subcomponents/LetterDraw";
import { convertToTTF } from "../../workers/svg-font-string";
import { LoadingSpinner } from "../../global/LoadingSpinner";
import { useHttpClient } from "../../hooks/use-http-client";
import { Errors } from "../../global/Errors";

interface Step {
	setStep: (stepNumber: number) => void;
}

const Step0: FunctionComponent<Step> = ({ setStep }) => {
	const [complete, setComplete] = useState(false);

	return (
		<div className="contentAppear">
			<p className="paragraph paragraph--b">
				You see all that cool writing on the stream tab? Those fellas made their own
				font and you can too! Let's start with the letter 'A' in the box below.
			</p>
			<LetterDraw letter="A" setContainsLetter={setComplete} />
			{complete && (
				<p className="contentAppear paragraph">
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
		<div className="contentAppear">
			<p className="paragraph paragraph--b">
				Do you know what's coming next? You guessed it baby, I'm gonna need you to
				draw the letter 'a'.
			</p>
			<LetterDraw letter="a" setContainsLetter={setComplete} />
			{complete && (
				<>
					<p className="contentAppear paragraph">
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
		<div className="contentAppear">
			<p className="paragraph paragraph--b">It's the alphabet time buddy!</p>
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
			<ol className="letterNavigation" id="letterNavigation">
				{characters.map((letter) => (
					<li className={getLiClassName(letter)} key={letter}>
						<a
							href={`#${letter}`}
							className="letterNavigation__item__a"
							onClick={(e) => {
								e.preventDefault();
								const container = document.getElementById("letterNavigation");
								if (container) {
									container.scrollTo({
										left:
											e.currentTarget.offsetLeft -
											container.clientWidth / 2 +
											e.currentTarget.clientWidth / 2,
										behavior: "smooth",
									});
								}
								setSelectedLetter(letter);
							}}
						>
							{getFont()[letter]?.length > 0 ? (
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
			<p className="contentAppear paragraph">
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
	const [previewText, setPreviewText] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [fontTtf, setFontTtf] = useState(new Uint8Array());

	const [errors, setErrors] = useState([] as string[]);
	const [isSendingRequest, setIsSendingRequest] = useState(false);

	const http = useHttpClient();
	const font = getFont();

	useEffect(() => {
		convertToTTF(font).then((res) => {
			document.fonts.add(new FontFace("Handwriting", res.buffer));
			setFontTtf(res.buffer);
			setIsLoading(false);
		});
	}, []);

	const onSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setErrors([]);
		setIsSendingRequest(true);

		try {
			const result = await http.request({
				method: "POST",
				uri: "font",
				body: {
					fontTtf: JSON.stringify(fontTtf),
					fontCharacters: JSON.stringify(font),
				},
				withAuth: true,
			});
			setIsSendingRequest(false);
			if (result.message) {
				setErrors(
					Array.isArray(result.message) ? result.message : [result.message]
				);
			} else {
			}
		} catch (error) {
			setIsSendingRequest(false);
			setErrors(["Something went wrong saving your font."]);
		}
	};

	return (
		<div className="contentAppear">
			<div>
				{isLoading && (
					<p className="paragraph">
						<LoadingSpinner /> Generating your font
					</p>
				)}
				{!isLoading && (
					<>
						<textarea
							className="fontPreview"
							autoFocus={true}
							value={previewText}
							onChange={(event) => {
								setPreviewText(event.target.value);
							}}
						></textarea>

						<button
							disabled={isSendingRequest}
							className="button button__primary button--large"
							onClick={onSubmit}
						>
							Save font <Icon withMargin="right">font_download</Icon>
						</button>
						<Errors errors={errors} />
					</>
				)}
			</div>
		</div>
	);
};

export const Create = () => {
	const [step, setStep] = useState(0);

	return (
		<div className="createPage">
			<h2 className="pageTitle contentAppear">Create your own font.</h2>
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

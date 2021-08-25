import * as React from "react";
import { FunctionComponent, useEffect, useState, MouseEvent } from "react";
import { Icon } from "../../global/Icon";
import "../Page.scss";
import { alphaCharacters, numbers, specialCharacters } from "./characters";
import "./Create.scss";
import { LetterDraw } from "./subcomponents/LetterDraw";
import { convertToTTF } from "../../font-processing/svg-font-string";
import { LoadingSpinner } from "../../global/LoadingSpinner";
import { useHttpClient } from "../../hooks/use-http-client";
import { Errors } from "../../global/Errors";
import { Link } from "react-router-dom";
import {
	useFontStore,
	useAuthStore,
	useFontCreationProgressStore,
} from "../../store/global-store";
import type { Font } from "../../font-processing/font.type";

interface Step {
	setStep: (stepNumber: number) => void;
}

const Step0: FunctionComponent<Step> = ({ setStep }) => {
	const font = useFontStore((store) => store.font);

	return (
		<div className="contentAppear">
			<p className="paragraph paragraph--b">
				You see all that cool writing on the home page? They converted their
				handwriting into a font and you can too! Let's start with the letter 'A' in
				the box below.
			</p>
			<LetterDraw letter="A" />
			{!!font["A"] && (
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
	const font = useFontStore((store) => store.font);

	return (
		<div className="contentAppear">
			<p className="paragraph paragraph--b">
				Do you know what's coming next? You guessed it baby, I'm gonna need you to
				draw the letter 'a'.
			</p>
			<LetterDraw letter="a" />
			{!!font["a"] && (
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

const LetterNavigator = ({
	setSelectedLetter,
	selectedLetter,
	font,
	characters,
}: {
	characters: string[];
	selectedLetter: string;
	font: Font;
	setSelectedLetter: any;
}) => {
	const getLiClassName = (letter: string) => {
		const classes = ["letterNavigation__item"];
		if (letter === selectedLetter) {
			classes.push("letterNavigation__item--current");
		}
		if (!!font[letter]) {
			classes.push("letterNavigation__item--completed");
		}
		return classes.join(" ");
	};
	return (
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
						{font[letter]?.length > 0 ? (
							<svg
								className="letterPreviewSvg"
								width="1em"
								height="1em"
								viewBox="0 0 250 250"
							>
								<path d={font[letter]} />
							</svg>
						) : (
							letter
						)}
					</a>
				</li>
			))}
		</ol>
	);
};

const Step2: FunctionComponent<Step> = ({ setStep }) => {
	const [selectedLetter, setSelectedLetter] = useState(alphaCharacters[2]);
	const font = useFontStore((store) => store.font);

	return (
		<div className="contentAppear">
			<p className="paragraph paragraph--b">It's the alphabet time buddy!</p>
			<LetterDraw letter={selectedLetter} />
			<LetterNavigator
				font={font}
				selectedLetter={selectedLetter}
				setSelectedLetter={setSelectedLetter}
				characters={alphaCharacters}
			/>
			{Object.keys(font)
				.sort()
				.join("")
				.includes(alphaCharacters.sort().join("")) && (
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
			)}
		</div>
	);
};

const Step3: FunctionComponent<Step> = ({ setStep }) => {
	const [selectedLetter, setSelectedLetter] = useState(numbers[0]);
	const [isCustomising, setIsCustomising] = useState(false);
	const font = useFontStore((store) => store.font);

	return isCustomising ? (
		<div className="contentAppear" key={1}>
			<p className="paragraph paragraph--b">It's numbers time mi amigo!</p>
			<LetterDraw letter={selectedLetter} />
			<LetterNavigator
				font={font}
				selectedLetter={selectedLetter}
				setSelectedLetter={setSelectedLetter}
				characters={numbers}
			/>

			{Object.keys(font).join("").includes(numbers.join("")) && (
				<p className="contentAppear paragraph">
					Looking good, my friend.{" "}
					<button
						className="button button__primary button--large"
						onClick={(e) => {
							e.preventDefault();
							setStep(4);
						}}
					>
						Next <Icon withMargin="right">arrow_forward</Icon>
					</button>
				</p>
			)}
		</div>
	) : (
		<div className="contentAppear" key={0}>
			<p className="paragraph paragraph--b">
				Would you like to customise your numbers?
			</p>
			<div className="buttonRow">
				<button
					className="button button__secondary button--large"
					onClick={(e) => {
						e.preventDefault();
						setStep(4);
					}}
				>
					Skip
				</button>
				<button
					className="button button__primary button--large"
					onClick={(e) => {
						e.preventDefault();
						setIsCustomising(true);
					}}
				>
					Yes! <Icon withMargin="right">arrow_forward</Icon>
				</button>
			</div>
		</div>
	);
};

const Step4: FunctionComponent<Step> = ({ setStep }) => {
	const [selectedLetter, setSelectedLetter] = useState(specialCharacters[0]);
	const [isCustomising, setIsCustomising] = useState(false);
	const font = useFontStore((store) => store.font);

	return isCustomising ? (
		<div className="contentAppear" key={1}>
			<p className="paragraph paragraph--b">
				It's special characters time mon ami!
			</p>
			<LetterDraw letter={selectedLetter} />
			<LetterNavigator
				font={font}
				selectedLetter={selectedLetter}
				setSelectedLetter={setSelectedLetter}
				characters={specialCharacters}
			/>

			{Object.keys(font).join("").includes(specialCharacters.join("")) && (
				<p className="contentAppear paragraph">
					Looking good, my friend.{" "}
					<button
						className="button button__primary button--large"
						onClick={(e) => {
							e.preventDefault();
							setStep(5);
						}}
					>
						Next <Icon withMargin="right">arrow_forward</Icon>
					</button>
				</p>
			)}
		</div>
	) : (
		<div className="contentAppear" key={0}>
			<p className="paragraph paragraph--b">
				Would you like to customise your punctuation marks?
			</p>
			<div className="buttonRow">
				<button
					className="button button__secondary button--large"
					onClick={(e) => {
						e.preventDefault();
						setStep(5);
					}}
				>
					Skip
				</button>
				<button
					className="button button__primary button--large"
					onClick={(e) => {
						e.preventDefault();
						setIsCustomising(true);
					}}
				>
					Yes! <Icon withMargin="right">arrow_forward</Icon>
				</button>
			</div>
		</div>
	);
};

type Stage = "generating" | "initial" | "saving" | "saved";

export const Step5: FunctionComponent<Step> = () => {
	const [fontTtf, setFontTtf] = useState(new Uint8Array());

	const [errors, setErrors] = useState([] as string[]);
	const [stage, setStage] = useState("generating" as Stage);

	const token = useAuthStore((store) => store.token);
	const http = useHttpClient();
	const font = useFontStore((store) => store.font);
	const [previewText, setPreviewText] = useState(Object.keys(font).join(""));

	useEffect(() => {
		let isSubscribed = true;
		convertToTTF(font).then((res) => {
			if (isSubscribed) {
				document.fonts.add(new FontFace("Handwriting", res.buffer));
				setFontTtf(res.buffer);
				setStage("initial");
			}
		});

		return () => {
			isSubscribed = false;
		};
	}, []);

	const onSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setErrors([]);
		setStage("saving");

		const response = await http.request({
			method: "POST",
			uri: "font-data",
			body: {
				fontData: Object.values(fontTtf),
			},
			withAuth: true,
		});
		const result = await response.json();

		if (!response.ok) {
			setStage("initial");
			if (result.message) {
				setErrors(
					Array.isArray(result.message) ? result.message : [result.message]
				);
			} else {
				setErrors(["Something went wrong saving your font."]);
			}
		} else {
			setStage("saved");
		}
	};

	return (
		<div className="contentAppear">
			<div>
				{stage === "generating" && (
					<p className="paragraph">
						<LoadingSpinner /> Generating your font (this can take up to a minute or
						so)
					</p>
				)}
				{stage !== "generating" && (
					<>
						<textarea
							className="fontPreview"
							autoFocus={true}
							value={previewText}
							onChange={(event) => {
								setPreviewText(event.target.value);
							}}
						></textarea>
						{stage === "saved" && (
							<p className="paragraph">
								Your font has been saved! Now you can go spread the word on the home
								page.
							</p>
						)}
						{stage !== "saved" && (
							<>
								{token && (
									<>
										<button
											disabled={stage === "saving"}
											className="button button__primary button--large"
											onClick={onSubmit}
										>
											Save font <Icon withMargin="right">font_download</Icon>
										</button>
										{stage === "saving" && <LoadingSpinner />}
										<Errors errors={errors} />
									</>
								)}
								{!token && (
									<>
										<p className="paragraph paragraph--b">
											To save your font to use in posts please create, or log in to, your
											account.
										</p>
										<Link className="button button__primary button--large" to="account">
											Log in or create an account
										</Link>
									</>
								)}
								<div className="downloadButtonContainer">
									<a
										className="button button__secondary button--large"
										href={window.URL.createObjectURL(
											new Blob([fontTtf], { type: "font/ttf" })
										)}
										download="MyFont.ttf"
									>
										Download font <Icon withMargin="right">cloud_download</Icon>
									</a>
								</div>
							</>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export const Create = () => {
	const step = useFontCreationProgressStore((store) => store.step);
	const setStep = useFontCreationProgressStore((store) => store.setStep);

	return (
		<div className="createPage">
			<h2 className="pageTitle contentAppear">Create your font.</h2>
			{step > 0 && (
				<button
					className="linkButton contentAppear"
					onClick={(e) => {
						e.preventDefault();
						setStep(step - 1);
					}}
				>
					<Icon withMargin="left">arrow_back</Icon>Back
				</button>
			)}
			{
				[
					<Step0 setStep={setStep} key={0} />,
					<Step1 setStep={setStep} key={1} />,
					<Step2 setStep={setStep} key={2} />,
					<Step3 setStep={setStep} key={3} />,
					<Step4 setStep={setStep} key={4} />,
					<Step5 setStep={setStep} key={5} />,
				][step]
			}
		</div>
	);
};

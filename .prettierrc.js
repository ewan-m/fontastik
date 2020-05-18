module.exports = {
	printWidth: 80,
	tabWidth: 1,
	useTabs: true,
	semi: true,
	singleQuote: false,
	jsxSingleQuote: false,
	trailingComma: "es5",
	quoteProps: "consistent",
	bracketSpacing: true,
	jsxBracketSameLine: false,
	endOfLine: "lf",
	arrowParens: "always",
	overrides: [
		{
			files: "*.ts",
			options: {
				parser: "typescript",
			},
		},
	],
};

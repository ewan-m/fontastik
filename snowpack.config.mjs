/** @type {import("snowpack").SnowpackUserConfig } */
export default {
	mount: {
		public: { url: "/", static: true },
		src: { url: "/dist" },
	},
	optimize: {
		bundle: true,
		minify: true,
		target: 'es2020',
		treeshake: true,
	},
	plugins: [
		"@snowpack/plugin-react-refresh",
		"@snowpack/plugin-dotenv",
		"@snowpack/plugin-sass",
		"@snowpack/plugin-typescript"
	],
	polyfillNode: true,
	devOptions: {
		port: 1234
	},
	buildOptions: {
		out: "docs",
	}
};

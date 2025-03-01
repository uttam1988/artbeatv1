module.exports = {
	parser: "@typescript-eslint/parser",
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
	rules: {
		"@typescript-eslint/no-explicit-any": "warn",
		"@typescript-eslint/explicit-module-boundary-types": "off",
	},
};

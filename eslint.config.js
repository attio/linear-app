const typescriptParser = require("@typescript-eslint/parser")
const typescriptPlugin = require("@typescript-eslint/eslint-plugin")
const attioRules = require("attio/lint")

const baseConfig = {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
        parser: typescriptParser,
        parserOptions: {ecmaFeatures: {jsx: true}, ecmaVersion: 2020, sourceType: "module"},
    },
    plugins: {
        "@typescript-eslint": typescriptPlugin,
        attio: {rules: attioRules.rules},
    },
    rules: {
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-unused-vars": [
            "error",
            {argsIgnorePattern: "^_", varsIgnorePattern: "^_"},
        ],
        "@typescript-eslint/consistent-type-imports": [
            "error",
            {prefer: "type-imports", fixStyle: "inline-type-imports"},
        ],
        "attio/attio-client-import": "error",
        "attio/server-default-export": "error",
        "attio/form-submit-button": "error",
        "attio/widget-text-children": "error",
    },
    settings: {react: {version: "detect"}},
}

module.exports = [
    baseConfig,
    {
        // consistent-type-exports requires typed linting; exclude __mocks__ (not in tsconfig)
        files: ["src/**/*.{ts,tsx}"],
        ignores: ["src/__mocks__/**"],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaFeatures: {jsx: true},
                ecmaVersion: 2020,
                sourceType: "module",
                project: true,
                tsconfigRootDir: __dirname,
            },
        },
        plugins: {"@typescript-eslint": typescriptPlugin},
        rules: {
            "@typescript-eslint/consistent-type-exports": [
                "error",
                {fixMixedExportsWithInlineTypeSpecifier: true},
            ],
        },
    },
    {ignores: ["dist/", "node_modules/", "**/*.d.ts"]},
]

import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import eslintConfigPrettier from "eslint-config-prettier";
import react from "eslint-plugin-react";
import jsxA11y from "eslint-plugin-jsx-a11y";
import tailwind from "eslint-plugin-tailwindcss";

export default tseslint.config(
    {
        files: ["**/*.{ts,tsx}"],
        ignores: ["dist", "release"],
    },
    {
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommendedTypeChecked,
            ...tseslint.configs.stylisticTypeChecked,
            importPlugin.flatConfigs.recommended,
            eslintConfigPrettier,
            ...tailwind.configs["flat/recommended"],
            react.configs.flat.recommended,
            react.configs.flat["jsx-runtime"],
        ],
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
            react,
            "jsx-a11y": jsxA11y,
        },
        ignores: [".*.js", "node_modules/", "dist/", "**.config.**"],
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
            "no-unreachable": "error",
            "prefer-destructuring": "error",
            "object-shorthand": "error",
            eqeqeq: "error",
            yoda: "error",
            "arrow-body-style": "off",
            "no-label-var": "error",
            "no-undef-init": "warn",
            "new-cap": ["error", { capIsNew: false }],
            "new-parens": "error",
            "no-array-constructor": "error",
            "no-new-func": "error",
            "no-new-wrappers": "error",
            "no-bitwise": "error",
            "no-lonely-if": "error",
            "no-multi-assign": ["error"],
            "no-unneeded-ternary": "error",
            "no-nested-ternary": "error",
            "prefer-object-spread": "error",
            "prefer-rest-params": "error",
            "prefer-template": "error",
            "default-case-last": "error",
            "grouped-accessor-pairs": "error",
            "no-useless-computed-key": "error",
            "no-useless-rename": "error",
            "no-constant-binary-expression": "error",
            "no-promise-executor-return": ["error", { allowVoid: true }],
            "no-template-curly-in-string": "error",
            "no-unreachable-loop": "error",
            "no-caller": "error",
            "no-constructor-return": "error",
            "no-else-return": "warn",
            "no-eval": "error",
            "no-extend-native": "error",
            "no-extra-bind": "error",
            "no-extra-label": "error",
            "no-floating-decimal": "error",
            "no-implicit-coercion": "error",
            "no-implied-eval": "error",
            "no-iterator": "error",
            "no-labels": ["error"],
            "no-lone-blocks": "error",
            "no-new": "error",
            "no-proto": "error",
            "no-return-assign": "error",
            "no-script-url": "error",
            "no-self-compare": "error",
            "no-sequences": "error",
            "no-useless-call": "error",
            "no-useless-concat": "error",
            "no-useless-return": "error",
            "consistent-return": "error",
            "prefer-named-capture-group": "error",
            "prefer-promise-reject-errors": ["error", { allowEmptyReject: true }],
            "prefer-regex-literals": "error",
            "no-octal-escape": "error",
            "no-param-reassign": "error",
            "no-console": "error",
            "no-alert": "error",
            "symbol-description": "error",
            "array-callback-return": ["error", { allowImplicit: true }],
            "@/lines-between-class-members": ["error", "always", { exceptAfterSingleLine: true }],
            "@typescript-eslint/no-unnecessary-condition": "error",
            "@typescript-eslint/no-floating-promises": "off",
            "@typescript-eslint/no-unused-vars": ["error", { ignoreRestSiblings: true, argsIgnorePattern: "^_" }],
            "no-shadow": "off",
            "@typescript-eslint/no-shadow": "error",
            "no-loop-func": "off",
            "@typescript-eslint/no-loop-func": "error",
            "no-useless-constructor": "off",
            "@typescript-eslint/no-useless-constructor": "error",
            "require-await": "off",
            "@typescript-eslint/require-await": "off",
            "@typescript-eslint/default-param-last": "error",
            "@typescript-eslint/no-misused-promises": "off",
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    selector: "variable",
                    filter: "__typename",
                    format: null,
                },
                {
                    selector: "variable",
                    types: ["function"],
                    format: ["camelCase", "PascalCase"],
                    leadingUnderscore: "allow",
                },
                {
                    selector: "variable",
                    types: ["boolean", "number", "string", "array"],
                    format: ["camelCase", "UPPER_CASE"],
                },
                {
                    selector: "typeLike",
                    format: ["PascalCase"],
                },
            ],

            "import/no-unresolved": "off",
            "import/first": "error",
            "import/named": "off",
            "import/newline-after-import": "warn",
            "import/no-named-as-default": "off",
            "import/no-cycle": "error",
            "import/no-extraneous-dependencies": ["error", { includeTypes: true }],
            "import/no-mutable-exports": "error",
            "import/no-relative-packages": "error",
            "import/no-self-import": "error",
            "import/no-useless-path-segments": ["error"],
            "import/order": [
                "error",
                {
                    alphabetize: {
                        order: "asc",
                        caseInsensitive: true,
                    },
                    groups: ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"],
                },
            ],

            "react/self-closing-comp": "error",
            "react/jsx-no-useless-fragment": "error",
            "react/button-has-type": "error",
            "react/function-component-definition": ["error", { namedComponents: "arrow-function" }],
            "react/hook-use-state": "error",
            "react/jsx-boolean-value": "error",
            "react/jsx-curly-brace-presence": "error",
            "react/jsx-fragments": "error",
            "react/jsx-pascal-case": "error",
            "react/no-array-index-key": "error",
            "react/no-unstable-nested-components": "error",
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    }
);

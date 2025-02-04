import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';

// Import TypeScript parser correctly
import tsParser from '@typescript-eslint/parser';

// Airbnb rules for Flat Config
import airbnbBase from 'eslint-config-airbnb-base/rules/style';
import airbnbES6 from 'eslint-config-airbnb-base/rules/es6';
import airbnbImports from 'eslint-config-airbnb-base/rules/imports';
import airbnbReact from 'eslint-config-airbnb/rules/react';
import airbnbReactA11y from 'eslint-config-airbnb/rules/react-a11y';

export default tseslint.config(
    { ignores: ['dist'] },
    {
        files: ['src/**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.eslint.json'
            },
        },
        settings: {
            react: {
                version: 'detect'
            },
        },
        plugins: {
            import: importPlugin,
            'jsx-a11y': jsxA11y,
            react: react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            // Airbnb rules manually included
            ...airbnbBase.rules,
            ...airbnbES6.rules,
            ...airbnbImports.rules,
            ...airbnbReact.rules,
            ...airbnbReactA11y.rules,

            // Additional React & Hooks rules
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],

            // Custom overrides (optional)
            'import/no-extraneous-dependencies': 'off',
            'react/react-in-jsx-scope': 'off',
            'react/jsx-filename-extension': ['warn', { extensions: ['.tsx'] }],
            'react/jsx-indent': ['error', 2],
            'react/jsx-indent-props': ['error', 2],
            'indent': ['error', 2],
            "react/jsx-props-no-spreading": "off"
        },
    }
);
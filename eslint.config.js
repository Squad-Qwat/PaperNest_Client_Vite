import eslint from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import reactplugin from 'eslint-plugin-react'
import reacthooks from 'eslint-plugin-react-hooks'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default [
  eslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react: reactplugin,
      'react-hooks': reacthooks,
      prettier: prettier,
    },
    rules: {
      'react/react-in-jsx-scope': 'off', // Since React 17, we don't need to import React for JSX
      'prettier/prettier': ['error'],
      '@typescript-eslint/no-empty-pattern': 'off', // Allow empty object patterns
      '@typescript-eslint/no-namespace': 'off', // Allow namespaces for React Router types
      '@typescript-eslint/no-empty-object-type': 'off', // Allow empty object types
      ...tseslint.configs.recommended.rules,
      ...reactplugin.configs.recommended.rules,
      ...reacthooks.configs.recommended.rules,
      ...prettierConfig.rules,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]

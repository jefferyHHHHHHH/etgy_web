import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import typescriptPlugin from 'typescript-eslint'
import globals from 'globals'
import prettier from 'eslint-plugin-prettier'
import vueParser from 'vue-eslint-parser'

export default [
  {
    ignores: ['dist', 'node_modules', 'coverage'],
  },
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  ...typescriptPlugin.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js}'],
    languageOptions: {
      parser: typescriptPlugin.parser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      'no-empty': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        parser: typescriptPlugin.parser,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/html-indent': 'off',
      'vue/html-self-closing': 'off',
      'no-empty': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
]

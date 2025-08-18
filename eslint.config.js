import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import eslintConfigPrettier from "eslint-config-prettier";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts,vue}"]},
   {
    languageOptions: {
      globals: {
        definePageMeta: 'readonly',
        ...globals.browser,
        ...globals.node
      }
    }
  },
  {languageOptions: { globals: {...globals.browser, ...globals.node} }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    ignores: ['node_modules', 'dist', 'public', '.nuxt']
  },
  eslintConfigPrettier,
  {files: ["**/*.vue"], languageOptions: {parserOptions: {parser: tseslint.parser}}},
  {
    rules: {
      "vue/multi-word-component-names": "off",
      "no-unused-vars": "warn",
      "@typescript-eslint/no-unused-vars": "warn"
    }
  }
];
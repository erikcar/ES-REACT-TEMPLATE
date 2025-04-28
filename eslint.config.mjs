import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";


export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  {
    files: ["**/*.{js,mjs,cjs,jsx}"], languageOptions: { globals: globals.browser }, rules: {
      "no-unused-vars": "warn",
      "react/prop-types": "warn",
      "no-undef": "warn",
    }
  },
  pluginReact.configs.flat.recommended,
  { files: ["**/*.{js,mjs,cjs,jsx}"], plugins: { js }, extends: ["js/recommended"], rules: {
    "no-unused-vars": "warn",
    "react/prop-types": "off",
    "no-undef": "warn",
  } },
  //
]);
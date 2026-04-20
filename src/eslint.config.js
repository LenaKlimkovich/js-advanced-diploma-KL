import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import jestPlugin from "eslint-plugin-jest";

export default defineConfig([

  {
    ignores: [
      "coverage/**",
      "dist/**",
      "build/**",
      "temp/**",
      "*.min.js",
      "webpack.config.js"
    ]
  },


  {
    files: ["**/*.config.js"],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },

 
  {
    files: ["**/__tests__/**/*.js", "**/*.test.js"],
    plugins: { jest: jestPlugin },
    languageOptions: {
      globals: {
        ...globals.jest
      }
    },
    rules: {
      ...jestPlugin.configs.recommended.rules
    }
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: { js },
    extends: [js.configs.recommended],
    rules: {
      quotes: ["error", "double"],
      indent: ["error", 2],
      "space-infix-ops": ["error", { int32Hint: false }],
      "eol-last": ["error", "always"],
      semi: "error",
      "prefer-const": "warn"
    }
  }
]);

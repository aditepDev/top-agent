import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

export default [
  {
    ignores: ["node_modules", "dist", "build", "bun.lockb"]
  },
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: process.cwd(),
        sourceType: "module"
      }
    },
    plugins: { "@typescript-eslint": tseslint },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "prefer-const": "error"
    }
  }
];

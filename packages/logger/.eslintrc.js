/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@nezuko/eslint-config/react-internal.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  ignorePatterns: ["**/__tests__/"],
};

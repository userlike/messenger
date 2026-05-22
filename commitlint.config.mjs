export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      2,
      "always",
      ["messenger", "messenger-internal", "repo", "ci", "deps", "release"],
    ],
    "scope-empty": [2, "never"],
  },
};

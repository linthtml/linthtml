module.exports = {
  extends: [
    "@commitlint/config-conventional",
    "@commitlint/config-angular"
  ],
  rules: {
    "subject-case": [
      0,
      "always",
      "sentence-case"
    ]
  }
};

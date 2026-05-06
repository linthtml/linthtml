async function getConfig() {
  const {
    default: {
      utils: { getProjects }
    }
  } = await import("@commitlint/config-nx-scopes");

  console.log();
  return {
    rules: {
      "subject-case": [0, "always", "sentence-case"],
      "scope-enum": async (ctx) => [
        2,
        "always",
        ["deps", "build-deps", "release", "ci", "doc", ...(await getProjects(ctx))]
      ]
    }
  };
}

module.exports = getConfig();

const { createDefaultEsmPreset } = require("ts-jest");

module.exports = {
  projects: [
    {
      displayName: "agents-runtime",

      rootDir: "<rootDir>/apps/services/agents-runtime",

      testEnvironment: "node",

      testMatch: ["<rootDir>/src/**/*.spec.ts"],

      moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
      },

      ...createDefaultEsmPreset({
        tsconfig: "<rootDir>/tsconfig.spec.json",
      }),
    },
  ],
};

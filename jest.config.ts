import type { Config } from "@jest/types";
export default function jestConfig(): Config.InitialOptions {
  return {
    testEnvironment: "jsdom",
    preset: "ts-jest",

    globals: {
      "ts-jest": {
        tsconfig: "tsconfig.test.json",
      },
    },

    // Automatically clear mock calls and instances between every test
    clearMocks: true,

    // A list of paths to modules that run some code to configure or set up the testing framework before each test
    setupFilesAfterEnv: ["@testing-library/jest-dom"],

    moduleNameMapper: {
      "@/(.*)": "<rootDir>/src/$1",
    },
  };
}

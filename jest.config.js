module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testMatch: ["**/*.test.ts", "**/*.test.tsx"],
  moduleDirectories: ["node_modules", "<rootDir>/theme-creator/node_modules"],
  moduleNameMapper: {
    "^@ktheme/engine$": "<rootDir>/src/index.ts",
  },
};

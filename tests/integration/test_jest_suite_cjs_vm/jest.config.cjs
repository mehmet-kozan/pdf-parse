module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.cjs'],
  moduleFileExtensions: ['js', 'cjs', 'mjs'],
  transform: {},
  transformIgnorePatterns: [],
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
};
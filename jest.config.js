module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    // collectCoverage: true,
    // collectCoverageFrom: ['src/**/*.js'],
    verbose: true,
    forceExit: true,
    setupFiles: ["dotenv/config"],
    testTimeout: 30000
};

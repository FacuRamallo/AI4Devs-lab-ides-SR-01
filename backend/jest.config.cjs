const dotenv = require('dotenv');
dotenv.config({ path: '.env.test' });

module.exports = {
  roots: ['<rootDir>/dist'],
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': ['ts-jest', { useESM: true }],
  },
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@infrastructure/(.*)\\.js$': '<rootDir>/infrastructure/$1',
    '^@domain/(.*)\\.js$': '<rootDir>/domain/$1',
    '^@application/(.*)\\.js$': '<rootDir>/application/$1'
  },
  testPathIgnorePatterns: ['\\.d\\.ts$'],
  setupFiles: ['<rootDir>/jest.setup.js'],
};
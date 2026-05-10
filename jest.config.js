/** @type {import('ts-jest').JestConfigWithTsJest} */
// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
// };


export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '\\.(png|jpg|jpeg|gif|webp|svg)$': '<rootDir>/src/__mocks__/fileMock.ts',
  },
}
// export const preset = 'ts-jest';
// export const testEnvironment = 'node';

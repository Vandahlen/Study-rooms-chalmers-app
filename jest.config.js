module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-native-async-storage)/)',
  ],
  setupFiles: ['./jest.setup.js'],
  // kar-ui-kit is a `file:` dep resolved via a symlink and ships its own
  // node_modules/react (from its devDependencies). Without this mapping,
  // requires from inside the symlinked package resolve to that second
  // React copy instead of this repo's, breaking hooks ("Invalid hook call").
  moduleNameMapper: {
    '^react$': require.resolve('react'),
    '^react-native$': require.resolve('react-native'),
  },
};

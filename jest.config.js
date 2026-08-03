module.exports = {
  preset: '@react-native/jest-preset',
  // Default 5000ms is tight for RN component renders (VirtualizedList,
  // ThemeProvider) under CI's shared/slower runners with parallel workers -
  // this test reliably takes ~1.4s alone but can blow past 5000ms under load.
  testTimeout: 15000,
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-native-async-storage)/)',
  ],
  setupFiles: ['./jest.setup.js'],
  // kar-ui-kit is a `file:` dep resolved via a symlink and ships its own
  // node_modules (react, react-native, react-native-svg, etc. from its
  // devDependencies). Without this mapping, requires from inside the
  // symlinked package - including deep react-native/Libraries/* imports
  // and react-native-svg - resolve to that second copy instead of this
  // repo's, breaking hooks ("Invalid hook call") and duplicating native
  // module singletons.
  moduleNameMapper: {
    '^react$': require.resolve('react'),
    '^react/(.*)$': '<rootDir>/node_modules/react/$1',
    '^react-native$': require.resolve('react-native'),
    '^react-native/(.*)$': '<rootDir>/node_modules/react-native/$1',
    '^react-native-svg$': require.resolve('react-native-svg'),
  },
};

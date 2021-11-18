const baseConfig = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testPathIgnorePatterns: ['node_modules', 'dist'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
};

module.exports = {
  projects: [
    {
      displayName: 'services',
      testMatch: [
        '<rootDir>/packages/service-*/?(*.)+(test).[jt]s?(x)',
        '<rootDir>/packages/service-*/**/?(*.)+(test).[jt]s?(x)',
      ],
      ...baseConfig,
    },
    {
      displayName: 'common-utils',
      testMatch: ['<rootDir>/packages/common-utils/**/?(*.)+(test).[jt]s?(x)'],
      ...baseConfig,
    },
    {
      displayName: 'common-config',
      testMatch: ['<rootDir>/packages/common-config/**/?(*.)+(test).[jt]s?(x)'],
      ...baseConfig,
    },
    {
      displayName: 'common-server',
      testMatch: ['<rootDir>/packages/common-server/**/?(*.)+(test).[jt]s?(x)'],
      ...baseConfig,
    },
    {
      displayName: 'common-client',
      testMatch: ['<rootDir>/packages/common-client/**/?(*.)+(test).[jt]s?(x)'],
      preset: 'react-native-web',
      ...baseConfig,
    },
  ],
};

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'graphql',
    'react-hooks',
    'unused-imports',
    'sonarjs',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    // TODO: Enable sonar recommended rules
    // 'plugin:sonarjs/recommended',
  ],
  rules: {
    // Custom rules
    'object-shorthand': ['error', 'always'], // Keeps code more concise concise
    'max-lines-per-function': ['warn', { max: 200 }], // Keep functions small,

    // Imports,
    // 'import/no-cycle': ['error', { maxDepth: 1 }],
    'import/no-unresolved': 'off', // Fix for monorepo. Let Typescript handle this
    'unused-imports/no-unused-imports-ts': ['warn'],
    'import/order': ['warn', { 'newlines-between': 'always' }],

    // React
    'react/prop-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',

    // TODO: lift these rules below and adapt to recommended rules
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
  },
  overrides: [
    // Test and stories files
    {
      files: ['*.test.ts', '*.test.tsx', '*.stories.ts', '*.stories.tsx'],
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },

    // Scripts and hacks
    {
      files: ['scripts/**/*', 'e2e/**/*'],
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/explicit-member-accessibility': 'off',
        '@typescript-eslint/no-parameter-properties': 'off',
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
};

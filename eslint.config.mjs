export default [
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/public/**',
      '**/.next/**',
      '**/coverage/**',
      '**/*.d.ts',
      'packages/*/src/**/*.js', // Ignore build artifacts in src
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', 'scripts/**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  },
];
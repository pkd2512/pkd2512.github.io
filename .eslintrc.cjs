module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:svelte/recommended', 'prettier'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  rules: {
    indent: ['error', 2],
    semi: ['error', 'always'],
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'never',
        functions: 'never',
      },
    ],
    'operator-linebreak': ['error', 'after'],
    'space-before-function-paren': ['error', 'never'],
    eqeqeq: 'warn',
    'no-unused-vars': ['warn', { args: 'after-used' }],
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      rules: {
        'no-multiple-empty-lines': ['error', { max: 2, maxBOF: 2 }],
        'import/first': 'off',
        'import/no-duplicates': 'off',
        'import/no-mutable-exports': 'off',
        'import/no-unresolved': 'off',
        indent: ['error', 2],
      },
    },
  ],
};

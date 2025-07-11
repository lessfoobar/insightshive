import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
        // InsightsHive specific globals
        InsightsHive: 'writable'
      }
    },
    rules: {
      // Error prevention
      'no-console': 'warn',
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'no-unreachable': 'error',
      'no-duplicate-case': 'error',
      'no-empty': 'error',
      'no-extra-boolean-cast': 'error',
      'no-extra-semi': 'error',
      'no-func-assign': 'error',
      'no-inner-declarations': 'error',
      'no-invalid-regexp': 'error',
      'no-irregular-whitespace': 'error',
      'no-obj-calls': 'error',
      'no-sparse-arrays': 'error',
      'no-unexpected-multiline': 'error',
      'use-isnan': 'error',
      'valid-typeof': 'error',

      // Best practices
      'curly': 'error',
      'dot-notation': 'error',
      'eqeqeq': 'error',
      'no-alert': 'warn',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-multi-spaces': 'error',
      'no-new-wrappers': 'error',
      'no-redeclare': 'error',
      'no-return-assign': 'error',
      'no-script-url': 'error',
      'no-self-assign': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-throw-literal': 'error',
      'no-unused-expressions': 'error',
      'no-useless-call': 'error',
      'no-useless-concat': 'error',
      'no-useless-escape': 'error',
      'no-with': 'error',
      'radix': 'error',
      'wrap-iife': 'error',
      'yoda': 'error',

      // ES6+ features
      'prefer-const': 'error',
      'no-var': 'error',
      'prefer-arrow-callback': 'warn',
      'prefer-template': 'warn',
      'template-curly-spacing': 'error',
      'object-shorthand': 'warn',
      'prefer-destructuring': ['warn', {
        array: false,
        object: true
      }],

      // Code style
      'indent': ['error', 2, { 
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1
      }],
      'linebreak-style': ['error', 'unix'],
      'quotes': ['error', 'single', { 
        avoidEscape: true,
        allowTemplateLiterals: true 
      }],
      'semi': ['error', 'always'],
      'semi-spacing': 'error',
      'comma-dangle': ['error', 'never'],
      'comma-spacing': 'error',
      'comma-style': 'error',
      'key-spacing': 'error',
      'keyword-spacing': 'error',
      'space-before-blocks': 'error',
      'space-before-function-paren': ['error', {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always'
      }],
      'space-in-parens': 'error',
      'space-infix-ops': 'error',
      'space-unary-ops': 'error',
      'spaced-comment': 'error',
      'brace-style': 'error',
      'camelcase': 'warn',
      'new-cap': 'error',
      'new-parens': 'error',
      'no-array-constructor': 'error',
      'no-mixed-spaces-and-tabs': 'error',
      'no-multiple-empty-lines': ['error', { 
        max: 2,
        maxBOF: 0,
        maxEOF: 1 
      }],
      'no-new-object': 'error',
      'no-trailing-spaces': 'error',
      'no-unneeded-ternary': 'error',
      'object-curly-spacing': ['error', 'always'],
      'one-var': ['error', 'never'],
      'padded-blocks': ['error', 'never'],

      // Function rules
      'func-call-spacing': 'error',
      'func-name-matching': 'error',
      'func-style': ['error', 'declaration', {
        allowArrowFunctions: true
      }],
      'no-loop-func': 'error',

      // Array rules
      'array-bracket-spacing': 'error',
      'array-callback-return': 'error',

      // Comments
      'multiline-comment-style': ['error', 'starred-block'],
      'no-inline-comments': 'warn'
    }
  },
  {
    files: ['*.config.js', 'webpack.config.js', 'rollup.config.js'],
    languageOptions: {
      globals: {
        ...globals.node
      }
    },
    rules: {
      'no-console': 'off'
    }
  },
  {
    files: ['**/*.test.js', '**/*.spec.js'],
    languageOptions: {
      globals: {
        ...globals.jest
      }
    },
    rules: {
      'no-console': 'off'
    }
  },
  {
    files: ['js/legacy/*.js'],
    languageOptions: {
      sourceType: 'script',
      globals: {
        ...globals.browser
      }
    },
    rules: {
      'prefer-arrow-callback': 'off',
      'prefer-const': 'off',
      'no-var': 'off'
    }
  }
];
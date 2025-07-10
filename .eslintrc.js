module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    // Error prevention
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-unused-vars': 'error',
    'no-undef': 'error',
    
    // Code quality
    'prefer-const': 'error',
    'no-var': 'error',
    'no-duplicate-imports': 'error',
    'no-unreachable': 'error',
    
    // Style consistency
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-trailing': ['error', 'never'],
    
    // Best practices
    'eqeqeq': ['error', 'always'],
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    
    // Modern JavaScript
    'prefer-arrow-callback': 'error',
    'prefer-template': 'error',
    'template-curly-spacing': ['error', 'never'],
    
    // Accessibility
    'no-alert': 'warn'
  },
  globals: {
    // Allow specific global variables
    'InsightsHive': 'writable'
  },
  overrides: [
    {
      files: ['*.config.js', '*.config.mjs'],
      env: {
        node: true
      }
    }
  ]
};
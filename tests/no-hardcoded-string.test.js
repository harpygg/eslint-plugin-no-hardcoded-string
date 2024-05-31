const { ESLintUtils } = require('@typescript-eslint/experimental-utils');
const rule = require('../lib/rules/no-hardcoded-string');

const RuleTester = ESLintUtils.RuleTester;

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
});

ruleTester.run('no-hardcoded-string', rule, {
  valid: [
    "const messageC = this.i18n.translate('This is a localized message');",
    "const messageD = this.i18n.translate(`This is a ${messageA} message`);",
    "const messageE = true",
    "const messageF = 5",
    "const messageG = someFunction('Hardcoded string');",
    "import { SomeComponent } from '~path/to/components/component';"
  ],
  invalid: [
    {
      code: "const messageA = 'Hardcoded string';",
      errors: [{ messageId: 'needI18n' }],
    },
    {
      code: "const messageB = `Hardcoded ${messageA} string`;",
      errors: [{ messageId: 'needI18n' }],
    },
    {
      code: "throw new Error('Hardcoded string');",
      errors: [{ messageId: 'needI18n' }],
    },
    
  ],
});
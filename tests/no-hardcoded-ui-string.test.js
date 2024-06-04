const { RuleTester } = require('eslint');
const rule = require('../lib/rules/no-hardcoded-ui-string');

const ruleTester = new RuleTester({
  parser: require.resolve('@angular-eslint/template-parser'),
});

ruleTester.run('no-hardcoded-ui-string', rule, {
  valid: [
    `<div>{{ 'translated_string' | transloco }}</div>`,
    `<div>{{ 'This is already translated' | transloco }}</div>`,
    `<div>{{ someVar$ | async }}</div>`,
    `<div>{{ 5 | somePipe }}</div>`,
  ],
  invalid: [
    {
      code: '<div>Hardcoded string</div>',
      errors: [{ messageId: 'transloco' }],
    },
    {
      code: '<div>{{ "some.dynamic." + someVar + ".key" | transloco }}</div>',
      errors: [{ messageId: 'transloco' }],
    },
    {
      code: '<div>{{ "Hardcoded string" }}</div>',
      errors: [{ messageId: 'transloco' }],
    },
  ],
});

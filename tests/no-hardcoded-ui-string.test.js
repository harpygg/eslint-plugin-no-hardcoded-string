const { RuleTester } = require('eslint');
const rule = require('../lib/rules/no-hardcoded-ui-string');

const ruleTester = new RuleTester({
  parser: require.resolve('@angular-eslint/template-parser'),
});

ruleTester.run('no-hardcoded-ui-string', rule, {
  valid: [
    `<div>{{ 'translated_string' | translate }}</div>`,
    `<div>{{ 'This is already translated' | translate }}</div>`,
    `<div>{{ someVar$ | async }}</div>`,
    `<div [attr]="'translated_string' | translate"></div>`,
    `<div type="some_type"></div>`,
    `<div class="someClass other-class"></div>`,
    `<div style="color: 'red'; font-size: 12px;"></div>`,
    `<div>{{ 5 | somePipe }}</div>`
  ],
  invalid: [
    {
      code: '<div>Hardcoded string</div>',
      errors: [{ messageId: 'translate' }],
    },
    {
      code: '<div>{{ "some.dynamic." + someVar + ".key" | translate }}</div>',
      errors: [{ messageId: 'translate' }],
    },
    {
      code: '<div>{{ "Hardcoded string" }}</div>',
      errors: [{ messageId: 'translate' }],
    },
    {
      code: '<div type="My type"></div>',
      errors: [{ messageId: 'translate' }],
    },
    {
      code: '<div name="Bobby"></div>',
      errors: [{ messageId: 'translate' }],
    },
  ]
});

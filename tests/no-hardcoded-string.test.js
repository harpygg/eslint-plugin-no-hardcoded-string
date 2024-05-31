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
    "const someVar = this.i18n.translate('This is a localized message');",
    "const someVar = this.i18n.translate(`This is a ${messageA} message`);",
    "const someVar = true",
    "const someVar = 5",
    "const someVar = someFunction('some-keyword-value');",
    "import { SomeComponent } from '~path/to/components/component';",
    `
      @Component({
        changeDetection: ChangeDetectionStrategy.OnPush,
        standalone: true,
        selector: "h-some-component",
        template: "Content of my component",
        styles: ":host { background-color: red }"
      })
      export class SomeComponent {}
    `,
    "type SomeType = 'optA' | 'optB';",
    "const isString = typeof cool === 'string';",
    "const someObj = { type: 'string', value: this.i18n.translate('some.key') };",
  ],
  invalid: [
    {
      code: "const someVar = 'Hardcoded string';",
      errors: [{ messageId: 'needI18n' }],
    },
    {
      code: "const someVar = `Hardcoded ${someOtherVar} string`;",
      errors: [{ messageId: 'needI18n' }],
    },
    {
      code: "const someVar = someFunction('Hardcoded string');",
      errors: [{ messageId: 'needI18n' }],
    },
    {
      code: "throw new Error('Hardcoded string');",
      errors: [{ messageId: 'needI18n' }],
    },
    {
      code: `
        const someObj = {
          text: "Hardcoded string",
        }
      `,
      errors: [{ messageId: 'needI18n' }],
    },
  ],
});
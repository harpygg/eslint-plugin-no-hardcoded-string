
const { ESLintUtils } = require('@typescript-eslint/experimental-utils');

const rule = ESLintUtils.RuleCreator(name => `https://example.com/rule/${name}`)({
  name: 'no-hardcoded-string',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'UI strings should not be hardcoded and should be wrapped in i18n functions',
      category: 'Best Practices',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      needI18n: 'i18n: UI strings should be wrapped with translation functions',
    },
  },
  defaultOptions: [],
  create(context) {
    const sourceCode = context.getSourceCode();

    function reportIfHardcoded(node) {
      context.report({
        node,
        messageId: 'needI18n',
      });
    }

    function isInsideTranslationFunction(node) {
      const ancestors = sourceCode.getAncestors(node);
      return ancestors.some(ancestor => 
        ancestor.type === 'CallExpression' && 
        (ancestor.callee.name === 'translate' || 
         ancestor.callee.property && ancestor.callee.property.name === 'translate')
      );
    }

    return {
      'Literal'(node) {
        if (!isInsideTranslationFunction(node) && typeof node.value === 'string') {
          reportIfHardcoded(node);
        }
      },
      'TemplateLiteral'(node) {
        if (!isInsideTranslationFunction(node)) {
          reportIfHardcoded(node);
        }
      },
    };
  },
});

module.exports = rule;
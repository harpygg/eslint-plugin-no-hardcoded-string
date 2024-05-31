
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

    // function isInsideTranslationFunction(node) {
    //   const ancestors = sourceCode.getAncestors(node);
    //   return ancestors.some(ancestor => 
    //     ancestor.type === 'CallExpression' && 
    //     (ancestor.callee.name === 'translate' || 
    //      ancestor.callee.property && ancestor.callee.property.name === 'translate')
    //   );
    // }

    function isInDecorator(node) {
      let current = node;
      while (current) {
        if (current.type === 'Decorator') {
          return true;
        }
        current = current.parent;
      }
      return false;
    }

    function isFunctionParameter(node) {
      return node.parent.type === 'CallExpression';
    }

    function isImport(node) {
      return node.parent.type === 'ImportDeclaration';
    }

    return {
      'Literal'(node) {
        if (typeof node.value === 'string' && !isImport(node) && !isInDecorator(node) && !isFunctionParameter(node)) {
          reportIfHardcoded(node);
        }
      },
      'TemplateLiteral'(node) {
        if (!isFunctionParameter(node) && !isInDecorator(node)) {
          reportIfHardcoded(node);
        }
      },
    };
  },
});

module.exports = rule;
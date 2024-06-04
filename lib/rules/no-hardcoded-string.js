
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

    function isTsLiteral(node) {
      return node.parent.type === 'TSLiteralType';
    }

    function isFunctionParameter(node) {
      return node.parent.type === 'CallExpression';
    }

    function isTranslateFunctionParameter(node) {
      return node.parent.type === 'CallExpression'
        && (
          node.parent.callee.name === 'translate' || (
            node.parent.callee.property
            && node.parent.callee.property.name === 'translate'
          )
        );
    }

    function isImport(node) {
      return node.parent.type === 'ImportDeclaration';
    }

    function isThrowingError(node) {
      return node.parent.parent?.type === 'ThrowStatement';
    }

    function isConsoleLogging(node) {
      return node.parent.type === 'CallExpression'
        && node.parent.callee.object?.name === 'console';
    }

    function looksLikeSomeKindOfKeyword(node) {
      const hasSpaceInIt = /\s/.test(node.value);
      const startsWithUppercaseChar = /^[A-Z]/.test(node.value);
      const hasOnlyOneUppercaseChar = node.value.replace(/[^A-Z]/g, '').length === 1;
      const onlyStartsWithUppercaseChar = startsWithUppercaseChar && hasOnlyOneUppercaseChar;

      return !onlyStartsWithUppercaseChar && !hasSpaceInIt;
    }

    return {
      'Literal'(node) {
        // !isFunctionParameter(node) => Not used anymore since the uppercase + no-space does the trick
        if (typeof node.value === 'string'
          && !isImport(node)
          && !isTsLiteral(node)
          && !isInDecorator(node)
          && !isThrowingError(node)
          && !isConsoleLogging(node)
          && !isTranslateFunctionParameter(node)
          && !looksLikeSomeKindOfKeyword(node)
        ) {
          reportIfHardcoded(node);
        }
      },
      'TemplateLiteral'(node) {
        if (!isFunctionParameter(node) 
            && !isInDecorator(node)
            && !isThrowingError(node)
            && !isConsoleLogging(node)
        ) {
          reportIfHardcoded(node);
        }

        if (isTranslateFunctionParameter(node)) {
          reportIfHardcoded(node);
        }
      },
    };
  },
});

module.exports = rule;
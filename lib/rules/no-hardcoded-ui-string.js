/**
 * @fileoverview UI strings should not be hardcoded and should be wrapped with the transloco pipe
 * @name no-hardcoded-ui-string
 * @author Michel Parpaillon
 */
'use strict';

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'UI strings should not be hardcoded and should be wrapped with the transloco pipe',
      category: 'Best Practices',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      transloco: 'String should be wrapped with the transloco pipe',
    },
  },

  defaultOptions: [],

  create(context) {
    const stringContainsText = input => {
      return input.replace(/\s/g, '').length > 0;
    }

    const report = (node) => {
      context.report({
        node,
        messageId: 'transloco'
      });
    }

    return {
      Text$3(node) {
        const isHardcodedText = node.value.replace(/\s/g, '').length > 0;

        if (isHardcodedText) {
          // <div>Some string</div>
          report(node);
        }
      },
      BoundText(node) {
        const e = node.value.ast.expressions[0];

        if (e.type === "LiteralPrimitive") {
          // <div>{{ 'Some string' }}</div>
          report(node);
          return;
        }

        if (e.type === "BindingPipe") {
          // Because this {{ someVar$ | async }} and {{ 5 | transloco }} should be ignored
          const isLeftPartString = e.exp.type === "LiteralPrimitive" && typeof e.exp.value === "string";
          const hasTranslocoPipe = e.name === "transloco";

          if (isLeftPartString && !hasTranslocoPipe) {
            // <div>{{ 'Some string' | async }}</div>
            report(node);
          }
        }
      },
    };
  },
};

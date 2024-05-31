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
      transloco: '"{{ nodeValue }}" should be wrapped with the transloco pipe',
    },
  },

  defaultOptions: [],

  create(context) {
    const stringContainsText = input => {
      return input.replace(/\s/g, '').length > 0;
    }

    const report = (node, nodeValue) => {
      context.report({
        node,
        messageId: 'transloco',
        data: {
          nodeValue: nodeValue.replace(/[\n]*/g, '').replace(/[ ]+/g, ' ').trim()
        },
      });
    }

    return {
      Text$3(node) {
        if (node.value !== undefined && stringContainsText(node.value) && !node.value.includes('transloco')) {
          report(node, node.value);
        }
      },
      BoundText(node) {
        if (node.value?.source !== undefined && stringContainsText(node.value.source) && !node.value.source.includes('transloco')) {
          report(node, node.value.source);
        }
      },
    };
  },
};

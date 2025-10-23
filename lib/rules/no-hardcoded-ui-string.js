/**
 * @fileoverview UI strings should not be hardcoded and should be wrapped with the translate pipe
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
      description: 'UI strings should not be hardcoded and should be wrapped with the translate pipe',
      category: 'Best Practices',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      translate: 'String should be wrapped with the translate pipe',
    },
  },

  defaultOptions: [],

  create(context) {
    const stringContainsText = input => {
      // Only report if the string contains at least one letter
      return /[a-zA-Z]/.test(input);
    }

    function looksLikeSomeKindOfKeyword(node) {
      const hasSpaceInIt = /\s/.test(node.value);
      const startsWithUppercaseChar = /^[A-Z]/.test(node.value);
      const hasOnlyOneUppercaseChar = node.value.replace(/[^A-Z]/g, '').length === 1;
      const onlyStartsWithUppercaseChar = startsWithUppercaseChar && hasOnlyOneUppercaseChar;

      return !onlyStartsWithUppercaseChar && !hasSpaceInIt;
    }

    const report = (node) => {
      context.report({
        node,
        messageId: 'translate'
      });
    }

    return {
      Text$3(node) {
        if (stringContainsText(node.value)) {
          // <div>Some string</div>
          report(node);
        }
      },
      TextAttribute(node) {
        // <div type="some_type"></div> should be forbidden

        if (stringContainsText(node.value)
          && !looksLikeSomeKindOfKeyword(node)
          && node.name !== "class"
          && node.name !== "style"
        ) {
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
          // Because this {{ someVar$ | async }} and {{ 5 | translate }} should be ignored
          const isLeftPartString = e.exp.type === "LiteralPrimitive" && typeof e.exp.value === "string";
          const isConcatenating = e.exp.operation === '+';
          const hasTranslatePipe = e.name === "translate";

          if (hasTranslatePipe) {
            if (isConcatenating) {
              // <div>{{ "some.dynamic." + someVar + ".key" | translate }}</div>
              report(node);
            }
          } else {
            if (isLeftPartString) {
              // <div>{{ 'Some string' | async }}</div>
              report(node);
            }
          }
        }
      },
    };
  },
};

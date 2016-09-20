/**
 * @fileoverview Defines space in parens with quotes inside
 * @author Ivan
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "Defines space in parens with quotes inside",
            category: "Stylistic Issues",
            recommended: false
        },
        fixable: "whitespace",  // or "code" or "whitespace"
        schema: [
            {
                "enum": ["always", "never"]
            }
        ]
    },

    create: function(context) {

        // variables should be defined here
        const sourceCode = context.getSourceCode();
        const UNNECESSARY_SPACE_MESSAGE = "There must be no space inside this paren with string.";
        const ALWAYS = context.options[0] === "always";

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        // any helper functions should go here or else delete this section

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {

            ExpressionStatement: function (node) {
                const tokens = sourceCode.tokensAndComments;

                if (ALWAYS) {

                    tokens.forEach(function(token, i) {
                        const prevToken  = tokens[i - 1];
                        const nextToken  = tokens[i + 1];
                        const leftSpace  = [];
                        const rightSpace = [];

                        // ('only string in parent')
                        if (token.type === "String" && prevToken.type == "Punctuator" && nextToken.type == "Punctuator") {

                            if (prevToken.value == "(" && nextToken.value == ")") {
                                if (sourceCode.isSpaceBetweenTokens(prevToken, token)) {
                                    leftSpace[0] = prevToken.end;
                                    leftSpace[1] = token.start;

                                    context.report({
                                        node,
                                        loc: leftSpace[0],
                                        message: UNNECESSARY_SPACE_MESSAGE,
                                        fix(fixer) {
                                            return fixer.removeRange(leftSpace);
                                        }
                                    });
                                }

                                if (sourceCode.isSpaceBetweenTokens(token, nextToken)) {
                                    rightSpace[0] = token.end;
                                    rightSpace[1] = nextToken.start;

                                    context.report({
                                        node,
                                        loc: rightSpace[1],
                                        message: UNNECESSARY_SPACE_MESSAGE,
                                        fix(fixer) {
                                            return fixer.removeRange(rightSpace);
                                        }
                                    });
                                }

                            }
                        }
                    });
                }

            }

        };
    }
};

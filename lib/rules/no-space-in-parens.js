/**
 * @fileoverview Defines space in parens with quotes inside
 * @author Ivan
 */
"use strict";

const astUtils = require("../ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "enforce consistent spacing inside parentheses",
            category: "Stylistic Issues",
            recommended: false
        },

        fixable: "whitespace",

        schema: [
            {
                enum: ["always", "never"]
            },
            {
                type: "object",
                properties: {
                    exceptions: {
                        type: "array",
                        items: {
                            enum: ["{}", "[]", "()", "empty", "(STRING)"]
                        },
                        uniqueItems: true
                    }
                },
                additionalProperties: false
            }
        ]
    },

    create(context) {

        const MISSING_SPACE_MESSAGE   = "There must be a space inside this paren.",
            REJECTED_SPACE_MESSAGE    = "There should be no spaces inside this paren.",
            UNNECESSARY_SPACE_MESSAGE = "There must be no space inside this paren with STRING expression.",
            ALWAYS                    = context.options[0] === "always",

            exceptionsArrayOptions    = (context.options.length === 2) ? context.options[1].exceptions : [],
            options                   = {};

        let exceptions;

        if (exceptionsArrayOptions.length) {
            options.braceException       = exceptionsArrayOptions.indexOf("{}") !== -1;
            options.bracketException     = exceptionsArrayOptions.indexOf("[]") !== -1;
            options.parenException       = exceptionsArrayOptions.indexOf("()") !== -1;
            options.parenStringException = exceptionsArrayOptions.indexOf("(STRING)") !== -1;
            options.empty                = exceptionsArrayOptions.indexOf("empty") !== -1;
        }

        /**
         * Produces an object with the opener and closer exception values
         * @param {Object} opts The exception options
         * @returns {Object} `openers` and `closers` exception values
         * @private
         */
        function getExceptions() {
            const openers = [],
                closers = [];

            if (options.braceException) {
                openers.push("{");
                closers.push("}");
            }

            if (options.bracketException) {
                openers.push("[");
                closers.push("]");
            }

            if (options.parenException) {
                openers.push("(");
                closers.push(")");
            }

            if (options.empty) {
                openers.push(")");
                closers.push("(");
            }

            return {
                openers,
                closers
            };
        }

        //--------------------------------------------------------------------------
        // Helpers
        //--------------------------------------------------------------------------
        const sourceCode = context.getSourceCode();

        /**
         * Determines if a token is one of the exceptions for the opener paren
         * @param {Object} token The token to check
         * @returns {boolean} True if the token is one of the exceptions for the opener paren
         */
        function isOpenerException(token) {
            return token.type === "Punctuator" && exceptions.openers.indexOf(token.value) >= 0;
        }

        /**
         * Determines if a token is one of the exceptions for the closer paren
         * @param {Object} token The token to check
         * @returns {boolean} True if the token is one of the exceptions for the closer paren
         */
        function isCloserException(token) {
            return token.type === "Punctuator" && exceptions.closers.indexOf(token.value) >= 0;
        }

        /**
         * Determines if an opener paren should have a missing space after it
         * @param {Object} left The paren token
         * @param {Object} right The token after it
         * @returns {boolean} True if the paren should have a space
         */
        function shouldOpenerHaveSpace(left, right) {
            if (sourceCode.isSpaceBetweenTokens(left, right)) {
                return false;
            }

            if (ALWAYS) {
                if (right.type === "Punctuator" && right.value === ")") {
                    return false;
                }
                return !isOpenerException(right);
            } else {
                return isOpenerException(right);
            }
        }

        /**
         * Determines if an closer paren should have a missing space after it
         * @param {Object} left The token before the paren
         * @param {Object} right The paren token
         * @returns {boolean} True if the paren should have a space
         */
        function shouldCloserHaveSpace(left, right) {
            if (left.type === "Punctuator" && left.value === "(") {
                return false;
            }

            if (sourceCode.isSpaceBetweenTokens(left, right)) {
                return false;
            }

            if (ALWAYS) {
                return !isCloserException(left);
            } else {
                return isCloserException(left);
            }
        }

        /**
         * Determines if an opener paren should not have an existing space after it
         * @param {Object} left The paren token
         * @param {Object} right The token after it
         * @returns {boolean} True if the paren should reject the space
         */
        function shouldOpenerRejectSpace(left, right) {
            if (right.type === "Line") {
                return false;
            }

            if (!astUtils.isTokenOnSameLine(left, right)) {
                return false;
            }

            if (!sourceCode.isSpaceBetweenTokens(left, right)) {
                return false;
            }

            if (ALWAYS) {
                return isOpenerException(right);
            } else {
                return !isOpenerException(right);
            }
        }

        /**
         * Determines if an closer paren should not have an existing space after it
         * @param {Object} left The token before the paren
         * @param {Object} right The paren token
         * @returns {boolean} True if the paren should reject the space
         */
        function shouldCloserRejectSpace(left, right) {
            if (left.type === "Punctuator" && left.value === "(") {
                return false;
            }

            if (!astUtils.isTokenOnSameLine(left, right)) {
                return false;
            }

            if (!sourceCode.isSpaceBetweenTokens(left, right)) {
                return false;
            }

            if (ALWAYS) {
                return isCloserException(left);
            } else {
                return !isCloserException(left);
            }
        }

        function checkStringOrTemplateLiteralInParen(node, prevToken, currentToken, nextToken) {
            if (sourceCode.isSpaceBetweenTokens(prevToken, currentToken.startToken)) {
                context.report({
                    node,
                    loc: currentToken.startToken.loc.start,
                    message: UNNECESSARY_SPACE_MESSAGE,
                    fix(fixer) {
                        return fixer.removeRange([prevToken.end, currentToken.startToken.start]);
                    }
                });

            }

            if (sourceCode.isSpaceBetweenTokens(currentToken.endToken, nextToken)) {
                context.report({
                    node,
                    loc: nextToken.loc.start,
                    message: UNNECESSARY_SPACE_MESSAGE,
                    fix(fixer) {
                        return fixer.removeRange([currentToken.endToken.end, nextToken.start]);
                    }
                });

            }
        }

        function stringOrTemplateInParenAlreadyChecked(tokens, i, templateLiteralsСoordinates) {

            if ( !tokens[ i ] ) {
                return false;
            }

            let token = tokens[i];
            let nextToken = tokens[i + 1];
            let prevToken = tokens[i - 1];
            let nextNextToken = tokens[i + 2];
            let prevPrevToken = tokens[i - 2];

            if (nextToken && nextToken.type === "Template") {
                const nextTokenIndex = i + 1;
                const coordinatePair = getCoordinatePair(templateLiteralsСoordinates, nextTokenIndex);

                if (!isSingleTemplateLiteral(coordinatePair)) {
                    const endCoordinate = coordinatePair[1];

                    nextNextToken = tokens[endCoordinate.index + 1];
                }
            }

            if (prevToken && prevToken.type === "Template") {
                const prevTokenIndex = i - 1;
                const coordinatePair = getCoordinatePair(templateLiteralsСoordinates, prevTokenIndex);
          
                if (!isSingleTemplateLiteral(coordinatePair)) {
                    const startCoordinate = coordinatePair[0];

                    prevPrevToken = tokens[startCoordinate.index - 1];
                }
            }

            if (token && token.type == "Template") {
                const coordinatePair = getCoordinatePair(templateLiteralsСoordinates, i);
            
                if (!isSingleTemplateLiteral(coordinatePair)) {
                    const startCoordinate = coordinatePair[0];
                    const endCoordinate = coordinatePair[1];

                    prevToken = tokens[startCoordinate.index - 1];
                    nextToken = tokens[endCoordinate.index + 1];
                }
            }

            if (
                token.type === "Punctuator" && 
                token.value === "(" && 
                nextToken &&
                (nextToken.type === "Template" || nextToken.type === "String") &&
                nextNextToken && 
                nextNextToken.value === ")"
            ) {
                return true;
            }

            if (
                (token.type === "Template" || token.type === "String") &&
                prevToken && 
                prevToken.value  === "(" &&
                nextToken && 
                nextToken.value === ")"
            ) {
                return true;
            }

            if (
                token.type === "Punctuator" && 
                token.value === ")" &&
                prevToken && 
                (prevToken.type === "Template" || prevToken.type === "String") &&
                prevPrevToken && 
                prevPrevToken.type  === "Punctuator" && 
                prevPrevToken.value === "(" 
            ) {
                return true;
            }

            return false;
        }

         /**
          * Filters all tokens by template literals and creates new array of objects which contain
          * indexes and tokens from eslint tokens.
          * 
          * @param {Array} tokens All tokens from eslint parser.
          * @returns {Array} Array of objects with indexes and tokens from eslint tokens.
         */
        function getTemplateLiterals(tokens) {
            return tokens.reduce((acc, token, index) => {
                const isTemplateLiteral = token.type === "Template";
  
                if (isTemplateLiteral) {
                    acc.push({ index, token });
                }
  
                return acc;
            }, []);
        }

        /**
          * Defines and creates array of chunks with indexes and tokens of beginning and end
          * for template literals.
          * 
          * @param {Array} templateLiterals Array of objects with indexes and tokens from eslint tokens.
          * @returns {Array} Array of chunks with indexes and tokens of beginning and end.
         */
        function getTemplateLiteralsСoordinates(templateLiterals) {
            const templateLiteralsWithoutClose = [];

            return templateLiterals.reduce((acc, templateLiteral) => {
                const firstSymbol = templateLiteral.token.value.substr(0, 1);
                const lastSymbol = templateLiteral.token.value.substr(-1, 1);
                const isSingleTemplateLiteral = firstSymbol === "`" && lastSymbol === "`";

                if (isSingleTemplateLiteral) {
                    acc.push([templateLiteral]);
                }

                if (lastSymbol === "{") {
                    acc.push([templateLiteral]);
                    templateLiteralsWithoutClose.push(acc.length - 1);
                }

                if (firstSymbol === "}" && lastSymbol === "`") {
                    acc[templateLiteralsWithoutClose.pop()].push(templateLiteral);
                }

                return acc;
            }, []);
        }

        /**
         * Filters all chunks with template literals coordinates and return necessary coordinate pair by index.
         * 
         * @param {Array} templateLiteralsСoordinates Array of chunks with indexes and tokens of beginning and end template literals.
         * @param {Number} index Current index of token in loop.
         * @returns {Array} Chunk with indexes and tokens of beginning and end template literal.
        */
        function getCoordinatePair(templateLiteralsСoordinates, index) {
            return templateLiteralsСoordinates.filter(coordinates => {
                return coordinates[0].index === index || coordinates[1] && coordinates[1].index === index;
            })[0];
        }

        /**
         * @param {Array} coordinatePair Chunk with indexes and tokens of beginning and end template literal.
         * @returns {Boolean}
        */
        function isSingleTemplateLiteral(coordinatePair = []) {
            return coordinatePair.length === 1;
        }

        //--------------------------------------------------------------------------
        // Public
        //--------------------------------------------------------------------------

        return {
            Program: function checkParenSpaces(node) {
                exceptions = getExceptions();

                const tokens = sourceCode.tokensAndComments;
                const templateLiterals = getTemplateLiterals(tokens);
                const templateLiteralsСoordinates = getTemplateLiteralsСoordinates(templateLiterals);

                tokens.forEach( function( token, i ) {

                    /** 
                     * The object needed to determine the beginning and end of the current token.
                     * If the token is single, startToken and endToken are same.
                     * If the token is not single, like template literal: `starttext ${var} endtext`,
                     * startToken is the beginning of it `starttext ${` and endToken is the end `} endtext`
                    */
                    let currentToken = {
                        startToken: token,
                        endToken: token,
                    };

                    let prevToken = tokens[i - 1];
                    let nextToken = tokens[i + 1];

                    if (token.type === "Template") {
                        const coordinatePair = getCoordinatePair(templateLiteralsСoordinates, i);

                        if (!isSingleTemplateLiteral(coordinatePair)) {
                            const startCoordinate = coordinatePair[0];
                            const endCoordinate = coordinatePair[1];

                            currentToken = {
                                startToken: startCoordinate.token,
                                endToken: endCoordinate.token,
                            };

                            prevToken = tokens[startCoordinate.index - 1];
                            nextToken = tokens[endCoordinate.index + 1];
                        }
                    }

                    if (
                        options.parenStringException &&
                        (token.type === "String" || token.type === "Template") &&
                        prevToken &&
                        prevToken.type === "Punctuator" &&
                        nextToken &&
                        nextToken.type === "Punctuator" &&
                        prevToken.value === "(" &&
                        nextToken.value === ")"
                    ) {
                        checkStringOrTemplateLiteralInParen(node, prevToken, currentToken, nextToken);
                        return;
                    }

                    if (options.parenStringException && stringOrTemplateInParenAlreadyChecked(tokens, i, templateLiteralsСoordinates)) {
                        return;
                    }

                    if (token.type !== "Punctuator") {
                        return;
                    }

                    if (token.value !== "(" && token.value !== ")") {
                        return;
                    }

                    if (token.value === "(" && shouldOpenerHaveSpace(token, nextToken)) {
                        context.report({
                            node,
                            loc: token.loc.start,
                            message: MISSING_SPACE_MESSAGE,
                            fix(fixer) {
                                return fixer.insertTextAfter(token, " ");
                            }
                        });
                    } else if (token.value === "(" && shouldOpenerRejectSpace(token, nextToken)) {
                        context.report({
                            node,
                            loc: token.loc.start,
                            message: REJECTED_SPACE_MESSAGE,
                            fix(fixer) {
                                return fixer.removeRange([token.range[1], nextToken.range[0]]);
                            }
                        });
                    } else if (token.value === ")" && shouldCloserHaveSpace(prevToken, token)) {

                        // context.report(node, token.loc.start, MISSING_SPACE_MESSAGE);
                        context.report({
                            node,
                            loc: token.loc.start,
                            message: MISSING_SPACE_MESSAGE,
                            fix(fixer) {
                                return fixer.insertTextBefore(token, " ");
                            }
                        });
                    } else if (token.value === ")" && shouldCloserRejectSpace(prevToken, token)) {
                        context.report({
                            node,
                            loc: token.loc.start,
                            message: REJECTED_SPACE_MESSAGE,
                            fix(fixer) {
                                return fixer.removeRange([prevToken.range[1], token.range[0]]);
                            }
                        });
                    }
                });
            }
        };

    }
};

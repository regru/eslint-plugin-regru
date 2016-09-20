/**
 * @fileoverview Defines space in parens with quotes inside
 * @author Ivan
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-space-in-parens"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-space-in-parens", rule, {

    valid: [
        "foo('alloha')",
        "foo('alloha' + 'alloha2')",
        "foo(bar + 'alloha2')",
        // give me some code that won't trigger a warning
    ],

    invalid: [
        {
            code: "foo( 'string only' )",
            errors: [{
                message: "There must be no space inside this paren with string.",
                type: "Stylistic Issues"
            }]
        }
    ]
});

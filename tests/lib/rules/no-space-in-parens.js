/**
 * @fileoverview Defines space in parens with quotes inside
 * @author Ivan
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-space-in-parens");
const eslint = require("eslint");
const RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
const options = [
    "always",
    {
        "exceptions": ["(STRING)"]
    }
];
const ruleTester = new RuleTester();

ruleTester.run( "no-space-in-parens", rule, {

    valid: [
        {
            code: "'use strict';\nfoo();",
            options,
        },
        {
            code: "//some comment\n'use strict';\nfoo( arg );",
            options,
        },
        {
            code: "function foo( arg ) {\n\t'use strict';\n\treturn arg;\n};",
            options,
        },
        {
            code: "foo('gotcha')",
            options,
        },
        {
            code: "oo( 'alloha' + 'alloha2' )",
            options,
        },
        {
            code: "foo( bar + 'alloha2' )",
            options,
        },
    ],

    invalid: [
        {
            code: "foo( 'string only' )",
            options,
            errors: [{
                message: "There must be no space inside this paren with STRING expression.",
                type: "Program"
            },{
                message: "There must be no space inside this paren with STRING expression.",
                type: "Program"
            }]
        },
        {
            code: "foo( 'string only')",
            options,
            errors: [{
                message: "There must be no space inside this paren with STRING expression.",
                type: "Program"
            }]
        },
        {
            code: "foo(arg)",
            options,
            errors: [{
                message: "There must be a space inside this paren.",
                type: "Program"
            },{
                message: "There must be a space inside this paren.",
                type: "Program"
            }]
        }
    ]
} );

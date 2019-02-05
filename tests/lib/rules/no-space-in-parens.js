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
const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2015 } });

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
        {
            code: "fn(`template literal`)",
            options,
        },
        {
            code: "fn( `template literal`, 1 )",
            options,
        },
        {
            code: "fn( `template literal` + 1 )",
            options,
        },
        {
            code: "fn( `template literal` && 1 )",
            options,
        },
        {
            code: "fn( +`template literal` )",
            options,
        },
        {
            code: "fn( fn`template literal` )",
            options,
        },
        {
            code: "fn(`template ${variable} literal`)",
            options,
        },
        {
            code: "fn( `template ${variable} literal`, 1 )",
            options,
        },
        {
            code: "fn( `template ${variable} literal` + 1 )",
            options,
        },
        {
            code: "fn( `template ${variable} literal` && `template ${variable} literal` )",
            options,
        },
        {
            code: "fn(`template literal ${ fn(`nested ${ variable }`)}`)",
            options,
        },
        {
            code: "fn( `template literal${`nested${fn( console.log( 1, 'var' ) )}`}`, variable )",
            options,
        },
        {
          code: "`template literal`",
          options,
        },
        {
          code: "`template ${ `template literal` } literal`",
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
        },
        {
            code: "foo(`name${variable}`, 1)",
            options,
            errors: [
                {
                    message: "There must be a space inside this paren.",
                    type: "Program"
                },
                {
                    message: "There must be a space inside this paren.",
                    type: "Program"
                }
            ],
        },
        {
            code: "foo( `name${variable}`, 1)",
            options,
            errors: [
                {
                    message: "There must be a space inside this paren.",
                    type: "Program"
                },
            ],
        },
        {
            code: "foo(`name${variable}` )",
            options,
            errors: [
                {
                    message: "There must be no space inside this paren with STRING expression.",
                    type: "Program"
                },
                {
                    message: "There must be no space inside this paren with STRING expression.",
                    type: "Program"
                },
            ],
        },
        {
            code: "foo( `name${variable}` )",
            options,
            errors: [
                {
                    message: "There must be no space inside this paren with STRING expression.",
                    type: "Program"
                },
                {
                    message: "There must be no space inside this paren with STRING expression.",
                    type: "Program"
                },
                {
                    message: "There must be no space inside this paren with STRING expression.",
                    type: "Program"
                },
                {
                    message: "There must be no space inside this paren with STRING expression.",
                    type: "Program"
                },
            ],
        },
        {
            code: "foo( `name${`text${console.log(1, 2)}`}` )",
            options,
            errors: [
                {
                    message: "There must be no space inside this paren with STRING expression.",
                    type: "Program"
                },
                {
                    message: "There must be no space inside this paren with STRING expression.",
                    type: "Program"
                },
                {
                    message: "There must be a space inside this paren.",
                    type: "Program"
                },
                {
                    message: "There must be a space inside this paren.",
                    type: "Program"
                },
                {
                    message: "There must be no space inside this paren with STRING expression.",
                    type: "Program"
                },
                {
                    message: "There must be no space inside this paren with STRING expression.",
                    type: "Program"
                },
            ],
        },
    ]
} );

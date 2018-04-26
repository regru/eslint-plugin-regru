# eslint-plugin-regru

[![NPM version][npm-image]][npm-url]

REG.RU ESLint custom rules

# no-space-in-parens

Add exception for `()` parens which contains ONLY string expression

[More Details](https://github.com/regru/eslint-plugin-regru/docs/rules/no-space-in-parens.md)

```
{
    "rules": {
        "no-space-in-parens": [
            "error",
            "always",
            {
                "exceptions": ["(STRING)"]
            }
        ]
    }
}
```


[npm-image]: https://img.shields.io/npm/v/eslint-plugin-regru.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/eslint-plugin-regru

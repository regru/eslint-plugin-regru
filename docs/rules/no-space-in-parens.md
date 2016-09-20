# Defines space appearance in parens with only STRING type expression inside

Please describe the origin of the rule here.


## Rule Details

Add exceptions for basic "space-in-parens" rule, so the STRINGs in parens '()'
can be without whitespace.

The following patterns are considered warnings:

```js

( 'Here is no whitespace' )

```

The following patterns are not warnings:

```js

('Here is no whitespace')
( 'other' + 'expressions got whistespaces' )
( likeThisFoo, 'and this bar' )
('so only pore string are true')

```

### Options


## When Not To Use It

Very exclusive rule for personal purposes.



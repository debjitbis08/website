---
title: "Understanding Tagless Final in Typescript - Part 1"
description: ""
publishDate: "11 Mar 2025"
tags: ["dsl", edsl", "typescript", "functional programming"]
draft: true
---

Few years ago, I had to solve the problem of creating a service to generate some JavaScript code from data.
It was a rewrite and improvement of the existing service. The existing service was creating code using string
manipulation and lot of conditionals. Trying to understand the code was extremely difficult. I needed to
understand the existing code, as I had to carry over a lot the existing logic too. This experience made
me realize I can't do this using string manipulation. One of the core requirements I added was that the whole
flow of the overall generated code should be readable. Even with the conditional code, people should not have any
issues understanding the high level structure of the generated code. This led to the rabbit hole of DSLs and EDSLs.

I knew at the time that Haskell is a really nice language to build EDSLs. I had done some practice programming in
OCaml and Haskell but never built anything significant. Considering this and also the team's capabilities I decided
to start writing something in Typescript, using something what we will discuss later as "initial" encoding. I was able
to get something working, but the language just did not feel right for the task. So I dicussed with few members
in the team and decided to go for Haskell. Finally, after shuffling through lot of stuff, I ended up on this page,
[https://okmij.org/ftp/tagless-final/index.html](https://okmij.org/ftp/tagless-final/index.html). I think the
page wasn't organized the way it is today, but the technique presented just blew me away.

Now I am revisiting the paper that I based my implementation on that time and hope to go much deeper and understand
all the stuff that I had skipped earlier. Having no theoretical knowledge of many of the concepts such as type systems
it is a bit difficult for me to fully grasp all the finer points, but I hope to understand and learn those basics
as I go along.

I decided to do this set of posts with Typescript instead of Haskell as it will force me to understand some of the code
in a deeper way. Also, Typescript does not have capabilities, such as higher-order polymorphism, to implement this
technique elegantly, but I hope this difficulty will only make my understanding better. Use Typescript also make this
more accessible to many more people and hopefully they will remember this approach if and when they need this.

In this series of posts, I will walk through the paper in detail and thus most examples and the flow will be directly referenced
from the paper.

## Why write a EDSL?

Domain specific languages (DLSs) have many applications[^1]. Some examples can be writing test cases, lightweight language
for domain experts, parser generators and many other.

[^1]: https://en.wikipedia.org/wiki/Domain-specific_language

EDSLs can be even better in some cases as much of the language compiler chain can be handled by the host language. If building
a DSL which will be used by developers itself, sometimes an EDSL can be very effective.

I won't write about this much, and I suggest you read some of the material linked in the further reading and external links
section of the DSL Wikipedia page.

## A simple language

Our toy language, at least for this part of the series, will be a very simple arithmetic language, that for now has,
integer literals, negation and addition of two integers.

Example, we should be able to write the following in our language, `8 + (-2)`.

Once we have written some 'code' in our language, we should be able to evaluate the code and also pretty print it. Which means,
we should have to write two _interpreters_[^2] for our language.

[^2]: Defined interpreter from SICP

## Initial Embedding

We can use a sum type[^3] where each term will be an element of the syntax. Unfortunately, what is just a single line in Haskell,
in Typescript requires us to create the constructor functions on our own. We could also the OO way, but I am not going to.

[^3]: Talk about Algebraic Data Types

```typescript
type Exp =
	| { type: "Lit"; value: number }
	| { type: "Neg"; exp: Exp }
	| { type: "Add"; left: Exp; right: Exp };

const Lit = (value: number): Exp => ({ type: "Lit", value });
const Neg = (exp: Exp): Exp => ({ type: "Neg", exp });
const Add = (left: Exp, right: Exp): Exp => ({ type: "Add", left, right });
```

Then we can write some expressions using this language, such as,

```typescript
const exprInitial1 = Add(Lit(8), Neg(Lit(2)));
```

You will notice that the `Neg` and the `Add` terms are recursive, that is they consume the `Exp` type. This allows us to build
complex expressions.

### Interpreters

To evaluate the expressions written using this language, we will write a simple interpreter that does pattern matching on the terms.

```typescript
function eval(e: Exp): number {
	switch (e.type) {
		case "Lit":
			return e.value;
		case "Neg":
			return -eval(e.exp);
		case "Add":
			return eval(e.left) + eval(e.right);
	}
}
```

You can now evaluate the `exprInitial1` expression using `eval(exprInitial1)` which should return 6.

Now we will write another interpreter for the language to pretty print the expressions.

```typescript
function view(e: Exp): string {
	switch (e.type) {
		case "Lit":
			return e.value.toString();
		case "Neg":
			return `(-${view(e.exp)})`;
		case "Add":
			return `(${view(e.left)} + ${view(e.right)})`;
	}
}
```

This will return the string `(8 + (-2))` when we call `view(exprInitial1)`.

### The Expression Problem

If we need to add another operation to our DSL, let's say, `Mul`, we would need to update both the interpreters, otherwise the
case analysis would fail, when presented with an expression with `Mul` in it. This problem of adding new representation (`Mul` of `Expr`)
and/or new behaviour (`view`) without recompiling the existing code is called the [Expression Problem](https://en.wikipedia.org/wiki/Expression_problem)[^4].

[^4]: [The Expression Problem](http://homepages.inf.ed.ac.uk/wadler/papers/expression/expression.txt)

The _initial embedding_ has surely not solved this and so we must look elsewhere.

## Final Embedding

The core idea for the final embedding approach is to represent the language terms not using ADTs but using functions. This idea is
explored in SICP [section 2.1.3](https://sourceacademy.org/sicpjs/2.1.3) (I have linked the JS edition of the book). In that section,
the authors talk about representing the pair data structure using only functions.

```typescript
function pair<A, B>(f: A, s: B) {
	return function (pos: "first" | "second") {
		return pos === "first" ? f : s;
	};
}

function head(z: ReturnType<typeof pair>) {
	return z("first");
}

function tail(z: ReturnType<typeof pair>) {
	return z("second");
}

const x = pair(3, 2);
console.log(head(x));
console.log(tail(x));
```

Using similar idea for our arithmetic language. We can write,

```typescript
type Repr = number;

const lit = (n: number): Repr => n;
const neg = (e: Repr): Repr => -e;
const add = (e1: Repr, e2: Repr): Repr => e1 + e2;

console.log(add(lit(8), neg(lit(2))));
```

With this embedding, we can easily add `mul` without breaking any previous code.

```typescript
const mul = (e1: Repr, e2: Repr): Repr => e1 * e2;

console.log(mul(lit(8), neg(lit(2))));
```

The one flaw is that we have lost the ability to specify multiple interpreters. We an evaluate any expression, but pretty printing
is not possible anymore.

To solve this problem, these functions need to return a type that's parametrized. These functions are working with expressions, so
our type is `Expr` but not just that, the `Expr` type must be parametrized to handle multiple interpreters. Such as, `Expr<number>`
for evaluation and `Expr<string>` for pretty printing. The way to do this Typescript is a bit convoluted,

```typescript
interface ExpSYM<R> {
	lit(n: number): R;
	neg(e: R): R;
	add(e1: R, e2: R): R;
}
```

But this does not give us the constructors automatically. If some instance of this interface is created then our constructor functions,
should use it and we should be able to specify this instance to use.

```typescript
const NumberExpSYM: ExpSYM<number> = {
	lit: (n) => n,
	neg: (e) => -e,
	add: (e1, e2) => e1 + e2,
};

const lit =
	<R, I extends ExpSYM<R>>(n: number) =>
	(interpreter: I) =>
		interpreter.lit(n);
const neg =
	<R, I extends ExpSYM<R>>(e: (interpreter: I) => R) =>
	(interpreter: I) =>
		interpreter.neg(e(interpreter));
const add =
	<R, I extends ExpSYM<R>>(
		e1: (interpreter: I) => R,
		e2: (interpreter: I) => R,
	) =>
	(interpreter: I) =>
		interpreter.add(e1(interpreter), e2(interpreter));

const tf1 = add(lit(8), neg(lit(2)));

const eval_ = (x) => x;

console.log(eval_(tf1)(NumberExpSYM)); // Prints 6
```

If you look closely we are building a large function from the smaller one which finally get evaluated when we pass `NumberExpSYM` to the resulting
expression function.

### Adding New Interpreter - Pretty Printer

To add the pretty printer, we do,

```typescript
const StringExpSYM: ExpSYM<string> = {
	lit: (n) => n.toString(),
	neg: (e) => `(-${e})`,
	add: (e1, e2) => `(${e1} + ${e2})`,
};

console.log(eval_(tf1)(StringExpSYM)); // Prints (8 + (-2))
```

### Adding New Syntax - Multiplication

Now to extend the language using `mul`.

```typescript
interface MulSYM<R> {
	mul(e1: R, e2: R): R;
}

const mul =
	<R, I extends MulSYM<R>>(
		e1: (interpreter: I) => R,
		e2: (interpreter: I) => R,
	) =>
	(interpreter: I) =>
		interpreter.mul(e1(interpreter), e2(interpreter));

const NumberMulSYM: MulSYM<number> = {
	mul: (e1, e2) => e1 * e2,
};

const StringMulSYM: MulSYM<string> = {
	mul: (e1, e2) => `(${e1} * ${e2})`,
};

const tf2: <R>(I: ExpSYM<R> & MulSYM<R>) => R = add(
	lit(7),
	neg(mul(lit(1), lit(2))),
);

console.log(eval_(tf2)({ ...NumberExpSYM, ...NumberMulSYM }));
console.log(eval_(tf2)({ ...StringExpSYM, ...StringMulSYM }));
```

Finally we have extended the language in both ways without breaking or updating any earlier code.

This covers the [paper](https://okmij.org/ftp/tagless-final/course/lecture.pdf) till section 2.2. Rest of the sections of the paper will be covered in later posts.

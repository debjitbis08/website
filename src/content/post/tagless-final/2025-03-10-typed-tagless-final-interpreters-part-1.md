---
title: "Understanding Tagless Final in TypeScript - Part 1"
description: "I revisit typed tagless final interpreters—a technique I found fascinating years ago—to deepen my understanding using TypeScript examples."
publishDate: "11 Mar 2025"
tags: ["dsl", "edsl", "typescript", "functional programming"]
---

A few years ago, I was tasked with rewriting and improving a service that generated JavaScript code from structured data.
The original implementation relied heavily on string
manipulation and numerous conditionals, making it challenging to understand and maintain the code generation logic. I needed to
understand the existing code, as I had to carry over a lot the existing logic too. This experience made
me realize I can't do this using string manipulation. One of the core requirements I added was that the whole
flow of the overall generated code should be easy to read and understand. Even with the conditional code, people should not have any
issues understanding the high level structure of the generated code from the generating code. This requirement led me down the fascinating rabbit hole of Domain-Specific Languages (DSLs) and Embedded Domain-Specific Languages (EDSLs).

I knew at the time that Haskell is a wonderful language to build EDSLs. I had little experience in
OCaml and Haskell from some courses but had never built anything significant. Considering this and also the team's capabilities I decided
to start writing something in TypeScript, using something what we will discuss later as "initial" embedding. I was able
to get something working, but the language just did not feel right for the task. So I discussed with few members
in the team and decided to go for Haskell. Eventually, after extensive exploration, I discovered Oleg Kiselyov's
excellent page about his numerous papers on tagless final approach [https://okmij.org/ftp/tagless-final/index.html](https://okmij.org/ftp/tagless-final/index.html). I think the page wasn't organized the way it is today, but the technique presented just blew me away.

Now I am revisiting the [lecture notes](https://okmij.org/ftp/tagless-final/course/lecture.pdf) that I based my implementation on that time and hope to go much deeper and understand
all the stuff that I had skipped earlier. Having no theoretical knowledge of many of the concepts such as type systems
it is a bit difficult for me to completely grasp all the finer points, but I hope to understand and learn some of those basics
as I go along.

I decided to do this set of posts with TypeScript instead of Haskell as it will force me to understand some of the code
in a deeper way. Also, TypeScript does not have some capabilities, such as higher-order polymorphism, to implement this
approach elegantly, but I hope this difficulty will only make my understanding better. Additionally, using TypeScript makes this material accessible to a broader audience, who may find these powerful techniques useful in their own projects.

In this post, I'll explore how to implement typed tagless final interpreters in TypeScript, closely following the
[excellent notes provided by Oleg Kiselyov](https://okmij.org/ftp/tagless-final/course/lecture.pdf). By translating these
concepts into TypeScript, we'll aim to make the ideas clear, practical, and approachable, even if you're encountering
tagless final interpreters for the first time.

## Why Write an EDSL?

Domain-Specific Languages (DSLs) are widely applicable and useful in various contexts[^1]. Common use cases include writing test cases, creating lightweight languages for domain experts, building parser generators, and many other specialized tasks.

Embedded Domain-Specific Languages (EDSLs) can often provide even greater benefits, as they leverage the existing compiler infrastructure and ecosystem of the host language. This can simplify development, especially when the intended users of the DSL are developers themselves.

Rather than covering DSLs in detail here, I recommend exploring some of the excellent resources linked under the "Further Reading" and "External Links" sections on the [DSL Wikipedia page](https://en.wikipedia.org/wiki/Domain-specific_language).

[^1]: https://en.wikipedia.org/wiki/Domain-specific_language

## A simple language

Our toy language, at least for this part of the series, will be a very simple arithmetic language, that for now has,
integer literals, negation and addition of two integers.

Example, we should be able to write the following in our language, `8 + (-2)`.

Once we have written some 'code' in our language, we should be able to evaluate the code and also pretty print it. This means,
we need to write two different _interpreters_[^2] for our language.

[^2]: A procedure or program that directly evaluates and executes expressions written in a programming language, thereby giving meaning to those expressions.

## Initial Embedding

We can use a sum type[^3] where each term will be an element of the syntax. Unfortunately, what is just a single line in Haskell,
in TypeScript requires us to create the constructor functions on our own. We could also the Object oriented way, but I am not going to.

[^3]: Sum types are type of Algebraic Data Types (ADTs). ADTs are composite types used in functional programming languages, allowing complex data structures to be defined by combining simpler types through operations such as sums (variants) and products (records or tuples).

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

This idea of representing language constructs using functions rather than algebraic data types serves as inspiration for the embedding we'll explore next. Notice how, in our arithmetic example below, each function directly encodes the meaning of language terms:

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

The one flaw is that we have lost the ability to specify multiple interpreters. We can evaluate any expression, but pretty printing
is not possible anymore.

To address this limitation, each function should return a representation whose value is determined only during interpretation but the meaning is encoded in the function. Instead of directly computing numeric values, our functions should build abstract expressions parametrized by their interpretation. For instance, we might have `Expr<number>` for evaluation and `Expr<string>` for pretty-printing. In TypeScript, we can achieve this flexibility by defining a generic interface.

```typescript
interface ExpSYM<R> {
	lit(n: number): R;
	neg(e: R): R;
	add(e1: R, e2: R): R;
}
```

However, this interface alone doesn't directly provide us with constructor functions. To solve this, we need a way to define our constructors so that they explicitly depend on a given interpreter instance, allowing us to specify the interpreter we want to use.

```typescript
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

const NumberExpSYM: ExpSYM<number> = {
	lit: (n) => n,
	neg: (e) => -e,
	add: (e1, e2) => e1 + e2,
};

const tf1 = add(lit(8), neg(lit(2)));

const eval_ = (x) => x;

console.log(eval_(tf1)(NumberExpSYM)); // Prints 6
```

If you look closely we are building a large function from the smaller one which finally gets evaluated when we pass `NumberExpSYM` interpreter to the resulting
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

Now we extend the language using `mul`.

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

This covers the [notes](https://okmij.org/ftp/tagless-final/course/lecture.pdf) till section 2.2. Rest of the sections of the paper will be covered in later posts. Some of the interesting things in the future posts are, serialization, typed DSLs and optimizations.

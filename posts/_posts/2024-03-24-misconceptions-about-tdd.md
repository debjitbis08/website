---
layout: post
title: Busting 4 TDD Myths That Are Holding You Back
---

I have been avoiding TDD for a long time now. I know I should write unit tests and sometimes I actually do. But mostly, I just didn’t bother with the TDD thing. Now you might argue that writing tests are different from adopting the TDD approach, which is true, but not for the reasons you might think. What I have realized over the last few months is that TDD fundamentally is not about writing tests at all and understanding the real meaning of TDD is what finally convinced me to do it.

# Misconception 1: TDD is about Writing Tests 

It is a common mistake to think that TDD is just about tests, mainly because the word "test" is right there in the name. But testing is more like a side effect of TDD, not its core purpose. At its heart, TDD is about designing your software. 

I remember someone once told me that good programmers start with pen and paper. I still feel a bit guilty when I skip this step, which happens more often than I would like to admit. Sketching your ideas on paper or a whiteboard helps you organize your thoughts, spot potential problems, and think deeply about what you are creating. This always leads to better software design. 

TDD, in a way, is like using tests to sketch out your design ideas. It's about creating a blueprint for your software, where tests guide the development process. This approach helps ensure your design is solid and also executable. If I were to rename TDD to better reflect its true purpose, I might call it Notes-Driven Development (NDD), emphasizing the planning and design aspect of the process. 

# Misconception 2: You Have to Write Tests Before the Code 

This idea was one big reason I hesitated about TDD. I saw lots of people online saying it wasn’t doable, and I thought, if so many people agree, maybe TDD only works in special situations. 

However, my perspective shifted when I realized rather than "before" I should use the word "along" to describe the time when the tests should be written relative to the code. This subtle change in terminology affected how I approach TDD now. I now write the tests _along_ with the code. I view the test file as my notebook, where I write down what I expect the code to accomplish or document its behavior if it matches my initial plan. In essence, I am recording the behavior of the code as I develop it. It does not matter if this documentation happens slightly before or after I write the code, as long as it is done close to the time of the coding process. 

Like when I am fixing my laptop or setting up complex infrastructure for a project, I like to write down the steps. It helps me remember and acts as a guide. TDD feels similar. It is like keeping a diary of what I am thinking as I code.

The act of _trying_ to write the tests before the code forces us to think more clearly about our design. Just the intention is enough. It does not mean you have write down all the tests before you have written down any code. Think about what you are going to add next, in the function (for example) and try to come up with a test for it first. Think of yourself as a single threaded machine, executing the process of writing code and tests concurrently. Sometimes the code will come first, and at other times the tests. 

# Misconception 3: TDD Is All About Achieving Good Test Coverage 

Many think the goal of TDD is to ensure every part of the code is covered by tests, but that's not the main point. The real goal is to help us design better code. From my experience, if tests become too hard to write, may be because of over-mocking or overly complex mocks, it usually signals flaws in my code design. Striving to make code more testable naturally leads to improved design, like clearer separation of concerns and functions that fulfill a single responsibility. 

TDD nudges you to focus on testing the most important parts of your software. While a high test coverage can be achieved as a byproduct of TDD, it's the quality of the tests and a better code design that matter most, not just the coverage percentage. 

# Misconception 4: TDD is only for Unit Tests 

I always thought TDD is only for small bits of code, like unit tests, but that's not true. TDD can be used at higher levels of abstraction, beyond single units of code and over multiple services or layers. You can use it for bigger tests with ATDD (Acceptance Test-Driven Development) by encoding the behaviour of your software from a user point of view. It's not just developers who can do this; people like the product managers and testers can help write these big-picture test cases (but the developers should be the one to implement the tests). When you start a feature or a story, you can use the acceptance criteria and the accompanying examples to write the test cases. This way, everyone knows what needs to be built, and it helps guide how you build it.  

# Conclusion 

Understanding the core ideas behind TDD makes it a lot easier, more rewarding, and even fun. Once you see the benefits for yourself, you wouldn't want to go back. 

Here's a quick recap: 

1. TDD isn't just about tests; it's really about designing your code well. 
2. With TDD, you don't need to write tests before your code. Instead, you write your tests as you go, alongside the code. 
3. While TDD often leads to good test coverage, the main goal is to make your design better. 
4. TDD isn't limited to unit testing; you can use it for higher level tests like acceptance tests.

If you are like me, having avoided TDD or tried it and felt it was not right for you or your project, I suggest giving it another go, this time with this fresh understanding. 

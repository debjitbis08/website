---
title: Genuinely Functional User Interfaces and React
description: My thoughts about React & functional GUI models
publishDate: "10 Oct 2013"
updatedDate: "10 Oct 2013"
tags: ["functional programming", "frontend", "react"]
---

<p>
In a jungle of user interface frameworks, all trying to replicate the
patterns that work on the server, <a href="http://reactjs.com/" target="_blank">React</a>, created by Facebook, has
brought to fore some ideas that can change UI development forever.
</p>

<p>
<a href="http://conal.net/papers/genuinely-functional-guis.pdf" target="_blank">Genuinely Functional User Interfaces</a> is a paper written by Antony
Courtney and Conal Elliott (of FRP fame) which describes a formal
model of user interfaces which defines GUIs compositionally as Signal
Transformers.
</p>

<p>
We will see how these two are similar.
</p>

<p>
I had read this paper a few months ago and React was open sourced just a
few weeks later. After a quick glance at the React home page I sensed
that it is very closely related to this paper and thus I started digging
into the library for more information.
</p>

<p>
Quite surprisingly my web searches for articles relating these two came
up empty. The more I looked into React, the more it looked like a
implementation of formal model presented in the paper and I patiently
waited for someone to recognize this connection. Surely the React team
must be knowing about this, so why wasn't it mentioned. Were my
conclusions wrong? Was I seeing this connection only because I came
across them at almost the same time?
</p>

<p>
I don't believe that to be the case and below I will provide a mapping between the concepts
present in them.
</p>

<h2>React library</h2>
<p>
Let us start with a small description of React. Of course it will be
better if you check out their site and study the examples. Below are
most important points to note about React are:
</p>

<ul>
  <li>
      React is component based and these components can be composed to
      build new components.
  </li>
  <li>
      All components can receive data from outside (which they cannot
      mutate) and update their state.
  </li>
  <li>
      This internal state is converted to object that can be rendered.
      This conversion is specified declaratively by the component
      creator. On every state change the view is re-rendered
      automatically (and efficiently) by React.
  </li>
  <li>
      Every component has a render function which returns a lightweight
      DOM representation. It is called by the library whenever a
      component's state changes to keep the state and the UI in sync.
  </li>
  <li>
      There are no models or any other kind of domain layer in React. It
      only focuses on the view, which is a good decision for a library
      introducing such new ideas to the mainstream. You can connect it
      to other libraries/frameworks such as Backbone to handle the
      domain logic.
  </li>
</ul>

<p>
React is not a MVC framework and the React does not even use the word
framework. As their tag-line says "A JavaScript library for building
user interfaces".
</p>

<h2>Genuinely Functional User Interfaces</h2>
<p>
    Now let me introduce you to the ideas of the paper "Genuinely
    Functional User Interfaces". The authors present a UI library Fruit
    for Haskell based on a formal model they develop in the paper. The
    key concepts to understand about Fruit and the formal model are:
</p>
<ul>
    <li>
        It uses the concept of Signals, which are continuous
        time-varying values. A popular example being the mouse's current
        position (x, y). There is another concept of Events which is
        just a discretization of the Signal concept, so we will ignore
        it completely. FRP also uses these concepts.
    </li>
    <li>
        A concept of Signal Transformer is introduced in the paper
        which is function from Signal to Signal. They convert a Signal
        to some other Signal after some processing.
    </li>
    <li>
        A GUI is introduced as a Signal Transformer which takes a
        pair of Signals and outputs another pair of Signals.

        <pre><code>type GUI a b = (GUIInput, a) → (Picture, b)</code></pre>

        Quoting from the paper:
        <blockquote>
            A GUI a b is a signal transformer that takes a graphical
            input signal (GUIInput) paired with an auxiliary semantic
            input signal (a) and produces a graphical output signal
            (Picture) paired with an auxiliary semantic output signal
            (b).
        </blockquote>
    </li>

</ul>

<h2>The Connection</h2>
<p>
    Now we are ready to form a mapping between the concepts in them:
</p>
<table>
    <tr>
        <th>React</th>
        <th>Fruit</th>
    </tr>
    <tr>
        <td>Component</td>
        <td>GUI</td>
    </tr>
    <tr>
        <td>Browser Events</td>
        <td>GUIInput</td>
    </tr>
    <tr>
        <td>Data coming through props</td>
        <td>auxiliary semantic input signal (a)</td>
    </tr>
    <tr>
        <td>Lightweight DOM representation returned from render function.</td>
        <td>Picture</td>
    </tr>
    <tr>
        <td>Any data sent to other components</td>
        <td>auxiliary semantic output signal (b)</td>
    </tr>
</table>

<p>
    As we see above there is deep connection between them and
    understanding this connection will help us understand both of them
    better.
</p>

<p>
    I will be writing about extending these ideas in future, in the
    meantime please comment on the benefits we can draw from this.
</p>

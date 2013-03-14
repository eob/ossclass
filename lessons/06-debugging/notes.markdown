---
layout: exercise
title: Ted's Notes
lozenge: ex-juggler
---

Debugging Notes
===============

<div class="alert alert-error">
<h2>Spoiler Alert!</h2>
<p><b>Do not look at these notes</b> if you want to get anything from the
debugging puzzlers! They contain, among other things, the solutions! Only look
at them after you're done solving the puzzlers!</p>
</div>


Conflicting Opinions (CSS)
--------------------------

### Problem

Conflicting CSS rules coming from different places. One (the one you didn't
realize) overrides the other.

### Fix

*  Remove the other rule
*  Or, make the selector on your one more specific
*  Or, use the `!important` marker (ick, but sometimes necessary)

### Lessons

Declarative systems sometimes come with hidden cost: there is an interpreter
standing in between you and the behavior of the machine. When you say "Jump!",
the machine doesn't jump. It observes your command and then considers it in
combination with other statements.

What are some systems where this is the case?

* Rule-based inference systems (knowledge bases, etc)
* CSS
* Your program structure (class definitions, etc. monkey patching in Ruby, for example)

How to handle it?

* Be aware of when you're using a technology where this problem exists
* **Provenance**: tracing back a behavior to the pieces of information that led the computer to do that. For example, in Chrome, the Developer Tools let you ask why an element is being displayed the way it is, tracing it back to particular CSS statements. In logic systems, you can print a "stack trace" of the forward-chaining entailments that led to a conclusion.

What to do if you think you are going crazy
-------------------------------------------

### Problem

*  The integers `0` and `1` in Ruby don't cast onto boolean values, so `!0` is
`false`! This is a surprise to anyone used to the C conventions. This bug appears twice
*  `...` is end-exclusive and `..` is end inclusive in ruby. So there is an off by one error

### Solution

*  Remove the implicit int to boolean conversions
*  Make the range inclusive

### Lessons

*  The goal of this was to show you code you wouldn't understand. But you can still debug code you don't understand if you have the right process.
*  Work your way outside in:
   1. Does the program execute?
   2. Does the outer loop cover the right range?
   3. Is the return result what you'd expect for a controlled input?
   4. etc etc
*  Working your way inward like this, you can check the integrity of your assumptions and narrow down errors to certain regions of the code.
*  E.x.: search and rescue scuba diving (senses extremely constrained. You can't see far, you don't have a sense of topology. So you have **very, very** precise patterns you swim to create a sitaution in which you are likely to encounter the missing person).
*  When you see an idiom you've never encountered, start up an interactive console and play with the expression to understand how it works.

You Know what they say about assumptions
----------------------------------------

### Problem

*  Python initializes a default argument once, and then always binds to that object.

### Solution

Don't inline non-primitives as default arguments in python

### Lesson

* Not about knowing Python trivia, but rather tracing down what is going on
* Exact same approach as before: 
  * Slowly work your way outside in
  * Check and test your assumptions about the code. Is this variable what it should be?
  * Your first goal is not to discover **what** is wrong, but first just discover **where** something is wrong. You can deal with **what** later.

A Juggler's Dilemma
-------------------

### Problem

* Zipping occurs before the ajax request has returned

### Fix

* Need to keep accounting of requests

### Lesson

There's an important assumption we make in programming: that statement i+1
comes after statement i. That isn't true when we introduce threads, multiple
machines, etc into the mix. Statement i might still be executing elsewhere
while your computer moves on to statement i+1.

How do you detect these problems?

* Logging: when we see out of order logs (exception: multiple machines, can't trust clocks?)
* Logging: when we notice things aren't initialized that we think should have been

How can we deal with this?

* Syntactic sugar that allows us to pretend things are serial
* Manual accounting, and "trigger" based advancement to step i+1

Who Am I (Fortune Teller)
-------------------------

### Problem

Asynchronous code execution causes problems in:
*  Timing (statement i+1 should only be executed after statement i finishes, but this "finish" is done via callback)
*  Context (when code is executed from elsewhere, bindings to the environment don't always default to what you think they do)

### Fix

*  Context needs to be set on the jqXHR object (context: this)
*  Context needs to be set on the Underscore enumeration
*  tellFortune() call is happening too soon. Needs to be moved into the success() callback

### Lessons

*  Timing, once again
*  In Javascript **especially** it's always a good idea when things to wrong to `console.log(this);`

Inference, Dr. Watson
----------------------

### Problem

Underflow!

### Fix

Perform calculations in logspace

### Lessons

* Even though we were able to fix this problem, in some programs, errors shouldn't be handled. You must fail on error.
  * Safety reasons
  * Correctness reasons
  * Cost reasons (think long-running mapreduce)

* Assert statements are your friend in these cases. At certain points during
* code, when there is something you **know to be true**, put an assert in there. It costs you almost nothing, but can save you down the road.

When are asserts bad?

* Consumer software (use exceptions, UI error handling)

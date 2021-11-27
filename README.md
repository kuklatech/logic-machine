# Simple Logic Machine

## Problem to solve

Imagine you have to manage complicated production system with a set of different vendors. You may encounter problems like:

- you have a lot of requirements from those vendors
- the requirements change frequently
- activity diagrams, UMLs, specification documents get complicated and are hard to maintain
- you have so many exceptions, you can't figure out simple rules
- there is only one person in a company that knows it all, but it's not written down anywhere and there is no process to it, so if the person leaves the company, you loose all the knowledge of that person

Consider the following list of rules and exceptions:

1. If I want to order 10000 pieces of product A, it should go to the supplier 1.
2. If the product must be colorful it can be manufactured only by a supplier 2
3. Usually we send our production list with all the information, but if we choose supplier 3 we must create production list in a very specific way, because the contract binds us.

## How to use the Simple Logic Machine to solves that problem?

Simple Logic Machine allows you to quickly get an answer to your question out of a complex system.

First, figure out what you want to establish, for instance the mode of production list to generate.

Then figure out general rule: `generate production list in a way A`

Lastly, list all of the exception:

- if `supplier 3`, `generate production list in a way B`

Run the machine by passing input, which is a list of first principles (check out awesome article by James Clear: https://jamesclear.com/first-principles)

**Input examples:**

1. First example:

- product=A
- supplier=1

2. Second example:

- product=A
- supplier=1

Run the Simple Logic Machine and pass set of rules, the input, and the answer you want to get. Simple Logic Machine will iterate over all of the rules and figure out what's the answer.

If there is information missing, SLM will tell you that.

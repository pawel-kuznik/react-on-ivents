# react-on-ivents

This library makes easy to deal with data and data sources when creating react component.
This is not a new concept, to a certain degree state management systems are used to fullfil
the same need. However, state management systems store the data on a global level. In addition,
they come with very rigid data structures and limits which aren't easy to overcome (storing
objects is a constant issue).

This library doesn't come with these issues as it uses `iventy` library as an easy way to
observe data sources. This allows the data source to be modeled without any consideration
of the visual code.

Additionally, this library provides a `Reader` class that turns async reading process into
a sync reading process with support of `<Suspense>` tag.

### Working in signals

`iventy` library introduces a signal concept. It's a mechanism to give someone a way to tell
you (or someone else) something. It's a one-direction communication which means that the input
source can be protected and still allow the listening to a signal on the other end.

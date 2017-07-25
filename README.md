# Flow

This library provides a runtime environment to load, configure and execute reactive dataflow graphs.

It is a reactive programming library optimized for hot code reloading without losing or overriding application state.
The data flow graph can be manipulated and extended during runtime. This can be used by tools like webpack hot module reloading, to update the data flow without recreating it from scratch.

Other runtime manipulation and inspection mechanisms can also be easily applied, like visualization of the data flow graph, or live updates of node state values.

Developed and build for usage with TypeScript.

*This library is currently alpha state, in heavy development and APIs are changing frequently!*

Flow is currently primarily used in the [trivial space playground](https://github.com/trivial-space/playground) to experiment with graphics live coding inside browsers. Check it out for further examples.


## License

MIT, see the LICENSE file in the repository.

Copyright (c) 2016 - 2017 Thomas Gorny

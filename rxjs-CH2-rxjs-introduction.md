## RxJS

RxJS is a port of the ReactiveX Java library to Javascript. It facilitates the development of code that adheres to the principles of Functional and Reactive programming but in no way forces you to stick to those principles. It builds upon the Observer pattern by adding a few new concepts

*   Subscription
    *   An object that is a reference to a subscription from an observable to an observer. A subscription can be unsubscribed to prevent further execution of the observers next function
*   Operators
    *   Operators are pure functions that allow for the output of a stream to be transformed such as map, filter, concat etc.
*   Schedulers
    *   Centralized event dispatchers that simplify concurrency by coordinating when computation happens. A scheduler could, for example, be based on clock timing or animation frames 

### Common Operators

#### Creation

* **of**
    * Takes a series of values and turns them into an observable that emits the values in order.
    ```typescript
        of(1, 2, 3, 4).subscribe(v => console.log(v));

        1
        2
        3
        4
    ```
* **from**
    * Takes a Promise or Iterable as a parameter and returns an Observable that emits the Promise's 

### Pipes

A pipe is a series of operators that can be used like an assembly line for the output of your observables
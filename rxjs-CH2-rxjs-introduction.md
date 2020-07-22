## RxJS

RxJS is a port of the ReactiveX Java library to Javascript. It facilitates the development of code that adheres to the principles of Functional and Reactive programming but in no way forces you to stick to those principles. It builds upon the Observer pattern by adding a few new concepts

*   Subscription
    *   An object that is a reference to a subscription from an observable to an observer. A subscription can be unsubscribed to prevent further execution of the observers next function
*   Operators
    *   Operators are pure functions that allow for the output of a stream to be transformed such as map, filter, concat etc.
*   Schedulers
    *   Centralized event dispatchers that simplify concurrency by coordinating when computation happens. A scheduler could, for example, be based on clock timing or animation frames 


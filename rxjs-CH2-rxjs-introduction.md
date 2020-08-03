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
    * Takes a Promise or Iterable as a parameter and returns an Observable that emits the Promise's resolved value or iterates through the iterables items
* **fromEvent**
    * Accepts an event target as its first parameter and the particular event is is listening for as the second parameter
        ```typescript
        fromEvent(document.getElementById('submit-btn'), 'click')
        ```
        This will create an Observable that will emit whenever the element is clicked. Event Targets that are supported are
        * DOM Event target - A DOM object with addEventListener and removeEventListener methods
        * Node.js EventEmitters - Object with addListener and removeListener methods
        * jQuery style event target - And object with on and off methods
        * DOM NodeList/HtmlCollection - The output of functions like `document.querySelectorAll`
* **interval**
    * Creates an Observable that emits every x milliseconds
        ```typescript
        interval(1000).subscribe(val => console.log(val))
        ```
        This will emit an incrementing value every 1000ms
* **ajax**
    * Wraps around an ajax request or url to turn the request into an Observable
* **join creation operators**
    * The join creation operators are used to create new Observables by combining or merging existing Observables. The join creation operators available are: combineLatest, concat, forkJoin, merge, partition, race, zip. There are subtle differences between how these work.
        * **merge** will take a number of Observables as input and will flatten the output, emitting whatever the children emit
        ```typescript
        const timer1 = timer(0, 1000); // Emit 0, 1, 2, 3... every second starting now
        const timer2 = timer(500, 1000); // Emit 0, 1, 2, 3... every second starting in 0.5s
        merge(timer1, timer2).subscribe((val) => console.debug(val));

        // 0 after 0s   (timer1)
        // 0 after 0.5s (timer2)
        // 1 after 1s   (timer1)
        // 1 after 1.5s (timer2)
        // 2 after 2s   (timer1)
        // 2 after 2.5s (timer2)
        ```
        * **combineLatest** will take a number of Observables as input and will emit the most recent value of all the inputs every time one of the input Observables emits. It will only emit if all child observables have emitted at least once.
        ```typescript
        const timer1 = timer(0, 1000); // Emit 0, 1, 2, 3... every second starting now
        const timer2 = timer(500, 1000); // Emit 0, 1, 2, 3... every second starting in 0.5s
        combineLatest(timer1, timer2).subscribe((val) => console.debug(val));

        // [0, 0] after 0.5s
        // [1, 0] after 1s
        // [1, 1] after 1.5s
        // [2, 1] after 2s
        // [2, 2] after 2.5s
        ```

### Transformation
* **map**
    * Not to be confused with Array.map. Map is used to transform from one type of value to another. We could use a map to double each value that and Observable emits or to convert API Responses into proper models.
    ```typescript
    from([1, 2, 3, 4]).pipe(
        map(v => v * 2)
    ).subscribe(v => console.log(v))

    // Output:
    // 2
    // 4
    // 6
    // 8
    ```
* **reduce**
    * Accumulates the values that are emitted and emits the result once the source observable has finished
    ```typescript
    from([1, 2, 3, 4]).pipe(
        reduce((acc, val) => acc += val)
    ).subscribe(v => console.log(v));

    // Output: 
    // 10
    ```
* **scan**
    * Works similarly to a reduce but it will output the acculated value after each emission of the source observable
    ```typescript
    from([1, 2, 3, 4]).pipe(
        scan((acc, val) => acc += val)
    ).subscribe(v => console.log(v));

    // Output:
    // 1
    // 3
    // 6
    // 10
    ```

### Writing Operators
All RxJS Operators are functions that take an Observable and outputs another Observable. 
```typescript
const tap = <T>(callback?: (x: T) => void) => 
    (source: Observable<T>): Observable<T> => {
        return new Observable(subscriber => {
            source.subscribe({
                next(value) {
                    if (callback) {
                        callback(value);
                    }
                    subscriber.next(value);
                },
                error(error) {
                    subscriber.error(error);
                },
                complete() {
                    subscriber.complete();
                }
            })
        });
}
```

<!-- ### Multicasting
In RxJS Observables are 'cold' by default. This means that the code used that emits values to the Observable isn't run until something specifically subscribes to the observable
```typescript
const getBeers$ = ajax('api/beers');
// No request has happened here

// Once this code has run the request will be triggered
getBeers$.subscribe(() => {
    // Here the request has run and we have the result
})
```
This is all fine if we only have one piece of code that consumes the result of our Observable but if we need that in multiple places and we subscribe multiple times, the request will happen multiple times. This is where multicasting comes into play. It allows you to share an Observable -->

### Pipes

A pipe is a series of operators that can be used like an assembly line for the output of your observables
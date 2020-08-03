# RxJS and Functional & Reactive Programming

## What is Functional & Reactive Programming?

Functional & Reactive Programming is a combination of **Functional** and **Reactive** Programming, not to be confused with the similarly named (but ultimately inaccurate) Functional Reactive Programming

## Functional Programming

Functional Programming is a process for development that focuses on building small manageable pure functions that can be composed together to make more complex functions. The three main pillars of Functional Programming are: 

* Immutability
    * Immutability means that once data is created it cannot be reassigned or modified
    * Immutable data is instead copied and transformed then a new version of the original data is used
    * Dates in JS are a mutable data structure that a number of developers run into issues with
    ```javascript
    const start = new Date('01/01/2020');
    // This will set the end date to the right date, but will also manipulate the start date as well
    const end = new Date(start.setYear(2021)); 
    
    const secondsInAYear = end.valueOf() - start.valueOf(); // Returns 0 because start === end
    -------------------------------------------------------
    const start = new Date('01/01/2020');
    // Here instead we create a copy of start and then modify only the end date
    const end = new Date(start).setYear(2021); 
    
    const secondsInAYear = end.valueOf() - start.valueOf(); // Returns the intended value
    ```

* Pure Functions

    * A function that has no side-effects and isn't affected by any state or values in the application that aren't passed in as parameters.

        ```javascript
        // Pure function
        // add only cares about the values passed into the function
        const add = (a: number, b: number) => a + b;
        add(add(1,2), add(3, 4))
        
        // Impure function
        // addTax Uses a value from outside the scope of the function to calculate the result
        let tax = 12.5;
        const addTax = (price: number) => price * (1 + (tax / 100));
        
        // This is now pure as the function is only using the values provided to calculate the output
        const addTaxPure = (price: number, tax: number) => price * (1 + (tax / 100));
        
        // This is also impure as it introduces a side-effect by manipulating the state of the application
        const setTax = (newTax: number) => tax = newTax;
        ```

* Composable Functions

    * A small, simple function that can be used standalone or in combination with other composable functions

        ```javascript
        const calculateShippingCost = (priceWithTax: number) => priceWithTax > 100 ? 0 : priceWithTax * 0.1;
        const calculatePriceWithTax = (price: number, tax: number) => price * (1 + (tax / 100));
        // These are both composable functions, they can be run individually and as part of a chain
        
        const calculateTotalPrice = (price) => calculateShippingCost(calculatePriceWithTax(price, 12.5));
        // A function composed entirely of composable functions is also composable itself
        
        const calculateDiscount = (price: number, discount: number) => calculateTotalPrice(price) * (1 - discount);
        ```

## Reactive Programming

Reactive Programming is a process for development which focuses on code that 'reacts' to external events. These events can come from a number of sources, UI events like clicks, Updates from the API or even custom sources like an interval that emits events every second. The main pillars of Reactive Programming are:

* Event-Driven Development

    * The majority of programming languages are written imperatively. Your program starts with line 1 and proceeds linearly until it reaches the last line. It may jump around into functions and loops but the general direction of execution is top to bottom.

    * Reactive programming is written declaratively, you tell the code what to do when certain things happen and then when those events are fired the code jumps to the location of your event handler and runs that. This means that your events drive the order that code is executed in

        ```javascript
        // Imperative
        const pow = (x, y) => Math.pow(x, y);
        
        for (i = 0; i <= 8; i++) {
          console.log(pow(2, i));
        }
        ----------------------------------------------------------
        // Declarative (Note that this code is reactive but not functional as we're producing side-effects)
        let counter = 0;
        const increaseCounter = () => counter += 1;
        const resetCounter = () => counter = 0;
        
        counterButton.addEventListener('click', increaseCounter);
        resetButton.addEventListener('click', resetCounter)
        ```

* Asynchronous
    * Since your code doesn't care when a function starts to run it only cares about when the events it's listening for are fired it's asynchronous by nature. This also means that a lot of the time you don't know the order that your code will be executed in but a well structured reactive program shouldn't care what order it is run in.

## The Observer Pattern

The observer pattern is a concept where an object (the **Observable**) maintains a list of dependents (the **Observers**) that it notifies when the object has been modified. This pattern can also be extended to include **Subjects** which act as Observers and Observables at the same time.

```typescript
interface Observable {
    constructor()
    subscribe(obs:Observer);
    unsubscribe(obs:Observer);
}

interface Observer {
    next(data:any);
}

interface Subject extends Observer, Observable {

}
```

### Subscribe

Adds the provided observer to the list of dependants on the Observable

### Unsubscribe

Remove the provided observer from the list of dependants on the Observable

```typescript
class SimpleObservable implements Observable {
    // Maintains a list of its dependants
	private observers: Observer[] = [];
    private _name: string = '';
  
    get name(): string {
        return this._name;
    }
  
    set name(n: string) {
        this._name = n;
        // When the object is modified loop through all observers and call their 'next' function
        this.observers.forEach((obs) => {
            obs.next(this._name);
        })
    }

    // Add a depdendant to the list
	public subscribe(obs: Observer) {
      	this.observers.push(obs);
    }
    
    // Remove a dependant
  	public unsubscribe(obs: Observer) {
        _.remove(this.observers, el => el === obs);
    }
}
```

### Next

On an observer, the next function is what you want to happen when an observable has been updated.

```typescript
class SimpleObserver implements Observer {
    public currentName: string = '';
    
    public next(name: string) {
        this.currentName = name;
        console.log(this.currentName);
    }
}
```

Now when we put these two parts together we will have a Observer instance that will update itself whenever an Observable instance is updated as long as it is subscribed to it.

 ```typescript
const observer = new SimpleObserver();
const observable = new SimpleObservable();

observable.subscribe(observer);

observable.name = 'Tom Steele';

// Should log our updated name
console.log(observer.currentName);
 ```

[Next up - RxJS Introduction](rxjs-CH2-rxjs-introduction.md)
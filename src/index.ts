import fizzBuzz from './assignment-1';

const fizzBuzzSub = fizzBuzz.subscribe(v => {
    if (v % 3 === 0 || v % 5 ===0) {
        fizzBuzzSub.unsubscribe();
        console.error(`${v} is divisible by 3 or 5!`);
    } else {
        console.log(v);
    }
});
import fizzBuzz from './assignment-1';
import {take} from "rxjs/operators";

fizzBuzz
    .pipe(take(10))
    .subscribe(v => {
        console.log(v);
    });

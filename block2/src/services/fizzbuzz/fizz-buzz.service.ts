import {Injectable} from '@angular/core';
import {interval, Observable, zip} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FizzBuzzService {

  constructor() {
  }

  get(): Observable<string> {
    const numbers$: Observable<number> = interval(6000)
      .pipe(map(n => n += 1));

    const fizz$: Observable<string> = numbers$
      .pipe(map(n => n % 3 === 0 ? 'Fizz' : '')
      );

    const buzz$: Observable<string> = numbers$
      .pipe(map(n => n % 5 === 0 ? 'Buzz' : '')
      );

    return  zip(numbers$, fizz$, buzz$)
      .pipe(map(([n, fizz, buzz]) => `${fizz}${buzz}` || n.toString()));
  }
}



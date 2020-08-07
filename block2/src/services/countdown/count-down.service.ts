import {Injectable} from '@angular/core';
import {Observable, timer} from 'rxjs';
import {takeWhile, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CountDownService {

  constructor() {
  }

  get(): Observable<number> {
    let counter = 6;
    return timer(0, 1000) // Initial delay 1 seconds and interval countdown also 1 second
      .pipe(
        takeWhile( () => counter > 0 ),
        tap(() => counter--)
      );
  }
}

import {Component, OnInit} from '@angular/core';
import {defaultIfEmpty, mapTo, take, takeUntil} from 'rxjs/operators';
import {fromEvent, interval, merge, Observable, Subscription, zip} from 'rxjs';
import {CountDownService, FizzBuzzService} from '../../services/';
import {Choice} from '../../models/choice';

function isNumber(val: string): boolean {
  return !isNaN(Number(val));
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  FizzBuzzSubscription: Subscription;
  countDownSubscription: Subscription;

  counter = 1;
  currentValue: string;
  guessedNextValue: string;
  isRunning = false;
  score = 0;
  isCorrect: boolean = null;
  countDown: number;

  constructor(
    private fizzBuzzService: FizzBuzzService,
    private countDownService: CountDownService,
  ) {
  }

  ngOnInit(): void {
    this.compareAnswer();
  }

  getUserInput(): Observable<Choice> {
    const nrInput$: Observable<Event> = fromEvent(document.getElementById('nr-btn'), 'click');
    const fizzInput$: Observable<Event> = fromEvent(document.getElementById('fizz-btn'), 'click');
    const buzzInput$: Observable<Event> = fromEvent(document.getElementById('buzz-btn'), 'click');
    const fizzBuzzInput$: Observable<Event> = fromEvent(document.getElementById('fizzBuzz-btn'), 'click');
    return merge(
      nrInput$.pipe(mapTo('Number')) as Observable<Choice>,
      fizzInput$.pipe(mapTo('Fizz')) as Observable<Choice>,
      buzzInput$.pipe(mapTo('Buzz')) as Observable<Choice>,
      fizzBuzzInput$.pipe(mapTo('FizzBuzz')) as Observable<Choice>,
    )
      .pipe(takeUntil(interval(5000)))
      .pipe(defaultIfEmpty(null));
    //missing timeout if no button clicked
    //limit answers with takeLast
    //transfor to subject to multicast what user clicked
    //add countdown
  }

  startFizzBuzz(): Observable<string> {
    return this.fizzBuzzService.get();
  }

  compareAnswer(): Subscription {
    return zip(this.getUserInput(), this.startFizzBuzz()
      .pipe(take(15)))
      .subscribe(([givenAnswer, correctAnswers]) => {
        console.log('given', givenAnswer, 'correct', correctAnswers);
        if (givenAnswer === correctAnswers || (isNumber(correctAnswers) && givenAnswer === 'Number')) {
          this.score++;
          this.isCorrect = true;
        } else {
          this.isCorrect = false;
        }
        this.counter++;
      });
  }

  startCountDown(): void {
    if (this.countDownSubscription) {
      this.countDownSubscription.unsubscribe();
    }
    this.countDownSubscription = this.countDownService
      .get()
      .subscribe(response => {
        this.countDown = response;
      });
  }
}

// startFizzBuzz(): void {
//   this.isRunning = true;
//   this.startCountDown();
//   this.FizzBuzzSubscription = this.fizzBuzzService.get()
//     .pipe(take(15))
// .subscribe(response => {
//   this.startCountDown();
// this.counter++;
// this.currentValue = response;
// this.calcPoints();
// this.guessedNextValue = '';
//     });
// }

// guessNextValue(value: string): void {
//   this.isCorrect = null;
//   this.currentValue = '';
//   this.guessedNextValue = value;
// }

// calcPoints(): void {
//   if (this.guessedNextValue === this.currentValue) {
//     this.score++;
//     this.isCorrect = true;
//   } else {
//     this.isCorrect = false;
//   }
// }

// stopCounter(): void {
// this.guessedNextValue = '';
// this.isRunning = false;
// this.isCorrect = null;
// this.currentValue = '';
// this.counter = 1;
// this.score = 0;
//   this.FizzBuzzSubscription.unsubscribe();
//   this.countDownSubscription.unsubscribe();
// }






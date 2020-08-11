import {Component, OnInit} from '@angular/core';
import {first, mapTo, scan, share, switchMap} from 'rxjs/operators';
import {fromEvent, merge, Observable, Subscription, zip} from 'rxjs';
import {CountDownService, FizzBuzzService} from '../../services/';
import {Choice, Input} from '../../models/choice';

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
  private nrInput$: Observable<Event>;
  private fizzInput$: Observable<Event>;
  private buzzInput$: Observable<Event>;
  private fizzBuzzInput$: Observable<Event>;
  userScore$: Observable<number>;
  numbers$: Observable<number>;

  constructor(
    private fizzBuzzService: FizzBuzzService,
    private countDownService: CountDownService,
  ) {
  }

  ngOnInit(): void {
    this.nrInput$ = fromEvent(document.getElementById('nr-btn'), 'click');
    this.fizzInput$ = fromEvent(document.getElementById('fizz-btn'), 'click');
    this.buzzInput$ = fromEvent(document.getElementById('buzz-btn'), 'click');
    this.fizzBuzzInput$ = fromEvent(document.getElementById('fizzBuzz-btn'), 'click');
  }

  getUserInput(): Observable<Input> {
    return merge(
      this.nrInput$.pipe(mapTo('Number')),
      this.fizzInput$.pipe(mapTo('Fizz')),
      this.buzzInput$.pipe(mapTo('Buzz')),
      this.fizzBuzzInput$.pipe(mapTo('FizzBuzz')),
    )
      .pipe<Input>(
        first(null, null)
      );
  }

  startFizzBuzz(): void {
    const fizzBuzz$ = this.fizzBuzzService.get();
    const game$ = zip<[Choice, Input]>(
      fizzBuzz$,
      fizzBuzz$.pipe(switchMap(() => this.getUserInput())))
      .pipe(
        share(),
      );

    this.numbers$ = this.fizzBuzzService.getNumbers();
    // .subscribe(([correctAnswers, givenAnswer]) => {
//   console.log('given answer:', givenAnswer, ', correct answer is:', correctAnswers);
//   if (givenAnswer === correctAnswers || (isNumber(correctAnswers) && givenAnswer === 'Number')) {
//     this.score++;
//     this.isCorrect = true;
//   } else {
//     this.isCorrect = false;
//   }
//   this.counter++;
// });
    this.userScore$ = game$.pipe(
      scan((score, [correctAnswer, givenAnswer]) => {
        console.log('state', score, correctAnswer, givenAnswer);
        if (givenAnswer === correctAnswer || (isNumber(correctAnswer) && givenAnswer === 'Number')) {
          score++;
          this.isCorrect = true;
        }
        else {
          this.isCorrect = false;
        }
        return score;
      }, 0));

    // userScore$.subscribe(value => console.log(value));
  }
}


// startCountDown(): void {
//   if (this.countDownSubscription) {
//     this.countDownSubscription.unsubscribe();
//   }
//   this.countDownSubscription = this.countDownService
//     .get()
//     .subscribe(response => {
//       this.countDown = response;
//     });
// }


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
//   this.fizzBuzzSubscription.unsubscribe();
//   this.countDownSubscription.unsubscribe();
// }


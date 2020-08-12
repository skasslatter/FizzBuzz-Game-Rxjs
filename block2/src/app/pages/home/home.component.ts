import {Component, OnInit} from '@angular/core';
import {first, mapTo, scan, share, switchMap, takeLast} from 'rxjs/operators';
import {fromEvent, interval, merge, Observable, Subscription, zip} from 'rxjs';
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

  isRunning = false;
  isCorrect: boolean = null;
  countDown: number;
  private nrInput$: Observable<Event>;
  private fizzInput$: Observable<Event>;
  private buzzInput$: Observable<Event>;
  private fizzBuzzInput$: Observable<Event>;
  userScore$: Observable<number>;
  numbers$: Observable<number>;
  correctAnswer: 'Fizz' | 'Buzz' | 'FizzBuzz' | 'Number';
  history$: Observable<[]>;

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
    this.startCountDown();

    const timerDuration = 5000;
    return merge(
      this.nrInput$.pipe(mapTo('Number')),
      this.fizzInput$.pipe(mapTo('Fizz')),
      this.buzzInput$.pipe(mapTo('Buzz')),
      this.fizzBuzzInput$.pipe(mapTo('FizzBuzz')),
      interval(timerDuration - 50).pipe(mapTo('None')),
    )
      .pipe<Input>(
        first(null, null)
      );
  }

  startGame(): void {
    this.isRunning = true;
    const fizzBuzz$ = this.fizzBuzzService.get();
    const game$ = zip<[Choice, Input]>(
      fizzBuzz$,
      fizzBuzz$.pipe(switchMap(() =>
        this.getUserInput()
          .pipe(takeLast(1))
      )))
      .pipe(
        share(),
      );
    this.calcScore(game$);
  }

  calcScore(game$): void {
    this.numbers$ = this.fizzBuzzService.getNumbers();


    this.userScore$ = game$.pipe(
      scan((score, [correctAnswer, givenAnswer]) => {
        if (givenAnswer === correctAnswer || (isNumber(correctAnswer) && givenAnswer === 'Number')) {
          score++;
          this.isCorrect = true;
        } else {
          this.isCorrect = false;
        }
        return score;
      }, 0));
    this.getHistory(game$);
  }

  getHistory(game$): void {
    this.history$ = game$.pipe(
      scan((history, [correctAnswer, givenAnswer]) => {
        history.push([correctAnswer, givenAnswer, this.isCorrect]);
        return history;
      }, []));
  }

  stopFizzBuzz(): void {
    this.countDownSubscription.unsubscribe();
    this.history$ = null;
    this.isRunning = false;
    this.userScore$ = null;
    this.isCorrect = null;
  }

  startCountDown(): void {
    if (this.countDownSubscription
    ) {
      this.countDownSubscription.unsubscribe();
    }
    this.countDownSubscription = this.countDownService
      .get()
      .subscribe(response => {
        this.countDown = response;
      });
  }
}

// startGame(): void {
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


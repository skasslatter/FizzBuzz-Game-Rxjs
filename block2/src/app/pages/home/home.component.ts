import {Component, OnInit} from '@angular/core';
import {first, map, mapTo, scan, share, switchMap, takeLast} from 'rxjs/operators';
import {fromEvent, interval, merge, Observable, Subscription, zip} from 'rxjs';
import {CountDownService, FizzBuzzService} from '../../services/';
import {Choice} from '../../models/choice/choice';
import {History} from '../../models/history/history';

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
  countDown: number;
  private nrInput$: Observable<Event>;
  private fizzInput$: Observable<Event>;
  private buzzInput$: Observable<Event>;
  private fizzBuzzInput$: Observable<Event>;
  userScore$: Observable<number>;
  numbers$: Observable<number>;
  history$: Observable<History[]>;
  isCorrect$: Observable<boolean>;

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

  getUserInput(): Observable<Choice> {
    this.startCountDown();
    const timerDuration = 5000;
    return merge(
      this.nrInput$.pipe(mapTo('Number')),
      this.fizzInput$.pipe(mapTo('Fizz')),
      this.buzzInput$.pipe(mapTo('Buzz')),
      this.fizzBuzzInput$.pipe(mapTo('FizzBuzz')),
      interval(timerDuration - 50).pipe(mapTo('None')),
    )
      .pipe<Choice>(
        first(null, null)
      );
  }

  startGame(): void {
    this.isRunning = true;
    const fizzBuzz$ = this.fizzBuzzService.get();
    const game$ = zip<[Choice, Choice]>(
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

  calcScore(game$: Observable<[Choice, Choice]>): void {
    this.numbers$ = this.fizzBuzzService.getNumbers();

    this.isCorrect$ = game$.pipe(map(([correctAnswer, givenAnswer]) => {
      return givenAnswer === correctAnswer || (isNumber(correctAnswer) && givenAnswer === 'Number');
    }));

    this.userScore$ = this.isCorrect$.pipe(
      scan((score, isCorrect) => {
        if (isCorrect) {
          score++;
        }
        return score;
      }, 0));

    this.history$ =
      zip(
        this.numbers$,
        game$,
        this.isCorrect$
      )
        .pipe(map(([num, [correctAnswer, givenAnswer], isCorrect]) => {
          return {num, correctAnswer, givenAnswer, isCorrect} as History;
        }))
        .pipe(scan((acc: History[], historyItem) => {
           acc.push(historyItem);
           return acc;
          }, [])
        );
  }

  stopFizzBuzz(): void {
    this.countDownSubscription.unsubscribe();
    this.history$ = null;
    this.isRunning = false;
    this.userScore$ = null;
    this.isCorrect$ = null;
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

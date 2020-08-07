import {Component, OnInit} from '@angular/core';
import {take} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {CountDownService} from '../../../services/countdown/count-down.service';
import {FizzBuzzService} from '../../../services/fizzbuzz/fizz-buzz.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  counter = 1;
  FizzBuzzSubscription: Subscription;
  countDownSubscription: Subscription;
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
  }

  startCountDown(): void {
    if (this.countDownSubscription) {
      this.countDownSubscription.unsubscribe();
    }
    this.countDownSubscription = this.countDownService
      .get()
      .subscribe(response => {
        console.log(response);
      });
  }

  startFizzBuzz(): void {
    this.isRunning = true;
    this.startCountDown();
    this.FizzBuzzSubscription = this.fizzBuzzService.get()
      .pipe(take(15))
      .subscribe(response => {
        this.startCountDown();
        this.counter++;
        this.currentValue = response;
        this.calcPoints();
        this.resetValues();
      });
  }

  resetValues(): void {
    this.guessedNextValue = '';
  }

  guessNextValue(value: string): void {
    this.isCorrect = null;
    this.guessedNextValue = value;
    this.currentValue = '';
  }

  calcPoints(): void {
    if (this.guessedNextValue === this.currentValue) {
      this.score++;
      this.isCorrect = true;
    } else {
      this.isCorrect = false;
    }
  }

  stopCounter(): void {
    this.resetValues();
    this.isRunning = false;
    this.currentValue = '';
    this.counter = 1;
    this.score = 0;
    this.FizzBuzzSubscription.unsubscribe();
    this.countDownSubscription.unsubscribe();
  }
}

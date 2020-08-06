import {Component, OnInit} from '@angular/core';
import {FizzbuzzService} from '../../../services/fizzbuzz/fizzbuzz.service';
import {take} from 'rxjs/operators';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  counter = 1;
  subscription: Subscription;
  currentValue: string;
  guessedNextValue: string;
  isRunning = false;
  score = 0;
  isCorrect: boolean = null;

  constructor(
    private fizzBuzzService: FizzbuzzService,
  ) {
  }

  ngOnInit(): void {
  }

  getFizzBuzz(): void {
    this.isRunning = true;
    this.subscription = this.fizzBuzzService.get()
      .pipe(take(15))
      .subscribe(response => {
        this.counter++;
        this.currentValue = response;
        this.calcPoints();
        this.guessedNextValue = '';
      });
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
    this.isRunning = false;
    this.guessedNextValue = '';
    this.currentValue = '';
    this.counter = 1;
    this.score = 0;
    this.isCorrect = null;
    this.subscription.unsubscribe();
  }
}

import {Component, OnInit} from '@angular/core';
import {FizzbuzzService} from "../../../services/fizzbuzz/fizzbuzz.service";
import {take} from "rxjs/operators";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  counter = 1;
  subscription: Subscription;
  currentValue: string;
  previousValue: string;
  guessedNextValue: string;
  isRunning = false;

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
        this.previousValue = this.currentValue;
        this.currentValue = response;
        if (this.guessedNextValue === this.currentValue) {
          console.log('hurray');
        }
      });
  }

  stopCounter(): void {
    this.isRunning = false;
    this.currentValue = '';
    this.previousValue = '';
    this.counter = 1;
    this.subscription.unsubscribe();
  }

  guessNext(value: string): void {
    console.log('clicked value', value);
    this.guessedNextValue = value;
  }
}

import { unsupported } from '@angular/compiler/src/render3/view/util';
import { Component, OnDestroy } from '@angular/core';
import { map, buffer, debounceTime, filter, takeUntil, tap, takeWhile } from 'rxjs/operators';
import { interval, Subject } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  StartStopBtnName = 'Start';
  time = 0;

  click$ = new Subject();

  doubleClick$ = this.click$.pipe(
    buffer(this.click$.pipe(debounceTime(500))),
    map((list) => {
      return list.length;
    }),
    filter((x) => x === 2),
    tap(() => {
      this.StartStopBtnName = 'Start';
    })
  );

  start$ = new Subject();

  destroy$ = new Subject();

  timer$ = interval(1000).pipe(
    takeUntil(this.start$),
    takeUntil(this.destroy$),
    takeUntil(this.doubleClick$),
    takeWhile(() => this.StartStopBtnName == 'Stop'),
    tap(() => {
      this.time++;
    })
  );

  start() {
    this.StartStopBtnName === 'Start'
      ? (this.StartStopBtnName = 'Stop')
      : ((this.StartStopBtnName = 'Start'), (this.time = 0));
    this.start$.next(0);
    this.timer$.subscribe(console.log);
  }
  reset() {
    this.time = 0;
  }

  ngOnDestroy() {
    this.destroy$.next(0);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from 'rxjs';
import 'rxjs/add/operator/takeWhile';

export class Options {
  tag: string;
  data: number;
}

export class OptionsResult {
  options: Options[];
  loadID: number;
  error: string;
}

@Injectable()
export class OptionsService {

  private optionsSubject: BehaviorSubject<OptionsResult> = new BehaviorSubject(null);
  options: Observable<OptionsResult> = this.optionsSubject.asObservable();

  counter = 0;

  constructor() { }

  getOptions(loadID: number) {
    setTimeout(() => {
      let ops: Options[] = [];
      for(let i = 0; i<10; i++) {
        ops.push({ tag: "Option " + ++this.counter, data: this.counter });
      }
      this.counter -= 8;
      if(Math.random() < 0.1) {
        this.optionsSubject.next({options: [], loadID: loadID, error: "simulated service fail"});
      }
      else {
        this.optionsSubject.next({ options: ops, loadID: loadID, error: null });
      }
    }, 3000);
  }
}

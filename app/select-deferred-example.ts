import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Options, OptionsService } from './data.service';

@Component({
  selector: 'select-deferred-example',
  templateUrl: 'select-deferred-example.html',
  styleUrls: ['select-deferred-example.css'],
  providers: [OptionsService],
  encapsulation: ViewEncapsulation.None,
})
export class SelectDeferredExample implements OnInit, OnDestroy {
  constructor(private optionService: OptionsService) { }

  @ViewChild('selectControl') selectControl;

  hint = "list of options";

  isAlive = false;
  options: Options[] = [];
  selected = new FormControl(null, [Validators.required]);
  savedValue: number = null;
  isLoading = false;
  isOpen = false;
  loadID = 0;

  ngOnInit() {
    this.isAlive = true;
    this.optionService.options.takeWhile(() => this.isAlive).subscribe(serviceData => {
      if (serviceData && this.isLoading && this.loadID === serviceData.loadID) {
        this.options = serviceData.options === null ? [] : serviceData.options;
        this.isLoading = false;
        if(this.options && this.options.length && this.savedValue !== null && this.options.some(option => option.data == this.savedValue)) {
          this.selected.setValue(this.savedValue);
        }
        if(serviceData.error) {
          this.selected.setValue(this.savedValue);
          this.selected.setErrors({'serviceFail': serviceData.error});
          this.selectControl.close();
        }
      }
    });
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

  getErrorMessage() {
    if(this.selected.hasError('serviceFail')) {
      return this.selected.getError('serviceFail');
    }
    else if(this.selected.hasError('required')) {
      return 'this field is required';
    }
  }

  openChanged(event) {
    this.isOpen = event;
    this.isLoading = event;
    if (event) {
      this.savedValue = this.selected.value;
      this.options = [];
      this.selected.reset();
      this.optionService.getOptions(++this.loadID);
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Payment } from '../payment.model';
import { PaymentService } from '../payment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import {MatDatepicker} from '@angular/material/datepicker';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { Router } from '@angular/router';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YY',
  },
  display: {
    dateInput: 'MM/YY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})

export class CardDetailsComponent implements OnInit {

  paymentForm: FormGroup;
  nonWhitespaceRegExp: RegExp = new RegExp("\\S");
  minDate: Date;

  constructor(
    private paymentService: PaymentService, 
    private _snackBar: MatSnackBar,
    private router: Router
    ) {}

  ngOnInit() {
    this.paymentForm = new FormGroup({
      cardNumber: new FormControl( null, {validators: [Validators.required, Validators.pattern(this.nonWhitespaceRegExp)]}),
      cardName: new FormControl( null, {validators: [Validators.required, Validators.pattern(this.nonWhitespaceRegExp)]}),
      date: new FormControl(moment()),
      cvv: new FormControl(null, {validators: [Validators.required, Validators.pattern(this.nonWhitespaceRegExp)]}),
      amount: new FormControl(null, {validators: [Validators.required, Validators.pattern(this.nonWhitespaceRegExp)]})
    });
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 0, (new Date().getMonth()), 1);
  }

  onPay() {
    let paymentDetails: Payment = {
      cardNumber: this.paymentForm.value.cardNumber,
      cardName: this.paymentForm.value.cardName,
      validThrough: this.paymentForm.value.validThrough,
      cvv: this.paymentForm.value.cvv,
      amount: this.paymentForm.value.amount
    }
    this.paymentService.postDetails(paymentDetails);
    this.openSnackBar('Payment Successfull', 'OK')
    this.router.navigate(['/dashboard']);
  }

  onKeyup(event) {
    if((this.paymentForm.value.validThrough.length == 2 && event.keyCode !== 8) ) {
      let tempvalue = this.paymentForm.value.validThrough;
      tempvalue = tempvalue + '/';
      this.paymentForm.patchValue({
        validThrough: tempvalue
      })
    } else if (this.paymentForm.value.validThrough.length > 2 && this.paymentForm.value.validThrough.substr(2,1) !== '/') {
      let tempvalue;
      let str = this.paymentForm.value.validThrough.substr(0,2)
      tempvalue = str + '/' + this.paymentForm.value.validThrough.substr(2,1)
      this.paymentForm.patchValue({
        validThrough: tempvalue
      })
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: 'my-custom-snackbar'
    });
  }

  // date = new FormControl(moment());

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.paymentForm.value.date;
    ctrlValue.year(normalizedYear.year());
    this.paymentForm.patchValue({
      date: ctrlValue
    });
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.paymentForm.value.date;
    ctrlValue.month(normalizedMonth.month());
    this.paymentForm.patchValue({
      date: ctrlValue
    });
    datepicker.close();
  }
}



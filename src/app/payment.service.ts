import { Injectable } from '@angular/core';
import { Payment } from './payment.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import * as actions from './store/app.actions';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  paymentData: Payment;
  emitPaymentData = new Subject<Payment>()

  constructor(
    private http: HttpClient,
    private store: Store<{App: fromApp.State}>
    ) { }

  postDetails(data: Payment) {
    this.http.post('https://www.dummyurl.com/dummyData', data).subscribe((data: Payment) => {
      this.store.dispatch(new actions.DataReceived(data))
    })
  }
}
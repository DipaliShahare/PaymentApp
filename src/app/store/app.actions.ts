import { Action } from '@ngrx/store';
import { Payment } from '../payment.model';

export const DATA_RECIEVED = '[APP] Data Received';

export class DataReceived implements Action {
  readonly type = DATA_RECIEVED;

  constructor(public payload: Payment) {}
}

export type AppActions = DataReceived;
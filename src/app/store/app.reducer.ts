import { Payment } from '../payment.model';
import { AppActions, DATA_RECIEVED } from './app.actions';

export interface State {
  paymentData: Payment
}
const initialState: State = {
  paymentData: {
    cardName: '',
    cardNumber: '',
    validThrough: new Date(),
    cvv: 0,
    amount: 0
  }
}
export function appReducer(state = initialState, action: AppActions) {
  switch (action.type) {
    case DATA_RECIEVED:
      return {
        paymentData: action.payload
      };
    default:
      return state;
  }
}
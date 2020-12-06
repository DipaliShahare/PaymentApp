export interface Payment{
  cardNumber: string,
  cardName: string,
  validThrough: Date,
  cvv: number,
  amount: number
}
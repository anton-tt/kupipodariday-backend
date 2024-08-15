export class PartialOfferDto {
  id: number;

  createdAt: string;

  updatedAt: string;

  amount: number;

  hidden: boolean;

  constructor(
    id: number,
    createdAt: string,
    updatedAt: string,
    amount: number,
    hidden: boolean,
  ) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.amount = amount;
    this.hidden = hidden;
  }
}

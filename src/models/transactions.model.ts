import { v4 as createUuid } from "uuid";

export enum TransactionType {
  income = "income",
  outcome = "outcome",
}

export class Transaction {
  private _id: string;

  constructor(
    private _title: string,
    private _value: number,
    private _type: TransactionType
  ) {
    this._id = createUuid();
  }

  public get id() {
    return this._id;
  }

  public get title() {
    return this._title;
  }

  public get value() {
    return this._value;
  }

  public get type() {
    return this._type;
  }

  public set title(title: string) {
    this._title = title;
  }

  public set value(value: number) {
    this._value = value;
  }

  public set type(type: TransactionType) {
    this._type = type;
  }

  public toJson() {
    return {
      id: this._id,
      title: this._title,
      value: this._value,
      type: this._type,
    };
  }
}

import { Transaction } from "../models/transactions.model";
import { User } from "../models/user.model";
import { users } from "./users";

export class UserDatabase {
  public list() {
    return [...users];
  }
  public userById(id: string) {
    return users.find((user) => user.id === id);
  }
  public userByCpf(cpf: number) {
    return users.find((user) => user.cpf === cpf);
  }
  public createUser(user: User) {
    users.push(user);
  }
  public getIndex(id: string) {
    return users.findIndex((user) => user.id === id);
  }
  public deleteUser(index: number) {
    return users.splice(index, 1);
  }
}

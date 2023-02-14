import { Request, Response } from "express";
import { UserDatabase } from "../database/users.database";
import { RequestError } from "../errors/request.error";
import { ServerError } from "../errors/server.errors";
import { User } from "../models/user.model";
import { Transaction, TransactionType } from "../models/transactions.model";
import { SucessResponse } from "../util/sucess.response";
import { nextTick } from "process";

export class TransactionController {
  public create(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, value, type } = req.body;

      const database = new UserDatabase();
      const user = database.userById(id);

      if (!user) {
        return RequestError.notFound(res, "User");
      }

      const newTransaction = new Transaction(title, value, type);

      user.transactions.push(newTransaction);

      return res.status(200).send({
        ok: true,
        message: "Transaction successfully created",
        data: newTransaction,
      });
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
  public getTransactionById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { transactionId } = req.params;

      const database = new UserDatabase();
      const user = database.userById(id);

      if (!user) {
        return res.status(404).send({
          ok: false,
          message: "User not found",
        });
      }

      const transactionsOfUser = user.transactions;
      const transaction = transactionsOfUser.find(
        (transaction) => transaction.id === transactionId
      );

      if (!transaction) {
        return res.status(404).send({
          ok: false,
          message: "Transaction not found",
        });
      }

      return res.status(200).send({
        ok: true,
        message: "Transaction obtained",
        data: transaction,
      });
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
  public getTransactions(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, type } = req.query;

      const database = new UserDatabase();
      const user = database.userById(id);

      if (!user) {
        return res.status(404).send({
          ok: false,
          message: "User not found",
        });
      }

      let transactions = user.transactions;

      if (title) {
        transactions = transactions.filter(
          (transaction) => transaction.title === title
        );
      }
      if (type) {
        transactions = transactions.filter(
          (transaction) => transaction.type === type
        );
      }

      const sumIncome = transactions
        .filter((transaction) => transaction.type === TransactionType.income)
        .reduce(
          (previousValue, nextValue) => previousValue + nextValue.value,
          0
        );

      const sumOutcome = transactions
        .filter((transaction) => transaction.type === TransactionType.outcome)
        .reduce(
          (previousValue, nextValue) => previousValue + nextValue.value,
          0
        );

      const total = sumIncome - sumOutcome;

      return res.status(200).send({
        ok: true,
        message: "Transactions obtained",
        data: transactions,
        balance: {
          sumIncome,
          sumOutcome,
          total,
        },
      });
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
  public uptade(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { transactionId } = req.params;
      const { title, value, type } = req.body;

      const database = new UserDatabase();
      const user = database.userById(id);

      if (!user) {
        return res.status(404).send({
          ok: false,
          message: "User not found",
        });
      }

      const transactionsOfUser = user.transactions;
      const transaction = transactionsOfUser.find(
        (transaction) => transaction.id === transactionId
      );

      if (!transaction) {
        return res.status(404).send({
          ok: false,
          message: "Transaction not found",
        });
      }

      if (title) {
        transaction.title = title;
      }
      if (value) {
        transaction.value = value;
      }
      if (type && type in TransactionType) {
        transaction.type = type;
      }

      return res.status(200).send({
        ok: true,
        message: "Transaction successfully uptade",
      });
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
  public delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { transactionId } = req.params;

      const database = new UserDatabase();
      const user = database.userById(id);

      const transactionsOfUser = user!.transactions;
      const transaction = transactionsOfUser.findIndex(
        (transaction) => transaction.id === transactionId
      );

      if (!transaction) {
        return res.status(404).send({
          ok: false,
          message: "Transaction not found",
        });
      }

      transactionsOfUser.splice(transaction, 1);

      return res.status(200).send({
        ok: true,
        message: "Transaction successfully delete",
      });
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}

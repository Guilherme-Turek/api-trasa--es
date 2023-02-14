import { NextFunction, Request, Response, Router } from "express";
import { TransactionController } from "../controller/transaction.controller";
import { UserController } from "../controller/user.controller";
import { CpfIsValid } from "../middleware/cpf-validator.middleware";
import { UserValidatorMiddleware } from "../middleware/user-validator.middleware";
import { UserExistValidator } from "../middleware/users-exist.middleware";

export const userRoutes = () => {
  const app = Router();

  // http://localhost:3333/user
  app.post(
    "/",
    [
      CpfIsValid.cpfValid,
      UserValidatorMiddleware.validateFields,
      CpfIsValid.cpfAlreadyExist,
    ],
    new UserController().createUser
  );

  app.get("/:id", new UserController().getById);

  app.get("/", new UserController().list);

  app.put("/:id", new UserController().uptade);

  app.delete("/:id", new UserController().delete);

  app.post("/:id/transactions", new TransactionController().create);

  app.get(
    "/:id/transactions",
    UserExistValidator.userExist,
    new TransactionController().getTransactions
  );

  app.get(
    "/:id/transactions/:transactionId",
    UserExistValidator.userExist,
    new TransactionController().getTransactionById
  );

  app.put(
    "/:id/transactions/:transactionId",
    UserExistValidator.userExist,
    new TransactionController().uptade
  );

  app.delete(
    "/:id/transactions/:transactionId",
    UserExistValidator.userExist,
    new TransactionController().delete
  );

  return app;
};

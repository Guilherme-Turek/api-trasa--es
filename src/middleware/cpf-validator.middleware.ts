import { NextFunction, Request, Response } from "express";
import { UserDatabase } from "../database/users.database";
import { ServerError } from "../errors/server.errors";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import { RequestError } from "../errors/request.error";

export class CpfIsValid {
  public static cpfValid(req: Request, res: Response, next: NextFunction) {
    try {
      const { cpf } = req.body;

      if (!cpf) {
        return RequestError.fieldNotProvided(res, "CPF");
      }

      const cpfText = cpf.toString().padStart(11, "0");

      let isValid = cpfValidator.isValid(cpfText);

      if (!isValid) {
        return RequestError.fieldInvalid(res, "CPF");
      }

      next();
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
  public static cpfAlreadyExist(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { cpf } = req.body;

      const database = new UserDatabase();
      const user = database.userByCpf(cpf);

      if (user) {
        return res.status(400).send({
          ok: false,
          message: "User already exist",
        });
      }

      next();
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}

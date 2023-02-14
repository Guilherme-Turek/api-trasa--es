import { NextFunction, Request, Response } from "express";
import { RequestError } from "../errors/request.error";
import { ServerError } from "../errors/server.errors";

export class UserValidatorMiddleware {
  public static validateFields(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { name, email, age } = req.body;

      if (!name) {
        return RequestError.fieldNotProvided(res, "Name");
      }
      if (!email) {
        return RequestError.fieldNotProvided(res, "Email");
      }
      if (!age) {
        return RequestError.fieldNotProvided(res, "Age");
      }

      next();
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}

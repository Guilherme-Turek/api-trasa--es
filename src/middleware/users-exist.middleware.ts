import { NextFunction, Request, Response } from "express";
import { UserDatabase } from "../database/users.database";
import { ServerError } from "../errors/server.errors";

export class UserExistValidator {
  public static userExist(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const database = new UserDatabase();
      const user = database.userById(id);

      if (!user) {
        return res.status(404).send({
          ok: false,
          message: "User not found",
        });
      }

      next();
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}

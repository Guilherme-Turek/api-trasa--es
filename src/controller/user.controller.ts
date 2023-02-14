import { Request, Response } from "express";
import { UserDatabase } from "../database/users.database";
import { RequestError } from "../errors/request.error";
import { ServerError } from "../errors/server.errors";
import { User } from "../models/user.model";
import { SucessResponse } from "../util/sucess.response";

export class UserController {
  public createUser(req: Request, res: Response) {
    try {
      const { name, cpf, email, age } = req.body;

      const user = new User(name, cpf, email, age);

      const database = new UserDatabase();
      database.createUser(user);

      return SucessResponse.created(res, "User create with success", user);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
  public getById(req: Request, res: Response) {
    const { id } = req.params;

    const database = new UserDatabase();
    const user = database.userById(id);

    if (!user) {
      return RequestError.notFound(res, "User");
    }

    return res.status(200).send({
      ok: true,
      message: "User successfully obtained",
      data: user.toJson(),
    });
  }
  public list(req: Request, res: Response) {
    try {
      const { name, email, cpf } = req.query;

      const database = new UserDatabase();
      let users = database.list();

      if (!users) {
        return res.status(404).send({
          ok: false,
          message: "Users not found",
        });
      }

      if (name) {
        users = users.filter((user) => user.name === name);
      }
      if (email) {
        users = users.filter((user) => user.email === email);
      }
      if (cpf) {
        users = users.filter((user) => user.cpf === Number(cpf));
      }

      const result = users.map((user) => user.toJson());

      return res.status(200).send({
        ok: true,
        message: "Users successfully obtained",
        data: result,
      });
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
  public uptade(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, cpf, email, age } = req.body;

      const database = new UserDatabase();
      const user = database.userById(id);

      if (!user) {
        return res.status(404).send({
          ok: false,
          message: "User not found",
        });
      }

      if (name) {
        user.name = name;
      }
      if (cpf) {
        user.cpf = cpf;
      }
      if (email) {
        user.email = email;
      }
      if (age) {
        user.age = age;
      }

      return res.status(200).send({
        ok: true,
        message: "User successfully uptade",
      });
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
  public delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const database = new UserDatabase();
      const userIndex = database.getIndex(id);

      if (userIndex < 0) {
        return RequestError.notFound(res, "User");
      }

      database.deleteUser(userIndex);

      return SucessResponse.ok(res, "User was successfully deleted", userIndex);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}

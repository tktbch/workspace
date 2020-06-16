import {NextFunction, Request, Response} from "express";
import {CommonError} from "../errors/common-error";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CommonError) {
      return res.status(err.statusCode).send(err.serializeErrors());
  }
  // console.error(err);
  res.status(400).send({
      errors: [{message: 'Something went wrong'}]
  })
};

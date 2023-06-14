import { NextFunction } from "express";
//@ts-ignore
export default function errorHandler(err, req, res, next) {
  console.log(err);
  res.status(500).send({ errors: [{ message: err.message }] });
}

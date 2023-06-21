import { Request, Response, Router } from "express";
import "express-async-errors";
import validateUser from "../middlewares/validateUser";
import IUserPayload from "../Interfaces/IUserPayload";
import jwt from "jsonwebtoken";
import Order from "../Models/Order";
import { isValidObjectId } from "mongoose";
import BadRequestError from "../Classes/Errors/BadRequestError";
import NotFoundError from "../Classes/Errors/NotFoundError";
import ForbidenError from "../Classes/Errors/ForbidenError";
const orderRoute = Router();
const jwtKey = process.env.JWT || "SomeJwT_keY";
orderRoute.get("/:id", validateUser, async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const orderId = req.params.id;
  if (!isValidObjectId(orderId)) throw new BadRequestError("Invalid Order Id");

  const order = await Order.findById(orderId);
  if (!order) throw new NotFoundError("Order Not Found");
  //@ts-ignore
  const author = jwt.verify(authHeader, jwtKey) as IUserPayload;
  //@ts-ignore
  if (!order.userId.equals(author.id))
    throw new ForbidenError("You don't Own this Order!");
  res.send(order);
});

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
import Product from "../Models/Product";
import validateAdmin from "../middlewares/validateAdmin";
import JWTDecrypter from "../utils/JWTDecrypter";
import IAdmin from "../Interfaces/IAdmin";
const orderRoute = Router();
const jwtKey = process.env.JWT || "SomeJwT_keY";

orderRoute.get("/user", validateUser, async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  //@ts-ignore
  const author = jwt.verify(authHeader, jwtKey) as IUserPayload;
  const order = await Order.find({ userId: author.id }).populate({
    path: "products.productId",
    model: "Product",
    populate: {
      path: "vendorId",
      model: "Vendor",
    },
  });

  if (!order) throw new NotFoundError("Order Not Found");

  //@ts-ignore
  res.send(order);
});
orderRoute.get(
  "/vendor",
  validateAdmin,
  async (req: Request, res: Response) => {
    const admin = JWTDecrypter.decryptUser<IAdmin>(
      req,
      process.env.JWT_ADMIN || ""
    );
    const products = await Product.find({ vendorId: admin.vendorId }).select(
      "id"
    );
    const prIds = products.map((p) => p.id.toString());
    console.log(prIds);
    const orders = await Order.find({
      "products.productId": { $in: [prIds] },
    });
    res.send(orders);
  }
);
orderRoute.get("/:id", validateUser, async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const orderId = req.params.id;
  if (!isValidObjectId(orderId)) throw new BadRequestError("Invalid Order Id");

  const order = await Order.findById(orderId).populate({
    path: "products.productId",
    model: "Product",
    populate: {
      path: "vendorId",
      model: "Vendor",
    },
  });

  if (!order) throw new NotFoundError("Order Not Found");

  //@ts-ignore
  const author = jwt.verify(authHeader, jwtKey) as IUserPayload;
  //@ts-ignore
  if (!order.userId.equals(author.id))
    throw new ForbidenError("You don't Own this Order!");
  res.send(order);
});
orderRoute.post("/new", validateUser, async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  //@ts-ignore
  const author = jwt.verify(authHeader, jwtKey) as IUserPayload;
  const orderProducts: [{ productId: string; qty: number }] = req.body.products;
  const prIds = orderProducts.map((p) => p.productId);
  const products = await Product.find({ _id: { $in: prIds } });
  const orderProductPrice: [{ productId: string; qty: number; price: number }] =
    [];
  if (products.length <= 0) throw new NotFoundError("Products Not Found!");
  let total = 0;
  products.forEach((p, i) => {
    if (orderProducts[i].productId === p.id.toString()) {
      const pr = p.price.find((pr) => {
        if (
          pr.qtyMin <= orderProducts[i].qty &&
          orderProducts[i].qty <= pr.qtyMax
        ) {
          return pr;
        }
      }) || { price: 1 };
      total += pr.price * orderProducts[i].qty;
      orderProductPrice.push({
        productId: p.id,
        qty: orderProducts[i].qty,
        price: pr.price * orderProducts[i].qty,
      });
    }
  });

  const order = Order.build({
    ...req.body,
    products: orderProductPrice,
    userId: author.id,
    total,
  });
  await order.save();
  res.send(order);
});

orderRoute.delete(
  "/delete/:id",
  validateAdmin,
  async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    const orderId = req.params.id;
    if (!isValidObjectId(orderId))
      throw new BadRequestError("Invalid Order Id");

    const order = await Order.findById(orderId);
    if (!order) throw new NotFoundError("Order Not Found");
    //@ts-ignore
    const author = jwt.verify(authHeader, jwtKey) as IUserPayload;
    //@ts-ignore
    if (!order.userId.equals(author.id))
      throw new ForbidenError("You don't Own this Order!");
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    res.send(deletedOrder);
  }
);
// orderRoute.put(
//   "/edit/:id",
//   validateUser,
//   async (req: Request, res: Response) => {
//     const authHeader = req.headers.authorization;
//     //@ts-ignore
//     const author = jwt.verify(authHeader, jwtKey) as IUserPayload;
//     const order = await Order.findByIdAndUpdate({});

//     res.send(order);
//   }
// );
export default orderRoute;

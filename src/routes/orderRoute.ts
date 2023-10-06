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

    const orders = await Order.find({
      "products.vendor": admin.vendorId,
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
  const orderProductPrice: [
    { productId: string; qty: number; price: number; vendor: string }
  ] |[]= [];
  if (products.length <= 0) throw new NotFoundError("Products Not Found!");
  let total = 0;
  orderProducts.forEach((o) => {
    const p = products.find((p) => p._id.toString() === o.productId);
    if(!p) throw new BadRequestError("One of the products doesn't exists")
    const pr = p.price.find((pr) => {
      if (
        pr.qtyMin <= o.qty &&
        o.qty <= pr.qtyMax
      ) {
        return pr;
      }
    }) || p.price[0];
    total += pr.price * o.qty;
    
    orderProductPrice.push({
      productId: p.id,
      qty: o.qty,
      price: pr.price * o.qty,
      vendor: p.vendorId,
    });
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

import { Request, Response, Router } from "express";
import "express-async-errors";
import Product from "../Models/Product";

const productRouter = Router();

productRouter.get("/", async (req: Request, res: Response) => {
  const products = await Product.find();
  res.send(products);
});
productRouter.post("/new", async (req, res) => {});

export default productRouter;

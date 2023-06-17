import { Request, Response, Router } from "express";
import "express-async-errors";
import Product from "../Models/Product";
import { productCreation } from "../Validation/ProductRules";
import Validator from "../utils/Valiadtor";

const productRouter = Router();

productRouter.get("/", async (req: Request, res: Response) => {
  const products = await Product.find();
  res.send(products);
});
productRouter.post(
  "/new",
  [...productCreation],
  async (req: Request, res: Response) => {
    Validator.validate(req);

    const product = Product.build({ ...req.body, vendorId: "a1b1" });
    await product.save();
    res.send(product);
  }
);

export default productRouter;

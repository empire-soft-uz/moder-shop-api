import { Request, Response, Router } from "express";
import "express-async-errors";
import Product from "../Models/Product";
import { productCreation } from "../Validation/ProductRules";
import Validator from "../utils/Valiadtor";
import Vendor from "../Models/Vendor";
import Review from "../Models/Review";
import NotFoundError from "../Classes/Errors/NotFoundError";

const productRouter = Router();

productRouter.get("/", async (req: Request, res: Response) => {
  const products = await Product.find().populate("vendorId", "name");
  res.send(products);
});
productRouter.get("/:id", async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id)
    .populate({
      path: "reviews",
      model: "Review",
    })
    .populate("vendorId");

  if (!product) throw new NotFoundError("Product Not Found");
  res.send(product);
});
productRouter.post(
  "/new",
  [...productCreation],
  async (req: Request, res: Response) => {
    Validator.validate(req);
    //@ts-ignore
    const vendor = await Vendor.findById(req.body.vendorId);
    if (!vendor) throw new NotFoundError(`Vendor with given id not found`);
    const product = Product.build({ ...req.body });
    vendor.products.push(product.id);
    await product.save();
    await vendor.save();
    res.send(product);
  }
);

export default productRouter;

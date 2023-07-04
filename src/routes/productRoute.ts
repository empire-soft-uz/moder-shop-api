import { Request, Response, Router, query } from "express";
import "express-async-errors";
import Product from "../Models/Product";
import { productCreation } from "../Validation/ProductRules";
import Validator from "../utils/Valiadtor";
import Vendor from "../Models/Vendor";
import Review from "../Models/Review";
import NotFoundError from "../Classes/Errors/NotFoundError";
import multer from "multer";
import MediaManager from "../utils/MediaManager";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 50 * 1048576 } });
const productRouter = Router();

productRouter.get("/", async (req: Request, res: Response) => {
  console.log(req.query);
  const { page, limit, name, priceMax, priceMin, subcategory } = req.query;
  let query = {};
  if (name) {
    //@ts-ignore
    query = { ...query, name: { $regex: new RegExp(name, "i") } };
  }
  if (priceMin) {
    query = { ...query, price: { price: { $gte: priceMin } } };
  }
  if (priceMax) {
    query = { ...query, price: { price: { $lte: priceMax } } };
  }
  if (priceMin && priceMax) {
    //@ts-ignore
    query = { ...query, price: { price: { $gte: priceMin, $lte: priceMax } } };
  }
  if (subcategory) {
    query = { ...query, subcategory };
  }
  const products = await Product.find(query)
    //@ts-ignore
    .skip(page * limit)
    //@ts-ignore
    .limit(limit)
    .populate("vendorId", "name");
  const totalCount = await Product.count(query);
  res.send({ page: page || 1, limit, totalCount, products });
});
productRouter.get("/:id", async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id)
    .populate({
      path: "products",
      populate: {
        path: "productId",
        model: "Product",
      },
    })
    .populate("vendorId");

  if (!product) throw new NotFoundError("Product Not Found");
  res.send(product);
});
productRouter.post(
  "/new",
  upload.array("media", 4),
  [...productCreation],
  async (req: Request, res: Response) => {
    Validator.validate(req);

    const { files } = req;
    //@ts-ignore
    const vendor = await Vendor.findById(req.body.vendorId);
    if (!vendor) throw new NotFoundError(`Vendor with given id not found`);
    const product = Product.build({ ...req.body });
    vendor.products.push(product.id);

    if (files) {
      const video = [
        "video/mp4",
        "video/webm",
        "video/x-m4v",
        "video/quicktime",
      ];
      //@ts-ignore
      for (let i = 0; i < files.length; i++) {
        //@ts-ignore
        if (video.find((e) => e === files[i].mimetype)) {
          //@ts-ignore
          product.video = await MediaManager.uploadFile(files[i]);
        }
        //@ts-ignore
        const img = await MediaManager.uploadFile(files[i]);
        //@ts-ignore
        product.media.push(img);
      }
    }
    await product.save();
    await vendor.save();
    res.send(product);
  }
);
productRouter.delete("/delete/:id", async (req: Request, res: Response) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);
  if (!deletedProduct) throw new NotFoundError("Product Not Found");
  await Vendor.findByIdAndUpdate(deletedProduct.vendorId, {
    $pull: { products: req.params.id },
  });
  if (deletedProduct.media && deletedProduct.media.length > 0) {
    deletedProduct.media.forEach(async (i) => {
      await MediaManager.deletefiles(i);
    });
  }
  if (deletedProduct.video) {
    await MediaManager.deletefiles(deletedProduct.video);
  }
  res.send({ deletedProduct });
});
export default productRouter;

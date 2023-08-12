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
import validateAdmin from "../middlewares/validateAdmin";
import PropValue from "../Models/PropValue";
import { populate } from "dotenv";
import JWTDecrypter from "../utils/JWTDecrypter";
import IAdmin from "../Interfaces/IAdmin";

const jwtKey = process.env.JWT_ADMIN || "SomeJwT_keY-ADmIn";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 50 * 1048576 } });
const productRouter = Router();

productRouter.get("/", async (req: Request, res: Response) => {
  console.log(req.query);
  const {
    page,
    limit,
    name,
    priceMax,
    priceMin,
    category,
    subcategory,
    popularProducts,
    props,
  } = req.query;
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
  if (category) {
    query = { ...query, category };
  }
  if (subcategory) {
    query = { ...query, subcategory };
  }
  if (props && Array.isArray(props) && props.length > 0) {
    query = { ...query, props: { $in: props } };
  }
  let sort = {};
  if (popularProducts) {
    sort = { viewCount: -1 };
  }
  const products = await Product.find(query)
    .sort(sort)
    //@ts-ignore
    .skip(page * limit)
    //@ts-ignore
    .limit(limit)
    .populate("vendorId", "name")
    .populate("category", "name id")
    .populate("subcategory", "name id")
    .populate({
      path: "props",
      model: "PropValue",
      populate: { path: "prop", model: "Prop" },
    });
  const totalCount = await Product.count(query);
  res.send({ page: page || 1, limit, totalCount, products });
});
productRouter.get("/:id", async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id)
    .populate({
      path: "reviews",
      model: "Review",
      populate: {
        path: "authorId",
        model: "User",
        select: "id fullName phoneNumber",
      },
    })
    .populate("category", "name id")
    .populate("subcategory", "name id")
    .populate({
      path: "props",
      model: "PropValue",
      populate: { path: "prop", model: "Prop" },
    });
  if (!product) throw new NotFoundError("Product Not Found");
  product.viewCount += 1;
  await product.save();
  res.send(product);
});
productRouter.post(
  "/new",
  validateAdmin,
  upload.array("media", 4),
  [...productCreation],
  async (req: Request, res: Response) => {
    Validator.validate(req);

    const { files } = req;

    const product = Product.build({ ...req.body });
    if (req.body.vendorId) {
      const vendor = await Vendor.findByIdAndUpdate(req.body.vendorId, {
        $push: { products: product.id },
      });
      if (!vendor) throw new NotFoundError(`Vendor with given id not found`);
      await vendor.save();
    }
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
        } else {
          //@ts-ignore
          const img = await MediaManager.uploadFile(files[i]);
          //@ts-ignore
          product.media.push(img);
        }
      }
    }
    const admin = JWTDecrypter.decryptUser<IAdmin>(req, jwtKey);
    product.author = admin.id;
    await product.save();

    res.send(product);
  }
);

productRouter.put(
  "/edit/:id",
  validateAdmin,
  upload.array("media", 4),

  async (req: Request, res: Response) => {
    Validator.validate(req);

    const { files } = req;
    let tempProps = [];
    if (req.body.props && req.body.props.length > 0) {
      tempProps.push(...req.body.props);
    }
    const newData = { ...req.body };
    delete newData.props;
    // console.log(newData, tempProps, req.body);
    // res.send({ newData, tempProps, body: req.body });
    const product = await Product.findByIdAndUpdate(req.params.id, {
      ...newData,
      $push: { props: { $each: tempProps } },
    });

    if (!product) throw new NotFoundError("Product Not Found");
    if (req.body.vendorId) {
      const vendor = await Vendor.findByIdAndUpdate(req.body.vendorId, {
        $push: { products: product.id },
      });
      if (!vendor) throw new NotFoundError(`Vendor with given id not found`);
      await vendor.save();
    }
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

import { Request, Response, Router } from "express";
import "express-async-errors";
import Product from "../Models/Product";
import { productCreation } from "../Validation/ProductRules";
import Validator from "../utils/Valiadtor";
import Vendor from "../Models/Vendor";
import NotFoundError from "../Classes/Errors/NotFoundError";
import multer from "multer";
import MediaManager from "../utils/MediaManager";
import validateAdmin from "../middlewares/validateAdmin";
import JWTDecrypter from "../utils/JWTDecrypter";
import IAdmin from "../Interfaces/IAdmin";
import validateUser from "../middlewares/validateUser";
import IUserPayload from "../Interfaces/IUserPayload";
import Admin from "../Models/Admin";
import ForbidenError from "../Classes/Errors/ForbidenError";
import PropFormater from "../utils/PropFormater";
import IProductMedia from "../Interfaces/Product/IProducMedia";
import VendorProduct from "../Models/VendorProducts";
const jwtKey = process.env.JWT_ADMIN || "SomeJwT_keY-ADmIn";

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 200 * 1024 * 1024 },
});
const productRouter = Router();

productRouter.get("/", async (req: Request, res: Response) => {
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
  const result = await Promise.all([
    Product.find(query)
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
        //populate: { path: "prop", model: "Prop" },
      }),
    Product.count(query),
  ]);
  res.send({
    page: page || 1,
    limit,
    totalCount: result[1],
    products: result[0],
  });
});
productRouter.get(
  "/admin",
  validateAdmin,
  async (req: Request, res: Response) => {
    const admin = JWTDecrypter.decryptUser<IAdmin>(req, jwtKey);
    const { page, limit } = req.query;
    let query = {};
    if (!admin.super) {
      query = { author: admin.id };
    }
    const products = admin.super
      ? await Product.find(query)
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
          })
      : await VendorProduct.find(query)
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
    const totalCount = admin.super
      ? await Product.count(query)
      : await VendorProduct.count(query);
    res.send({ page: page || 1, limit, totalCount, products });
  }
);
productRouter.get(
  "/liked",
  validateUser,
  async (req: Request, res: Response) => {
    const user = JWTDecrypter.decryptUser<IUserPayload>(
      req,
      process.env.JWT || ""
    );
    const query = { likes: { $in: [user.id] } };
    const products = await Promise.all([
      Product.find(query),
      VendorProduct.find(query),
    ]);

    res.send([...products[0], ...products[1]]);
  }
);
productRouter.get(
  "/vendor/:vendorId/:id",
  async (req: Request, res: Response) => {
    const admin = JWTDecrypter.decryptUser<IAdmin>(req, jwtKey);
    const product = await VendorProduct.findById(req.params.id)
      .populate({
        path: "category",
        model: "Category",
        select: "id name",
      })
      .populate({
        path: "reviews",
        model: "Review",
        populate: {
          path: "authorId",
          model: "Admin",
          select: "id fullName phoneNumber",
        },
      })

      .populate("subcategory", "name id")
      .populate("author", "id email")
      .populate({
        path: "props",
        model: "PropValue",
        populate: { path: "prop", model: "Prop" },
      })
      .populate({
        path: "vendorId",
        model: Vendor,
      });
    if (!product) throw new NotFoundError("Product Not Found");
    if (req.query.admin) {
      res.send(product);
      return;
    }
    if (!admin) {
      product.viewCount += 1;
      await product.save();
    }

    const fProps = PropFormater.format(product.props);

    const obj = {
      id: product.id,
      ...product.toObject(),
      props: fProps,

      author: { id: product.author.id, email: product.author.email },
    };
    delete obj._id;
    res.send(obj);
  }
);
productRouter.get("/vendor/:id", async (req: Request, res: Response) => {
  const product = await VendorProduct.findById(req.params.id)
    .populate({
      path: "category",
      model: "Category",
      select: "id name",
    })
    .populate({
      path: "reviews",
      model: "Review",
      populate: {
        path: "authorId",
        model: "Admin",
        select: "id fullName phoneNumber",
      },
    })

    .populate("subcategory", "name id")
    .populate("author", "id email")
    .populate({
      path: "props",
      model: "PropValue",
      populate: { path: "prop", model: "Prop" },
    })
    .populate({
      path: "vendorId",
      model: Vendor,
    });
  if (!product) throw new NotFoundError("Product Not Found");
  if (req.query.admin) {
    res.send(product);
    return;
  }
  product.viewCount += 1;
  await product.save();

  const fProps = PropFormater.format(product.props);

  const obj = {
    id: product.id,
    ...product.toObject(),
    props: fProps,

    author: { id: product.author.id, email: product.author.email },
  };
  delete obj._id;

  res.send(obj);
});
productRouter.get("/:id", async (req: Request, res: Response) => {
  let admin: IAdmin | undefined;
  try {
    admin = JWTDecrypter.decryptUser<IAdmin>(req, jwtKey);
  } catch (error) {
    admin = undefined;
  }
  const product = await Product.findById(req.params.id)
    .populate({
      path: "category",
      model: "Category",
      select: "id name",
    })
    .populate({
      path: "reviews",
      model: "Review",
      populate: {
        path: "authorId",
        model: "Admin",
        select: "id fullName phoneNumber",
      },
    })

    .populate("subcategory", "name id")
    .populate("author", "id email")
    .populate({
      path: "props",
      model: "PropValue",
      populate: { path: "prop", model: "Prop" },
    })
    .populate({
      path: "vendorId",
      model: Vendor,
    });
  if (!product) throw new NotFoundError("Product Not Found");
  if (req.query.admin) {
    res.send(product);
    return;
  }
  if (!admin) {
    product.viewCount += 1;
    await product.save();
  }

  const fProps = PropFormater.format(product.props);

  const obj = {
    id: product.id,
    ...product.toObject(),
    props: fProps,

    author: { id: product.author.id, email: product.author.email },
  };
  delete obj._id;
  res.send(obj);
});
productRouter.put(
  "/like/:id",
  validateUser,
  async (req: Request, res: Response) => {
    const user = JWTDecrypter.decryptUser<IUserPayload>(
      req,
      process.env.JWT || ""
    );

    const [product, vendorProduct] = await Promise.all([
      Product.likeProduct(req.params.id, user.id),
      VendorProduct.likeProduct(req.params.id, user.id),
    ]);
    if (!product && !vendorProduct)
      throw new NotFoundError("Product Not Found");
    res.send(product || vendorProduct);
  }
);
productRouter.post(
  "/new",
  validateAdmin,
  upload.array("media", 10),
  productCreation,

  async (req: Request, res: Response) => {
    Validator.validate(req);

    const { files } = req;

    const { prices } = req.body;

    //@ts-ignore

    let temp: IPrice[] = [];
    Array.isArray(prices) && prices.map((p) => temp.push(JSON.parse(p)));
    let product;
    const admin = JWTDecrypter.decryptUser<IAdmin>(req, jwtKey);
    console.log(admin.vendorId);
    //@ts-ignore
    product = admin.super
      ? Product.build({ ...req.body, price: temp })
      : VendorProduct.build({ ...req.body, price: temp });
    const vendor = await Vendor.findByIdAndUpdate(admin.vendorId, {
      $push: { products: product.id },
    });
    if (!vendor) throw new NotFoundError(`Vendor with given id not found`);
    product.vendorId = vendor.id;
    await vendor.save();

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
    //@ts-ignore
    product.author = admin.id;

    await product.save();

    res.send(product);
  }
);

productRouter.put(
  "/edit/:id",
  validateAdmin,
  upload.array("media", 4),
  [...productCreation],
  async (req: Request, res: Response) => {
    Validator.validate(req);

    const { prices } = req.body;
    const { files } = req;

    const admin = JWTDecrypter.decryptUser<IAdmin>(req, jwtKey);
    const product = admin.super
      ? await Product.findById(req.params.id)
      : await VendorProduct.findById(req.params.id);
    if (!product) throw new NotFoundError("Product Not Found");
    let fns: any[] = [];
    req.body.delFiles && //@ts-ignore
      req.body.delFiles.map((f: IProductMedia) =>
        //@ts-ignore
        fns.push(MediaManager.deletefiles(f))
      );

    let tempProps = [...new Set(req.body.props)];
    const newData = {
      ...req.body,
      video: product.video,
      media: product.media,
      price: [],
    };
    Array.isArray(prices) &&
      prices.map((p) => newData.price.push(JSON.parse(p)));

    delete newData.props;
    //@ts-ignore
    if (files && files.length > 0) {
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
          newData.video = await MediaManager.uploadFile(files[i]);
        }
        //@ts-ignore
        const img = await MediaManager.uploadFile(files[i]);
        //@ts-ignore
        newData.media.push(img);
      }
    }
    if (admin.super) {
      fns = [
        Product.findByIdAndUpdate(
          product.id,
          {
            ...newData,
            props: tempProps,
          },
          { new: true }
        ),
        ...fns,
      ];
    } else {
      fns = [
        VendorProduct.findByIdAndUpdate(
          product.id,
          {
            ...newData,
            props: tempProps,
          },

          { new: true }
        ),
        ...fns,
      ];
    }
    const [newPr] = await Promise.all([...fns]);

    res.send(newPr);
  }
);

productRouter.delete(
  "/delete/:id",
  validateAdmin,
  async (req: Request, res: Response) => {
    const admin = await Admin.findById(
      JWTDecrypter.decryptUser<IAdmin>(req, jwtKey).id
    );

    if (!admin) throw new ForbidenError("Access denied");
    const deletedProduct = admin.super
      ? await Product.findById(req.params.id)
      : await VendorProduct.findById(req.params.id);

    if (!deletedProduct) throw new NotFoundError("Product Not Found");

    if (!admin.super) {
      if (deletedProduct.author.toString() != admin.id)
        throw new ForbidenError("Access denied");
    }

    const fns = [
      deletedProduct.deleteOne(),
      Vendor.findByIdAndUpdate(deletedProduct.vendorId, {
        $pull: { products: req.params.id },
      }),
    ];

    if (deletedProduct.media && deletedProduct.media.length > 0) {
      deletedProduct.media.forEach((i) => {
        //@ts-ignore
        fns.push(MediaManager.deletefiles(i));
      });
    }
    if (deletedProduct.video) {
      //@ts-ignore
      fns.push(MediaManager.deletefiles(deletedProduct.video));
    }
    const [pr] = await Promise.all(fns);

    res.send({ deletedProduct });
  }
);
export default productRouter;

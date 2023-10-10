import { Model, Schema, model, Document } from "mongoose";
import IVendor from "../Interfaces/Vendor/IVendor";
import IPrice from "../Interfaces/Product/IPrice";
import IProductMedia from "../Interfaces/Product/IProducMedia";
import Review from "./Review";
import IProps from "../Interfaces/Product/IProp";
import IReview from "../Interfaces/Review/IReview";
import Subcategory from "./Subcateygory";
import Vendor from "./Vendor";
import Category from "./Category";
import Prop from "./Prop";
import PropValue from "./PropValue";
import Admin from "./Admin";
import NotFoundError from "../Classes/Errors/NotFoundError";
import User from "./User";
import { IPropValue } from "../Interfaces/Product/IPropValue";
interface product {
  vendorId: IVendor["id"];
  name: string;
  description: string;
  author: string;
  category: string;
  subcategoty: string;
  price: Array<IPrice>;
  media: Array<IProductMedia> | undefined;
  props: Array<string>;
  video: IProductMedia | undefined;
  reviews: Array<IReview>;
}
interface ProductDoc extends Document {
  vendorId: IVendor["id"];
  name: string;
  category: string;

  subcategoty: string;
  description: string;
  author: string;
  price: Array<IPrice>;
  media: Array<IProductMedia> | undefined;
  props: Array<IPropValue>;
  likes: Array<string>;
  video: IProductMedia | undefined;
  reviews: Array<IReview>;
  viewCount: number;
}
interface ProductModel extends Model<ProductDoc> {
  build(attrs: product): ProductDoc;
  likeProduct(id: string, userId: string): Promise<ProductDoc>;
}
const priceSchema = new Schema(
  {
    price: Number,
    oldPrice: { type: Number, default: 0 },
    qtyMin: Number,
    qtyMax: Number,
  },
  { id: false, _id: false }
);

const mediaSchema = new Schema(
  {
    name: String,
    fileId: String,
  },
  { id: false, _id: false }
);
const productSchema = new Schema(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: Vendor },
    name: String,
    description: String,
    author: { type: Schema.Types.ObjectId, ref: Admin },
    price: [priceSchema],
    props: [{ type: Schema.Types.ObjectId, ref: PropValue }],
    media: [mediaSchema],
    video: mediaSchema,
    viewCount: { type: Number, default: 0 },
    likes: [{ type: Schema.Types.ObjectId, ref: User,required:true }],
    category: { type: Schema.Types.ObjectId, ref: Category },
    subcategory: { type: Schema.Types.ObjectId, ref: Subcategory },
    reviews: [{ type: Schema.Types.ObjectId, ref: Review }],
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);
productSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: { $in: doc.reviews },
    });
  }
});
productSchema.statics.build = (attrs: product): ProductDoc => {
  return new Product(attrs);
};
productSchema.statics.likeProduct = async (
  id: string,
  userId: string
): Promise<ProductDoc> => {
  const product = await Product.findById(id)
    .populate("vendorId", "name")
    .populate("category", "name id")
    .populate("subcategory", "name id")
    .populate({
      path: "props",
      model: "PropValue",
      populate: { path: "prop", model: "Prop" },
    });
  if (!product) throw new NotFoundError("Product Not Found");
  if (
    product.likes.find((l) => {
      if (l.toString() === userId) {
        return l;
      }
      return false;
    })
  ) {
    //@ts-ignore
    product.likes.pull(userId);
    return product.save();
  }
  product.likes.push(userId);
  return product.save();
};
const Product:ProductModel = model<ProductDoc, ProductModel>("Product", productSchema);
export default Product;

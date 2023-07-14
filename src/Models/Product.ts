import { Model, Schema, model, Document } from "mongoose";
import IVendor from "../Interfaces/Vendor/IVendor";
import IPrice from "../Interfaces/Product/IPrice";
import IProductMedia from "../Interfaces/Product/IProducMedia";
import Review from "./Review";
import IProps from "../Interfaces/Product/IProps";
import IReview from "../Interfaces/Review/IReview";
import Subcategory from "./Subcateygory";
import Vendor from "./Vendor";
import Category from "./Category";
import Prop from "./Prop";
import PropValue from "./PropValue";
interface product {
  vendorId: IVendor["id"];
  name: string;
  description: string;
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
  price: Array<IPrice>;
  media: Array<IProductMedia> | undefined;
  props: Array<string>;
  video: IProductMedia | undefined;
  reviews: Array<IReview>;
  viewCount: number;
}
interface ProductModel extends Model<ProductDoc> {
  build(attrs: product): ProductDoc;
}
const priceSchema = new Schema(
  {
    price: Number,
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
    price: [priceSchema],
    props: [{ type: Schema.Types.ObjectId, ref: PropValue }],
    media: [mediaSchema],
    video: mediaSchema,
    viewCount: { type: Number, default: 0 },
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
const Product = model<ProductDoc, ProductModel>("Product", productSchema);
export default Product;

import { Model, Schema, model, Document } from "mongoose";
import IVendor from "../Interfaces/Vendor/IVendor";
import IPrice from "../Interfaces/Product/IPrice";
import IProductMedia from "../Interfaces/Product/IProducMedia";
import Review from "./Review";
import IProps from "../Interfaces/Product/IProps";
import IReview from "../Interfaces/Review/IReview";
interface product {
  vendorId: IVendor["id"];
  name: string;
  description: string;
  price: Array<IPrice>;
  media: Array<IProductMedia>;
  video: IProductMedia;
  reviews: Array<IReview>;
}
interface ProductDoc extends Document {
  vendorId: IVendor["id"];
  name: string;
  description: string;
  price: Array<IPrice>;
  media: Array<IProductMedia>;
  props: Array<IProps>;
  video: IProductMedia;
  reviews: Array<IReview>;
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
const optionSchema = new Schema(
  {
    label: String,
    value: String,
  },
  { id: false, _id: false }
);
const propSchema = new Schema(
  {
    type: String,
    options: [optionSchema],
    label: String,
  },
  { id: false, _id: false }
);

const productSchema = new Schema(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor" },
    name: String,
    description: String,
    price: [priceSchema],
    props: [propSchema],
    media: [{ url: String }],
    video: { url: String },
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

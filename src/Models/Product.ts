import { Model, Schema, model } from "mongoose";
import IVendor from "../Interfaces/Vendor/IVendor";
import IPrice from "../Interfaces/Product/IPrice";
import IProductMedia from "../Interfaces/Product/IProducMedia";
import ProductMedia from "../Classes/Product/ProductMedia";
interface product {
  vendorId: IVendor["id"];
  name: string;
  description: string;
  price: Array<IPrice>;
  media: Array<IProductMedia>;
  video: IProductMedia;
}
interface ProductDoc extends Document {
  vendorId: IVendor["id"];
  name: string;
  description: string;
  price: Array<IPrice>;
  media: Array<IProductMedia>;
  video: IProductMedia;
}
interface ProductModel extends Model<ProductDoc> {
  build(attrs: product): ProductDoc;
}

const productSchema = new Schema(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor" },
    name: String,
    description: String,
    price: Array<IPrice>,
    media: Array<IProductMedia>,
    video: ProductMedia,
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

productSchema.statics.build = (attrs: product): ProductDoc => {
  return new Product(attrs);
};
const Product = model<ProductDoc, ProductModel>("Product", productSchema);
export default Product;

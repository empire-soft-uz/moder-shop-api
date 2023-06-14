import { Model, Schema, model } from "mongoose";
import IVendorContacts from "../Interfaces/Vendor/IVendorContacts";
import VendorContacts from "../Classes/VendorContacts";
import IVendor from "../Interfaces/Vendor/IVendor";
import IPrice from "../Interfaces/Product/IPrice";
import IProductMedia from "../Interfaces/Product/IProducMedia";
interface product {
  vendorId: IVendor["id"];
  name: string;
  description: string;
  price: Array<IPrice> | IPrice;
  media: Array<IProductMedia>;
  video: IProductMedia;
}
interface ProductDoc extends Document {
  vendorId: IVendor["id"];
  name: string;
  description: string;
  price: Array<IPrice> ;
  media: Array<IProductMedia>;
  video: IProductMedia;
}
interface VendorModel extends Model<ProductDoc> {
  build(attrs: product): ProductDoc;
}
type vendorContacts = { phoneNumber: Number };
const productSchema = new Schema(
  {
    vendorId: {type:Schema.Types.ObjectId, ref:"Vendor"}
  name: String
  description: String
  price: Array<IPrice> | IPrice;
  media: Array<IProductMedia>;
  video: IProductMedia;
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

vendorSchema.statics.build = (attrs: vendor): VendorDoc => {
  return new Vendor(attrs);
};
const Vendor = model<VendorDoc, VendorModel>("Admin", vendorSchema);
export default Vendor;

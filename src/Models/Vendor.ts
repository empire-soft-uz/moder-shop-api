import { Model, Schema, model, Document } from "mongoose";
import IVendorContacts from "../Interfaces/Vendor/IVendorContacts";
import VendorContacts from "../Classes/VendorContacts";
import IProductMedia from "../Interfaces/Product/IProducMedia";
interface vendor {
  name: string;
  description: string;
  contacts: IVendorContacts;
  products?: string[];
  baner?: IProductMedia;
}
interface VendorDoc extends Document {
  name: string;
  description: string;
  contacts: IVendorContacts;
  products: string[];
  baner: IProductMedia;
}
interface VendorModel extends Model<VendorDoc> {
  build(attrs: vendor): VendorDoc;
}
const mediaSchema = new Schema(
  {
    name: String,
    fileId: String,
  },
  { id: false, _id: false }
);
const vendorSchema = new Schema(
  {
    name: String,
    description: String,
    contacts: {
      phoneNumber: Number,
    },
    baner: mediaSchema,
    products: [{ type: Schema.Types.ObjectId, ref: "VendorProduct" }],
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
const Vendor = model<VendorDoc, VendorModel>("Vendor", vendorSchema);
export default Vendor;

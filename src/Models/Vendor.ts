import { Model, Schema, model } from "mongoose";
import IVendorContacts from "../Interfaces/IVendorContacts";
import VendorContacts from "../Classes/VendorContacts";
interface vendor {
  name: string;
  description: string;
  contacts: IVendorContacts;
  products: string[];
}
interface VendorDoc extends Document {
  name: string;
  description: string;
  contacts: IVendorContacts;
  products: string[];
}
interface VendorModel extends Model<VendorDoc> {
  build(attrs: vendor): VendorDoc;
}

const vendorSchema = new Schema(
  {
    name: String,
    description: String,
    contacts: VendorContacts,
    products: [],
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

import { Model, Document } from "mongoose";
import IVendorContacts from "../Interfaces/Vendor/IVendorContacts";
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
declare const Vendor: VendorModel;
export default Vendor;

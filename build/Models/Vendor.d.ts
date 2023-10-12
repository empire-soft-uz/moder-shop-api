import { Model, Document } from "mongoose";
import IVendorContacts from "../Interfaces/Vendor/IVendorContacts";
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
declare const Vendor: VendorModel;
export default Vendor;

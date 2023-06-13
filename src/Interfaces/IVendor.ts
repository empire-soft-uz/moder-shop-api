import IVendorContacts from "./IVendorContects";

export default interface IVendor {
  id: string;
  name: string;
  description: string;
  contacts: IVendorContacts;
  products: string[];
}

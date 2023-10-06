import IVendorContacts from "./IVendorContacts";

export default interface IVendor {
  id: string;
  name: string;
  description: string;
  contacts: IVendorContacts;
  products: string[];
}

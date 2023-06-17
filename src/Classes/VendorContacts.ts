import IVendorContacts from "../Interfaces/Vendor/IVendorContacts";

export default class VendorContacts implements IVendorContacts {
  constructor(public phoneNumber: Number) {}
}

import IVendorContacts from "../Interfaces/IVendorContects";

export default class VendorContacts implements IVendorContacts {
  constructor(public phoneNumber: Number) {}
}

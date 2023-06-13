import IVendorContacts from "../Interfaces/IVendorContacts";

export default class VendorContacts implements IVendorContacts {
  constructor(public phoneNumber: Number) {}
}

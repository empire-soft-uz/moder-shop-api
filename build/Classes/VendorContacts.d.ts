import IVendorContacts from "../Interfaces/Vendor/IVendorContacts";
export default class VendorContacts implements IVendorContacts {
    phoneNumber: Number;
    constructor(phoneNumber: Number);
}

import IVendorContacts from "../Interfaces/Vendor/IVendorContacts";

export default abstract class VendorContacts implements IVendorContacts {
  public abstract phoneNumber: Number;
}

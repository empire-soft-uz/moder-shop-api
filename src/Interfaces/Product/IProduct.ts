import IVendor from "../Vendor/IVendor";

export default interface IProduct {
  id: string;
  vendorId: IVendor["id"];
  name: string;
  description: string;
}

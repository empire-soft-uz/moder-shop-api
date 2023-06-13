import IVendor from "../Vendor/IVendor";
import IPrice from "./IPrice";

export default interface IProduct {
  id: string;
  vendorId: IVendor["id"];
  name: string;
  description: string;
  price: Array<IPrice> | IPrice;
  media: Array<string>;
}

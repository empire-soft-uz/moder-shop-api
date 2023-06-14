import IVendor from "../Vendor/IVendor";
import IPrice from "./IPrice";
import IProductMedia from "./IProducMedia";
import IProps from "./IProps";

export default interface IProduct {
  id: string;
  vendorId: IVendor["id"];
  name: string;
  description: string;
  price: Array<IPrice>;
  media: Array<IProductMedia>;
  video: IProductMedia;
  props: Array<IProps>;
}

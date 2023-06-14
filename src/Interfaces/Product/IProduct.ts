import IVendor from "../Vendor/IVendor";
import IPrice from "./IPrice";
import IProductMedia from "./IProducMedia";
import IProps from "./IProps";
import IReview from "../Review/IReview";

export default interface IProduct {
  id: string;
  vendorId: IVendor["id"];
  name: string;
  description: string;
  price: Array<IPrice>;
  media: Array<IProductMedia>;
  video: IProductMedia;
  props: Array<IProps>;
  review: Array<IReview>;
}

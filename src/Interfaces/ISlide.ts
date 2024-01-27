import IProductMedia from "./Product/IProducMedia";

export default interface ISlide {
  image: IProductMedia;
  title: string;
  descriptionn: string;
  productId: string;
  vendorId: string;
}

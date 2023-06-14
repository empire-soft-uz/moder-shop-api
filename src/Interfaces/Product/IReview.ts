import IProductMedia from "./IProducMedia";

export default interface IReview {
  id: string;
  createdDate: Date;
  review: string;
  rating: number;
  images?: Array<IProductMedia>;
}

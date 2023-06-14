import IUser from "../IUser";
import IProductMedia from "./IProducMedia";

export default interface IReview {
  authorId: IUser["id"];
  id: string;
  createdDate: Date;
  review: string;
  rating: number;
  images?: Array<IProductMedia>;
}

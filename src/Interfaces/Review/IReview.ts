import IUser from "../IUser";
import IProductMedia from "../Product/IProducMedia";

export default interface IReview {
  id: string;
  authorId: IUser["id"];
  createdDate: Date;
  review: string;
  rating: number;
  imgs?: Array<IProductMedia>;
}

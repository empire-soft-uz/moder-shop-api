import { Model, Schema, Document } from "mongoose";
import IProductMedia from "../Interfaces/Product/IProducMedia";
interface review {
    authorId: Schema.Types.ObjectId;
    createdDate: Date;
    review: string;
    rating: number;
    imgs?: Array<IProductMedia>;
}
interface ReviewDoc extends Document {
    authorId: Schema.Types.ObjectId;
    createdDate: Date;
    review: string;
    rating: number;
    imgs?: Array<IProductMedia>;
}
interface ReviewModel extends Model<ReviewDoc> {
    build(attrs: review): ReviewDoc;
}
declare const Review: ReviewModel;
export default Review;

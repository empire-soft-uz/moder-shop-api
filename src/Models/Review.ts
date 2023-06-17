import { Model, Schema, model, Document } from "mongoose";
import IProductMedia from "../Interfaces/Product/IProducMedia";
import IUser from "../Interfaces/IUser";
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
const productMediaSchema = new Schema(
  {
    url: String,
  },
  { id: false, _id: false }
);
const reviewSchema = new Schema(
  {
    authorId: { type: Schema.Types.ObjectId, ref: "User" },
    createdDate: Date,
    review: String,
    rating: { type: Number, min: 0, max: 5 },
    imgs: [productMediaSchema],
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

reviewSchema.statics.build = (attrs: review): ReviewDoc => {
  return new Review(attrs);
};
const Review = model<ReviewDoc, ReviewModel>("Review", reviewSchema);
export default Review;

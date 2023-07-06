import { Model, Schema, model, Document } from "mongoose";
import Subcategory from "./Subcateygory";

interface category {
  name: string;
  icon: string;
}
interface CategoryDoc extends Document {
  name: string;
  subcategories: Array<string>;
  icon: string;
}
interface CategoryModel extends Model<CategoryDoc> {
  build(attrs: category): CategoryDoc;
}

const categorySchema = new Schema(
  {
    name: String,
    icon: String,
    subcategories: { type: [Schema.Types.ObjectId], ref: Subcategory },
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

categorySchema.statics.build = (attrs: category): CategoryDoc => {
  return new Category(attrs);
};
const Category = model<CategoryDoc, CategoryModel>("Category", categorySchema);
export default Category;
